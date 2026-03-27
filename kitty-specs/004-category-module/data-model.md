# Data Model: Category Module

## Entity: Category

- `id`: String, primary key, `@default(cuid())`
- `name`: String, required
- `type`: Enum, `INCOME | EXPENSE`
- `isSystem`: Boolean, default `false`
- `ownerUserId`: String nullable
- `createdAt`: DateTime, default now
- `updatedAt`: DateTime, auto-updated

## Ownership Rules

- System category:
- `isSystem = true`
- `ownerUserId = null`
- User category:
- `isSystem = false`
- `ownerUserId = authenticated userId`

## Relationships

- Category belongs to optional owner user via `ownerUserId -> User.id`
- Categories can be referenced by transactions via `categoryId`

## Constraints

- User-level uniqueness: `@@unique([ownerUserId, name])`
- Suggested read index: `@@index([isSystem])`
- Suggested owner index: `@@index([ownerUserId])`

## Validation Rules

- `name`: non-empty string
- `type`: `expense | income` at API boundary
- `isSystem` input ignored/blocked for user create/update operations
