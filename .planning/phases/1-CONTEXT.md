# Phase 1 Context: Identity & Archetypes Core

## Decisions & Implementation Path

### 1. XP & Level Logic (The "Truth")
- **Decision**: XP will be computed dynamically from approved submissions to maintain maximum alignment with on-chain records. 
- **Persistence**: We will NOT store a separate "XP" field in the database yet to avoid desync. The "Truth" is the sum of reputation rewards from approved missions.

### 2. RPG Onboarding (The "Choice")
- **Feature**: "Initialize Your Archetype".
- **Interaction**: New users will be presented with a high-fidelity card selection screen (RPG style) upon first login.
- **Selection**: User picks one of the 5 core classes: Developer, Sentinel, Creator, Scholar, or Strategist.
- **Flexibility**: This choice defines their "Starting Archetype" but is not a hard lock. Their "Current Archetype" will reflect their mission activity, but the chosen one will remain as a legacy/starter badge on their profile.
- **Database**: Add `chosenArchetype` field to the `users` table.

### 3. Visual Leveling & Feedback
- **Feature**: Level-up feedback integrated with the RPG theme.
- **Interactivity**: When a user's total XP crosses a threshold (defined in `lib/archetypes.ts`), trigger a visual event (e.g., a "Level Up" toast or glow effect on the profile).

### 4. Scope Restriction
- **Skills Tree**: Deferred to future phases. Only Class XP and Levels will be tracked and displayed for now.

## Archetype Mapping (Locked)
- `TECHNICAL` -> **Developer** (Cyan)
- `QA_TESTING` -> **Sentinel** (Purple)
- `CONTENT_CREATION` -> **Creator** (Amber)
- `RESEARCH` -> **Scholar** (Blue)
- `COMMUNITY` -> **Strategist** (Green)
