<div align="center">
  <img src="https://i.imgur.com/K3Z1xKz.png" alt="Arc Network Logo" width="150" />

  # ⚡ ArcTalent (Archetypes Network)

  **The On-Chain Gamified Talent Ecosystem for Web3**

  [![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
  [![Wagmi](https://img.shields.io/badge/Wagmi-Web3-00E5FF)](https://wagmi.sh/)
  [![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-SQLite-C5F74F)](https://orm.drizzle.team/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

  [Explore Platform](#) · [Report Bug](#) · [Request Feature](#)
</div>

---

## 📖 About The Project

ArcTalent (Archetypes Network) is a decentralized, gamified talent layer connecting Web3 Protocols with skilled contributors. Built on EVM chains, it transforms open-source contributions, bounties, and protocol growth into an engaging RPG-like experience.

Contributors define their **Archetype** (DApp Architect, Cyber Security, Community Manager, etc.), claim their On-Chain Soulbound Token (SBT) identity, and start earning reputation (XP) by completing missions published by verified protocols.

### 🌟 Key Features

* **🛡️ On-Chain Identity & SBTs**: Contributors claim Soulbound Tokens representing their skills and achievements. Gasless minting sponsored by the platform.
* **🎯 Gamified Mission Board**: Protocols list bounties and tasks. Contributors submit proof of work to earn reputation and level up.
* **🏢 Protocol Admin Dashboard**: Verified protocols get an autonomous dashboard to create campaigns, manage missions, and review submissions.
* **⚖️ Decentralized Review Pipeline**: Protocol founders independently review contributor evidence and issue XP/Badges directly on-chain.
* **🏆 Leaderboards & Reputation**: A purely meritocratic ranking system based on verified on-chain contributions (Coming Soon).

---

## 🛠️ Built With

This project is built with a modern, high-performance tech stack:

* **Framework:** [Next.js (App Router)](https://nextjs.org/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Database:** [SQLite](https://sqlite.org/) via [Drizzle ORM](https://orm.drizzle.team/)
* **Web3 Integration:** [Wagmi](https://wagmi.sh/), [Viem](https://viem.sh/), and [ConnectKit](https://docs.family.co/connectkit)
* **Styling:** Vanilla CSS Modules with a custom Cyberpunk/Glassmorphism design system.
* **Icons:** [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v18 or higher)
* npm, yarn, or pnpm
* A Web3 Wallet (MetaMask, Rabby, etc.) for testing

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/arctalent.git
   cd arctalent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env.local` file in the root directory and add your configurations (RPC endpoints, WalletConnect Project ID, Admin Wallets, etc.):
   ```env
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
   ADMIN_WALLET_ADDRESS=0xYourAdminWallet
   # Add your specific local SQLite DB path if needed
   ```

4. **Initialize the Database**
   Push the schema to your local SQLite database:
   ```bash
   npm run db:push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Explore!**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗺️ Roadmap

- [x] **Phase 1:** Foundation & Gamified Core (Missions, Profiles, XP System)
- [x] **Phase 2:** On-Chain Sync & SBT Minting (Web3 Identity)
- [x] **Phase 3:** Protocol Activation & Review Pipeline (Autonomous Protocol Dashboards)
- [ ] **Phase 4:** Leaderboards & Social Reputation (Global Rankings)
- [ ] **Phase 5:** Decentralized Dispute Resolution

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---
<div align="center">
  <i>Built with 🖤 by the Arc Network Team</i>
</div>
