# Integration Plan

## Backend
- Project folder: `server`
- Run command: `npm --prefix server run dev`
- Port: `3001`
- Build command: `npm --prefix server run build`
- Health endpoint: `GET /api/health`
- API route inventory:
  - `GET /api/health`
  - `GET /api/rabbits`
  - `POST /api/rabbits`
  - `GET /api/daily-logs`
  - `POST /api/daily-logs`
  - `GET /api/food-entries`
  - `POST /api/food-entries`
  - `GET /api/weight-measurements`
  - `POST /api/weight-measurements`
  - `GET /api/health-records`
  - `POST /api/health-records`
  - `GET /api/memories`
  - `POST /api/memories/upload`

## Frontend
- Project folder: `client`
- Build command: `npm --prefix client run build`
- Dev command: `npm --prefix client run dev`
- API seam: `client/src/api/index.ts` (replace mock client with live client and keep single swap point)
- Mock files to remove after wiring: `client/src/api/mockClient.ts`, `client/src/mocks/**`, `client/src/api/previewState.ts`, `client/src/components/MockStateSwitcher.tsx`, and any duplicated local types that mirror shared contracts
- Live-data contract: server exposes the route inventory above and returns JSON arrays + create payloads matching the shared domain types

## Database
- Type: PostgreSQL
- Migration tool: `npm --prefix server exec prisma migrate dev` or the equivalent schema tool chosen by the integrate agent; no seed data to be created
- Migration directory: `server/prisma/migrations` or equivalent generated migration folder
- Connection env vars: `DATABASE_URL`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`

## Shared types
- Shared package: `shared`
- Import alias: `@bunny-log/shared`

## Services
- Essential: Blob Storage, PostgreSQL
- Enhancement: none for this scaffold

## Hand-off objective
- Wire the frontend to the live API client in the seam file, smoke-test every endpoint, create PostgreSQL schema migrations without seed data, and verify the app runs end-to-end.
