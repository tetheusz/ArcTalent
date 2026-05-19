# Phase 2 Context: On-Chain Sync & SBT Minting

## Decisions & Implementation Path

### 1. Manual "Claim Identity" Ritual
- **Decision**: Users will manually trigger the minting process from their profile page.
- **UX**: A "Claim On-Chain Identity" button will appear once the user has selected their archetype.
- **Feedback**: Use a cinematic loading state ("Channeling Identity to Arc Network...") during the minting process.

### 2. Token Metadata & Data Structure
- **Decision**: The Soulbound Token (SBT) will encapsulate the user's Class and Level at the moment of minting.
- **Format**: `ARCHETYPE:{Class}:{Level}` (e.g., `ARCHETYPE:Developer:Level1`).
- **Dynamic Updates**: The dashboard will continue to show the *current* computed level, while the SBT represents the *verified* milestone. Future phases may allow "Upgrading" the SBT.

### 3. Gas & Cost Policy
- **Decision**: Archetypes Platform will sponsor the minting.
- **Implementation**: The transaction will be sent by the Platform Admin Wallet (`ADMIN_PRIVATE_KEY`) to the user's address. The user does not need USDC to claim their initial identity.

### 4. Integration Logic
- **Action**: Create `mintArchetypeSBT(address, class, level)` in `src/actions/users.ts`.
- **Database**: Record the `transactionHash` in the `onChainProofs` table linked to the user.
- **Visuals**: Show a "Verified On-Chain" badge on the profile once the mint is successful.

## Verification Plan
- **Manual**: Claim an identity on a test wallet and verify the transaction hash on the Arc Explorer.
- **Data**: Ensure the `onChainProofs` record is correctly created and linked.
