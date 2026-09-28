import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { connectToDatabase } from '@saas/database';
import { securityHeaders, rateLimit } from './middleware/security';
import { authRoutes } from './routes/auth';
import { superAdminRoutes } from './routes/super-admin';
import { tenantAdminRoutes } from './routes/admin';
import { appRoutes } from './routes/app';

// Cité Connect Residence Management Routes
import { residenceRoutes } from './routes/residences';
import { financeRoutes } from './routes/finances';
import { maintenanceRoutes } from './routes/maintenance';
import { staffRoutes } from './routes/staff';
import { announcementRoutes } from './routes/announcements';
import { dashboardRoutes } from './routes/dashboard';
import { lookupRoutes } from './routes/lookups';
import { residentRoutes } from './routes/resident';

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
    const errorMessage =
      error && typeof error === 'object' && 'message' in error
        ? String((error as { message: unknown }).message)
        : String(error);

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
          title: 'Cité Connect — Residence Management Enterprise API',
          version: '1.0.0',
          description:
            'High-throughput Bun API for AADL, LPA, LPP, and Private Residence Operations across Web and Mobile',
        },
      },
    })
  )
  // Health Check
  .get('/health', () => ({
    status: 'ok',
    platform: 'Cité Connect',
    runtime: 'Bun',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  }))
  // Core Auth & SaaS Routes
  .use(authRoutes)
  .use(superAdminRoutes)
  .use(tenantAdminRoutes)
  .use(appRoutes)
  // Cité Connect Domain Routes
  .use(residenceRoutes)
  .use(financeRoutes)
  .use(maintenanceRoutes)
  .use(staffRoutes)
  .use(announcementRoutes)
  .use(dashboardRoutes)
  .use(lookupRoutes)
  .use(residentRoutes)
  .listen(PORT);

console.log(`🚀 Cité Connect Backend running at http://localhost:${PORT}`);
console.log(`📑 OpenAPI Documentation available at http://localhost:${PORT}/docs`);

export type App = typeof app;
