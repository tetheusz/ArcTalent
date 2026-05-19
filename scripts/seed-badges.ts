import { db } from '../src/db';
import { badgeDefinitions } from '../src/db/schema';

async function seedBadges() {
  console.log('Seeding Badge Definitions...');

  const badges = [
    {
      name: 'Genesis Contributor',
      description: 'Awarded for your first approved contribution to the Arc Network.',
      icon: 'Award'
    },
    {
      name: 'Reputation Pioneer',
      description: 'Awarded for reaching 100 REP points.',
      icon: 'Zap'
    },
    {
      name: 'Protocol Ally',
      description: 'Awarded for having contributions approved by 3 different protocols.',
      icon: 'Users'
    }
  ];

  for (const badge of badges) {
    try {
      await db.insert(badgeDefinitions).values(badge).onConflictDoNothing();
      console.log(`Badge "${badge.name}" seeded.`);
    } catch (e) {
      console.error(`Error seeding ${badge.name}:`, e);
    }
  }

  console.log('Done!');
}

seedBadges();
