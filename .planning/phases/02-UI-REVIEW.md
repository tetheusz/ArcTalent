# Phase 2 — UI Review

**Audited:** 2026-05-05
**Baseline:** abstract 6-pillar standards
**Screenshots:** captured

---

## Pillar Scores

| Pillar | Score | Key Finding |
|--------|-------|-------------|
| 1. Copywriting | 2/4 | Branding mismatch in error states ("Superteam Academy") and "Invalid Date" bugs. |
| 2. Visuals | 2/4 | Triple-split branding ("Archetypes", "ArcTalents", "Superteam Academy") and broken navigation. |
| 3. Color | 3/4 | Consistent dark palette but relies on hardcoded hex values in library code. |
| 4. Typography | 4/4 | Modern sans-serif hierarchy is well-implemented across accessible pages. |
| 5. Spacing | 4/4 | Premium use of whitespace and layout balance on home and missions pages. |
| 6. Experience Design | 1/4 | CRITICAL: False-positive offline fallback blocks access to Dashboard and Profile. |

**Overall: 16/24**

---

## Top 3 Priority Fixes

1. **Unify Branding** — Users see three different platform names (Archetypes, ArcTalents, Superteam Academy) — Propagate "ARCHETYPES" brand to all headers, meta tags, and error fallbacks.
2. **Fix Offline Logic** — Dashboard and Profile pages are inaccessible due to premature PWA/Offline fallback — Debug Service Worker or connectivity check triggering `ERR_CONNECTION_REFUSED` for auth logs.
3. **Fix Date Formatting** — Mission cards display "Started: Invalid Date" — Ensure ISO strings are correctly parsed using a robust utility like `date-fns` or native `Intl.DateTimeFormat`.

---

## Detailed Findings

### Pillar 1: Copywriting (2/4)
- [BLOCKER] Mission cards in `/missions` display `Started: Invalid Date`.
- [WARNING] Offline fallback text references "Superteam Academy PWA" instead of "Archetypes".
- [INFO] Hero copy on landing page is excellent and brand-aligned.

### Pillar 2: Visuals (2/4)
- [BLOCKER] Navigation fragmentation: 
    - Landing: "ARCHETYPES" logo.
    - Missions: "ArcTalents" sidebar logo.
    - Profile (Offline): "Superteam Academy" branding.
- [WARNING] Profile link in sidebar has `href="#"` and is non-functional.

### Pillar 3: Color (3/4)
- [INFO] Hardcoded hex values found in `src/lib/archetypes.ts` (e.g., `#00E5FF`, `#a855f7`).
- [INFO] Good contrast on hero section and mission cards.

### Pillar 4: Typography (4/4)
- Consistent use of modern sans-serif.
- Strong heading hierarchy on the landing page creates a cinematic feel.

### Pillar 5: Spacing (4/4)
- Section padding on the home page is well-proportioned.
- Mission grid layout handles various screen sizes gracefully.

### Pillar 6: Experience Design (1/4)
- [BLOCKER] False-positive offline detection prevents testing of the "Claim Identity" button and SBT minting flow.
- [BLOCKER] Redirect loop or connection error on `/api/auth/_log` impacts session stability.

---

## Files Audited
- `src/lib/archetypes.ts`
- `src/actions/users.ts`
- `src/components/Sidebar.tsx`
- `src/app/missions/page.tsx`
- `src/app/page.tsx`
- `src/app/offline/page.tsx`
