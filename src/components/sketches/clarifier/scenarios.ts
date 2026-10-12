/* Questionnaires for the agent-clarifier playground, trimmed from the component's own
   demo (agent-clarifier/demo/scenarios.ts). Each is one case worth trying, with the
   chat around it and a line on what to look at. Ids double as the story's "Try it"
   targets (data-try="multi" and so on). */

type Option = { id: string; label: string; description?: string; recommended?: boolean; compose?: string };
type Question = {
  id: string;
  label?: string;
  prompt: string;
  description?: string;
  type: 'single' | 'multi' | 'text';
  options?: Option[];
  required?: boolean;
  delegate?: boolean;
  other?: boolean;
  max?: number;
};
export type Questionnaire = { id: string; source?: string; title?: string; delegate?: boolean; flow?: 'sequential' | 'all'; questions: Question[] };

export interface Scenario {
  id: string;
  name: string;
  /** The heading it's listed under in the playground. */
  group: 'Everyday' | 'Ways out' | 'Edge cases';
  /** What to look at. */
  note: string;
  user: string;
  agent: string;
  q: Questionnaire;
  lang?: string;
  stream?: boolean;
  labels?: Record<string, string>;
}

const HOTEL: Questionnaire = {
  id: 'hotel',
  source: 'Trip planner',
  questions: [
    {
      id: 'area', label: 'Area', prompt: 'Which area would you like to stay in?', type: 'single',
      options: [
        { id: 'covent', label: 'Covent Garden', description: 'Theatres, restaurants, busy at night', recommended: true },
        { id: 'southbank', label: 'South Bank', description: 'River views, galleries, quieter' },
        { id: 'kensington', label: 'Kensington', description: 'Museums and parks, residential' },
      ],
    },
    {
      id: 'budget', label: 'Budget', prompt: 'What’s your budget per night?', description: 'Before taxes, for one room.', type: 'single', delegate: true,
      options: [
        { id: 'low', label: '$250–400', description: 'Boutique stays in central areas' },
        { id: 'mid', label: '$400–600', description: 'Upscale, 4–5 star' },
        { id: 'high', label: '$600+', description: 'Luxury and landmark hotels' },
      ],
    },
    {
      id: 'extras', label: 'Priorities', prompt: 'What matters most in the hotel?', description: 'Pick up to 2.', type: 'multi', max: 2,
      options: [
        { id: 'walk', label: 'Walkable to sights' },
        { id: 'quiet', label: 'Quiet at night' },
        { id: 'gym', label: 'Gym or pool' },
        { id: 'breakfast', label: 'Breakfast included' },
      ],
    },
    { id: 'notes', label: 'Notes', prompt: 'Anything else I should know?', description: 'Optional. Accessibility needs, a special occasion…', type: 'text' },
  ],
};

