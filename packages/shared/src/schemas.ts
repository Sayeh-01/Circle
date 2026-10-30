import { z } from 'zod';
import { isValidRRule } from './recurrence';
import { isValidTimeZone } from './time';

export const id = z.string().min(1).max(64);
export const isoDate = z.iso.datetime({ offset: true });
export const minor = z.number().int().safe();
export const rrule = z.string().max(200).refine(isValidRRule, 'unsupported recurrence rule');
export const timezone = z.string().refine(isValidTimeZone, 'unknown timezone');
export const lang = z.enum(['en', 'ar']);
export const digits = z.enum(['latn', 'arab']);

export const profileUpdate = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  image: z.string().max(500).nullable().optional(),
  language: lang.optional(),
  digits: digits.optional(),
  timezone: timezone.optional(),
});

export const groupCreate = z.object({
  templateId: z.string().min(1).max(40),
  name: z.string().trim().min(1).max(80),
  emoji: z.string().max(16).optional(),
  color: z.string().max(16).optional(),
  currency: z.string().length(3).optional(),
  timezone: timezone.optional(),
  modules: z.array(z.string().max(40)).max(60).optional(),
  lang: lang.default('en'),
});

export const groupUpdate = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  emoji: z.string().max(16).optional(),
  color: z.string().max(16).optional(),
  photo: z.string().max(500).nullable().optional(),
  membersCanInvite: z.boolean().optional(),
  timezone: timezone.optional(),
});

export const modulesUpdate = z.object({ modules: z.array(z.string().max(40)).max(60) });
export const joinGroup = z.object({ code: z.string().trim().min(4).max(32), displayName: z.string().trim().max(60).optional() });
export const memberUpdate = z.object({
  role: z.enum(['admin', 'manager', 'member', 'child']).optional(),
  customRoleId: z.string().max(40).nullable().optional(),
  displayName: z.string().trim().min(1).max(60).optional(),
  away: z.boolean().optional(),
});
export const transferOwnership = z.object({ userId: id });

export const taskCreate = z.object({
  title: z.string().trim().min(1).max(200),
  notes: z.string().max(4000).optional(),
  assigneeId: id.nullable().optional(),
  rotation: z.array(id).max(50).optional(),
  dueAt: isoDate.nullable().optional(),
  rrule: rrule.nullable().optional(),
  points: z.number().int().min(0).max(1000).optional(),
});
export const taskUpdate = taskCreate.partial();
export const taskComplete = z.object({ photoFileId: id.optional() });
export const commentCreate = z.object({ body: z.string().trim().min(1).max(2000) });

export const eventCreate = z.object({
  title: z.string().trim().min(1).max(200),
  startsAt: isoDate,
  endsAt: isoDate.nullable().optional(),
  rrule: rrule.nullable().optional(),
  location: z.string().max(200).optional(),
  capacity: z.number().int().min(1).max(10000).nullable().optional(),
  waitlist: z.boolean().optional(),
  reminderMin: z.number().int().min(0).max(10080).nullable().optional(),
  notes: z.string().max(4000).optional(),
});
export const eventUpdate = eventCreate.partial();
export const rsvp = z.object({ status: z.enum(['going', 'maybe', 'no']) });
export const splitEvent = z.object({ amount: minor.positive(), title: z.string().max(200).optional(), payerId: id.optional() });

export const listCreate = z.object({ title: z.string().trim().min(1).max(120) });
export const listItemCreate = z.object({
  title: z.string().trim().min(1).max(200),
  qty: z.string().max(20).optional(),
  category: z.string().max(40).optional(),
});
export const listItemUpdate = listItemCreate.partial().extend({ checked: z.boolean().optional() });

export const splitInput = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('equal'), members: z.array(id).min(1) }),
  z.object({ kind: z.literal('exact'), amounts: z.record(z.string(), minor) }),
  z.object({ kind: z.literal('shares'), shares: z.record(z.string(), z.number().nonnegative()) }),
  z.object({ kind: z.literal('percent'), percents: z.record(z.string(), z.number().nonnegative()) }),
]);
export const expenseCreate = z.object({
  title: z.string().trim().min(1).max(200),
  amount: minor.positive(),
  payerId: id,
  split: splitInput,
  eventId: id.optional(),
  spentAt: isoDate.optional(),
  currency: z.string().length(3).optional(),
  rate: z.number().positive().optional(),
  category: z.string().max(40).optional(),
});
export const settlementCreate = z.object({
  toId: id,
  amount: minor.positive(),
  method: z.enum(['cash', 'bank', 'wallet', 'other']),
  note: z.string().max(200).optional(),
});

export const pollCreate = z.object({
  question: z.string().trim().min(1).max(300),
  options: z.array(z.string().trim().min(1).max(120)).min(2).max(20),
  multi: z.boolean().default(false),
  anonymous: z.boolean().default(false),
  closesAt: isoDate.nullable().optional(),
});
export const pollVote = z.object({ optionIds: z.array(id).min(1).max(20) });

export const messageCreate = z.object({
  body: z.string().max(4000).default(''),
  imageFileId: id.optional(),
  audioFileId: id.optional(),
  audioMs: z.number().int().min(0).max(15 * 60_000).optional(),
  replyToId: id.optional(),
  mentions: z.array(id).max(50).optional(),
  pinned: z.boolean().optional(),
});

export const pushTokenRegister = z.object({ token: z.string().min(10).max(300), platform: z.enum(['ios', 'android', 'web']) });

export type GroupCreate = z.infer<typeof groupCreate>;
export type TaskCreate = z.infer<typeof taskCreate>;
export type EventCreate = z.infer<typeof eventCreate>;
export type ExpenseCreate = z.infer<typeof expenseCreate>;
export type PollCreate = z.infer<typeof pollCreate>;

export const rewardCreate = z.object({ title: z.string().trim().min(1).max(120), cost: z.number().int().min(1).max(100000), emoji: z.string().max(16).optional() });
export const pointsAdjust = z.object({ userId: id, delta: z.number().int().min(-100000).max(100000), note: z.string().max(200).optional() });
export const childCreate = z.object({ name: z.string().trim().min(1).max(60), pin: z.string().regex(/^\d{4,6}$/) });
export const childPin = z.object({ pin: z.string().regex(/^\d{4,6}$/) });

export const skillSet = z.object({ skill: z.number().min(0).max(10) });
export const motmVote = z.object({ nomineeId: id });
export const carpoolOffer = z.object({ seats: z.number().int().min(1).max(12), note: z.string().max(200).optional() });
export const countdownCreate = z.object({ title: z.string().trim().min(1).max(120), at: isoDate });
export const deckCreate = z.object({ title: z.string().trim().min(1).max(120) });
export const cardCreate = z.object({ front: z.string().trim().min(1).max(1000), back: z.string().trim().min(1).max(2000) });
export const cardReview = z.object({ grade: z.number().int().min(0).max(5) });
export const pageUpsert = z.object({ title: z.string().trim().min(1).max(200), body: z.string().max(50_000).default('') });
