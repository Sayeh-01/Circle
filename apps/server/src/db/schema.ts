import { sql } from 'drizzle-orm';
import {
  bigint,
  boolean,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

const ts = (name: string) => timestamp(name, { withTimezone: true, mode: 'date' });
const createdAt = () => ts('created_at').notNull().defaultNow();
const money = (name: string) => bigint(name, { mode: 'number' });

// ── Better Auth (usePlural) ───────────────────────────────────────────────────
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  createdAt: createdAt(),
  updatedAt: ts('updated_at').notNull().defaultNow(),
  language: text('language').notNull().default('en'),
  digits: text('digits').notNull().default('latn'),
  timezone: text('timezone').notNull().default('Africa/Cairo'),
  phoneNumber: text('phone_number').unique(),
  phoneNumberVerified: boolean('phone_number_verified'),
  /** v1.2 Child accounts: no email, PIN login on a shared device, managed by a parent. */
  isChild: boolean('is_child').notNull().default(false),
  managedBy: text('managed_by'),
  pinHash: text('pin_hash'),
  pinFailed: integer('pin_failed').notNull().default(0),
  pinLockedUntil: ts('pin_locked_until'),
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  expiresAt: ts('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: createdAt(),
  updatedAt: ts('updated_at').notNull().defaultNow(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
});

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: ts('access_token_expires_at'),
  refreshTokenExpiresAt: ts('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: createdAt(),
  updatedAt: ts('updated_at').notNull().defaultNow(),
});

export const verifications = pgTable('verifications', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: ts('expires_at').notNull(),
  createdAt: createdAt(),
  updatedAt: ts('updated_at').notNull().defaultNow(),
});

// ── Groups ────────────────────────────────────────────────────────────────────
export const groups = pgTable('groups', {
  id: text('id').primaryKey(),
  type: text('type').notNull(),
  name: text('name').notNull(),
  emoji: text('emoji').notNull().default('✨'),
  color: text('color').notNull().default('#8A8F98'),
  photo: text('photo'),
  modules: text('modules').array().notNull().default(sql`'{}'::text[]`),
  currency: text('currency').notNull().default('EGP'),
  timezone: text('timezone').notNull().default('Africa/Cairo'),
  parentId: text('parent_id'),
  settings: jsonb('settings').$type<Record<string, unknown>>().notNull().default({}),
  createdBy: text('created_by').notNull(),
  createdAt: createdAt(),
  lastActivityAt: ts('last_activity_at').notNull().defaultNow(),
});

export const groupMembers = pgTable(
  'group_members',
  {
    groupId: text('group_id')
      .notNull()
      .references(() => groups.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    role: text('role').notNull(),
    customRoleId: text('custom_role_id'),
    displayName: text('display_name').notNull(),
    away: boolean('away').notNull().default(false),
    pinned: boolean('pinned').notNull().default(false),
    lastReadAt: ts('last_read_at').notNull().defaultNow(),
    joinedAt: ts('joined_at').notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.groupId, t.userId] }), index('group_members_user_idx').on(t.userId)],
);

export const invites = pgTable('invites', {
  id: text('id').primaryKey(),
  groupId: text('group_id')
    .notNull()
    .references(() => groups.id, { onDelete: 'cascade' }),
  code: text('code').notNull().unique(),
  createdBy: text('created_by').notNull(),
  createdAt: createdAt(),
  revokedAt: ts('revoked_at'),
  uses: integer('uses').notNull().default(0),
});

export const groupLinks = pgTable('group_links', {
  id: text('id').primaryKey(),
  aGroupId: text('a_group_id')
    .notNull()
    .references(() => groups.id, { onDelete: 'cascade' }),
  bGroupId: text('b_group_id')
    .notNull()
    .references(() => groups.id, { onDelete: 'cascade' }),
  scopes: jsonb('scopes').$type<Record<string, unknown>>().notNull().default({}),
  createdAt: createdAt(),
});

