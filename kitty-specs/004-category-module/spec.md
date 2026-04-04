# Feature: Category

## Goal
- Enable category management for a money tracking application
- Support two category classes: system categories and user categories
- Provide authenticated users full CRUD on their own user categories
- Provide global read access to system categories
- Prevent update/delete for system categories
- Income categories act as income sources — no separate income source module exists
- System income categories (Salary, Freelance, Business, Interest) are seeded via migration

## API
- `POST /categories`
- `GET /categories`
- `GET /categories/:id`
- `PUT /categories/:id`
- `DELETE /categories/:id`
- `POST /categories` creates user category only
- `GET /categories` returns system categories + authenticated user's categories
- `GET /categories/:id` returns category when globally visible (`isSystem=true`) or owned by authenticated user
- `PUT /categories/:id` allowed only for owned user categories (`isSystem=false`)
- `DELETE /categories/:id` allowed only for owned user categories (`isSystem=false`)
- All endpoints require JWT authentication

## DTO
- `CreateCategoryDto`
- `UpdateCategoryDto`
- `CategoryResponseDto`
- `CreateCategoryDto.name`: required string
- `CreateCategoryDto.type`: required enum (`expense` | `income`)
- `CreateCategoryDto.isSystem`: optional boolean, must be forced to `false` server-side
- `UpdateCategoryDto.name`: optional string
- `UpdateCategoryDto.type`: optional enum (`expense` | `income`)
- `UpdateCategoryDto.isSystem`: optional boolean, must be ignored/rejected server-side
- `CategoryResponseDto`: `id`, `name`, `type`, `isSystem`, `ownerUserId`, `createdAt`, `updatedAt`

## Rules
- User categories must be linked to authenticated `userId` from JWT
- System categories must be globally available for all authenticated users
- System categories are read-only
- System categories cannot be updated
- System categories cannot be deleted
- `POST /categories` must not create system categories
- `ownerUserId` is required when `isSystem=false`
- `ownerUserId` is null when `isSystem=true`
- Category visibility rule: return category when `isSystem=true` or `ownerUserId=jwtUserId`
- Category update/delete rule: allow only when `isSystem=false` and `ownerUserId=jwtUserId`
- Return `403` when user attempts to update/delete a system category
- Return `403` when user attempts to modify another user's category
- Return `404` when category is not visible to user
- Validate `name` is non-empty
- Validate `type` is one of `expense` or `income`

## DB (Prisma)
- Use existing `Category` model foundation in PostgreSQL via Prisma
- Model: `Category`
- `id`: `String @id @default(cuid())`
- `name`: `String`
- `type`: enum (`INCOME`, `EXPENSE`) — `INCOME` categories serve as income sources
- `isSystem`: `Boolean @default(false)`
- `ownerUserId`: `String?`
- `createdAt`: `DateTime @default(now())`
- `updatedAt`: `DateTime @updatedAt`
- Relation: `ownerUserId -> User.id` (nullable for system categories)
- Constraint: unique user category name per owner (`@@unique([ownerUserId, name])`)
- Constraint: allow duplicate system names only if explicitly approved by business rule
- Query index recommendation: `@@index([isSystem])`
- Seed: system expense categories (Food, Groceries, Rent, Utilities, Transportation, Fuel, Healthcare, Insurance, Education, Entertainment, Dining Out, Shopping, Personal Care, Travel, Subscriptions)
- Seed: system income categories (Salary, Freelance, Business, Interest)

## Tasks
- Add/confirm `isSystem` in Prisma `Category` model
- Add/confirm nullable `ownerUserId` in Prisma `Category` model
- Add/confirm relation from `Category` to `User`
- Add/confirm enum mapping for category type (`expense|income` <-> `EXPENSE|INCOME`)
- Create migration for category model adjustments
- Create `CategoriesModule`
- Create `CategoriesController`
- Create `CategoriesService`
- Create `CreateCategoryDto`
- Create `UpdateCategoryDto`
- Implement `POST /categories` with forced `isSystem=false`
- Implement `GET /categories` with visibility filter (`isSystem=true OR ownerUserId=userId`)
- Implement `GET /categories/:id` with visibility check
- Implement `PUT /categories/:id` with system protection and ownership check
- Implement `DELETE /categories/:id` with system protection and ownership check
- Use authenticated `userId` from JWT for ownership operations
- Add error messages for category not found, forbidden update/delete, and invalid category input
- Add unit tests for service visibility and authorization rules
- Add e2e tests for all five endpoints including system-category protection cases
