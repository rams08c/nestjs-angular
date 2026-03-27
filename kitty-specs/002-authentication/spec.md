# Feature: Authentication

## Goal
- Build minimal authentication module on NestJS v11.0.6
- Support user registration and login
- Issue JWT for authenticated access

## API
- POST /auth/register
- POST /auth/login
- POST /auth/register request: name, email, password
- POST /auth/register response: id, name, email
- POST /auth/login request: email, password
- POST /auth/login response: token
- Require Bearer JWT for all future protected requests
- Include userId in JWT payload

## DTO
- RegisterDto: name, email, password
- LoginDto: email, password
- RegisterResponseDto: id, name, email
- AuthTokenDto: token
- JwtPayloadDto: userId

## Rules
- Keep controllers thin with no business logic
- Keep all business logic in services
- Validate all input using DTO validation
- Enforce unique email on registration
- Hash password before storing user record
- Verify password hash on login
- Return signed JWT token on successful login
- Make only /auth/register and /auth/login public
- Require valid JWT for all other endpoints
- Reject requests with missing or invalid Bearer token
- Extract userId from JWT for all authenticated operations
- Scope all data operations by authenticated userId
- Define shared NestJS error messages in server/src/app.constant.ts
- Use exported error constants in feature services

## DB (Prisma)
- Use PostgreSQL v18.1 with Prisma ORM
- User model fields: id, name, email, passwordHash, createdAt, updatedAt
- id: Int @id @default(autoincrement())
- name: String
- email: String @unique
- passwordHash: String
- createdAt: DateTime @default(now())
- updatedAt: DateTime @updatedAt
- Use migration for schema creation and updates

## Tasks
- Create AuthModule, AuthController, AuthService
- Add POST /auth/register endpoint
- Add POST /auth/login endpoint
- Implement RegisterDto and LoginDto with validation
- Implement password hashing service flow for registration
- Implement credential verification for login
- Implement JWT signing with userId payload
- Implement JWT guard and strategy for protected routes
- Add Prisma User model and run migration
- Add tests for register success
- Add tests for register duplicate email rejection
- Add tests for login success with token response
- Add tests for login failure on invalid credentials
- Add tests for protected route rejection without token
- Create server/src/app.constant.ts and wire auth error messages to constants
