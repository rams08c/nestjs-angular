# Feature: Transaction UI

## Goal
- Show authenticated user transactions inside dashboard integration area
- Support inline add and edit transaction using DaisyUI drawer/modal
- Support delete with confirmation from transaction item actions
- Keep dashboard transaction views synchronized through shared state updates
- Support filtering transactions by search, type, category, and date range
- Support paginated display with 10 records per page and DaisyUI pagination controls

## Routes
- `/dashboard` contains transaction list integration
- `+ Add Transaction` opens inline DaisyUI drawer/modal from dashboard
- Edit icon opens same inline DaisyUI drawer/modal in edit mode with prefilled values
- No separate add/edit route is required for this feature

## UI Components
- Dashboard transaction list section
	- Section title
	- `+ Add Transaction` button
	- Empty state message
	- Loading state placeholder
	- Filter bar (search input, type dropdown, category dropdown, date-from/date-to inputs, reset button)
	- Pagination controls (previous button, page dropdown, "of N" label, next button, results summary)
- Transaction item card/row
	- Amount
	- Category
	- Date
	- Description when present
	- Edit icon in top-right corner
	- Delete icon in top-right corner
- Transaction drawer/modal (DaisyUI inline)
	- Add mode
	- Edit mode
	- Type selector (income | expense)
	- Amount field
	- Category/Income Source field (label changes based on selected type)
	- Date field
	- Description field (optional)
	- Save/submit action
	- Cancel/close action
	- Validation feedback area
- Delete confirmation drawer/modal (DaisyUI inline)
	- Confirmation text
	- Confirm delete action
	- Cancel action

## Filter Bar
- **Search**: text input; filters by transaction description (debounced, sent as `search` query param)
- **Type**: dropdown — All Types / Expense / Income (sent as `type` query param)
- **Category**: dropdown — All Categories, then all user categories (sent as `categoryId` query param)
- **From date**: date input (sent as `dateFrom` query param)
- **To date**: date input (sent as `dateTo` query param)
- **Reset**: button that clears all active filters and reloads page 1

## Pagination Controls
- Uses DaisyUI `btn` and `join` components
- Previous button (disabled on first page) — navigates to page - 1
- Page dropdown: shows "Page N" for each page number, bound to `paginationMeta.page`
- "of N" badge next to dropdown showing total pages
- Next button (disabled on last page) — navigates to page + 1
- Results summary text: "Showing X to Y of Z results"
- Pagination controls only render when `totalPages > 0`

## State
- `TransactionFilterParams` signal in `DashboardSignalService` tracks active filter values
- `PaginationMeta` signal in `DashboardSignalService` tracks `{ total, page, limit, totalPages }`
- Filters and pagination state are exposed via getters on `DataFlowService`
- `applyTransactionFilters(partial)` resets to page 1 and reloads
- `goToTransactionPage(page)` navigates to a specific page and reloads
- `resetTransactionFilters()` clears all filters, resets to page 1, and reloads

## Rules
- Show transaction data only for authenticated user
- If user is unauthenticated or token is expired, do not show private transaction records
- Use Signal-based forms only for add and edit transaction flow
- Do not use Reactive Forms
- Do not use Template-driven forms
- Use shared Validation Service for transaction input validation
- Use Signal Service for transaction state management
- Use Data Flow Service for cross-component transaction updates
- Transaction form includes a `type` selector (income | expense)
- Category dropdown is filtered to only show categories matching the selected type
- Category field label reads "Income Source" when type is `income`, "Category" when type is `expense`
- `type` defaults to `expense` when opening add mode
- Edit action opens transaction form with existing values prefilled
- Delete action requires explicit user confirmation
- After add, edit, or delete, transaction list updates immediately in dashboard context
- Description remains optional
- Applying any filter always resets the page to 1
- Default page size is 10 records per page

## Flow
- Authenticated user opens dashboard
- Dashboard loads page 1 of authenticated user transactions into Signal Service state
- User clicks `+ Add Transaction`
- Inline DaisyUI drawer/modal opens in add mode
- User enters form values and submits
- Validation Service validates form values
- Data Flow Service updates transaction state on success
- Drawer/modal closes and list refreshes from updated state
- User clicks Edit icon on a transaction
- Inline DaisyUI drawer/modal opens in edit mode with prefilled data
- User updates values and submits
- Validation Service validates form values
- Data Flow Service updates transaction state on success
- Drawer/modal closes and list refreshes from updated state
- User clicks Delete icon on a transaction
- Inline DaisyUI confirmation drawer/modal opens
- User confirms deletion
- Data Flow Service removes transaction from state
- List refreshes from updated state
- User types in the search input
- `applyTransactionFilters({ search })` is called, page resets to 1, API is called with new params
- User selects a type/category/date filter
- `applyTransactionFilters({ ... })` is called, page resets to 1, API is called with new params
- User clicks next/prev pagination buttons or selects a page from the dropdown
- `goToTransactionPage(page)` is called, API is called with updated page param
- User clicks Reset Filters
- All filters cleared, page resets to 1, API reloaded with defaults

## Tasks
- Add transaction list section into dashboard integration layout
- Render transaction item fields: amount, category, date, optional description
- Add top-right edit icon and delete icon for each transaction item
- Implement inline DaisyUI drawer/modal for add transaction
- Reuse inline DaisyUI drawer/modal for edit transaction with prefilled data
- Implement inline DaisyUI delete confirmation drawer/modal
- Create signal-based transaction form model for add/edit
- Integrate shared Validation Service for transaction form validation
- Integrate Signal Service for transaction state
- Integrate Data Flow Service for add/edit/delete propagation across dashboard
- Enforce authenticated-user-only visibility for transaction records
- Add `TransactionFilterParams`, `PaginationMeta`, `PaginatedTransactionResponse` interfaces to `transaction.model.ts`
- Add `transactionFilters` and `transactionPaginationMeta` signals to `DashboardSignalService`
- Expose filter/pagination signals and methods via `DataFlowService`
- Implement filter bar in `RecentTransactions` component with search, type, category, and date inputs
- Implement DaisyUI pagination controls (prev/next buttons + page dropdown + results summary)
- Update `TransactionApiService.getTransactions()` to accept `TransactionFilterParams` and return `PaginatedTransactionResponse`
- Update spec tests for `RecentTransactions` to cover filter inputs and pagination interactions
