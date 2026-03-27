# Tasks: Frontend Authentication (006-frontend-authentication)

**Feature**: 006-frontend-authentication  
**Status**: Tasks Generated | **Updated**: 2026-03-27  
**Target Branch**: main

---

## Overview

5 focused work packages covering services foundation, HTTP interceptor, form components, routing, and testing. Total: ~14 implementation + test subtasks.

**Recommended MVP Path**: WP01 → WP02 → WP03 → WP04 → WP05

---

## WP01: Core Services Foundation

**Priority**: P0 (Foundational - must complete first)  
**Subtasks**: T001, T002, T003  
**Scope**: Validation Service, Signal Service, Data Flow Service  
**Est. Lines**: 350-450  
**Dependencies**: None  
**Parallelizable**: No (sequential: validation → signal → data-flow)

- [ ] **T001**: Create Validation Service (`src/app/auth/services/validation.service.ts`)
  - Email validation (RFC 5322 simplified pattern)
  - Password strength (6+ chars, 1 uppercase, 1 number)
  - Name validation (2+ chars)
  - Confirm password match
  - Return ValidationResult { field, isValid, message }
  - Unit tests for all rules

- [ ] **T002**: Create Signal Service (`src/app/auth/services/signal.service.ts`)
  - Signal: isLoggedIn (boolean)
  - Signal: currentUser (User | null)
  - Signal: authToken (string | null)
  - Methods: setLoggedIn(), setUser(), setToken(), clearAuth()
  - Load token from sessionStorage on service instantiation

- [ ] **T003**: Create Data Flow Service (`src/app/auth/services/data-flow.service.ts`)
  - Inject Signal Service
  - Expose public getters for all signals
  - Methods: loginUser(user, token), logoutUser()
  - Called by components and interceptor

**Success Criteria**:
- All services injectable with providedIn: 'root'
- Validation rules pass unit tests
- Signals update reactively
- sessionStorage read on app init

---

## WP02: HTTP Interceptor & Security

**Priority**: P0 (Foundational - required before component API calls)  
**Subtasks**: T004  
**Scope**: Auth HTTP Interceptor  
**Est. Lines**: 200-280  
**Dependencies**: WP01 (needs Signal Service for token)  
**Parallelizable**: Yes (separate from components)

- [ ] **T004**: Create Auth HTTP Interceptor (`src/app/auth/interceptors/auth.interceptor.ts`)
  - Implement HttpInterceptorFn
  - Inject Data Flow Service (cross-component token access)
  - Attach `Authorization: Bearer <token>` to all requests
  - Exclude routes: /auth/login, /auth/register, /api/auth/login, /api/auth/register
  - On 401 response: Clear token from sessionStorage → call logoutUser() → redirect to /login via Router
  - Provide in app.config.ts under HTTP_INTERCEPTORS
  - Test token attachment, 401 redirect, exclusion rules

