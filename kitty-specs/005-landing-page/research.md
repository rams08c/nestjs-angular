# Research: Landing Page

## Decision 1: Public pre-login landing route
- Decision: Add and keep a public landing experience available without authentication.
- Rationale: The feature objective is user discovery before sign in.
- Alternatives considered:
  - Protected landing route: rejected because it blocks first-time visitors.
  - External marketing page: rejected as unnecessary split of codebase.

## Decision 2: UI-only implementation
- Decision: Keep implementation fully static and client-rendered.
- Rationale: Requirement explicitly excludes API integration and backend dependency.
- Alternatives considered:
  - Real-time metrics preview: rejected due to API/data dependency.
  - SSR data fetch: rejected due to no dynamic content need.

## Decision 3: Styling system
- Decision: Use Tailwind CSS with DaisyUI components.
- Rationale: Matches project constitution and user constraints.
- Alternatives considered:
  - Pure custom CSS: rejected because DaisyUI component consistency is required.
  - Additional UI library: rejected to avoid unnecessary styling stack complexity.

## Decision 4: Routing behavior
- Decision: Route users from landing actions to `/login` and `/register` only.
- Rationale: These are the defined entry points for authentication flows.
- Alternatives considered:
  - Additional onboarding route: rejected because not requested in scope.

## Decision 5: Dashboard preview strategy
- Decision: Use finance-style mock cards and chart placeholders only.
- Rationale: Communicates product value while remaining implementation-light.
- Alternatives considered:
  - Embedded charting library with live data: rejected due to out-of-scope integration.
