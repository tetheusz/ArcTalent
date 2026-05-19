# Milestone Summary: v1 — Gamified Identity Foundation

## 1. Overview
This milestone marks the successful transition of the platform from **ArcTalents** to **Archetypes**. The goal was to establish a high-end, cinematic reputation layer for the Arc Network, replacing a standard contributor board with a gamified RPG-style identity system.

**Key Achievements:**
- Full site-wide rebrand to **Archetypes**.
- Implementation of the **Archetype Engine** (XP/Leveling).
- Creation of the **Magical Onboarding Ritual** (RPG card selection).
- Refactor of the **Character Sheet Profile** UI.

## 2. Architecture & Patterns
- **Identity Engine**: Centralized in `src/lib/archetypes.ts`. Computes levels (1-10) and classes based on mission categories.
- **Sync Pattern**: `AuthSync.tsx` component ensures every connected wallet is registered in the database with the correct role (respecting `ADMIN_ADDRESS` env).
- **Aesthetic System**: 0px border-radius, high-tracking typography, and `framer-motion` for fluid, magical animations.
- **Data Integrity**: XP is computed from approved submissions to maintain a single source of truth aligned with potential on-chain records.

## 3. Phases & Progress
- **Phase 1: Identity & Archetypes Core** (100% Complete)
  - Branding migration.
  - Onboarding ritual implementation.
  - Profile character sheet refactor.
  - Database schema expansion (`chosen_archetype`).

## 4. Key Technical Decisions
- **Chosen vs. Primary Archetype**: Users select a "Starter" archetype for flavor, but their "Primary" archetype evolves dynamically based on their actual work.
- **Magical Theme**: Combined high-tech "cockpit" UI with mythical roles (Alchemist, Archmage, etc.) to differentiate the platform from generic web3 tools.
- **Computed Reputation**: Decisions to compute XP on-the-fly to prevent database desync in early development.

## 5. Requirements Status
- [x] Brand Rename
- [x] XP/Level Logic
- [x] RPG Onboarding
- [x] Profile Character Sheet
- [x] Admin Auto-Promotion

## 6. Known Concerns & Tech Debt
- **DB Reset Vulnerability**: Frequent manual `dev.db` resets require account re-syncing.
- **On-chain Latency**: UI currently relies on local DB; future phases need to handle blockchain confirmation states.
- **Performance**: Dynamic XP calculation for profiles with hundreds of submissions may need a caching layer in Milestone 2.

## 7. Getting Started for New Team Members
1. Clone repository and run `npm install`.
2. Configure `.env` with `NEXT_PUBLIC_ADMIN_ADDRESS`.
3. Run `npx drizzle-kit push` to initialize the database.
4. Launch via `npm run dev`.
5. Connect wallet to trigger the **Manifest Identity** ritual.
