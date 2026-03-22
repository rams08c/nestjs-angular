---
work_package_id: WP02
title: Core Backend Foundations
lane: planned
dependencies: [WP01]
subtasks:
- T006
- T007
- T008
- T009
- T010
phase: Phase 1 - Foundation
assignee: ''
agent: ''
shell_pid: ''
review_status: ''
reviewed_by: ''
history:
- timestamp: '2026-03-22T10:00:26Z'
  lane: planned
  agent: system
  shell_pid: ''
  action: Prompt generated via /spec-kitty.tasks
requirement_refs:
- FR-015
---

# Work Package Prompt: WP02 - Core Backend Foundations

## Objectives & Success Criteria

- Establish shared backend patterns needed by all feature modules.
- Ensure JWT-by-default, DTO validation, and centralized error handling are in place.
- Provide reusable user-scope enforcement helper pattern in services.

Success criteria:
- Backend boots with all base modules wired.
- Protected endpoints require JWT unless explicitly public.
- Feature services have a consistent `userId` scoping pattern.

## Context & Constraints

- This package depends on `WP01` schema completion.
- Constitution constraints:
  - Controllers remain thin.
  - Business logic in services.
  - Auth required by default.
  - Every operation scoped by authenticated user.
- Existing code location:
  - `server/src/app.module.ts`
  - `server/src/prisma/`
  - `server/src/main.ts`

## Implementation Command

- `spec-kitty implement WP02 --base WP01`

## Subtasks & Detailed Guidance

### Subtask T006 - Wire PrismaModule and PrismaService for feature module consumption
- Purpose: ensure all feature services can depend on Prisma without ad hoc instantiation.
- Steps:
  1. Verify `server/src/prisma/prisma.module.ts` exports `PrismaService`.
  2. Ensure `PrismaModule` is imported once in `server/src/app.module.ts` or globally configured.
  3. Confirm lifecycle hooks for clean shutdown are preserved.
- Files:
  - `server/src/prisma/prisma.module.ts`
  - `server/src/prisma/prisma.service.ts`
  - `server/src/app.module.ts`
- Parallel?: No.
- Notes:
  - Keep module import graph clean to avoid circular dependencies.

### Subtask T007 - Enforce JWT-by-default route protection
- Purpose: satisfy constitution auth rule across all upcoming feature modules.
- Steps:
  1. Validate global or controller-level guard strategy.
  2. Keep `/auth/register` and `/auth/login` public only.
  3. Confirm request context exposes authenticated `userId` to services.
- Files:
  - `server/src/main.ts`
  - `server/src/**/auth*.ts` (existing auth guard/decorator files)
- Parallel?: No.
- Notes:
  - If auth infrastructure exists, align rather than rewrite.

### Subtask T008 - Align DTO validation conventions [P]
- Purpose: make all module DTOs enforceable and consistent before module implementation.
- Steps:
  1. Confirm `ValidationPipe` settings (`whitelist`, `forbidNonWhitelisted`, transform behavior).
  2. Establish DTO style guidance for create/update/filter DTOs.
  3. Add shared validator helper utilities only if recurring constraints demand it.
- Files:
  - `server/src/main.ts`
  - `server/src/common/` (if needed)
- Parallel?: Yes.
- Notes:
  - Keep this lightweight; avoid over-abstraction.

### Subtask T009 - Align centralized API error handling [P]
- Purpose: normalize error response behavior across modules.
- Steps:
  1. Ensure a global exception filter strategy exists.
  2. Map Prisma known request errors (unique conflicts, missing record) to HTTP semantics.
  3. Define predictable error payload shape for clients.
- Files:
  - `server/src/main.ts`
  - `server/src/common/filters/` (if present/new)
- Parallel?: Yes.
- Notes:
  - Keep API error handling centralized per constitution API rules.

### Subtask T010 - Create user-scoping helper pattern for services
- Purpose: prevent inconsistent `where` filters and cross-user data leakage.
- Steps:
  1. Add utility conventions for extracting `userId` from request context.
  2. Define a service-level pattern for composing owner filters.
  3. Document usage in comments or module README if needed.
- Files:
  - `server/src/common/` helper location
  - referenced in future module services
- Parallel?: No.
- Notes:
  - Keep helper minimal and composable.

## Test Strategy

No explicit automated test tasks in this package. Validate via:
- server startup
- protected route smoke checks (unauthorized without token)
- error shape spot-check

## Risks & Mitigations

- Risk: mixed auth strategies causing accidental public endpoints.
  - Mitigation: enforce one consistent guard pattern and verify route decorators.
- Risk: helper abstraction too rigid.
  - Mitigation: keep helper focused on filter composition only.

## Review Guidance

- Confirm guard defaults and public route exceptions.
- Confirm no business logic moved into controllers.
- Confirm error handling is centrally configured and not duplicated.

## Activity Log

- 2026-03-22T10:00:26Z - system - lane=planned - Prompt created.