// ── Tasks ─────────────────────────────────────────────────────────────────────
export const tasks = pgTable(
  'tasks',
  {
    id: text('id').primaryKey(),
    groupId: text('group_id')
      .notNull()
      .references(() => groups.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    notes: text('notes'),
    assigneeId: text('assignee_id'),
    rotation: text('rotation').array(),
    dueAt: ts('due_at'),
    rrule: text('rrule'),
    points: integer('points').notNull().default(0),
    status: text('status').notNull().default('open'),
    completedAt: ts('completed_at'),
    completedBy: text('completed_by'),
    createdBy: text('created_by').notNull(),
    createdAt: createdAt(),
  },
  (t) => [index('tasks_group_idx').on(t.groupId), index('tasks_assignee_idx').on(t.assigneeId)],
);

export const taskCompletions = pgTable('task_completions', {
  id: text('id').primaryKey(),
  taskId: text('task_id')
    .notNull()
    .references(() => tasks.id, { onDelete: 'cascade' }),
  groupId: text('group_id').notNull(),
  userId: text('user_id').notNull(),
  photoFileId: text('photo_file_id'),
  points: integer('points').notNull().default(0),
  dueAt: ts('due_at'),
  completedAt: ts('completed_at').notNull().defaultNow(),
  /** v1.2: a Child's chore waits for a parent's approval before points are awarded. approved | pending | rejected */
  status: text('status').notNull().default('approved'),
  reviewedBy: text('reviewed_by'),
});

/** Threads on any item (task comments now; any entity later). */
export const comments = pgTable(
  'comments',
  {
    id: text('id').primaryKey(),
    groupId: text('group_id')
      .notNull()
      .references(() => groups.id, { onDelete: 'cascade' }),
    entity: text('entity').notNull(),
    entityId: text('entity_id').notNull(),
    userId: text('user_id').notNull(),
    body: text('body').notNull(),
    createdAt: createdAt(),
  },
  (t) => [index('comments_entity_idx').on(t.entity, t.entityId)],
);

// ── Events ────────────────────────────────────────────────────────────────────
export const events = pgTable(
  'events',
  {
    id: text('id').primaryKey(),
    groupId: text('group_id')
      .notNull()
      .references(() => groups.id, { onDelete: 'cascade' }),
    /** Recurring events: the master row has rrule and no seriesId; occurrences point at the master. */
    seriesId: text('series_id'),
    title: text('title').notNull(),
    notes: text('notes'),
    startsAt: ts('starts_at').notNull(),
    endsAt: ts('ends_at'),
    rrule: text('rrule'),
    tz: text('tz').notNull(),
    location: text('location'),
    capacity: integer('capacity'),
    waitlist: boolean('waitlist').notNull().default(false),
    reminderMin: integer('reminder_min'),
    materializedUntil: ts('materialized_until'),
    createdBy: text('created_by').notNull(),
    createdAt: createdAt(),
    cancelledAt: ts('cancelled_at'),
  },
  (t) => [index('events_group_idx').on(t.groupId, t.startsAt), uniqueIndex('events_series_start_uq').on(t.seriesId, t.startsAt)],
);

export const eventRsvps = pgTable(
  'event_rsvps',
  {
    eventId: text('event_id')
      .notNull()
      .references(() => events.id, { onDelete: 'cascade' }),
    groupId: text('group_id').notNull(),
    userId: text('user_id').notNull(),
    /** going | maybe | no | waitlist */
    status: text('status').notNull(),
    waitlistPos: integer('waitlist_pos'),
    /** v1.1: RSVPs from guest links (userId = `guest:<id>`) carry the name the guest typed. */
    guestName: text('guest_name'),
    updatedAt: ts('updated_at').notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.eventId, t.userId] })],
);

