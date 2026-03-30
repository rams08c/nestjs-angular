---
work_package_id: WP01
title: Transaction Model and State Foundation
lane: "doing"
dependencies: []
base_branch: main
base_commit: 4e6b8710438be833347bff74534b8c3e5c3c574a
created_at: '2026-03-30T12:51:49.956674+00:00'
subtasks:
- T001
- T002
- T003
phase: Phase 1 - Foundation
assignee: ''
agent: "github-copilot"
shell_pid: "20951"
review_status: ''
reviewed_by: ''
history:
- timestamp: '2026-03-30T11:51:59Z'
  lane: planned
  agent: system
  shell_pid: ''
  action: Prompt generated via /spec-kitty.tasks
---

# Work Package Prompt: WP01 - Transaction Model and State Foundation

## Objectives & Success Criteria
- Add typed transaction model and signal form/delete state contracts.
- Extend dashboard state service with add/update/remove and modal state helpers.
- Expose data-flow methods that orchestrate drawer and delete-confirm behavior.

## Context & Constraints
- Use Angular signals and strict typing.
- Keep implementation concise and easy to understand.
- Keep state mutation centralized in dashboard state service.

## Subtasks & Detailed Guidance
### Subtask T001 - Create transaction model
- Purpose: Define shared model contracts and schema defaults for add/edit flows.
- Steps:
  1. Create `client/src/app/dashboard/transaction.model.ts`.
  2. Add `TransactionItem`, `TransactionFormModel`, `TransactionFormState`, `DeleteConfirmState`.
  3. Add `defaultTransactionFormModel`, `defaultTransactionFormState`, `defaultDeleteConfirmState`.
  4. Add `TransactionSchema` using zod computed signal.

### Subtask T002 - Extend dashboard signal service
- Purpose: Host transaction state and CRUD mutations.
- Steps:
  1. Import model types from `transaction.model.ts`.
  2. Replace inline `Transaction` interface usage with `TransactionItem`.
  3. Add signals: `transactionFormState`, `deleteConfirmState`, `isTransactionsLoading`.
  4. Add methods: `openAddTransaction`, `openEditTransaction`, `closeTransactionForm`, `openDeleteConfirm`, `closeDeleteConfirm`, `addTransaction`, `updateTransaction`, `removeTransaction`.

### Subtask T003 - Extend data flow service
- Purpose: Provide cross-component API for transaction interactions.
- Steps:
  1. Inject `DashboardSignalService`.
  2. Add wrapper methods matching state service helpers.
  3. Keep method names stable and descriptive.

## Risks & Mitigations
- Risk: Type drift between model and service. Mitigation: only import from one model file.

## Review Guidance
- Verify all mutations are immutable and signal-safe.
- Verify add/edit/delete state transitions are deterministic.

## Activity Log
- 2026-03-30T11:51:59Z - system - lane=planned - Prompt created.
- 2026-03-30T12:51:50Z – github-copilot – shell_pid=20951 – lane=doing – Assigned agent via workflow command
