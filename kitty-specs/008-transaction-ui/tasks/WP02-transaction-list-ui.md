---
work_package_id: "WP02"
subtasks:
  - "T004"
  - "T005"
  - "T006"
title: "Dashboard Transaction List UI"
phase: "Phase 2 - List Experience"
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

# Work Package Prompt: WP02 - Dashboard Transaction List UI

## Objectives & Success Criteria
- Render authenticated transaction list in dashboard with empty/loading states.
- Provide add action and row-level edit/delete actions.

## Context & Constraints
- No separate route for add/edit.
- Keep UI inline in dashboard and use existing design language.

## Subtasks & Detailed Guidance
### Subtask T004 - Update template rendering
- Purpose: Render all transaction fields and row actions.
- Steps:
  1. Update `recent-transactions.html` with `@for` list rows.
  2. Show amount/category/date and optional description.
  3. Add top-right edit/delete action buttons.
  4. Add empty state and loading placeholder.

### Subtask T005 - Wire component actions
- Purpose: Connect row actions to data flow service.
- Steps:
  1. Update `recent-transactions.ts` to inject `DataFlowService`.
  2. Add methods for edit/delete button handlers.
  3. Keep component simple and OnPush.

### Subtask T006 - Update dashboard header and auth visibility
- Purpose: Provide add trigger and auth-gated display.
- Steps:
  1. Add `+ Add Transaction` button in dashboard transaction section.
  2. Wire click to `DataFlowService.openAddTransaction`.
  3. Ensure transaction section is hidden for unauthenticated state.

## Risks & Mitigations
- Risk: Broken layout on mobile. Mitigation: keep row structure responsive with utility classes.

## Review Guidance
- Verify list is only visible when authenticated.
- Verify add/edit/delete UI affordances are clear and accessible.

## Activity Log
- 2026-03-30T11:51:59Z - system - lane=planned - Prompt created.