// ── Lists ─────────────────────────────────────────────────────────────────────
export const lists = pgTable('lists', {
  id: text('id').primaryKey(),
  groupId: text('group_id')
    .notNull()
    .references(() => groups.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  createdBy: text('created_by').notNull(),
  createdAt: createdAt(),
  archivedAt: ts('archived_at'),
});

export const listItems = pgTable(
  'list_items',
  {
    id: text('id').primaryKey(),
    listId: text('list_id')
      .notNull()
      .references(() => lists.id, { onDelete: 'cascade' }),
    groupId: text('group_id').notNull(),
    title: text('title').notNull(),
    qty: text('qty'),
    category: text('category'),
    checked: boolean('checked').notNull().default(false),
    checkedBy: text('checked_by'),
    checkedAt: ts('checked_at'),
    position: integer('position').notNull().default(0),
    createdBy: text('created_by').notNull(),
    createdAt: createdAt(),
  },
  (t) => [index('list_items_list_idx').on(t.listId)],
);

// ── Money ─────────────────────────────────────────────────────────────────────
export const expenses = pgTable(
  'expenses',
  {
    id: text('id').primaryKey(),
    groupId: text('group_id')
      .notNull()
      .references(() => groups.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    /** In the group currency (after the stored rate for foreign expenses). */
    amountMinor: money('amount_minor').notNull(),
    /** Original currency + amount + manual rate (v2.0 multi-currency). */
    currency: text('currency').notNull(),
    originalMinor: money('original_minor').notNull(),
    rate: doublePrecision('rate').notNull().default(1),
    payerId: text('payer_id').notNull(),
    splitKind: text('split_kind').notNull(),
    category: text('category'),
    eventId: text('event_id'),
    taskId: text('task_id'),
    spentAt: ts('spent_at').notNull().defaultNow(),
    createdBy: text('created_by').notNull(),
    createdAt: createdAt(),
    /** Money entries are never edited; a reversal marks them. */
    reversedAt: ts('reversed_at'),
    reversedBy: text('reversed_by'),
  },
  (t) => [index('expenses_group_idx').on(t.groupId)],
);

export const expenseShares = pgTable(
  'expense_shares',
  {
    expenseId: text('expense_id')
      .notNull()
      .references(() => expenses.id, { onDelete: 'cascade' }),
    groupId: text('group_id').notNull(),
    userId: text('user_id').notNull(),
    amountMinor: money('amount_minor').notNull(),
  },
  (t) => [primaryKey({ columns: [t.expenseId, t.userId] })],
);

export const settlements = pgTable(
  'settlements',
  {
    id: text('id').primaryKey(),
    groupId: text('group_id')
      .notNull()
      .references(() => groups.id, { onDelete: 'cascade' }),
    fromId: text('from_id').notNull(),
    toId: text('to_id').notNull(),
    amountMinor: money('amount_minor').notNull(),
    method: text('method').notNull(),
    note: text('note'),
    createdAt: createdAt(),
    confirmedAt: ts('confirmed_at'),
    rejectedAt: ts('rejected_at'),
  },
  (t) => [index('settlements_group_idx').on(t.groupId)],
);

// ── Polls ─────────────────────────────────────────────────────────────────────
export const polls = pgTable('polls', {
  id: text('id').primaryKey(),
  groupId: text('group_id')
    .notNull()
    .references(() => groups.id, { onDelete: 'cascade' }),
  question: text('question').notNull(),
  multi: boolean('multi').notNull().default(false),
  anonymous: boolean('anonymous').notNull().default(false),
  closesAt: ts('closes_at'),
  createdBy: text('created_by').notNull(),
  createdAt: createdAt(),
});

export const pollOptions = pgTable('poll_options', {
  id: text('id').primaryKey(),
  pollId: text('poll_id')
    .notNull()
    .references(() => polls.id, { onDelete: 'cascade' }),
  groupId: text('group_id').notNull(),
  label: text('label').notNull(),
  position: integer('position').notNull(),
});

export const pollVotes = pgTable(
  'poll_votes',
  {
    pollId: text('poll_id')
      .notNull()
      .references(() => polls.id, { onDelete: 'cascade' }),
    optionId: text('option_id')
      .notNull()
      .references(() => pollOptions.id, { onDelete: 'cascade' }),
    groupId: text('group_id').notNull(),
    userId: text('user_id').notNull(),
    createdAt: createdAt(),
  },
  (t) => [primaryKey({ columns: [t.pollId, t.optionId, t.userId] })],
);

// ── Chat ──────────────────────────────────────────────────────────────────────
export const messages = pgTable(
  'messages',
  {
    id: text('id').primaryKey(),
    groupId: text('group_id')
      .notNull()
      .references(() => groups.id, { onDelete: 'cascade' }),
    userId: text('user_id').notNull(),
    body: text('body').notNull().default(''),
    imageFileId: text('image_file_id'),
    /** v1.2 voice notes */
    audioFileId: text('audio_file_id'),
    audioMs: integer('audio_ms'),
    replyToId: text('reply_to_id'),
    mentions: text('mentions').array(),
    pinned: boolean('pinned').notNull().default(false),
    pinnedAt: ts('pinned_at'),
    pinnedBy: text('pinned_by'),
    createdAt: createdAt(),
    deletedAt: ts('deleted_at'),
  },
  (t) => [index('messages_group_idx').on(t.groupId, t.createdAt)],
);

export const announcementReads = pgTable(
  'announcement_reads',
  {
    messageId: text('message_id')
      .notNull()
      .references(() => messages.id, { onDelete: 'cascade' }),
    groupId: text('group_id').notNull(),
    userId: text('user_id').notNull(),
    readAt: ts('read_at').notNull().defaultNow(),
    acknowledgedAt: ts('acknowledged_at'),
  },
  (t) => [primaryKey({ columns: [t.messageId, t.userId] })],
);

// ── Activity, notifications, files, jobs ──────────────────────────────────────
export const activity = pgTable(
  'activity',
  {
    id: text('id').primaryKey(),
    groupId: text('group_id')
      .notNull()
      .references(() => groups.id, { onDelete: 'cascade' }),
    actorId: text('actor_id'),
    verb: text('verb').notNull(),
    entity: text('entity').notNull(),
    entityId: text('entity_id'),
    summary: text('summary').notNull().default(''),
    createdAt: createdAt(),
  },
  (t) => [index('activity_group_idx').on(t.groupId, t.createdAt)],
);

export const pushTokens = pgTable('push_tokens', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  platform: text('platform').notNull(),
  createdAt: createdAt(),
});

export const notifications = pgTable(
  'notifications',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    groupId: text('group_id'),
    kind: text('kind').notNull(),
    title: text('title').notNull(),
    body: text('body').notNull().default(''),
    data: jsonb('data').$type<Record<string, unknown>>().notNull().default({}),
    readAt: ts('read_at'),
    createdAt: createdAt(),
  },
  (t) => [index('notifications_user_idx').on(t.userId, t.createdAt)],
);

