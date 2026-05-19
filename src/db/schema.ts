import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import { sql, relations } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  address: text('address').notNull().unique(),
  name: text('name'),
  bio: text('bio'),
  role: text('role').notNull().default('CONTRIBUTOR'),
  reputation: integer('reputation').notNull().default(0),
  avatarUrl: text('avatar_url'),
  chosenArchetype: text('chosen_archetype'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const contributorProfiles = sqliteTable('contributor_profiles', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().unique().references(() => users.id),
  skills: text('skills'),
  region: text('region'),
  links: text('links'),
  trustLevel: integer('trust_level').notNull().default(1),
});

export const specializations = sqliteTable('specializations', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull().unique(),
});

export const profilesToSpecializations = sqliteTable('profiles_to_specializations', {
  profileId: text('profile_id').notNull().references(() => contributorProfiles.id),
  specializationId: text('specialization_id').notNull().references(() => specializations.id),
}, (t) => ({
  pk: primaryKey({ columns: [t.profileId, t.specializationId] }),
}));

export const protocols = sqliteTable('protocols', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  logoUrl: text('logo_url'),
  website: text('website'),
  twitter: text('twitter'),
  isVerified: integer('is_verified', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const protocolApplications = sqliteTable('protocol_applications', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  description: text('description').notNull(),
  website: text('website').notNull(),
  twitter: text('twitter'),
  status: text('status').notNull().default('PENDING'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const protocolAdmins = sqliteTable('protocol_admins', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().unique().references(() => users.id),
  protocolId: text('protocol_id').notNull().references(() => protocols.id),
});

export const campaigns = sqliteTable('campaigns', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  description: text('description').notNull(),
  protocolId: text('protocol_id').notNull().references(() => protocols.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const missions = sqliteTable('missions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  description: text('description').notNull(),
  requirements: text('requirements').notNull(),
  category: text('category').notNull(),
  difficulty: text('difficulty').notNull().default('BEGINNER'),
  reputationReward: integer('reputation_reward').notNull(),
  deadline: integer('deadline', { mode: 'timestamp' }),
  isFaucetEnabled: integer('is_faucet_enabled', { mode: 'boolean' }).notNull().default(false),
  status: text('status').notNull().default('DRAFT'),
  protocolId: text('protocol_id').notNull().references(() => protocols.id),
  campaignId: text('campaign_id').references(() => campaigns.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const submissions = sqliteTable('submissions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  missionId: text('mission_id').notNull().references(() => missions.id),
  userId: text('user_id').notNull().references(() => users.id),
  title: text('title'), // New: Title of the contribution
  links: text('links'), // New: JSON string of links
  evidence: text('evidence').notNull(),
  status: text('status').notNull().default('PENDING'),
  rewardGranted: integer('reward_granted'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const reviews = sqliteTable('reviews', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  submissionId: text('submission_id').notNull().unique().references(() => submissions.id),
  reviewerId: text('reviewer_id').notNull().references(() => users.id),
  feedback: text('feedback'),
  qualityScore: integer('quality_score').notNull().default(0),
  impactScore: integer('impact_score').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const badgeDefinitions = sqliteTable('badge_definitions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull().unique(),
  description: text('description').notNull(),
  icon: text('icon'),
  contractAddress: text('contract_address'), // Address of the SBT contract
  tokenId: integer('token_id'), // Static token ID if shared contract
});

export const onChainProofs = sqliteTable('on_chain_proofs', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  entityType: text('entity_type').notNull(), // 'SUBMISSION' or 'BADGE'
  entityId: text('entity_id').notNull(),
  proofType: text('proof_type').notNull(), // 'ATTESTATION' or 'SBT'
  transactionHash: text('transaction_hash').notNull(),
  attestationId: text('attestation_id'), // specific to EAS or similar
  chainId: integer('chain_id').notNull().default(5042002),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const userBadges = sqliteTable('user_badges', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id),
  badgeId: text('badge_id').notNull().references(() => badgeDefinitions.id),
  awardedAt: integer('awarded_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const faucetRequests = sqliteTable('faucet_requests', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id),
  missionId: text('mission_id').notNull().references(() => missions.id),
  status: text('status').notNull().default('PENDING'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const auditLogs = sqliteTable('audit_logs', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  action: text('action').notNull(),
  entity: text('entity').notNull(),
  entityId: text('entity_id').notNull(),
  userId: text('user_id').notNull(),
  timestamp: integer('timestamp', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const reputationEvents = sqliteTable('reputation_events', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id),
  amount: integer('amount').notNull(),
  category: text('category'),
  description: text('description').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  contributorProfile: one(contributorProfiles),
  submissions: many(submissions),
  badges: many(userBadges),
  onChainProofs: many(onChainProofs),
}));

export const contributorProfilesRelations = relations(contributorProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [contributorProfiles.userId],
    references: [users.id],
  }),
  specializations: many(profilesToSpecializations),
}));

export const profilesToSpecializationsRelations = relations(profilesToSpecializations, ({ one }) => ({
  profile: one(contributorProfiles, {
    fields: [profilesToSpecializations.profileId],
    references: [contributorProfiles.id],
  }),
  specialization: one(specializations, {
    fields: [profilesToSpecializations.specializationId],
    references: [specializations.id],
  }),
}));

export const missionsRelations = relations(missions, ({ one, many }) => ({
  protocol: one(protocols, {
    fields: [missions.protocolId],
    references: [protocols.id],
  }),
  submissions: many(submissions),
}));

export const protocolsRelations = relations(protocols, ({ many }) => ({
  missions: many(missions),
}));

export const protocolAdminsRelations = relations(protocolAdmins, ({ one }) => ({
  user: one(users, {
    fields: [protocolAdmins.userId],
    references: [users.id],
  }),
  protocol: one(protocols, {
    fields: [protocolAdmins.protocolId],
    references: [protocols.id],
  }),
}));

export const submissionsRelations = relations(submissions, ({ one, many }) => ({
  mission: one(missions, {
    fields: [submissions.missionId],
    references: [missions.id],
  }),
  user: one(users, {
    fields: [submissions.userId],
    references: [users.id],
  }),
  proofs: many(onChainProofs),
  reviews: many(reviews),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  submission: one(submissions, {
    fields: [reviews.submissionId],
    references: [submissions.id],
  }),
  reviewer: one(users, {
    fields: [reviews.reviewerId],
    references: [users.id],
  }),
}));

export const userBadgesRelations = relations(userBadges, ({ one, many }) => ({
  user: one(users, {
    fields: [userBadges.userId],
    references: [users.id],
  }),
  badge: one(badgeDefinitions, {
    fields: [userBadges.badgeId],
    references: [badgeDefinitions.id],
  }),
  proofs: many(onChainProofs),
}));

export const onChainProofsRelations = relations(onChainProofs, ({ one }) => ({
  submission: one(submissions, {
    fields: [onChainProofs.entityId],
    references: [submissions.id],
  }),
  userBadge: one(userBadges, {
    fields: [onChainProofs.entityId],
    references: [userBadges.id],
  }),
  user: one(users, {
    fields: [onChainProofs.entityId],
    references: [users.address],
  }),
}));
