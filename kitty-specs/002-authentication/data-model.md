# Data Model: Authentication

**Feature**: 002-authentication
**Date**: 2026-03-26
**Source**: spec.md + research.md

## Entities

### User
- id: Int, primary key, autoincrement
- name: String, required
- email: String, required, unique
- passwordHash: String, required
- createdAt: DateTime, default now
- updatedAt: DateTime, auto-updated

## Prisma Model

```prisma
model User {
  id           Int      @id @default(autoincrement())
  name         String
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@map("users")
}
```

## DTO Validation Rules

- RegisterDto.name: required, non-empty string
- RegisterDto.email: required, valid email format
- RegisterDto.password: required, minimum length policy enforced
- LoginDto.email: required, valid email format
- LoginDto.password: required, non-empty string

## Token Model

- Access token type: Bearer JWT
- Payload: userId
- Usage: required for all protected endpoints

## State Transitions

- Registration: input -> validate -> hash password -> create user -> return safe user data
- Login: input -> validate -> verify user and password hash -> sign JWT -> return token
