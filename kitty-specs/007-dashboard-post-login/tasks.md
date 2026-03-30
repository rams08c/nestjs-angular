# Tasks: Dashboard Post-Login

**Feature**: 007-dashboard-post-login | **Branch**: main  
**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

---

## Subtasks

| ID | Task | WP | Parallel |
|---|---|---|---|
| T001 | Register lazy `/dashboard` route in `app.routes.ts` with `AuthGuard` | WP01 | |
| T002 | Scaffold `DashboardComponent` shell with `OnPush`, three-column layout | WP01 | |
| T003 | Create `DashboardSignalService` with typed interfaces and mock data signals | WP02 | |
| T004 | Create `SidebarNavComponent` with nav links and active route highlight | WP03 | [P] |
| T005 | Create `RightPanelComponent` (user info + upgrade card, hidden < lg) | WP03 | [P] |
| T006 | Create `FinancialOverviewComponent` — three summary cards from signals | WP04 | [P] |
| T007 | Create `SpendingTrendComponent` — 30-day bar visual from signals | WP04 | [P] |
| T008 | Create `RecentTransactionsComponent` — last 5–10 transactions list | WP05 | [P] |
| T009 | Create `BudgetProgressComponent` — per-category progress bars | WP05 | [P] |
| T010 | Create `TopCategoriesComponent` — category spending segments | WP05 | [P] |
| T011 | Wire "+ Add Transaction" button to `/transactions/new` navigation | WP05 | |

---

## WP01 — Dashboard Shell & Route

**Priority**: P1 (foundation — all other WPs depend on this)  
**Subtasks**: T001, T002  
**Estimated size**: ~200 lines

### Requirement Refs
- Route protection, authenticated landing, `OnPush` layout shell

### Subtasks
- [ ] T001 — Add lazy route `{ path: 'dashboard', loadComponent: ..., canActivate: [AuthGuard] }` in `app.routes.ts`
- [ ] T002 — `DashboardComponent`: three-column CSS Grid shell (`sidebar | main | right-panel`), imports child components, `OnPush`

### Implementation Notes
- Three-column layout: `grid-cols-[240px_1fr_280px]` on `lg`, single column on mobile
- Right panel hidden below `lg` via `hidden lg:block`
- `AuthGuard` reuses existing guard from `auth/guards/auth.guard.ts`

### Dependencies
- None (first WP)

---

## WP02 — Dashboard Signal Service

**Priority**: P1 (all components read from this service)  
**Subtasks**: T003  
**Estimated size**: ~180 lines

### Requirement Refs
- Shared signal service, mock data, no API calls, typed interfaces

### Subtasks
- [ ] T003 — Create `dashboard-signal.service.ts` with `signal()` for: `summary`, `spendingTrend`, `recentTransactions`, `budgetProgress`, `topCategories`; initialise with realistic mock data in constructor

### Implementation Notes
- File: `src/app/dashboard/services/dashboard-signal.service.ts`
- Interfaces: `FinancialSummary`, `SpendingDataPoint`, `Transaction`, `BudgetCategory`, `TopCategory` — co-locate in same file or `dashboard.model.ts`
- Mock data: 5 transactions, 5 budget categories, 30 spending data points, 4 top categories
- `providedIn: 'root'`

### Dependencies
- WP01

---

## WP03 — Sidebar & Right Panel

**Priority**: P2 (layout chrome)  
**Subtasks**: T004, T005  
**Estimated size**: ~220 lines  
**Parallel**: T004 and T005 are independent

### Requirement Refs
- Sidebar navigation, active route, right panel user info, responsive hide

### Subtasks
- [ ] T004 — `SidebarNavComponent`: `routerLink` + `routerLinkActive="active"` for each nav item (Dashboard, Transactions, Budgets, Goals, Reports, Accounts, Settings); collapsible on mobile
- [ ] T005 — `RightPanelComponent`: reads current user from `DataFlowService`, shows avatar/name and upgrade card; `hidden lg:block`

### Implementation Notes
- Sidebar nav items as a typed array in component, rendered with `@for`
- Active link uses DaisyUI `menu` component with active class
- Right panel: DaisyUI `card` for upgrade section

### Dependencies
- WP01, WP02

---

## WP04 — Financial Overview & Spending Trend

**Priority**: P2  
**Subtasks**: T006, T007  
**Estimated size**: ~250 lines  
**Parallel**: T006 and T007 are independent

### Requirement Refs
- Financial summary cards, 30-day spending trend chart

### Subtasks
- [ ] T006 — `FinancialOverviewComponent`: three DaisyUI `stat` cards — Total Balance, Monthly Income, Monthly Expenses; reads `dashboardService.summary()`; currency formatted with `| currency`
- [ ] T007 — `SpendingTrendComponent`: 30 vertical bars using `@for` over `spendingTrend()`; bar height via `[style.height.%]`; x-axis shows abbreviated dates

### Implementation Notes
- Cards use `stat`, `stat-title`, `stat-value` DaisyUI classes
- Bar chart: `flex items-end gap-0.5 h-32`; each bar is `flex-1 bg-primary/60 rounded-t`
- No external chart library

### Dependencies
- WP01, WP02

---

## WP05 — Activity Widgets & Add Transaction

**Priority**: P2  
**Subtasks**: T008, T009, T010, T011  
**Estimated size**: ~300 lines  
**Parallel**: T008, T009, T010 are independent

### Requirement Refs
- Recent transactions list, budget progress bars, top categories visual, add transaction button

### Subtasks
- [ ] T008 — `RecentTransactionsComponent`: `@for` over `recentTransactions()`; columns: category icon, description, category label, date, amount (red/green); DaisyUI `table` or list
- [ ] T009 — `BudgetProgressComponent`: `@for` over `budgetProgress()`; DaisyUI `progress` bar per category; show `spent / allocated` label; `computed()` for percentage
- [ ] T010 — `TopCategoriesComponent`: `@for` over `topCategories()`; horizontal stacked segments with `[style.width.%]` per category; colour-coded; legend below
- [ ] T011 — `+ Add Transaction` button in `DashboardComponent` main area header; `router.navigate(['/transactions/new'])` on click; `btn btn-primary` styling

### Implementation Notes
- Transactions: negative amounts in `text-error`, positive in `text-success`
- Budget progress: `computed(() => Math.round((cat.spent / cat.allocated) * 100))` per row
- Top categories: 4 fixed colours from DaisyUI palette (`primary`, `secondary`, `accent`, `neutral`)
- Add button: top-right of main content header row

### Dependencies
- WP01, WP02
