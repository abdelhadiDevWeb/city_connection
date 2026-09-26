# Enterprise Multi-Tier SaaS Ecosystem

A production-grade, zero-trust cloud architecture powered by **Turborepo** and **Bun Workspaces**.

---

## 🏗️ Architecture & Directory Topology

```
SAAS SETUP/
├── super-admin/          # Next.js 15+ Super Administrator portal (Port 3001)
├── backend/              # Bun + Elysia.js Core API service (Port 4000)
├── frontend/             # Next.js 15+ Customer Platform & Org Admin (Port 3000)
│   └── src/app/
│       ├── (auth)/       # Customer login & register
│       ├── admin/        # Scoped Organization / Tenant Admin
│       └── page.tsx      # Main workspace dashboard
├── application/          # React Native Expo Mobile App (iOS / Android)
├── packages/
│   ├── database/         # MongoDB connection, Mongoose schemas & compound indexes
│   ├── types/            # Shared TypeScript DTOs, contracts, and RBAC definitions
│   ├── validation/       # Shared Zod schemas & NoSQL injection sanitizers
│   ├── security/         # Argon2id hashing, Ed25519/JWT, and crypto primitives
│   └── config-typescript/# Strict TSConfig presets
├── turbo.json            # Turborepo task pipeline
└── package.json          # Monorepo root workspace configuration
```

---

## 🛡️ Security Blueprint

1. **Isolated Super Admin Realm**: Complete domain & route decoupling (`/api/v1/auth/super-admin/login`) with mandatory TOTP/Hardware MFA (`RFC 6238`).
2. **Multi-Tenant Logical Partitioning**: MongoDB compound indexes `{ organizationId: 1, ... }` guarantee sub-millisecond lookups and strict boundary isolation.
3. **NoSQL Injection Defense**: Automated parameter sanitization stripping `$` and `.` operators at the gateway.
4. **Token Security Model**: Short-lived access tokens (15m) paired with Argon2id-hashed refresh tokens supporting family rotation and reuse detection.
5. **Security Headers & Rate Limiting**: Helmet security headers (Strict CSP, HSTS, X-Frame-Options: DENY) and Redis/in-memory sliding window rate limiters.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
bun install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Launch Development Services

You can run everything concurrently using Turborepo:
```bash
bun run dev
```

Or run individual apps:

```bash
# Run Bun Backend API (Port 4000)
bun run --filter @saas/backend dev

# Run Super Admin Portal (Port 3001)
bun run --filter @saas/super-admin dev

# Run Frontend Web & Org Admin (Port 3000)
bun run --filter @saas/frontend dev

# Run React Native Mobile App (Expo)
bun run --filter @saas/application start
```

---

## 📑 Service Registry & Ports

| Service | Port | Framework | URL |
| :--- | :--- | :--- | :--- |
| **Frontend Web** | `3000` | Next.js 15 (App Router) | [http://localhost:3000](http://localhost:3000) |
| **Org Admin** | `3000` | Next.js 15 (App Router) | [http://localhost:3000/admin](http://localhost:3000/admin) |
| **Super Admin** | `3001` | Next.js 15 (App Router) | [http://localhost:3001](http://localhost:3001) |
| **Core Backend** | `4000` | Bun + Elysia.js | [http://localhost:4000](http://localhost:4000) |
| **Interactive Docs** | `4000` | OpenAPI / Swagger | [http://localhost:4000/docs](http://localhost:4000/docs) |
| **Mobile App** | `8081` | React Native (Expo SDK 52) | `exp://localhost:8081` |
