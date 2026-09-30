# Draft to final: the Strive Studio example

`context.md` (repo root) is the raw draft behind `src/pages/work/report-builder.astro` and `src/pages/writing/strive-studio-frontend.astro`. Here's how its lines turned into published copy. Apply the same moves to a new draft.

| Draft (context.md) | Published | The move |
|---|---|---|
| "It's more like a lovable for marketing harness or claude artifacts that are live & personalised" | "Think Lovable for marketing, or Claude artifacts whose numbers never go stale." | Capitalise names, turn "&" into a sentence, and use the **"Think X, but Y"** pattern that shows the difference |
| "we should simply let models spin up with things that are already super popular in internet … HTML is something agents are already super proficient on, can't make mistakes. Probably we should let agents spin up HTML reports, why not?" | Quote bubble: "What if we just let the agent write the code, instead of struggling with schemas and teaching it to make sense of them?" and in the blog: "Our CTO had been saying it from the start: leave the agent with what it already knows, and what's already all over the internet." | Give the idea to the CTO, make it a single question, drop the "super"s and the overclaim ("can't make mistakes") |
| "So it's not like controlled output vs agent wiring up own UI. It's controlled outputs & agent spinning up UI for everything else" | The `TwoKindsOfUI` fork figure, captioned "Controlled output and agent-written UI, side by side." | When the draft says "not X vs Y, it's both", **draw the fork** |
| "Reports are one such a wonderful case where JSON schemas would not be a great fit. It involves lots of data points & schemas can get super complex" | "**Some reports can't be written as JSON.** Multi-dimensional, multi-page reports need schemas that no model follows reliably." | Turn a vague opinion into a bold claim plus one concrete reason |
| "we're actually super early to artifacts & little more advanced as we didn't aim for static artifacts only" | (cut from the Studio pieces; the gen-UI blog has "We got here early too.") | **Cut the brag.** At most, state it flatly once |
| "Initially we spinned up a dedicted chat for teh report builder. The idea is not to bloat the main chat system prompt" | "**v1 was its own chat**, to keep report rules out of the main prompt and experiment undisturbed." | Fix typos, lead with a bold version label, keep the reason in the same sentence |
| "Limitation we were happy to live with for a short time: As this was a separate chat, the history remained separate." | "The price: a separate history." (story) / "The trade-off we were happy to live with for a while: a separate agent meant a separate history." (blog) | The colon payoff. The story gets the three-word version and the blog the full sentence |
| "we already knew this is supposed to be a chat skill rather than a standalone entity" | "We always knew it was meant to be a skill, at least from the user's side, so once it was stable we folded it in. One chat, one history." | End on a short parallel phrase |
| Section headings: "How it started?", "Good first version:", "Unifying with core chat system" | "A little bit of backstory", "Build apart, then fold in", "From a studio of its own to a skill" | Headlines that state the move, in sentence case, with no question marks or colons |
| "What else can be added? iframe communication, design context, security, error handling" | Became their own sections: "Hosting a page we didn't write", "Design context: from a stylesheet to a little taste", "The small things that make it feel native" | Open questions in the draft become sections. Ask the user for the facts they need, don't invent them |

## Facts the draft didn't have

The published pieces added dates (26 Apr 2026 and so on), "650 lines of CSS", "a strict 5 MB limit" and the sandbox details. Those came from the user and the codebase, **not from invention**. For a new draft, mark gaps like these with `TODO:` and ask.

## What stayed the same

The substance and the order of events stayed, and so did the CTO's idea, the honest limitation and the "skill, not a standalone entity" conclusion. Only the words, the shape and the pictures changed.
