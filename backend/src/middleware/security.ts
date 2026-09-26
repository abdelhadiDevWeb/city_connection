import { Elysia } from 'elysia';

// Simple in-memory sliding window rate limiter
interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

export function rateLimit(limit = 60, windowMs = 60000) {
  return new Elysia({ name: 'rate-limit' }).onRequest(({ request, set }) => {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const now = Date.now();
    const record = rateLimitStore.get(ip);

    if (!record || now > record.resetAt) {
      rateLimitStore.set(ip, { count: 1, resetAt: now + windowMs });
      return;
    }

    record.count++;
    if (record.count > limit) {
      set.status = 429;
      set.headers['Retry-After'] = Math.ceil((record.resetAt - now) / 1000).toString();
      return {
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests. Please try again later.',
        },
        timestamp: new Date().toISOString(),
      };
    }
  });
}

// Security headers plugin (Helmet equivalent)
export const securityHeaders = new Elysia({ name: 'security-headers' }).onAfterHandle(({ set }) => {
  set.headers['X-Content-Type-Options'] = 'nosniff';
  set.headers['X-Frame-Options'] = 'DENY';
  set.headers['X-XSS-Protection'] = '1; mode=block';
  set.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin';
  set.headers['Strict-Transport-Security'] = 'max-age=63072000; includeSubDomains; preload';
  set.headers['Content-Security-Policy'] =
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;";
});
