# Project Structure

- `src/app/`: Next.js 15 routes and pages.
  - `/admin/`: Platform management.
  - `/dashboard/`: Contributor and Protocol views.
  - `/profile/`: Gamified user character sheets.
  - `/missions/`: Public mission board.
  - `/protocols/`: Protocol directory and onboarding.
- `src/actions/`: Server actions grouped by entity (users, missions, submissions).
- `src/components/`: Reusable UI components.
  - `Scene3D.tsx`: Three.js immersive background.
  - `AuthSync.tsx`: Automatic user synchronization logic.
- `src/db/`: Drizzle schema and database initialization.
- `src/lib/`: Utility logic and gamification engines.
