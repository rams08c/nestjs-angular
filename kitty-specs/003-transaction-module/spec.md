# Feature: Transaction

## Goal
- Enable authenticated users to create, view, update, and delete personal financial transactions
- Support `expense` and `income` transaction types
- `categoryId` represents both expense category and income source — category `type` determines the role
- `transaction.type` must align with the referenced `category.type`
- Scope all transactions to the authenticated user via JWT
- Architecture supports future group-based transactions via optional `groupId`
- Support server-side pagination and filtering on the list endpoint

## API
- `POST /transactions` — Create a new transaction
- `GET /transactions` — List paginated transactions for the authenticated user (supports filters)
- `GET /transactions/:id` — Get a specific transaction by ID
- `PUT /transactions/:id` — Update an existing transaction
- `DELETE /transactions/:id` — Delete a transaction (hard delete)
- All endpoints protected by JWT auth guard

## DTO
**CreateTransactionDto**
- `amount`: number, required, must be > 0
- `type`: `TransactionType` enum, required — `expense` | `income`
- `categoryId`: string (UUID), required
- `description`: string, optional
- `date`: ISO 8601 date string, required

**UpdateTransactionDto** (all fields optional via `PartialType`)
- Same fields as `CreateTransactionDto`, all optional

**QueryTransactionDto** (all fields optional, used as query params on `GET /transactions`)
- `page`: number, min 1, default 1
- `limit`: number, min 1, max 100, default 10
- `search`: string — case-insensitive match against transaction description/note
- `type`: `TransactionType` enum — `expense` | `income`
- `categoryId`: string — filter by specific category
- `dateFrom`: ISO 8601 date string — include transactions on or after this date
- `dateTo`: ISO 8601 date string — include transactions on or before this date

## Response Shape

**PaginatedTransactionResponse** (returned by `GET /transactions`)
```json
{
  "data": [...],
  "total": 42,
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
```

## Rules
- `userId` is extracted from JWT payload, never from request body
- Users may only read, update, or delete their own transactions
- `amount` must be strictly greater than 0 (validated at DTO level)
- `categoryId` must reference an existing category visible to the user (system or owned)
- `transaction.type` must equal `category.type` (INCOME -> income, EXPENSE -> expense); return 400 on mismatch
- `groupId` is optional, reserved for future group transactions
- Return 403 if user attempts to access another user's transaction
- Return 404 if transaction is not found
- `GET /transactions` always returns a paginated envelope; default page size is 10

## DB (Prisma)
**Enum**
- `TransactionType`: `EXPENSE`, `INCOME`

**Model: Transaction**
- `id`: String, UUID, `@default(uuid()) @id`
- `amount`: Decimal
- `type`: `TransactionType`
- `categoryId`: String — FK → `Category.id`
- `description`: String?
- `date`: DateTime
- `userId`: String — FK → `User.id`
- `groupId`: String? — FK → `Group.id` (nullable, reserved for future use)
- `createdAt`: DateTime, `@default(now())`
- `updatedAt`: DateTime, `@updatedAt`
- Relations: `user User`, `category Category`, `group Group?`

## Tasks
- Add `TransactionType` enum to `schema.prisma`
- Add `Transaction` model to `schema.prisma`
- Run Prisma migration: `prisma migrate dev --name add-transactions`
- Scaffold `TransactionsModule`, `TransactionsController`, `TransactionsService`
- Create `CreateTransactionDto` with `class-validator` decorators (`@IsPositive`, `@IsEnum`, `@IsUUID`, `@IsISO8601`)
- Create `UpdateTransactionDto` via `PartialType(CreateTransactionDto)`
- Create `QueryTransactionDto` with optional filter and pagination fields (`@Type(() => Number)` for numeric params)
- Apply `JwtAuthGuard` to all transaction endpoints
- Inject `userId` via `@CurrentUserId()` decorator on all write/read endpoints
- Implement `findAll` scoped to `userId` with pagination (`skip`/`take`) and filters (Prisma `where`)
- Implement `findOne` with ownership check (throw 403 on mismatch)
- Implement `create` linking `userId` from JWT
- Implement `update` with ownership check
- Implement `remove` with ownership check
- Write unit tests for `TransactionsService` covering pagination, filters, and ownership guards
- Write e2e tests for all 5 endpoints
