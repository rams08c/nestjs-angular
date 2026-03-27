# Quickstart: Frontend Authentication

## Setup

### 1. Install dependencies (already available in Angular project)
```bash
cd client
npm install  # Express, HTTP Client, Router already installed
```

### 2. Verify Angular version
```bash
ng version  # Must be 21.2.2 or later
```

## Running the Dev Server

```bash
# From /client directory
npm start

# Navigate to http://localhost:4200
# Default landing page loads; click "Login" or "Register"
```

## Build

```bash
# Development build
ng build --configuration development

# Production build
ng build --configuration production
```

## Testing

```bash
# Unit tests
ng test

# E2E tests (if configured)
ng e2e
```

## File Structure

Authentication feature files:
```
src/app/auth/
├── services/
│   ├── validation.service.ts     # Form validation rules
│   ├── signal.service.ts          # Auth state signals
│   └── data-flow.service.ts       # Public Signal interface
├── interceptors/
│   └── auth.interceptor.ts        # Bearer token + 401 redirect
├── login/
│   ├── login.ts                   # Login component
│   └── login.html                 # Login template
├── register/
│   ├── register.ts                # Register component
│   └── register.html              # Register template
└── guards/
    └── auth.guard.ts              # (Optional) Route protection
```

## Key Implementation Details

### Validation Service
- Validates email format, password strength, name length, password confirmation
- Called in real-time as user types (reactive validation)
- Returns ValidationError array with field-level feedback

### Signal Service
- Manages isLoggedIn, currentUser, authToken signals
- Updated after successful login/register
- Cleared on logout or 401 response

### HTTP Interceptor
- Attaches `Authorization: Bearer <token>` to all requests
- Excludes /auth/login and /auth/register routes
- On 401: clears token, redirects to /login

### Forms
- Signal-based (no Reactive Forms)
- Real-time validation feedback as user types
- Error messages displayed per field

## Common Tasks

### Test Login Flow
```
1. npm start
2. Navigate to http://localhost:4200
3. Click Login button
4. Enter email: test@example.com, password: TestPass1
5. Click Submit
6. On success: redirected to dashboard, token in sessionStorage
7. On failure: error message shown, form remains visible
```

### Test Register Flow
```
1. Click Register button
2. Enter name, email, password, confirm password
3. Click Submit
4. On success: redirected to /login
5. On failure: error message shows (e.g., email exists)
```

### Check Token Storage
```javascript
// In browser console:
sessionStorage.getItem('authToken')  // Returns JWT if logged in
// Or check Network tab: Authorization header on API requests
```

### Test 401 Redirect
```
1. Manually set invalid token in sessionStorage
2. Make API request to protected endpoint
3. Interceptor catches 401 response
4. Token cleared from sessionStorage
5. Redirect to /login
```

## Debugging

### Enable Logging
- Add console.log() in Validation Service for validation output
- Add console.log() in HTTP Interceptor for token attachment/401 handling
- Verify no password appears in logs (security check)

### Check Build Errors
```bash
ng build  # Shows TypeScript errors
npm test  # Shows test failures
```

### Network Inspection
- Open DevTools → Network tab
- Filter by XHR requests
- Verify Authorization header: `Bearer <token>`
- Check 401 responses redirect to /login

## Next Steps

Run `/spec-kitty.tasks` to generate detailed work packages (WP01-WP06) for implementation.
