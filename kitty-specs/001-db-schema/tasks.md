# Work Packages: DB Schema

**Inputs**: Design documents from `/kitty-specs/001-db-schema/`  
**Prerequisites**: plan.md (required), spec.md (user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Not explicitly required by stakeholders; include only implementation-time smoke validation and migration verification.

**Organization**: Fine-grained subtasks (`Txxx`) roll up into work packages (`WPxx`). Each work package is independently deliverable and reviewable.

**Prompt Files**: Each work package references a matching prompt file in `/tasks/`.

## Subtask Format: `[Txxx] [P?] Description`
- **[P]** indicates the subtask can proceed in parallel.
- Subtasks are ordered by dependency-aware execution sequence.

---

## Work Package WP01: Prisma Schema Foundation (Priority: P0)

**Goal**: Establish canonical Prisma schema, enums, constraints, and first migration for all seven entities.  
**Independent Test**: `npx prisma migrate dev --name init-db-schema` succeeds and all expected tables/constraints exist.  
**Prompt**: `/tasks/WP01-prisma-schema-foundation.md`

**Requirements Refs**: FR-001, FR-002, FR-004, FR-008, FR-009, FR-012, FR-014

### Included Subtasks
- [ ] T001 Replace `server/prisma/schema.prisma` with final seven-model schema and enums
- [ ] T002 Add table/column mappings, relation actions, and unique constraints
- [ ] T003 Configure monetary precision and currency field definitions for `transactions`
- [ ] T004 Generate and verify initial migration files
- [ ] T005 Validate Prisma client generation and compile-time type output

### Implementation Notes
- Treat `server/prisma/schema.prisma` as single source of truth.
- Keep profile as optional 1:1 relation.
- Use hybrid reports design (`snapshotData` JSON optional).

### Parallel Opportunities
- T004 and T005 can run in parallel after T001-T003 complete.

### Dependencies
- None.

### Risks & Mitigations
- Risk: migration drift with previous local schemas.  
  Mitigation: regenerate from clean schema baseline and verify generated SQL before apply.

### Estimated Prompt Size
- ~320 lines

---

## Work Package WP02: Core Backend Foundations (Priority: P0)

**Goal**: Ensure shared NestJS backend foundations for authenticated, user-scoped feature modules.  
**Independent Test**: Server boots with Prisma module, JWT guard pathing, and global validation/error pipeline ready for feature endpoints.  
**Prompt**: `/tasks/WP02-core-backend-foundations.md`

**Requirements Refs**: FR-015

### Included Subtasks
- [ ] T006 Wire `PrismaModule` and `PrismaService` for feature module usage
- [ ] T007 Ensure JWT auth defaults are applied (public-only auth routes remain excluded)
- [ ] T008 [P] Add/align shared validation pipes and DTO validation conventions
- [ ] T009 [P] Add/align centralized API error handling approach
- [ ] T010 Create common user-scope helper pattern for service-level query filters

### Implementation Notes
- Keep controllers thin; keep filtering/business logic in services only.
- Apply constitution rule: all data access scoped by authenticated `userId`.

### Parallel Opportunities
- T008 and T009 are parallel once T006 is stable.

### Dependencies
- Depends on WP01.

### Risks & Mitigations
- Risk: inconsistent user scoping across modules.  
  Mitigation: enforce shared helper + review checklist in each service method.

### Estimated Prompt Size
- ~300 lines

---

## Work Package WP03: User, Profile, Category Modules (Priority: P1) 🎯 MVP

**Goal**: Deliver account creation with mandatory name/email, optional profile updates, and user-scoped categories.  
**Independent Test**: New user can register with name/email only, update profile later, and create/list personal categories.  
**Prompt**: `/tasks/WP03-user-profile-category-modules.md`

**Requirements Refs**: FR-003, FR-004, FR-005, FR-006, FR-015

### Included Subtasks
- [ ] T011 Implement users module DTOs/service/controller for create/read/update/delete scope
- [ ] T012 Implement profile module DTOs/service/controller with optional fields only
- [ ] T013 [P] Implement categories module DTOs/service/controller with `(ownerUserId, name)` uniqueness
- [ ] T014 Enforce user-scoped query filtering in users/profile/categories services
- [ ] T015 Validate endpoint response shapes against contracts for users/profile/categories

### Implementation Notes
- Creation flow must not require profile fields.
- Profile operations are idempotent upsert/update behavior by `userId`.

### Parallel Opportunities
- T013 can run in parallel with T011-T012 once shared foundations exist.

### Dependencies
- Depends on WP02.

### Risks & Mitigations
- Risk: accidental cross-user category reads.  
  Mitigation: assert `ownerUserId` filter in every category query path.

### Estimated Prompt Size
- ~360 lines

---

## Work Package WP04: Personal Transactions Module (Priority: P2)

**Goal**: Deliver user-scoped personal transaction CRUD with category linkage and financial validation.  
**Independent Test**: Authenticated user can create/list/update/delete personal transactions where `groupId` is null.  
**Prompt**: `/tasks/WP04-personal-transactions-module.md`

**Requirements Refs**: FR-007, FR-008, FR-009, FR-015

### Included Subtasks
- [ ] T016 Implement transactions DTOs for personal flow (`groupId` optional)
- [ ] T017 Implement transactions service CRUD with owner and category enforcement
- [ ] T018 [P] Implement transactions controller endpoints and query filters (date range/category)
- [ ] T019 Add amount/currency/date validation and decimal serialization mapping
- [ ] T020 Validate personal transaction behavior and edge cases (zero amount, invalid category)

### Implementation Notes
- Keep personal flow explicit by default (`groupId = null`).
- Use strict validation to block zero/negative amount.

### Parallel Opportunities
- T018 can proceed in parallel after T016-T017 contracts are stable.

### Dependencies
- Depends on WP03.

### Risks & Mitigations
- Risk: decimal precision or serialization mismatch.  
  Mitigation: map Prisma Decimal to string consistently in response DTO mapping.

### Estimated Prompt Size
- ~340 lines

---

## Work Package WP05: Groups and Membership Module (Priority: P3)

**Goal**: Implement group lifecycle and membership management for future expense splitting.  
**Independent Test**: User can create group, become OWNER, add/remove MEMBER users, and membership uniqueness is enforced.  
**Prompt**: `/tasks/WP05-groups-and-membership-module.md`

**Requirements Refs**: FR-010, FR-011, FR-012, FR-015

### Included Subtasks
- [ ] T021 Implement groups DTOs/service/controller for CRUD with owner controls
- [ ] T022 Implement group-members DTOs/service/controller for add/list/remove
- [ ] T023 Enforce role and ownership rules (OWNER/MEMBER) in service layer
- [ ] T024 [P] Enforce unique membership and conflict handling (`groupId`, `userId`)
- [ ] T025 Validate group/member endpoints against contracts

### Implementation Notes
- Group creator auto-provisioned as OWNER membership.
- Member management operations require owner authorization.

### Parallel Opportunities
- T024 can run parallel with endpoint scaffolding after model/service wiring starts.

### Dependencies
- Depends on WP03.

### Risks & Mitigations
- Risk: duplicate membership race conditions.  
  Mitigation: rely on DB unique constraint and map Prisma conflict errors to HTTP 409.

### Estimated Prompt Size
- ~350 lines

---

## Work Package WP06: Group Transactions and Hybrid Reports (Priority: P3)

**Goal**: Extend transactions into group context and implement report generation + snapshot persistence.  
**Independent Test**: Group transaction can be recorded for valid group member context; report can be generated on-demand and persisted with matching totals.  
**Prompt**: `/tasks/WP06-group-transactions-and-hybrid-reports.md`

**Requirements Refs**: FR-007, FR-009, FR-013, FR-014, FR-015

### Included Subtasks
- [ ] T026 Extend transactions service for group transaction checks and membership-scoped access
- [ ] T027 Implement reports DTOs/service/controller for generate/list/get/delete
- [ ] T028 Implement hybrid report flow: derived generation and optional snapshot save
- [ ] T029 [P] Add report range/type validation and owner/group scoping guards
- [ ] T030 Validate persisted-vs-derived totals and report retrieval flows

### Implementation Notes
- Group transactions require group context + participant access checks.
- Report persistence stores aggregate payload in `snapshotData`.

### Parallel Opportunities
- T029 can run in parallel with T027-T028 service/controller coding.

### Dependencies
- Depends on WP04, WP05.

### Risks & Mitigations
- Risk: mismatch between generated and persisted report totals.  
  Mitigation: share one aggregation function used by both generate and save paths.

### Estimated Prompt Size
- ~380 lines

---

## Work Package WP07: API Contract Alignment and Readiness Validation (Priority: P2)

**Goal**: Align implemented endpoints with OpenAPI contracts and complete readiness checks from quickstart.  
**Independent Test**: All contract files map to implemented routes/DTOs, migrations are reproducible, and quickstart validation checklist passes.  
**Prompt**: `/tasks/WP07-api-contract-alignment-and-readiness-validation.md`

**Requirements Refs**: FR-001, FR-003, FR-005, FR-006, FR-007, FR-010, FR-013, FR-015

### Included Subtasks
- [ ] T031 Reconcile route paths, request/response DTOs, and error statuses with contract YAMLs
- [ ] T032 [P] Validate migration reproducibility and prisma generate flow from quickstart sequence
- [ ] T033 [P] Verify constitution compliance checklist across controllers/services/modules
- [ ] T034 Update feature docs and endpoint notes where implementation diverges from earlier plan assumptions
- [ ] T035 Perform final smoke execution of core user journeys (P1-P3)

### Implementation Notes
- Treat contracts in `kitty-specs/001-db-schema/contracts/` as canonical interface expectations.
- Preserve REST behavior and auth constraints from constitution.

### Parallel Opportunities
- T032 and T033 can run in parallel with T031 after endpoint surfaces stabilize.

### Dependencies
- Depends on WP06.

### Risks & Mitigations
- Risk: contract drift between docs and code.  
  Mitigation: route-by-route reconciliation checklist before review handoff.

### Estimated Prompt Size
- ~330 lines

---

## Dependency & Execution Summary

- **Sequence**: WP01 → WP02 → WP03 → (WP04 + WP05 in parallel) → WP06 → WP07.
- **Parallelization**:
  - WP04 and WP05 are parallel after WP03.
  - Internal [P] tasks in WP02, WP03, WP04, WP05, WP06, WP07 can be split across agents.
- **MVP Scope**: WP01 + WP02 + WP03 (first valuable release: user creation/profile/category).

---

## Subtask Index (Reference)

| Subtask ID | Summary | Work Package | Priority | Parallel? |
|------------|---------|--------------|----------|-----------|
| T001 | Replace Prisma schema | WP01 | P0 | No |
| T002 | Add constraints and relations | WP01 | P0 | No |
| T003 | Configure amount/currency fields | WP01 | P0 | No |
| T004 | Generate migration files | WP01 | P0 | No |
| T005 | Validate Prisma client generation | WP01 | P0 | No |
| T006 | Wire Prisma module/service | WP02 | P0 | No |
| T007 | Apply JWT-by-default auth | WP02 | P0 | No |
| T008 | Shared validation conventions | WP02 | P0 | Yes |
| T009 | Centralized API error handling | WP02 | P0 | Yes |
| T010 | User-scope helper pattern | WP02 | P0 | No |
| T011 | Users module implementation | WP03 | P1 | No |
| T012 | Profile module implementation | WP03 | P1 | No |
| T013 | Categories module implementation | WP03 | P1 | Yes |
| T014 | Enforce user-scoped queries | WP03 | P1 | No |
| T015 | Validate users/profile/categories contracts | WP03 | P1 | No |
| T016 | Personal transaction DTOs | WP04 | P2 | No |
| T017 | Personal transaction service CRUD | WP04 | P2 | No |
| T018 | Transactions controller + filters | WP04 | P2 | Yes |
| T019 | Financial validation + decimal mapping | WP04 | P2 | No |
| T020 | Personal transaction edge validations | WP04 | P2 | No |
| T021 | Groups module implementation | WP05 | P3 | No |
| T022 | Group-members module implementation | WP05 | P3 | No |
| T023 | Owner/member authorization rules | WP05 | P3 | No |
| T024 | Membership conflict handling | WP05 | P3 | Yes |
| T025 | Validate groups/members contracts | WP05 | P3 | No |
| T026 | Group-aware transaction checks | WP06 | P3 | No |
| T027 | Reports module implementation | WP06 | P3 | No |
| T028 | Hybrid report generate/save flow | WP06 | P3 | No |
| T029 | Report validation + scoping guards | WP06 | P3 | Yes |
| T030 | Derived vs persisted totals validation | WP06 | P3 | No |
| T031 | Contract-to-endpoint reconciliation | WP07 | P2 | No |
| T032 | Migration + generation reproducibility | WP07 | P2 | Yes |
| T033 | Constitution compliance verification | WP07 | P2 | Yes |
| T034 | Documentation + endpoint notes updates | WP07 | P2 | No |
| T035 | Final multi-story smoke execution | WP07 | P2 | No |
