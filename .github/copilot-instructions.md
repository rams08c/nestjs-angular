# Copilot Instructions

This is a personal finance tracker monorepo with an Angular 21 frontend (`client/`) and a NestJS 11 backend (`server/`), backed by PostgreSQL via Prisma.

## Commands

### Client (`cd client`)
```bash
npm start              # Dev server with proxy to localhost:3000
npm test               # Run all tests (Vitest)
npm run test:ui        # Vitest UI
npm run test:coverage  # With coverage
npm run build
npx vitest run src/path/to/file.spec.ts  # Run a single test file
npm test -- --grep "test name pattern"   # Run tests matching a name
```

### Server (`cd server`)
```bash
npm run start:dev      # Watch mode
npm run build
npm run lint           # ESLint --fix
npm test               # Jest
npm run test:watch     # Jest watch
npm run test:e2e       # E2E via test/jest-e2e.json
npx jest src/path/to/file.spec.ts                  # Run a single test file
npx jest --testNamePattern="test name pattern"     # Run tests matching a name
npx jest --testPathPattern=auth                    # Run tests in matching paths
```

## Architecture

### Client (`client/src/app/`)
- **`app.routes.ts`** - Root routes: `/` (LandingPage, eager), `/login` and `/register` (lazy), `/dashboard/:section` (lazy, guarded by `authGuard`)
- **`shared-services/signal.service.ts`** - Global auth state via Angular signals (`isLoggedIn`, `currentUser`, `authToken`); syncs to/from `sessionStorage`
- **`shared-services/data-flow.service.ts`** - Facade service aggregating SignalService, DashboardSignalService, and all API services; used by components to avoid direct multi-service injection
- **`shared-services/validation.service.ts`** - Client-side validation returning `ValidationResult[]`; covers auth, transaction, budget, and goal forms
- **`auth/interceptors/`** - `AuthInterceptor` attaches `Bearer` token to all requests except login/register
- **`app.constant.ts`** - Single source of truth for `APP_API_ENDPOINTS`, `APP_ERROR_MESSAGES`, and `APP_VALIDATION`

### Server (`server/src/`)
- **Global JWT guard** - `JwtAuthGuard` is registered as `APP_GUARD` in `AuthModule`, protecting every endpoint by default. Use the `@Public()` decorator to opt out.
- **`@CurrentUserId()`** - Custom param decorator that extracts the user ID from the JWT payload; used in all resource controllers instead of `@Req()`.
- **`PrismaModule`** - Declared `@Global()`, so `PrismaService` is available in all modules without re-importing.
- **`src/app.constant.ts`** - Centralized error message strings for all modules; use `getErrorMessage()` / feature-specific helpers from `src/common/error.util.ts` instead of raw strings.
- **Modules**: `AuthModule`, `TransactionsModule`, `CategoriesModule`, `BudgetsModule`, `GoalsModule`
- **API prefix**: All routes are under `/api/v1` (set globally in `main.ts`)
- **Validation**: Global `ValidationPipe` with `whitelist: true` and `forbidNonWhitelisted: true`; DTOs use `class-validator` decorators

### Client-Server Communication
- REST over HTTP; client proxies `/api` to `http://localhost:3000` (see `client/proxy.conf.json`)
- JWT access token stored in `sessionStorage`; sent as `Authorization: Bearer <token>` via `AuthInterceptor`
- No shared types package - DTOs and interfaces are duplicated between client and server

### Database
- PostgreSQL + Prisma 7; schema at `server/prisma/schema.prisma`
- Key entities: `User`, `Profile`, `Category` (INCOME/EXPENSE, can be system-level), `Transaction`, `Budget`, `Goal`, `Group`, `GroupMember`, `Report`
- All monetary fields use `Decimal(12, 2)`; currency is a 3-char ISO code

## Key Conventions

### Naming
- Angular component classes omit the `Component` suffix: `Login`, `Dashboard`, `TransactionForm` (not `LoginComponent`)
- Server test files: `*.spec.ts` in `src/` (Jest); client test files: `*.spec.ts` (Vitest)
- Path alias `@` maps to `client/src` (configured in `vitest.config.ts`)

### TypeScript
- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid `any`; use `unknown` when the type is uncertain

### Angular
- All components are standalone - do NOT set `standalone: true` (it is the default in Angular v21+)
- Use `inject()` function instead of constructor injection
- Use `input()` and `output()` functions instead of `@Input()`/`@Output()` decorators
- Use signals for local state; `computed()` for derived state; never call `.mutate()` - use `.set()` or `.update()`
- Use native control flow (`@if`, `@for`, `@switch`) - not `*ngIf`, `*ngFor`, `*ngSwitch`
- Use `class` bindings instead of `ngClass`; `style` bindings instead of `ngStyle`
- Set `changeDetection: ChangeDetectionStrategy.OnPush` on every component
- Put host bindings in the `host` object of `@Component`/`@Directive` - not `@HostBinding`/`@HostListener`
- Use `NgOptimizedImage` for static images (not for inline base64)
- Prefer Reactive forms over Template-driven
- Implement lazy loading for feature routes
- Do not assume globals like `new Date()` are available in templates

### NestJS
- All new resource endpoints are protected by JWT by default - use `@Public()` only for auth routes
- Extract the authenticated user's ID via `@CurrentUserId()` - never trust a user-supplied ID in the body
- Add error message strings to `server/src/app.constant.ts` under the appropriate feature key
- Use `class-validator` decorators on all DTOs; do not skip whitelist validation

### Accessibility
- Must pass all AXE checks
- Must follow WCAG AA minimums: focus management, color contrast, ARIA attributes

### Styling
- Tailwind CSS 4 + DaisyUI 5 in the client

### Spec Kitty / Agent Rules
- Always reference files by absolute path or path relative to project root (see `.kittify/AGENTS.md`)
- Write all markdown/JSON/YAML using only UTF-8 compatible characters - avoid smart quotes, em dashes, and other Windows-1252 characters
- Never commit agent runtime directories (`.claude/`, `.codex/`, `.gemini/`, etc.)