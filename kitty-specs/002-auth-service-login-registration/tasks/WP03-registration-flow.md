---
work_package_id: WP03
title: Registration Flow
lane: planned
dependencies: [WP02]
subtasks:
- T011
- T012
- T013
- T014
- T015
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
- FR-001
- FR-003
- FR-004
- FR-005
- FR-006
- FR-009
---

# Work Package Prompt: WP03 - Registration Flow

## Objectives & Success Criteria

- Implement POST /auth/register with strict DTO validation.
- Enforce password min length 8 and bcrypt hashing.
- Return access+refresh token pair on successful registration.

Success criteria:
- Valid registration creates user and returns token pair.
- Duplicate email returns conflict.
- Invalid password length returns validation failure.

## Context & Constraints

- Depends on WP02 infrastructure.
- Requirements focus: FR-001, FR-003, FR-004, FR-005, FR-006, FR-009.
- Must never store plain password or raw refresh token.

## Implementation Command

- spec-kitty implement WP03 --base WP02

## Subtasks & Detailed Guidance

### Subtask T011 - Build register DTO validations
- Purpose: validate payload at request boundary.
- Steps:
  1. Create register dto with name/email/password fields.
  2. Apply min-length 8 rule to password.
  3. Apply email format validation and non-empty name.
- Files:
  - server/src/auth/dto/register.dto.ts
- Parallel?: No.
- Notes:
  - Keep dto class clean and explicit.

### Subtask T012 - Implement registration service workflow
- Purpose: execute secure user creation flow.
- Steps:
  1. Normalize email before lookup.
  2. Check duplicate email conflict.
  3. Hash password with bcrypt and create user record.
- Files:
  - server/src/auth/auth.service.ts
  - server/src/users/* or prisma-access layer
- Parallel?: No.
- Notes:
  - Conflict semantics should remain stable for client handling.

### Subtask T013 - Persist refresh token hash on registration
- Purpose: support secure refresh lifecycle from first auth event.
- Steps:
  1. Generate access+refresh pair after user creation.
  2. Hash refresh token and persist hash only.
  3. Return token pair response.
- Files:
  - server/src/auth/auth.service.ts
- Parallel?: No.
- Notes:
  - Do not store raw refresh token in DB.

### Subtask T014 - Implement register endpoint and response mapping [P]
- Purpose: expose registration through REST controller.
- Steps:
  1. Add POST /auth/register route.
  2. Wire dto and service response mapping.
  3. Ensure status code and payload follow contract.
- Files:
  - server/src/auth/auth.controller.ts
  - server/src/auth/auth.service.ts
- Parallel?: Yes.
- Notes:
  - Controller should delegate all business logic.

### Subtask T015 - Validate registration edge cases
- Purpose: harden registration before parallel login/refresh work.
- Steps:
  1. Verify duplicate email behavior.
  2. Verify min password rejection.
  3. Verify case-insensitive email conflict behavior.
- Files:
  - server/src/auth/*
- Parallel?: No.
- Notes:
  - Record behavior expectations in review notes.

## Test Strategy

- Smoke checks:
  - valid registration
  - duplicate email conflict
  - short password rejection

## Risks & Mitigations

- Risk: email normalization inconsistencies.
  - Mitigation: normalize at both lookup and create boundaries.
- Risk: accidental plain password persistence.
  - Mitigation: service-level hashing enforced before create operation.

## Review Guidance

- Verify DTO has password min length 8.
- Verify bcrypt hash path in service implementation.
- Verify response returns access+refresh tokens.

## Activity Log

- 2026-03-22T11:17:43Z - system - lane=planned - Prompt created.
