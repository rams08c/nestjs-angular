# Implementation Plan: DB Schema

**Branch**: `001-db-schema` | **Date**: 2026-03-22 | **Spec**: [kitty-specs/001-db-schema/spec.md](spec.md)  
**Input**: Feature specification from `kitty-specs/001-db-schema/spec.md`

## Summary

Define and implement the normalized PostgreSQL database schema for the money tracking application using Prisma ORM. The schema covers seven models — Users, Profile, Transactions, Categories, Groups, GroupMembers, Reports — with UUID v7 primary keys, proper relations, uniqueness constraints, and Prisma migration support. This plan also defines REST OpenAPI contracts and a data model for all downstream feature modules.

## Technical Context

**Language/Version**: TypeScript 5.x (NestJS v11.0.6)  
**Primary Dependencies**: Prisma ORM, PostgreSQL v18.1, `@paralleldrive/cuid2` or `uuid` for UUID v7 generation  
**Storage**: PostgreSQL v18.1  
**Testing**: Jest (unit), Prisma integration tests against test database  
**Target Platform**: Linux server (Node.js 20 LTS)  
**Project Type**: Web application (NestJS backend + Angular frontend)  
**Performance Goals**: Standard REST API response targets; schema queries under 100ms for single-user data sets  
**Constraints**: All financial amounts stored as `Decimal` (Prisma `@db.Decimal(12,2)`); no direct SQL; all changes via Prisma migrations  
**Scale/Scope**: Multi-user, up to tens of thousands of transactions per user; group splitting future-ready

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Rule | Source | Status | Notes |
|------|--------|--------|-------|
| NestJS v11.0.6 | Backend Rules | ✅ Pass | Target version confirmed |
| Feature-based modular architecture | Backend Rules | ✅ Pass | Each entity gets its own NestJS module |
| Controllers thin — no business logic | Backend Rules | ✅ Pass | Logic in services only |
| DTOs with validation for all inputs | Backend Rules | ✅ Pass | Create/Update DTOs defined per entity |
| Prisma as only data access layer | Database Rules | ✅ Pass | No raw SQL; all access via PrismaService |
| PostgreSQL v18.1 | Database Rules | ✅ Pass | Confirmed target |
| Migrations for all schema changes | Database Rules | ✅ Pass | `prisma migrate dev` enforced |
| Normalized schema structure | Database Rules | ✅ Pass | Profile separated from User; no denormalization |
| Expense tracking + splitting support | Domain Rules | ✅ Pass | Transaction.groupId + GroupMembers cover both |
| User-scoped data access | Auth Rules | ✅ Pass | All queries filtered by ownerUserId from JWT |
| JWT auth on all endpoints | Auth Rules | ✅ Pass | Public exceptions only: /auth/register, /auth/login |
| REST standards for endpoints | API Rules | ✅ Pass | OpenAPI contracts generated in Phase 1 |

**Post-design re-check**: No new violations introduced in Phase 1 design.

## Project Structure

### Documentation (this feature)

```
kitty-specs/001-db-schema/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output — REST OpenAPI YAML per entity
│   ├── users.yaml
│   ├── profile.yaml
│   ├── transactions.yaml
│   ├── categories.yaml
│   ├── groups.yaml
│   ├── group-members.yaml
│   └── reports.yaml
└── tasks.md             # Phase 2 output — NOT created by this command
```

### Source Code (repository root)

```
server/
├── prisma/
│   └── schema.prisma          # Prisma schema — all 7 models
├── src/
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── dto/
│   │       ├── create-user.dto.ts
│   │       └── update-user.dto.ts
│   ├── profile/
│   │   ├── profile.module.ts
│   │   ├── profile.controller.ts
│   │   ├── profile.service.ts
│   │   └── dto/
│   │       └── update-profile.dto.ts
│   ├── categories/
│   │   ├── categories.module.ts
│   │   ├── categories.controller.ts
│   │   ├── categories.service.ts
│   │   └── dto/
│   │       ├── create-category.dto.ts
│   │       └── update-category.dto.ts
│   ├── transactions/
│   │   ├── transactions.module.ts
│   │   ├── transactions.controller.ts
│   │   ├── transactions.service.ts
│   │   └── dto/
│   │       ├── create-transaction.dto.ts
│   │       └── update-transaction.dto.ts
│   ├── groups/
│   │   ├── groups.module.ts
│   │   ├── groups.controller.ts
│   │   ├── groups.service.ts
│   │   └── dto/
│   │       ├── create-group.dto.ts
│   │       └── update-group.dto.ts
│   ├── group-members/
│   │   ├── group-members.module.ts
│   │   ├── group-members.controller.ts
│   │   ├── group-members.service.ts
│   │   └── dto/
│   │       └── add-member.dto.ts
│   └── reports/
│       ├── reports.module.ts
│       ├── reports.controller.ts
│       ├── reports.service.ts
│       └── dto/
│           ├── create-report.dto.ts
│           └── generate-report.dto.ts
client/
└── src/
    └── app/
        └── (Angular modules added in downstream feature specs)
```

**Structure Decision**: Web application layout (Option 2). Backend under `server/`, frontend under `client/`. Schema source of truth is `server/prisma/schema.prisma`.

## Complexity Tracking

*No constitution violations. No complexity justification required.*