---
status: testing
phase: 02-on-chain-sync-sbt-minting
source: [".planning/phases/2-CONTEXT.md", ".planning/STATE.md"]
started: 2026-05-05T06:02:00Z
updated: 2026-05-05T06:02:00Z
---

## Current Test
<!-- OVERWRITE each test - shows where we are -->

number: 1
name: Cold Start Smoke Test
expected: |
  Kill any running server/service. Clear ephemeral state (temp DBs, caches, lock files). Start the application from scratch. Server boots without errors, any seed/migration completes, and a primary query (health check, homepage load, or basic API call) returns live data.
awaiting: user response

## Tests

### 1. Cold Start Smoke Test
expected: |
  Kill any running server/service. Clear ephemeral state (temp DBs, caches, lock files). Start the application from scratch. Server boots without errors, any seed/migration completes, and a primary query (health check, homepage load, or basic API call) returns live data.
result: [pending]

### 2. Claim Identity Button Visibility
expected: |
  Navigate to the profile page of a user who has selected an archetype. A "Claim On-Chain Identity" button should be visible.
result: [pending]

### 3. Minting Ritual UI
expected: |
  Click the "Claim On-Chain Identity" button. A cinematic loading state should appear with the text "Channeling Identity to Arc Network...".
result: [pending]

### 4. SBT Minting (Admin Sponsored)
expected: |
  The minting process should complete successfully without requiring gas from the user's wallet. The transaction should be sent by the Platform Admin Wallet.
result: [pending]

### 5. Profile Badge Update
expected: |
  After successful minting, the profile should display a "Verified On-Chain" badge.
result: [pending]

## Summary

total: 5
passed: 0
issues: 0
pending: 5
skipped: 0

## Gaps

[none yet]
