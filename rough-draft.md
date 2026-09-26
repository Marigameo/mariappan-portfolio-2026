# Strive Studio: building the frontend for agent-written dashboards

> Working title alternatives: "Why our reports are just HTML" · "Putting untrusted HTML inside a product UI" · "From JSON blocks to live HTML: the frontend story"

**One-line pitch:** Strive Studio lets you describe a marketing report in chat and get back a live, personalised dashboard wired to your own ad and CRM data. Think Lovable for a marketing harness, or Claude artifacts whose numbers never go stale.

**Angle of this post:** the frontend side. How we render HTML the agent wrote inside the product, give it live data without giving it the session, pass it our design context, and make building a report in chat feel native.

---

## 0. Cold open (pick one)

- The moment: someone types "weekly Google Ads recap with a CPL trend and top 5 wasted keywords", and ~a minute later a dashboard is running live queries against their account, right next to the chat.
- Or the CTO quote as the hook: *"Let models build with what's already all over the internet. HTML is what agents are best at, so why not let them write the report?"*

`[GIF: prompt → first render → edit → export]`

---

## 1. Where we were before (Feb – Mar 2026)

- A strong **generative-UI chat engine** backed by an AI-centred **component registry** (link the Strive AI post).
- Reports were **JSON block documents** rendered by our own block renderers: page groups, keyword time-travel, pinned datatable columns, plan cards.
- Owning the registry gave us consistent output, but every new visual meant a new block type, schema, and renderer.
- Reports carry a lot of data points, so schemas get complicated fast, and the UI could only be as good as our registry.

`[Screenshot: a JSON-block report]`

---

## 2. The shift: controlled output *and* agent-authored UI

- This wasn't a switch from one to the other. Controlled components stay where consistency matters (chat cards, forms, approvals). **The agent writes the UI for open-ended surfaces like reports.**
- Models have seen millions of dashboards, and HTML/CSS/JS is where they make the fewest mistakes.
- **For the frontend, this changes the job:** instead of rendering *our* components, we need to host *someone else's* page safely and still make it feel like part of the product.

---

## 3. Hosting HTML the agent wrote (Apr 26 – 29)

*Commits: `fb42bf07d` html report rendering · `b3ad29c76` SDK split out · `3711f6234` app-action interface · `1fac2e8d7` chat support*

### 3a. The sandbox
- `<iframe sandbox="allow-scripts">`, with **no `allow-same-origin`**.
- The report gets an **opaque origin** (`"null"`). It can't read our cookies, localStorage, or DOM, and can't call our API directly.
- The report is a **static file, and the data is fetched live when someone views it.** We store no snapshot, so the numbers are always current. That's the difference from static artifacts.

### 3b. The postMessage bridge (`useHtmlReportBridge`)
- A small RPC over `postMessage`: typed request messages, each carrying a `requestId` that its response echoes back.
- **Three checks before acting on any message:** `event.source === iframe.contentWindow`, `event.origin === "null"`, and a type-guard on the message shape. Anything else is ignored.
- The host makes the API call **with the user's session** and posts the result back. Replies use target origin `*`, because an opaque origin can't be targeted any other way. The payload is only ever the answer to that report's own request.
- **The host resolves credentials, never the iframe.** The report asks for `google_ads`, and the host chooses the connected credential, including the `google_ads` vs `google_ads_dataset` fallback.
- **Every `app.execute` from a report is sent as `read_only: true`.** A report runs unattended when someone views it, so it should never be able to write.

### 3c. The Report SDK (`strivelabs-report-sdk.js`)
- Pulled out of the first report so any HTML file gets a simple API:
  - `dataset.query(sql)` · `app.execute(app, action, payload)` · `report.export()`
  - Later additions by teammates: `prism.*` semantic layer and `dataset.syncStatus / triggerSync` (Aadharsh)
- Promise-based: the SDK keeps a map of pending requests, and one list of response types decides which messages it accepts.
- It's a plain script the page loads, not a bundle compiled into the report, so fixes ship to every report without regenerating any HTML.

