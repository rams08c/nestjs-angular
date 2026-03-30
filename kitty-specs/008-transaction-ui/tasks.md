# Work Packages: Transaction UI (008-transaction-ui)

**Inputs**: `kitty-specs/008-transaction-ui/spec.md`, `plan.md`, `data-model.md`
**Target Branch**: main

---

## Subtasks

| ID   | P? | Description |
|------|----|-------------|
| T001 |    | Create `transaction.model.ts` with `TransactionItem`, `TransactionFormState`, `DeleteConfirmState` interfaces, Zod `TransactionSchema`, and default values |
| T002 |    | Extend `DashboardSignalService` with `formState` and `deleteState` signals, plus `addTransaction`, `updateTransaction`, `removeTransaction` mutations |
| T003 | [P]| Add drawer/confirm control helpers to `DataFlowService`: `openAddDrawer`, `openEditDrawer`, `openDeleteConfirm`, `closeDrawer`, `closeDeleteConfirm` |
| T004 | [P]| Update `recent-transactions.html` to render amount, category, date, optional description, edit icon, delete icon per row; empty state and loading placeholder |
| T005 | [P]| Update `recent-transactions.ts` to inject `DataFlowService`, wire edit icon to `openEditDrawer(id)`, delete icon to `openDeleteConfirm(id)` |
| T006 |    | Update `dashboard.html` to add `+ Add Transaction` button in section header wired to `DataFlowService.openAddDrawer()`; hide list for unauthenticated users |
| T007 |    | Create `transaction-form` component using `form()` + `validateStandardSchema(TransactionSchema)` with DaisyUI inline drawer; add mode opens blank form |
| T008 |    | Implement edit prefill: read `editingTransactionId` from `DashboardSignalService.formState`, populate form model with existing `TransactionItem` values |
| T009 |    | Create `delete-confirm` inline DaisyUI modal reading `DeleteConfirmState`; confirm calls `DataFlowService.removeTransaction(id)`; cancel closes modal |
| T010 | [P]| Integrate `ValidationService` for transaction form: amount (required, positive numeric), category (required), date (required valid ISO); render field errors in template |

---

## Work Package WP01: Transaction Model & State Foundation (Priority: P0)

**Goal**: Establish typed model, Zod schema, and signal-based state layer all subsequent WPs depend on.
**Independent Test**: `DashboardSignalService.formState()` and `deleteState()` signals are writable; `addTransaction` appends to `recentTransactions`; `TransactionSchema` rejects invalid amount.
**Prompt**: `/tasks/WP01-transaction-model-state.md`

### Included Subtasks
- [ ] T001 Create `transaction.model.ts` in `client/src/app/dashboard/`
- [ ] T002 Extend `DashboardSignalService` with form/delete state signals and CRUD mutations
- [ ] T003 Add drawer control helpers to `DataFlowService`

### Implementation Notes
- `TransactionItem` mirrors `Transaction` interface already in `DashboardSignalService`; consolidate and export from `transaction.model.ts`
- `TransactionSchema` (Zod): `amount` positive number, `category` non-empty string, `date` valid ISO string, `description` optional string
- `DashboardSignalService.addTransaction` appends to `recentTransactions` signal and updates `summary` totals accordingly
- `DataFlowService` helpers call into `DashboardSignalService` to keep all mutation logic in one place

### Parallel Opportunities
- T003 can proceed in parallel with T002 once T001 types are defined.

### Dependencies
- None (foundation WP).

### Risks & Mitigations
- Duplicate `Transaction` type with existing one in `DashboardSignalService`. Consolidate to avoid drift.

**Requirements Refs**: FR-001, FR-007, FR-010

---

## Work Package WP02: Transaction List UI (Priority: P1)

**Goal**: Render the transaction list inside the dashboard with add button, edit/delete icons, empty and loading states; enforce auth-only visibility.
**Independent Test**: Authenticated user sees transaction rows with edit/delete icons; unauthenticated user sees no transaction records; empty state renders when list is empty; `+ Add Transaction` click triggers `openAddDrawer`.
**Prompt**: `/tasks/WP02-transaction-list-ui.md`

