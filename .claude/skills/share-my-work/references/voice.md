# Voice, words and punctuation

Every example here is quoted from the published Strive pieces, but the rules apply to any project. Swap in the new project's names and people.

## The voice in one paragraph

Plain, warm, first person, and honest about trade-offs. It reads like an engineer who cares about design telling a friend how something got built: what we tried, why we bet, what broke, and what we'd keep. The team comes first, the design calls are owned personally, and the sentences are short. There's no hype, and no wall of adjectives.

## Who did what: "we" and "I"

- **"We"** covers the work and the outcomes: "We built it as a small team", "We shipped it in September 2025", "We read a lot first."
- **"I"** is for my own calls and my own taste: "I bet on owning it.", "It kept hurting my taste, so I redesigned slots…", "So I named the two apart…", "At first I wrote the whole CSS context myself…"
- **Collaborative framing is required.** Use "I got to play a big part", "I helped carry ideas from use case to production", "with the team". **Never** write "only engineer", "no designer", "sole", "it was all mine" or "no handoffs", and never add a metric tile about headcount.
- **Solo projects are the exception**: when it was just me, say "I" plainly, with no invented "we" and no bragging.
- **Credit people by role, not name**: "our CTO", "our co-founders", "the team". Give thanks in a line of their own: "Thanks to our co-founders for spotting the bet early, backing us to go all in, and never letting us stop poking at what's next."
- **Admit things.** It makes the piece credible:
  - "I'll admit there's still some overlap."
  - "We're not against frameworks. This one just works for us."
  - "We never found convincing enough reasons :)"
  - "That wasn't necessarily a bad design choice."

## Startup pragmatism is a recurring theme

The pieces keep coming back to cost against impact, shipping small, learning in production, and not over-engineering v1:

- "Building at a startup is always cost against impact, so we let people use both…"
- "…balancing implementation cost against impact. We wanted to build something useful, get it into people's hands, and let real usage tell us where it needed to evolve…"
- "Build the foundations with scale in mind, but don't assume the first shape of those foundations has to last forever."
- "This was not a one-day decision."

## Sentences

- **Short.** One idea per sentence. Split long sentences instead of joining them with commas.
- **Setup, then payoff.** "One payload, one parse, one render. Clean." / "So when it needs data, it has to ask." / "It did. Only then did we commit."
- **"So" to pivot** from a problem to the move we made: "So the first job was the words." / "So for reports we dropped schemas…"
- **Concrete over abstract.** Name the actual thing: `<iframe sandbox="allow-scripts">`, "650 lines of CSS", "a missing brace four thousand tokens in", "four KPI cards in a row".
- **Some personality, sparingly**, at most one or two per piece: "slightly wild idea", "a bug tracker written in the imperative mood", "Generative UI has rent, not just a purchase price.", "Let's get cooking!"

## One-liners and pull quotes

Each section earns about one quotable line. It goes in a `<blockquote>` (blog) or a figcaption (either format). Patterns that recur:

- **Contrast pair**: "The report can ask for anything. It can't hold anything." / "Untrusted HTML, trusted data" / "Natural language when the model is communicating. Structured data when the model is composing an interface."
- **Maxim**: "Live should never mean heavy." / "Familiar is a feature." / "Make complexity additive."
- **"Think X, but Y"**: "Think Claude artifacts, but the numbers never go stale."
- **The reframe**: "Read together, those aren't five bugs. They're one: …"
- **Closer**: "Reports were the first place we let the agent write the interface itself. They won't be the last."

Keep blockquotes to one or two sentences, and don't use more than one per h2 section.

## Headlines

Use sentence case. Keep them short, usually 2 to 6 words, and have them state the move or the tension rather than a topic label.

- **X, not Y / X, don't Y**: "Own the chat, don't rent it", "Live, not heavy"
- **Before X**: "Bones before features"
- **Imperative**: "Move the canvas out of the thread", "Let the model write HTML", "Build apart, then fold in"
- **Arc**: "From a stylesheet to a little taste", "From a studio of its own to a skill"
- **Plain and warm**: "A little bit of backstory", "The one-liner", "Where it started to hurt", "What broke at scale", "What I'd keep", "What's next", "Thanks"
- **Talking to yourself**: "What I'd tell day-zero me", "What the first reports taught us"

