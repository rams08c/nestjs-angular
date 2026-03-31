# Work Packages: Budget & Goal

**Inputs**: `/Users/ramkrist/Desktop/Developement/angular-proj/nestjs-angular/kitty-specs/009-budget-goal/spec.md`, `/Users/ramkrist/Desktop/Developement/angular-proj/nestjs-angular/kitty-specs/009-budget-goal/plan.md`, `/Users/ramkrist/Desktop/Developement/angular-proj/nestjs-angular/kitty-specs/009-budget-goal/data-model.md`, `/Users/ramkrist/Desktop/Developement/angular-proj/nestjs-angular/kitty-specs/009-budget-goal/contracts/openapi.yaml`, `/Users/ramkrist/Desktop/Developement/angular-proj/nestjs-angular/kitty-specs/009-budget-goal/research.md`
**Constraint Applied**: Do not generate any `tasks/WPxx-*.md` files

## Subtask Format: `[Txxx] [P?] Description`
- `[P]` means parallel-safe

---

## Work Package WP01: Backend Schema and Foundations (Priority: P0)

**Goal**: Add Budget and Goal persistence foundations and wire modules into Nest app.
**Independent Test**: Prisma migration applies cleanly and app boots with new modules registered.
**Prompt**: Not generated (per user request)
**Requirements Refs**: FR-001, FR-002, FR-003, FR-004

### Included Subtasks
- [ ] T001 Update `server/prisma/schema.prisma` with `Budget` model using `ownerUserId`, `categoryId`, `limitAmount`, `period`, timestamps
- [ ] T002 Update `server/prisma/schema.prisma` with `Goal` model using `ownerUserId`, `name`, `targetAmount`, `savedAmount`, `targetDate`, timestamps
- [ ] T003 Add Prisma relations/constraints: budget unique (`ownerUserId`, `categoryId`, `period`), indexes by `ownerUserId`
- [ ] T004 Create and apply migration for Budget and Goal tables
- [ ] T005 Create `server/src/budgets/budgets.module.ts`
- [ ] T006 Create `server/src/goals/goals.module.ts`
- [ ] T007 Register `BudgetsModule` and `GoalsModule` in `server/src/app.module.ts`

### Implementation Notes
- Align ownership field naming with existing `Transaction.ownerUserId`.
- Keep schema normalized and Prisma-first.

### Parallel Opportunities
- T005 and T006 can run in parallel after T001-T004.

### Dependencies
- None

### Risks & Mitigations
- Risk: naming mismatch (`userId` vs `ownerUserId`)
- Mitigation: enforce consistent field naming in schema and services from start

---

## Work Package WP02: Budget Backend API and Logic (Priority: P0)

**Goal**: Implement authenticated Budget CRUD and progress calculation from transactions.
**Independent Test**: Authenticated user performs full Budget CRUD and receives correct progress fields.
**Prompt**: Not generated (per user request)
**Requirements Refs**: FR-001, FR-005, FR-006, FR-007, FR-008

### Included Subtasks
- [ ] T008 Create Budget DTOs in `server/src/budgets/dto/` for create/update
- [ ] T009 Implement Budget validation rules (`limitAmount > 0`, `period=monthly`, ownership constraints)
- [ ] T010 Create `server/src/budgets/budgets.service.ts` with user-scoped create/list/update/delete
- [ ] T011 Implement monthly `usedAmount` aggregation from expense transactions by `categoryId`
- [ ] T012 Implement derived fields in service response: `remainingAmount`, `progressPercent` (2 decimals)
- [ ] T013 Create `server/src/budgets/budgets.controller.ts` with `POST/GET/PUT/DELETE /budgets`
- [ ] T014 Apply JWT guard and authenticated `ownerUserId` extraction in controller/service flow

### Implementation Notes
- No business logic in controller.
- Recompute progress on reads.

### Parallel Opportunities
- T008 and T009 can run in parallel.
- T013 can start after service method contracts stabilize.

### Dependencies
- Depends on WP01

