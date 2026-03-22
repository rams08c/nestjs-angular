---
work_package_id: WP05
title: Groups and Membership Module
lane: planned
dependencies: [WP03]
subtasks:
- T021
- T022
- T023
- T024
- T025
phase: Phase 3 - Group Foundations
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
- FR-010
- FR-011
- FR-012
- FR-015
---

# Work Package Prompt: WP05 - Groups and Membership Module

## Objectives & Success Criteria

- Implement group CRUD with creator ownership semantics.
- Implement group membership add/list/remove operations.
- Enforce owner/member role behavior and duplicate membership protection.

Success criteria:
- Group creator is OWNER.
- Only OWNER can mutate group membership.
- Duplicate group membership attempts return conflict.

## Context & Constraints

- Depends on `WP03` (users baseline available).
- Contract references:
  - `kitty-specs/001-db-schema/contracts/groups.yaml`
  - `kitty-specs/001-db-schema/contracts/group-members.yaml`
- Schema behavior:
  - GroupMember unique (`groupId`, `userId`)
  - Role enum OWNER/MEMBER

## Implementation Command

- `spec-kitty implement WP05 --base WP03`

## Subtasks & Detailed Guidance

### Subtask T021 - Implement Groups module CRUD
- Purpose: provide lifecycle management for group entities.
- Steps:
  1. Define create/update DTOs for groups.
  2. Implement service CRUD methods scoped to owner/member visibility rules.
  3. Ensure group creation sets `ownerUserId` from authenticated user.
- Files:
  - `server/src/groups/groups.module.ts`
  - `server/src/groups/groups.controller.ts`
  - `server/src/groups/groups.service.ts`
  - `server/src/groups/dto/create-group.dto.ts`
  - `server/src/groups/dto/update-group.dto.ts`
- Parallel?: No.
- Notes:
  - List behavior should include groups where user is member.

### Subtask T022 - Implement GroupMembers module operations
- Purpose: support participant management for split expenses.
- Steps:
  1. Define `add-member.dto.ts`.
  2. Implement add/list/remove service operations.
  3. Implement routes under `/groups/:groupId/members`.
- Files:
  - `server/src/group-members/group-members.module.ts`
  - `server/src/group-members/group-members.controller.ts`
  - `server/src/group-members/group-members.service.ts`
  - `server/src/group-members/dto/add-member.dto.ts`
- Parallel?: No.
- Notes:
  - Validate target user existence before membership create.

### Subtask T023 - Enforce OWNER authorization for mutable group/member actions
- Purpose: ensure permission semantics match domain expectations.
- Steps:
  1. Add ownership checks in service methods for group update/delete.
  2. Add ownership checks for add/remove member operations.
  3. Return consistent forbidden status when unauthorized.
- Files:
  - `server/src/groups/groups.service.ts`
  - `server/src/group-members/group-members.service.ts`
- Parallel?: No.
- Notes:
  - Keep checks in services, not in controller branching logic.

### Subtask T024 - Handle duplicate membership conflicts and concurrency [P]
- Purpose: make membership operations safe under concurrent requests.
- Steps:
  1. Catch Prisma unique constraint violations for group_members composite key.
  2. Map to HTTP 409 with stable error payload.
  3. Ensure idempotent remove behavior (404 for not found).
- Files:
  - `server/src/group-members/group-members.service.ts`
  - shared error mapping utilities if present
- Parallel?: Yes.
- Notes:
  - Do not swallow DB constraint errors silently.

### Subtask T025 - Reconcile groups/member module endpoints with contracts
- Purpose: prevent API mismatch before downstream report/group-transaction logic.
- Steps:
  1. Compare route paths/methods/statuses to YAML contracts.
  2. Reconcile DTO fields and enum values.
  3. Fix implementation mismatches.
- Files:
  - `server/src/groups/*`
  - `server/src/group-members/*`
  - contract files in `kitty-specs/001-db-schema/contracts/`
- Parallel?: No.
- Notes:
  - Keep route nesting exactly as contract for member endpoints.

## Test Strategy

Smoke checks:
- create group
- add member
- duplicate add returns conflict
- remove member
- unauthorized group mutation rejected

## Risks & Mitigations

- Risk: owner checks inconsistently applied between groups and group-members services.
  - Mitigation: centralize owner-check helper or shared guard utility in services.
- Risk: race conditions on add-member.
  - Mitigation: rely on DB uniqueness + conflict mapping.

## Review Guidance

- Inspect ownership logic first.
- Verify creator receives OWNER role.
- Verify contracts for nested member routes.

## Activity Log

- 2026-03-22T10:00:26Z - system - lane=planned - Prompt created.
