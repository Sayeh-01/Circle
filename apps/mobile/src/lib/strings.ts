// UI strings. Template words (role names, "Match", "Chore"…) come from @circle/shared templates.

export const en = {
  common: {
    save: 'Save', cancel: 'Cancel', add: 'Add', create: 'Create', delete: 'Delete', done: 'Done', edit: 'Edit', close: 'Close',
    back: 'Back', loading: 'Loading…', error: 'Something went wrong', retry: 'Try again', confirm: 'Confirm', reject: 'Reject',
    share: 'Share', copy: 'Copy', copied: 'Copied', more: 'More', optional: 'optional', none: 'None', you: 'You', open: 'Open',
    seeAll: 'See all', members_one: '{{count}} member', members_other: '{{count}} members', send: 'Send', whatsapp: 'Share to WhatsApp',
  },
  tabs: { today: 'Today', groups: 'Groups', capture: 'Add', inbox: 'Inbox', me: 'Me' },
  auth: {
    tagline: 'WhatsApp is where your groups talk. Circle is where they get things done.',
    email: 'Email', sendCode: 'Send code', code: '6-digit code', verify: 'Sign in', codeSent: 'We sent a code to {{email}}',
    changeEmail: 'Use another email', yourName: 'Your name', welcome: 'Welcome! What should your groups call you?', continue: 'Continue',
    phone: 'Phone number', usePhone: 'Use phone instead', useEmail: 'Use email instead', google: 'Continue with Google', apple: 'Continue with Apple',
  },
  today: {
    title: 'Today', overdue: 'Overdue', dueToday: 'Due today', thisWeek: 'This week', upcoming: 'Coming up', money: 'Money',
    youOwe: 'You owe {{name}}', owesYou: '{{name}} owes you', toConfirm: 'Waiting for you to confirm',
    confirmPayment: '{{name}} says they paid you {{amount}}', announcements: 'Must read', empty: "You're all caught up 🎉",
    emptyHint: 'Create a group or join one with a code to get started.', rsvp: 'Are you in?', settleUp: 'Settle up', markRead: 'Mark read',
    noGroups: 'No groups yet',
  },
  groups: { title: 'Groups', new: 'New group', join: 'Join with a code', empty: 'You are not in any group yet.', pinned: 'Pinned' },
  newGroup: {
    whatFor: "What's this group for?", name: 'Group name', namePlaceholder: 'e.g. Thursday Football', emoji: 'Emoji',
    create: 'Create group', pickModules: 'Pick the tools this group needs', step: 'Step {{n}} of 2',
  },
  invite: {
    title: 'Invite people', code: 'Invite code', shareText: 'Join "{{name}}" on Circle: {{link}} (code {{code}})', copyCode: 'Copy code',
    scan: 'Scan to join', shareLink: 'Share invite', rotate: 'New code', later: 'Go to the group',
  },
  join: {
    title: 'Join a group', enterCode: 'Invite code', find: 'Find group', invitedBy: '{{name}} invited you', displayName: 'Your name in this group',
    join: 'Join', already: "You're already in this group", notFound: 'No group with that code',
  },
  group: {
    nextEvent: 'Next up', myTasks: 'My {{tasks}}', balance: 'Balance', latest: 'Latest announcement', settings: 'Settings', activity: 'Activity',
    nothingYet: 'Nothing here yet', suggestion: 'Suggestion', addSuggested: 'Add', allSettled: 'All settled up', youAreOwed: 'You are owed {{amount}}',
    youOwe: 'You owe {{amount}}', home: 'Home', invite: 'Invite',
  },
  tasks: {
    new: 'New {{task}}', title: 'Title', notes: 'Notes', assignee: 'Assigned to', rotation: 'Take turns (rotation)', due: 'Due',
    repeat: 'Repeat', points: 'Points', complete: 'Mark done', completed: 'Done', reopen: 'Reopen', comments: 'Comments',
    addComment: 'Add a comment', photo: 'Add photo proof', open: 'Open', doneTab: 'Done', mine: 'Mine', unassigned: 'Unassigned',
    nextTurn: 'Next: {{name}}', history: 'History',
  },
  repeat: { none: 'Does not repeat', daily: 'Every day', weekly: 'Every week', monthly: 'Every month', custom: 'Custom rule (RRULE)' },
  events: {
    new: 'New {{event}}', title: 'Title', date: 'Date', time: 'Time', location: 'Location', capacity: 'Spots (capacity)', waitlist: 'Waitlist when full',
    reminder: 'Remind before (minutes)', going: 'Going', maybe: 'Maybe', no: "Can't", waitlisted: 'Waitlist #{{pos}}', spots: '{{going}}/{{capacity}} in',
    goingCount: '{{count}} going', full: 'Full', agenda: 'Agenda', month: 'Month', splitCost: "Split this {{event}}'s cost among Going", amount: 'Total amount',
    nudge: 'Need {{count}} more', nudged: 'Reminded {{count}} people', imIn: "I'm in", out: "I'm out", whosIn: "Who's in", cancel: 'Cancel event',
    repeats: 'Repeats', noEvents: 'Nothing scheduled', shareCard: '{{emoji}} {{title}}: {{time}}. {{going}} in. Tap to join: {{link}}',
  },
  lists: { new: 'New list', addItem: 'Add item', qty: 'Qty', checkedBy: '✓ {{name}}', items_one: '{{count}} item left', items_other: '{{count}} items left', category: 'Category' },
  expenses: {
    new: 'Add expense', title: 'What for?', amount: 'Amount', paidBy: 'Paid by', split: 'Split', equal: 'Equally', exact: 'Exact amounts',
    shares: 'By shares', balances: 'Balances', settleUp: 'Settle up', simplified: 'Fewest payments to settle', owes: '{{from}} → {{to}}',
    method: 'Method', cash: 'Cash', bank: 'Bank transfer', wallet: 'Mobile wallet', other: 'Other', pending: 'Waiting for confirmation',
    reverse: 'Reverse', reversed: 'Reversed', recordPayment: 'Record payment', payTo: 'Pay to', history: 'Expenses', remaining: '{{amount}} left to assign',
    sumMismatch: 'Amounts must add up to the total', allSettled: 'Everyone is settled up 🎉', paidYou: 'paid you', youPaid: 'you paid',
  },
  polls: {
    new: 'New poll', question: 'Question', option: 'Option {{n}}', addOption: 'Add option', multi: 'Allow several choices', anonymous: 'Anonymous',
    deadline: 'Closes in (hours, optional)', vote: 'Vote', votes_one: '{{count}} vote', votes_other: '{{count}} votes', closed: 'Closed', close: 'Close poll',
    voters_one: '{{count}} person voted', voters_other: '{{count}} people voted', makeEvent: 'Make it an event',
  },
  chat: { placeholder: 'Message', reply: 'Reply', replyingTo: 'Replying to {{name}}', pin: 'Pin as announcement', unpin: 'Unpin', announcement: 'Announcement', photo: 'Photo', mention: 'Mention', makeTask: 'Make this a task', announce: 'Post as announcement' },
  settings: {
    title: 'Group settings', name: 'Name', emoji: 'Emoji', modules: 'Modules', members: 'Members', makeAdmin: 'Make admin', makeMember: 'Make member',
    remove: 'Remove', leave: 'Leave group', delete: 'Delete group', deleteConfirm: 'Delete this group for everyone? This cannot be undone.',
    transfer: 'Make owner', membersCanInvite: 'Members can invite', away: 'Away (skip my turns)', myName: 'My name in this group', saved: 'Saved', photo: 'Group photo',
  },
  me: {
    title: 'Me', name: 'Name', language: 'Language', english: 'English', arabic: 'العربية', digits: 'Digits', western: 'Western (123)', arabicDigits: 'Arabic (١٢٣)',
    timezone: 'Timezone', signOut: 'Sign out', deleteAccount: 'Delete account', deleteConfirm: 'Delete your account? Groups you own pass to an admin.',
    export: 'Export my data', photo: 'Change photo', restart: 'Close and reopen Circle to finish switching the layout direction.', notifications: 'Notifications', quietHours: 'Quiet hours',
  },
  inbox: { title: 'Inbox', empty: 'No notifications', markAllRead: 'Mark all read', all: 'All' },
  capture: {
    title: 'Quick add', placeholder: 'e.g. Pay internet Friday', group: 'Group', type: 'Type', task: 'Task', event: 'Event', listItem: 'List item',
    when: 'When', saved: 'Added to {{group}}', pickGroup: 'Pick a group', hint: 'Type one sentence. We pick out the date; you pick the group.', list: 'List',
  },
  activity: {
    created: 'created', updated: 'updated', deleted: 'deleted', completed: 'completed', joined: 'joined', left: 'left', removed: 'removed',
    checked: 'checked', unchecked: 'unchecked', voted: 'voted on', announced: 'announced', paid: 'recorded a payment', confirmed: 'confirmed a payment',
    rejected: 'rejected a payment', reversed: 'reversed', cancelled: 'cancelled', transferred: 'transferred ownership',
  },
  roles: { title: 'Role' },
};

