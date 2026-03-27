# Data Model: Frontend Authentication

## Entities

### AuthState (Signal Service)
Represents the current authentication state in the Signal Service.

```typescript
interface AuthState {
  isLoggedIn: Signal<boolean>;        // true if valid token exists
  currentUser: Signal<User | null>;   // logged-in user metadata
  authToken: Signal<string | null>;   // JWT token from sessionStorage
}
```

### User
User object returned from login/register API.

```typescript
interface User {
  id: string;              // unique user identifier
  email: string;           // user email address
  name: string;            // user full name
}
```

### LoginRequest
Request payload for POST /api/auth/login.

```typescript
interface LoginRequest {
  email: string;           // email address
  password: string;        // password (min 6, 1 upper, 1 number)
}
```

### LoginResponse
Response from POST /api/auth/login on success.

```typescript
interface LoginResponse {
  token: string;           // JWT bearer token
  user: User;              // logged-in user object
}
```

### RegisterRequest
Request payload for POST /api/auth/register.

```typescript
interface RegisterRequest {
  name: string;            // full name (min 2 chars)
  email: string;           // email address
  password: string;        // password (min 6, 1 upper, 1 number)
}
```

### RegisterResponse
Response from POST /api/auth/register on success.

```typescript
interface RegisterResponse {
  message: string;         // "Registration successful"
  redirect?: string;       // "/login"
}
```

### ValidationError
Validation feedback object from Validation Service.

```typescript
interface ValidationError {
  field: string;           // "email" | "password" | "name" | "confirmPassword"
  isValid: boolean;        // true if field passes validation
  message?: string;        // "Email format invalid" | "Password must contain uppercase"
}
```

### FormState
Local component form state.

```typescript
interface FormState {
  values: {
    email?: string;
    password?: string;
    name?: string;
    confirmPassword?: string;
  };
  errors: ValidationError[];
  isSubmitting: boolean;
  submitError?: string;
}
```

## Validation Rules

| Field | Rules | Error Message |
|-------|-------|---------------|
| email | Required, valid email format | "Invalid email format" |
| password | Required, min 6 chars, 1 uppercase, 1 number | "Password must be 6+ chars with 1 uppercase and 1 number" |
| name | Required, min 2 characters | "Name must be at least 2 characters" |
| confirmPassword | Must match password field | "Passwords do not match" |

## State Lifecycle

1. **Initial**: User navigates to /login or /register
2. **Form Filled**: User types into form fields → real-time validation via Validation Service
3. **Validation Complete**: Form passes all rules → Submit button enabled
4. **Submitting**: User clicks submit → isSubmitting = true, API call in progress
5. **Success**: API responds 200/201 → token stored in sessionStorage, redirect to dashboard
6. **Error**: API responds 400/500 → submitError displayed, form remains visible
7. **Unauthorized**: API/interceptor responds 401 → token cleared, redirect to /login

## Notes

- No persistent state beyond sessionStorage (no localStorage or IndexedDB)
- Signal Service maintains in-memory state across navigation
- sessionStorage cleared automatically on browser close
- Form validation errors update in real-time as user types
