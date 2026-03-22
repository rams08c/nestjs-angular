---
work_package_id: WP06
title: Protected Endpoint Enforcement and Hardening
lane: planned
dependencies: [WP05]
subtasks:
- T026
- T027
- T028
- T029
- T030
phase: Phase 4 - Hardening
assignee: ''
agent: ''
shell_pid: ''
review_status: ''
reviewed_by: ''
history:
- timestamp: '2026-03-22T11:17:43Z'
  lane: planned
  agent: system
  shell_pid: ''
  action: Prompt generated via /spec-kitty.tasks
requirement_refs:
- FR-010
- FR-011
- FR-012
---

# Work Package Prompt: WP06 - Protected Endpoint Enforcement and Hardening

## Objectives & Success Criteria

- Ensure public/protected route policy is fully compliant.
- Ensure authenticated context includes userId for downstream scoping.
- Align implementation with contract and quickstart guidance.

Success criteria:
- Only /auth/register and /auth/login are public.
- Protected route access requires valid Bearer token.
- Auth contract and implementation match for all auth endpoints.

## Context & Constraints

- Depends on WP05.
- Requirements focus: FR-010, FR-011, FR-012.
- Constitution requires all non-public endpoints to require JWT auth.

## Implementation Command

- spec-kitty implement WP06 --base WP05

## Subtasks & Detailed Guidance

### Subtask T026 - Enforce route-level auth defaults
- Purpose: eliminate accidental public access outside allowed auth routes.
- Steps:
  1. Audit controller decorators/guards across backend.
  2. Ensure only register/login are public.
  3. Validate refresh and all protected routes require auth.
- Files:
  - server/src/**/controllers
  - server/src/auth/*
- Parallel?: No.
- Notes:
  - Keep any exceptions explicit and minimal.

### Subtask T027 - Propagate authenticated userId context [P]
- Purpose: support scoped operations in downstream modules.
- Steps:
  1. Verify request user context contains userId/sub.
  2. Ensure auth guard strategy exposes the same shape consistently.
  3. Update helper extraction logic if necessary.
- Files:
  - server/src/auth/strategies/*
  - server/src/common/* or auth helpers
- Parallel?: Yes.
- Notes:
  - Avoid multiple context shapes across modules.

### Subtask T028 - Reconcile implementation with auth contract
- Purpose: remove contract drift before review.
- Steps:
  1. Compare implemented methods/routes/statuses with contracts/auth.yaml.
  2. Reconcile payload fields and validation responses.
  3. Fix mismatches in code first.
- Files:
  - server/src/auth/*
  - kitty-specs/002-auth-service-login-registration/contracts/auth.yaml
- Parallel?: No.
- Notes:
  - Keep contract authoritative unless objectively incorrect.

### Subtask T029 - Run auth smoke checks [P]
- Purpose: verify core user stories end-to-end.
- Steps:
  1. Run register success/failure checks.
  2. Run login success/failure checks.
  3. Run refresh success/failure checks.
  4. Verify protected route rejection for missing/invalid bearer token.
- Files:
  - server/src/auth/*
  - manual run notes
- Parallel?: Yes.
- Notes:
  - Focus on deterministic reproducible smoke checks.

### Subtask T030 - Update quickstart and config guidance
- Purpose: ensure new implementers can run feature without missing steps.
- Steps:
  1. Update quickstart commands if implementation changed.
  2. Confirm env var guidance for JWT secrets and expiries.
  3. Ensure docs mention refresh endpoint in scope.
- Files:
  - kitty-specs/002-auth-service-login-registration/quickstart.md
  - optional backend README section if required
- Parallel?: No.
- Notes:
  - Keep documentation concise and executable.

## Test Strategy

- Smoke validation only (unless explicit tests are later requested).

## Risks & Mitigations

- Risk: hidden public endpoint due to decorator misconfiguration.
  - Mitigation: endpoint matrix audit in this WP.
- Risk: docs drift from implemented auth flow.
  - Mitigation: refresh quickstart and contract alignment before completion.

## Review Guidance

- Reviewers should run endpoint auth matrix checks.
- Verify userId claim propagation in protected request context.
- Verify refresh endpoint remains functional after hardening.

## Activity Log

- 2026-03-22T11:17:43Z - system - lane=planned - Prompt created.
