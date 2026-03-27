# Quickstart: Transaction Module

## Prerequisites

- PostgreSQL running (schema already migrated — no new migration needed)
- `server/.env` configured with `DATABASE_URL` and `JWT_SECRET`
- Dependencies installed: `cd server && npm install`

## Run the server

```bash
cd server
npm run start:dev
```

## Test the endpoints

```bash
# 1. Register + login to get a token
TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret"}' | jq -r .accessToken)

# 2. Create a transaction
curl -X POST http://localhost:3000/transactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"categoryId":"<id>","amount":50.00,"currency":"USD","transactionDate":"2026-03-26"}'

# 3. List transactions
curl http://localhost:3000/transactions \
  -H "Authorization: Bearer $TOKEN"

# 4. Get by ID
curl http://localhost:3000/transactions/<id> \
  -H "Authorization: Bearer $TOKEN"

# 5. Update
curl -X PUT http://localhost:3000/transactions/<id> \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"note":"Updated note"}'

# 6. Delete
curl -X DELETE http://localhost:3000/transactions/<id> \
  -H "Authorization: Bearer $TOKEN"
```

## Run tests

```bash
# Unit
cd server && npm run test -- transactions

# e2e
cd server && npm run test:e2e -- transactions
```
