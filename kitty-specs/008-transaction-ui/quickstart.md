# Quickstart: Transaction UI (Frontend)

## Prerequisites

- Node.js and npm installed
- Repository dependencies installed

## Run App

- From project root: `cd client`
- Start frontend: `npm run start`
- Open app and login with valid user session
- Navigate to `/dashboard`

## Verify Feature Behavior

- Confirm transaction list renders only for authenticated user
- Click `+ Add Transaction` and verify inline DaisyUI drawer/modal opens
- Submit valid transaction and verify immediate list update
- Click edit icon and verify existing data is prefilled
- Save edit and verify immediate list update
- Click delete icon and verify confirmation modal appears
- Confirm delete and verify item is removed from list
- Refresh app with valid token and verify user reaches dashboard flow
- Expire/clear token and verify protected behavior redirects to login

## Out of Scope in This Plan

- Backend API contract additions
- Server persistence changes
