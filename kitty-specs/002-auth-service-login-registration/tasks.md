# Work Packages: Auth Service Login Registration

**Inputs**: Design documents from `/kitty-specs/002-auth-service-login-registration/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/auth.yaml, quickstart.md

**Tests**: No mandatory test suite was explicitly requested; include smoke validation and integration checks inside implementation WPs.

**Organization**: Fine-grained subtasks (`Txxx`) roll up into independently deliverable work packages (`WPxx`).

**Prompt Files**: Each work package maps to a prompt file in `/tasks/`.

## Subtask Format: `[Txxx] [P?] Description`
- **[P]** indicates safe parallelization by file/concern.

---

## Work Package WP01: Auth Schema Foundation (Priority: P0)

**Goal**: Extend persistence model for authentication credentials and token lifecycle state.  
**Independent Test**: Prisma schema validates and migration applies with new auth fields present.  
**Prompt**: `/tasks/WP01-auth-schema-foundation.md`

**Requirements Refs**: FR-005, FR-006

### Included Subtasks
- [x] T001 Add auth credential fields to user persistence model (`passwordHash`, `refreshTokenHash`)
- [x] T002 Add constraints/index updates for unique email lookup reliability
- [x] T003 Generate and apply Prisma migration for auth fields
- [x] T004 Regenerate Prisma client after schema update
- [x] T005 Validate migration rollback/readiness and local DB sync

### Implementation Notes
- Preserve existing DB rules and normalized structure.
- Store only hashed credential and hashed refresh token state.

### Parallel Opportunities
- T004 can run in parallel with T005 after T003 completes.

### Dependencies
- None.

### Risks & Mitigations
- Risk: migration drift with existing local schema.  
  Mitigation: verify generated SQL and migrate from clean branch state.

### Estimated Prompt Size
- ~300 lines

---

## Work Package WP02: Auth Module Core Infrastructure (Priority: P0)

**Goal**: Establish NestJS auth module, JWT strategy stack, guards, and shared token utilities.  
**Independent Test**: Auth module compiles, JWT strategies load, and protected-route guard wiring is functional.  
**Prompt**: `/tasks/WP02-auth-module-core-infrastructure.md`

**Requirements Refs**: FR-010, FR-011, FR-012

### Included Subtasks
- [ ] T006 Create `auth` feature module structure (module/controller/service, dto/guards/strategies folders)
- [ ] T007 Configure JWT access and refresh token services with secrets/expiry config
- [ ] T008 Implement JWT access strategy and global auth guard integration
- [ ] T009 [P] Implement JWT refresh strategy and refresh guard
- [ ] T010 Add token utility methods for signing and claim shaping (`sub`, email, tokenType)

### Implementation Notes
- Keep controllers thin and business logic in auth service.
- Ensure only register/login are public; all others remain protected by default.

### Parallel Opportunities
- T009 can proceed parallel to T008 after base JWT config (T007).

### Dependencies
- Depends on WP01.

### Risks & Mitigations
- Risk: inconsistent token claim format between access and refresh.  
  Mitigation: centralize token payload builder and signing methods.

### Estimated Prompt Size
- ~320 lines

---

## Work Package WP03: Registration Flow (Priority: P1) 🎯 MVP

**Goal**: Implement `POST /auth/register` with DTO validation, bcrypt hashing, duplicate email handling, and token-pair return.  
**Independent Test**: Valid registration returns access+refresh tokens; duplicate email and short password are rejected.  
**Prompt**: `/tasks/WP03-registration-flow.md`

**Requirements Refs**: FR-001, FR-003, FR-004, FR-005, FR-006, FR-009

### Included Subtasks
- [ ] T011 Create register DTO with required name/email/password and min length 8
- [ ] T012 Implement register service flow: duplicate check, bcrypt hash, user create
- [ ] T013 Persist refresh token hash after successful registration token issuance
- [ ] T014 Implement register controller endpoint and response shape alignment
- [ ] T015 Validate register edge cases (duplicate email, password too short, email normalization)

### Implementation Notes
- Registration must return token pair as contract output.
- Never persist raw password or raw refresh token.

### Parallel Opportunities
- T014 can proceed in parallel with T013 once T012 signatures stabilize.

### Dependencies
- Depends on WP02.

### Risks & Mitigations
- Risk: email case collisions causing duplicate account loopholes.  
  Mitigation: normalize email before lookup/persistence and enforce unique constraint.

### Estimated Prompt Size
- ~340 lines

---

## Work Package WP04: Login Flow (Priority: P1)

**Goal**: Implement `POST /auth/login` with bcrypt password verification and token pair issuance.  
**Independent Test**: Valid credentials return access+refresh tokens; invalid credentials return unauthorized.  
**Prompt**: `/tasks/WP04-login-flow.md`

**Requirements Refs**: FR-002, FR-007, FR-008

### Included Subtasks
- [ ] T016 Create login DTO with required email/password validation
- [ ] T017 Implement login credential verification against `passwordHash` using bcrypt compare
- [ ] T018 Implement token-pair generation and refresh hash update on successful login
- [ ] T019 Implement login controller endpoint and error mapping
- [ ] T020 Validate login edge cases (unknown email, wrong password, malformed input)

### Implementation Notes
- Keep unauthorized responses consistent for unknown email and wrong password.
- Ensure refresh token storage updates on each successful login.

### Parallel Opportunities
- T019 can proceed parallel to T018 after service signatures are set.

### Dependencies
- Depends on WP02.

### Risks & Mitigations
- Risk: timing/user-enumeration leakage in auth failure messaging.  
  Mitigation: use unified unauthorized response semantics.

### Estimated Prompt Size
- ~330 lines

---

## Work Package WP05: Refresh Token Flow (Priority: P1)

**Goal**: Implement `POST /auth/refresh` with refresh token validation and token renewal behavior.  
**Independent Test**: Valid refresh token returns new token pair; invalid/expired token is rejected.  
**Prompt**: `/tasks/WP05-refresh-token-flow.md`

**Requirements Refs**: FR-008, FR-009, FR-010, FR-011

### Included Subtasks
- [ ] T021 Create refresh DTO and refresh endpoint contract mapping
- [ ] T022 Implement refresh guard/strategy validation pipeline
- [ ] T023 Implement refresh service flow: verify token hash and issue renewed tokens
- [ ] T024 Rotate and persist updated refresh token hash after successful refresh
- [ ] T025 Validate refresh edge cases (expired token, token mismatch, replay attempt)

### Implementation Notes
- Refresh endpoint is in-scope for this feature by planning confirmation.
- Access token payload must preserve `sub` userId claim.

### Parallel Opportunities
- T021 and T022 can begin in parallel after WP02 baseline.

### Dependencies
- Depends on WP03, WP04.

### Risks & Mitigations
- Risk: accepting leaked refresh token without DB hash match.  
  Mitigation: enforce hash verification against persisted state before rotation.

### Estimated Prompt Size
- ~350 lines

---

## Work Package WP06: Protected Endpoint Enforcement and Hardening (Priority: P2)

**Goal**: Enforce auth defaults across non-public routes, align API contract behavior, and complete readiness validation.  
**Independent Test**: Only `/auth/register` and `/auth/login` are public; protected endpoints reject invalid/missing Bearer token; auth contracts align with implementation.  
**Prompt**: `/tasks/WP06-protected-endpoint-enforcement-and-hardening.md`

**Requirements Refs**: FR-010, FR-011, FR-012

### Included Subtasks
- [ ] T026 Audit and enforce public-route exceptions and protected-route defaults
- [ ] T027 [P] Ensure authenticated request context consistently exposes `userId` for downstream services
- [ ] T028 Reconcile implemented endpoints/status codes with `contracts/auth.yaml`
- [ ] T029 [P] Add auth-flow smoke checks for register/login/refresh/protected access
- [ ] T030 Update docs/config guidance (env variables, quickstart consistency)

### Implementation Notes
- Keep API behavior consistent with REST and constitution rules.
- Ensure no protected endpoint bypass remains.

### Parallel Opportunities
- T027 and T029 can run in parallel after core endpoint implementation.

### Dependencies
- Depends on WP05.

### Risks & Mitigations
- Risk: route-level guard inconsistency across modules.  
  Mitigation: apply shared auth guard strategy and verify endpoint matrix.

### Estimated Prompt Size
- ~320 lines

---

## Dependency & Execution Summary

- **Sequence**: WP01 -> WP02 -> (WP03 + WP04) -> WP05 -> WP06.
- **Parallelization**:
  - WP03 and WP04 can run in parallel after WP02.
  - Internal [P] tasks in WP02, WP05, WP06 can be split by agent.
- **MVP Scope**: WP01 + WP02 + WP03 + WP04 (register/login with secure credential handling and token pair output).

---

## Subtask Index (Reference)

| Subtask ID | Summary | Work Package | Priority | Parallel? |
|------------|---------|--------------|----------|-----------|
| T001 | Add auth fields to user model | WP01 | P0 | No |
| T002 | Enforce auth constraints/indexes | WP01 | P0 | No |
| T003 | Create and apply auth migration | WP01 | P0 | No |
| T004 | Regenerate Prisma client | WP01 | P0 | Yes |
| T005 | Validate DB sync/rollback readiness | WP01 | P0 | No |
| T006 | Create auth module scaffold | WP02 | P0 | No |
| T007 | Configure JWT services | WP02 | P0 | No |
| T008 | Implement access strategy/guard | WP02 | P0 | No |
| T009 | Implement refresh strategy/guard | WP02 | P0 | Yes |
| T010 | Add token utility helpers | WP02 | P0 | No |
| T011 | Register DTO validation | WP03 | P1 | No |
| T012 | Register service hashing/create flow | WP03 | P1 | No |
| T013 | Persist refresh hash on register | WP03 | P1 | No |
| T014 | Register endpoint/controller mapping | WP03 | P1 | Yes |
| T015 | Validate register edge cases | WP03 | P1 | No |
| T016 | Login DTO validation | WP04 | P1 | No |
| T017 | Login credential verification | WP04 | P1 | No |
| T018 | Login token pair + refresh hash update | WP04 | P1 | No |
| T019 | Login endpoint/controller mapping | WP04 | P1 | Yes |
| T020 | Validate login edge cases | WP04 | P1 | No |
| T021 | Refresh DTO + contract mapping | WP05 | P1 | Yes |
| T022 | Refresh strategy/guard pipeline | WP05 | P1 | Yes |
| T023 | Refresh service token verification/issue | WP05 | P1 | No |
| T024 | Refresh token rotation persistence | WP05 | P1 | No |
| T025 | Validate refresh edge cases | WP05 | P1 | No |
| T026 | Enforce public/protected route policy | WP06 | P2 | No |
| T027 | Propagate userId auth context | WP06 | P2 | Yes |
| T028 | Contract alignment validation | WP06 | P2 | No |
| T029 | Run auth smoke checks | WP06 | P2 | Yes |
| T030 | Update quickstart/config docs | WP06 | P2 | No |
