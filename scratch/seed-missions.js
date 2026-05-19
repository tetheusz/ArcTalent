const { drizzle } = require('drizzle-orm/better-sqlite3');
const Database = require('better-sqlite3');
const crypto = require('crypto');

const sqlite = new Database('dev.db');
const db = drizzle(sqlite);

async function seed() {
  console.log('🌱 Seeding Arc House Missions...');

  // 1. Create Arc House Protocol
  const protocolId = crypto.randomUUID();
  sqlite.prepare(`
    INSERT OR IGNORE INTO protocols (id, name, slug, description, is_verified)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    protocolId, 
    'Arc House', 
    'arc-house', 
    'The core governing body of the Arc Network. Empowering the next generation of on-chain contributors.', 
    1
  );

  const missions = [
    // DEVELOPER
    { title: 'Genesis Architect', category: 'Developer', reward: 100, desc: 'Deploy your first smart contract on the Arc Testnet.', req: 'Contract address and transaction hash.' },
    { title: 'Realm Summoner', category: 'Developer', reward: 150, desc: 'Successfully apply and verify a new protocol in the Sanctum.', req: 'Protocol slug and verification status.' },
    { title: 'SDK Integrator', category: 'Developer', reward: 200, desc: 'Integrate the Arc Reputation SDK into your dApp.', req: 'GitHub repository link showing integration.' },
    { title: 'Bug Bounty: Core', category: 'Developer', reward: 500, desc: 'Find and report a critical vulnerability in the Arc-Core contracts.', req: 'Detailed report and proof of concept.' },
    { title: 'API Wizard', category: 'Developer', reward: 120, desc: 'Build a tool that consumes Arc Network public APIs.', req: 'Live URL or GitHub repo.' },
    { title: 'Gas Master', category: 'Developer', reward: 80, desc: 'Optimize an existing Arc contract to reduce gas costs by 15%.', req: 'Comparison of transaction costs.' },
    { title: 'Oracle Weaver', category: 'Developer', reward: 180, desc: 'Implement a custom oracle feed for protocol reputation.', req: 'Deployed contract address.' },
    { title: 'UI Contributor', category: 'Developer', reward: 140, desc: 'Submit a PR to improve the Arc Talent frontend dashboard.', req: 'Link to the merged PR.' },

    // SENTINEL
    { title: 'Feedback Loop: UI', category: 'Sentinel', reward: 30, desc: 'Provide detailed feedback on the current Identity page design.', req: 'A paragraph of constructive criticism.' },
    { title: 'The Great Bug Hunt', category: 'Sentinel', reward: 50, desc: 'Find and document a visual bug in the Rankings page.', req: 'Screenshot and steps to reproduce.' },
    { title: 'Guardian of Realms', category: 'Sentinel', reward: 70, desc: 'Verify 10 submissions from other contributors in the review portal.', req: 'System will track your review count.' },
    { title: 'UX Auditor', category: 'Sentinel', reward: 100, desc: 'Conduct a full UX audit of the onboarding flow.', req: 'A PDF or Google Doc with findings.' },
    { title: 'Security Scout', category: 'Sentinel', reward: 120, desc: 'Report a phishing attempt or scam related to the Arc ecosystem.', req: 'Evidence of the malicious activity.' },
    { title: 'Stress Tester', category: 'Sentinel', reward: 90, desc: 'Perform a load test on a partner protocol mission page.', req: 'Testing methodology and results.' },
    { title: 'Accessibility Advocate', category: 'Sentinel', reward: 110, desc: 'Improve the accessibility (A11y) of a core page.', req: 'Code changes or detailed audit report.' },

    // CREATOR
    { title: 'Brand Ambassador', category: 'Creator', reward: 60, desc: 'Create a high-quality X thread explaining Arc Archetypes.', req: 'Link to the thread.' },
    { title: 'Visual Alchemist', category: 'Creator', reward: 150, desc: 'Design a new set of badge icons for the Arc Network.', req: 'Figma link or high-res exports.' },
    { title: 'Meme Lord', category: 'Creator', reward: 40, desc: 'Create 5 original memes about the Arc Testnet life.', req: 'Links to the social posts.' },
    { title: 'Video Chronicler', category: 'Creator', reward: 250, desc: 'Create a 3-minute video tutorial on how to apply for a protocol.', req: 'YouTube or Loom link.' },
    { title: 'Wordsmith', category: 'Creator', reward: 120, desc: 'Write a deep-dive article about the future of Soulbound Tokens.', req: 'Medium or Mirror link.' },
    { title: 'Artistic Vanguard', category: 'Creator', reward: 200, desc: 'Create a unique NFT artwork celebrating the Arc House launch.', req: 'Link to the NFT or original file.' },
    { title: 'Podcast Guest', category: 'Creator', reward: 180, desc: 'Appear on a Web3 podcast to discuss your journey in Arc.', req: 'Link to the episode.' },

    // SCHOLAR
    { title: 'Reputation Researcher', category: 'Scholar', reward: 100, desc: 'Write a comparative study on Arc vs other reputation systems.', req: 'A 2-page research document.' },
    { title: 'Linguist: Portuguese', category: 'Scholar', reward: 150, desc: 'Translate the main Arc Documentation to Portuguese.', req: 'Link to the translated docs/PR.' },
    { title: 'Governance Sage', category: 'Scholar', reward: 130, desc: 'Propose a new governance model for the Arc House Council.', req: 'Detailed proposal document.' },
    { title: 'Metric Analyst', category: 'Scholar', reward: 110, desc: 'Analyze the growth metrics of the first 100 Arc contributors.', req: 'Data report with charts.' },
    { title: 'Tokenomics Critic', category: 'Scholar', reward: 140, desc: 'Write a critique of the current Arc reputation reward curves.', req: 'Analytical article.' },
    { title: 'Historical Archivist', category: 'Scholar', reward: 90, desc: 'Document the history of the Arc Testnet phases.', req: 'A timeline document.' },

    // STRATEGIST
    { title: 'Protocol Scout', category: 'Strategist', reward: 150, desc: 'Onboard 3 partner protocols to the Arc Network.', req: 'Protocol names and verification proofs.' },
    { title: 'Community Catalyst', category: 'Strategist', reward: 80, desc: 'Organize and host a community AMA for Arc House.', req: 'Recording or summary of the event.' },
    { title: 'Referral Alpha', category: 'Strategist', reward: 50, desc: 'Bring 10 active contributors to the Arc Talent platform.', req: 'Referral IDs or addresses.' },
    { title: 'Ecosystem Architect', category: 'Strategist', reward: 300, desc: 'Broker a partnership between Arc and another major L2.', req: 'Official announcement or partnership agreement.' },
    { title: 'Event Planner', category: 'Strategist', reward: 200, desc: 'Organize a physical meetup for Arc contributors in your city.', req: 'Photos and attendee list.' },
    { title: 'Social Architect', category: 'Strategist', reward: 120, desc: 'Grow the Arc Discord community by 500 verified members.', req: 'Discord stats proof.' },
    { title: 'Governance Voter', category: 'Strategist', reward: 20, desc: 'Participate in at least 5 governance votes in the Sanctum.', req: 'On-chain voting history.' }
  ];

  for (const m of missions) {
    sqlite.prepare(`
      INSERT INTO missions (id, title, description, requirements, category, reputation_reward, protocol_id, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      crypto.randomUUID(),
      m.title,
      m.desc,
      m.req,
      m.category,
      m.reward,
      protocolId,
      'PUBLISHED'
    );
  }

  console.log(`✅ Successfully seeded ${missions.length} missions!`);
}

seed().catch(console.error);
