---
work_package_id: WP05
title: Refresh Token Flow
lane: planned
dependencies: [WP03, WP04]
subtasks:
- T021
- T022
- T023
- T024
- T025
phase: Phase 3 - Session Continuity
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
- FR-008
- FR-009
- FR-010
- FR-011
---

# Work Package Prompt: WP05 - Refresh Token Flow

## Objectives & Success Criteria

- Implement POST /auth/refresh endpoint.
- Validate refresh token via strategy + persisted hash comparison.
- Rotate refresh token hash and return renewed token pair.

Success criteria:
- Valid refresh token returns renewed token pair.
- Invalid/expired/mismatched token returns unauthorized.
- Refresh token persistence rotates securely.

## Context & Constraints

- Depends on WP03 and WP04.
- Requirements focus: FR-008, FR-009, FR-010, FR-011.
- Planning confirmation explicitly included refresh endpoint in scope.

## Implementation Command

- spec-kitty implement WP05 --base WP04

## Subtasks & Detailed Guidance

### Subtask T021 - Build refresh DTO and route contract mapping [P]
- Purpose: define refresh request boundary.
- Steps:
  1. Create refresh dto with required refreshToken field.
  2. Ensure route contract matches contracts/auth.yaml.
- Files:
  - server/src/auth/dto/refresh-token.dto.ts
  - server/src/auth/auth.controller.ts
- Parallel?: Yes.
- Notes:
  - Keep DTO minimal and strict.

### Subtask T022 - Implement refresh strategy and guard behavior [P]
- Purpose: enforce token-type and signature validation for refresh requests.
- Steps:
  1. Finalize refresh strategy extraction and validation.
  2. Apply guard to POST /auth/refresh.
  3. Ensure request context has userId/sub.
- Files:
  - server/src/auth/strategies/jwt-refresh.strategy.ts
  - server/src/auth/guards/jwt-refresh.guard.ts
  - server/src/auth/auth.controller.ts
- Parallel?: Yes.
- Notes:
  - Keep guard logic reusable.

### Subtask T023 - Implement refresh service verification flow
- Purpose: ensure refresh token is valid against persisted state.
- Steps:
  1. Fetch user from token claims.
  2. Compare incoming refresh token with stored refresh token hash.
  3. Reject on mismatch/absent hash.
- Files:
  - server/src/auth/auth.service.ts
- Parallel?: No.
- Notes:
  - Avoid direct token string persistence or comparison.

### Subtask T024 - Implement token rotation and hash persistence
- Purpose: reduce replay risk and maintain secure session lifecycle.
- Steps:
  1. Generate renewed token pair on valid refresh.
  2. Hash renewed refresh token.
  3. Persist hash atomically and return new pair.
- Files:
  - server/src/auth/auth.service.ts
- Parallel?: No.
- Notes:
  - Ensure old refresh token cannot be reused after rotation.

### Subtask T025 - Validate refresh edge scenarios
- Purpose: harden refresh flow behavior.
- Steps:
  1. Verify expired refresh token rejection.
  2. Verify token mismatch/hash mismatch rejection.
  3. Verify replayed token is rejected after rotation.
- Files:
  - server/src/auth/*
- Parallel?: No.
- Notes:
  - Capture expected failure semantics for reviewers.

## Test Strategy

- Smoke checks:
  - valid refresh
  - invalid/expired refresh
  - replay token rejection after rotation

## Risks & Mitigations

- Risk: refresh replay if hash not rotated.
  - Mitigation: rotate and persist hash on every successful refresh.
- Risk: accepting refresh token without DB match.
  - Mitigation: hash compare is mandatory in service flow.

## Review Guidance

- Verify route and guard attachment for /auth/refresh.
- Verify persisted hash compare and rotation behavior.
- Verify token pair return shape consistency.

## Activity Log

- 2026-03-22T11:17:43Z - system - lane=planned - Prompt created.
