# Data Model: Dashboard Post-Login

## Interfaces (TypeScript)

### FinancialSummary
```ts
interface FinancialSummary {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}
```

### SpendingDataPoint
```ts
interface SpendingDataPoint {
  date: string;      // 'YYYY-MM-DD'
  amount: number;
}
```

### Transaction
```ts
interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: string;      // 'YYYY-MM-DD'
  description: string;
}
```

### BudgetCategory
```ts
interface BudgetCategory {
  category: string;
  allocated: number;
  spent: number;
}
```

### TopCategory
```ts
interface TopCategory {
  category: string;
  amount: number;
  percentage: number;
}
```

## DashboardSignalService Signals

| Signal | Type | Description |
|---|---|---|
| `summary` | `Signal<FinancialSummary>` | Balance, income, expenses |
| `spendingTrend` | `Signal<SpendingDataPoint[]>` | Last 30 days |
| `recentTransactions` | `Signal<Transaction[]>` | Last 5–10 entries |
| `budgetProgress` | `Signal<BudgetCategory[]>` | Per-category budget vs spent |
| `topCategories` | `Signal<TopCategory[]>` | Top spending categories |

## Mock Data Samples

### FinancialSummary mock
```ts
{ totalBalance: 12450.00, monthlyIncome: 5000.00, monthlyExpenses: 2340.75 }
```

### Transaction mock (sample)
```ts
{ id: 't1', amount: -85.50, category: 'Food & Dining', date: '2026-03-28', description: 'Grocery store' }
```

### BudgetCategory mock (sample)
```ts
{ category: 'Food & Dining', allocated: 500, spent: 320 }
```

### TopCategory mock (sample)
```ts
{ category: 'Food & Dining', amount: 320, percentage: 38 }
```
