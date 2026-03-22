# Quickstart: DB Schema

**Feature**: 001-db-schema  
**Date**: 2026-03-22

---

## Prerequisites

- Node.js 20 LTS
- PostgreSQL v18.1 running locally or via Docker
- NestJS v11.0.6 project scaffolded at `server/`
- Prisma CLI installed: `npm install --save-dev prisma` (in `server/`)

---

## 1. Configure Database Connection

Create or update `server/.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/moneytracker?schema=public"
```

---

## 2. Replace Prisma Schema

Replace the contents of `server/prisma/schema.prisma` with the schema from [kitty-specs/001-db-schema/data-model.md](data-model.md) (the `## Prisma Schema` section).

---

## 3. Run First Migration

```bash
cd server
npx prisma migrate dev --name init-db-schema
```

This creates all seven tables in PostgreSQL with correct constraints, relations, and indexes.

---

## 4. Generate Prisma Client

```bash
npx prisma generate
```

The generated client is available to import as `@prisma/client` in all NestJS services.

---

## 5. Verify Schema in Prisma Studio (optional)

```bash
npx prisma studio
```

Opens a browser UI at `http://localhost:5555` to browse all tables.

---

## 6. Scaffold NestJS Modules

For each entity, create a module using the NestJS CLI:

```bash
cd server/src
nest generate module users
nest generate controller users --no-spec
nest generate service users --no-spec

nest generate module profile
nest generate controller profile --no-spec
nest generate service profile --no-spec

nest generate module categories
nest generate controller categories --no-spec
nest generate service categories --no-spec

nest generate module transactions
nest generate controller transactions --no-spec
nest generate service transactions --no-spec

nest generate module groups
nest generate controller groups --no-spec
nest generate service groups --no-spec

nest generate module group-members
nest generate controller group-members --no-spec
nest generate service group-members --no-spec

nest generate module reports
nest generate controller reports --no-spec
nest generate service reports --no-spec
```

---

## 7. Register PrismaService in Each Module

Ensure `PrismaModule` is imported globally in `AppModule`, or import `PrismaModule` into each feature module:

```typescript
// server/src/app.module.ts
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    ProfileModule,
    CategoriesModule,
    TransactionsModule,
    GroupsModule,
    GroupMembersModule,
    ReportsModule,
  ],
})
export class AppModule {}
```

---

## 8. Decimal Serialization Note

Prisma returns `Decimal` values as `Prisma.Decimal` objects. Serialize to string in responses:

```typescript
// In TransactionsService response mapping
amount: transaction.amount.toString()
```

---

## Verification Checklist

- [ ] `prisma migrate dev` runs without errors
- [ ] All 7 tables exist in PostgreSQL (`\dt` in psql)
- [ ] Unique constraints verified: `users.email`, `categories.(ownerUserId, name)`, `group_members.(groupId, userId)`, `profiles.userId`
- [ ] `npx prisma generate` completes without type errors
- [ ] NestJS server starts: `npm run start:dev` in `server/`

---

## Contract References

All REST OpenAPI contracts are in `kitty-specs/001-db-schema/contracts/`:

| File | Entity |
|------|--------|
| users.yaml | Users |
| profile.yaml | Profile |
| categories.yaml | Categories |
| transactions.yaml | Transactions |
| groups.yaml | Groups |
| group-members.yaml | GroupMembers |
| reports.yaml | Reports |
