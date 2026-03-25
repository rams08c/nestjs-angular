# Implementation Plan: Auth Service Login Registration

**Branch**: `002-auth-service-login-registration` | **Date**: 2026-03-22 | **Spec**: [kitty-specs/002-auth-service-login-registration/spec.md](spec.md)  
**Input**: Feature specification from `kitty-specs/002-auth-service-login-registration/spec.md`

## Summary

Implement the authentication feature for NestJS with register, login, and refresh token flows aligned to constitution rules. The feature includes password minimum length validation (8+), bcrypt password hashing, JWT access token issuance, JWT refresh token issuance, and a dedicated refresh endpoint (`POST /auth/refresh`) confirmed during planning interrogation.

## Technical Context

**Language/Version**: TypeScript 5.x, NestJS v11.0.6  
**Primary Dependencies**: `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`, `bcrypt`, Prisma ORM  
**Storage**: PostgreSQL v18.1 via Prisma  
**Testing**: Jest for unit/integration auth flow checks  
**Target Platform**: Node.js API server (Linux/macOS dev)  
**Project Type**: Web app backend feature module within monorepo (`server/`)  
**Performance Goals**: Auth responses complete under standard API latency for interactive login/register flows  
**Constraints**: JWT required for protected endpoints; only `/auth/register` and `/auth/login` public; refresh endpoint uses valid refresh token only  
**Scale/Scope**: Single auth subsystem for current user model, token-pair based sessions

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Rule | Source | Status | Notes |
|------|--------|--------|-------|
| NestJS v11.0.6 | Backend Rules | ✅ Pass | Planned module implementation in `server/src/auth/` |
| Feature-based modules | Backend Rules | ✅ Pass | Dedicated auth module/service/controller |
| Thin controllers | Backend Rules | ✅ Pass | Validation + business logic in service only |
| DTO validation required | Backend Rules | ✅ Pass | Register/login/refresh DTOs included in contracts and data model |
| Prisma only data access | Backend Rules | ✅ Pass | Credential lookup and create via Prisma service |
| JWT default auth | Authentication Rules | ✅ Pass | Public endpoints only register/login; refresh requires token validation |
| userId from JWT | Authentication Rules | ✅ Pass | Access token payload includes userId claim |
| User-scoped operations | Authentication Rules | ✅ Pass | Auth context output supports scoped downstream queries |
| Consistent API contracts | API Rules | ✅ Pass | OpenAPI contract generated for auth endpoints |

**Post-design re-check**: No violations introduced by Phase 1 artifacts.

## Project Structure

### Documentation (this feature)

```
kitty-specs/002-auth-service-login-registration/
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
├── src/
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── jwt-refresh.guard.ts
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts
│   │   │   └── jwt-refresh.strategy.ts
│   │   └── dto/
│   │       ├── register.dto.ts
│   │       ├── login.dto.ts
│   │       └── refresh-token.dto.ts
│   ├── users/
│   │   └── users.service.ts
│   └── prisma/
│       └── prisma.service.ts
└── prisma/
    └── schema.prisma
```

**Structure Decision**: Backend-focused web app structure with feature module boundaries. Auth logic remains isolated in `server/src/auth/` and uses shared Prisma service.

## Complexity Tracking

No constitution violations requiring justification.