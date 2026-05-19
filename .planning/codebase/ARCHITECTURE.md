# Architecture

- **Server-First Logic**: Most business logic (mission creation, submission approval) is handled via Next.js Server Actions.
- **On-Chain/Off-Chain Hybrid**: Reputation state is stored in SQLite for performance and mirrored on-chain via SBTs and attestations.
- **Immersive Frontend**: Landing page uses a full-viewport WebGL scene for high visual impact, transitioning to a structured dashboard.
- **Archetype Engine**: Modular logic in `src/lib/archetypes.ts` computes gamified levels from contribution history.
