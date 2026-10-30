import type { Role } from './permissions';

// Templates are data (B6). Code reads group.modules, vocabulary and role names; it never branches on a template id.

export type Lang = 'en' | 'ar';
export type L10n = { en: string; ar: string };

export const MODULES = {
  tasks: { emoji: '✅', name: { en: 'Tasks', ar: 'المهام' }, phase: '1.0' },
  events: { emoji: '📅', name: { en: 'Calendar', ar: 'التقويم' }, phase: '1.0' },
  lists: { emoji: '📝', name: { en: 'Lists', ar: 'القوائم' }, phase: '1.0' },
  expenses: { emoji: '💸', name: { en: 'Expenses', ar: 'المصاريف' }, phase: '1.0' },
  polls: { emoji: '📊', name: { en: 'Polls', ar: 'التصويتات' }, phase: '1.0' },
  chat: { emoji: '💬', name: { en: 'Chat', ar: 'الدردشة' }, phase: '1.0' },
} as const satisfies Record<string, { emoji: string; name: L10n; phase: string }>;

export type ModuleId = keyof typeof MODULES;
export const MODULE_IDS = Object.keys(MODULES) as ModuleId[];

/** Words a template can rename. Each has singular and plural. */
export type VocabKey = 'task' | 'tasks' | 'event' | 'events' | 'list' | 'lists' | 'expense' | 'expenses' | 'poll' | 'polls';

export interface StarterEvent {
  title: L10n;
  rrule?: string;
  /** local wall-clock time HH:MM in the group timezone */
  time: string;
  /** days from today for the first occurrence when there's no rrule */
  inDays?: number;
  durationMin?: number;
}
export interface StarterTask {
  title: L10n;
  rrule?: string;
  rotation?: boolean;
  points?: number;
}

export interface Template {
  id: string;
  emoji: string;
  color: string;
  phase: string;
  name: L10n;
  tagline: L10n;
  modules: ModuleId[];
  roles: Partial<Record<Role, L10n>>;
  vocab: Partial<Record<VocabKey, L10n>>;
  defaults: { eventCapacity?: number; waitlist?: boolean; currency?: string };
  starters: { lists?: { title: L10n; items?: L10n[] }[]; events?: StarterEvent[]; tasks?: StarterTask[] };
}

const BASE_ROLES: Record<'owner' | 'admin' | 'manager' | 'member' | 'child' | 'guest' | 'vendor', L10n> = {
  owner: { en: 'Owner', ar: 'المالك' },
  admin: { en: 'Admin', ar: 'مشرف' },
  manager: { en: 'Manager', ar: 'مدير' },
  member: { en: 'Member', ar: 'عضو' },
  child: { en: 'Child', ar: 'طفل' },
  guest: { en: 'Guest', ar: 'ضيف' },
  vendor: { en: 'Vendor', ar: 'مورّد' },
};

const BASE_VOCAB: Record<VocabKey, L10n> = {
  task: { en: 'Task', ar: 'مهمة' },
  tasks: { en: 'Tasks', ar: 'المهام' },
  event: { en: 'Event', ar: 'موعد' },
  events: { en: 'Calendar', ar: 'التقويم' },
  list: { en: 'List', ar: 'قائمة' },
  lists: { en: 'Lists', ar: 'القوائم' },
  expense: { en: 'Expense', ar: 'مصروف' },
  expenses: { en: 'Expenses', ar: 'المصاريف' },
  poll: { en: 'Poll', ar: 'تصويت' },
  polls: { en: 'Polls', ar: 'التصويتات' },
};

