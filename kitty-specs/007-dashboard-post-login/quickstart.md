# Quickstart: Dashboard Post-Login

## Prerequisites
- Node.js 20+
- Angular CLI 21.x (`npm i -g @angular/cli`)
- Backend running (for auth token) — see `server/README.md`

## Dev Setup

```bash
# From project root
cd client
npm install
ng serve
```

App runs at `http://localhost:4200`.

## Access Dashboard

1. Register or log in at `http://localhost:4200/login`
2. On success, browser redirects to `http://localhost:4200/dashboard`
3. Dashboard loads all data from mock signals — no backend calls needed on this page

## Build

```bash
cd client
ng build --configuration production
```

## Run Tests

```bash
cd client
ng test
```

## Key Files

| File | Purpose |
|---|---|
| `src/app/dashboard/services/dashboard-signal.service.ts` | All dashboard signals + mock data |
| `src/app/dashboard/dashboard.ts` | Shell component |
| `src/app/dashboard/dashboard.routes.ts` | Lazy route definition |
| `src/app/auth/guards/auth.guard.ts` | Protects `/dashboard` |
| `src/app/app.routes.ts` | Register dashboard lazy route here |