export const SCENARIOS: Scenario[] = [
  {
    id: 'hotel',
    group: 'Everyday',
    name: 'Hotels in London',
    note: 'The everyday case. Press 1–3 to pick, ↑↓ to move, ← to go back, Esc to fold it away. Budget offers Decide for me, and Priorities stops at 2.',
    user: 'I’m planning a trip to London, can you give me some hotel recommendations?',
    agent: 'Happy to. A few quick questions first, so I search for the right places.',
    q: HOTEL,
  },
  {
    id: 'yesno',
    group: 'Everyday',
    name: 'Yes or no',
    note: 'Just a two-option single, not a new type. One question, so no review step.',
    user: 'Plan a weekend in Lisbon for me.',
    agent: 'One thing before I start.',
    q: {
      id: 'yesno',
      questions: [{
        id: 'flights', prompt: 'Should I include flights in the plan?', type: 'single', other: false,
        options: [{ id: 'yes', label: 'Yes, find flights too', recommended: true }, { id: 'no', label: 'No, I’ve booked them' }],
      }],
    },
  },
  {
    id: 'multi',
    group: 'Everyday',
    name: 'Pick limits',
    note: 'Pick up to 3. A fourth pick is refused by a quiet notice, not a warning. Multi-select never moves on by itself: Enter continues.',
    user: 'Find me a restaurant for Friday.',
    agent: 'Let me narrow it down.',
    q: {
      id: 'multi',
      questions: [
        {
          id: 'cuisine', label: 'Cuisine', prompt: 'Which cuisines are you in the mood for?', description: 'Pick up to 3.', type: 'multi', max: 3,
          options: ['Italian', 'Japanese', 'Indian', 'Mexican', 'Thai', 'French', 'Lebanese'].map((label) => ({ id: label.toLowerCase(), label })),
        },
        { id: 'size', label: 'Party size', prompt: 'How many people?', type: 'single', options: [1, 2, 3, 4, 5].map((n) => ({ id: String(n), label: n === 5 ? '5 or more' : String(n) })) },
      ],
    },
  },
  {
    id: 'delegate',
    group: 'Ways out',
    name: 'Decide for me',
    note: 'Decide for me takes Skip’s place, so there’s still one way out. The agent hears “say what you chose”, not “say what you assumed”.',
    user: 'Write a launch post for our new app.',
    agent: 'A few choices first. You can leave any of them to me.',
    q: {
      id: 'delegate',
      delegate: true,
      questions: [
        { id: 'tone', label: 'Tone', prompt: 'What tone should it have?', type: 'single', options: [{ id: 'warm', label: 'Warm and personal' }, { id: 'crisp', label: 'Crisp and factual' }, { id: 'playful', label: 'Playful' }] },
        { id: 'channels', label: 'Channels', prompt: 'Where will it be posted?', type: 'multi', options: [{ id: 'x', label: 'X' }, { id: 'li', label: 'LinkedIn' }, { id: 'blog', label: 'Blog' }] },
        { id: 'cta', label: 'Call to action', prompt: 'What should readers do at the end?', type: 'text' },
      ],
    },
  },
  {
    id: 'required',
    group: 'Ways out',
    name: 'Required',
    note: 'The first question is required, so it has no Skip. The note after it is optional.',
    user: 'Move $500 to savings.',
    agent: 'I need one detail before I do that.',
    q: {
      id: 'required',
      source: 'Banking assistant',
      questions: [
        {
          id: 'account', label: 'From', prompt: 'Which account should I move it from?', type: 'single', required: true, other: false,
          options: [
            { id: 'current', label: 'Current account', description: '•••• 4821 · $2,340 available' },
            { id: 'joint', label: 'Joint account', description: '•••• 1177 · $890 available' },
          ],
        },
        { id: 'memo', label: 'Note', prompt: 'Add a note to the transfer?', description: 'Optional.', type: 'text' },
      ],
    },
  },
  {
    id: 'compose',
    group: 'Ways out',
    name: 'Write it yourself',
    note: 'Some answers are better written than picked. “I’ll explain” folds the card and starts the sentence in the message box.',
    user: 'Book me a table for Saturday.',
    agent: 'Quick question.',
    q: {
      id: 'compose',
      questions: [{
        id: 'access', label: 'Access', prompt: 'Any accessibility needs I should mention?', type: 'single', other: false,
        options: [
          { id: 'none', label: 'None' },
          { id: 'step', label: 'Step-free access' },
          { id: 'explain', label: 'I’ll explain', compose: 'For accessibility, I need ' },
        ],
      }],
    },
  },
  {
    id: 'long',
    group: 'Edge cases',
    name: 'Long content',
    note: 'Nothing you decide on is cut off. The card caps its height, the questions scroll, and a tall header scrolls away instead of pinning.',
    user: 'Help me migrate our analytics to the new warehouse.',
    agent: 'This one has real trade-offs, so I want to get it right.',
    q: {
      id: 'long',
      source: 'Data migration assistant (MCP: warehouse-tools)',
      questions: [{
        id: 'strategy', label: 'Migration strategy',
        prompt: 'Your current pipeline writes about 40 million events a day into the legacy cluster, and three dashboards depend on tables that will be renamed in the new warehouse. How should I handle the cut-over so that nobody loses data or sees broken charts during the switch?',
        description: 'This decides the order of the next steps, and some choices are hard to undo once the backfill starts.',
        type: 'single',
        options: [
          { id: 'dual', label: 'Dual-write for two weeks, then switch', description: 'Safest. Both systems receive every event, and dashboards move over one at a time once the numbers match.', recommended: true },
          { id: 'backfill', label: 'Backfill history first, then switch in one go', description: 'Faster overall, but there is a window of a few hours where the newest events only exist in the old cluster.' },
          { id: 'shadow', label: 'Shadow-read from the new warehouse', description: 'Queries run against both and results are compared automatically before anyone sees them.' },
          { id: 'freeze', label: 'Freeze dashboards over a weekend' },
          { id: 'url', label: 'Follow https://wiki.example.com/data-platform/migrations/warehouse-v2/cutover-runbook-final-FINAL' },
          { id: 'partial', label: 'Move only the three critical dashboards now', description: 'Everything else stays on the legacy cluster until the next quarter.' },
          { id: 'later', label: 'Not now, revisit next month' },
        ],
      }],
    },
  },
  {
    id: 'arabic',
    group: 'Edge cases',
    name: 'Arabic · RTL',
    note: 'The layout, arrows and Back key mirror, and ar-EG shows Arabic-Indic digits. The labels are a sample translation, still waiting for a native speaker’s review.',
    labels: {
      askedBy: 'يسأل {source}', somethingElse: 'شيء آخر', decideForMe: 'قرِّر عنّي', delegated: 'متروك للمساعد', skip: 'تخطٍّ',
      continue: 'متابعة', review: 'مراجعة', send: 'إرسال', sendAnswers: 'إرسال الإجابات', startOver: 'البدء من جديد', edit: 'تعديل',
      back: 'رجوع', minimise: 'تصغير', reopen: 'إعادة الفتح', undo: 'تراجع', recommended: 'مُوصى به', stepOf: '{n} من {total}',
      answeredOf: 'تمت الإجابة على {n} من {total}', checkAnswers: 'راجِع إجاباتك', composerPlaceholder: 'أو اكتب ردّك بكلماتك…',
      youAnswered: 'أجبت على {n} من {total}', editAnswers: 'تعديل الإجابات',
    },
    user: 'أريد حجز فندق في القاهرة',
    agent: 'بكل سرور. سؤالان سريعان أولاً.',
    lang: 'ar-EG',
    q: {
      id: 'arabic',
      source: 'مخطط الرحلات',
      questions: [
        {
          id: 'area', label: 'المنطقة', prompt: 'في أي منطقة تفضّل الإقامة؟', type: 'single',
          options: [
            { id: 'zamalek', label: 'الزمالك', description: 'هادئة وقريبة من النيل', recommended: true },
            { id: 'downtown', label: 'وسط البلد', description: 'مزدحمة وقريبة من المتاحف' },
            { id: 'giza', label: 'الجيزة', description: 'إطلالة على الأهرامات' },
          ],
        },
        { id: 'nights', label: 'الليالي', prompt: 'كم ليلة ستقيم؟', type: 'single', options: [{ id: '2', label: 'ليلتان' }, { id: '3', label: 'ثلاث ليالٍ' }, { id: '5', label: 'خمس ليالٍ أو أكثر' }] },
      ],
    },
  },
  {
    id: 'stream',
    group: 'Edge cases',
    name: 'Streaming in',
    note: 'The questions arrive piece by piece, as a model writes them. What has arrived shows, and nothing can be picked until it’s complete.',
    user: 'Plan my team offsite.',
    agent: 'Let me ask a few things.',
    q: { ...HOTEL, id: 'stream' },
    stream: true,
  },
];