export const files = pgTable('files', {
  id: text('id').primaryKey(),
  groupId: text('group_id'),
  ownerId: text('owner_id').notNull(),
  key: text('key').notNull(),
  mime: text('mime').notNull(),
  size: integer('size').notNull().default(0),
  uploadedAt: ts('uploaded_at'),
  createdAt: createdAt(),
});

export const jobs = pgTable(
  'jobs',
  {
    id: text('id').primaryKey(),
    kind: text('kind').notNull(),
    payload: jsonb('payload').$type<Record<string, unknown>>().notNull().default({}),
    runAt: ts('run_at').notNull(),
    /** pending | done | failed | dead */
    status: text('status').notNull().default('pending'),
    attempts: integer('attempts').notNull().default(0),
    lastError: text('last_error'),
    dedupeKey: text('dedupe_key').unique(),
    createdAt: createdAt(),
    doneAt: ts('done_at'),
  },
  (t) => [index('jobs_due_idx').on(t.status, t.runAt)],
);

// ── v1.1 Reach ────────────────────────────────────────────────────────────────
/** A web link that lets someone without the app act on exactly one item (B6: guests pass the same guard, narrower scope). */
export const guestLinks = pgTable('guest_links', {
  id: text('id').primaryKey(),
  groupId: text('group_id')
    .notNull()
    .references(() => groups.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  entity: text('entity').notNull(),
  entityId: text('entity_id').notNull(),
  createdBy: text('created_by').notNull(),
  createdAt: createdAt(),
  revokedAt: ts('revoked_at'),
});

/** Secret per-user URL for the read-only ICS calendar feed. */
export const calendarTokens = pgTable('calendar_tokens', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  createdAt: createdAt(),
  revokedAt: ts('revoked_at'),
});

// ── v1.2 Motivation ───────────────────────────────────────────────────────────
/** Points are a ledger: balance = sum(delta). Never a stored running total. */
export const pointsLedger = pgTable(
  'points_ledger',
  {
    id: text('id').primaryKey(),
    groupId: text('group_id')
      .notNull()
      .references(() => groups.id, { onDelete: 'cascade' }),
    userId: text('user_id').notNull(),
    delta: integer('delta').notNull(),
    /** task | redeem | refund | adjust */
    reason: text('reason').notNull(),
    refId: text('ref_id'),
    createdAt: createdAt(),
  },
  (t) => [index('points_ledger_member_idx').on(t.groupId, t.userId)],
);

export const rewards = pgTable('rewards', {
  id: text('id').primaryKey(),
  groupId: text('group_id')
    .notNull()
    .references(() => groups.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  emoji: text('emoji').notNull().default('🎁'),
  cost: integer('cost').notNull(),
  active: boolean('active').notNull().default(true),
  createdBy: text('created_by').notNull(),
  createdAt: createdAt(),
});

export const redemptions = pgTable('redemptions', {
  id: text('id').primaryKey(),
  groupId: text('group_id')
    .notNull()
    .references(() => groups.id, { onDelete: 'cascade' }),
  rewardId: text('reward_id')
    .notNull()
    .references(() => rewards.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull(),
  cost: integer('cost').notNull(),
  /** pending | fulfilled | cancelled */
  status: text('status').notNull().default('pending'),
  createdAt: createdAt(),
  resolvedAt: ts('resolved_at'),
  resolvedBy: text('resolved_by'),
});

// ── v1.3 Sport & Study ────────────────────────────────────────────────────────
export const memberSkills = pgTable(
  'member_skills',
  {
    groupId: text('group_id')
      .notNull()
      .references(() => groups.id, { onDelete: 'cascade' }),
    userId: text('user_id').notNull(),
    skill: doublePrecision('skill').notNull(),
    updatedBy: text('updated_by').notNull(),
    updatedAt: ts('updated_at').notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.groupId, t.userId] })],
);

