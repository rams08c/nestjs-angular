# Constitution

## Core Principles
- All rules are mandatory and non-negotiable.
- No deviations without explicit update to this file.
- Prioritize implementation clarity over documentation.
- Reject any code or spec violating these rules.

## Backend Rules (NestJS)
- Use NestJS v11.0.6.
- Enforce feature-based modular architecture.
- Controllers must be thin; no business logic allowed.
- All business logic must reside in services.
- Use DTOs with validation for all inputs.
- Use Prisma as the only data access layer.
- Follow REST standards for endpoints and status codes.

## Authentication Rules
- JWT authentication required for all endpoints by default.
- Only /auth/register and /auth/login are public.
- Every request must include a valid Bearer token.
- Extract userId from JWT for all operations.
- All data operations must be scoped to authenticated userId.
- Reject any request without valid authentication.

## Database Rules (PostgreSQL + Prisma)
- Use PostgreSQL v18.1 only.
- Use Prisma ORM for all database operations.
- No direct SQL queries unless strictly unavoidable.
- Define proper relations and constraints in schema.
- Design schema to support:
  - Expense tracking
  - Expense splitting (future-ready)
- Maintain normalized schema structure.
- Use migrations for all schema changes.

## Domain Rules (Money Tracking)
- Support expense tracking as core feature.
- Support expense splitting as feature module.
- Splitting must support:
  - Multiple participants
  - Equal and custom distribution
- Store user-wise contribution and settlement data.
- All financial records must be user-scoped and consistent.

## Frontend Rules (Angular)
- Use Angular v21.2.2.
- Use standalone components only.
- Use Signal-based forms only.
- Do NOT use Reactive Forms.
- Do NOT use Template-driven forms.
- Keep components presentation-focused only.
- Move all logic to services.

## Angular Architecture Rules
- Create a single reusable validation service for all forms.
- Validation logic must not be duplicated across components.
- Create one global Signal Service:
  - Manage signals, computed signals, and updates
- Create one Data Flow Service:
  - Handle cross-component and shared state
- Do not manage shared state inside components.

## UI Rules
- Use Tailwind CSS for all styling.
- Use DaisyUI components wherever applicable.
- Avoid custom CSS unless strictly required.

## API & Integration Rules
- Maintain consistent API contracts.
- Use typed request and response models.
- Centralize API error handling.
- Ensure frontend and backend contract alignment.

## Spec Rules (SDD)
- Follow Spec-Driven Development strictly.
- Create one spec per feature only.
- Do not create duplicate specs.
- Specs must be concise and implementation-focused.
- Each spec must be readable within 3 minutes.
- Maximum 650 lines per spec.
- Avoid explanations, theory, and redundancy.
- Include only: Goal, API, DTO, Rules, DB, Tasks.

## Code Quality Rules
- Keep functions small and single-purpose.
- Avoid code duplication.
- Use consistent and meaningful naming.
- Write maintainable and testable code.
- Enforce separation of concerns strictly.

## Error message 
 - angular error message should be in the root like app.constant.ts which is resides where app.ts
 - nestjs  error message shoudl be in the root like app.constand.ts which is reside where app.controller.ts
 - you can export the constand files and use them application 