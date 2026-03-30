# Research: Dashboard Post-Login

## Signal Service Pattern

- **Decision**: Single `DashboardSignalService` owns all dashboard signals
- **Rationale**: Constitution mandates one global signal service; prevents state fragmentation
- **Pattern**: `signal()` for raw data, `computed()` for derived values, `effect()` if reactive side-effects needed
- **Alternatives considered**: Component-level signals — rejected (violates constitution)

## Mock Data Strategy

- **Decision**: Static mock objects initialised inside `DashboardSignalService` constructor
- **Rationale**: No API integration in scope; mock data must be realistic enough to validate UI
- **Pattern**: Hardcode typed arrays/objects; replace with HTTP calls in a future iteration
- **Alternatives considered**: JSON file import — unnecessary complexity for a single service

## Chart / Visual Representation

- **Decision**: Native Tailwind CSS bar segments for spending trend and category breakdown
- **Rationale**: No external chart library required per spec; DaisyUI progress component covers budget bars
- **Alternatives considered**: Chart.js, ngx-charts — rejected (external dependency, overkill for mock)

## Layout Approach

- **Decision**: CSS Grid three-column layout (sidebar fixed, main scrollable, right panel optional)
- **Rationale**: Tailwind `grid-cols` with `lg:` breakpoint; right panel hidden below `lg`
- **Alternatives considered**: Flexbox — less predictable for three-column fixed/scrollable split

## Route Guard

- **Decision**: Reuse existing `AuthGuard` from `auth/guards/`; reads `DataFlowService.isAuthenticated()`
- **Rationale**: Guard already exists in the project; no duplication needed
- **Alternatives considered**: Inline `canActivate` fn — valid, but existing guard is already wired

## Change Detection

- **Decision**: `ChangeDetectionStrategy.OnPush` on all components
- **Rationale**: Constitution requirement; signals trigger targeted re-renders automatically
