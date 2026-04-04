# Feature: Transaction UI

## Goal
- Show authenticated user transactions inside dashboard integration area
- Support inline add and edit transaction using DaisyUI drawer/modal
- Support delete with confirmation from transaction item actions
- Keep dashboard transaction views synchronized through shared state updates

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

## Flow
- Authenticated user opens dashboard
- Dashboard loads authenticated user transactions into Signal Service state
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