/** One vote per player per match: the primary key is (event, voter). */
export const matchVotes = pgTable(
  'match_votes',
  {
    eventId: text('event_id')
      .notNull()
      .references(() => events.id, { onDelete: 'cascade' }),
    groupId: text('group_id').notNull(),
    voterId: text('voter_id').notNull(),
    nomineeId: text('nominee_id').notNull(),
    createdAt: createdAt(),
  },
  (t) => [primaryKey({ columns: [t.eventId, t.voterId] })],
);

export const carpoolOffers = pgTable('carpool_offers', {
  id: text('id').primaryKey(),
  groupId: text('group_id')
    .notNull()
    .references(() => groups.id, { onDelete: 'cascade' }),
  eventId: text('event_id')
    .notNull()
    .references(() => events.id, { onDelete: 'cascade' }),
  driverId: text('driver_id').notNull(),
  seats: integer('seats').notNull(),
  note: text('note'),
  createdAt: createdAt(),
});

export const carpoolRiders = pgTable(
  'carpool_riders',
  {
    offerId: text('offer_id')
      .notNull()
      .references(() => carpoolOffers.id, { onDelete: 'cascade' }),
    groupId: text('group_id').notNull(),
    eventId: text('event_id').notNull(),
    userId: text('user_id').notNull(),
  },
  (t) => [primaryKey({ columns: [t.offerId, t.userId] }), uniqueIndex('carpool_rider_event_uq').on(t.eventId, t.userId)],
);

export const focusSessions = pgTable(
  'focus_sessions',
  {
    id: text('id').primaryKey(),
    groupId: text('group_id')
      .notNull()
      .references(() => groups.id, { onDelete: 'cascade' }),
    userId: text('user_id').notNull(),
    startedAt: ts('started_at').notNull(),
    endedAt: ts('ended_at'),
  },
  (t) => [index('focus_group_idx').on(t.groupId, t.startedAt)],
);

export const countdowns = pgTable('countdowns', {
  id: text('id').primaryKey(),
  groupId: text('group_id')
    .notNull()
    .references(() => groups.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  at: ts('at').notNull(),
  createdBy: text('created_by').notNull(),
  createdAt: createdAt(),
});

export const decks = pgTable('decks', {
  id: text('id').primaryKey(),
  groupId: text('group_id')
    .notNull()
    .references(() => groups.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  createdBy: text('created_by').notNull(),
  createdAt: createdAt(),
});

export const cards = pgTable('cards', {
  id: text('id').primaryKey(),
  deckId: text('deck_id')
    .notNull()
    .references(() => decks.id, { onDelete: 'cascade' }),
  groupId: text('group_id').notNull(),
  front: text('front').notNull(),
  back: text('back').notNull(),
  createdBy: text('created_by').notNull(),
  createdAt: createdAt(),
});

/** Each member has their own SM-2 schedule per card. */
export const cardReviews = pgTable(
  'card_reviews',
  {
    cardId: text('card_id')
      .notNull()
      .references(() => cards.id, { onDelete: 'cascade' }),
    userId: text('user_id').notNull(),
    groupId: text('group_id').notNull(),
    ease: doublePrecision('ease').notNull(),
    interval: integer('interval').notNull(),
    reps: integer('reps').notNull(),
    dueAt: ts('due_at').notNull(),
    reviewedAt: ts('reviewed_at').notNull(),
  },
  (t) => [primaryKey({ columns: [t.cardId, t.userId] })],
);

export const pages = pgTable('pages', {
  id: text('id').primaryKey(),
  groupId: text('group_id')
    .notNull()
    .references(() => groups.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  body: text('body').notNull().default(''),
  createdBy: text('created_by').notNull(),
  updatedBy: text('updated_by').notNull(),
  createdAt: createdAt(),
  updatedAt: ts('updated_at').notNull().defaultNow(),
});