### Risks & Mitigations
- Risk: incorrect monthly window logic
- Mitigation: centralize month boundary helper and validate with edge-date tests

---

## Work Package WP03: Goal Backend API and Logic (Priority: P0)

**Goal**: Implement authenticated Goal CRUD and progress calculation.
**Independent Test**: Authenticated user performs full Goal CRUD and receives accurate progress metrics.
**Prompt**: Not generated (per user request)
**Requirements Refs**: FR-002, FR-009, FR-010, FR-011

### Included Subtasks
- [ ] T015 Create Goal DTOs in `server/src/goals/dto/` for create/update
- [ ] T016 Implement Goal validation rules (`targetAmount > 0`, `savedAmount >= 0`, `savedAmount <= targetAmount`, valid `targetDate`)
- [ ] T017 Create `server/src/goals/goals.service.ts` with user-scoped create/list/update/delete
- [ ] T018 Implement derived Goal fields: `remainingAmount`, `progressPercent` (2 decimals)
- [ ] T019 Create `server/src/goals/goals.controller.ts` with `POST/GET/PUT/DELETE /goals`
- [ ] T020 Apply JWT guard and authenticated `ownerUserId` scoping

### Implementation Notes
- Keep response shape aligned with OpenAPI contract.

### Parallel Opportunities
- T015 and T016 can run in parallel.

### Dependencies
- Depends on WP01

### Risks & Mitigations
- Risk: inconsistent response typing vs contract
- Mitigation: validate controller return types against contract schema fields

---

## Work Package WP04: Frontend API and Shared State Integration (Priority: P1)

**Goal**: Provide Budget/Goal frontend service layer integrated with Signal Service and Data Flow Service.
**Independent Test**: Frontend services can fetch/mutate Budget and Goal data and propagate updates to dashboard consumers.
**Prompt**: Not generated (per user request)
**Requirements Refs**: FR-003, FR-012, FR-013, FR-014

### Included Subtasks
- [ ] T021 Create Budget API service in `client/src/app/budget-goal/services/` for CRUD calls
- [ ] T022 Create Goal API service in `client/src/app/budget-goal/services/` for CRUD calls
- [ ] T023 Add typed request/response models for Budget and Goal frontend contracts
- [ ] T024 Integrate Signal Service state slices for Budget and Goal collections/loading/errors
- [ ] T025 Integrate Data Flow Service events for create/update/delete synchronization
- [ ] T026 Add centralized API error mapping using existing constants patterns in `client/src/app/app.constant.ts`

### Implementation Notes
- Keep shared state outside components.
- Preserve existing error-handling patterns.

### Parallel Opportunities
- T021 and T022 can run in parallel.
- T024 and T025 can run in parallel after model contracts are settled.

### Dependencies
- Depends on WP02, WP03

### Risks & Mitigations
- Risk: stale dashboard views after mutation
- Mitigation: emit one standard Data Flow refresh signal per successful mutation

---

## Work Package WP05: Budget Frontend UI in Existing Dashboard Layout (Priority: P1)

**Goal**: Implement Budget UI flows using same dashboard wireframe/design system and signal-based forms.
**Independent Test**: User can create/update/delete Budget entries and see used vs limit progress in dashboard-style UI.
**Prompt**: Not generated (per user request)
**Requirements Refs**: FR-003, FR-015, FR-016, FR-017

### Included Subtasks
- [ ] T027 Create Budget list/view components under `client/src/app/budget-goal/budget/`
- [ ] T028 Create Budget create/edit form with Signal-based forms only
- [ ] T029 Integrate shared Validation Service into Budget form rules and messages
- [ ] T030 Render `usedAmount`, `remainingAmount`, `progressPercent` with existing card/progress styles
- [ ] T031 Add Budget CRUD UI actions wired to service/state layer
- [ ] T032 Integrate Budget panel/section into existing dashboard layout without visual redesign

### Implementation Notes
- Match spacing, cards, typography, and progress styles already used.

