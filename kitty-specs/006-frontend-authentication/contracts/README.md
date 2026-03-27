# API Contracts: Frontend Authentication

## Overview

Two core authentication API endpoints required by the frontend:
1. **POST /api/auth/login** — User login with email/password
2. **POST /api/auth/register** — User registration with name/email/password

Both endpoints return JWT tokens and user information on success.

## Endpoint Specifications

See `auth-api.openapi.yml` for complete OpenAPI 3.0 specification.

### POST /api/auth/login

**Purpose**: Authenticate user and issue JWT token

**Request**:
```json
{
  "email": "user@example.com",
  "password": "MyPass123"
}
```

**Success Response (200)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Error Response (400)**:
```json
{
  "error": "Invalid email or password"
}
```

**Notes**:
- Token must be valid JWT format
- User object required with id, email, name fields
- Password never echoed in response
- Client stores token in sessionStorage
- HTTP Interceptor attaches as `Authorization: Bearer <token>` to subsequent requests

---

### POST /api/auth/register

**Purpose**: Register new user account

**Request**:
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "MyPass123"
}
```

**Success Response (201)**:
```json
{
  "message": "Registration successful",
  "redirect": "/login"
}
```

**Error Response (400)**:
```json
{
  "error": "Email already exists"
}
```

**Notes**:
- Email must be unique across system
- No token issued on registration (user must login after registering)
- Response includes redirect hint for client
- Success HTTP status should be 201 (Created)

---

## Implementation Notes

### Validation (Frontend Enforced)
The frontend enforces these rules before API submission:
- Email: valid email format (RFC 5322 simplified)
- Password: minimum 6 characters, 1 uppercase letter, 1 number
- Name: minimum 2 characters
- Confirm password: must match password field

### Validation (Backend Recommended)
The backend should also validate:
- Email format and uniqueness
- Password complexity
- Name not empty or malicious

### Security Guidelines

1. **Token Handling**:
   - JWT tokens should be signed and optionally encrypted
   - Short expiration recommended (e.g., 1 hour)
   - Refresh token pattern optional but recommended

2. **Password Security**:
   - Hash passwords with bcrypt, Argon2, or scrypt
   - Never store plaintext passwords
   - Never echo password in response or logs

3. **HTTP Interceptor Behavior**:
   - Frontend attaches `Authorization: Bearer <token>` to all requests
   - Backend should verify token signature and expiration
   - 401 response triggers client-side token clearance and /login redirect

4. **CORS**:
   - Backend must allow /api/auth/* endpoints from client origin
   - Credentials mode: "include" (if using cookies)

---

## Testing Checklist

- [ ] POST /api/auth/login with valid credentials returns 200 + token
- [ ] POST /api/auth/login with invalid credentials returns 400
- [ ] POST /api/auth/register with valid data returns 201
- [ ] POST /api/auth/register with duplicate email returns 400
- [ ] Frontend stores token in sessionStorage on login success
- [ ] Frontend attaches token to subsequent API requests
- [ ] 401 response triggers token clearance and /login redirect
- [ ] No password appears in API response or network logs
