# Data Model: DB Schema

**Feature**: 001-db-schema  
**Date**: 2026-03-22  
**Source**: research.md + spec.md  

---

## Prisma Schema

```prisma
// server/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── Enums ───────────────────────────────────────────────────────────────────

enum CategoryType {
  INCOME
  EXPENSE
}

enum GroupRole {
  OWNER
  MEMBER
}

enum ReportType {
  PERSONAL_SUMMARY
  GROUP_SUMMARY
  CATEGORY_BREAKDOWN
  DATE_RANGE
}

// ─── Models ───────────────────────────────────────────────────────────────────

model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  profile      Profile?
  transactions Transaction[]
  categories   Category[]
  ownedGroups  Group[]       @relation("GroupOwner")
  groupMembers GroupMember[]
  reports      Report[]

  @@map("users")
}

model Profile {
  id         String   @id @default(cuid())
  userId     String   @unique
  firstName  String?
  lastName   String?
  profilePic String?
  location   String?
  address    String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("profiles")
}

model Category {
  id          String       @id @default(cuid())
  ownerUserId String
  name        String
  type        CategoryType
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  owner        User          @relation(fields: [ownerUserId], references: [id], onDelete: Cascade)
  transactions Transaction[]

  @@unique([ownerUserId, name])
  @@map("categories")
}

model Group {
  id          String   @id @default(cuid())
  ownerUserId String
  name        String
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  owner        User          @relation("GroupOwner", fields: [ownerUserId], references: [id], onDelete: Cascade)
  members      GroupMember[]
  transactions Transaction[]
  reports      Report[]

  @@map("groups")
}

model GroupMember {
  id        String    @id @default(cuid())
  groupId   String
  userId    String
  role      GroupRole @default(MEMBER)
  joinedAt  DateTime  @default(now())

  group Group @relation(fields: [groupId], references: [id], onDelete: Cascade)
  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([groupId, userId])
  @@map("group_members")
}

model Transaction {
  id              String   @id @default(cuid())
  ownerUserId     String
  categoryId      String
  groupId         String?
  amount          Decimal  @db.Decimal(12, 2)
  currency        String   @db.Char(3)
  note            String?
  transactionDate DateTime
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  owner    User      @relation(fields: [ownerUserId], references: [id], onDelete: Cascade)
  category Category  @relation(fields: [categoryId], references: [id], onDelete: Restrict)
  group    Group?    @relation(fields: [groupId], references: [id], onDelete: SetNull)

  @@map("transactions")
}

model Report {
  id           String     @id @default(cuid())
  ownerUserId  String
  groupId      String?
  reportType   ReportType
  rangeStart   DateTime
  rangeEnd     DateTime
  snapshotData Json?
  generatedAt  DateTime   @default(now())
  createdAt    DateTime   @default(now())

  owner User   @relation(fields: [ownerUserId], references: [id], onDelete: Cascade)
  group Group? @relation(fields: [groupId], references: [id], onDelete: SetNull)

  @@map("reports")
}
```

---

## Entity Relationship Summary

```
User ──1:1──► Profile
User ──1:N──► Category
User ──1:N──► Transaction (as ownerUserId)
User ──1:N──► Group (as ownerUserId)
User ──1:N──► GroupMember
User ──1:N──► Report

Category ──1:N──► Transaction

Group ──1:N──► GroupMember
Group ──1:N──► Transaction (groupId nullable — null = personal)
Group ──1:N──► Report (groupId nullable — null = personal report)

Transaction ──N:1──► Category
Transaction ──N:1──► User
Transaction ──N:1──► Group (optional)

Report ──N:1──► User
Report ──N:1──► Group (optional)
```

---

## Validation Rules (DTO-level)

| Entity | Field | Rule |
|--------|-------|------|
| User | name | Non-empty string |
| User | email | Valid email format, unique |
| Profile | profilePic | Optional URL string |
| Category | name | Non-empty string; unique per user |
| Category | type | Enum: INCOME \| EXPENSE |
| Transaction | amount | Positive Decimal; non-zero |
| Transaction | currency | 3-char ISO 4217 uppercase string |
| Transaction | transactionDate | Valid ISO date; not in future |
| Transaction | groupId | Optional; must reference existing group if set |
| Group | name | Non-empty string |
| GroupMember | role | Enum: OWNER \| MEMBER |
| Report | rangeStart | Valid ISO date |
| Report | rangeEnd | After rangeStart |
| Report | reportType | Enum: PERSONAL_SUMMARY \| GROUP_SUMMARY \| CATEGORY_BREAKDOWN \| DATE_RANGE |

---

## Cascade Behaviour

| Relation | onDelete |
|----------|----------|
| Profile → User | Cascade (profile deleted with user) |
| Category → User | Cascade (user's categories deleted with user) |
| Transaction → User | Cascade |
| Transaction → Category | Restrict (cannot delete category with transactions) |
| Transaction → Group | SetNull (group deletion nullifies groupId, transaction becomes personal) |
| GroupMember → Group | Cascade |
| GroupMember → User | Cascade |
| Report → User | Cascade |
| Report → Group | SetNull |

---

## State Transitions

### Transaction

```
personal (groupId = null)
        ↓  assign group
group expense (groupId = groupId)
        ↓  group deleted
personal (groupId = null, via SetNull)
```

### Report

```
derived (snapshotData = null)  →  on save  →  persisted (snapshotData = Json)
```
