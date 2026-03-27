# Work Packages: Transaction Module

**Feature**: `003-transaction-module`
**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)
**Branch**: `main`

---

## Subtask Index

| ID   | Description                                              | WP  |
|------|----------------------------------------------------------|-----|
| T001 | Scaffold `TransactionsModule` + register in `AppModule`  | WP01|
| T002 | Create `CreateTransactionDto` with class-validator       | WP01|
| T003 | Create `UpdateTransactionDto` via `PartialType`          | WP01|
| T004 | Add transaction error constants to `app.constant.ts`     | WP01|
| T005 | Implement `create` — set `ownerUserId` from JWT          | WP02|
| T006 | Implement `findAll` — scoped to `ownerUserId`, filters   | WP02|
| T007 | Implement `findOne` — ownership check (403/404)          | WP02|
| T008 | Implement `update` — ownership check before patch        | WP02|
| T009 | Implement `remove` — ownership check, hard delete        | WP02|
| T010 | Implement controller: 5 routes with `@CurrentUserId()`   | WP03|
| T011 | Apply `JwtAuthGuard` to controller; map HTTP status codes| WP03|
| T012 | [P] Unit tests — `TransactionsService`                   | WP04|
| T013 | [P] e2e tests — all 5 endpoints                          | WP04|

---

## WP01: DTOs & Module Setup (Priority: P0)

**Goal**: Project skeleton, DTOs, error constants.
**Independent Test**: Module bootstraps; DTO validation rejects invalid payloads.
**Requirements Refs**: FR-001, FR-002

### Subtasks
- [ ] T001 Scaffold `TransactionsModule` + register in `AppModule`
- [ ] T002 Create `CreateTransactionDto` — `@IsPositive()` amount, `@IsEnum(CategoryType)` type, `@IsNotEmpty()` categoryId + currency, `@IsISO8601()` transactionDate, optional note
- [ ] T003 Create `UpdateTransactionDto` — `PartialType(CreateTransactionDto)`
- [ ] T004 Add `TRANSACTION_NOT_FOUND`, `TRANSACTION_FORBIDDEN` to `app.constant.ts`

### Files
- `server/src/transactions/transactions.module.ts`
- `server/src/transactions/dto/create-transaction.dto.ts`
- `server/src/transactions/dto/update-transaction.dto.ts`
- `server/src/app.constant.ts`

### Dependencies
- None (starting package).

---

## WP02: Service Layer (Priority: P1)

**Goal**: All CRUD operations scoped to `ownerUserId`, with ownership enforcement.
**Independent Test**: Each method returns correct data or throws `ForbiddenException` / `NotFoundException`.
**Requirements Refs**: FR-003, FR-004, FR-005, FR-006, FR-007

### Subtasks
- [ ] T005 `create(userId, dto)` — map dto fields to schema names (`note`, `transactionDate`, `ownerUserId`), call `prisma.transaction.create`
- [ ] T006 `findAll(userId, filters?)` — where `{ ownerUserId: userId }` + optional `groupId`, `categoryId`, date range
- [ ] T007 `findOne(userId, id)` — fetch by id; throw `NotFoundException` if missing, `ForbiddenException` if `ownerUserId !== userId`
- [ ] T008 `update(userId, id, dto)` — call `findOne` first, then `prisma.transaction.update`
- [ ] T009 `remove(userId, id)` — call `findOne` first, then `prisma.transaction.delete`

### Files
- `server/src/transactions/transactions.service.ts`

### Dependencies
- Depends on WP01.

---

## WP03: Controller & Wiring (Priority: P1)

**Goal**: Expose 5 REST endpoints; inject userId from JWT on every route.
**Independent Test**: All endpoints return correct HTTP status codes (201, 200, 204, 403, 404).
**Requirements Refs**: FR-003, FR-004, FR-005, FR-006, FR-007

### Subtasks
- [ ] T010 Implement controller — `@Controller('transactions')`, 5 route handlers, `@CurrentUserId()` on each
- [ ] T011 Apply `@UseGuards(JwtAuthGuard)` at controller level; `DELETE` returns 204, `POST` returns 201

### Files
- `server/src/transactions/transactions.controller.ts`

### HTTP Status Map
| Route              | Success | Error       |
|--------------------|---------|-------------|
| POST /transactions | 201     | 400         |
| GET /transactions  | 200     | 401         |
| GET /:id           | 200     | 403, 404    |
| PUT /:id           | 200     | 403, 404    |
| DELETE /:id        | 204     | 403, 404    |

### Dependencies
- Depends on WP01, WP02.

---

## WP04: Tests (Priority: P2)

**Goal**: Unit + e2e coverage for service and all endpoints.
**Independent Test**: All tests pass; ownership guard tested with mismatched userId.
**Requirements Refs**: FR-003, FR-004, FR-005, FR-006, FR-007

### Subtasks
- [ ] T012 [P] Unit tests for `TransactionsService` — mock PrismaService; cover create, findAll, findOne (200/403/404), update, remove
- [ ] T013 [P] e2e tests — register/login → obtain token → test all 5 endpoints including 403 cross-user attempt

### Files
- `server/src/transactions/transactions.service.spec.ts`
- `server/test/transactions.e2e-spec.ts`

### Dependencies
- Depends on WP01, WP02, WP03.
