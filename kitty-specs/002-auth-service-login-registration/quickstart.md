# Quickstart: Auth Service Login Registration

**Feature**: 002-auth-service-login-registration  
**Date**: 2026-03-22

## Prerequisites

- Backend dependencies installed in `server/`
- PostgreSQL and Prisma schema already configured
- JWT secrets configured in backend environment variables

## 1. Install Auth Dependencies

From `server/`:

```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm install -D @types/bcrypt
```

## 2. Prepare Prisma Auth Fields

Ensure user auth fields exist in `server/prisma/schema.prisma` and migrate:

```bash
npx prisma migrate dev --name add-auth-fields
npx prisma generate
```

## 3. Create Auth Module Structure

```bash
cd src
nest generate module auth
nest generate controller auth --no-spec
nest generate service auth --no-spec
```

Add DTOs and strategy/guard files under `server/src/auth/` per plan.

## 4. Configure JWT

- Access token secret and expiry
- Refresh token secret and expiry
- JwtModule registration in auth module

## 5. Implement Endpoints

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`

## 6. Run Backend

```bash
npm run start:dev
```

## 7. Verify Core Flows

- Register with valid password >= 8 and get token pair
- Login with valid credentials and get token pair
- Refresh with valid refresh token and get new access token
- Protected endpoint rejects missing/invalid Bearer token

## Contract Reference

- `kitty-specs/002-auth-service-login-registration/contracts/auth.yaml`
