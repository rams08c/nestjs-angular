---
work_package_id: WP01
title: Auth Schema Foundation
lane: "doing"
dependencies: []
base_branch: main
base_commit: e0205f8ea28a02106bfc4d437d2a3a5fe53b2531
created_at: '2026-03-25T17:19:57.506138+00:00'
subtasks:
- T001
- T002
- T003
- T004
- T005
phase: Phase 1 - Foundation
assignee: ''
agent: "copilot"
shell_pid: "3075"
review_status: ''
reviewed_by: ''
history:
- timestamp: '2026-03-22T11:17:43Z'
  lane: planned
  agent: system
  shell_pid: ''
  action: Prompt generated via /spec-kitty.tasks
requirement_refs:
- FR-005
- FR-006
---

# Work Package Prompt: WP01 - Auth Schema Foundation

## Objectives & Success Criteria

- Add auth credential persistence fields and migration support.
- Ensure password and refresh token are represented only as hashed values in storage.
- Keep schema/migration aligned with existing DB conventions.

Success criteria:
- Prisma schema validates.
- Migration applies without breaking existing entities.
- Prisma client regenerates successfully.

## Context & Constraints

- References:
  - kitty-specs/002-auth-service-login-registration/spec.md
  - kitty-specs/002-auth-service-login-registration/plan.md
  - kitty-specs/002-auth-service-login-registration/data-model.md
  - kitty-specs/002-auth-service-login-registration/research.md
  - .kittify/memory/constitution.md
- Constraints:
  - Prisma-only DB access.
  - PostgreSQL target.
  - Keep normalized schema structure.

## Implementation Command

- spec-kitty implement WP01

## Subtasks & Detailed Guidance

### Subtask T001 - Add auth fields to user model
- Purpose: persist secure credential state.
- Steps:
  1. Update server/prisma/schema.prisma user model.
  2. Add password hash field.
  3. Add nullable refresh token hash field.
- Files:
  - server/prisma/schema.prisma
- Parallel?: No.
- Notes:
  - Use names consistent with plan/data model.

### Subtask T002 - Enforce constraints and indexing behavior
- Purpose: keep fast unique auth lookup and data integrity.
- Steps:
  1. Confirm unique email constraint remains active.
  2. Add/verify any index needed for auth query path.
  3. Ensure migration output is deterministic.
- Files:
  - server/prisma/schema.prisma
- Parallel?: No.
- Notes:
  - Do not loosen existing unique constraints.

### Subtask T003 - Create and apply migration
- Purpose: materialize schema changes into DB state.
- Steps:
  1. Run prisma migrate dev with auth migration name.
  2. Verify migration SQL content for expected columns.
  3. Confirm local DB sync is successful.
- Files:
  - server/prisma/migrations/*
- Parallel?: No.
- Notes:
  - Use migration names that match feature intent.

### Subtask T004 - Regenerate Prisma client [P]
- Purpose: update generated types after schema changes.
- Steps:
  1. Run prisma generate.
  2. Confirm generated client compiles with current backend code.
- Files:
  - server/node_modules/@prisma/client (generated)
- Parallel?: Yes.
- Notes:
  - Regeneration can run alongside rollback-readiness checks.

### Subtask T005 - Validate DB sync and rollback readiness
- Purpose: reduce migration risk before auth module coding.
- Steps:
  1. Confirm DB schema has expected new fields.
  2. Verify migration history and lock file state.
  3. Document rollback note in WP activity/review notes if needed.
- Files:
  - server/prisma/migrations/*
- Parallel?: No.
- Notes:
  - Keep verification lightweight and reproducible.

## Test Strategy

- Command checks only:
  - npx prisma validate
  - npx prisma migrate dev
  - npx prisma generate

## Risks & Mitigations

- Risk: Migration conflicts in local environments.
  - Mitigation: verify migration SQL and run from clean state.
- Risk: Raw token storage by mistake.
  - Mitigation: schema field names and service contracts enforce hash-only storage.

## Review Guidance

- Reviewers should inspect schema diff and migration SQL first.
- Confirm no raw password/refresh token persistence fields are introduced.

## Activity Log

- 2026-03-22T11:17:43Z - system - lane=planned - Prompt created.
- 2026-03-25T17:19:57Z – copilot – shell_pid=3075 – lane=doing – Assigned agent via workflow command
