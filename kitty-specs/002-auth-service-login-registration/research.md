# Research: Auth Service Login Registration

**Feature**: 002-auth-service-login-registration  
**Date**: 2026-03-22  
**Status**: Complete

## Decision 1: Token Model

**Decision**: Return both access and refresh tokens on register and login, and include `POST /auth/refresh` in scope.

**Rationale**: Planning interrogation confirmed refresh endpoint is required in this feature; token pair model supports short-lived access tokens and session continuity.

**Alternatives considered**:
- Access token only (rejected by user decision)
- Access+refresh with no refresh endpoint (rejected by user decision)

## Decision 2: Password Security

**Decision**: Use bcrypt hashing for all stored passwords with server-side salt rounds configuration.

**Rationale**: Meets explicit feature requirement and constitution security expectations for credential storage.

**Alternatives considered**:
- Argon2 (deferred; not requested)
- Plain hash with no salt (rejected, insecure)

## Decision 3: Validation Rules

**Decision**: Enforce password minimum length 8 via DTO validation at request boundary.

**Rationale**: Fails fast before service logic and guarantees consistent register/login request handling.

**Alternatives considered**:
- Service-only validation (rejected; duplicates validation responsibilities)

## Decision 4: Refresh Token Storage Strategy

**Decision**: Store refresh token hash (not raw token) in user auth fields and validate by hashing comparison during refresh.

**Rationale**: Limits token leakage impact if database records are exposed.

**Alternatives considered**:
- Storing raw refresh tokens (rejected for security risk)
- Stateless refresh with no persistence (deferred)

## Decision 5: Error Semantics

**Decision**: Use REST-standard status outcomes: validation errors for malformed input, unauthorized for bad credentials/invalid refresh token, conflict for duplicate email.

**Rationale**: Aligns constitution API consistency rules and keeps frontend behavior predictable.

**Alternatives considered**:
- Generic 200 with error payload (rejected)

## Clarification Reconciliation

- Spec assumption previously noted refresh lifecycle as out-of-scope.
- Planning decision overrides this: refresh endpoint is now in-scope for this feature.
