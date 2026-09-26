import { SignJWT, jwtVerify } from 'jose';
import type { UserSessionPayload } from '@saas/types';

// Password Hashing via WebCrypto / Bun.password
export async function hashPassword(password: string): Promise<string> {
  // If running in Bun, use native Argon2id
  if (typeof Bun !== 'undefined' && Bun.password) {
    return await Bun.password.hash(password, {
      algorithm: 'argon2id',
      memoryCost: 65536,
      timeCost: 3,
    });
  }

  // Universal WebCrypto PBKDF2 Fallback
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'HMAC', hash: 'SHA-256', length: 256 },
    true,
    ['sign']
  );
  const exported = await crypto.subtle.exportKey('raw', key);
  const hashHex = Array.from(new Uint8Array(exported))
    .map((b: number) => b.toString(16).padStart(2, '0'))
    .join('');
  const saltHex = Array.from(salt)
    .map((b: number) => b.toString(16).padStart(2, '0'))
    .join('');
  return `pbkdf2$${saltHex}$${hashHex}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  if (typeof Bun !== 'undefined' && Bun.password && !storedHash.startsWith('pbkdf2$')) {
    return await Bun.password.verify(password, storedHash);
  }

  if (storedHash.startsWith('pbkdf2$')) {
    const [, saltHex, originalHash] = storedHash.split('$');
    const salt = new Uint8Array(
      saltHex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
    );
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );
    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'HMAC', hash: 'SHA-256', length: 256 },
      true,
      ['sign']
    );
    const exported = await crypto.subtle.exportKey('raw', key);
    const hashHex = Array.from(new Uint8Array(exported))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    return timingSafeEqual(hashHex, originalHash);
  }

  return false;
}

// Constant-time string comparison to prevent timing attacks
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

// Cryptographic Random Token Generator (e.g. for reset tokens, API keys)
export function generateSecureToken(byteLength = 32): string {
  const bytes = crypto.getRandomValues(new Uint8Array(byteLength));
  return Array.from(bytes)
    .map((b: number) => b.toString(16).padStart(2, '0'))
    .join('');
}

// JWT Token Operations
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'super-secret-development-key-change-in-production-min32chars'
);

export async function signAccessToken(payload: UserSessionPayload, expiresIn = '15m'): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
}

export async function verifyAccessToken(token: string): Promise<UserSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as UserSessionPayload;
  } catch {
    return null;
  }
}
