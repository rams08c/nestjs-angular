# Data Model: Transaction UI (Frontend)

## Entity: TransactionItem

- `id`: string
- `amount`: number
- `category`: string
- `date`: string (ISO date)
- `description`: string | null
- `userId`: string

## Entity: TransactionFormState

- `mode`: 'add' | 'edit'
- `isOpen`: boolean
- `isSubmitting`: boolean
- `submitError`: string | null
- `editingTransactionId`: string | null
- `values`:
  - `amount`: string
  - `category`: string
  - `date`: string
  - `description`: string

## Entity: DeleteConfirmState

- `isOpen`: boolean
- `targetTransactionId`: string | null

## Derived State

- `visibleTransactions`: transactions filtered by authenticated `userId`
- `sortedTransactions`: visible transactions sorted by date desc
- `hasTransactions`: boolean derived from `visibleTransactions.length`

## Validation Rules

- `amount` is required and must be positive numeric value
- `category` is required
- `date` is required and valid date
- `description` is optional
- Validation is executed through shared Validation Service

## State Transitions

- Idle -> Add Open
- Idle -> Edit Open
- Add Open -> Submitting -> Idle (success)
- Edit Open -> Submitting -> Idle (success)
- Add/Edit Open -> Idle (cancel)
- Idle -> Delete Confirm Open
- Delete Confirm Open -> Idle (confirm)
- Delete Confirm Open -> Idle (cancel)

## Cross-Component Update Contract

- Add transaction updates Signal Service state and notifies Data Flow Service
- Edit transaction updates Signal Service state and notifies Data Flow Service
- Delete transaction updates Signal Service state and notifies Data Flow Service
- Dashboard transaction section re-renders from shared signal state