// Arabic adds plural forms (_zero/_two/_few/_many) that English doesn't have.
type Shape<T> = { [K in keyof T]: T[K] extends string ? string : Shape<T[K]> } & { [extra: string]: any };

export const ar: Shape<typeof en> = {
  common: {
    save: 'حفظ', cancel: 'إلغاء', add: 'إضافة', create: 'إنشاء', delete: 'حذف', done: 'تم', edit: 'تعديل', close: 'إغلاق',
    back: 'رجوع', loading: 'جارٍ التحميل…', error: 'حصلت مشكلة', retry: 'حاول مرة أخرى', confirm: 'تأكيد', reject: 'رفض',
    share: 'مشاركة', copy: 'نسخ', copied: 'تم النسخ', more: 'المزيد', optional: 'اختياري', none: 'لا شيء', you: 'أنت', open: 'فتح',
    seeAll: 'عرض الكل', members_zero: 'لا أعضاء', members_one: 'عضو واحد', members_two: 'عضوان', members_few: '{{count}} أعضاء', members_many: '{{count}} عضوًا', members_other: '{{count}} عضو', send: 'إرسال', whatsapp: 'مشاركة على واتساب',
  },
  tabs: { today: 'اليوم', groups: 'المجموعات', capture: 'إضافة', inbox: 'الوارد', me: 'حسابي' },
  auth: {
    tagline: 'واتساب للكلام. Circle لإنجاز الأمور.',
    email: 'البريد الإلكتروني', sendCode: 'أرسل الكود', code: 'الكود (٦ أرقام)', verify: 'دخول', codeSent: 'أرسلنا كودًا إلى {{email}}',
    changeEmail: 'استخدم بريدًا آخر', yourName: 'اسمك', welcome: 'أهلًا! بماذا تناديك مجموعاتك؟', continue: 'متابعة',
    phone: 'رقم الموبايل', usePhone: 'استخدم رقم الموبايل', useEmail: 'استخدم البريد الإلكتروني', google: 'المتابعة باستخدام Google', apple: 'المتابعة باستخدام Apple',
  },
  today: {
    title: 'اليوم', overdue: 'متأخرة', dueToday: 'مطلوبة اليوم', thisWeek: 'هذا الأسبوع', upcoming: 'قريبًا', money: 'الفلوس',
    youOwe: 'عليك لـ {{name}}', owesYou: '{{name}} عليه لك', toConfirm: 'في انتظار تأكيدك',
    confirmPayment: '{{name}} يقول إنه دفع لك {{amount}}', announcements: 'إعلانات مهمة', empty: 'لا شيء متأخر 🎉',
    emptyHint: 'أنشئ مجموعة أو انضم لواحدة بكود للبدء.', rsvp: 'هتيجي؟', settleUp: 'تسوية', markRead: 'تمت القراءة',
    noGroups: 'لا توجد مجموعات بعد',
  },
  groups: { title: 'المجموعات', new: 'مجموعة جديدة', join: 'انضم بكود', empty: 'أنت لست في أي مجموعة بعد.', pinned: 'مثبّتة' },
  newGroup: {
    whatFor: 'المجموعة دي لإيه؟', name: 'اسم المجموعة', namePlaceholder: 'مثلًا: كورة الخميس', emoji: 'إيموجي',
    create: 'إنشاء المجموعة', pickModules: 'اختر الأدوات التي تحتاجها المجموعة', step: 'الخطوة {{n}} من ٢',
  },
  invite: {
    title: 'ادعُ الناس', code: 'كود الدعوة', shareText: 'انضم إلى "{{name}}" على Circle: {{link}} (الكود {{code}})', copyCode: 'نسخ الكود',
    scan: 'امسح للانضمام', shareLink: 'مشاركة الدعوة', rotate: 'كود جديد', later: 'اذهب إلى المجموعة',
  },
  join: {
    title: 'الانضمام لمجموعة', enterCode: 'كود الدعوة', find: 'ابحث عن المجموعة', invitedBy: '{{name}} دعاك', displayName: 'اسمك في هذه المجموعة',
    join: 'انضمام', already: 'أنت بالفعل في هذه المجموعة', notFound: 'لا توجد مجموعة بهذا الكود',
  },
  group: {
    nextEvent: 'التالي', myTasks: '{{tasks}} الخاصة بي', balance: 'الرصيد', latest: 'آخر إعلان', settings: 'الإعدادات', activity: 'النشاط',
    nothingYet: 'لا يوجد شيء بعد', suggestion: 'اقتراح', addSuggested: 'إضافة', allSettled: 'كل الحسابات متسوّاة', youAreOwed: 'لك {{amount}}',
    youOwe: 'عليك {{amount}}', home: 'الرئيسية', invite: 'دعوة',
  },
  tasks: {
    new: '{{task}} جديدة', title: 'العنوان', notes: 'ملاحظات', assignee: 'مسندة إلى', rotation: 'بالدور (تناوب)', due: 'الموعد',
    repeat: 'التكرار', points: 'النقاط', complete: 'تمّت', completed: 'منجزة', reopen: 'إعادة فتح', comments: 'التعليقات',
    addComment: 'أضف تعليقًا', photo: 'أضف صورة إثبات', open: 'مفتوحة', doneTab: 'منجزة', mine: 'مهامي', unassigned: 'غير مسندة',
    nextTurn: 'التالي: {{name}}', history: 'السجل',
  },
  repeat: { none: 'بدون تكرار', daily: 'كل يوم', weekly: 'كل أسبوع', monthly: 'كل شهر', custom: 'قاعدة مخصّصة (RRULE)' },
  events: {
    new: '{{event}} جديد', title: 'العنوان', date: 'التاريخ', time: 'الوقت', location: 'المكان', capacity: 'عدد الأماكن', waitlist: 'قائمة انتظار عند الامتلاء',
    reminder: 'التذكير قبلها (دقائق)', going: 'رايح', maybe: 'يمكن', no: 'مش هقدر', waitlisted: 'انتظار رقم {{pos}}', spots: '{{going}} من {{capacity}}',
    goingCount: '{{count}} رايحين', full: 'مكتمل', agenda: 'الأجندة', month: 'الشهر', splitCost: 'قسّم تكلفة {{event}} على الحاضرين', amount: 'المبلغ الإجمالي',
    nudge: 'محتاجين {{count}} كمان', nudged: 'تم تذكير {{count}}', imIn: 'أنا جاي', out: 'مش جاي', whosIn: 'مين جاي', cancel: 'إلغاء الموعد',
    repeats: 'يتكرر', noEvents: 'لا مواعيد', shareCard: '{{emoji}} {{title}}: {{time}}. {{going}} جايين. انضم: {{link}}',
  },
  lists: { new: 'قائمة جديدة', addItem: 'أضف عنصرًا', qty: 'الكمية', checkedBy: '✓ {{name}}', items_zero: 'لا عناصر متبقية', items_one: 'باقي عنصر واحد', items_two: 'باقي عنصران', items_few: 'باقي {{count}} عناصر', items_many: 'باقي {{count}} عنصرًا', items_other: 'باقي {{count}} عنصر', category: 'الفئة' },
  expenses: {
    new: 'أضف مصروفًا', title: 'على إيه؟', amount: 'المبلغ', paidBy: 'دفع', split: 'التقسيم', equal: 'بالتساوي', exact: 'مبالغ محددة',
    shares: 'بالحصص', balances: 'الأرصدة', settleUp: 'تسوية', simplified: 'أقل عدد تحويلات للتسوية', owes: '{{from}} ← {{to}}',
    method: 'الطريقة', cash: 'كاش', bank: 'تحويل بنكي', wallet: 'محفظة موبايل', other: 'أخرى', pending: 'في انتظار التأكيد',
    reverse: 'عكس القيد', reversed: 'معكوس', recordPayment: 'سجّل دفعة', payTo: 'الدفع إلى', history: 'المصاريف', remaining: 'باقي {{amount}} للتوزيع',
    sumMismatch: 'لازم المبالغ تساوي الإجمالي', allSettled: 'الكل متسوّي 🎉', paidYou: 'دفع لك', youPaid: 'دفعت',
  },
  polls: {
    new: 'تصويت جديد', question: 'السؤال', option: 'اختيار {{n}}', addOption: 'أضف اختيارًا', multi: 'السماح بأكثر من اختيار', anonymous: 'مجهول الهوية',
    deadline: 'يُغلق بعد (ساعات، اختياري)', vote: 'صوّت', votes_zero: 'لا أصوات', votes_one: 'صوت واحد', votes_two: 'صوتان', votes_few: '{{count}} أصوات', votes_many: '{{count}} صوتًا', votes_other: '{{count}} صوت', closed: 'مغلق', close: 'إغلاق التصويت',
    voters_zero: 'لم يصوّت أحد', voters_one: 'صوّت شخص واحد', voters_two: 'صوّت شخصان', voters_few: 'صوّت {{count}} أشخاص', voters_many: 'صوّت {{count}} شخصًا', voters_other: 'صوّت {{count}} شخص', makeEvent: 'حوّله لموعد',
  },
  chat: { placeholder: 'رسالة', reply: 'رد', replyingTo: 'رد على {{name}}', pin: 'ثبّت كإعلان', unpin: 'إلغاء التثبيت', announcement: 'إعلان', photo: 'صورة', mention: 'إشارة', makeTask: 'حوّلها لمهمة', announce: 'انشر كإعلان' },
  settings: {
    title: 'إعدادات المجموعة', name: 'الاسم', emoji: 'الإيموجي', modules: 'الأدوات', members: 'الأعضاء', makeAdmin: 'اجعله مشرفًا', makeMember: 'اجعله عضوًا',
    remove: 'إزالة', leave: 'مغادرة المجموعة', delete: 'حذف المجموعة', deleteConfirm: 'حذف المجموعة للجميع؟ لا يمكن التراجع.',
    transfer: 'اجعله المالك', membersCanInvite: 'الأعضاء يمكنهم الدعوة', away: 'مسافر (تخطَّ دوري)', myName: 'اسمي في هذه المجموعة', saved: 'تم الحفظ', photo: 'صورة المجموعة',
  },
  me: {
    title: 'حسابي', name: 'الاسم', language: 'اللغة', english: 'English', arabic: 'العربية', digits: 'الأرقام', western: 'غربية (123)', arabicDigits: 'عربية (١٢٣)',
    timezone: 'المنطقة الزمنية', signOut: 'تسجيل الخروج', deleteAccount: 'حذف الحساب', deleteConfirm: 'حذف حسابك؟ المجموعات التي تملكها تنتقل لمشرف.',
    export: 'تصدير بياناتي', photo: 'تغيير الصورة', restart: 'أغلق Circle وافتحه مرة أخرى لإكمال تغيير اتجاه الواجهة.', notifications: 'الإشعارات', quietHours: 'ساعات الهدوء',
  },
  inbox: { title: 'الوارد', empty: 'لا إشعارات', markAllRead: 'تحديد الكل كمقروء', all: 'الكل' },
  capture: {
    title: 'إضافة سريعة', placeholder: 'مثلًا: ادفع النت يوم الجمعة', group: 'المجموعة', type: 'النوع', task: 'مهمة', event: 'موعد', listItem: 'عنصر قائمة',
    when: 'متى', saved: 'تمت الإضافة إلى {{group}}', pickGroup: 'اختر مجموعة', hint: 'اكتب جملة واحدة. نلتقط التاريخ، وأنت تختار المجموعة.', list: 'القائمة',
  },
  activity: {
    created: 'أنشأ', updated: 'عدّل', deleted: 'حذف', completed: 'أنجز', joined: 'انضم', left: 'غادر', removed: 'أزال',
    checked: 'علّم', unchecked: 'ألغى تعليم', voted: 'صوّت في', announced: 'أعلن', paid: 'سجّل دفعة', confirmed: 'أكّد دفعة',
    rejected: 'رفض دفعة', reversed: 'عكس', cancelled: 'ألغى', transferred: 'نقل الملكية',
  },
  roles: { title: 'الدور' },
};
