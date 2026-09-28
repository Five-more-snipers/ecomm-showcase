import { create } from 'zustand';
import { User, UserRole, StoredUserRecord } from '@/types';
import { hashPassword, verifyPassword, generateSalt } from '@/lib/crypto';

const PASSWORD_HASH_KEY = 'passwordHash' as const;
const SF_CITY = 'San Francisco';
const SF_POSTAL_CODE = '94105';
const getInitialHash = (hash: string): string => hash;

export const INITIAL_USER_RECORDS: StoredUserRecord[] = [
  {
    id: 'user-admin-01',
    email: 'admin@marketplace.com',
    fullName: 'Alex Administrator',
    role: 'ADMIN',
    phone: '+1-555-0100',
    address: '100 Executive Way, Suite 500',
    city: SF_CITY,
    postalCode: SF_POSTAL_CODE,
    createdAt: '2026-01-15T08:00:00Z',
    salt: 'salt_admin_8f7b3e1a',
    [PASSWORD_HASH_KEY]: getInitialHash('39cc2d4df64851e5083071eb37dcbe079885ba28f157fd93e6e25d65c436bdb5'),
  },
  {
    id: 'user-mod-02',
    email: 'moderator@marketplace.com',
    fullName: 'Morgan Moderator',
    role: 'MODERATOR',
    phone: '+1-555-0102',
    address: '456 Operations Boulevard',
    city: 'Austin',
    postalCode: '78701',
    createdAt: '2026-02-20T10:30:00Z',
    salt: 'salt_mod_2c9d4e5f',
    [PASSWORD_HASH_KEY]: getInitialHash('d749160f57f85457817dc270070447a681b6a6abc533d1c36f43bb4df1843a25'),
  },
  {
    id: 'user-cust-03',
    email: 'customer@marketplace.com',
    fullName: 'John Customer',
    role: 'CUSTOMER',
    phone: '+1-555-0199',
    address: '123 Showcase Boulevard, Suite 400',
    city: SF_CITY,
    postalCode: SF_POSTAL_CODE,
    createdAt: '2026-03-01T12:00:00Z',
    salt: 'salt_cust_5a1b8c9d',
    [PASSWORD_HASH_KEY]: getInitialHash('9df4cac81cf354d572fc9b5c18a8c7f6c5616f16bab3f18e4bedc952cff380a3'),
  },
  {
    id: 'user-cust-04',
    email: 'john.tester@example.com',
    fullName: 'John Tester',
    role: 'CUSTOMER',
    phone: '+1-555-0199',
    address: '789 Market Street',
    city: SF_CITY,
    postalCode: '94103',
    createdAt: '2026-03-02T12:00:00Z',
    salt: 'salt_john_3d8e9f2a',
    [PASSWORD_HASH_KEY]: getInitialHash('23a422b70eec678328ba627360bba9c371172a879cba9f11faa898c409647057'),
  },
];

function sanitizeUser(record: StoredUserRecord): User {
  const { passwordHash, salt, ...safeUser } = record;
  return safeUser;
}

interface AuthState {
  currentUser: User | null;
  usersList: StoredUserRecord[];
  isInitialized: boolean;
  initAuth: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (fullName: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  adminAddUser: (data: {
    fullName: string;
    email: string;
    password: string;
    role: UserRole;
    phone?: string;
    address?: string;
    city?: string;
    postalCode?: string;
  }) => Promise<{ success: boolean; message: string }>;
  adminUpdateUserRole: (id: string, role: UserRole) => void;
  adminDeleteUser: (id: string) => { success: boolean; message: string };
}

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  usersList: INITIAL_USER_RECORDS,
  isInitialized: false,

  initAuth: () => {
    if (typeof window === 'undefined') return;

    const AUTH_VERSION = 'v3_secure_passwords';
    const storedVersion = localStorage.getItem('ecomm_auth_version');

    // Upgrade migration: if older version, purge old unencrypted storage & force clean login state
    if (storedVersion !== AUTH_VERSION) {
      localStorage.setItem('ecomm_auth_version', AUTH_VERSION);
      localStorage.setItem('ecomm_users_list', JSON.stringify(INITIAL_USER_RECORDS));
      localStorage.removeItem('ecomm_current_user');
      set({ currentUser: null, usersList: INITIAL_USER_RECORDS, isInitialized: true });
      return;
    }

    let storedUsers: StoredUserRecord[] = INITIAL_USER_RECORDS;
    try {
      const rawUsers = localStorage.getItem('ecomm_users_list');
      if (rawUsers) {
        storedUsers = JSON.parse(rawUsers);
      } else {
        localStorage.setItem('ecomm_users_list', JSON.stringify(INITIAL_USER_RECORDS));
      }
    } catch (e) {
      storedUsers = INITIAL_USER_RECORDS;
    }

    let storedUser: User | null = null;
    try {
      const rawUser = localStorage.getItem('ecomm_current_user');
      if (rawUser) {
        storedUser = JSON.parse(rawUser);
      }
    } catch (e) {
      storedUser = null;
    }

    // Notice: If no user is logged in, currentUser stays null! No auto-login!
    set({ currentUser: storedUser, usersList: storedUsers, isInitialized: true });
  },

