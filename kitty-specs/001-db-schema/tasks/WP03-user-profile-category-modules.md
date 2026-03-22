---
work_package_id: WP03
title: User, Profile, Category Modules
lane: planned
dependencies: [WP02]
subtasks:
- T011
- T012
- T013
- T014
- T015
phase: Phase 2 - MVP Story
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
- FR-003
- FR-004
- FR-005
- FR-006
- FR-015
---

# Work Package Prompt: WP03 - User, Profile, Category Modules

## Objectives & Success Criteria

- Implement MVP story for account + profile + personal category foundation.
- User creation must require only `name` and `email`.
- Profile fields remain optional and updatable post-creation.
- Categories are user-scoped with unique name per user.

Success criteria:
- User creation succeeds with only name/email.
- Profile upsert/update works independently.
- Category CRUD enforces owner scoping and uniqueness.

## Context & Constraints

- Depends on `WP02` base infrastructure.
- Contracts to align:
  - `kitty-specs/001-db-schema/contracts/users.yaml`
  - `kitty-specs/001-db-schema/contracts/profile.yaml`
  - `kitty-specs/001-db-schema/contracts/categories.yaml`
- Constitution constraints:
  - Thin controllers.
  - DTO validation for all inputs.
  - User-scoped operations only.

## Implementation Command

- `spec-kitty implement WP03 --base WP02`

## Subtasks & Detailed Guidance

### Subtask T011 - Implement Users module
- Purpose: provide account CRUD baseline with required create constraints.
- Steps:
  1. Create/align `create-user.dto.ts` with required `name` and `email`.
  2. Create/align `update-user.dto.ts` allowing mutable profile-independent fields only.
  3. Implement service methods:
     - create
     - get current user
     - update current user
     - delete current user
  4. Controller delegates to service with no business logic.
- Files:
  - `server/src/users/users.module.ts`
  - `server/src/users/users.controller.ts`
  - `server/src/users/users.service.ts`
  - `server/src/users/dto/create-user.dto.ts`
  - `server/src/users/dto/update-user.dto.ts`
- Parallel?: No.
- Notes:
  - On duplicate email, map to 409.

### Subtask T012 - Implement Profile module
- Purpose: keep optional profile data separate and updatable later.
- Steps:
  1. Define `update-profile.dto.ts` with all optional fields:
     - `firstName`, `lastName`, `profilePic`, `location`, `address`
  2. Implement `get`, `put/upsert`, and `patch` semantics from contract.
  3. Enforce one profile per user via unique `userId` relation.
- Files:
  - `server/src/profile/profile.module.ts`
  - `server/src/profile/profile.controller.ts`
  - `server/src/profile/profile.service.ts`
  - `server/src/profile/dto/update-profile.dto.ts`
- Parallel?: No.
- Notes:
  - Profile must not become a creation prerequisite for users.

### Subtask T013 - Implement Categories module [P]
- Purpose: allow personal expense classification with owner-scoped uniqueness.
- Steps:
  1. Define create/update category DTOs.
  2. Implement category CRUD with `ownerUserId = auth.userId` filtering.
  3. Handle duplicate name per user as 409 conflict.
- Files:
  - `server/src/categories/categories.module.ts`
  - `server/src/categories/categories.controller.ts`
  - `server/src/categories/categories.service.ts`
  - `server/src/categories/dto/create-category.dto.ts`
  - `server/src/categories/dto/update-category.dto.ts`
- Parallel?: Yes.
- Notes:
  - Different users can reuse same category names.

### Subtask T014 - Apply mandatory user-scoping checks in users/profile/categories services
- Purpose: eliminate cross-user access possibility.
- Steps:
  1. Audit all service read/update/delete methods.
  2. Ensure each query includes authenticated owner key.
  3. Reject access with 404/403 semantics per current API style.
- Files:
  - `server/src/users/users.service.ts`
  - `server/src/profile/profile.service.ts`
  - `server/src/categories/categories.service.ts`
- Parallel?: No.
- Notes:
  - Keep all scoping logic in service layer.

### Subtask T015 - Validate endpoint behavior against users/profile/categories contracts
- Purpose: avoid contract drift before downstream modules build on these APIs.
- Steps:
  1. Compare implemented routes, methods, status codes to contract YAML.
  2. Reconcile request/response DTO field names.
  3. Update code if mismatched; do not rewrite contracts in this package unless clearly wrong.
- Files:
  - controllers and DTOs listed above
  - contract references under `kitty-specs/001-db-schema/contracts/`
- Parallel?: No.
- Notes:
  - Prioritize contract consistency over convenience naming changes.

## Test Strategy

No mandatory automated tests in scope; perform smoke validation:
- create user with name/email only
- update profile optional fields
- create/list/delete category for authenticated user

## Risks & Mitigations

- Risk: profile data accidentally embedded in user create flow.
  - Mitigation: keep profile module separate and optional.
- Risk: category uniqueness enforced globally instead of per user.
  - Mitigation: verify composite unique key and service-level where filters.

## Review Guidance

- Verify FR-003 and FR-005 behavior explicitly.
- Ensure services own business logic and filters.
- Ensure controllers only map HTTP concerns.

## Activity Log

- 2026-03-22T10:00:26Z - system - lane=planned - Prompt created.
