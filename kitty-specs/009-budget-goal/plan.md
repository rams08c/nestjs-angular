# Implementation Plan: Budget & Goal

**Feature**: 009-budget-goal  
**Branch**: main  
**Spec**: /Users/ramkrist/Desktop/Developement/angular-proj/nestjs-angular/kitty-specs/009-budget-goal/spec.md  
**Mission**: software-dev  
**Input**: Concise plan with both backend and frontend; frontend integrated into existing dashboard layout/design

## Summary

Implement authenticated Budget and Goal CRUD on NestJS + Prisma and integrate Angular UI into the existing dashboard layout pattern (same DaisyUI/Tailwind visual system). Deliver shared state updates via Signal Service + Data Flow Service and expose progress metrics (`usedAmount`, `remainingAmount`, `progressPercent`).

## Technical Context

**Language/Version**: TypeScript (NestJS v11.0.6, Angular v21.2.2)  
**Primary Dependencies**: NestJS modules/guards/pipes, Prisma ORM, PostgreSQL, Angular Signals, Tailwind CSS, DaisyUI  
**Storage**: PostgreSQL via Prisma  
**Testing**: NestJS unit/integration tests, Angular component/service tests, contract validation for API payloads  
**Target Platform**: Web SPA + REST API  
**Project Type**: Monorepo with backend and frontend  
**Performance Goals**: CRUD p95 < 250ms for user-scoped operations; dashboard budget/goal refresh without full page reload  
**Constraints**: JWT-scoped access; signal-based forms only; no reactive/template forms; same dashboard design language  
**Scale/Scope**: Single-user scoped Budget/Goal modules with dashboard integration

## Engineering Alignment

- Frontend scope is integrated into existing dashboard layout/style; no new visual language
- Add Budget and Goal module routes/components while preserving current dashboard shell
- Backend and frontend contracts are explicit and typed
- Planning output kept concise and implementation-focused

## Constitution Check

- PASS: NestJS v11.0.6, Prisma-only data access, thin controllers, service-layer business logic
- PASS: JWT-required endpoints with userId scoping
- PASS: PostgreSQL + Prisma migrations and constraints
- PASS: Angular 21.2.2 with standalone components and signal-based forms only
- PASS: Shared Validation Service, Signal Service, and Data Flow Service usage
- PASS: Tailwind + DaisyUI continuity for existing dashboard design

## Project Structure

### Documentation Artifacts

```text
kitty-specs/009-budget-goal/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
```

### Planned Source Touch Points

```text
server/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
└── src/
    ├── app.module.ts
    ├── budgets/
    │   ├── budgets.module.ts
    │   ├── budgets.controller.ts
    │   ├── budgets.service.ts
    │   └── dto/
    └── goals/
        ├── goals.module.ts
        ├── goals.controller.ts
        ├── goals.service.ts
        └── dto/

client/src/app/
├── app.routes.ts
├── app.constant.ts
├── shared-services/
│   ├── signal.service.ts
│   ├── data-flow.service.ts
│   └── validation.service.ts
├── dashboard/
│   ├── dashboard.ts
│   ├── dashboard.html
│   └── components/
└── budget-goal/
    ├── budget/
    ├── goal/
    └── services/
```

**Structure Decision**: Keep monorepo split (`server`, `client`) and add feature-based modules on each side.

## Phase 0: Research Output Plan

- Confirm progress computation conventions and rounding (`progressPercent` to 2 decimals)
- Confirm budget spend aggregation window for monthly period using `transactionDate`
- Confirm API error response consistency with existing backend error constants
- Confirm frontend route + dashboard embedding approach with same layout patterns

## Phase 1: Design Output Plan

- `data-model.md`: Budget/Goal entities, relations, computed fields, validation rules
- `contracts/openapi.yaml`: Budget + Goal REST contract with request/response schemas
- `quickstart.md`: concise backend + frontend integration/verification flow
- Agent context update script: skipped (no runnable update script found under `/Users/ramkrist/Desktop/Developement/angular-proj/nestjs-angular/.kittify/scripts`)

## Risks

- Existing transaction schema uses `ownerUserId`; new budget/goal schema must align naming consistently
- Budget progress aggregation query could drift from dashboard expectations if period boundary logic differs
- Dashboard coupling risk if Data Flow Service events are not standardized across modules

## Stop Point

Planning phase complete after Phase 1 artifacts are generated. No `tasks.md` or WP files are created in this command.