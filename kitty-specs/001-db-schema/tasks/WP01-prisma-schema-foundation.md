---
work_package_id: WP01
title: Prisma Schema Foundation
lane: "doing"
dependencies: []
base_branch: main
base_commit: c977e9bc7ced964cef242c026b0a2a0c737958f7
created_at: '2026-03-22T10:15:48.452621+00:00'
subtasks:
- T001
- T002
- T003
- T004
- T005
phase: Phase 1 - Foundation
assignee: ''
agent: "codex"
shell_pid: "10194"
review_status: ''
reviewed_by: ''
history:
- timestamp: '2026-03-22T10:00:26Z'
  lane: planned
  agent: system
  shell_pid: ''
  action: Prompt generated via /spec-kitty.tasks
requirement_refs:
- FR-001
- FR-002
- FR-004
- FR-008
- FR-009
- FR-012
- FR-014
---

# Work Package Prompt: WP01 - Prisma Schema Foundation

## Objectives & Success Criteria

- Deliver a complete Prisma schema in `server/prisma/schema.prisma` covering Users, Profile, Transactions, Categories, Groups, GroupMembers, Reports.
- Ensure all required relations, cascade strategies, unique constraints, and enum definitions are implemented.
- Generate the initial migration and Prisma client successfully.

Success criteria:
- `npx prisma migrate dev --name init-db-schema` succeeds.
- Database contains all expected tables with constraints.
- `npx prisma generate` succeeds with no schema errors.

## Context & Constraints

- Source documents: `kitty-specs/001-db-schema/spec.md`, `kitty-specs/001-db-schema/plan.md`, `kitty-specs/001-db-schema/data-model.md`, `kitty-specs/001-db-schema/research.md`.
- Constitution constraints from `.kittify/memory/constitution.md`:
  - Prisma is the only data access layer.
  - PostgreSQL only.
  - Schema must support personal expense tracking and group splitting.
  - User-scoped data consistency is mandatory.
- ID format decision in research is `cuid()` for all PK fields.

## Implementation Command

- `spec-kitty implement WP01`

## Subtasks & Detailed Guidance

### Subtask T001 - Replace Prisma schema with canonical model set
- Purpose: establish the exact domain model required by FR-001.
- Steps:
  1. Open `server/prisma/schema.prisma`.
  2. Define enums: `CategoryType`, `GroupRole`, `ReportType`.
  3. Define models with exact names and mapped table names from data model.
  4. Ensure Profile is optional 1:1 with User.
- Files:
  - `server/prisma/schema.prisma`
- Parallel?: No.
- Notes:
  - Keep model names aligned with service/module naming to reduce downstream mapper complexity.

### Subtask T002 - Implement relations, unique constraints, and delete behaviors
- Purpose: enforce data integrity and expected lifecycle semantics.
- Steps:
  1. Add all relation fields and `@relation(...)` annotations.
  2. Add uniqueness constraints:
     - `User.email @unique`
     - `Profile.userId @unique`
     - `@@unique([ownerUserId, name])` on Category
     - `@@unique([groupId, userId])` on GroupMember
  3. Apply delete actions:
     - Category->Transaction `Restrict`
     - Group->Transaction `SetNull`
     - Group->Report `SetNull`
     - User-owned resources `Cascade` where applicable.
- Files:
  - `server/prisma/schema.prisma`
- Parallel?: No.
- Notes:
  - Align delete behaviors with report snapshot persistence rule and group deletion semantics.

### Subtask T003 - Configure financial fields and report hybrid storage columns
- Purpose: satisfy financial precision and hybrid report requirements.
- Steps:
  1. In `Transaction`, set:
     - `amount Decimal @db.Decimal(12,2)`
     - `currency String @db.Char(3)`
  2. In `Report`, set `snapshotData Json?`, `rangeStart`, `rangeEnd`, `generatedAt`, `createdAt`.
  3. Ensure `groupId` is nullable in both Transaction and Report.
- Files:
  - `server/prisma/schema.prisma`
- Parallel?: No.
- Notes:
  - Do not use float/double for money fields.

### Subtask T004 - Generate initial migration
- Purpose: produce deterministic SQL migration from schema state.
- Steps:
  1. Run in `server/`: `npx prisma migrate dev --name init-db-schema`.
  2. Verify migration SQL includes all tables/enums/constraints.
  3. Confirm migration directory is created under `server/prisma/migrations/`.
- Files:
  - `server/prisma/migrations/*`
- Parallel?: No.
- Notes:
  - If there is prior conflicting migration state, resolve with explicit reset only if project policy allows.

### Subtask T005 - Validate Prisma client generation and schema validity
- Purpose: ensure downstream services can consume generated Prisma types.
- Steps:
  1. Run `npx prisma generate` in `server/`.
  2. Run `npx prisma validate`.
  3. Confirm no relation or field type errors.
- Files:
  - Generated Prisma client artifacts.
- Parallel?: No.
- Notes:
  - Capture any validation errors and fix in schema before handing off.

## Test Strategy

Not adding test suite tasks in this WP. Validation is command-based:
- `npx prisma validate`
- `npx prisma migrate dev --name init-db-schema`
- `npx prisma generate`

## Risks & Mitigations

- Risk: migration conflicts with existing local DB state.
  - Mitigation: ensure schema is canonical before generating migration; verify SQL diff.
- Risk: incorrect delete action causing orphan records.
  - Mitigation: compare relation actions against `kitty-specs/001-db-schema/data-model.md` cascade table.

## Review Guidance

- Reviewer should inspect relation annotations and unique constraints first.
- Reviewer should run migration and generation commands locally.
- Reviewer should verify all seven models are present and mapped.

## Activity Log

- 2026-03-22T10:00:26Z - system - lane=planned - Prompt created.
- 2026-03-22T10:15:48Z – codex – shell_pid=10194 – lane=doing – Assigned agent via workflow command
