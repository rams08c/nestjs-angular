# Implementation Plan: Account & Settings

**Feature**: 010-account-settings  
**Branch**: main  
**Spec**: /Users/ramkrist/Desktop/Developement/angular-proj/nestjs-angular/kitty-specs/010-account-settings/spec.md  
**Mission**: software-dev

## Summary

Implement authenticated Account CRUD and Settings read/update across NestJS and Angular. Persist Accounts in a new `Account` model, map Settings to the existing `Profile` table, add `Transaction.accountId`, and reuse shared Validation, Signal, and Data Flow services.

## Technical Context

**Language/Version**: TypeScript, NestJS v11.0.6, Angular v21.2.2  
**Primary Dependencies**: NestJS, Prisma ORM, PostgreSQL, Angular Signals, Tailwind CSS, DaisyUI  
**Storage**: PostgreSQL via Prisma  
**Testing**: Nest unit/integration, Angular component/service, API contract verification  
**Target Platform**: Web SPA + REST API  
**Project Type**: Monorepo with `server/` and `client/`  
**Performance Goals**: user-scoped CRUD p95 under 250ms; dashboard refresh without full reload  
**Constraints**: JWT-only access; signal-based forms only; root `app.constant.ts` owns messages/endpoints; no WP files  
**Scale/Scope**: single-user Account and Settings modules plus transaction linkage update

## Engineering Alignment

- Combined vertical feature with backend and frontend deliverables
- Reuse dashboard section model for `accounts` and `settings`
- Reuse `Profile` instead of creating a duplicate settings table
- Stop after plan artifacts only

## Constitution Check

- PASS: feature modules, thin controllers, service-layer business logic
- PASS: Prisma-only persistence with migrations and relations
- PASS: JWT-required endpoints with authenticated-user scoping
- PASS: standalone Angular components and signal-based forms only
- PASS: Validation Service, Signal Service, and Data Flow Service remain shared dependencies
- PASS: Tailwind + DaisyUI styling continuity

## Project Structure

```text
kitty-specs/010-account-settings/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/

server/
├── prisma/schema.prisma
└── src/{app.constant.ts,app.module.ts,accounts/,settings/,transactions/}

client/src/app/
├── app.constant.ts
├── app.routes.ts
├── dashboard/
└── shared-services/{data-flow.service.ts,signal.service.ts,validation.service.ts}
```

**Structure Decision**: Keep the current monorepo split, add `server/src/accounts/` and `server/src/settings/`, and integrate client flows into the existing dashboard sections.

## Phase 0: Research Output Plan

- Reuse `Profile` for Settings persistence
- Use `ownerUserId` naming for the new Account model
- Restrict account deletion while transactions reference it
- Render Accounts and Settings through existing dashboard navigation

## Phase 1: Design Output Plan

- `data-model.md`: entities, relations, DTO/state shapes, validation rules
- `contracts/openapi.yaml`: Account and Settings REST contract
- `quickstart.md`: concise integration and verification flow
- Agent context update: skipped because no agent update script exists under `/Users/ramkrist/Desktop/Developement/angular-proj/nestjs-angular/.kittify/scripts`

## Risks

- `Transaction.accountId` migration can break current CRUD if applied without service updates
- Feature naming uses Settings while persistence uses `Profile`
- Dashboard has nav labels for Accounts and Settings but no feature implementation yet

## Stop Point

Planning ends with `plan.md`, `research.md`, `data-model.md`, `quickstart.md`, and `contracts/openapi.yaml`. No `tasks.md`, `tasks/`, or WP files are created.
## Implemented Changes (country + read-only Settings UI)

### Server
- Added `country String?` field to `Profile` model in Prisma schema
- Ran Prisma migration `add_profile_country`
- Updated `UpdateSettingsDto` with `@IsOptional() @IsString() @MaxLength(100) country?: string`
- Updated `SettingsService.toResponse()` and upsert blocks to include `country`

### Client
- Created `client/src/app/app.countries.ts` — 50+ ISO 3166-1 country list
- Added `country: string` to `SettingsFormModel`, `defaultSettingsFormModel`, and `SettingsSchema`
- Added `SETTINGS_COUNTRY_LABEL`, `SETTINGS_COUNTRY_PLACEHOLDER`, `SETTINGS_EDIT`, `SETTINGS_CANCEL`, `SETTINGS_SAVED` to `APP_TEXT.DASHBOARD`
- Added `COUNTRY_MAX` to `APP_ERROR_MESSAGES.SETTINGS`
- Updated `SettingsApiService.SettingsResponse` with `country: string | null`
- Updated `DataFlowService.loadSettings()` and `saveSettings()` to flow `country`
- Rewrote `SettingsPanel` component:
  - Default view is read-only (`<dl>`) showing all profile fields
  - Empty state shows a prompt when no profile exists
  - **Edit Profile** button switches to edit mode
  - Edit form includes all fields plus `<select>` country dropdown
  - On save success: returns to read-only, shows success banner
  - **Cancel** reverts to saved values and returns to read-only

