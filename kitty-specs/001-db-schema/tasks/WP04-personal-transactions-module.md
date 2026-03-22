---
work_package_id: WP04
title: Personal Transactions Module
lane: planned
dependencies: [WP03]
subtasks:
- T016
- T017
- T018
- T019
- T020
phase: Phase 3 - Personal Expenses
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
- FR-007
- FR-008
- FR-009
- FR-015
---

# Work Package Prompt: WP04 - Personal Transactions Module

## Objectives & Success Criteria

- Implement personal transaction CRUD where group context is optional and defaults to personal behavior.
- Enforce category ownership and transaction owner scoping.
- Enforce financial validation for amount/currency/date fields.

Success criteria:
- Authenticated user can perform personal transaction CRUD.
- User cannot access another user’s transactions.
- Invalid amount or category references are rejected.

## Context & Constraints

- Depends on `WP03` (users/profile/categories in place).
- Contract reference:
  - `kitty-specs/001-db-schema/contracts/transactions.yaml`
- Schema constraints:
  - `categoryId` required
  - `groupId` nullable
  - `amount` decimal and positive
- Constitution constraints: DTO validation + service-centric business logic.

## Implementation Command

- `spec-kitty implement WP04 --base WP03`

## Subtasks & Detailed Guidance

### Subtask T016 - Implement transaction DTOs for personal flow
- Purpose: establish validated request surfaces.
- Steps:
  1. Create `create-transaction.dto.ts` with required fields and validators.
  2. Create `update-transaction.dto.ts` with optional mutable fields.
  3. Add optional filter DTO for listing (`categoryId`, date range, groupId optional).
- Files:
  - `server/src/transactions/dto/create-transaction.dto.ts`
  - `server/src/transactions/dto/update-transaction.dto.ts`
  - optional filter dto under `server/src/transactions/dto/`
- Parallel?: No.
- Notes:
  - Validate currency as uppercase 3-char code.

### Subtask T017 - Implement transactions service CRUD with owner/category enforcement
- Purpose: enforce ownership and category validity at business layer.
- Steps:
  1. Create service methods for create/list/get/update/delete.
  2. Resolve category by `id + ownerUserId` to prevent cross-user category use.
  3. Always scope transaction queries by `ownerUserId`.
- Files:
  - `server/src/transactions/transactions.service.ts`
- Parallel?: No.
- Notes:
  - Return 404 on out-of-scope record access.

### Subtask T018 - Implement transactions controller endpoints and filters [P]
- Purpose: expose REST routes aligned with contract.
- Steps:
  1. Add GET/POST on `/transactions`.
  2. Add GET/PATCH/DELETE on `/transactions/:id`.
  3. Support query filtering by date/category/group as defined.
- Files:
  - `server/src/transactions/transactions.controller.ts`
  - `server/src/transactions/transactions.module.ts`
- Parallel?: Yes.
- Notes:
  - Keep controller free of ownership logic.

### Subtask T019 - Add financial validations and decimal serialization mapping
- Purpose: avoid money precision and payload inconsistency issues.
- Steps:
  1. Validate amount > 0.
  2. Validate transactionDate as valid date (and not future if policy enforced).
  3. Serialize Prisma Decimal to string in responses.
- Files:
  - `server/src/transactions/transactions.service.ts`
  - optional response mapper utilities
- Parallel?: No.
- Notes:
  - Do not expose Prisma Decimal objects directly to client.

### Subtask T020 - Validate personal transaction edge flows and error mapping
- Purpose: ensure robust behavior before group/report layers build on this.
- Steps:
  1. Smoke check: create/list/update/delete personal transaction.
  2. Verify 400 for invalid amount/currency/date.
  3. Verify 404/403 behavior for out-of-scope transaction ID.
- Files:
  - transaction module files and manual validation checklist
- Parallel?: No.
- Notes:
  - Preserve consistent error payload from WP02 conventions.

## Test Strategy

Smoke-level validation only:
- valid personal create/list/update/delete
- invalid amount rejected
- category ownership enforced

## Risks & Mitigations

- Risk: category/user mismatch accepted accidentally.
  - Mitigation: category fetch always includes owner filter.
- Risk: date and decimal inconsistencies.
  - Mitigation: strict DTO validators plus centralized response mapping.

## Review Guidance

- Verify all service methods include owner scoping.
- Verify contract endpoint/status alignment.
- Verify Decimal serialization behavior in all responses.

## Activity Log

- 2026-03-22T10:00:26Z - system - lane=planned - Prompt created.
