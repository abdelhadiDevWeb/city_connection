import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { connectToDatabase } from '@saas/database';
import { securityHeaders, rateLimit } from './middleware/security';
import { authRoutes } from './routes/auth';
import { superAdminRoutes } from './routes/super-admin';
import { tenantAdminRoutes } from './routes/admin';
import { appRoutes } from './routes/app';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

// Initialize Database connection
try {
  await connectToDatabase();
} catch (error) {
  console.warn('[MongoDB] Running without persistent DB or connecting in background:', error);
}

export const app = new Elysia()
  // Global Error Handler
  .onError(({ code, error, set }) => {
    console.error(`[API Error] [${code}]:`, error);
    const errorMessage = error && typeof error === 'object' && 'message' in error ? String((error as { message: unknown }).message) : String(error);

    if (errorMessage === 'UNAUTHORIZED') {
      set.status = 401;
      return { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } };
    }
    if (errorMessage.startsWith('FORBIDDEN')) {
      set.status = 403;
      return { success: false, error: { code: 'FORBIDDEN', message: errorMessage } };
    }

    set.status = 500;
    return {
      success: false,
      error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' },
    };
  })
  // Security Middlewares
  .use(
    cors({
      origin: [
        'http://localhost:3000', // Frontend Web (Customer & Org Admin)
        'http://localhost:3001', // Super Admin Web
        'http://localhost:8081', // Expo React Native Dev Server
        'exp://127.0.0.1:8081',
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-tenant-id'],
    })
  )
  .use(securityHeaders)
  .use(rateLimit(120, 60000))
  // Swagger Interactive Docs (OpenAPI)
  .use(
    swagger({
      path: '/docs',
      documentation: {
        info: {
          title: 'SaaS Platform Enterprise Core API',
          version: '1.0.0',
          description: 'High-throughput Bun API servicing Super Admin, Multi-Tenant Frontend, and Expo Mobile App',
        },
      },
    })
  )
  // Health Check
  .get('/health', () => ({
    status: 'ok',
    runtime: 'Bun',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  }))
  // API Routes
  .use(authRoutes)
  .use(superAdminRoutes)
  .use(tenantAdminRoutes)
  .use(appRoutes)
  .listen(PORT);

console.log(`🚀 SaaS Backend running at http://localhost:${PORT}`);
console.log(`📑 OpenAPI Documentation available at http://localhost:${PORT}/docs`);

export type App = typeof app;
