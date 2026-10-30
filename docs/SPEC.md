
Circle: Product Spec & Build Brief
Version 3 · 2026-10-30 · Mobile app (iOS + Android)

WhatsApp is where your groups talk. Circle is where they get things done.

One app for every group in your life: family, roommates, study group, football team, work team, company, building, rental property, trip, wedding. You make a group, pick its type, and it comes with the tools, roles and words that kind of group needs.

How to read this
Part A, The product. What Circle is, every group type, every module, the roadmap and the business. Treat every number in Part A as a hypothesis.
Part B, Your job. For the session receiving this doc: build every version that can be built without outside accounts, in order. Start at B1.
Decisions already made (the owner can change these before sending)
Decision	Choice	Why
Core unit	Group (user-facing word, replaces "Space")	Owner's vision: "make a group, then pick its type"
Group types	Templates are data, not code	Adding a group type means adding one config entry. No new screens.
Launch market	Egypt first (Cairo/Giza), Arabic + English from day one	Assumption, owner to confirm
Platform	Mobile only (iOS + Android) with Expo / React Native. Web is used only for guest links (v1.1) and, later, a manager dashboard (v6.9).	
Backend	Our own server, no hosted backend: Hono (TypeScript) + PostgreSQL + Drizzle, Better Auth, pg-boss jobs, S3-compatible file storage. Full table in B3.	The owner ruled out Supabase. Nothing is locked to one vendor, and the whole test suite runs in a cloud container without Docker.
Build scope	Every version that can be built without outside accounts. Anything that needs an account (payments, SMS, store purchases, AI key) is built against a fake and switched to the real service later.	The owner wants as much finished as possible before coming back
MVP wedge	6 everyday templates: Family, Friends & Roommates, Study, Sport, Work Team, Custom	They all run on the same 7 modules, so 6 templates cost about as much as 1
Money in MVP	Tracking only (who paid, who owes, mark settled). No money moves through the app until v2.6.	No payment licensing needed before product-market fit
Chat in MVP	Yes, kept simple: text, photos, replies, mentions, pinned announcements. No calls.	A group app without chat sends everyone back to WhatsApp
Name	Circle (the owner's choice). Deep-link scheme circleapp://. Store listing name: "Circle: Group Organizer".	"Circle" alone is generic and already used by other products (e.g. Circle.so community software, the Circle parental-controls app), so the store name needs a descriptor. Run a trademark search before launch.
Part A: The Product
A1. The idea
Most people belong to 5 to 10 groups: family, extended family, friends, roommates, a study group, a football group, a work team, a building, a savings circle. Each group runs on a WhatsApp chat plus a pile of other tools (Splitwise for money, Google Calendar, notes apps, spreadsheets) or on nothing at all. Things get lost in the chat: who's coming Thursday, who paid, whose turn it is, when the lease ends.

Circle gives every group a home. Create a group → pick its type → get a ready-made workspace with the right modules, roles and vocabulary. You have one account across many groups, with a different role in each. Your Today screen pulls together everything you need to do, pay or attend, across all your groups, and no group can see the others.

A2. The core insight: Group = Template + Modules + Roles + Vocabulary
Modules are built once: Tasks, Calendar, Lists, Expenses, Polls, Chat, Vault, Shifts, Inventory and so on.
A Template sets:
which modules are switched on
the default roles and their names: in Sport, the Owner is the "Captain" and Members are "Players"
the vocabulary: a Sport event is a "Match", a Study task is an "Assignment", a Business task is a "Duty"
starter content: Family gets a "Groceries" list, Sport gets a recurring "Weekly match"
defaults: Sport events get a capacity of 12 with a waitlist
After creation, any group can switch modules on or off. "Custom" starts blank.
Result: 17 group types for the cost of about 35 modules, and every new type is a config entry. Marketing then sells each template as if it were its own app: "Circle for Football Teams", "Circle for Roommates".
A3. Glossary
Term	Meaning
User	One person, one account
Group	A set of people who share a place, plans, money or responsibilities
Group type / Template	Preset of modules, roles, vocabulary and starter content
Module	A feature block (Tasks, Expenses…) that can be switched on in any group
Item	Anything a module creates: a task, event, list item, expense, poll, document
Role	What a member can do in one group (Owner, Admin, Manager, Member, Child, Guest, Vendor)
Sub-group	A group inside a group: "Parents only", "Kitchen staff", "Tower B"
Linked groups	Two separate groups that share chosen items: a landlord's Property ↔ a tenant's Home; a school class ↔ its parents
Guest link	A web link that lets someone without the app RSVP, view a list or see what they owe (v1.1)
Today	Personal screen across all groups: due, owed, upcoming
A4. A day in the life (why one app beats ten)
Karim, 27, is an engineer in Cairo. At 8:00 his Today screen shows:

🏠 Family: his mom posted "Friday lunch at grandma's" (he already RSVP'd). In the Care Circle for his grandfather, it's his turn to drive him to the doctor on Tuesday, and the medication list is attached.
⚽ Thursday Football: 10 of 12 spots are taken. He taps I'm in and becomes #11. After the match the captain taps "Split court fee among players", which charges 50 EGP each. Karim marks paid in cash and the captain confirms.
💰 Gam'eya with colleagues: month 4 of 10. His 2,000 EGP is due Sunday, and his turn to receive the pot is month 7.
📚 Master's study group: an exam countdown shows 23 days left. Tonight's 9 pm focus session has 4 friends joined.
💼 Work team: the async stand-up opens at 10:00.
🏘️ Compound: the water will be cut tomorrow from 10 to 2, and a package is waiting at Gate 3.
He holds the + button and says "remind the roommates to pay internet on Friday." A task appears in the right group with the right people assigned. His colleagues never see his family group, and his family never sees his gam'eya.

A5. Group types catalogue
#	Type	For	Main jobs	Default modules	Role names (vocabulary)	Phase
1	🏠 Home & Family	Families, couples, extended relatives	Organize daily life	Calendar, Tasks/Chores, Lists, Chat, Expenses, Polls	Parent / Member / Child	1
2	🛋️ Friends & Roommates	Friend groups, roommates, students, co-living	Plan outings, split costs, share chores fairly	Expenses, Tasks/Chores, Lists, Calendar, Chat, Polls	Organizer / Friend	1
3	📚 Study Group	Students, exam prep, courses, tutoring	Study together, stay accountable	Calendar, Tasks (Assignments), Chat, Polls, Lists, later Notes, Focus timer, Flashcards	Lead / Member	1
4	⚽ Sport Team / Club	5-a-side groups, amateur teams, academies, gyms, running clubs	Fill matches, collect fees, track attendance	Calendar (Matches, with capacity), Expenses, Chat, Polls, Lists (Equipment)	Captain / Coach / Player	1
5	💼 Work Team	Teams inside a company, freelancer collectives	Coordinate tasks and meetings	Tasks (board), Calendar, Chat, Polls, later Stand-ups, Wiki, Leave	Lead / Member	1
6	✨ Custom	Anything else	Pick your own modules	None (user picks)	Owner / Member	1
7	❤️ Care Circle	Siblings caring for a parent, a sick relative, a newborn	Share care duties, meds, appointments	Calendar, Tasks (rota), Vault, Meds, Expenses, Chat	Coordinator / Carer	1.5
8	✈️ Trip	Friends or family travelling	Itinerary, packing, shared costs	Calendar (Itinerary), Lists (Packing), Expenses (multi-currency), Vault, Chat	Organizer / Traveller	2
9	🎉 Event	Weddings, birthdays, graduations, reunions	Guests, budget, vendors, timeline	Guest list + RSVP, Tasks (timeline), Budget, Contacts (vendors), Polls	Host / Helper / Guest	2
10	💰 Savings Circle (Gam'eya)	Colleagues, family, neighbours running a جمعية	Who pays, who receives, when	Gam'eya, Chat, Reminders	Organizer / Member	2
11	🕌 Faith & Charity Circle	Khatma groups, church or mosque service, charity drives	Divide readings, rotate duties, track donations	Challenges (e.g. Quran khatma split by juz'), Tasks (rota), Dues, Calendar	Organizer / Member	2
12	🎯 Club & Hobby	Book clubs, gaming squads, hiking groups	Meet up, decide, track	Calendar, Polls, Challenges, Chat, Lists	Host / Member	2
13	🤝 Volunteer / NGO	Volunteer teams, small NGOs	Shifts, hours, donations	Shifts, Calendar, Tasks, Dues (donations), Forms	Coordinator / Volunteer	2–3
14	🏢 Company / Business	Shops, restaurants, clinics, offices	Daily operations	Tasks (checklists), Shifts, Time clock, Inventory, Assets, Approvals, Wiki, Reports	Owner / Manager / Staff / Vendor	3
15	🔑 Property	Landlords, tenants, managers, Airbnb hosts	Run rentals without chaos	Units, Leases, Rent, Requests (maintenance), Inspections, Vault, Chat	Landlord / Manager / Tenant / Vendor	4
16	🏘️ Building / Compound / Community	Apartment buildings, compounds, HOAs, neighbourhoods	Communicate, book, decide, secure	Announcements, Booking, Voting, Dues, Visitors & Packages, Requests	Board / Management / Resident / Security	5
17	🎒 Class & School	Teachers + parents, tutoring centres (سناتر)	Homework, notices, permission slips	Announcements, Calendar, Tasks (Homework), Forms (sign-offs), Dues (class fund)	Teacher / Parent / Student	5
A6. What makes each type feel like its own app
🏠 Home & Family
Chore board with rotation, points and a fairness meter that shows who has carried the load this month
Kids mode: big buttons, a points shop ("30 points = extra hour of games"), parent approval for completed chores (with an optional photo as proof)
Meal planner → grocery list: plan the week, and the ingredients drop into the list
Family calendar with colour per person and a "who's driving?" field on events
Emergency card: blood types, allergies, doctors, insurance, emergency contacts, reachable from the lock screen widget
Memory journal → printed yearly keepsake book
"Arrived safely" check-ins: one tap notifies the family (opt-in, no continuous tracking)
🛋️ Friends & Roommates
Who owes whom, settled with as few transfers as possible
Rent and bills split by room size or custom shares, with recurring bills (internet, electricity) and reminders
Outing planner: poll for a date, poll for a place, then auto-create the event
House rules + guest notices ("Ahmed's brother is staying Thu to Sat")
"We live together" switch turns on rent, bills, house rules and move-in/out checklists
📚 Study Group
Exam countdown pinned at the top and on a home-screen widget
Focus together: a live Pomodoro room that shows who's studying right now, plus a streak for the group
Assignment tracker with due dates, an "I'm done" button and a percentage of the group finished
Shared notes and resources (files, links) organized by subject
Flashcards and quizzes, including AI-generated quizzes from uploaded notes (later)
Q&A board: post a question and mark the best answer
⚽ Sport Team / Club
Match with capacity + waitlist: 12 spots, and #13 is auto-promoted when someone drops
"Need 2 more" alert sent to members who haven't answered, plus a Share-to-WhatsApp card
Court fee split among players who actually played
Team balancer: splits the players into 2 fair teams from skill ratings
Man-of-the-match vote, attendance stats, season leaderboard
Membership fees with "who hasn't paid" (academies)
Carpool board, equipment checklist, injury list
Academy mode: coach + parents of child players, with session reports per child
💼 Work Team
Task board (To do / Doing / Done) with assignees and due dates
Async stand-up: a daily 3-question check-in with a summary posted to the team
Meeting notes with action items that become tasks
Leave calendar ("who's off this week")
Team wiki for how-tos and links
🏢 Company / Business
Opening and closing checklists with time stamps and photo proof
Shifts: schedule, swaps (manager approves), time-off requests
Time clock with QR or geofence check-in, and hours reports for payroll
Inventory with low-stock alerts, and a "reorder" that becomes a task for the vendor
Assets & maintenance: service schedules for equipment and vendor contacts
Expense approvals with spending limits per role
Onboarding checklists for new hires and an SOP wiki
Departments as sub-groups
Customer-facing booking and request forms on a public link
Reports on tasks, costs and staff hours
🔑 Property
Units and leases with lease storage, end-date alerts and renewal tasks
Rent schedule, reminders, receipts, late-fee rules, and online rent from v2.6
Maintenance requests with photos, status, tenant ↔ manager chat, and a link to a vendor job
Move-in and move-out inspections with photo evidence, side by side
Short-term rental turnover: a cleaning job is created automatically from each checkout date
Owner statements: monthly income minus costs per unit
Linked to the tenant's Home group: the tenant sees rent due and their ticket status in their own Today
🏘️ Building / Compound / Community
Announcements with read receipts (critical ones need an acknowledgement)
Facility booking: gym, hall, court, parking, laundry, with rules (max 2 hours, residents only)
Polls and formal voting with quorum, one vote per unit and results archived
Dues collection with a "paid / unpaid by unit" board
Visitor passes (QR codes sent to guests), package notifications, and a security-guard role with a scanner view
Neighbour board: swap or sell items, lost & found, recommendations
Emergency broadcast
❤️ Care Circle
Medication schedule with dose reminders and "given by"
Appointment rota among siblings, with notes after each visit
Health vault: prescriptions, reports, insurance
Shared care costs split among siblings
💰 Savings Circle (Gam'eya)
Rounds: fixed amount, monthly, N members, and a payout order (drawn or agreed)
Payment board: each month, who paid and who is late, and the receiver confirms
Turn swaps between members, with the organizer's approval
Reminders before the due date, and a full history that becomes a trust record
Tracking only. The app never holds the pot (see A12).
✈️ Trip · 🎉 Event · 🕌 Faith & Charity · 🎯 Club & Hobby · 🤝 Volunteer · 🎒 Class & School
Trip: day-by-day itinerary, packing list per person, multi-currency costs with one currency to settle up in, and booking documents
Event: guest list where guests RSVP through a link without the app; budget vs actual; vendor contacts; a countdown timeline of tasks; a gift list
Faith & Charity: khatma split (30 juz' shared among members, with automatic reassignment for the next round); iftar-hosting rotation; donation pooling (tracking only); volunteer duty rota
Club & Hobby: reading or route schedule, challenges with streaks, polls for the next pick
Volunteer / NGO: shift sign-up, volunteer hours log and certificates, donation tracking
Class & School: homework posts, permission slips signed in the app, parent-teacher meeting slots, class fund
A7. Module library
Module	What it does	Signature details	Phase
Chat	Group conversation	Text, photos, voice notes (v1.2), replies, @mentions, a thread on any item	1.0
Announcements	Admin broadcasts	Pinned, read receipts, "must acknowledge" option	1.0
Calendar & Events	Shared schedule	Recurrence, RSVP, capacity + waitlist, reminders, location, ICS feed export (v1.1)	1.0
Tasks & Chores	Who does what	Assign to a person or a rotation, recurrence, due dates, points, photo proof, comments	1.0
Lists	Shared checklists	Real-time, quantities, who checked it, categories	1.0
Expenses & Splits	Shared spending	Equal / exact / shares split, balances, simplified debts, settle-up with receiver confirm	1.0
Polls	Quick decisions	Single or multi choice, anonymous, deadline	1.0
Activity	What happened	Per-group feed of changes	1.0
Points & Rewards	Motivation	Points per task, rewards shop, streaks, fairness meter	1.2
Focus timer	Study together	Live room, Pomodoro, group streaks	1.3
Team builder	Sport	Skill ratings → balanced teams	1.3
Notes & Wiki	Group knowledge	Pages, house rules, SOPs, subject notes	1.3
Flashcards	Study	Decks, spaced repetition, AI quiz from notes (v1.4)	1.3
Meal planner	Family food	Weekly plan → grocery list	1.4
Memories	Shared journal	Photos + notes timeline, yearly book export	1.4
Vault	Important documents	Folders with permissions, expiry alerts that become tasks, OCR search	1.5
Health & Meds	Care	Med schedules, dose log, appointments	1.5
Safety	Peace of mind	"Arrived safely" check-in, emergency card, SOS to group	1.5
Dues & Fees	Recurring collections	Amount per member or unit, paid/unpaid board, reminders	2.0
Budgets	Spending limits	Budget per category with alerts	2.0
Guest list	Events	Invite by link, RSVP + plus-ones, dietary notes	2.0
Gam'eya	Rotating savings	Rounds, payout order, payment board, swaps	2.2
Challenges	Shared goals	Split a goal (khatma, reading, steps), track, rotate	2.8
Forms & Sign-offs	Collect info	Custom forms, signatures, permission slips	2.8
Stand-ups	Async team check-ins	Daily questions, summary	3.0
Shifts & Rota	Staff scheduling	Templates, swaps, time-off, conflicts	3.4
Time clock	Attendance	QR or geofence clock-in, hours report	3.4
Inventory	Stock	Items, counts, low-stock alerts, reorder	3.6
Assets & Maintenance	Equipment	Service schedules, history, vendor	3.6
Approvals	Sign-off flows	Expenses, time-off, purchases, with limits per role	3.6
Requests & Tickets	Issues	Photos, status, assignee, SLA, link to vendor	4.3
Units & Leases	Property	Unit tree, lease terms, alerts	4.0
Inspections	Property	Room-by-room checklist with photos, move-in vs move-out	4.9
Booking	Shared resources	Slots, rules, approvals, fees	5.3
Voting	Formal decisions	Quorum, one vote per unit, audit trail	5.6
Visitors & Packages	Building security	QR passes, guard scanner, package log	5.9
Contacts	Directory	Vendors, doctors, emergency numbers per group	2.0
Reports	Insights	Tasks, costs, hours, attendance	3.8
A8. Connected items: modules talk to each other
This is where the product goes beyond its competitors. Every item can turn into or link to another item:

Event → Expense: "Split this event's cost among Going" (court fee, dinner, trip) (MVP)
Poll → Event: the winning date in a poll becomes the event
Task → Expense: "I bought it" on a grocery or errand task asks for the amount and records it
Meal plan → List: ingredients land in the grocery list
Receipt photo → Expense: AI reads the amount and items, and you pick who shares them
Vault document → Task: "Lease ends in 60 days" creates a "Renew lease" task
Maintenance ticket → Vendor job → Payment → Expense
Chore done → Points → Reward
Chat message → Task/Event: long-press "make this a task"; the AI suggests it automatically from 1.4
Inventory low → Reorder task → Approval → Expense
Dues unpaid → Reminder → Pay link (from 2.6)
A9. The cross-group layer
Today: one feed of what's overdue, due today and upcoming, money owed or owed to you, RSVPs needed and must-read announcements, grouped by time and tagged with the group's colour and emoji. You can act from the row (complete, RSVP, mark paid).
Quick capture (+): type or speak one sentence. It is parsed into an item, the group and the assignees, and you confirm before it's saved. Rule-based in 1.0 (pick the group manually), AI-parsed from 1.4.
Group switcher: your groups sorted by recent activity, with unread badges, pinned favourites and a colour per group.
Inbox: mentions, assignments, approvals and confirmations in one place, with filters per group.
Universal search across every group you belong to, permission-aware.
"Just me" personal group: private tasks, lists and docs that use the same modules.
Per-group identity: a different display name and photo per group ("Dad" at home, "Eng. Karim" at work). Your phone number is hidden by default except where you share it.
Privacy walls: no group can see that your other groups exist. Admins never see your other memberships.
Linked groups: two groups share selected items without merging (landlord ↔ tenant, school ↔ parents, company ↔ vendor). Each side controls what is shared.
Sub-groups: "Parents only" inside Family, "Kitchen" inside Restaurant, "Tower B" inside Compound. Members inherit visibility downwards.
Guest links (v1.1): people without the app can RSVP, view a list, see their share and confirm payment through a web page. The install prompt appears after their second interaction.
Notification brain: quiet hours per group, a daily digest for low-priority groups, instant delivery only for things assigned to you, mentions and money, and actions inside the notification (✓ Done, I'm in, Paid).
Widgets: Today, a specific list, an exam countdown, the next match.
Offline: cached reads in 1.0. Queued offline writes come later.
A10. AI layer
AI does the group's admin work. It never acts on its own where money or messages to others are involved.

Phase	Feature	Example
1.4	Smart quick capture	"Remind roommates to pay internet Friday" → task, group, assignees
1.4	Chat → items	Spots "let's play Thursday 9pm?" and offers to create the match
1.4	"What did I miss?"	Summary of 300 unread messages in 5 bullets
1.4	Quiz from notes	Upload lecture PDF → 20 flashcards
2.0	Receipt scan	Photo → amount, items, suggested split
2.0	Meal and grocery planner	"Plan next week, budget 1,500 EGP, one vegetarian"
3.x	Shift optimizer	Builds a draft rota that respects availability and labour rules
3.x	Business insights	"Cooking oil runs out every 9 days. Reorder on day 7?"
4.x	Property watchdog	"Unit 3 has had 4 plumbing tickets in 6 months"
7.0	Cross-group assistant	"When does the lease end?" · "What's low on stock?" · "Who hasn't paid dues?" · "Plan my week"
Guardrails: AI only sees groups the user belongs to, filtered by their role. It drafts and the human confirms anything that notifies others, moves money or deletes data. It shows its sources ("from Lease.pdf, page 2"). AI is off by default for Child accounts. Models: claude-haiku-5-5 for parsing and classification, claude-sonnet-5-5 for the assistant.

A11. Roles & permissions
The default roles are Owner, Admin, Manager, Member, Child, Guest and Vendor. Templates rename them (Captain, Coach, Player…). Custom roles arrive with Business (v3.2).

Action	Owner	Admin	Manager	Member	Child	Guest	Vendor
Delete group / transfer ownership	✓	–	–	–	–	–	–
Change modules, settings, roles	✓	✓	–	–	–	–	–
Invite / remove members	✓	✓	invite	invite (if group allows)	–	–	–
Create tasks, events, lists, polls	✓	✓	✓	✓	lists only	–	–
Approve (shifts, expenses, chores)	✓	✓	✓	–	–	–	–
Add expense / see money	✓	✓	✓	✓	–	own share only	own invoices
Vault	✓	✓	per folder	per folder	–	–	–
Chat	✓	✓	✓	✓	✓	item threads	ticket threads
Child accounts (v1.2) are created and managed by a parent. They have no email, a PIN login on a shared device, no money module, no AI and no links outside the family.

A12. Money layer
Units: integer minor units (piasters or cents), one currency per group. Trips can mix currencies and settle in one.
Split types: equal, exact amounts, shares/weights (e.g. room size), percentages. The remainder goes deterministically, so shares always add up exactly.
Balances and simplify debts: the fewest transfers needed to settle a group.
Settle up: record a payment with a method (cash, bank transfer, mobile wallet, other). The receiver confirms, and only a confirmed payment changes balances.
Dues: recurring amounts per member or unit, with a paid/unpaid board.
Gam'eya: rounds, order, payment board and swaps. The app records; it never holds funds.
Staging: (1) tracking only (v1.0 to v2.4) → (2) pay through licensed gateways (Egypt: e.g. Paymob or Fawry; elsewhere: Stripe), where the app never holds a balance (v2.6) → (3) maybe a wallet or escrow later, only with a licensed partner. Regulatory check before step 2.
A13. Mobile UX
Bottom tabs: Today · Groups · ( + ) · Inbox · Me
Group screen: header (name, emoji or photo, member avatars, switcher), a dashboard of cards (next event, my tasks, balance, latest announcement), then a top tab bar of that group's modules. Up to 5 are pinned and the rest sit under "More". Template vocabulary replaces the module names.
60-second onboarding: sign in → "What's this group for?" (a grid of 17 big tiles) → name + emoji → invite (WhatsApp share, QR, code) → land in a group that already has starter content. Never show an empty screen.
Join flow: open the link or enter the code → see the group name, inviter and member count → join → pick a display name for this group.
Empty states come from templates: one tap adds a suggested item ("Add 'Weekly match' every Thursday 9 pm?").
Design: calm, card-based and thumb-reachable. A colour per group. Haptics on complete. Celebratory micro-animations for streaks and settled debts.
Arabic-first quality: full RTL mirroring, Arabic or Western digits per user, Arabic dates (and Hijri dates for the Faith template), and fonts with good Arabic shaping.
Accessibility: dynamic type, screen-reader labels, touch targets of at least 44 pt, contrast AA, no colour-only meaning.
Low-end Android friendly: small app size, image compression, fast cold start, works on slow 3G/4G.
A14. Trust, safety & privacy
Privacy walls between groups (A9). Data is minimised: phone and email are hidden by default.
Every permission check goes through one server-side guard. A test calls every group route as an outsider to prove it's blocked.
Kids: parent-managed accounts, no discovery, no public links, no AI, no ads ever.
Reporting and blocking. An admin can remove a member, and removed members lose access immediately.
In-app account deletion (an Apple App Store requirement) and data export per user and per group.
Audit log for money and votes: entries can't be edited, only reversed.
Compliance: Egypt's Personal Data Protection Law (Law 151 of 2020), plus GDPR if EU users join. Sensitive data (health, IDs) is stored encrypted and only in the Vault or Health modules.
No ads in Family, Child, Care or Health contexts.
A15. Growth engine
Invite loop: every group brings 3 to 20 people, and each of them is a potential group creator.
Guest links: non-users take part without installing. That's the bridge from WhatsApp.
WhatsApp-native sharing: every item has Share to WhatsApp, which posts a clean card plus a link ("⚽ Thursday 9 pm: 10/12 in, tap to join").
Cross-over: one person ends up with family + football + work + building groups. Each is a new group, not a new app.
Templates as content: public pages per template ("Free football team organizer", "Roommate expense splitter") for search, TikTok and Reels.
B2B2C channels: football academies and 5-a-side courts, tutoring centres, schools, compound developers and facility managers, property agencies, and small-business associations. One deal brings in hundreds of members.
Campus ambassadors: Study + Roommates at large universities.
Seasonal hooks: Ramadan (khatma, iftar rotation, charity), back-to-school, summer trips, big football tournaments (prediction league with points only, no betting).
Referral: 1 month of Plus for every 3 invitees who become active.
Vendors join free to receive jobs, so the marketplace has supply from day one (Phase 6).
A16. Business model (all prices are hypotheses to validate)
Plan	Who pays	What it adds	Hypothesis price
Free	Everyone	Unlimited groups (up to 15 members each), all core modules, no ads	0
Plus	One person	AI assistant, Vault + expiry alerts, unlimited history, widgets, themes	EGP 79/mo · $3.99
Group Pro	One member pays for a whole group	Up to 100 members, sub-groups, dues, exports, admin tools	EGP 149/mo · $6.99
Business	Per seat	Shifts, time clock, inventory, approvals, reports	EGP 60/seat/mo · $3
Property	Per unit	Leases, rent, maintenance, inspections, statements	EGP 40/unit/mo · $1.50
Community	Per unit	Booking, voting, visitors, dues	EGP 15/unit/mo · $0.75
Transactions	Per payment	Rent, dues, gam'eya, marketplace through the gateway	1–2.5%
Marketplace	Vendors	Commission per job, optional featured listing	10–15%
Validate with about 10 interviews per segment before building any paywall. In the long run, transaction fees are likely the biggest income line.

A17. Roadmap
Phase 1: Everyday Groups

v1.0 MVP: 6 templates (Family, Friends & Roommates, Study, Sport, Work Team, Custom) · Today · Chat + Announcements · Calendar with RSVP, capacity and waitlist · Tasks/Chores with rotation · Lists · Expenses & splits (tracking) · Polls · push notifications · Arabic + English (full scope in B5)
v1.1 Reach: guest web links, universal links, phone OTP, Google + Apple sign-in, Share-to-WhatsApp cards, ICS calendar feed
v1.2 Motivation: points, rewards shop, streaks, fairness meter, Child accounts, voice notes
v1.3 Sport & Study packs: team balancer, MOTM vote, attendance stats, carpool · focus-together room, exam countdown widget, flashcards, notes/wiki
v1.4 Life + first AI: meal planner ↔ groceries, memories + yearly book, home-screen widgets, AI quick capture, chat → items, "what did I miss"
v1.5 Care & Safety: Vault with expiry alerts, emergency card, meds, Care Circle template, "arrived safely"
Phase 2: Money & More Groups

v2.0: dues, budgets, multi-currency, receipt scan, Contacts, Trip and Event templates (guest list)
v2.2: Gam'eya module + Savings Circle template
v2.4: Plus + Group Pro subscriptions (in-app purchase)
v2.6: real payments through local gateways, receipts, transaction fee
v2.8: Challenges, Forms; Faith & Charity, Club & Hobby, Volunteer templates
Phase 3: Work & Business

v3.0: Work Team pack: board view, async stand-ups, meeting notes → tasks, leave calendar
v3.2: Company template: departments (sub-groups), opening/closing and onboarding checklists, SOP wiki, custom roles
v3.4: shifts, swaps, time-off, time clock (QR/geofence)
v3.6: inventory + low stock, assets & maintenance, vendor contacts, expense approvals
v3.8: public booking and request forms, reports (tasks, costs, hours), per-seat billing
Phase 4: Property

v4.0: units, landlord/tenant profiles, leases + storage, rent reminders, link to the tenant's Home group
v4.3: maintenance requests with photos, status tracking, tenant ↔ manager chat
v4.6: online rent collection, receipts, late-fee rules
v4.9: move-in/out inspections with photo evidence, short-term rental turnover, owner statements
Phase 5: Community & School

v5.0: building/compound announcements (acknowledgements), events board, resident directory
v5.3: facility booking (parking, gym, hall, court, laundry)
v5.6: formal voting with quorum, dues collection for HOAs and associations
v5.9: visitor QR passes, guard scanner, package notifications, emergency broadcast
v5.9+: Class & School template (homework, permission slips, class fund)
Phase 6: Platform

v6.0: service marketplace (plumbers, cleaners, electricians, tutors, coaches, caterers, photographers), matched to group needs ("Hire a pro" on a ticket), with commission
v6.3: integrations (Google/Apple Calendar two-way, WhatsApp Business notifications, accounting export, payment gateways) + open API & webhooks
v6.6: template gallery, where users publish and share their own group templates
v6.9: manager web dashboard for business, property and community admins
v7.0: AI assistant across all groups (A10)
A18. Metrics
North Star: Weekly Active Groups (WAG). Groups where at least 2 members each did at least 1 meaningful action in the last 7 days (completed a task, RSVP'd, added an expense, checked a list item, voted).
Activation: within 48 hours of creating a group, at least 2 other members joined, at least 3 items exist, and at least 1 item was completed by someone other than the creator.
Virality: invites sent per new group, invite acceptance rate, guest → install conversion.
Retention: group retention at week 1, 4 and 12; user retention by number of groups.
Cross-over: share of users in 2 or more group types.
Revenue: paid conversion per plan, payment volume and take rate.
Initial guesses to replace with real cohort data: activation 40%, week-4 group retention 35%, 20% of users in 2+ group types by month 6.
A19. Competition & positioning
Competitor	What it does well	Our angle
WhatsApp groups / Communities	Everyone already uses it	We don't replace the chat. We do the organizing that chat can't, and we share back into WhatsApp.
BAND (Naver)	Closest concept: one group app for teams and clubs	Templates per group type, money, Today across groups, Arabic-first
Splitwise, Tricount	Expense splitting	Splits connected to events, tasks, gam'eya and dues
Cozi, FamilyWall, OurHome	Family organizing	Families are only one of our 17 group types, and the same account covers everyone's other groups
TeamSnap, Spond, Heja	Sports teams	Same depth for Sport, plus every other group the players are in
Connecteam, Deputy, Homebase	Shift work	Small-business teams in a familiar consumer app, priced locally
Property management software	Landlords	Tenant-side app the tenant already uses for their own home
Positioning: "One app for all your groups. WhatsApp is where you talk; Circle is where it gets done."

A20. Risks & mitigations
Risk	Mitigation
"Does everything, great at nothing"	Market each template as its own product. Launch with 6, all built on the same 7 modules. Go deep before going wide.
WhatsApp inertia	Integrate instead of competing: share cards, guest links, WhatsApp notifications (v6.3)
Payments regulation	Tracking only until a licensed gateway is in place. Never hold funds.
Privacy across groups	One server-side permission guard, tested on every route; per-group identity; audit
Scope creep in the build	Templates are data; strict MVP ceiling (B7)
Marketplace cold start	Vendors join free; seed from groups' own Contacts
Name / trademark	"Circle" is generic and already used elsewhere. Use a descriptor in the store name and run a trademark check (see Decisions).
Part B: Build Brief (for the receiving session)
You are building Circle. It is a mobile app for iOS and Android, plus a web build of the same app that serves guest pages and the manager dashboard. Part A is context. This part is your contract.

The owner is away while you work. Don't stop to ask questions between versions. Make the call yourself, write it in docs/NOTES.md, and keep going until every version in B5 is done or marked blocked.

B1. Start here
Greenfield. No code exists yet, and this document is the only input. Save it word for word as docs/SPEC.md and commit that first. After any context reset, re-read it from there.

Resume protocol. docs/PROGRESS.md is the source of truth for where you are. It has one line per version in B5, marked [ ] not started, [~] in progress, [x] done, or [-] blocked (with the reason). Update it and push after every version.

If you are a new session continuing this work: read docs/PROGRESS.md and git log -20, run pnpm check, then continue from the first version that isn't [x] or [-].
Scaffold. Set up a pnpm workspace with exactly three packages (B6). Create the app with npx create-expo-app@latest apps/mobile (Expo SDK 56 or newer).

The one green command: pnpm check. It runs, in order:

a typecheck of every package
Vitest on shared and server, against PGlite
Playwright E2E against the Expo web build
Create it in v1.0 milestone M1. It must be green at the end of every version.

Read in order: B3 (stack) → B4 (blockers) → B5 (scope) → B7 (traps) → B9 (acceptance).

B2. Verified state
Nothing has been built or measured. Treat Part A as hypotheses. The facts below are what's known:

Fact	Source
Expo SDK 56 was released 2026-05-21 (React Native 0.85, React 19.2). SDK 55 (2026-02-25) dropped the Legacy Architecture.	expo.dev/sdk/56, expo.dev/sdk/55, checked 2026-10-30
Better Auth ships Email OTP and Phone Number plugins. Phone sign-up needs a temporary-email function. The beta docs (v1.8) differ from stable, so read the docs for the version you install.	better-auth.com/docs/plugins, checked 2026-10-30
Drizzle + PGlite runs real Postgres in-process for tests, with no Docker. The common pattern: a createApp(db) factory, the hono/testing client, and Drizzle's PGlite migrator in beforeAll.	Community guides, checked 2026-10-30. Confirm the exact API names against current docs.
Apple requires in-app account deletion. Apple requires Sign in with Apple when an app offers other social logins.	Author's knowledge, not checked
Remote push doesn't work in Expo Go on Android since SDK 53.	Author's knowledge, not checked
Egypt resumed daylight saving time in 2023.	Author's knowledge, not checked
B3. Stack (chosen: the owner ruled out Supabase)
Layer	Choice	Why	Not chosen
App (iOS, Android, web)	Expo SDK 56+, Expo Router, TypeScript strict	One codebase for phones and web pages (guest links, manager dashboard). The web build lets a cloud session test flows without a simulator.	Flutter (types not shared with the server, weaker web for dashboards); native Swift + Kotlin (two codebases)
Server data in the app	TanStack Query, cache persisted to storage	Caching, retries and offline reads come built in	Redux, custom stores
API	Hono on Node 22+ LTS, with @hono/zod-openapi	Small and fast. One route definition gives the app a typed client and produces the OpenAPI doc for the public API (v6.3).	NestJS (heavy); tRPC (no REST for the public API); Express
Database	PostgreSQL 17+, Drizzle ORM, drizzle-kit migrations	Money, permissions and reports need relational data and real transactions	Firebase/Firestore (NoSQL is wrong for money and per-group permissions); MongoDB; PocketBase/SQLite (single node); Convex (a hosted backend again, the same lock-in)
Test database	PGlite (Postgres compiled to WASM, runs in-process)	Real Postgres in tests with no Docker, so the whole suite runs in a cloud container	Mocks; Docker Postgres
Auth	Better Auth (self-hosted) with its Expo client	Email OTP now. Phone OTP, Google and Apple are plugins added once accounts exist. Users live in our own database.	Clerk/Auth0 (per-user fees, external); Firebase Auth
Realtime	WebSocket on the same Hono server. The server sends "group X, entity Y changed"; the app invalidates that query and refetches. Only chat messages and presence carry their payload.	Very little code, and all writes still go through the normal API	Socket.io; syncing state over the socket
Jobs & cron	pg-boss (a queue and scheduler that lives in Postgres)	Reminders, recurring dues and expiry alerts without Redis	BullMQ + Redis
Files	S3-compatible API (Cloudflare R2 in production). A local-disk driver in dev and tests. Presigned uploads.	Cheap and portable	Files in Postgres
Push	expo-notifications + expo-server-sdk	Free, one API for iOS and Android	Direct APNs/FCM
Email	Nodemailer over any SMTP (e.g. Resend). The dev driver prints codes to the console.		
SMS, payments, subscriptions, AI, calendar sync	One adapter each, with a fake/dev implementation now and the real one once accounts exist (B4)	Everything can be built and tested today	
PDFs (yearly book, statements, receipts)	Build HTML, then render it on the device with expo-print	The phone's browser engine shapes Arabic correctly	pdf-lib (breaks Arabic letter joining)
i18n	i18next + expo-localization		
Tests	Vitest (shared + server); Playwright E2E on the Expo web build		Component snapshot tests
Deploy (later, the owner's step)	Dockerfile + docker-compose (server + Postgres). Production: managed Postgres (e.g. Neon), the server on a VPS or Fly.io, files on R2.	Portable, no lock-in	
B4. Blockers, already resolved
These are the outside accounts and services you won't have.

Missing	Makes this unbuildable	Build this instead
Apple/Google developer accounts, EAS	Store builds, real push, verifying device-only features	Build everything. Test on Expo web and in unit tests. List the device checks for the owner.
Simulators in the container	On-device checks	Expo web + Playwright. Never claim device verification you didn't do.
A hosted Postgres server	Production database	PGlite for dev and tests; docker-compose for a local real Postgres. If docker info works, also run the suite once per phase against real Postgres.
SMTP / Resend key	Real emails	A dev mailer that logs codes. E2E reads the code from a test-only route that doesn't exist when NODE_ENV=production.
SMS provider	Phone OTP	The Better Auth phone plugin, wired to an SMS adapter whose dev driver logs the code
Google/Apple OAuth client IDs	Social login	Wire both providers from env vars. Hide the buttons when the env vars are missing.
A domain	Universal links; hosted guest pages	The circleapp:// scheme + invite codes. The server serves /.well-known/apple-app-site-association and assetlinks.json, using a placeholder domain from env.
Payment gateway (Paymob/Stripe) + licensing	Real money	A PaymentProvider interface plus a FakeProvider that succeeds or fails depending on the amount. Webhook handling, signature checks, idempotency and receipts are all real code.
RevenueCat + store products	Real subscriptions	An entitlements table, plan limits and paywall screens. Entitlements are granted only by an admin CLI script in dev.
ANTHROPIC_API_KEY	Live AI	An ai module that calls Claude when the key is set: claude-haiku-5-5 for parsing, claude-sonnet-5-5 for the assistant. Tests use recorded fake responses. AI UI is hidden when the key is missing.
Google Calendar OAuth, WhatsApp Business API	Two-way calendar sync; automated WhatsApp messages	A read-only ICS feed, plus the share sheet and wa.me links
Exchange-rate API	Live FX rates	A manual rate per trip, stored on each expense
B5. Scope: every version that can be built
Build in this order. A version is done when all of these are true:

its features work on Expo web, or are unit-tested where web can't run them
its checks in B9 pass
pnpm check is green
docs/PROGRESS.md and docs/REPORT.md are updated
the commit is pushed
The columns mean:

Build: fully built
Fake: built against the fake adapter; the real adapter waits for an account
Skip: can't be built here; goes on the owner's list
Version	Build	Fake	Skip
v1.0 MVP	Everything in the v1.0 table below	Sending push (unit-tested)	
v1.1 Reach	Guest web links (pages rendered by the server), ICS feed, Share-to-WhatsApp cards, universal-link files	Phone OTP, Google and Apple sign-in	Domain verification
v1.2 Motivation	Points, rewards shop, streaks, fairness meter, Child accounts, voice notes (recording on device; web only plays them)		
v1.3 Sport & Study	Team balancer, man-of-the-match vote, attendance stats, carpool, focus-together room, exam countdown, flashcards, notes/wiki		Home-screen widgets
v1.4 Life + AI	Meal planner ↔ groceries, memories, yearly book (HTML → expo-print)	AI quick capture, chat → items, "what did I miss", quiz from notes	
v1.5 Care & Safety	Vault + expiry alerts, emergency card, meds, Care Circle template, "arrived safely"	Vault text search inside images (via AI)	
v2.0	Dues, budgets, multi-currency (manual rates), contacts, Trip + Event templates, guest list	Receipt scan	
v2.2	Gam'eya module + Savings Circle template		
v2.4	Entitlements, plan limits, paywall screens	Store purchases (RevenueCat)	
v2.6	Payment flow, webhooks, receipts, fee calculation	Gateway (Paymob/Stripe)	
v2.8	Challenges, forms + signatures; Faith & Charity, Club & Hobby, Volunteer templates		
v3.0–v3.8	Work pack, Company template, sub-groups, custom roles, checklists, SOP wiki, shifts + swaps + time-off, QR time clock, inventory, assets, approvals, public booking/request forms, reports	Per-seat billing	Geofence clock-in (device only)
v4.0–v4.9	Units, leases, rent schedule + reminders, linked groups (landlord ↔ tenant), tickets, late fees, inspections, turnover, owner statements	Online rent	
v5.0–v5.9	Announcements with acknowledgement, resident directory, facility booking, formal voting, dues by unit, visitor QR passes + guard scanner (web fallback: type the code), packages, emergency broadcast, Class & School template		
v6.0	Marketplace: vendor profiles, jobs created from tickets, quotes, ratings	Commission payout	
v6.3	Open API (API keys, OpenAPI doc, rate limits), signed webhooks with retries, CSV/Excel export		Google Calendar sync, WhatsApp Business
v6.6	Template gallery: publish, browse, install		
v6.9	Manager web dashboard (the same Expo app with wide layouts)		
v7.0		Cross-group AI assistant with permission-scoped tools	
v1.0 MVP detail
#	Feature	Must do
1	Auth & profile	Email OTP (Better Auth). Profile: name, photo, language (ar/en), digits (Arabic/Western), timezone. Delete account.
2	Groups	Create from 6 templates. Edit name, emoji and photo. Switch modules on and off. Roles Owner/Admin/Member, renamed per template. Invite by code, QR or share sheet; join by code or deep link. Leave, remove a member, transfer ownership. Display name per group.
3	Today	Across all groups: my tasks that are overdue, due today or due in the next 7 days; events with my RSVP; what I owe and am owed; unread announcements. Act inline: complete, RSVP, open settle-up.
4	Tasks & Chores	Title, notes, assignee or rotation, due date, recurrence (daily/weekly/monthly/custom RRULE), points (integer, stored only), complete with optional photo, comments
5	Calendar & Events	Create, recurrence, location text, RSVP going/maybe/no, capacity + waitlist with auto-promotion, reminder offset, agenda + month view
6	Lists	Multiple lists, real-time check/uncheck, quantity, who checked it
7	Expenses	Amount, payer, split equal / exact / shares among chosen members. Balances and simplified debts. A settle-up counts only after the receiver confirms. "Split this event's cost among Going."
8	Polls	Single or multi choice, anonymous option, deadline, results
9	Chat + Announcements	One chat per group: text, image, reply, @mention. Announcements are messages pinned by admins.
10	Activity feed	Per group, written by the server in the same transaction as the change
11	Push	Task assigned or due, event reminder, waitlist promotion, mention, expense involving me, settle-up awaiting my confirmation
12	i18n	English + Arabic, full RTL, Arabic/Western digits, localized dates
13	Templates	Family, Friends & Roommates, Study, Sport, Work Team, Custom. Each one sets modules, role names, vocabulary, starter content and defaults (A5/A6).
v1.0 milestones:

M1: monorepo, pnpm check, schema, auth, groups, templates, invites/join
M2: tasks/chores, lists, events + RSVP/waitlist, Today
M3: expenses + splits + settle-up, polls, chat + announcements, activity, realtime
M4: push pipeline, Arabic/RTL pass, account deletion, polish
B6. Architecture
Monorepo with exactly three packages:

apps/mobile (Expo)
apps/server (Hono)
packages/shared: zod schemas, templates, the permission matrix, and pure logic (money, rotation, recurrence, balancer, spaced repetition)
Templates and permissions are data in packages/shared. Code reads group.modules, the vocabulary and the permission matrix. It never branches on the template id.

{ id: 'sport', emoji: '⚽',
  modules: ['events','expenses','chat','polls','lists','tasks'],
  roles: { owner: 'Captain', admin: 'Coach', member: 'Player' },
  vocab: { event: 'Match', task: 'Duty' },
  defaults: { eventCapacity: 12, waitlist: true },
  starters: { lists: ['Equipment'], events: [{ title: 'Weekly match', rrule: 'FREQ=WEEKLY;BYDAY=TH' }] } }
Authorization has one choke point. Every group route lives under /groups/:groupId/... and passes the requireMember(permission) middleware. The middleware loads the membership and role, then:

returns 404 to non-members, so the response doesn't reveal the group exists
returns 403 to members who lack the permission
Handlers read groupId only from the middleware context, and every item lookup filters on both the item id and that groupId. Guests (token), Vendors, linked groups and API keys all pass through the same middleware with narrower scopes.

Route sweep test. A test walks every registered /groups/:groupId route and calls it as a non-member; every one must return 404. New routes are covered automatically.

Money. Amounts are integer minor units stored as bigint. Each write is one transaction. Balances are computed from expenses plus confirmed settlements, never stored as a running total.

Realtime. In-process pub/sub keyed by groupId, published after the transaction commits. Mark it with // ponytail: in-process pub/sub; switch to Postgres LISTEN/NOTIFY when running more than one server.

Jobs. pg-boss handles reminders, recurrence, dues, expiry alerts, digests and webhook retries. Each job is stored with a run_at computed in the group's timezone.

Schema. Core tables:

users, sessions (Better Auth)
groups(type, modules text[], currency, parent_id), group_members(role, display_name), invites, group_links
tasks, task_completions, events, event_rsvps(status, waitlist_pos), lists, list_items
expenses(amount_minor bigint), expense_shares, settlements(method, confirmed_at)
polls, poll_options, poll_votes, messages(pinned), activity
push_tokens, notifications, files
Later versions add tables through new drizzle migrations. Never edit an applied migration.

Push. A notifications row → a pg-boss job → expo-server-sdk, sent in chunks of up to 100. Invalid tokens found in the receipts are pruned.

B7. Traps
#	Symptom you'll see	Cause	Fix
1	The route sweep passes, but a member of group A can edit group B's task by sending B's task id	A handler looked up the item by id alone	Filter by id and ctx.groupId. Add a cross-group test per entity: A's member uses B's item id → 404.
2	Splits add up to 99.99 or 100.01	Floating-point money	Integer minor units. Give the leftover units to members in a stable order.
3	A weekly 9 pm event shows at 10 pm after a DST change	Recurrence stored without a timezone	Store an IANA tz and expand the RRULE in that zone
4	Reminders fire at the wrong local hour	pg-boss cron runs in UTC	Give each job a run_at computed in the group's timezone, not a cron expression with no timezone
5	Arabic text is right-aligned, but layout, chevrons and swipes still run left to right	I18nManager.forceRTL only takes effect after a reload; styles use left/right	Reload after a language change. Use start/end everywhere. Flip icons that point a direction.
6	getExpoPushTokenAsync fails in Expo Go on Android	Remote push was removed from Expo Go	Use a dev build (the owner's step); mock it in tests
7	Logged in on web, but 401 or logged out after a restart on a phone	The Better Auth session isn't stored on native	Use the Better Auth Expo plugin with secure storage. List it in the owner's device checks.
8	Two users both get spot #12, or nobody is promoted from the waitlist	Promotion happens in app code, outside a transaction	One transaction with SELECT … FOR UPDATE on the event. Test with two concurrent RSVPs.
9	The same hall is booked twice (v5.3)	Race between two booking requests	An exclusion constraint on the time range if PGlite supports btree_gist, otherwise a row lock on the resource. Concurrency test.
10	A payment is recorded twice	A webhook was delivered twice	Unique constraint on the provider event id; treat a duplicate as success with no change
11	Tests pass but a migration fails on real Postgres	PGlite is missing an extension or behaves differently	Avoid extensions PGlite lacks. If Docker exists, run the suite on real Postgres once per phase.
12	Arabic letters come out disconnected in PDFs	The PDF library can't shape Arabic	HTML → expo-print
13	E2E crashes on import in the web build	Camera, audio, location or notifications APIs are native-only	Guard with Platform.OS checks and give a web fallback (e.g. type the code instead of scanning)
14	A Child account can still reach money data	Only the UI hides it	The permission matrix blocks it on the server. Sweep test as a Child.
15	A removed member still sees the group until restart	Cached queries	Invalidate on a membership change event. The server already returns 404.
16	You redo finished work after a context reset	Lost track of state	docs/PROGRESS.md + git log first, always
B8. Scope ceiling & stop rules
Done means every version in B5 is [x] or [-] (with a reason), and docs/REPORT.md is complete.
Out of scope: everything marked Skip, app store submission, production deployment, real money, a marketing website.
Feature stop rule: if one feature takes more than about a day, or needs a native module outside the Expo SDK, ship its simplest form, write one line in docs/NOTES.md, and move on.
Failure stop rule: after 3 failed fix attempts on the same failing check, mark that feature [-], put the failing output in NOTES.md, mark the test .skip with a comment pointing to that note, and move on. pnpm check must never be left red.
Dependencies: no new dependency without a one-line reason in NOTES.md.
No rewrites: if a later version needs an earlier one changed, make the smallest additive change and keep the earlier tests green.
Contradictions: if this doc contradicts itself or reality, write the evidence in NOTES.md and pick the simpler reading.
Early stop: stop before the end only if a blocker that isn't in B4 makes half or more of the remaining versions unbuildable. Explain why in REPORT.
B9. Acceptance
Global gates for every version:

pnpm check is green (paste the summary into REPORT).
The route sweep returns 404 for a non-member on every group route, including the new ones.
Each new entity has a cross-group test (B7 #1).
Playwright screenshots of the version's new screens in Arabic show no clipped or overlapping text.
Each new test file has been seen to fail once: break one assertion, see red, revert. Note it in REPORT.
v1.0 checks:

#	Must prove	Where
1	100.00 split three ways = 33.34 / 33.33 / 33.33. Equal, exact and shares splits always sum exactly to the total.	money.test.ts
2	A pays 300, split equally across A, B, C → B owes A 100 and C owes A 100. After A confirms B's settlement, B owes 0. An unconfirmed settlement changes nothing.	money.test.ts
3	Simplify-debts produces at most n−1 transfers and keeps every net balance	money.test.ts, random cases
4	Rotation A → B → C → A, skipping members marked away	rotation.test.ts
5	A weekly event in Africa/Cairo stays at 21:00 local time across a DST change	recurrence.test.ts
6	A Member can't change modules (403). Only the Owner can delete the group.	Server tests
7	With capacity 12, the 13th RSVP is waitlisted. When #5 cancels, the waitlisted user becomes Going. Two concurrent RSVPs for the last spot → exactly one gets it.	Server tests
8	A creates a Sport group → shares the code → B joins → A creates a match → B RSVPs → A splits the cost among Going → B's Today shows what B owes	Playwright
9	Arabic mirrors these screens: Today, Group home, Tasks, Expenses, Event	Playwright screenshots
10	Deleting an account removes the profile and memberships. Each owned group passes to its oldest Admin, or is deleted if no one else is in it.	Server tests
11	The push sender sends in chunks of up to 100 and prunes invalid tokens	Unit test with mocked fetch
Later versions: what each must prove:

Version	Must prove
v1.1	A guest link page lets a non-user RSVP, and the RSVP shows in the app. The token only opens its own item (another item id → 404). A revoked token stops working. The ICS feed parses and contains only that user's events.
v1.2	Two concurrent reward redemptions can't take points below 0. A Child gets blocked on every money route (sweep). Fairness meter shares add up to 100%.
v1.3	The team balancer matches a brute-force optimum for 10–16 players. Man-of-the-match allows one vote per player per match. Spaced-repetition intervals are unit-tested. Focus room presence (join/leave) reaches a second socket client.
v1.4	Meal plan → groceries merges the same ingredient and unit. AI endpoints only return drafts; nothing is saved until the user confirms. With the fake model, quick capture can't target a group the user isn't in.
v1.5	Expiry alerts fire exactly once each at 60, 30 and 7 days. A member without folder access gets 404. Med reminders fire in the group's timezone.
v2.0	A trip settles in one currency using each expense's stored rate. Budget alerts fire once at 80% and once at 100%. Guest-list RSVPs count plus-ones.
v2.2	Each member receives the pot exactly once per round. Total paid in equals total paid out each month. A swap needs both members plus the organizer.
v2.4	The 16th member joining a Free group is rejected with an upgrade error. Group Pro lifts the limit. No client route can grant an entitlement.
v2.6	A duplicate webhook produces one payment. A bad signature → 400 and nothing saved. Fees round correctly in minor units. Receipts are generated.
v2.8	A khatma splits 30 parts across N members, and the next round rotates them. Form signatures are stored and displayed.
v3.x	Overlapping shifts for one person are rejected. A shift swap needs manager approval. A QR clock-in token expires within 60 s. A low-stock alert fires once per threshold crossing. Approval limits apply per role. Report totals equal the sum of their rows. Custom roles pass the sweep.
v4.x	A tenant's linked Home group sees only rent due and their own tickets (sweep as the tenant). A late fee applies once per period. Move-in vs move-out is compared room by room. Each checkout creates a turnover task.
v5.x	One vote per unit even with 2 residents. Quorum is respected. Two concurrent bookings for one slot → exactly one succeeds. A visitor pass expires and scans only once. Critical announcements show "acknowledged by X of Y".
v6.0	A vendor sees only jobs sent to them. A rating is only possible after the job is completed.
v6.3	The generated OpenAPI doc validates. An API key works only on its own group (any other → 404). A sample receiver can verify the webhook signature. Failed deliveries retry with backoff, then are marked dead.
v6.6	Installing a gallery template copies config only: no members, items or files.
v6.9	Playwright runs the manager dashboard flows for Business, Property and Community at a wide viewport.
v7.0	With the fake model, assistant tools return only data the user can see. A tool call naming another group's id is denied.
B10. Process
Per version:
Write a short plan (5–15 lines in NOTES.md).
Write the tests first for logic and permissions.
Build.
Run pnpm check.
Take Arabic screenshots.
Do one review pass, max 3 rounds. At the cap, write the leftover issues in NOTES.md and move on.
Update PROGRESS + REPORT.
Commit as vX.Y: <summary> and push.
Never force-push. Never rewrite pushed history.
If you have them, use the skills for plan writing, test-driven development, code review and the Claude API (for the ai module).
At the very end, open a pull request into main (or push the branch and name it in your final message).
B11. Expect this plan to be wrong
This is the first brief for this project, so there's no earlier defect count to carry forward. Watch for these failure shapes:

A "shared" feature that needs per-template behaviour. Solve it with template config, not if (type === …).
A check that needs a device or an account you don't have. Say so; don't fake it.
Later versions forcing a rework of the v1.0 data model. Prefer additive migrations.
Scope quietly growing past B5.
Record every defect you find in this brief in NOTES.md, with evidence.

B12. What to report back (docs/REPORT.md)
Per version: status ([x]/[-]), evidence for each B9 check (command output or screenshot path), and what is faked or skipped.
Owner's device checklist: numbered steps to make a dev build and check on a real phone: login persistence, push, deep links, camera/QR, voice notes, location, RTL.
Accounts and keys needed, in priority order, with the env var each one fills.
Defects or contradictions found in this brief.
Open questions for the owner.
How to run it locally: the exact commands.