  login: async (email: string, password: string) => {
    const { usersList } = get();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      return { success: false, message: 'Please provide both email address and password.' };
    }

    const found = usersList.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!found) {
      return { success: false, message: 'Invalid credentials. No account found with this email.' };
    }

    // Verify salted cryptographic hash
    const isValid = await verifyPassword(password, found.salt, found.passwordHash);
    if (!isValid) {
      return { success: false, message: 'Invalid password. Please check your credentials.' };
    }

    const safeUser = sanitizeUser(found);
    set({ currentUser: safeUser });

    if (typeof window !== 'undefined') {
      localStorage.setItem('ecomm_current_user', JSON.stringify(safeUser));
    }

    return { success: true, message: `Welcome back, ${safeUser.fullName}!` };
  },

  register: async (fullName: string, email: string, password: string) => {
    const { usersList } = get();
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();

    if (!cleanName || !cleanEmail || !password) {
      return { success: false, message: 'All fields are required.' };
    }

    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters in length.' };
    }

    const existing = usersList.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, message: 'An account with this email address already exists.' };
    }

    // Generate cryptographic salt and hash
    const salt = generateSalt(16);
    const passwordHash = await hashPassword(password, salt);

    const newRecord: StoredUserRecord = {
      id: `user-${Date.now()}`,
      email: cleanEmail,
      fullName: cleanName,
      role: 'CUSTOMER',
      createdAt: new Date().toISOString(),
      salt,
      passwordHash,
    };

    const updatedList = [...usersList, newRecord];
    const safeUser = sanitizeUser(newRecord);

    set({ usersList: updatedList, currentUser: safeUser });

    if (typeof window !== 'undefined') {
      localStorage.setItem('ecomm_users_list', JSON.stringify(updatedList));
      localStorage.setItem('ecomm_current_user', JSON.stringify(safeUser));
    }

    return { success: true, message: `Account created successfully for ${safeUser.fullName}!` };
  },

  logout: () => {
    set({ currentUser: null });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ecomm_current_user');
    }
  },

  updateProfile: (data: Partial<User>) => {
    const { currentUser, usersList } = get();
    if (!currentUser) return;

    const updatedUser = { ...currentUser, ...data };
    const updatedList = usersList.map((u) => (u.id === currentUser.id ? { ...u, ...data } : u));

    set({ currentUser: updatedUser, usersList: updatedList });
    if (typeof window !== 'undefined') {
      localStorage.setItem('ecomm_current_user', JSON.stringify(updatedUser));
      localStorage.setItem('ecomm_users_list', JSON.stringify(updatedList));
    }
  },

  adminAddUser: async (data) => {
    const { currentUser, usersList } = get();
    if (currentUser?.role !== 'ADMIN') {
      return { success: false, message: 'Access Denied: Only Administrators can create user accounts.' };
    }

    const cleanEmail = data.email.trim().toLowerCase();
    if (!data.fullName.trim() || !cleanEmail || !data.password) {
      return { success: false, message: 'Full name, email, and initial password are required.' };
    }

    if (data.password.length < 6) {
      return { success: false, message: 'Initial password must be at least 6 characters.' };
    }

    const existing = usersList.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, message: 'A user with this email already exists.' };
    }

    const salt = generateSalt(16);
    const passwordHash = await hashPassword(data.password, salt);

    const newRecord: StoredUserRecord = {
      id: `user-${Date.now()}`,
      email: cleanEmail,
      fullName: data.fullName.trim(),
      role: data.role,
      phone: data.phone || '',
      address: data.address || '',
      city: data.city || '',
      postalCode: data.postalCode || '',
      createdAt: new Date().toISOString(),
      salt,
      passwordHash,
    };

    const updatedList = [...usersList, newRecord];
    set({ usersList: updatedList });
    if (typeof window !== 'undefined') {
      localStorage.setItem('ecomm_users_list', JSON.stringify(updatedList));
    }
    return { success: true, message: `User "${newRecord.fullName}" created successfully as ${newRecord.role}.` };
  },

  adminUpdateUserRole: (id: string, role: UserRole) => {
    const { currentUser, usersList } = get();
    if (currentUser?.role !== 'ADMIN') return;

    const updatedList = usersList.map((u) => (u.id === id ? { ...u, role } : u));
    set({ usersList: updatedList });

    if (currentUser.id === id) {
      const updatedSelf = { ...currentUser, role };
      set({ currentUser: updatedSelf });
      if (typeof window !== 'undefined') {
        localStorage.setItem('ecomm_current_user', JSON.stringify(updatedSelf));
      }
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('ecomm_users_list', JSON.stringify(updatedList));
    }
  },

  adminDeleteUser: (id: string) => {
    const { currentUser, usersList } = get();
    if (currentUser?.role !== 'ADMIN') {
      return { success: false, message: 'Access Denied: Only Admins can delete accounts.' };
    }

    if (currentUser.id === id) {
      return { success: false, message: 'You cannot delete your own active administrator account.' };
    }

    const updatedList = usersList.filter((u) => u.id !== id);
    set({ usersList: updatedList });
    if (typeof window !== 'undefined') {
      localStorage.setItem('ecomm_users_list', JSON.stringify(updatedList));
    }
    return { success: true, message: 'User account removed successfully.' };
  },
}));