Avoid labels like "Architecture Overview", "Key Challenges" or "Conclusion", and never use title case.

## Words

**Use**: we, the team, the bet, a call, the one-liner, bones, a little taste, playground, hand-off, fold in, cost against impact, ship small, day zero, v1 / v2, "a story of its own", "deserves its own post, coming soon".

**Cut or replace**:

| Draft word | Published form |
|---|---|
| super / very / really (as intensifiers) | drop it, or at most one per piece ("super mature") |
| `&` in prose | "and". `&` appears only in kickers and figure labels: "Misses &amp; lessons" |
| spin up / wire up / vibe code (casual jargon) | "build", "describe … and get back …". Only "vibe-coded" survives, as a critique |
| leverage, seamless, robust, cutting-edge, revolutionary, game-changer | never |
| utilize | use |
| "we're way ahead of X" brags | state what we did and when, and let the reader compare ("We got here early too.") |
| lowercase product names (claude, strive) | The official capitalisation: Claude, Strive AI, Tailwind, Vercel |

## Punctuation

- **No em dashes (—) in body copy.** Use a comma, a colon, a full stop or brackets instead. The newest piece has zero. The only em dashes allowed are in the `<title>`-style names such as `"Strive AI — generative UI chat"`.
- **Curly quotes and apostrophes**: ’ “ ” and never straight ones in prose. Inside `.astro` text both work, but match the reference piece. The Studio pieces use ’ throughout.
- **Colon to introduce a payoff or a list**: "The price: a separate history." / "Three questions:"
- **Middle dot ` · ` as the separator in labels**: eyebrows ("Strivelabs · Design engineer · 2026 → now"), kickers ("Design call · naming"), figure titles ("Before · everything at once"), facts ("React 19 · TypeScript · sandboxed iframes").
- **Arrow `→`** in ranges and flows: "2024 → now", "tool call → our renderer".
- **Ellipsis**: the single character `…`, as in `report.app.execute(…)` and "…and round again."
- **Date ranges use "to"**, not a dash: "Feb to Mar 2026", "Aug to Sep 2026". Single dates look like "26 Apr 2026" or "6 April 2026".
- **No Oxford comma**: "ad, analytics and CRM data".
- **Tilde for estimates**: "~10 minutes", "~584+ lines".
- **Emoji: none.** One `:)` in a long post is the limit.
- **Exclamation marks** only inside quoted UI copy ("Let's get cooking!").

## Spelling

Use **British English**: behaviour, colour, personalised, customise, catalogue, generalising, realised, favourite.

## Numbers and code

- Give real numbers with units: "650 lines of CSS", "a strict 5 MB limit", "The prompt shrank by 40%".
- Put code, commands, skill names and packages in `<code>`: `/share-insights`, `@strivelabs/ui-core`, `allow-same-origin`.
- A figure of 1 to 9 inside a sentence can be a word ("Five failures", "Three things") or a digit, whichever reads better.

## Bold

- In lists, open each item with a **bold phrase that ends in a full stop**, then give the explanation in plain text: "**Page by page.** Each page loads separately…"
- In paragraphs, bold one key phrase at most: "It remains the largest single structural change…" / "**without** `allow-same-origin`".
- Put `<mark class="hl">…</mark>` around exactly one phrase, in the lede only.

## Self-check before handing over

- [ ] No em dashes in body copy, and no straight quotes in prose
- [ ] British spellings throughout
- [ ] No "&" in prose, no hype words, no more than one "super"
- [ ] Credit goes to the team, and "I" appears only for my own calls
- [ ] Every number, date, quote and name comes from the draft, and missing facts are marked `TODO:`
- [ ] Headlines are sentence case and state a move, not a topic
- [ ] About one quotable line per section, and no more than one blockquote per section
- [ ] Each list item opens with a bold phrase ending in a full stop
- [ ] There's one `mark.hl`, and it's in the lede
