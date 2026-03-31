# Data Model: Budget & Goal

## Backend Entities

### Budget

- Table: `budgets`
- Fields:
- `id: string`
- `ownerUserId: string`
- `categoryId: string`
- `limitAmount: decimal(12,2)`
- `period: "monthly"`
- `createdAt: datetime`
- `updatedAt: datetime`
- Relations:
- `ownerUserId -> users.id`
- `categoryId -> categories.id`
- Constraints:
- Unique: (`ownerUserId`, `categoryId`, `period`)
- Index: (`ownerUserId`)
- Computed (response only):
- `usedAmount: number`
- `remainingAmount: number`
- `progressPercent: number`

### Goal

- Table: `goals`
- Fields:
- `id: string`
- `ownerUserId: string`
- `name: string`
- `targetAmount: decimal(12,2)`
- `savedAmount: decimal(12,2)`
- `targetDate: datetime`
- `createdAt: datetime`
- `updatedAt: datetime`
- Relations:
- `ownerUserId -> users.id`
- Constraints:
- Index: (`ownerUserId`)
- Computed (response only):
- `remainingAmount: number`
- `progressPercent: number`

## Backend DTO Shapes

### Budget DTO

- Create:
- `categoryId: string`
- `limitAmount: number`
- `period: "monthly"`
- Update:
- `categoryId?: string`
- `limitAmount?: number`
- `period?: "monthly"`

### Goal DTO

- Create:
- `name: string`
- `targetAmount: number`
- `savedAmount: number`
- `targetDate: string`
- Update:
- `name?: string`
- `targetAmount?: number`
- `savedAmount?: number`
- `targetDate?: string`

## Frontend State Models

### BudgetFormModel

- `categoryId: string`
- `limitAmount: string`
- `period: "monthly"`

### GoalFormModel

- `name: string`
- `targetAmount: string`
- `savedAmount: string`
- `targetDate: string`

### BudgetViewModel

- `id: string`
- `categoryId: string`
- `categoryName: string`
- `limitAmount: number`
- `usedAmount: number`
- `remainingAmount: number`
- `progressPercent: number`
- `period: "monthly"`

### GoalViewModel

- `id: string`
- `name: string`
- `targetAmount: number`
- `savedAmount: number`
- `remainingAmount: number`
- `progressPercent: number`
- `targetDate: string`

## Validation Rules

- Budget:
- `categoryId` required
- `limitAmount` > 0
- `period` must be `monthly`
- Goal:
- `name` required, trimmed non-empty
- `targetAmount` > 0
- `savedAmount` >= 0
- `savedAmount` <= `targetAmount`
- `targetDate` valid date

## State Transitions

### Budget

- Create -> Active
- Update -> Active
- Delete -> Removed
- Read -> Active with recomputed progress

### Goal

- Create -> Active
- Update -> Active
- Delete -> Removed
- Read -> Active with recomputed progress
