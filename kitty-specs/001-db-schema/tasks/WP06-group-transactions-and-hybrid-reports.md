---
work_package_id: WP06
title: Group Transactions and Hybrid Reports
lane: planned
dependencies: [WP04, WP05]
subtasks:
- T026
- T027
- T028
- T029
- T030
phase: Phase 4 - Group Expenses and Reporting
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
- FR-009
- FR-013
- FR-014
- FR-015
---

# Work Package Prompt: WP06 - Group Transactions and Hybrid Reports

## Objectives & Success Criteria

- Extend transactions to support group context with membership-aware access.
- Implement Reports module supporting both derived generation and persisted snapshots.
- Ensure persisted and derived totals are consistent for the same scope/range.

Success criteria:
- Group transaction creation validates group and membership context.
- `/reports/generate` returns derived output without persistence.
- `/reports` persistence stores snapshot and returns retrievable record.

## Context & Constraints

- Depends on `WP04` (transaction baseline) and `WP05` (group membership baseline).
- Contract references:
  - `kitty-specs/001-db-schema/contracts/transactions.yaml`
  - `kitty-specs/001-db-schema/contracts/reports.yaml`
- Data model rules:
  - Group transaction uses nullable `groupId` in Transaction.
  - Report uses nullable `groupId` and optional `snapshotData` JSON.

## Implementation Command

- `spec-kitty implement WP06 --base WP04`
- If WP05 is not merged into chosen base, rebase/cherry-pick WP05 changes before final integration.

## Subtasks & Detailed Guidance

### Subtask T026 - Add group-aware transaction checks to service layer
- Purpose: make transaction behavior safe in shared-group scenarios.
- Steps:
  1. Extend transaction create/update flows to validate `groupId` when present.
  2. Ensure authenticated user is authorized in group context.
  3. Restrict group transaction reads/updates/deletes to allowed users.
- Files:
  - `server/src/transactions/transactions.service.ts`
- Parallel?: No.
- Notes:
  - Do not break personal transaction path where `groupId` is null.

### Subtask T027 - Implement Reports module endpoint surface
- Purpose: expose report list/get/delete/generate/save REST API.
- Steps:
  1. Add reports module files and DTOs.
  2. Implement routes from contract:
     - `GET /reports`
     - `POST /reports`
     - `POST /reports/generate`
     - `GET /reports/:id`
     - `DELETE /reports/:id`
  3. Keep controller minimal and delegate to service logic.
- Files:
  - `server/src/reports/reports.module.ts`
  - `server/src/reports/reports.controller.ts`
  - `server/src/reports/reports.service.ts`
  - `server/src/reports/dto/create-report.dto.ts`
  - `server/src/reports/dto/generate-report.dto.ts`
- Parallel?: No.
- Notes:
  - Scope all report data by owner user id.

### Subtask T028 - Implement shared aggregation logic for derived and persisted flows
- Purpose: prevent divergence between generated and saved report outputs.
- Steps:
  1. Implement one aggregation function/service method that computes report data for a scope.
  2. Use it in both generate endpoint and save endpoint.
  3. On save, persist returned aggregate in `snapshotData`.
- Files:
  - `server/src/reports/reports.service.ts`
- Parallel?: No.
- Notes:
  - Keep report type branching isolated and explicit.

### Subtask T029 - Add report input validation and owner/group guards [P]
- Purpose: enforce range/reportType rules and access controls.
- Steps:
  1. Validate `rangeEnd > rangeStart`.
  2. Validate `reportType` enum membership.
  3. If `groupId` provided, enforce user group access.
- Files:
  - `server/src/reports/dto/*`
  - `server/src/reports/reports.service.ts`
- Parallel?: Yes.
- Notes:
  - Return meaningful validation error payloads consistent with global filter.

### Subtask T030 - Verify persisted-vs-derived consistency and retrieval semantics
- Purpose: satisfy spec success criterion for matching totals.
- Steps:
  1. Generate report for given range/type and capture totals.
  2. Save same report snapshot and retrieve it.
  3. Confirm totals and dimensional fields match.
- Files:
  - reports module files and manual validation checklist
- Parallel?: No.
- Notes:
  - Validate both personal and group-scoped report cases.

## Test Strategy

Smoke checks:
- group transaction lifecycle
- report generate response
- report save/get/delete behavior
- derived vs persisted totals equivalence

## Risks & Mitigations

- Risk: inconsistent aggregation between generate and save code paths.
  - Mitigation: force both paths through same aggregation function.
- Risk: leaked cross-group report data.
  - Mitigation: combine owner scoping with group membership checks.

## Review Guidance

- Inspect aggregation reuse and scoping guards first.
- Confirm full contract coverage for reports endpoints.
- Confirm all report endpoints are JWT protected.

## Activity Log

- 2026-03-22T10:00:26Z - system - lane=planned - Prompt created.
