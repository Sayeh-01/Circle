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
  points: { emoji: '⭐', name: { en: 'Points & Rewards', ar: 'النقاط والمكافآت' }, phase: '1.2' },
  teams: { emoji: '🏆', name: { en: 'Team tools', ar: 'أدوات الفريق' }, phase: '1.3' },
  focus: { emoji: '⏱️', name: { en: 'Focus', ar: 'التركيز' }, phase: '1.3' },
  flashcards: { emoji: '🃏', name: { en: 'Flashcards', ar: 'بطاقات المراجعة' }, phase: '1.3' },
  notes: { emoji: '📒', name: { en: 'Notes & Wiki', ar: 'الملاحظات' }, phase: '1.3' },
  meals: { emoji: '🍲', name: { en: 'Meal planner', ar: 'خطة الوجبات' }, phase: '1.4' },
  memories: { emoji: '📸', name: { en: 'Memories', ar: 'الذكريات' }, phase: '1.4' },
  vault: { emoji: '🗄️', name: { en: 'Vault', ar: 'الخزنة' }, phase: '1.5' },
  meds: { emoji: '💊', name: { en: 'Meds', ar: 'الأدوية' }, phase: '1.5' },
  safety: { emoji: '🛟', name: { en: 'Safety', ar: 'الأمان' }, phase: '1.5' },
  dues: { emoji: '🧾', name: { en: 'Dues & Fees', ar: 'الاشتراكات' }, phase: '2.0' },
  budgets: { emoji: '🎯', name: { en: 'Budgets', ar: 'الميزانيات' }, phase: '2.0' },
  contacts: { emoji: '📇', name: { en: 'Contacts', ar: 'جهات الاتصال' }, phase: '2.0' },
  guests: { emoji: '💌', name: { en: 'Guest list', ar: 'قائمة الضيوف' }, phase: '2.0' },
  gameya: { emoji: '💰', name: { en: 'Gam’eya', ar: 'الجمعية' }, phase: '2.2' },
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
    modules: ['events', 'tasks', 'lists', 'chat', 'expenses', 'polls', 'points', 'meals', 'memories', 'safety'],
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
    modules: ['expenses', 'tasks', 'lists', 'events', 'chat', 'polls', 'notes'],
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
    modules: ['events', 'tasks', 'chat', 'polls', 'lists', 'focus', 'flashcards', 'notes'],
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
    modules: ['events', 'expenses', 'chat', 'polls', 'lists', 'tasks', 'teams'],
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
    modules: ['tasks', 'events', 'chat', 'polls', 'notes'],
    roles: { owner: { en: 'Lead', ar: 'القائد' }, admin: { en: 'Lead', ar: 'القائد' } },
    vocab: { event: { en: 'Meeting', ar: 'اجتماع' }, events: { en: 'Meetings', ar: 'الاجتماعات' } },
    defaults: {},
    starters: {
      events: [{ title: { en: 'Weekly sync', ar: 'اجتماع أسبوعي' }, rrule: 'FREQ=WEEKLY;BYDAY=MO', time: '10:00', durationMin: 30 }],
      tasks: [{ title: { en: 'Share this week’s priorities', ar: 'شارك أولويات الأسبوع' } }],
    },
  },
  {
    id: 'care',
    emoji: '❤️',
    color: '#C9566B',
    phase: '1.5',
    name: { en: 'Care Circle', ar: 'دائرة رعاية' },
    tagline: { en: 'Share care duties, meds and appointments', ar: 'تقاسموا مهام الرعاية والأدوية والمواعيد' },
    modules: ['events', 'tasks', 'meds', 'vault', 'expenses', 'chat', 'safety'],
    roles: { owner: { en: 'Coordinator', ar: 'المنسّق' }, admin: { en: 'Coordinator', ar: 'المنسّق' }, member: { en: 'Carer', ar: 'مقدّم رعاية' } },
    vocab: {
      event: { en: 'Appointment', ar: 'موعد' },
      events: { en: 'Appointments', ar: 'المواعيد' },
      task: { en: 'Care duty', ar: 'مهمة رعاية' },
      tasks: { en: 'Care duties', ar: 'مهام الرعاية' },
    },
    defaults: {},
    starters: {
      tasks: [{ title: { en: 'Drive to the doctor', ar: 'التوصيل للدكتور' }, rrule: 'FREQ=WEEKLY;BYDAY=TU', rotation: true }],
    },
  },
  {
    id: 'trip',
    emoji: '✈️',
    color: '#2E86AB',
    phase: '2',
    name: { en: 'Trip', ar: 'رحلة' },
    tagline: { en: 'Itinerary, packing, shared costs', ar: 'البرنامج والشنط والمصاريف المشتركة' },
    modules: ['events', 'lists', 'expenses', 'budgets', 'vault', 'chat', 'polls'],
    roles: { owner: { en: 'Organizer', ar: 'المنظّم' }, admin: { en: 'Organizer', ar: 'المنظّم' }, member: { en: 'Traveller', ar: 'مسافر' } },
    vocab: { events: { en: 'Itinerary', ar: 'البرنامج' }, event: { en: 'Plan', ar: 'فقرة' }, lists: { en: 'Packing', ar: 'الشنط' }, list: { en: 'Packing list', ar: 'قائمة شنطة' } },
    defaults: {},
    starters: { lists: [{ title: { en: 'Packing', ar: 'الشنطة' }, items: [{ en: 'Passport', ar: 'الباسبور' }, { en: 'Charger', ar: 'الشاحن' }, { en: 'Adapter', ar: 'محوّل كهرباء' }] }] },
  },
  {
    id: 'event',
    emoji: '🎉',
    color: '#B5548C',
    phase: '2',
    name: { en: 'Event', ar: 'مناسبة' },
    tagline: { en: 'Guests, budget, vendors, timeline', ar: 'الضيوف والميزانية والموردين والجدول' },
    modules: ['guests', 'tasks', 'expenses', 'budgets', 'contacts', 'polls', 'chat'],
    roles: { owner: { en: 'Host', ar: 'المضيف' }, admin: { en: 'Host', ar: 'المضيف' }, member: { en: 'Helper', ar: 'مساعد' }, guest: { en: 'Guest', ar: 'ضيف' } },
    vocab: { tasks: { en: 'Timeline', ar: 'الجدول' }, task: { en: 'To-do', ar: 'مهمة' } },
    defaults: {},
    starters: {
      tasks: [{ title: { en: 'Book the venue', ar: 'احجز المكان' } }, { title: { en: 'Send invitations', ar: 'ابعت الدعوات' } }],
    },
  },
  {
    id: 'savings',
    emoji: '💰',
    color: '#C08A1E',
    phase: '2',
    name: { en: 'Savings Circle', ar: 'جمعية' },
    tagline: { en: 'Who pays, who receives, when', ar: 'مين يدفع، ومين يقبض، وإمتى' },
    modules: ['gameya', 'chat', 'polls'],
    roles: { owner: { en: 'Organizer', ar: 'المنظّم' }, admin: { en: 'Organizer', ar: 'المنظّم' }, member: { en: 'Member', ar: 'عضو' } },
    vocab: {},
    defaults: {},
    starters: {},
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
