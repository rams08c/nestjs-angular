# Feature: Frontend Authentication

**Feature**: 006-frontend-authentication  
**Created**: 2026-03-27

## Goal
- Enable user login and registration on Angular frontend
- Manage JWT token securely in sessionStorage
- Attach bearer tokens to all API requests except `/auth/login` and `/auth/register`
- Redirect unauthorized requests (401) back to `/login`
- Provide auth state management via Signal Service and shared Validation Service

## Routes
- `/login` — user login form (email, password)
- `/register` — user registration form (name, email, password)

## UI (Forms)

### Login Form
- Email field (required, valid email format)
- Password field (required, min 6 characters)
- Submit button
- Link to `/register`

### Register Form
- Name field (required, min 2 characters)
- Email field (required, valid email format)
- Password field (required, min 6 characters, 1 uppercase, 1 number)
- Confirm password field (must match password)
- Submit button
- Link to `/login`

### Form Implementation
- Use Signal-based forms only (no Reactive Forms, no Template-driven forms)
- Create standalone components for login and register pages
- All validation via shared Validation Service

## Rules

### Authentication
- JWT token stored in sessionStorage after successful login
- Token cleared from sessionStorage on logout
- No token persists across browser close

### HTTP Interceptor
- Automatically attach `Authorization: Bearer <token>` header to all requests
- Exclude `/auth/login` and `/auth/register` from token attachment
- On 401 response: redirect to `/login` and clear sessionStorage token

### Services
- **Validation Service**: Single service for all form validation rules (email, password strength, name format)
- **Signal Service**: Manages auth state (isLoggedIn, currentUser, token)
- **Data Flow Service**: Shares auth state across components
- **Auth HTTP Interceptor**: Attaches bearer token, handles 401 responses

### Security
- Password never logged or exposed in console
- Validation errors shown to user (e.g., "Password must contain 1 uppercase letter")
- Unauthorized redirects silent (no console error exposure)

## Flow

### Login Flow
1. User navigates to `/login`
2. Enters email and password
3. Form validates via Validation Service
4. Submit calls API `/api/auth/login`
5. On success: receive JWT token, store in sessionStorage, redirect to dashboard
6. On failure: show error message, keep on login page
7. On 401: intercept, clear token, redirect to `/login`

### Registration Flow
1. User navigates to `/register`
2. Enters name, email, password, confirm password
3. Form validates via Validation Service
4. Submit calls API `/api/auth/register`
5. On success: redirect to `/login`
6. On failure: show error message, keep on register page

### Protected Route Access
1. User navigates to protected route
2. Signal Service checks isLoggedIn signal
3. If logged in: allow access
4. If logged out: redirect to `/login` (via guard or service check)
5. Outgoing API request: HTTP interceptor attaches token automatically
6. API responds 401: interceptor clears token, redirects to `/login`

## Tasks

- T001: Create Validation Service with rules for email, password (min 6, 1 upper, 1 number), name (min 2), confirm password match
- T002: Create Signal Service with signals: isLoggedIn (boolean), currentUser (object), authToken (string)
- T003: Create Data Flow Service to share Signal Service state across components
- T004: Create HTTP Interceptor to attach bearer token and handle 401 redirects
- T005: Create standalone Login component with Signal-based form
- T006: Create standalone Register component with Signal-based form
- T007: Wire routes `/login` and `/register` in app.routes.ts
- T008: Integrate Validation Service into login and register forms for real-time feedback
- T009: Handle API calls (POST /api/auth/login, POST /api/auth/register) with error/success states
- T010: Test login/register flows end-to-end with token storage and HTTP interception
- T011: Test 401 redirect and token cleanup on unauthorized response
- T012: Verify password field never appears in console or network logs
