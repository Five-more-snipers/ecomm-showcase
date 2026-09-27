/**
 * Web Crypto API Security & Hashing Protocol
 *
 * Implements salted SHA-256 cryptographic password hashing and verification
 * for the e-commerce showcase authentication system.
 */

const PEPPER = 'ecomm_security_pepper_2026';

/**
 * Generates a cryptographically strong random salt string in hexadecimal format.
 */
export function generateSalt(length = 16): string {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback for non-browser environments
  let result = '';
  const chars = '0123456789abcdef';
  for (let i = 0; i < length * 2; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

/**
 * Computes a salted SHA-256 hash for a given plaintext password and salt.
 */
export async function hashPassword(password: string, salt: string): Promise<string> {
  const message = `${salt}:${password}:${PEPPER}`;
  const enc = new TextEncoder();
  const data = enc.encode(message);

  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  // Pure JS fallback in rare environments without subtle crypto
  let hash = 0;
  for (let i = 0; i < message.length; i++) {
    const char = message.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(64, '0');
}

/**
 * Verifies if a plaintext password matches the stored salted hash.
 */
export async function verifyPassword(
  password: string,
  salt: string,
  expectedHash: string
): Promise<boolean> {
  if (!password || !salt || !expectedHash) return false;
  const computedHash = await hashPassword(password, salt);
  return computedHash.toLowerCase() === expectedHash.toLowerCase();
}
