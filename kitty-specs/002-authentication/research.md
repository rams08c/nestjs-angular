# Research: Authentication

**Feature**: 002-authentication
**Date**: 2026-03-26
**Status**: Complete

## Decision 1: Password Hashing

Decision: Use bcrypt with per-password salt.
Rationale: Standard secure hashing for password storage in NestJS services.
Alternatives considered: Argon2 (strong option, not selected for minimal scope).

## Decision 2: JWT Payload

Decision: JWT payload includes `userId` only.
Rationale: Meets auth rule and keeps token minimal.
Alternatives considered: Include email/roles (deferred for future authorization scope).

## Decision 3: Public vs Protected Routes

Decision: Only `POST /auth/register` and `POST /auth/login` are public.
Rationale: Matches constitution authentication rules exactly.
Alternatives considered: Additional public profile endpoint (rejected).

## Decision 4: Auth Failure Behavior

Decision: Return Unauthorized for invalid credentials or invalid token.
Rationale: REST-aligned failure handling with clear security boundary.
Alternatives considered: Detailed credential error messages (rejected to avoid info leakage).

## Decision 5: Email Uniqueness Enforcement

Decision: Enforce uniqueness at database level with Prisma `@unique` on `email`.
Rationale: Prevents race-condition duplicates and ensures data integrity.
Alternatives considered: Service-only checks without DB constraint (rejected).
