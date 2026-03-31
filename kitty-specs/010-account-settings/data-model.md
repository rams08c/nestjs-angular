# Data Model: Account & Settings

## Backend Entities

### Account

- Table: `accounts`
- Fields: `id`, `ownerUserId`, `name`, `type`, `balance`, `createdAt`, `updatedAt`
- Types: `type = "CASH" | "BANK" | "CARD"`, `balance = decimal(12,2)`
- Relations: `ownerUserId -> users.id`, `transactions -> transactions.accountId`
- Constraints: index on `ownerUserId`, recommended unique on (`ownerUserId`, `name`)

### Settings Persistence Mapping

- Table: `profiles`
- Module name: `Settings`
- Fields: `userId`, `firstName`, `lastName`, `profilePic`, `location`, `address`, `createdAt`, `updatedAt`
- Relations: `userId -> users.id`
- Constraints: unique on `userId`

### Transaction Update

- Table: `transactions`
- New field: `accountId: string`
- New relation: `accountId -> accounts.id`
- Constraint: delete restricted while transactions reference the account

## Backend DTO Shapes

### Account DTO

- Create: `name`, `type`, `balance`
- Update: `name?`, `type?`, `balance?`
- API values: `type = "cash" | "bank" | "card"`

### Settings DTO

- Response: `firstName`, `lastName`, `profilePic`, `location`, `address`
- Update: same fields, all optional

## Frontend State Models

- `AccountFormModel`: `name`, `type`, `balance`
- `AccountViewModel`: `id`, `name`, `type`, `balance`
- `SettingsFormModel`: `firstName`, `lastName`, `profilePic`, `location`, `address`

## Validation Rules

- Account `name` required, trimmed, max 100 chars
- Account `type` must be `cash`, `bank`, or `card`
- Account `balance` must be a valid decimal
- Settings fields trimmed before persistence
- `profilePic` must be URL or stored asset path when present
- Transaction `accountId` required on create and update

## State Transitions

### Account

- Create -> Active
- Update -> Active
- Delete -> Removed only when no referencing transactions exist
- List -> User-scoped collection

### Settings

- First read -> Existing profile or empty mapped response
- Update -> Persisted profile state
- Read -> User-scoped single record