# Project Plan

**Status**: Integrating
**Created**: 2026-09-28
**Mode**: NEW

---

## 1. Project Overview

**Goal**: Bunny Log is a warm, polished rabbit-care tracker for daily care routines, food, weight, health history, reminders, and scrapbook memories. The project is designed so that every module is independently testable.

**App Type**: SPA + API

**API Login**: No

**Mode**: NEW

**Deployment Plan**: No deployment plan found

---

## 2. Backend — API

| Component | Technology |
|-----------|-----------|
| **Language** | TypeScript |
| **Runtime** | Node |
| **Package Manager** | npm |
| **Test Runner** | vitest |
| **Mocking Library** | vi.mock |
| **Test Command** | npm test |
| **Orchestration** | docker-compose |

> **Language vs Runtime**: `Language` is the source language the user picked in this service's `language` question. `Runtime` is the execution runtime — default `Node` for TypeScript/JavaScript, `CPython` for Python, `.NET` for C#. Only deviate from the default (e.g. `Bun`, `Deno`, `PyPy`) when the user explicitly asks. **Package Manager and Test Runner are language-dependent** — match them to this service's Language (e.g. C# → `dotnet (NuGet)` + `xUnit`/`NUnit`/`MSTest`). The `Orchestration` row is recorded for the scaffold step but hidden in the plan UI — always keep it set to `docker-compose`.

---

## 3. Frontend — Web App

| Component | Technology |
|-----------|-----------|
| **Language** | TypeScript |
| **Framework** | React + Vite |
| **Package Manager** | npm |
| **Test Runner** | vitest |
| **Mocking Library** | vi.mock |
| **Test Command** | npm test |

---

## 4. Services Required

| Azure Service | Role in App | Environment Variable | Default Value (Local) | Classification |
|---------------|------------|---------------------|----------------------|----------------|
| Blob Storage | Store rabbit photos and scrapbook uploads | STORAGE_CONNECTION_STRING | UseDevelopmentStorage=true | Essential |
| PostgreSQL | Primary persistence for rabbit profiles, care logs, food, weight, and health records | DATABASE_URL | postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5432/bunnylog | Essential |

---

## 5. Prerequisites

### Run

| Tool | Service(s) | Installed | Version |
|------|------------|-----------|---------|
| Node.js | Backend, Frontend | ✅ | 24.19.0 |
| npm | Backend, Frontend | ✅ | 11.17.0 |
| PostgreSQL client | Backend | ❓ | Unknown |

### Debug

| Tool | Service(s) | Installed | Version |
|------|------------|-----------|---------|
| Docker | Backend | ❓ | Unknown |
| Docker Compose | Backend | ❓ | Unknown |

> Inform the user to double-check all ❓ tools are installed before proceeding.

---

## 6. Design System & UI

**Component Library**: Fluent UI v9
**Style Direction**: A warm, homey care dashboard with soft cream surfaces, sage accents, and tactile cards that make everyday rabbit care feel approachable and calm. The interface should feel reassuring and premium without becoming overly playful or cluttered.
**Typography**: Inter, system-ui

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#7B8F73` | Brand and active navigation; uses for selected nav items and primary actions. |
| `accent` | `#D68B63` | Secondary highlights for quick actions, paw indicators, and callouts. |
| `surface` | `#FBF8F1` | Main page and card backgrounds for a light, restful treatment workspace. |
| `text` | `#2F2A27` | Body text and labels for readable, high-contrast content. |
| `muted` | `#6F645C` | Secondary metadata, timestamps, and subdued captions. |
| `border` | `#E7DFD4` | Dividers, table borders, and input boundaries. |

### Pages

| Page | Route | Purpose | Layout |
|------|-------|---------|--------|
| Dashboard | `/` | Overview of today’s rabbit care, summary cards, and a quick log CTA | `sidebar + hero + main + card-list` |
| Daily Log | `/daily-log` | Review selected-day care and capture check-ins, notes, and medications | `sidebar + list + form + action-bar` |
| Food | `/food` | Track feeding history, favorites, and weekly totals | `sidebar + table + card-list` |
| Weight | `/weight` | Monitor weight changes over time and compare trends | `sidebar + grid + table` |
| Memories | `/memories` | Browse scrapbook photos with captions and dates | `sidebar + card-list + gallery` |

### Sample Content

```
Dashboard — Rabbit profile:
| Rabbit | Last Check-In | Weight | Status |
| Clover | Today, 8:15 AM | 1.8 kg | Healthy |
| Maple | Today, 7:40 AM | 1.6 kg | Needs hydration check |
| Pippin | Yesterday | 2.1 kg | Stable |

Daily Log — care entry: Breakfast meal: hay + greens · Notes: alert and active · Reminder: Trim nails on Friday
Food — meal: Fresh greens and pellets · Favorite: Yes · Weekly total: 5.6 kg
Memories — photo caption: Napping in the warm sun · Date: 2026-09-12
```

---

## 7. Project Structure

```
/
├─ .azure/
│  ├─ project-plan.md
│  ├─ requirements.json
│  └─ .preview-temp/
├─ client/
│  ├─ src/
│  ├─ package.json
│  ├─ tsconfig.json
│  ├─ vite.config.ts
│  └─ index.html
├─ server/
│  ├─ src/
│  ├─ package.json
│  ├─ tsconfig.json
│  └─ src/routes/
├─ shared/
│  └─ types/
├─ docker-compose.yml
├─ .env.example
├─ README.md
└─ package.json
```

---

## 8. Route Definitions

| # | Method | Path | Description | Request Body | Response Body | Status Codes |
|---|--------|------|-------------|-------------|--------------|-------------|
| 1 | GET | `/api/health` | Health check | — | `{ status, services }` | 200, 503 |
| 2 | GET | `/api/rabbits` | List rabbit profiles | — | `[{ id, name, breed, dob, notes }]` | 200 |
| 3 | POST | `/api/rabbits` | Create rabbit profile | `{ name, breed, dob, notes }` | `{ id, name, breed, dob, notes }` | 201, 400 |
| 4 | GET | `/api/daily-logs` | List care logs | — | `[{ id, rabbitId, date, checkIns, notes }]` | 200 |
| 5 | POST | `/api/daily-logs` | Create care log | `{ rabbitId, date, checkIns, notes }` | `{ id, rabbitId, date, checkIns, notes }` | 201, 400 |
| 6 | GET | `/api/food-entries` | List food entries | — | `[{ id, rabbitId, date, foodName, quantity, favorite }]` | 200 |
| 7 | POST | `/api/food-entries` | Save food entry | `{ rabbitId, date, foodName, quantity, favorite }` | `{ id, rabbitId, date, foodName, quantity, favorite }` | 201, 400 |
| 8 | GET | `/api/weight-measurements` | List weight history | — | `[{ id, rabbitId, date, value, unit }]` | 200 |
| 9 | POST | `/api/weight-measurements` | Save weight entry | `{ rabbitId, date, value, unit }` | `{ id, rabbitId, date, value, unit }` | 201, 400 |
| 10 | GET | `/api/health-records` | List health items | — | `[{ id, rabbitId, date, category, summary, reminderDate }]` | 200 |
| 11 | POST | `/api/health-records` | Save health record | `{ rabbitId, date, category, summary, reminderDate }` | `{ id, rabbitId, date, category, summary, reminderDate }` | 201, 400 |
| 12 | GET | `/api/memories` | List scrapbook photos | — | `[{ id, rabbitId, caption, capturedAt, blobKey }]` | 200 |
| 13 | POST | `/api/memories/upload` | Upload a scrapbook photo | `multipart/form-data` | `{ id, caption, blobUrl }` | 201, 400, 413 |

---

## 9. Next Steps

1. Run **azure-project-scaffold** to execute this plan
2. Run **azure-project-integrate** to wire the frontend to live data, smoke-test the backend, and create the migrations
3. Run **azure-debug-plan** → **azure-debug-generate** for Docker emulators and VS Code debugging
4. Run the **azure-deploy** agent when ready; it uses **azure-app-onboard** for architecture, cost estimation, IaC generation, provisioning, and health verification
