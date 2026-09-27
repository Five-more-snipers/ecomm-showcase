'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  UserPlus,
  Shield,
  ShieldAlert,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Search,
  UserCheck,
  Mail,
  Lock,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { UserRole } from '@/types';

export default function AdminUsersPage() {
  const {
    currentUser,
    usersList,
    adminAddUser,
    adminUpdateUserRole,
    adminDeleteUser,
    logout,
  } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'ALL' | UserRole>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  // Form states
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('CUSTOMER');
  const [newPhone, setNewPhone] = useState('');
  const [newCity, setNewCity] = useState('');
  const [formFeedback, setFormFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [actionFeedback, setActionFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // 1. Guard check: Only ADMIN can access User Management
  if (currentUser?.role !== 'ADMIN') {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <div className="bg-white border-l-4 border-[#d63638] shadow-sm p-6 rounded-r">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-[#d63638] flex-shrink-0">
              <ShieldAlert size={22} />
            </div>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-[#1d2327] mb-1">
                Sorry, you are not allowed to access this page.
              </h1>
              <p className="text-xs text-[#50575e] leading-relaxed mb-4">
                User and Role Management is restricted to users with the <strong className="text-black font-semibold">Administrator</strong> role.
                Store Moderators have full control over products, inventory, and orders, but cannot view or alter user credentials or roles.
              </p>

              <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center gap-3">
                <Link
                  href="/login"
                  onClick={() => logout()}
                  className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold px-4 py-2 rounded flex items-center gap-1.5 transition shadow-sm"
                >
                  <Lock size={13} />
                  <span>Sign Out &amp; Sign In as Administrator</span>
                </Link>
                <Link
                  href="/admin"
                  className="border border-[#c3c4c7] hover:bg-gray-100 text-[#2c3338] text-xs font-semibold px-3 py-2 rounded flex items-center gap-1 transition"
                >
                  <ArrowLeft size={13} />
                  <span>Back to WP Dashboard</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filter users based on tab and search
  const filteredUsers = usersList.filter((user) => {
    const matchesTab = activeTab === 'ALL' || user.role === activeTab;
    const matchesSearch =
      !searchQuery.trim() ||
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.city?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const countAll = usersList.length;
  const countAdmin = usersList.filter((u) => u.role === 'ADMIN').length;
  const countMod = usersList.filter((u) => u.role === 'MODERATOR').length;
  const countCust = usersList.filter((u) => u.role === 'CUSTOMER').length;

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormFeedback(null);

    const res = await adminAddUser({
      fullName: newFullName,
      email: newEmail,
      password: newPassword,
      role: newRole,
      phone: newPhone,
      city: newCity,
    });

    setFormFeedback(res);
    if (res.success) {
      setNewFullName('');
      setNewEmail('');
      setNewPassword('');
      setNewPhone('');
      setNewCity('');
      setTimeout(() => {
        setIsAddUserOpen(false);
        setFormFeedback(null);
      }, 1500);
    }
  };

  const handleDeleteUser = (user: typeof usersList[0]) => {
    if (confirm(`Are you sure you want to permanently delete user "${user.fullName}" (${user.email})?`)) {
      const res = adminDeleteUser(user.id);
      setActionFeedback(res);
      setTimeout(() => setActionFeedback(null), 3000);
    }
  };

  const handleRoleChange = (userId: string, targetRole: UserRole) => {
    adminUpdateUserRole(userId, targetRole);
    setActionFeedback({
      success: true,
      message: `User role updated to ${targetRole}.`,
    });
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const getRoleBadgeClasses = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
      case 'MODERATOR':
        return 'bg-blue-100 text-blue-900 border-blue-300 font-bold';
      default:
        return 'bg-emerald-100 text-emerald-900 border-emerald-300 font-medium';
    }
  };

  return (
    <div className="space-y-4">
      {/* WordPress Title and Add New button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-normal text-[#1d2327]">Users</h1>
          <button
            onClick={() => setIsAddUserOpen(!isAddUserOpen)}
            className="border border-[#2271b1] text-[#2271b1] hover:bg-[#2271b1] hover:text-white font-medium text-xs px-2.5 py-1 rounded transition flex items-center gap-1"
          >
            <UserPlus size={13} />
            <span>{isAddUserOpen ? 'Cancel' : 'Add New User'}</span>
          </button>
        </div>

        {/* Search box */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-[#8c8f94] rounded text-xs px-3 py-1.5 w-60 outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] bg-white text-gray-900"
            />
            <Search size={14} className="absolute right-2.5 top-2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Global Feedback Banner */}
      {actionFeedback && (
        <div
          className={`border-l-4 p-3 rounded text-xs flex items-center justify-between shadow-sm animate-in fade-in duration-150 ${
            actionFeedback.success
              ? 'bg-[#f0f6fc] border-[#00a32a] text-[#1d2327]'
              : 'bg-[#fcf0f1] border-[#d63638] text-[#d63638]'
          }`}
        >
          <div className="flex items-center gap-2">
            {actionFeedback.success ? (
              <CheckCircle size={16} className="text-[#00a32a]" />
            ) : (
              <AlertTriangle size={16} className="text-[#d63638]" />
            )}
            <span className="font-medium">{actionFeedback.message}</span>
          </div>
        </div>
      )}

      {/* Expandable "Add New User" WordPress Form Card */}
      {isAddUserOpen && (
        <div className="bg-white border border-[#c3c4c7] shadow-sm rounded p-5 mb-4 animate-in slide-in-from-top-2 duration-150">
          <h2 className="text-sm font-semibold text-[#1d2327] pb-2 border-b border-[#f0f0f1] mb-4 flex items-center gap-2">
            <UserPlus size={16} className="text-[#2271b1]" />
            <span>Add New User Account</span>
          </h2>

          {formFeedback && (
            <div
              className={`mb-4 p-3 rounded text-xs border-l-4 ${
                formFeedback.success
                  ? 'bg-green-50 border-green-600 text-green-900'
                  : 'bg-red-50 border-red-600 text-red-900'
              }`}
            >
              {formFeedback.message}
            </div>
          )}

          <form onSubmit={handleCreateUser} className="space-y-4 max-w-2xl text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#1d2327] font-semibold mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Smith"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  className="w-full border border-[#8c8f94] rounded px-3 py-1.5 outline-none focus:border-[#2271b1]"
                />
              </div>

              <div>
                <label className="block text-[#1d2327] font-semibold mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. jsmith@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full border border-[#8c8f94] rounded px-3 py-1.5 outline-none focus:border-[#2271b1]"
                />
              </div>

              <div>
                <label className="block text-[#1d2327] font-semibold mb-1">
                  Initial Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Min 6 characters (will be salted SHA-256 hashed)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-[#8c8f94] rounded px-3 py-1.5 outline-none focus:border-[#2271b1]"
                />
              </div>

              <div>
                <label className="block text-[#1d2327] font-semibold mb-1">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className="w-full border border-[#8c8f94] rounded px-3 py-1.5 outline-none focus:border-[#2271b1] bg-white cursor-pointer font-medium"
                >
                  <option value="CUSTOMER">Customer (Storefront purchases & profile)</option>
                  <option value="MODERATOR">Moderator (Full Back Office product & order control)</option>
                  <option value="ADMIN">Administrator (Full Back Office + Account Management)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#1d2327] font-semibold mb-1">Phone Number (optional)</label>
                <input
                  type="text"
                  placeholder="+1-555-0199"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full border border-[#8c8f94] rounded px-3 py-1.5 outline-none focus:border-[#2271b1]"
                />
              </div>

              <div>
                <label className="block text-[#1d2327] font-semibold mb-1">City / Region (optional)</label>
                <input
                  type="text"
                  placeholder="Seattle, WA"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="w-full border border-[#8c8f94] rounded px-3 py-1.5 outline-none focus:border-[#2271b1]"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                type="submit"
                className="bg-[#2271b1] hover:bg-[#135e96] text-white font-semibold px-4 py-2 rounded transition"
              >
                Add New User
              </button>
              <button
                type="button"
                onClick={() => setIsAddUserOpen(false)}
                className="border border-[#c3c4c7] hover:bg-gray-100 text-[#2c3338] font-medium px-3 py-2 rounded transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* WordPress subsubsub status filters */}
      <ul className="flex items-center gap-2 text-xs text-[#646970] pt-1">
        <li>
          <button
            onClick={() => setActiveTab('ALL')}
            className={`hover:text-[#2271b1] ${activeTab === 'ALL' ? 'text-[#1d2327] font-bold' : ''}`}
          >
            All <span className="text-[#a7aaad]">({countAll})</span>
          </button>
          <span className="text-[#c3c4c7] ml-2">|</span>
        </li>
        <li>
          <button
            onClick={() => setActiveTab('ADMIN')}
            className={`hover:text-[#2271b1] ${activeTab === 'ADMIN' ? 'text-[#1d2327] font-bold' : ''}`}
          >
            Administrator <span className="text-[#a7aaad]">({countAdmin})</span>
          </button>
          <span className="text-[#c3c4c7] ml-2">|</span>
        </li>
        <li>
          <button
            onClick={() => setActiveTab('MODERATOR')}
            className={`hover:text-[#2271b1] ${activeTab === 'MODERATOR' ? 'text-[#1d2327] font-bold' : ''}`}
          >
            Moderator <span className="text-[#a7aaad]">({countMod})</span>
          </button>
          <span className="text-[#c3c4c7] ml-2">|</span>
        </li>
        <li>
          <button
            onClick={() => setActiveTab('CUSTOMER')}
            className={`hover:text-[#2271b1] ${activeTab === 'CUSTOMER' ? 'text-[#1d2327] font-bold' : ''}`}
          >
            Customer <span className="text-[#a7aaad]">({countCust})</span>
          </button>
        </li>
      </ul>

      {/* WordPress Users List Table */}
      <div className="bg-white border border-[#c3c4c7] shadow-sm rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#c3c4c7] bg-[#f6f7f7] text-[#2c3338] font-semibold select-none">
                <th className="py-2.5 px-3.5 w-12 text-center">Avatar</th>
                <th className="py-2.5 px-3.5">Name</th>
                <th className="py-2.5 px-3.5">Email</th>
                <th className="py-2.5 px-3.5">Role</th>
                <th className="py-2.5 px-3.5 hidden md:table-cell">City / Phone</th>
                <th className="py-2.5 px-3.5 hidden lg:table-cell">Registered</th>
                <th className="py-2.5 px-3.5 text-right w-44">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0f1]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    No users matching criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isCurrentSelf = currentUser.id === user.id;

                  return (
                    <tr key={user.id} className="hover:bg-[#f6f7f7] transition group">
                      {/* Avatar */}
                      <td className="py-3 px-3.5 text-center">
                        <div className="w-8 h-8 rounded-full bg-[#2c3338] text-white font-bold flex items-center justify-center mx-auto text-xs">
                          {user.fullName.charAt(0).toUpperCase()}
                        </div>
                      </td>

                      {/* Name */}
                      <td className="py-3 px-3.5 font-medium text-[#1d2327]">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold">{user.fullName}</span>
                          {isCurrentSelf && (
                            <span className="text-[10px] bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded font-mono">
                              (You)
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-gray-500 font-mono">
                          ID: {user.id.slice(0, 14)}
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3 px-3.5 text-[#2271b1]">
                        <span className="font-medium">{user.email}</span>
                      </td>

                      {/* Role Selector */}
                      <td className="py-3 px-3.5">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                          disabled={isCurrentSelf}
                          className={`text-xs px-2 py-1 rounded border outline-none cursor-pointer ${getRoleBadgeClasses(
                            user.role
                          )} ${isCurrentSelf ? 'opacity-80 cursor-not-allowed' : ''}`}
                          title={isCurrentSelf ? 'You cannot alter your own active role' : 'Change user role'}
                        >
                          <option value="CUSTOMER">Customer</option>
                          <option value="MODERATOR">Moderator</option>
                          <option value="ADMIN">Administrator</option>
                        </select>
                      </td>

                      {/* City / Phone */}
                      <td className="py-3 px-3.5 text-gray-600 hidden md:table-cell">
                        <div>{user.city || '—'}</div>
                        <div className="text-[11px] text-gray-400">{user.phone || 'No phone'}</div>
                      </td>

                      {/* Registered */}
                      <td className="py-3 px-3.5 text-gray-500 hidden lg:table-cell">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleDeleteUser(user)}
                            disabled={isCurrentSelf}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition ${
                              isCurrentSelf
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-[#b32d2e] hover:bg-red-50 hover:text-red-700 font-medium'
                            }`}
                            title={isCurrentSelf ? 'Cannot delete self' : 'Permanently remove account'}
                          >
                            <Trash2 size={13} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer with user summary */}
        <div className="bg-[#f6f7f7] border-t border-[#c3c4c7] px-4 py-2.5 flex items-center justify-between text-xs text-gray-600">
          <div>
            Showing <strong>{filteredUsers.length}</strong> of <strong>{usersList.length}</strong> users
          </div>
          <div className="text-[11px] text-gray-500">
            Role rules: Admins &amp; Moderators share full back-office control; only Admins can create or remove user accounts.
          </div>
        </div>
      </div>
    </div>
  );
}