export const TEMPLATES: Template[] = [
  {
    id: 'family',
    emoji: '🏠',
    color: '#E8875B',
    phase: '1',
    name: { en: 'Home & Family', ar: 'البيت والعائلة' },
    tagline: { en: 'Organize daily life', ar: 'نظّموا حياتكم اليومية' },
    modules: ['events', 'tasks', 'lists', 'chat', 'expenses', 'polls'],
    roles: { owner: { en: 'Parent', ar: 'وليّ الأمر' }, admin: { en: 'Parent', ar: 'وليّ الأمر' }, child: { en: 'Child', ar: 'طفل' } },
    vocab: { task: { en: 'Chore', ar: 'مهمة منزلية' }, tasks: { en: 'Chores', ar: 'المهام المنزلية' } },
    defaults: {},
    starters: {
      lists: [{ title: { en: 'Groceries', ar: 'البقالة' }, items: [{ en: 'Bread', ar: 'عيش' }, { en: 'Milk', ar: 'لبن' }] }],
      tasks: [{ title: { en: 'Take out the trash', ar: 'رمي القمامة' }, rrule: 'FREQ=DAILY', rotation: true, points: 1 }],
      events: [{ title: { en: 'Friday family lunch', ar: 'غداء الجمعة العائلي' }, rrule: 'FREQ=WEEKLY;BYDAY=FR', time: '14:00' }],
    },
  },
  {
    id: 'roommates',
    emoji: '🛋️',
    color: '#6C8EEF',
    phase: '1',
    name: { en: 'Friends & Roommates', ar: 'أصدقاء وزملاء سكن' },
    tagline: { en: 'Plan outings, split costs, share chores', ar: 'خطّطوا للخروجات وقسّموا المصاريف والمهام' },
    modules: ['expenses', 'tasks', 'lists', 'events', 'chat', 'polls'],
    roles: { owner: { en: 'Organizer', ar: 'المنظّم' }, admin: { en: 'Organizer', ar: 'المنظّم' }, member: { en: 'Friend', ar: 'صديق' } },
    vocab: { task: { en: 'Chore', ar: 'مهمة منزلية' }, tasks: { en: 'Chores', ar: 'المهام المنزلية' } },
    defaults: {},
    starters: {
      lists: [{ title: { en: 'Shared shopping', ar: 'مشتريات مشتركة' }, items: [{ en: 'Dish soap', ar: 'صابون أطباق' }] }],
      tasks: [{ title: { en: 'Clean the kitchen', ar: 'تنظيف المطبخ' }, rrule: 'FREQ=WEEKLY;BYDAY=SA', rotation: true, points: 2 }],
    },
  },
  {
    id: 'study',
    emoji: '📚',
    color: '#4BA3A0',
    phase: '1',
    name: { en: 'Study Group', ar: 'مجموعة مذاكرة' },
    tagline: { en: 'Study together, stay accountable', ar: 'ذاكروا سوا والتزموا' },
    modules: ['events', 'tasks', 'chat', 'polls', 'lists'],
    roles: { owner: { en: 'Lead', ar: 'القائد' }, admin: { en: 'Lead', ar: 'القائد' } },
    vocab: {
      task: { en: 'Assignment', ar: 'تكليف' },
      tasks: { en: 'Assignments', ar: 'التكليفات' },
      event: { en: 'Session', ar: 'جلسة' },
      events: { en: 'Sessions', ar: 'الجلسات' },
    },
    defaults: {},
    starters: {
      lists: [{ title: { en: 'Resources', ar: 'المصادر' } }],
      events: [{ title: { en: 'Study session', ar: 'جلسة مذاكرة' }, rrule: 'FREQ=WEEKLY;BYDAY=SU', time: '21:00' }],
    },
  },
  {
    id: 'sport',
    emoji: '⚽',
    color: '#3FA34D',
    phase: '1',
    name: { en: 'Sport Team', ar: 'فريق رياضي' },
    tagline: { en: 'Fill matches, collect fees, track attendance', ar: 'كمّلوا الماتشات واجمعوا الاشتراكات' },
    modules: ['events', 'expenses', 'chat', 'polls', 'lists', 'tasks'],
    roles: {
      owner: { en: 'Captain', ar: 'الكابتن' },
      admin: { en: 'Coach', ar: 'المدرّب' },
      member: { en: 'Player', ar: 'لاعب' },
    },
    vocab: {
      event: { en: 'Match', ar: 'ماتش' },
      events: { en: 'Matches', ar: 'الماتشات' },
      task: { en: 'Duty', ar: 'مهمة' },
      tasks: { en: 'Duties', ar: 'المهام' },
    },
    defaults: { eventCapacity: 12, waitlist: true },
    starters: {
      lists: [{ title: { en: 'Equipment', ar: 'المعدّات' }, items: [{ en: 'Ball', ar: 'كورة' }, { en: 'Bibs', ar: 'فانلات' }] }],
      events: [{ title: { en: 'Weekly match', ar: 'ماتش الأسبوع' }, rrule: 'FREQ=WEEKLY;BYDAY=TH', time: '21:00', durationMin: 90 }],
    },
  },
  {
    id: 'work',
    emoji: '💼',
    color: '#7A6FD0',
    phase: '1',
    name: { en: 'Work Team', ar: 'فريق عمل' },
    tagline: { en: 'Coordinate tasks and meetings', ar: 'نسّقوا المهام والاجتماعات' },
    modules: ['tasks', 'events', 'chat', 'polls'],
    roles: { owner: { en: 'Lead', ar: 'القائد' }, admin: { en: 'Lead', ar: 'القائد' } },
    vocab: { event: { en: 'Meeting', ar: 'اجتماع' }, events: { en: 'Meetings', ar: 'الاجتماعات' } },
    defaults: {},
    starters: {
      events: [{ title: { en: 'Weekly sync', ar: 'اجتماع أسبوعي' }, rrule: 'FREQ=WEEKLY;BYDAY=MO', time: '10:00', durationMin: 30 }],
      tasks: [{ title: { en: 'Share this week’s priorities', ar: 'شارك أولويات الأسبوع' } }],
    },
  },
  {
    id: 'custom',
    emoji: '✨',
    color: '#8A8F98',
    phase: '1',
    name: { en: 'Custom', ar: 'مخصّص' },
    tagline: { en: 'Pick your own modules', ar: 'اختر الأدوات اللي تناسبك' },
    modules: [],
    roles: {},
    vocab: {},
    defaults: {},
    starters: {},
  },
];

export function getTemplate(id: string): Template {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[TEMPLATES.length - 1];
}

export function roleName(templateId: string, role: Role, lang: Lang): string {
  const t = getTemplate(templateId);
  return (t.roles[role] ?? BASE_ROLES[role])[lang];
}

export function vocab(templateId: string, key: VocabKey, lang: Lang): string {
  const t = getTemplate(templateId);
  return (t.vocab[key] ?? BASE_VOCAB[key])[lang];
}

export function moduleName(templateId: string, moduleId: string, lang: Lang): string {
  const plural = (moduleId as VocabKey) in BASE_VOCAB ? (moduleId as VocabKey) : null;
  if (plural) return vocab(templateId, plural, lang);
  const m = (MODULES as Record<string, { name: L10n }>)[moduleId];
  return m ? m.name[lang] : moduleId;
}
