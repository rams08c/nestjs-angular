---
work_package_id: "WP03"
subtasks:
  - "T007"
  - "T008"
  - "T009"
  - "T010"
title: "Add/Edit Drawer, Delete Confirm, Validation"
phase: "Phase 3 - CRUD Interactions"
lane: "planned"
dependencies:
  - "WP01"
assignee: ""
agent: ""
shell_pid: ""
review_status: ""
reviewed_by: ""
history:
  - timestamp: "2026-03-30T11:51:59Z"
    lane: "planned"
    agent: "system"
    shell_pid: ""
    action: "Prompt generated via /spec-kitty.tasks"
---

# Work Package Prompt: WP03 - Add/Edit Drawer, Delete Confirm, Validation

## Objectives & Success Criteria
- Implement signal-based add/edit drawer and delete confirmation modal.
- Enforce validation rules through the shared validation service pattern.

## Context & Constraints
- Must use `@angular/forms/signals` only.
- Keep implementation concise and easy to understand.

## Subtasks & Detailed Guidance
### Subtask T007 - Create transaction form component
- Purpose: Add add/edit form UI and submission flow.
- Steps:
  1. Create `dashboard/components/transaction-form/` with template and TS.
  2. Use `form()` and `validateStandardSchema(TransactionSchema)`.
  3. Bind mode and open/close state to signals.

### Subtask T008 - Implement edit prefill
- Purpose: Ensure edit mode opens with current transaction values.
- Steps:
  1. Read `editingTransactionId` from form state.
  2. Map matching transaction into form model values.
  3. Submit updates through data flow service.

### Subtask T009 - Create delete confirm modal
- Purpose: Confirm destructive action before state mutation.
- Steps:
  1. Create `dashboard/components/delete-confirm/` component.
  2. Bind open state and target transaction id from signal state.
  3. Confirm triggers remove and close.

### Subtask T010 - Integrate validation feedback
- Purpose: Ensure field errors and submit safety are visible.
- Steps:
  1. Reuse validation strategy from login/register signal forms.
  2. Show per-field errors in template.
  3. Disable submit while invalid/submitting.

## Risks & Mitigations
- Risk: drawer and modal state conflicts. Mitigation: always close one when opening the other.

## Review Guidance
- Verify add/edit/delete interactions update list instantly.
- Verify only signal form APIs are used.

## Activity Log
- 2026-03-30T11:51:59Z - system - lane=planned - Prompt created.
