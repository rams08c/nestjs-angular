# Quickstart: Budget & Goal

## Backend

- Update Prisma schema with `Budget` and `Goal` models.
- Add migration and apply it.
- Create Nest modules:
- `server/src/budgets/`
- `server/src/goals/`
- Add DTOs for create/update in each module.
- Add JWT-protected controllers:
- `POST /budgets`, `GET /budgets`, `PUT /budgets/:id`, `DELETE /budgets/:id`
- `POST /goals`, `GET /goals`, `PUT /goals/:id`, `DELETE /goals/:id`
- Implement service logic:
- Owner scoping using `ownerUserId` from JWT
- Budget monthly spend aggregation from transactions
- Goal progress calculation
- Register modules in `server/src/app.module.ts`.

## Frontend

- Add Budget and Goal feature components/services under `client/src/app/`.
- Keep UI in existing dashboard wireframe and style system.
- Use Signal-based forms only.
- Use shared Validation Service for all form rules.
- Use Signal Service for feature state.
- Use Data Flow Service for cross-component refresh.
- Render:
- Budget list with used/limit/progress
- Goal list with saved/target/progress
- Add/Edit/Delete actions for both modules

## Verification

- Backend verification:
- Authenticated user can CRUD own budgets/goals.
- Cross-user access is rejected.
- Budget progress matches transaction sums for current monthly window.
- Goal progress and remaining amount are correct.
- Frontend verification:
- Budget/Goal forms validate and submit correctly.
- Dashboard updates after mutations without full reload.
- Styling and spacing match existing dashboard pattern.

## Test Coverage Targets

- Backend:
- Service unit tests for budget and goal rules.
- Controller integration tests for all endpoints.
- Frontend:
- Component tests for form validation and list rendering.
- Service tests for API mapping and state updates.
