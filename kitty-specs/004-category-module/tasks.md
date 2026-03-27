# Work Packages: Category Module

**Feature**: `004-category-module`
**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)
**Branch**: `main`

---

## Subtask Index

| ID   | Description                                                                 | WP   |
|------|-----------------------------------------------------------------------------|------|
| T001 | Update Prisma `Category` model for `isSystem` and nullable `ownerUserId`   | WP01 |
| T002 | Create migration and regenerate Prisma client                               | WP01 |
| T003 | Add category error constants in `server/src/app.constant.ts`               | WP01 |
| T004 | Expose category error helpers in `server/src/common/error.util.ts`         | WP01 |
| T005 | Create DTOs: `CreateCategoryDto`, `UpdateCategoryDto`                      | WP02 |
| T006 | Create `CategoriesModule` and register in `AppModule`                      | WP02 |
| T007 | Implement service `create` with forced `isSystem=false`                    | WP03 |
| T008 | Implement service `findAll` with visibility filter                          | WP03 |
| T009 | Implement service `findOne` with visibility rule                            | WP03 |
| T010 | Implement service `update` with ownership + system protection               | WP03 |
| T011 | Implement service `remove` with ownership + system protection               | WP03 |
| T012 | Implement controller routes (POST/GET/GET:id/PUT:id/DELETE:id)             | WP04 |
| T013 | Apply JWT auth and inject `userId` via `@CurrentUserId()`                  | WP04 |
| T014 | [P] Add unit tests for category service rules                               | WP05 |
| T015 | [P] Add e2e tests for category endpoints and protection paths               | WP05 |

---

## WP01: Schema & Error Foundation (Priority: P0)

**Goal**: Ensure database shape and shared error contracts are ready.
**Independent Test**: Migration runs cleanly; constants compile and are importable.
**Requirements Refs**: FR-001, FR-002

### Included Subtasks
- [ ] T001 Update Prisma `Category` model for `isSystem` and nullable `ownerUserId`
- [ ] T002 Create migration and regenerate Prisma client
- [ ] T003 Add category error constants in `server/src/app.constant.ts`
- [ ] T004 Expose category error helpers in `server/src/common/error.util.ts`

### Implementation Sketch
- Adjust schema and constraints
- Run migration
- Add reusable category error messages

### Parallel Opportunities
- T003 and T004 can run after T001

### Dependencies
- None

### Risks & Mitigations
- Risk: migration conflicts with existing category constraints
- Mitigation: inspect generated SQL before apply

---

## WP02: DTOs & Module Wiring (Priority: P0)

**Goal**: Establish module skeleton and validated request contracts.
**Independent Test**: Server boots with module and DTO validation works for invalid payloads.
**Requirements Refs**: FR-003, FR-004

### Included Subtasks
- [ ] T005 Create DTOs: `CreateCategoryDto`, `UpdateCategoryDto`
- [ ] T006 Create `CategoriesModule` and register in `AppModule`

### Implementation Sketch
- Define input validation for `name` and `type`
- Prevent user-side control of `isSystem`
- Wire module into app imports

### Parallel Opportunities
- None (small coupled setup)

### Dependencies
- Depends on WP01

### Risks & Mitigations
- Risk: DTO mismatch with schema enum mapping
- Mitigation: centralize enum conversion in service layer

---

## WP03: Category Service Rules (Priority: P1)

**Goal**: Implement complete business rules for visibility, ownership, and system immutability.
**Independent Test**: Service methods enforce all authorization and mutation guards.
**Requirements Refs**: FR-005, FR-006, FR-007, FR-008

### Included Subtasks
- [ ] T007 Implement service `create` with forced `isSystem=false`
- [ ] T008 Implement service `findAll` with visibility filter
- [ ] T009 Implement service `findOne` with visibility rule
- [ ] T010 Implement service `update` with ownership + system protection
- [ ] T011 Implement service `remove` with ownership + system protection

### Implementation Sketch
- Create: attach `ownerUserId` from JWT
- Read: return system + owned user categories only
- Update/Delete: reject when `isSystem=true` or owner mismatch

### Parallel Opportunities
- T008 and T009 can be developed in parallel after service scaffold

### Dependencies
- Depends on WP01, WP02

### Risks & Mitigations
- Risk: leaking non-owned categories through incorrect query conditions
- Mitigation: standardize where-clause helper for visibility and ownership checks

---

## WP04: Controller & Endpoint Contract (Priority: P1)

**Goal**: Expose all REST endpoints with JWT-scoped category operations.
**Independent Test**: Endpoint responses and status codes match contract.
**Requirements Refs**: FR-009, FR-010

### Included Subtasks
- [ ] T012 Implement controller routes (POST/GET/GET:id/PUT:id/DELETE:id)
- [ ] T013 Apply JWT auth and inject `userId` via `@CurrentUserId()`

### Implementation Sketch
- Keep controller thin and delegate to service
- Map status codes: 201, 200, 204, 403, 404

### Parallel Opportunities
- None (small integration package)

### Dependencies
- Depends on WP03

### Risks & Mitigations
- Risk: incorrect status code mapping on forbidden/system paths
- Mitigation: explicit exception mapping and endpoint tests

---

## WP05: Verification Tests (Priority: P2)

**Goal**: Validate category business rules and API behavior end-to-end.
**Independent Test**: Unit and e2e suites pass for system/user edge cases.
**Requirements Refs**: FR-011, FR-012

### Included Subtasks
- [ ] T014 [P] Add unit tests for category service rules
- [ ] T015 [P] Add e2e tests for category endpoints and protection paths

### Implementation Sketch
- Unit: service-level rule matrix
- e2e: auth + CRUD + forbidden paths (`isSystem=true`, owner mismatch)

### Parallel Opportunities
- T014 and T015 can run in parallel

### Dependencies
- Depends on WP04

### Risks & Mitigations
- Risk: flaky e2e due to shared DB state
- Mitigation: isolate fixtures per test and clean up records
