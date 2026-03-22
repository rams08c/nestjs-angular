---
work_package_id: WP02
title: Auth Module Core Infrastructure
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
- timestamp: '2026-03-22T11:17:43Z'
  lane: planned
  agent: system
  shell_pid: ''
  action: Prompt generated via /spec-kitty.tasks
requirement_refs:
- FR-010
- FR-011
- FR-012
---

# Work Package Prompt: WP02 - Auth Module Core Infrastructure

## Objectives & Success Criteria

- Stand up auth module structure, JWT services, and guard/strategy baseline.
- Ensure protected endpoint behavior defaults are aligned with constitution.
- Provide reusable token utility functions for downstream flows.

Success criteria:
- Auth module compiles and is wired into app module.
- Access and refresh strategies are available.
- Protected route defaults function as expected.

## Context & Constraints

- Depends on WP01 schema/migration completion.
- Must keep controllers thin and business logic in service.
- JWT authentication required for non-public endpoints.

## Implementation Command

- spec-kitty implement WP02 --base WP01

## Subtasks & Detailed Guidance

### Subtask T006 - Create auth module scaffold
- Purpose: define clean feature boundary for auth responsibilities.
- Steps:
  1. Add module/controller/service files under server/src/auth.
  2. Create dto, guards, and strategies subfolders.
  3. Register module in app imports.
- Files:
  - server/src/auth/*
  - server/src/app.module.ts
- Parallel?: No.
- Notes:
  - Keep naming consistent with plan structure.

### Subtask T007 - Configure JWT access and refresh services
- Purpose: centralize token signing config.
- Steps:
  1. Configure JwtModule and token secrets/expiries.
  2. Add config-backed values for access/refresh behavior.
  3. Ensure secure defaults if env values missing.
- Files:
  - server/src/auth/auth.module.ts
  - server/src/auth/auth.service.ts
  - server/.env (if needed)
- Parallel?: No.
- Notes:
  - Keep secrets out of source control.

### Subtask T008 - Implement access token strategy and guard
- Purpose: enforce bearer auth on protected routes.
- Steps:
  1. Implement jwt strategy for access tokens.
  2. Add guard class for protected endpoints.
  3. Ensure request user context includes userId/sub.
- Files:
  - server/src/auth/strategies/jwt.strategy.ts
  - server/src/auth/guards/jwt-auth.guard.ts
- Parallel?: No.
- Notes:
  - Token payload must include sub and email claims.

### Subtask T009 - Implement refresh token strategy and guard [P]
- Purpose: support secure refresh endpoint behavior.
- Steps:
  1. Implement refresh token strategy.
  2. Implement refresh guard.
  3. Ensure refresh token type is validated.
- Files:
  - server/src/auth/strategies/jwt-refresh.strategy.ts
  - server/src/auth/guards/jwt-refresh.guard.ts
- Parallel?: Yes.
- Notes:
  - Keep refresh handling separate from access strategy.

### Subtask T010 - Create token utility methods
- Purpose: avoid duplicated JWT payload/sign logic.
- Steps:
  1. Add shared methods for token payload construction.
  2. Add signer methods for access and refresh tokens.
  3. Standardize auth response shape.
- Files:
  - server/src/auth/auth.service.ts
- Parallel?: No.
- Notes:
  - Keep utility methods deterministic and test-friendly.

## Test Strategy

- Module-level smoke validation:
  - app boot
  - protected route guard behavior
  - token generation methods

## Risks & Mitigations

- Risk: wrong guard applied to endpoint classes.
  - Mitigation: route matrix check in WP06.
- Risk: inconsistent token payloads.
  - Mitigation: one centralized payload/sign helper.

## Review Guidance

- Verify only register/login remain public.
- Verify guard and strategy files are isolated and cohesive.

## Activity Log

- 2026-03-22T11:17:43Z - system - lane=planned - Prompt created.
