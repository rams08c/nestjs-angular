# Research: Transaction Module

## Decision Log

### 1. Schema migration
- **Decision**: No new migration needed
- **Rationale**: `Transaction` model already exists in `schema.prisma` with all required fields (`ownerUserId`, `categoryId`, `groupId?`, `amount Decimal(12,2)`, `currency`, `note`, `transactionDate`)
- **Alternative rejected**: Adding a separate `TransactionType` enum — unnecessary because `CategoryType` (INCOME/EXPENSE) on the linked `Category` already covers this

### 2. Field naming alignment
- **Decision**: Map spec names to schema names in the service layer
- **Rationale**: Schema uses `ownerUserId`, `note`, `transactionDate`; spec used `userId`, `description`, `date` — alignment handled in DTO → service mapping
- **Alternative rejected**: Renaming schema fields — would require a migration and break existing Relations

### 3. Ownership enforcement
- **Decision**: Inline ownership check in service (`findOne` compares `ownerUserId` to JWT userId before returning)
- **Rationale**: Keeps guards simple; no custom Prisma middleware needed
- **Alternative rejected**: Custom `TransactionOwnerGuard` — overkill for a single resource

### 4. `currency` field
- **Decision**: Required in `CreateTransactionDto`, default not assumed
- **Rationale**: Schema defines `currency String @db.Char(3)` as non-nullable — must be supplied by client
- **Alternative rejected**: Defaulting to `USD` — would silently produce wrong data for non-US users

### 5. Soft vs hard delete
- **Decision**: Hard delete (`prisma.transaction.delete`)
- **Rationale**: Spec explicitly states "hard delete"; no audit/restore requirement defined

### 6. Filtering on `GET /transactions`
- **Decision**: Support optional `groupId`, `categoryId`, `from`, `to` query params (aligned with existing contract in `001-db-schema`)
- **Rationale**: Matches the already-defined API contract; adds no schema cost