### Parallel Opportunities
- T027 and T028 can run in parallel.

### Dependencies
- Depends on WP04

### Risks & Mitigations
- Risk: design drift from dashboard baseline
- Mitigation: reuse existing DaisyUI classes and component patterns

---

## Work Package WP06: Goal Frontend UI in Existing Dashboard Layout (Priority: P1)

**Goal**: Implement Goal UI flows using same dashboard wireframe/design system and signal-based forms.
**Independent Test**: User can create/update/delete Goal entries and see percentage progress in dashboard-style UI.
**Prompt**: Not generated (per user request)
**Requirements Refs**: FR-003, FR-018, FR-019, FR-020

### Included Subtasks
- [ ] T033 Create Goal list/view components under `client/src/app/budget-goal/goal/`
- [ ] T034 Create Goal create/edit form with Signal-based forms only
- [ ] T035 Integrate shared Validation Service into Goal form rules and messages
- [ ] T036 Render `savedAmount`, `remainingAmount`, `progressPercent` in existing dashboard visual style
- [ ] T037 Add Goal CRUD UI actions wired to service/state layer
- [ ] T038 Integrate Goal panel/section into existing dashboard layout without visual redesign

### Implementation Notes
- Keep UI behavior consistent with transaction/dashboard interactions.

### Parallel Opportunities
- T033 and T034 can run in parallel.

### Dependencies
- Depends on WP04

### Risks & Mitigations
- Risk: inconsistent date handling for `targetDate`
- Mitigation: normalize date formatting/parsing in one helper used by form and list

---

## Work Package WP07: Validation and Quality Gates (Priority: P2)

**Goal**: Add backend/frontend tests and end-to-end verification for Budget and Goal flows.
**Independent Test**: Automated tests pass and manual quickstart flow succeeds for authenticated users.
**Prompt**: Not generated (per user request)
**Requirements Refs**: FR-021, FR-022, FR-023, FR-024

### Included Subtasks
- [ ] T039 Add backend unit tests for Budget service rules and progress calculations
- [ ] T040 Add backend unit tests for Goal service rules and progress calculations
- [ ] T041 Add backend controller/integration tests for Budget CRUD endpoints
- [ ] T042 Add backend controller/integration tests for Goal CRUD endpoints
- [ ] T043 Add frontend component tests for Budget forms/list rendering and validation
- [ ] T044 Add frontend component tests for Goal forms/list rendering and validation
- [ ] T045 Execute quickstart verification and fix contract mismatches

### Implementation Notes
- Validate user-scoping and rejection of cross-user access.

### Parallel Opportunities
- T039/T040 and T043/T044 can run in parallel.

### Dependencies
- Depends on WP05, WP06

### Risks & Mitigations
- Risk: flaky integration assertions on computed fields
- Mitigation: assert deterministic fixture data with fixed dates/amounts

---

## Dependency & Execution Summary

- Sequence:
- WP01 -> WP02 + WP03 -> WP04 -> WP05 + WP06 -> WP07
- Parallelization:
- WP02 and WP03 can run in parallel after WP01
- WP05 and WP06 can run in parallel after WP04
- MVP recommendation:
- MVP = WP01 + WP02 + WP03 + WP04 + WP05
- Goal module UI can follow immediately as WP06

---

## Subtask Index

| Subtask ID | Summary | Work Package | Priority | Parallel |
|------------|---------|--------------|----------|----------|
| T001-T007 | Backend schema and module setup | WP01 | P0 | Partial |
| T008-T014 | Budget backend API + logic | WP02 | P0 | Partial |
| T015-T020 | Goal backend API + logic | WP03 | P0 | Partial |
| T021-T026 | Frontend services + shared state | WP04 | P1 | Partial |
| T027-T032 | Budget dashboard UI integration | WP05 | P1 | Partial |
| T033-T038 | Goal dashboard UI integration | WP06 | P1 | Partial |
| T039-T045 | Tests and verification | WP07 | P2 | Partial |
