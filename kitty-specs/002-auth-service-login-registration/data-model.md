# Data Model: Auth Service Login Registration

**Feature**: 002-auth-service-login-registration  
**Date**: 2026-03-22

## Entities

### UserAuthView

Represents auth-relevant user fields in the existing user model.

- `id`: Unique user identifier
- `name`: Required display name
- `email`: Unique login identifier
- `passwordHash`: Bcrypt hash for password verification
- `refreshTokenHash`: Nullable hash for refresh token validation
- `createdAt`
- `updatedAt`

### AuthTokenPair

Represents token response payload returned after successful auth operations.

- `accessToken`: JWT for Bearer authorization on protected endpoints
- `refreshToken`: JWT used with refresh endpoint for new access token issuance

### JwtClaims

Represents JWT payload data consumed by guards and downstream services.

- `sub`: userId
- `email`
- `tokenType`: `access` or `refresh`
- `iat`
- `exp`

## Relationships

- `UserAuthView` 1:1 with authentication credential state.
- `AuthTokenPair` generated from one authenticated `UserAuthView`.
- `JwtClaims.sub` maps directly to `UserAuthView.id`.

## Validation Rules

- Register DTO:
  - `name`: required, non-empty
  - `email`: required, valid email format
  - `password`: required, minimum length 8
- Login DTO:
  - `email`: required, valid email format
  - `password`: required, non-empty
- Refresh DTO:
  - `refreshToken`: required, non-empty JWT string

## State Transitions

### Registration

`unregistered` -> `registered`  
Actions:
- create user record
- hash password
- issue token pair
- store refresh token hash

### Login

`registered` -> `authenticated`  
Actions:
- verify password hash
- issue new token pair
- update refresh token hash

### Refresh

`authenticated` -> `authenticated (rotated)`  
Actions:
- validate refresh token and token hash
- issue new access token (and refreshed token pair if rotation policy enabled)
- update refresh token hash when rotating

### Logout (future)

`authenticated` -> `registered`  
Actions:
- clear refresh token hash
