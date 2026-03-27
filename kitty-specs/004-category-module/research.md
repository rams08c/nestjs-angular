# Research: Category Module

## Decision 1: Category ownership model
- Decision: Use `ownerUserId = null` for system categories and `ownerUserId = jwtUserId` for user categories.
- Rationale: Clean separation of global vs user-scoped records with simple query predicates.
- Alternatives considered: Separate tables for system/user categories.

## Decision 2: Immutable system categories
- Decision: Block update/delete when `isSystem = true`.
- Rationale: Directly enforces read-only global catalog behavior.
- Alternatives considered: Role-based override.

## Decision 3: List endpoint visibility
- Decision: `GET /categories` returns records where `isSystem = true OR ownerUserId = jwtUserId`.
- Rationale: Meets global system visibility and user ownership in one query.
- Alternatives considered: Two separate endpoints.

## Decision 4: Create endpoint safety
- Decision: Force `isSystem = false` and set `ownerUserId` from JWT in service.
- Rationale: Prevents privilege escalation from request body.
- Alternatives considered: Accept `isSystem` from request and validate role.

## Decision 5: Type representation
- Decision: API uses `expense | income`; Prisma uses enum `EXPENSE | INCOME`.
- Rationale: Keeps client API readable while preserving normalized DB enum.
- Alternatives considered: Store free-text type.
