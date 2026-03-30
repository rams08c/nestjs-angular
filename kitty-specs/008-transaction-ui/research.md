# Research: Transaction UI

## Decisions

- Decision: Frontend-only implementation for this feature scope.
- Rationale: User explicitly requested frontend-only plan.
- Alternatives considered: Include backend API contract updates for transactions.

- Decision: Use inline DaisyUI drawer/modal for add/edit and delete confirmation.
- Rationale: Matches requested UX and dashboard integration requirement.
- Alternatives considered: Dedicated `/transactions/new` and `/transactions/:id/edit` routes.

- Decision: Use signal-based forms via `@angular/forms/signals`.
- Rationale: Required by frontend constitution and feature rules.
- Alternatives considered: Reactive Forms, Template-driven forms.

- Decision: Use shared Validation Service for transaction field checks.
- Rationale: Enforces single validation source and avoids duplication.
- Alternatives considered: Component-local validation logic.

- Decision: Use global Signal Service for transaction state and Data Flow Service for cross-component updates.
- Rationale: Required by architecture rules and needed for dashboard-wide refresh behavior.
- Alternatives considered: Component-owned local state.

- Decision: Restrict transaction visibility to authenticated user with token-expiry-aware auth state.
- Rationale: Required by auth and domain scoping rules.
- Alternatives considered: Unscoped list rendering.

## Planning Outcomes

- No backend endpoints are added in this plan.
- No API contract files are generated for this phase.
- Focus is UI state, interaction flow, and dashboard integration.
