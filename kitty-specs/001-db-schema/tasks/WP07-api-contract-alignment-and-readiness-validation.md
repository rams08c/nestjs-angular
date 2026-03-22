---
work_package_id: WP07
title: API Contract Alignment and Readiness Validation
lane: planned
dependencies: [WP06]
subtasks:
- T031
- T032
- T033
- T034
- T035
phase: Phase 5 - Readiness
assignee: ''
agent: ''
shell_pid: ''
review_status: ''
reviewed_by: ''
history:
- timestamp: '2026-03-22T10:00:26Z'
  lane: planned
  agent: system
  shell_pid: ''
  action: Prompt generated via /spec-kitty.tasks
requirement_refs:
- FR-001
- FR-003
- FR-005
- FR-006
- FR-007
- FR-010
- FR-013
- FR-015
---

# Work Package Prompt: WP07 - API Contract Alignment and Readiness Validation

## Objectives & Success Criteria

- Align implemented routes/DTOs/statuses with all generated contract YAMLs.
- Validate migration reproducibility and quickstart execution readiness.
- Complete final compliance pass against constitution and feature requirements.

Success criteria:
- Contract-to-code mapping is complete across all seven domains.
- Quickstart checklist can be executed without undocumented steps.
- Final smoke run covers P1, P2, and P3 scenario slices.

## Context & Constraints

- Depends on `WP06` completion.
- Artifacts to validate:
  - `kitty-specs/001-db-schema/contracts/*.yaml`
  - `kitty-specs/001-db-schema/quickstart.md`
  - `kitty-specs/001-db-schema/spec.md`
  - `.kittify/memory/constitution.md`
- No new architecture introduced in this WP; this package is alignment and readiness hardening.

## Implementation Command

- `spec-kitty implement WP07 --base WP06`

## Subtasks & Detailed Guidance

### Subtask T031 - Reconcile endpoint implementation with contracts
- Purpose: eliminate API drift before implementation handoff.
- Steps:
  1. For each contract file, verify route path, method, auth, request fields, response fields, and status codes.
  2. Create a mismatch checklist and resolve implementation-side differences.
  3. Ensure nested group-member routes remain consistent with contract paths.
- Files:
  - `server/src/**/controllers/*.ts` (or module controller files)
  - DTO files under module `dto/` directories
  - `kitty-specs/001-db-schema/contracts/*.yaml`
- Parallel?: No.
- Notes:
  - Prefer aligning code to contracts unless contract is objectively invalid.

### Subtask T032 - Validate migration and client generation reproducibility [P]
- Purpose: ensure schema setup path is stable for new contributors.
- Steps:
  1. Run migration flow from quickstart sequence.
  2. Run `npx prisma generate` and ensure no generation errors.
  3. Verify table/constraint existence.
- Files:
  - `server/prisma/schema.prisma`
  - migration outputs
  - `kitty-specs/001-db-schema/quickstart.md`
- Parallel?: Yes.
- Notes:
  - Document any observed prerequisite gaps.

### Subtask T033 - Execute constitution compliance pass [P]
- Purpose: ensure implementation adheres to all mandatory architecture and auth rules.
- Steps:
  1. Verify thin controllers and service-based business logic.
  2. Verify JWT enforcement defaults.
  3. Verify Prisma-only data access.
  4. Verify DTO validation in all module inputs.
- Files:
  - `.kittify/memory/constitution.md`
  - `server/src/**/*.ts`
- Parallel?: Yes.
- Notes:
  - Record any deviations and remediate before review.

### Subtask T034 - Update feature documentation and implementation notes
- Purpose: keep planning docs synchronized with actual deliverables.
- Steps:
  1. Update `kitty-specs/001-db-schema/quickstart.md` if command or file paths changed.
  2. Add notes in `kitty-specs/001-db-schema/tasks.md` if dependency execution changed materially.
  3. Ensure no stale assumptions remain in planning artifacts.
- Files:
  - `kitty-specs/001-db-schema/quickstart.md`
  - `kitty-specs/001-db-schema/tasks.md`
- Parallel?: No.
- Notes:
  - Keep updates concise and implementation-focused.

### Subtask T035 - Run final smoke verification across user stories
- Purpose: validate end-to-end readiness for implementation review.
- Steps:
  1. P1 smoke: create user (name/email), update profile, create category.
  2. P2 smoke: create personal transaction and list by filters.
  3. P3 smoke: create group, add member, create group transaction, generate and save report.
  4. Capture any defects and patch before review handoff.
- Files:
  - module services/controllers across users/profile/categories/transactions/groups/group-members/reports
- Parallel?: No.
- Notes:
  - This is smoke validation, not a full automated test suite.

## Test Strategy

Smoke-run checklist driven by user stories:
- Story 1 (account + profile)
- Story 2 (personal transactions)
- Story 3 (group transactions + reports)

## Risks & Mitigations

- Risk: hidden contract drift discovered late.
  - Mitigation: explicit route-by-route reconciliation matrix.
- Risk: quickstart gaps for fresh setup.
  - Mitigation: rerun quickstart from clean state and patch docs immediately.

## Review Guidance

- Reviewer should inspect contract alignment evidence first.
- Reviewer should verify constitution checklist evidence.
- Reviewer should run smoke steps for all priority stories.

## Activity Log

- 2026-03-22T10:00:26Z - system - lane=planned - Prompt created.
