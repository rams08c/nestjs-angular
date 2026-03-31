# Research: Account & Settings

## Decisions

- Decision: Add `Account` and `AccountType` with `ownerUserId` ownership.
- Rationale: existing user-scoped financial models already use `ownerUserId`.
- Alternatives considered: `userId` naming only; free-text account type.

- Decision: Implement Settings as a module over the existing `Profile` table.
- Rationale: the schema already stores the required profile fields there.
- Alternatives considered: separate `Settings` table; auth-owned profile endpoints.

- Decision: Require `Transaction.accountId` and block account deletion while referenced.
- Rationale: preserves transaction integrity and satisfies feature linkage rules.
- Alternatives considered: nullable `accountId`; cascade-delete transactions.

- Decision: Integrate through existing dashboard sections and shared services.
- Rationale: routes, nav text, Validation Service, Signal Service, and Data Flow Service already match that architecture.
- Alternatives considered: standalone pages; component-owned shared state.

## Best Practices Applied

- Thin controllers, service-owned business rules
- Root `app.constant.ts` for server/client messages and endpoints
- Typed contracts and centralized auth/error handling
- Signal-based forms with shared validation