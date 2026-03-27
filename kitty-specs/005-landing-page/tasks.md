# Work Packages: Landing Page

**Feature**: `005-landing-page`
**Branch**: `main`
**Spec**: `kitty-specs/005-landing-page/spec.md`
**Plan**: `kitty-specs/005-landing-page/plan.md`

---

## WP01: Route and App Shell Setup (Priority: P0)

**Goal**: Register the `/` landing page route in Angular router and ensure no auth guard is applied.
**Independent Test**: Navigating to `/` in browser loads a blank placeholder page without any authentication redirect.

### Included Subtasks
- [ ] T001 Register `/` route in `client/src/app/app.routes.ts` pointing to the landing page component
- [ ] T002 Verify `/login` and `/register` routes exist and are public
- [ ] T003 Create `landing-page` standalone component scaffold in `client/src/app/`

### Implementation Notes
- Use Angular standalone component pattern per constitution.
- No auth guard or `canActivate` must be attached to the landing page route.
- All three route registrations must be present before WP02 work starts.

### Parallel Opportunities
- T002 can be verified in parallel with T001.

### Dependencies
- None (foundation work).

**Requirement Refs**: FR-001, FR-007

---

## WP02: Navbar and Hero Section (Priority: P1)

**Goal**: Build the top navigation bar and the hero section as the first visible experience for landing visitors.
**Independent Test**: Opening `/` renders a full-width navbar with branding left and Login/Register links right, followed by a hero with title, subtitle, and two CTA buttons.

### Included Subtasks
- [ ] T004 [P] Render navbar layout: app name/logo left, Login and Register links right
- [ ] T005 [P] Wire navbar Login link to `/login` route and Register link to `/register` route
- [ ] T006 Build hero section with title and subtitle copy
- [ ] T007 Add `Get Started` CTA button (routes to `/register`) and `Login` CTA button (routes to `/login`)
- [ ] T008 Apply responsive Tailwind/DaisyUI styling for navbar and hero across mobile, tablet, desktop

### Implementation Notes
- Use DaisyUI `navbar` component for the navigation bar.
- Use DaisyUI `btn` variants for CTAs (`btn-primary` for Get Started, `btn-outline` for Login).
- Hero section should use a contrasting background to stand out.
- Text copy should communicate money-tracking value clearly.

### Parallel Opportunities
- T004 and T006 can be built in parallel.

### Dependencies
- Depends on WP01 (component scaffold and routes must exist).

**Requirement Refs**: FR-002, FR-003

---

## WP03: Features Section (Priority: P2)

**Goal**: Render four capability feature cards that communicate product value to first-time visitors.
**Independent Test**: Scrolling to the features area shows exactly four cards: Expense Tracking, Categories, Reports, Group Splitting - each with a heading, brief description, and an icon.

### Included Subtasks
- [ ] T009 Create features section layout with responsive card grid
- [ ] T010 [P] Build Expense Tracking feature card
- [ ] T011 [P] Build Categories feature card
- [ ] T012 [P] Build Reports feature card
- [ ] T013 [P] Build Group Splitting feature card

### Implementation Notes
- Use DaisyUI `card` component for each feature item.
- Use a 2-column grid on tablet and a 4-column grid on desktop, single column on mobile.
- Each card: icon/emoji placeholder, heading, one-sentence description.
- All four cards are required per FR-004.

### Parallel Opportunities
- T010 through T013 (the four cards) can all be built in parallel.

### Dependencies
- Depends on WP01.

**Requirement Refs**: FR-004

---

## WP04: Dashboard Preview Section (Priority: P3)

**Goal**: Show a finance-style dashboard mock using cards and chart placeholders to communicate the product experience visually.
**Independent Test**: The dashboard preview section contains at least three summary cards (e.g., Balance, Income, Expenses) and two chart-style placeholder blocks, all rendered with static mock values.

### Included Subtasks
- [ ] T014 Build dashboard preview section container with section header
- [ ] T015 [P] Create summary cards (Balance, Income, Expenses, Savings) with mock values
- [ ] T016 [P] Create chart placeholder blocks (Spending Trend, Category Split) as styled mock visuals
- [ ] T017 Apply finance-style card layout using DaisyUI `card` and Tailwind grid

### Implementation Notes
- All values are hardcoded mock data - no API calls.
- Chart blocks can be simple colored boxes or SVG placeholders styled to look like bar/pie charts.
- Layout should feel like a real dashboard at a glance; use DaisyUI `stats` component for summary cards.

### Parallel Opportunities
- T015 and T016 can be built in parallel.

### Dependencies
- Depends on WP01.

**Requirement Refs**: FR-005, FR-008

---

## WP05: Footer and Final Polish (Priority: P3)

**Goal**: Complete the page with a footer and validate full responsive behavior across all viewport sizes.
**Independent Test**: Footer is visible below all sections; no horizontal scroll or broken layout at 375px, 768px, and 1440px viewport widths.

### Included Subtasks
- [ ] T018 Build footer with app name/brand text and optional auxiliary links placeholder
- [ ] T019 [P] Validate full page responsive behavior at mobile (375px), tablet (768px), desktop (1440px)
- [ ] T020 [P] Confirm no authenticated route guard fires on any landing page interaction
- [ ] T021 Final review: all four sections render in correct order, all CTAs route correctly

### Implementation Notes
- Use DaisyUI `footer` component.
- Scroll through the full page and check section ordering: navbar -> hero -> features -> dashboard preview -> footer.
- Verify anchor scrolling and link navigation both work without page reload issues in Angular router.

### Parallel Opportunities
- T019 and T020 can be done in parallel.

### Dependencies
- Depends on WP02, WP03, WP04.

**Requirement Refs**: FR-006, FR-007, FR-009

---

## Summary

| WP    | Goal                        | Subtasks | Priority | Depends On         |
|-------|-----------------------------|----------|----------|--------------------|
| WP01  | Route and App Shell Setup   | 3        | P0       | -                  |
| WP02  | Navbar and Hero Section     | 5        | P1       | WP01               |
| WP03  | Features Section            | 5        | P2       | WP01               |
| WP04  | Dashboard Preview Section   | 4        | P3       | WP01               |
| WP05  | Footer and Final Polish     | 4        | P3       | WP02, WP03, WP04   |

- WP02, WP03, WP04 can all start as soon as WP01 is done (parallel).
- WP05 gates on all UI sections being complete.
- MVP: WP01 + WP02 delivers a navigable public landing page with hero and auth links.
