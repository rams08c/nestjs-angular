# Quickstart: Authentication

**Feature**: 002-authentication
**Date**: 2026-03-26

## Prerequisites

- Node.js 20 LTS
- PostgreSQL v18.1
- Existing NestJS backend in `server/`

## 1. Install Auth Dependencies

```bash
cd server
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt class-validator class-transformer
npm install -D @types/passport-jwt @types/bcrypt
```

## 2. Update Prisma Schema

- Add `passwordHash` to `User` model if missing.
- Keep `email` unique.

## 3. Run Migration

```bash
cd server
npx prisma migrate dev --name add-auth-fields-to-user
npx prisma generate
```

## 4. Implement Auth Module

- Create `auth` module with controller, service, DTOs, JWT strategy, and guard.
- Keep only `/auth/register` and `/auth/login` public.
- Protect all other routes with JWT guard.

## 5. Verify Register and Login

```bash
# Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Demo User","email":"demo@example.com","password":"StrongPass123"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"StrongPass123"}'
```

## 6. Verify Protected Route Access

```bash
curl http://localhost:3000/some-protected-route \
  -H "Authorization: Bearer <token-from-login>"
```

## Verification Checklist

- Register creates user with hashed password
- Duplicate email registration is rejected
- Login returns JWT token with `userId` payload
- Protected routes reject missing or invalid token