**Success Criteria**:
- Bearer token attached to protected requests
- /auth/* and /api/auth/* endpoints excluded
- 401 clears sessionStorage (spy on sessionStorage.removeItem)
- Redirect to /login on 401 (spy on router.navigate)
- No token in Authorization header for excluded routes

---

## WP03: Login Component & API Integration

**Priority**: P1 (Primary user story)  
**Subtasks**: T005, T008, T009  
**Scope**: Login form, validation, API calls  
**Est. Lines**: 400-500  
**Dependencies**: WP01, WP02  
**Parallelizable**: Yes (independent from Register)

- [ ] **T005**: Create Login Component (`src/app/auth/login/`)
  - Standalone component (login.ts, login.html)
  - Signals: email, password, formErrors, isSubmitting, submitError
  - ChangeDetectionStrategy.OnPush
  - Template: form with email/password fields, submit button, register link
  - Styling: Tailwind + DaisyUI form utilities
  - Link to `/register` route

- [ ] **T008**: Integrate Validation Service (Login)
  - Real-time validation on input
  - Display field-level error messages
  - Disable submit button until form valid
  - Test email and password validation triggers

- [ ] **T009**: Handle Login API Call
  - On submit: Call POST /api/auth/login { email, password }
  - Success (200): Receive token + user → call dataFlow.loginUser() → redirect to /dashboard
  - Error (400): Display submitError message, keep form visible
  - Error (401/403): Let interceptor handle (clear token, redirect)
  - Test both success and error paths

**Success Criteria**:
- Form displays email/password fields
- Real-time validation shows errors
- Submit disabled until valid
- API call on submit works (mock in unit test)
- Token stored in sessionStorage on success
- Error message displays on failure

---

## WP04: Register Component & API Integration

**Priority**: P1 (Primary user story)  
**Subtasks**: T006, T008, T009  
**Scope**: Register form, validation, API calls  
**Est. Lines**: 450-550  
**Dependencies**: WP01, WP02  
**Parallelizable**: Yes (independent from Login, similar to WP03)

- [ ] **T006**: Create Register Component (`src/app/auth/register/`)
  - Standalone component (register.ts, register.html)
  - Signals: name, email, password, confirmPassword, formErrors, isSubmitting, submitError
  - ChangeDetectionStrategy.OnPush
  - Template: form with name/email/password/confirm fields, submit button, login link
  - Styling: Tailwind + DaisyUI consistent with login
  - Link to `/login` route

- [ ] **T008**: Integrate Validation Service (Register)
  - Real-time validation for all fields
  - Password confirmation validation (confirm === password)
  - Password strength feedback (uppercase, number, length)
  - Display field-level error messages
  - Disable submit until all fields valid
  - Test all validation rules

- [ ] **T009**: Handle Register API Call
  - On submit: Call POST /api/auth/register { name, email, password }
  - Success (201): Show success message → redirect to /login
  - Error (400): Display submitError (email exists, weak password, etc)
  - Keep form visible on error
  - Test both success and error paths

**Success Criteria**:
- Form displays all 4 fields
- Real-time validation with error messages
- Submit disabled until valid
- API call on submit works (mock in unit test)
- Redirect to /login on success
- Error message displays on failure

---

## WP05: Routing, Integration & End-to-End Testing

**Priority**: P1 (Completion)  
**Subtasks**: T007, T010, T011  
**Scope**: Route wiring, e2e tests, interceptor tests  
**Est. Lines**: 300-400  
**Dependencies**: WP01, WP02, WP03, WP04  
**Parallelizable**: No (requires all components complete)

- [ ] **T007**: Wire Routes in app.routes.ts
  - Add `/login` → LoginComponent (lazy or eager)
  - Add `/register` → RegisterComponent (lazy or eager)
  - Ensure default route `/` remains LandingPageComponent
  - Test route navigation with RouterTestingModule

- [ ] **T010**: End-to-End Test: Login Flow
  - Create e2e or integration test: user@test.com / TestPass1
  - Navigate to /login
  - Enter email, password → form validates
  - Submit → API call succeeds (mock response)
  - Token appears in sessionStorage
  - Redirect to /dashboard succeeds
  - Test on button-level interactions (real DOM)

- [ ] **T011**: End-to-End Test: 401 Redirect & Token Cleanup
  - Test interceptor catches 401 response
  - Verify sessionStorage.authToken cleared
  - Verify router.navigate('/login') called
  - Test by: Mock API to return 401, make request, verify redirect behavior
  - Verify no password/token in console logs

**Success Criteria**:
- Routes compile and load components
- Login e2e flow: form → API → token → redirect
- Register e2e flow: form → API → redirect to login
- 401 response clears token and redirects
- All components communicate via Signal Service
- Build passes `ng build`

---

## Implementation Sequence

```
1. WP01 ←─ Prerequisite for WP03, WP04, WP02
   └─→ WP02 ←─ Prerequisite for WP03, WP04
       ├─→ WP03 ┐
       └─→ WP04 ┴─→ WP05
```

**Parallelization Opportunities**:
- WP03 and WP04 can be implemented in parallel (both depend on WP01, WP02)
- WP02 can start once WP01 complete

---

## Requirement Mapping

| Feature Spec Requirement | Work Packages | Status |
|--------------------------|---------------|--------|
| Validation Service (email, password, name) | WP01 (T001) | Planned |
| Signal Service (auth state) | WP01 (T002) | Planned |
| Data Flow Service | WP01 (T003) | Planned |
| HTTP Interceptor (bearer token) | WP02 (T004) | Planned |
| Exclude /auth/* from interceptor | WP02 (T004) | Planned |
| 401 redirect + token cleanup | WP02 (T004), WP05 (T011) | Planned |
| Login component & form | WP03 (T005) | Planned |
| Register component & form | WP04 (T006) | Planned |
| Real-time validation feedback | WP03 (T008), WP04 (T008) | Planned |
| API calls (login, register) | WP03 (T009), WP04 (T009) | Planned |
| Route registration | WP05 (T007) | Planned |
| E2E testing | WP05 (T010, T011) | Planned |

---

## File Structure Created

```
src/app/auth/
├── services/
│   ├── validation.service.ts      (WP01 - T001)
│   ├── signal.service.ts          (WP01 - T002)
│   └── data-flow.service.ts       (WP01 - T003)
├── interceptors/
│   └── auth.interceptor.ts        (WP02 - T004)
├── login/
│   ├── login.ts                   (WP03 - T005)
│   └── login.html                 (WP03 - T005)
├── register/
│   ├── register.ts                (WP04 - T006)
│   └── register.html              (WP04 - T006)
└── (guards/ optional - not in MVP)

app.config.ts (modified - WP02, WP05)
app.routes.ts (modified - WP05 - T007)
```

---

## Key Implementation Decisions

- **Signal-based forms only** (no Reactive Forms per Angular 21 constitution)
- **sessionStorage only** (no localStorage, cleared on browser close)
- **HTTP interceptor as HttpInterceptorFn** (not class-based)
- **Validation Service handles all rules** (single source of truth)
- **DaisyUI + Tailwind CSS** (consistent with landing page styling)
- **Standalone components** (Angular 21 best practice)
- **ChangeDetectionStrategy.OnPush** (performance)

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Signal Service not reactive | Components don't update auth state | Test signal updates in unit tests before components |
| Token not attached to requests | API calls fail | Test interceptor in isolation with HttpClientTestingModule |
| 401 loop (token invalid) | User stuck at /login | Validate token format in Signal Service, add try-catch in interceptor |
| password exposed in logs | Security breach | Audit validation.service and components for console.log, sanitize RxJS operators |
| Form validation too permissive | Poor UX, weak passwords | Test all validation rules with edge cases (empty, special chars, etc.) |

---

## Next Steps

1. Implement WP01 first (services foundation)
2. Implement WP02 in parallel with WP01 final steps
3. Implement WP03 and WP04 in parallel
4. Finalize with WP05 (routing + e2e tests)
5. Build verification: `ng build --configuration production`
