# Implementation Plan: Frontend Authentication

**Feature**: 006-frontend-authentication  
**Branch**: main | **Spec**: [006-frontend-authentication/spec.md]
**Status**: Planning Phase Complete | Updated: 2026-03-27

## Summary

Enable Signal-based JWT authentication on Angular frontend with sessionStorage token storage, automatic bearer token attachment via HTTP interceptor, and 401 redirect handling. Two standalone forms (login, register) with shared validation service.

## Technical Context

**Language/Version**: TypeScript 5.9.x, Angular 21.2.2  
**Primary Dependencies**: Angular Router, HTTP Client, Signals API (built-in)  
**Storage**: sessionStorage (browser only, cleared on close)  
**Testing**: Jasmine/Karma (Angular default)  
**Target Platform**: Web (Angular SPA)  
**Project Type**: Frontend feature within full-stack monorepo  
**Performance Goals**: Sub-200ms form submission, instant validation feedback  
**Constraints**: No localStorage (sessionStorage only), exclude /auth/* routes from token attachment  
**Security**: Token never logged, password never exposed in console/network, sanitized error messages

## Constitution Check

✓ **Passes Angular 21.2.2 constitution**: Signal-based forms (no Reactive/Template-driven), standalone components, TypeScript strict mode, OnPush change detection  
✓ **Accessibility compliant**: Form labels with for/id binding, ARIA attributes for error messages  
✓ **No external auth libraries**: Native HTTP interceptor + Signal Service  
✓ **Consistent with landing-page architecture**: Shared services, DaisyUI styling, Tailwind CSS

## Implementation Architecture

### Service Layer (3 services)
1. **Validation Service**: Email format, password strength (6+ chars, 1 upper, 1 number), name (2+ chars), confirm password match
2. **Signal Service**: Exposes isLoggedIn, currentUser, authToken signals for reactive updates
3. **Data Flow Service**: Public interface to Signal Service (subscription convenience)

### HTTP Layer (1 interceptor)
- **Auth Interceptor**: Attaches bearer token to all requests except /auth/login, /auth/register; catches 401, clears token, redirects to /login

### Component Layer (2 components)
1. **Login**: Signal-based form, API POST to /api/auth/login, sessionStorage token, redirect to dashboard
2. **Register**: Signal-based form, password confirmation, API POST to /api/auth/register, redirect to /login

### Routing
- `/login` — Login page (lazy or eager)
- `/register` — Register page (lazy or eager)
- Protected routes use Signal Service guard or manual check

## File Structure

```
src/app/auth/
├── services/
│   ├── validation.service.ts
│   ├── signal.service.ts
│   └── data-flow.service.ts
├── interceptors/
│   └── auth.interceptor.ts
├── login/
│   ├── login.ts
│   └── login.html
├── register/
│   ├── register.ts
│   └── register.html
└── guards/
    └── auth.guard.ts (optional)
```

## Phase 1 Deliverables

- ✓ **data-model.md**: AuthState, User, ValidationError, LoginRequest, RegisterRequest entities
- ✓ **contracts/**: API endpoint specs for /api/auth/login, /api/auth/register
- ✓ **quickstart.md**: Dev, build, test, deploy instructions

## Next: Work Package Generation

User to run `/spec-kitty.tasks` for detailed task breakdown into 6-8 work packages.
└── tasks.md             # Phase 2 output (/spec-kitty.tasks command - NOT created by /spec-kitty.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |