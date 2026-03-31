# Research: Budget & Goal

## Decisions

- Decision: Use `ownerUserId` naming in backend models for consistency with existing `Transaction` and `Category` models.
- Rationale: Existing schema and services already use `ownerUserId`; reusing avoids mapping confusion.
- Alternatives considered:
- Use `userId` in new models and map at service layer.
- Use mixed naming per module.

- Decision: Compute Budget `usedAmount` from expense transactions filtered by (`ownerUserId`, `categoryId`, monthly date window).
- Rationale: Directly satisfies budget-vs-spend requirement and keeps calculation deterministic.
- Alternatives considered:
- Persist denormalized spend values in Budget row.
- Compute from cached dashboard aggregates only.

- Decision: Return computed fields (`usedAmount`, `remainingAmount`, `progressPercent`) in Budget responses and (`remainingAmount`, `progressPercent`) in Goal responses.
- Rationale: Frontend can render progress immediately without custom recompute per component.
- Alternatives considered:
- Return raw values only and compute in frontend.
- Add dedicated progress endpoints.

- Decision: Keep frontend in existing dashboard wireframe and style system (DaisyUI + Tailwind), adding Budget and Goal panels/routes using same card/table/form patterns.
- Rationale: Matches user alignment and preserves consistent UX.
- Alternatives considered:
- Separate standalone pages with a new layout.
- Minimal dashboard widgets only.

- Decision: Use Signal-based forms with shared Validation Service and synchronize updates via Data Flow Service events.
- Rationale: Required by constitution and existing frontend architecture.
- Alternatives considered:
- Reactive forms.
- Direct component-to-component event chains.

## Best Practices Applied

- Backend controllers delegate all business logic to services.
- JWT guard on all Budget and Goal routes.
- DTO validation for all create/update payloads.
- Prisma migrations used for schema changes.
- Frontend state in Signal Service; cross-module updates in Data Flow Service.
- UI changes reuse existing dashboard component and spacing patterns.
