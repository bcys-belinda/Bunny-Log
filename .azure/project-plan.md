**Status**: Approved
**Created**: 2026-09-28
**Mode**: planning

## 1. Project Overview

Bunny Log is a warm, polished rabbit-care tracker for daily check-ins, food, weight, health, and photo memories. It is a single-owner experience with a React frontend and a TypeScript API. Users can record routine care, review trends, maintain health history, and preserve photo memories in one place.

## 2. Goals & Requirements

- Build a responsive, accessible interface for recording and reviewing rabbit care.
- Support rabbit profiles, daily care logs, food entries and favorites, weight measurements, health records and reminders, and scrapbook photo metadata.
- Provide create, read, update, and delete operations for the stored records.
- Store uploaded scrapbook photos in Azure Blob Storage and relational records in PostgreSQL.
- Do not require application sign-in, per the selected requirement. Treat the deployed instance and its data as private; restrict network access until an access-control approach is explicitly approved. Do not expose unauthenticated personal records or uploaded media publicly.

## 3. Architecture

- **Frontend**: React with TypeScript; deploy as a static web application.
- **Backend API**: TypeScript with Express; expose REST endpoints and connect to the database and object storage through server-side configuration.
- **Relational data**: Azure Database for PostgreSQL Flexible Server for rabbit profiles and care records.
- **Media**: Azure Blob Storage for scrapbook image files. Keep containers private and use short-lived, server-issued access URLs when displaying or uploading images.
- **Configuration**: Keep database credentials and storage access in managed application settings or secret references. The browser must not receive database credentials or storage account keys.
- **Deployment boundary**: Host the frontend separately from the API. Configure the frontend's API base URL per environment, allow only the expected frontend origin, and use HTTPS.

## 4. Data Model

- **RabbitProfile**: id, name, photo reference, breed, date of birth (optional), and profile notes.
- **DailyCareLog**: id, rabbit id, local date, check-in markers, care notes, and created/updated timestamps.
- **FoodEntry**: id, rabbit id, date, food name, quantity, notes, and favorite flag. Weekly summaries are derived from these entries.
- **WeightMeasurement**: id, rabbit id, measured-at date, value, unit, and notes. The UI plots measurements chronologically.
- **HealthRecord**: id, rabbit id, date, category, summary, details, and optional reminder date.
- **PhotoMemory**: id, rabbit id, private blob reference, caption, captured-at date, and created-at timestamp. Store image bytes only in Blob Storage.

Use generated identifiers, foreign keys to the rabbit profile, and timestamps on mutable records. Validate units, dates, and required fields in the API. Store dates consistently and format them in the user's local timezone in the UI.

## 5. API & Application Flows

Provide RESTful CRUD routes grouped by resource: `/api/rabbits`, `/api/daily-logs`, `/api/food-entries`, `/api/weight-measurements`, `/api/health-records`, and `/api/photo-memories`. Add focused read endpoints for dashboard summaries, calendar-day details, and weekly food totals where these reduce client-side duplication.

Photo uploads should use an API-authorized flow that keeps the container private; persist metadata and blob references separately. Return consistent validation and not-found errors, and avoid returning secrets or raw storage credentials. Configure CORS narrowly for the deployed frontend origin.

The primary screen is a time-aware dashboard with the rabbit profile, daily check-in markers, care summaries, a weight trend, and a prominent **Log Today** action. A calendar shows paw indicators and selected-day details. Dedicated Food, Weight, Health, and Memories views provide weekly food summaries and favorites, a weight chart, health history and reminders, and a captioned scrapbook gallery. **Log Today** opens a right-side slide-in panel with accessible, validated inputs and clear save/cancel feedback.

## 6. Design System & UI

**Component Library**: Fluent UI v9

Use a warm off-white canvas with sage and restrained brown as supporting colors, balanced by a small coral accent for primary actions and clear status colors. Maintain readable contrast and avoid using color alone to communicate care status. Use expressive display typography for page titles and a highly legible sans-serif for controls and data. Keep navigation dense and predictable, reserve compact cards for repeated metrics, and use a stable chart area for weight history.

The desktop layout has a persistent left navigation for Home, Daily Log, Food, Weight, Health, Memories, and Settings, with a focused content area. On smaller screens, collapse navigation into an accessible menu and make the logging panel a full-width sheet. Use labeled controls, keyboard-operable calendar and gallery interactions, visible focus states, descriptive image text, and reduced-motion support. Rabbit-themed interactions should remain subtle and never block task completion.

## 7. Validation & Delivery

- Verify core CRUD flows and field validation for every record type.
- Verify dashboard summaries, calendar selection, weekly food totals, weight chart updates, reminders, and photo upload/display behavior.
- Check responsive layouts, keyboard navigation, focus visibility, contrast, and reduced-motion behavior.
- Confirm private blob access, HTTPS, secret handling, and network restrictions for the unauthenticated deployment before storing real personal data.
- Provide environment-specific configuration and a concise local setup guide; do not commit credentials or real rabbit-care data.