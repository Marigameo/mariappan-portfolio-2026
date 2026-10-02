# The LinkedIn post

Keep it minimal and personal. The post doesn't explain the project. The reel teases it, and the story and blog in the comments do the explaining. The post's only job is to give a human reason to watch the reel and open the comments.

## The two published posts (verbatim)

### Strive AI (first in the series)

```text
This one sat in my drafts for months. Every time I came back, the story had moved on.

It started in September 2025, while generative UI was still taking shape. We were a small team, none of us from AI, trying to rethink UX for agents.

The write-up covers the whole ride: how it started, why we built it from scratch, what broke, what we learned, and where we're headed.

A small teaser to chew on 👀
The detailed story is in the comments 👇
I’d love to hear how you’re tackling similar problems in your own systems.

#generativeui #genui #uxforagents #chatux #designengineering
```

First comment:

```text
📖 The project story, my side of it: https://mariappan.netlify.app/work/strive-gen-ui-chat/

The engineering deep dive: https://mariappan.netlify.app/writing/generative-ui-chat-engine/
```

### Strive Studio (the follow-up)

```text
Another story close to my heart, sitting in my drafts for months. 😅
Last week, I shared how Strive’s GenUI chat system evolved. This is the next evolution of that system.

Strive Studio began with a slightly wild idea from our CTO: what if the agent just wrote the HTML

It’s the kind of work that excites me most as a design engineer, and one that deserves some spotlight on the team behind it. ❤️

𝙏𝙚𝙖𝙨𝙚𝙧 𝙗𝙚𝙡𝙤𝙬 👀 𝙏𝙝𝙚 𝙛𝙪𝙡𝙡 𝙗𝙡𝙤𝙜 𝙖𝙣𝙙 𝙨𝙩𝙤𝙧𝙮 𝙖𝙧𝙚 𝙞𝙣 𝙩𝙝𝙚 𝙘𝙤𝙢𝙢𝙚𝙣𝙩𝙨 👇

#genui #lovableformarketing #generativeui
```

First comment:

```text
Blog: https://mariappan.netlify.app/writing/strive-studio-frontend/

Short Story: https://mariappan.netlify.app/work/report-builder/
```

### Pluggable UI for agents (the prequel, made with this skill)

The user rewrote the draft into this version, so it shows what they edit towards: a hook, a question, the closer from the story, and one honest line that credits the team.

```text
The Strive AI and Studio stories had a prequel. 😅

Who writes the UI for an agent? Since June 2025, our answer kept changing.

We started by making agent UIs cheap to build. We ended up letting the agent build them.

We’ve come a long way from this tooling since, but the journey, and the team who built 13+ agents on it, is what excited me most. ❤️

A small teaser to chew on 👀
The detailed story is in the comments 👇

#uxforagents #designengineering #developerexperience #agentui #plugandplayui
```

First comment:

```text
📖 The project story, my side of it: https://mariappan.netlify.app/work/pluggable-agent-ui/

The engineering deep dive: https://mariappan.netlify.app/writing/agent-ui-evolution/
```

**What the user changed from the drafts.** They kept the hook and the closing line from the story. They swapped the explanation of the scaffold for the blog's question ("Who writes the UI…"), and they added their own feeling about the journey. Prefer **a question and a feeling over a description of the tooling**. When the user leaves a line unfinished, offer several ways to finish it, and don't rewrite the lines around it.

## Anatomy

The body runs **60 to 90 words**, in four or five short blocks with a blank line between them:

1. **A personal hook (one or two lines).** An honest, slightly self-deprecating admission, not a claim. "This one sat in my drafts for months." / "Another story close to my heart, sitting in my drafts for months. 😅" Don't reuse the drafts line a third time. Find this project's own honest feeling, such as how long it took, what surprised you, or why you kept coming back to it.
2. **Where it sits (one or two lines).** For the first post in a series, give when it started and who "we" were: "It started in September 2025… We were a small team, none of us from AI…" For a follow-up, link back: "Last week, I shared how … evolved. This is the next evolution of that system."
3. **The idea in one sentence.** Lift the blog's one-liner or the origin quote, credited by role: "Strive Studio began with a slightly wild idea from our CTO: what if the agent just wrote the HTML?" If there's no quote, say plainly what the write-up covers: "how it started, why we built it from scratch, what broke…"
4. **Why it matters to me, with credit to the team (one line).** "It’s the kind of work that excites me most as a design engineer, and one that deserves some spotlight on the team behind it. ❤️"
5. **The pointer.** The teaser line plus "in the comments 👇". Either use plain text ("A small teaser to chew on 👀 / The detailed story is in the comments 👇"), or set this one line in Unicode sans-serif bold italic (𝙏𝙚𝙖𝙨𝙚𝙧 𝙗𝙚𝙡𝙤𝙬 👀 …) as in the Studio post. Use the styled letters on this line only, since screen readers stumble over them. You can add an optional open question for the reader: "I’d love to hear how you’re tackling similar problems in your own systems."

Then come the **hashtags**: three to five, lowercase and run together. Mix the broad topic tags (`#generativeui #genui #uxforagents #designengineering`) with one playful positioning tag that sums up the project (`#lovableformarketing`).

The **first comment** carries the links, not the post body. Links in the body tend to get less reach, and the post reads cleaner without them. Use one short label per link, and put the story first when it's the lighter read:

- `📖 The project story, my side of it: https://mariappan.netlify.app/work/<slug>/`
- `The engineering deep dive: https://mariappan.netlify.app/writing/<slug>/`, or simply `Blog:` and `Short Story:`

## Voice: what carries over from the site and what changes

Carries over from `share-my-work/references/voice.md`:

- Write in the first person, warm and plain. Put the team first, and use "I" for my own feelings and calls. Credit people by role ("our CTO"), never by name, unless the user says to.
- Never use hype words (leverage, seamless, game-changer, revolutionary) or brag lines ("only engineer", "no designer"). Never add metric flexes.
- Use no em dashes. Use a colon or a full stop instead.
- Use the official capitalisation: Strive AI, Claude, GenUI. Use curly apostrophes (’), as in both posts.
- Never invent facts. Dates, the series link and quotes come from the published pieces or the user.

Differs from the site:

- **Emoji are welcome, used sparingly**: three or four per post, at the ends of lines, from the established set 👀 👇 ❤️ 😅 📖. Never put emoji in the middle of a sentence or use them as bullets.
- **No bold, headings or lists**, only short paragraphs. The one exception is the optional styled teaser line.
- **No lede or `mark`, no "deep dive · ~12 min" labels**, and no section structure.
- **Don't summarise the project.** The architecture, the lessons and the outcome stay in the blog. One idea in the post is enough, and the reel carries the rest.

## Self-check

- [ ] Body is 60 to 90 words, in four or five blocks, and opens with an honest personal line
- [ ] The idea fits in one sentence, credited by role where it came from someone
- [ ] There's a line about the team, with no "only me" framing
- [ ] It says "in the comments 👇", and there are no links in the body
- [ ] Three or four emoji, from the established set, at line ends
- [ ] Three to five lowercase hashtags, including one playful positioning tag
- [ ] A first-comment block with labelled live URLs (check that both pages exist)
- [ ] No em dashes and no hype words, and every fact is traceable to the story, the blog or the user
