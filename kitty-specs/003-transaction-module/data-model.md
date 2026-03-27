# Data Model: Transaction Module

## Existing Prisma Model (no changes required)

```prisma
model Transaction {
  id              String   @id @default(cuid())
  ownerUserId     String                          // FK → User.id (from JWT)
  categoryId      String                          // FK → Category.id
  groupId         String?                         // FK → Group.id (nullable)
  amount          Decimal  @db.Decimal(12, 2)     // > 0 enforced at DTO level
  currency        String   @db.Char(3)            // ISO 4217 (e.g. USD)
  note            String?                         // optional description
  transactionDate DateTime                        // date of transaction
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  owner    User     @relation(fields: [ownerUserId], references: [id], onDelete: Cascade)
  category Category @relation(fields: [categoryId], references: [id], onDelete: Restrict)
  group    Group?   @relation(fields: [groupId], references: [id], onDelete: SetNull)

  @@map("transactions")
}
```

## Relationships

| Relation    | Type        | Notes                                     |
|-------------|-------------|-------------------------------------------|
| `User`      | Many → One  | `ownerUserId` scopes all queries          |
| `Category`  | Many → One  | Carries `type` (INCOME/EXPENSE)           |
| `Group`     | Many → One  | Optional; null = personal transaction     |

## Field-level Validation Rules

| Field            | Rule                        |
|------------------|-----------------------------|
| `amount`         | Decimal > 0                 |
| `currency`       | Exactly 3 characters        |
| `categoryId`     | Valid cuid, must exist in DB|
| `transactionDate`| Valid ISO 8601 date-time    |
| `ownerUserId`    | Set from JWT, never from body|
