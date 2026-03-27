# Implementation Plan: Transaction Module

**Branch**: `main` | **Date**: 2026-03-26 | **Spec**: [spec.md](spec.md)
**Feature**: `003-transaction-module`

---

## Summary

CRUD `TransactionsModule` for authenticated users to manage personal financial records. All endpoints are JWT-guarded; `ownerUserId` is always resolved from the token. The Prisma schema already defines the `Transaction` model — no new migration is needed.

---

## Technical Context

- **Runtime**: Node.js 20, NestJS v11.0.6, TypeScript
- **Database**: PostgreSQL + Prisma ORM (schema already migrated)
- **Auth**: JWT Bearer — existing `JwtAuthGuard` + `@CurrentUserId()` decorator
- **Validation**: `class-validator` + `class-transformer` (registered globally)
- **Testing**: Jest (unit), Supertest (e2e)
- **Error constants**: `server/src/app.constant.ts`

### Schema field alignment (spec → schema)

| Spec field    | Prisma field       | Note                              |
|---------------|--------------------|-----------------------------------|
| `userId`      | `ownerUserId`      | Set from JWT; never from body     |
| `type`        | `category.type`    | Derived from linked Category      |
| `description` | `note`             | Optional string                   |
| `date`        | `transactionDate`  | DateTime                          |
| `amount`      | `amount`           | Decimal(12,2)                     |
| *(required)*  | `currency`         | ISO 4217 Char(3), from schema     |

> No `TransactionType` enum needed — `CategoryType` (INCOME/EXPENSE) on the linked `Category` already covers this.

---

## Constitution Check

| Rule                                       | Status |
|--------------------------------------------|--------|
| NestJS v11 feature-module architecture     | ✅     |
| Controllers thin — no business logic       | ✅     |
| Prisma-only data access                    | ✅     |
| JWT auth on all endpoints                  | ✅     |
| DTOs with `class-validator`                | ✅     |
| REST standards + correct HTTP status codes | ✅     |
| Error messages centralised in `app.constant.ts` | ✅ |
| No duplicate specs                         | ✅     |

---

## Project Structure

```
server/src/transactions/
├── transactions.module.ts
├── transactions.controller.ts
├── transactions.service.ts
└── dto/
    ├── create-transaction.dto.ts
    └── update-transaction.dto.ts

server/src/transactions/
└── transactions.service.spec.ts

server/test/
└── transactions.e2e-spec.ts
```

---

## Artifacts

- [research.md](research.md) — Phase 0: decisions and rationale
- [data-model.md](data-model.md) — entity fields and relations
- [contracts/transactions.yaml](contracts/transactions.yaml) — OpenAPI contract
- [quickstart.md](quickstart.md) — local dev setup