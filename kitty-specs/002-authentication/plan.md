# Implementation Plan: Authentication

**Branch**: `main` | **Date**: 2026-03-26 | **Spec**: [kitty-specs/002-authentication/spec.md](spec.md)
**Input**: Feature specification from `kitty-specs/002-authentication/spec.md`

## Engineering Alignment

Use the existing backend stack and defaults: NestJS v11.0.6, Prisma ORM, PostgreSQL v18.1, JWT auth, bcrypt password hashing, DTO validation, and guarded routes by default.

## Summary

Implement a minimal auth module with register and login endpoints, unique email enforcement, hashed password storage, JWT issuance with userId payload, and JWT guard enforcement for all non-public endpoints.

## Technical Context

**Language/Version**: TypeScript 5.x with NestJS v11.0.6
**Primary Dependencies**: `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`, `bcrypt`, `class-validator`, `class-transformer`, Prisma Client
**Storage**: PostgreSQL v18.1 via Prisma ORM
**Testing**: Jest unit tests and e2e tests
**Target Platform**: Node.js backend service
**Project Type**: Web application backend module
**Performance Goals**: Auth endpoint p95 under 300ms for normal local workload
**Constraints**: Controllers stay thin, service-only business logic, all protected routes require valid Bearer JWT
**Scale/Scope**: Initial auth for application users; supports future user-scoped modules

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Rule | Source | Status | Notes |
|------|--------|--------|-------|
| NestJS v11.0.6 required | Backend Rules | PASS | Locked in plan and implementation scope |
| Feature-based modules | Backend Rules | PASS | `auth` module isolated under backend source |
| Thin controllers only | Backend Rules | PASS | Validation and orchestration in service layer |
| DTO validation required | Backend Rules | PASS | Register/Login DTOs with validators |
| Prisma only for data access | Backend Rules | PASS | No direct SQL |
| JWT required by default | Authentication Rules | PASS | Global guard strategy with public exceptions |
| Public routes limited | Authentication Rules | PASS | Only `/auth/register` and `/auth/login` are public |
| userId extracted from JWT | Authentication Rules | PASS | Payload includes `userId`; used in downstream modules |
| Data operations user-scoped | Authentication Rules | PASS | User lookup and ownership flow scoped by `userId` |
| PostgreSQL v18.1 + migrations | Database Rules | PASS | Prisma schema + migration workflow |

Post-design re-check: PASS. No constitution conflicts detected.

## Project Structure

### Documentation (this feature)

```
kitty-specs/002-authentication/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── auth.yaml
└── tasks.md
```

### Source Code (repository root)

```
server/
├── prisma/
│   └── schema.prisma
└── src/
    ├── app.module.ts
    ├── auth/
    │   ├── auth.module.ts
    │   ├── auth.controller.ts
    │   ├── auth.service.ts
    │   ├── auth.guard.ts
    │   ├── jwt.strategy.ts
    │   └── dto/
    │       ├── register.dto.ts
    │       └── login.dto.ts
    └── prisma/
        ├── prisma.module.ts
        └── prisma.service.ts
```

**Structure Decision**: Web app backend structure under `server/` with feature module separation.

## Phase 0 Output Plan

- Create `kitty-specs/002-authentication/research.md` with decisions for hashing, JWT claims, guard behavior, and endpoint status codes.

## Phase 1 Output Plan

- Create `kitty-specs/002-authentication/data-model.md` with User/Auth entities and validation rules.
- Create `kitty-specs/002-authentication/contracts/auth.yaml` for register/login contracts.
- Create `kitty-specs/002-authentication/quickstart.md` with concise setup and verification steps.
- Agent context update script: NOT RUN (no agent update script found in `.kittify/scripts/`).

## Complexity Tracking

No constitution violations. No complexity override required.