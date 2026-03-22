---
work_package_id: WP04
title: Login Flow
lane: planned
dependencies: [WP02]
subtasks:
- T016
- T017
- T018
- T019
- T020
phase: Phase 2 - Story Delivery
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
- FR-002
- FR-007
- FR-008
---

# Work Package Prompt: WP04 - Login Flow

## Objectives & Success Criteria

- Implement POST /auth/login credential verification.
- Validate against stored bcrypt password hash.
- Return access+refresh token pair and update refresh token hash.

Success criteria:
- Valid credentials return token pair.
- Invalid credentials return unauthorized.
- Login behavior is contract-aligned and secure.

## Context & Constraints

- Depends on WP02.
- Requirements focus: FR-002, FR-007, FR-008.
- Must prevent credential enumeration and leak-safe failures.

## Implementation Command

- spec-kitty implement WP04 --base WP02

## Subtasks & Detailed Guidance

### Subtask T016 - Build login DTO validation
- Purpose: enforce request contract and input hygiene.
- Steps:
  1. Create login dto for email/password.
  2. Validate email format and required password.
- Files:
  - server/src/auth/dto/login.dto.ts
- Parallel?: No.
- Notes:
  - Keep DTO minimal and strict.

### Subtask T017 - Implement credential verification service logic
- Purpose: authenticate user safely.
- Steps:
  1. Lookup user by normalized email.
  2. Compare provided password using bcrypt compare.
  3. Return unauthorized on mismatch.
- Files:
  - server/src/auth/auth.service.ts
- Parallel?: No.
- Notes:
  - Use consistent failure semantics for unknown email and wrong password.

### Subtask T018 - Issue token pair and persist refresh hash
- Purpose: establish authenticated session state.
- Steps:
  1. Generate access and refresh tokens.
  2. Hash refresh token.
  3. Persist refresh hash and return token pair.
- Files:
  - server/src/auth/auth.service.ts
- Parallel?: No.
- Notes:
  - Ensure token claims include userId/sub.

### Subtask T019 - Implement login endpoint mapping [P]
- Purpose: expose login route per contract.
- Steps:
  1. Add POST /auth/login route.
  2. Bind dto and service call.
  3. Align status and response payload.
- Files:
  - server/src/auth/auth.controller.ts
- Parallel?: Yes.
- Notes:
  - Keep controller logic thin.

### Subtask T020 - Validate login edge behavior
- Purpose: verify secure and predictable failure behavior.
- Steps:
  1. Verify unknown email unauthorized response.
  2. Verify wrong password unauthorized response.
  3. Verify malformed payload rejection.
- Files:
  - server/src/auth/*
- Parallel?: No.
- Notes:
  - Keep error shape consistent with global API style.

## Test Strategy

- Smoke checks only:
  - success login
  - invalid credentials
  - malformed payload

## Risks & Mitigations

- Risk: user enumeration through distinct error messages.
  - Mitigation: uniform unauthorized responses.
- Risk: refresh hash not updated on login.
  - Mitigation: enforce update in same service path as token issuance.

## Review Guidance

- Verify bcrypt compare usage.
- Verify token pair return contract.
- Verify no sensitive fields leak in response.

## Activity Log

- 2026-03-22T11:17:43Z - system - lane=planned - Prompt created.
