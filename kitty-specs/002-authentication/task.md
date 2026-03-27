# Task: Authentication Implementation

- Create `server/src/auth` module with controller, service, DTO, JWT strategy, and guard
- Add `POST /auth/register` with DTO validation: name, email, password
- Enforce unique email at Prisma level and service error handling
- Hash password before save and never return password hash in responses
- Add `POST /auth/login` with DTO validation: email, password
- Verify credentials and return JWT token on success
- Include `userId` in JWT payload
- Mark only `/auth/register` and `/auth/login` as public
- Protect all other endpoints with JWT guard
- Extract authenticated `userId` from token for downstream operations
- Ensure Prisma User model includes `name`, `email @unique`, `passwordHash`
- Run Prisma migration and regenerate client
- Add tests: register success, duplicate email, login success, invalid credentials, protected route without token
