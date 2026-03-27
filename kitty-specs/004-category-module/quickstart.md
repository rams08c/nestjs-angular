# Quickstart: Category Module

## Prerequisites

- PostgreSQL running
- `server/.env` has `DATABASE_URL` and `JWT_SECRET`
- Dependencies installed in `server/`

## 1. Apply schema migration

```bash
cd server
npx prisma migrate dev --name category-system-user-rules
npx prisma generate
```

## 2. Start API

```bash
cd server
npm run start:dev
```

## 3. Get JWT token

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"StrongPass123"}'
```

## 4. Test category endpoints

```bash
# Create user category
curl -X POST http://localhost:3000/categories \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Food","type":"expense"}'

# List visible categories
curl http://localhost:3000/categories \
  -H "Authorization: Bearer <token>"

# Get single category
curl http://localhost:3000/categories/<categoryId> \
  -H "Authorization: Bearer <token>"

# Update user category
curl -X PUT http://localhost:3000/categories/<categoryId> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Groceries"}'

# Delete user category
curl -X DELETE http://localhost:3000/categories/<categoryId> \
  -H "Authorization: Bearer <token>"
```

## 5. Expected protections

- Update/delete system category returns `403`
- Update/delete other user category returns `403`
- Access non-visible category returns `404`