### Included Subtasks
- [ ] T004 Update `recent-transactions.html` with full row layout, empty and loading states
- [ ] T005 Update `recent-transactions.ts` to wire icon actions to `DataFlowService`
- [ ] T006 Update `dashboard.html` for `+ Add Transaction` button and auth-only visibility

### Implementation Notes
- Use `@for` for transaction rows; use `@if (!transactions().length)` for empty state
- Edit icon: pencil SVG inline; delete icon: trash SVG inline; both in top-right corner of row
- Auth visibility: derive `isAuthenticated` computed from `SignalService` in dashboard component; show section only when `true`
- `CurrencyPipe` already imported in `recent-transactions.ts`; reuse for amount display
- Loading placeholder: show skeleton rows while signal state is in initial-load state (derive from a `loading` signal in `DashboardSignalService`)

### Parallel Opportunities
- T004 and T005 can proceed together since they are template and class of same component.
- T006 is independent of T004/T005.

### Dependencies
- Depends on WP01.

### Risks & Mitigations
- `SignalService` import path from dashboard component is `../../../shared-services/signal.service`.

**Requirements Refs**: FR-002, FR-003, FR-004, FR-009

---

## Work Package WP03: Add/Edit Drawer & Delete Confirmation (Priority: P1)

**Goal**: Implement the inline DaisyUI add/edit drawer, edit prefill, delete confirmation modal, and form validation.
**Independent Test**: Add drawer opens blank; edit drawer opens with prefilled values; delete modal confirms and removes row; invalid form shows field errors; cancel closes without mutation.
**Prompt**: `/tasks/WP03-drawer-delete-validation.md`

### Included Subtasks
- [ ] T007 Create `transaction-form` component (DaisyUI drawer, add mode)
- [ ] T008 Implement edit prefill from `DashboardSignalService.formState`
- [ ] T009 Create `delete-confirm` component (DaisyUI modal)
- [ ] T010 Integrate `ValidationService` for field-level error display

### Implementation Notes
- `transaction-form` lives in `dashboard/components/transaction-form/`; uses `form()` + `validateStandardSchema(TransactionSchema)`
- DaisyUI drawer: `<div class="drawer">` with `input[type=checkbox]` toggled via signal; no JS manipulation of classList
- Edit mode: when `formState().mode === 'edit'` and `editingTransactionId !== null`, pre-populate `signal<TransactionFormModel>` with matched `TransactionItem` values before `form()` reads it
- On submit success: `DataFlowService.addTransaction` or `DataFlowService.updateTransaction` then `closeDrawer()`
- `delete-confirm` component: `<dialog>` element controlled by `deleteState().isOpen`
- `ValidationService.validate()` called in submission action; errors displayed using `@for (err of field.errors())`

### Parallel Opportunities
- T009 (delete-confirm) can be built in parallel with T007/T008 (transaction-form).
- T010 is internal to T007 template and applied progressively.

### Dependencies
- Depends on WP01 (model, state). WP02 must precede or run alongside (drawer triggered from list icons).

### Risks & Mitigations
- DaisyUI v5 drawer uses checkbox-based toggle — do not use `document.getElementById`. Control via signal-bound `[checked]` or `dialog.open`.
- Signal form `disabled` state during submission must use `disabled()` helper from `@angular/forms/signals`, not `[disabled]` attribute on `[formField]` inputs.

**Requirements Refs**: FR-005, FR-006, FR-008, FR-011

---

## Summary

| WP   | Subtasks | Priority | Depends On | Parallelizable |
|------|----------|----------|------------|----------------|
| WP01 | T001–T003 | P0      | —          | T003 after T001 |
| WP02 | T004–T006 | P1      | WP01       | T004+T005, T006 |
| WP03 | T007–T010 | P1      | WP01       | T009 vs T007+T008 |

**MVP Scope**: WP01 + WP02 gives a visible, authenticated transaction list with add entry point. WP03 completes the full CRUD flow.
