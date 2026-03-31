# Feature: Account & Settings

## Goal
- Build Account and Settings modules for a money tracking application with NestJS v11.0.6, PostgreSQL, Prisma ORM, and Angular v21.2.2
- Manage authenticated user financial accounts for `cash`, `bank`, and `card`
- Manage authenticated user profile and preference updates through a single Settings module
- Enforce JWT authentication on all Account and Settings operations
- Require every transaction record to reference an `accountId`
- Use signal-based forms only for all Account and Settings frontend flows

## API
- `POST /accounts` - create account for authenticated `userId`
- `GET /accounts` - list accounts for authenticated `userId`
- `PUT /accounts/:id` - update owned account by `id`
- `DELETE /accounts/:id` - delete owned account by `id`
- `GET /settings` - get settings for authenticated `userId`
- `PUT /settings` - update settings for authenticated `userId`
- All endpoints require JWT authentication

## DTO
- `CreateAccountDto`
- `name`: string, required, trimmed, 1 to 100 chars
- `type`: `cash | bank | card`, required
- `balance`: decimal, required
- `UpdateAccountDto`
- `name`: string, optional, trimmed, 1 to 100 chars
- `type`: `cash | bank | card`, optional
- `balance`: decimal, optional
- `UpdateSettingsDto`
- `firstName`: string, optional, trimmed, 1 to 80 chars
- `lastName`: string, optional, trimmed, 1 to 80 chars
- `profilePic`: string, optional, valid URL or stored asset path
- `location`: string, optional, trimmed, 1 to 120 chars
- `address`: string, optional, trimmed, 1 to 255 chars
- `country`: string, optional, trimmed, 1 to 100 chars (ISO 3166-1 alpha-2 code)
- `SettingsResponseDto`
- `firstName`: string | null
- `lastName`: string | null
- `profilePic`: string | null
- `location`: string | null
- `address`: string | null
- `country`: string | null
- `AccountFormValue`
- `name`: string, required, trimmed, 1 to 100 chars
- `type`: `cash | bank | card`, required
- `balance`: number | string, required
- `SettingsFormValue`
- `firstName`: string, optional, trimmed, 1 to 80 chars
- `lastName`: string, optional, trimmed, 1 to 80 chars
- `profilePic`: string, optional
- `location`: string, optional, trimmed, 1 to 120 chars
- `address`: string, optional, trimmed, 1 to 255 chars
- `country`: string, optional, trimmed, 1 to 100 chars (ISO 3166-1 alpha-2 code)

## Rules
- JWT authentication required for all Account and Settings routes
- `userId` must be read from JWT payload only
- Account records must always belong to the authenticated user
- Settings record must always be scoped to the authenticated user
- Users must not read, update, or delete another user's account
- Users must not read or update another user's settings
- `DELETE /accounts/:id` must fail when transactions still reference the account unless replacement logic is added later
- Transactions must require valid `accountId` on create and update flows
- Account `balance` stored as Prisma `Decimal`
- Settings update must support partial updates
- Settings read must return a user-scoped record or an empty user-scoped shape
- Signal-based forms only
- No Reactive Forms
- No Template-driven Forms
- Shared Validation Service must own account and settings validation rules
- Signal Service must own Account and Settings state
- Data Flow Service must publish Account and Settings updates across components
- Unauthorized responses must follow existing auth redirect and token cleanup behavior on the client

## DB (Prisma)
- `enum AccountType`
- `CASH`
- `BANK`
- `CARD`
- `model Account`
- `id`: `String`, `@id`, `@default(uuid())`
- `name`: `String`
- `type`: `AccountType`
- `balance`: `Decimal`, `@db.Decimal(14, 2)`
- `userId`: `String`
- `createdAt`: `DateTime`, `@default(now())`
- `updatedAt`: `DateTime`, `@updatedAt`
- `user`: relation to `User`
- `transactions`: relation to `Transaction[]`
- `@@index([userId])`
- `model Profile` (used as Settings persistence)
- `id`: `String`, `@id`, `@default(uuid())`
- `userId`: `String`, `@unique`
- `firstName`: `String?`
- `lastName`: `String?`
- `profilePic`: `String?`
- `location`: `String?`
- `address`: `String?`
- `country`: `String?`
- `createdAt`: `DateTime`, `@default(now())`
- `updatedAt`: `DateTime`, `@updatedAt`
- `user`: relation to `User`
- `@@unique([userId])`
- `model Transaction`
- `accountId`: `String`
- `account`: relation to `Account`
- Add foreign key from `Transaction.accountId` to `Account.id`

## Settings UI Behaviour

- When the Settings panel opens, profile fields are shown in **read-only** mode using a `<dl>` list
- If no profile data exists yet, a placeholder message is shown with a prompt to click **Edit Profile**
- An **Edit Profile** button in the panel header switches the panel to **edit mode**
- Edit mode shows a signal-based form with all profile fields and a **Country** dropdown
- The **Country** field is a `<select>` populated from `app.countries.ts` (ISO 3166-1 alpha-2 codes)
- The form has a **Save Settings** button and a **Cancel** button
- On successful save the panel returns to read-only mode and shows a success banner
- On error a banner with `APP_ERROR_MESSAGES.SETTINGS.SAVE_FAILED` is shown
- **Cancel** reverts the form to the last saved values and returns to read-only mode


## Tasks
- Add `AccountType` enum to Prisma schema
- Add `Account` model to Prisma schema
- Add `Settings` model to Prisma schema
- Update `Transaction` model to include required `accountId` relation
- Create Prisma migration for Account, Settings, and Transaction account relation changes
- Generate Prisma client after schema update
- Create `accounts` Nest module, controller, service, and DTOs
- Create `settings` Nest module, controller, service, and DTOs
- Apply JWT auth guard to all account and settings routes
- Resolve authenticated `userId` from existing auth decorator or guard context
- Implement account create, list, update, and delete with ownership checks
- Implement settings get and update with user-scoped persistence
- Block account delete when dependent transactions exist unless replacement flow is introduced
- Add account list, create, edit, and delete Angular UI flows
- Add settings display and update Angular UI flow
- Extend shared Validation Service with account and settings validators
- Add Signal Service state for Account and Settings data
- Add Data Flow Service events for account and settings updates
- Add signal form models for account and settings flows
- Add API service methods for account and settings endpoints
- Update transaction UI flows to require `accountId` selection and submission
- Add unit, component, integration, and e2e coverage for account and settings flows