# Research: DB Schema

**Feature**: 001-db-schema  
**Date**: 2026-03-22  
**Status**: Complete — all decisions resolved

---

## Decision 1: Primary Key Strategy

**Decision**: Use `cuid()` via Prisma's `@default(cuid())` as the UUID-equivalent for all primary keys.

**Rationale**: Prisma natively supports `cuid()` as a default for `String` PKs, producing URL-safe collision-resistant IDs without additional libraries. UUID v7 is time-ordered but requires an external generator not yet natively supported in Prisma defaults. `cuid()` offers equivalent uniqueness and sortability benefits with zero extra dependencies.

**Alternatives considered**:
- UUID v4 via `@default(uuid())` — supported natively but not time-ordered; rejected in favour of cuid for better index locality.
- UUID v7 via custom generator — future upgrade path; deferred until Prisma native support lands.
- Auto-increment integer — rejected per spec requirement for PostgreSQL-recommended unique ID format.

---

## Decision 2: Monetary Amount Storage

**Decision**: Store `amount` as `Decimal` mapped to `DECIMAL(12, 2)` in PostgreSQL.

**Rationale**: Floating point types (`Float`, `Double`) introduce rounding errors unacceptable for financial data. Prisma's `Decimal` type maps to PostgreSQL `NUMERIC`/`DECIMAL`, providing exact precision. 12 digits total with 2 decimal places supports values up to 9,999,999,999.99, covering all realistic personal/group expense amounts.

**Alternatives considered**:
- Store as integer cents — avoids ORM decimal quirks but complicates display logic and multi-currency support.
- `Float` — rejected due to precision loss in financial calculations.

---

## Decision 3: Report Hybrid Storage Strategy

**Decision**: Store `snapshotData` as `Json` in the Reports model. Generated (derived) reports are produced by querying Transactions at runtime; persisted reports serialize the same aggregate output into `snapshotData` at save time.

**Rationale**: `Json` column avoids creating a rigid nested schema for report output that would need to evolve with each new report type. Prisma supports `Json` natively on PostgreSQL. The `reportType` field discriminates the shape of `snapshotData` for deserialization.

**Alternatives considered**:
- Separate ReportLineItem table — too rigid, harder to extend for new report types.
- Store only derived (no persistence) — rejected per user requirement for hybrid mode.

---

## Decision 4: Group Membership Role Design

**Decision**: Store `role` as an enum `GroupRole { OWNER MEMBER }` on `GroupMember`, with `OWNER` assigned to the group creator automatically.

**Rationale**: Explicit role tracking enables future permission checks (e.g., only OWNER can delete a group, add/remove members) without schema changes.

**Alternatives considered**:
- Boolean `isOwner` flag — less extensible; enum preferred for clarity and future roles (e.g., `ADMIN`).

---

## Decision 5: Category Ownership and Scoping

**Decision**: Categories are user-owned (tied to `ownerUserId`) with a unique constraint on `(ownerUserId, name)`. No global/system categories in v1.

**Rationale**: User-scoped categories keep data boundaries clean and align with the constitution's "all data operations scoped to authenticated userId" rule. Global categories can be introduced later via a nullable `ownerUserId` pattern without breaking the existing constraint.

**Alternatives considered**:
- Global shared categories — increases cross-user data coupling; deferred to future spec.

---

## Decision 6: Currency Handling

**Decision**: Store `currency` as a 3-character `String` (ISO 4217 code, e.g., `"USD"`, `"EUR"`) on `Transaction`. No currency conversion logic in v1.

**Rationale**: Captures multi-currency data for future reporting without enforcing conversion rules at the schema level.

**Alternatives considered**:
- Currency enum — too restrictive; string is flexible and ISO 4217 is the standard.
- Single application currency — rejected as it blocks future international use.

---

## Decision 7: Soft Delete Strategy

**Decision**: No soft delete in v1. Hard deletes only. Cascade rules handle relational integrity.

**Rationale**: Soft delete adds `deletedAt` null-check complexity to every query. The spec does not require audit trails or undo functionality. Can be added later via Prisma middleware.

**Alternatives considered**:
- `deletedAt` nullable timestamp — deferred to future spec when audit requirements are defined.

---

## Resolved Clarifications

| Item | Resolution |
|------|-----------|
| Primary key format | cuid() via Prisma default |
| Amount precision | DECIMAL(12,2) |
| Report storage | Json snapshotData column (hybrid) |
| Group role | GroupRole enum (OWNER/MEMBER) |
| Category scope | User-scoped, unique per user |
| Currency | ISO 4217 3-char string |
| Soft delete | Hard delete only in v1 |
