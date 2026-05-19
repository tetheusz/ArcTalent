const { drizzle } = require('drizzle-orm/better-sqlite3');
const Database = require('better-sqlite3');
const crypto = require('crypto');

const sqlite = new Database('dev.db');
const db = drizzle(sqlite);

async function seedBadges() {
  console.log('🌱 Updating Badge Definitions...');

  const badges = [
    // GENERAL
    { name: 'Genesis Contributor', desc: 'Completed your first mission in the Arc Network.' },
    { name: 'Reputation Pioneer', desc: 'Reached 100 Total Reputation XP.' },
    { name: 'Arc Elite', desc: 'Reached 500 Total Reputation XP.' },

    // DEVELOPER (Technical)
    { name: 'Junior Developer', desc: 'Completed 1 Technical mission.' },
    { name: 'Senior Architect', desc: 'Completed 5 Technical missions.' },
    { name: 'Protocol Master', desc: 'Completed 10 Technical missions.' },

    // SENTINEL (QA/Feedback)
    { name: 'Bug Hunter', desc: 'Found and reported your first bug.' },
    { name: 'Sentinel Scout', desc: 'Completed 5 QA or Feedback missions.' },
    { name: 'Sanctum Guardian', desc: 'Completed 10 QA or Feedback missions.' },

    // CREATOR (Content)
    { name: 'Content Creator', desc: 'Published your first community content.' },
    { name: 'Influencer Path', desc: 'Completed 5 Content Creation missions.' },
    { name: 'Media Mogul', desc: 'Completed 10 Content Creation missions.' },

    // SCHOLAR (Research)
    { name: 'Active Researcher', desc: 'Completed 1 Research mission.' },
    { name: 'Ecosystem Sage', desc: 'Completed 5 Research or Documentation missions.' },

    // PROTOCOL (New)
    { name: 'DApp Architect', desc: 'Successfully submitted a protocol application to the Sanctum.' },
    { name: 'Protocol Founder', desc: 'Had your protocol application approved and verified on-chain.' }
  ];

  // First, clear Strategist badges if they exist to avoid confusion
  sqlite.prepare(`DELETE FROM badge_definitions WHERE name IN ('Community Catalyst', 'Guild Leader')`).run();

  for (const b of badges) {
    sqlite.prepare(`
      INSERT OR REPLACE INTO badge_definitions (id, name, description)
      VALUES (?, ?, ?)
    `).run(
      crypto.randomUUID(),
      b.name,
      b.desc
    );
  }

  console.log(`✅ Successfully updated badges! Added Protocol badges.`);
}

seedBadges().catch(console.error);
