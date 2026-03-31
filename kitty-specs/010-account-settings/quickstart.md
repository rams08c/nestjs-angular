# Quickstart: Account & Settings

## Backend

- Update `server/prisma/schema.prisma` with `AccountType`, `Account`, and `Transaction.accountId`
- Reuse `Profile` for Settings persistence
- Create and apply Prisma migration
- Add `server/src/accounts/` and `server/src/settings/`
- Register modules in `server/src/app.module.ts`
- Add feature error constants in `server/src/app.constant.ts`
- Expose JWT-protected `POST/GET/PUT/DELETE /accounts` and `GET/PUT /settings`

## Frontend

- Add account/settings endpoints and text in `client/src/app/app.constant.ts`
- Extend shared validation, signal, and data-flow services
- Add dashboard section flows for `accounts` and `settings`
- Keep forms signal-based only
- Require `accountId` selection in transaction forms

## Verification

- Users CRUD only owned accounts
- Users read/update only own settings
- Account delete fails while referenced by transactions
- Transaction create/update requires valid `accountId`
- Dashboard refreshes feature state without full reload

## Test Coverage Targets

- Nest service + controller/integration coverage for ownership and delete guard
- Angular component + service coverage for form validation, API mapping, and shared-state refresh