# Feature Specification: Auth Service Login Registration

**Feature Branch**: `[002-auth-service-login-registration]`  
**Created**: 2026-03-22  
**Status**: Draft  
**Input**: User description: "2nd feature authService login and registration in NestJS based on constitution, password minimum 8 chars, bcrypt hashing"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Register New Account (Priority: P1)

As a new user, I can register with name, email, and password so I can access protected app features.

**Why this priority**: Registration is the first access path and enables all downstream user workflows.

**Independent Test**: Can be tested independently by submitting a valid registration request and verifying account creation plus safe credential storage.

**Acceptance Scenarios**:

1. **Given** a new email, valid name, and password of at least 8 characters, **When** I call register, **Then** my account is created and I receive authentication tokens.
2. **Given** an already-registered email, **When** I call register, **Then** the request is rejected with a conflict result.
3. **Given** a password shorter than 8 characters, **When** I call register, **Then** the request is rejected with validation error.

---

### User Story 2 - Login Existing Account (Priority: P1)

As a returning user, I can login with my credentials and receive access and refresh tokens.

**Why this priority**: Login is required for repeat access and secure session continuity.

**Independent Test**: Can be tested independently by creating a user then authenticating with correct and incorrect credentials.

**Acceptance Scenarios**:

1. **Given** a registered email and correct password, **When** I call login, **Then** I receive both access and refresh tokens.
2. **Given** an incorrect password, **When** I call login, **Then** authentication is rejected.

---

### User Story 3 - Access Protected Endpoints (Priority: P2)

As an authenticated user, I can access protected APIs using Bearer access token while unauthenticated requests are blocked.

**Why this priority**: Enforcing authorization boundaries protects all user-scoped data operations.

**Independent Test**: Can be tested independently by calling any protected endpoint with and without a valid Bearer token.

**Acceptance Scenarios**:

1. **Given** a valid Bearer token, **When** I call a protected endpoint, **Then** request processing continues with authenticated user context.
2. **Given** no token or invalid token, **When** I call a protected endpoint, **Then** the request is rejected as unauthorized.

### Edge Cases

- Registration with email case variants must not create duplicate accounts.
- Login with unknown email must return authentication failure.
- Stored credential values must never contain plain-text password.
- Expired access token must not authorize protected endpoint calls.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide public endpoint `POST /auth/register`.
- **FR-002**: System MUST provide public endpoint `POST /auth/login`.
- **FR-003**: Register input MUST require `name`, `email`, and `password`.
- **FR-004**: Register password MUST be validated with minimum length of 8 characters.
- **FR-005**: Register flow MUST reject duplicate email registrations.
- **FR-006**: System MUST hash passwords using bcrypt before persistence.
- **FR-007**: Login MUST validate credentials against stored hashed password.
- **FR-008**: Successful login MUST return both access token and refresh token.
- **FR-009**: Successful registration MUST return both access token and refresh token.
- **FR-010**: All endpoints other than `POST /auth/register` and `POST /auth/login` MUST require valid Bearer authentication.
- **FR-011**: Authenticated request context MUST include userId extracted from JWT.
- **FR-012**: All downstream data operations MUST remain scoped to authenticated userId.

### Key Entities *(include if feature involves data)*

- **AuthCredential**: User authentication record containing unique email and bcrypt-hashed password.
- **AuthTokenPair**: Authentication output containing access token and refresh token for a successfully authenticated user.
- **AuthenticatedSessionContext**: Request-level auth context containing verified user identity (`userId`) extracted from JWT.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of successful registrations enforce password minimum length of 8 and store only hashed credentials.
- **SC-002**: 100% of successful login responses return both access and refresh tokens.
- **SC-003**: 100% of unauthenticated requests to protected endpoints are rejected.
- **SC-004**: 100% of duplicate-email registration attempts are rejected.

## Assumptions

- Refresh token lifecycle management (rotation, revoke endpoint) is out of scope for this feature and handled in follow-up work.
- Email and password login is the only authentication method in this feature scope.