### 3d. Report → chat
- "Ask about this" inside a report calls `STRIVELABS_CHAT_TRIGGER`. The host starts a chat, prefixes the message with the report title, and injects `source_report` context (the iframe can't see the URL or insight metadata).
- Order matters: **start the workflow, reply to the iframe, *then* navigate.** Navigating unmounts the iframe, so the reply has to go out first.
- Shared `chatHandoff` util, reused later by the inbox card → chat flow.

> Credit: the first live report (Google Ads + HubSpot + Calendly, on live BigQuery) was wired up with **Aadharsh**.

`[Diagram: sequence — report iframe → postMessage → bridge (3 checks) → API with session → result → iframe]`

---

## 4. Sharing design context with the agent (May 15 – 20)

*Commits: `98de26463` skill + design-system CSS · `31a673326` frontend design aspects · `ea9e49d56` Tailwind context · `3d8834790` multi-page + edit_file*

*Keep this at the "default theme" level. Per-tenant brand kits are the next post.*

We don't want the agent memorising our brand. We split what it needs into **the shell, the tokens, and the taste**:

1. **A fixed HTML shell, owned by the client** (`NEW_REPORT_HTML_TEMPLATE`)
   - The report is created with this scaffold *before* the agent's first turn, so its first `read_file` finds a real file.
   - Required `<head>` scripts in a set order: Tailwind Play CDN → theme → Chart.js → Lucide → SDK.
   - The template lives in the client, so changing the shell doesn't touch the server.
2. **Tokens in a script, not only in the prompt**
   - v1: a 650-line `strivelabs-report-design-system.css` with component classes.
   - v2: **`strivelabs-report-theme.js`** sets `tailwind.config` (the `brand` color family, Inter) and `--brand` CSS variables that Chart.js reads with `getComputedStyle` at chart init.
   - Why the switch: models already write Tailwind fluently, so we only *extend* it rather than teach a custom class vocabulary.
3. **Taste in the skill** (`report-builder.ts`)
   - Aesthetic reference: Linear / Vercel / Stripe / Notion. Restraint over decoration.
   - **Brand orange gets exactly four slots per report** (hero accent, primary CTA/active state, dominant series, one anchor).
   - `tabular-nums`, right-aligned numbers, and every delta gets an arrow and a semantic colour.
   - **Archetypes** (one-pager, tabbed, long-form, spotlight): pick one, don't blend.
   - **KPI emphasis recipes**, because "a row of four identical cards is the #1 AI-dashboard tell."
   - A metric-to-colour map (the same metric has the same colour everywhere), plus a reference exemplar report.
4. **Iframe layout rules**
   - `h-full` on `<html>` and `min-h-0` on flex children, or the inner scroll never engages.
   - The sidebar becomes a segmented control below `lg`. Test at 640 / 960 / 1280, because the canvas gets narrow with chat open.

> Teaser: *"The theme is swappable per tenant, but that's the next post."*

`[Diagram: shell / theme tokens / skill taste → agent → report]`

---

## 5. v1: a dedicated Report Studio (May 15 → Jun)

*Commits: `eaaf06bca` studio UI + sandbox sync · `129c7e5f8` update & sync · `62ee94fd2` gated to specific users*

- **A separate chat, on purpose:** it kept the report guidelines out of the main chat's system prompt and let us experiment without touching core chat. It was built to be merged in later.
- Layout: chat on the left, canvas on the right with **Preview / Code** tabs (syntax-highlighted source, copy button), a splash state, and a breadcrumb.
- The editing loop: the agent edits the file, and the canvas refetches after each tool turn.
- Rolled out behind a flag, CTA included, to selected users.
- **The trade-off we accepted:** separate agent, separate history. Report conversations didn't show up in the main chat.

> Credit: **Satwik** bootstrapped the report-builder agent with the GSC dataset and early query validation.

`[Screenshot: original Report Studio split view]`

---

## 6. v2: folding Studio into the main chat (Jun 11)

*Commits: `ad67eb509` report studio → global chat · `ef1757638` review follow-ups · `a54111234` slot fixes*

- We always meant for this to be a **skill, not a separate product**, at least from the user's side. We deleted `ReportStudio.tsx` and the separate agent: one chat, one history.

### 6a. The report canvas as a slot
- `ReportCanvasSlot` plugs into the existing **slot canvas**, the same floating card other chat panels use.
- It's **driven by the page, not the agent**: the page mounts it as soon as the thread has a report, rather than waiting for the agent to emit something. It opens immediately, even while history is still loading (`ignoreSuppressAutoOpen`).
- Reopening goes through the existing **SlotNavigator** rail, not a new one-off button.

### 6b. Keeping `<Chat/>` generic
- `<Chat/>` has **no report imports**. It exposes generic hooks, and the page composes them:
  - `canvasSlot`: whatever panel the page wants beside the chat
  - `onTriggerWorkflow(payload, meta)`: adjust the payload of a new thread
  - `onBeforeSend`: an awaited step before the prompt goes out (throwing aborts the send)
  - `chatColumnHeader`: the breadcrumb moves into the chat column so the canvas gets full height

### 6c. Four ways in, one flow
- Reports → Create · "Customize in Studio" · the `/report_builder` badge in any chat · reopening a thread that already has a report.
- Mid-thread `/report_builder`: `onBeforeSend` creates the scaffold and attaches it to the thread, and only then sends the message. The agent's first `read_file` can't hit a missing file.
- Before the prompt, the client sends `source_report { insight_id, display_name, url }` so the agent knows which report it's editing.

`[Diagram: the 4 entry points converging on one thread + canvas slot]`
`[Screenshot: unified chat + report canvas]`

---

## 7. Canvas UX details

- **No splash flicker on edits:** a `hasEverLoadedHtml` latch means that after each tool turn the iframe `srcDoc` swaps quietly instead of going back to a loading screen.
- **Staged splash** (fetching → loading → ready) on first load only.
- **"Report not found"** only after the query has actually resolved, so a temporary network error doesn't look like a deleted report.
- **Workspace-style empty state:** "Let's get cooking!" and "Ask about this report or describe an edit…", so the thread reads as an editing workspace, not a new chat.
- **Titles** come from the prompt (trimmed to the chat-title length), with rename/delete on the report card and in the viewer.
- **Starter prompts fill the composer** instead of sending right away, so the user stays in control.
- Analytics on create / rename / delete / export.

---

## 8. PDF export from a sandboxed page (Jul 20)

*Commits: `3333d2ff5` export · `cd06b7d76` adversarial review · `74d6df436` multi-page fix*

- The problem: the parent can't read a sandboxed iframe's DOM. **Only the report can snapshot itself.**
- Flow: toolbar Export → host posts `REPORT_EXPORT_TRIGGER` → the SDK serialises its own DOM → the host sends it to the PDF renderer.
- **Tabbed reports:** the SDK reveals every panel and stacks them into pages. Authors mark chrome with `data-export-exclude` and pages with `data-export-page`, and charts render up front with `animation: false` so hidden panels come out fully drawn.
- **Edge cases handled:**
  - A 5 MB cap measured in UTF-8 bytes, not string length, which gives a clear error instead of an opaque Lambda failure.
  - A 10 s timeout, and **late snapshots are dropped** so nobody gets a surprise download after already seeing an error.
  - The export action is fixed on the host side. The iframe supplies only HTML, so export can't be used to run arbitrary actions.

> Credit: **Arunkumar** made Export wait until the report's data had loaded (the SDK sends busy/idle messages, and an 8 s fallback covers older cached SDKs).

`[Screenshot: tabbed report → multi-page PDF]`

---

## 9. White-label domains (Jul 1)

*Commit: `1a3cbd2eb` brand-agnostic html_url*

- Bug: on a brand domain, the full-page viewer's iframe loaded a URL built from one global base URL. That made the request cross-origin, so no cookie was sent → 401.
- Fix: the server returns a **relative** `html_url`, and the client rewrites the origin onto the current brand's API (`rewriteUrlOrigin`). Any brand in `DOMAIN_CONFIGS` works automatically.
- The in-chat preview was never affected because it uses in-memory `srcDoc`, which is one more reason to prefer `srcDoc`.

---

## 10. The backend foundations underneath (keep short)

*The frontend relies on these. Enough detail to explain the diagrams, and no more.*

- **The report is a file:** `/reports/<insight_id>/index.html` in the tenant's sandbox. The agent's `update_file` / `edit_file` also copies it to the stored insight, so the client only has to refetch.
- **The thread is linked to the report:** a `workflow_execution_resource` (INSIGHT) row, written to the sandbox *inside* the create/attach request, which is what makes the await-before-send guarantee work.
- **Skill loading:** `/report_builder` pulls the skill in with `get_skill`. The app-catalogue tools for live actions attach only to threads that have a report (I scoped these after they led plain chats astray).
- **Read-only enforced on both sides:** the bridge marks calls `read_only`, and the backend refuses writes.
- **Trustworthy numbers:** **Jahirbasha** added a server-side dry run of report SQL before saving, the "fail visibly, never show ₹0" rules, and writing reports in slices. **Aadharsh** added the Prism semantic layer.
- **CSP on HTML routes:** `Content-Security-Policy: sandbox allow-scripts` on routes serving agent-written HTML (Jahirbasha, alongside chat artifacts).

---

## 11. The slot pattern spread

- The report canvas was the first **page-driven slot**. The same shape now powers:
  - the inbox card → **briefing panel** (Jul 6)
  - the **routine preview panel** (Jul 31)
  - **task details** in chat (Sep)
  - **chat artifacts**, the general version of "the agent writes HTML, a sandbox runs it" (Jahirbasha, Sep 8)
- Having one panel frame and one navigator rail meant new canvases cost very little.

---

## 12. Frontend lessons

- **Treat agent HTML as untrusted by default.** Opaque origin, credentials held by the host, read-only actions, and three checks on every message.
- **Keep the chat generic.** Slots and lifecycle hooks, with no feature imports in `<Chat/>`. That's what made merging Studio in cheap.
- **Put design context in code, not only the prompt.** Tokens in a script are hard to get wrong, and taste goes in the skill.
- **Build separately, then merge in.** The standalone studio was a deliberate step.
- **Only the iframe can see its own DOM.** Design features like export around what the sandbox allows.

---

## 13. What's next

- Per-tenant brand kits (→ next post)
- Streaming HTML into the canvas while the agent edits (today: refetch after each tool turn)
- Revision history / diffs
- Multi-user editing

---

## Credits

Frontend, SDK, design context, Studio → chat integration, and export by me, with:
- **Aadharsh**: first live-data report wiring, dataset sync/refresh, Prism semantic layer
- **Satwik**: report-builder agent bootstrap, early query validation
- **Jahirbasha**: report data-correctness (SQL dry run, fail-visibly rules), report routing, chat artifacts + CSP
- **Arunkumar**: export readiness gating
- **Raghu**: HTML insight API spec

---

### Asset checklist
- [ ] Before/after: JSON block report vs HTML report
- [ ] Sequence diagram: postMessage bridge
- [ ] Layer diagram: shell / theme / skill
- [ ] Studio v1 split view
- [ ] Entry-points diagram → one thread + canvas slot
- [ ] Unified chat + canvas (Preview / Code tabs)
- [ ] Tabbed report → multi-page PDF
- [ ] Timeline graphic
- [ ] GIF: prompt → first render → edit → export

### Timeline cheat-sheet
| Date | Milestone |
|---|---|
| Feb–Mar 2026 | JSON block reports |
| Apr 26 | HTML rendering in a sandboxed iframe + postMessage bridge |
| Apr 27 | Report SDK split out; `app.execute` |
| Apr 29 | Report → chat handoff |
| May 15 | Report Studio (separate chat) + skill + design-system CSS |
| May 19–20 | Frontend design rules in skill; Tailwind theme script |
| May 21 | Gated rollout |
| Jun 11 | Studio folded into main chat: skill + canvas slot |
| Jul 1 | White-label-safe report URLs |
| Jul 2 | Live tool calls; read-only guard; rename/delete |
| Jul 20–21 | PDF export (+ readiness gating) |
| Aug 11 | Per-tenant brand kit (separate post) |
| Sep 8 | Chat artifacts generalise the pattern |
