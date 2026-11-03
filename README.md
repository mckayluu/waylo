# Waylo

Website chat that turns visitor conversations into sales signals. Lean MVP (v0).

## Run
```bash
npm install
npm run dev        # http://localhost:3000
# production: npm run build && npm start
```

## Routes
| Route | What |
|---|---|
| `/` | Marketing home: hero, features, how it works, pricing, FAQ |
| `/pricing` | Full pricing page + plan comparison (early access; Request access via email) |
| `/terms` | Terms of Service (template) |
| `/privacy` | Privacy Policy (transcripts, `waylo_vid`, subprocessors, retention) |
| `/demo` | Fake customer site with the docked sidebar embedded |
| `/widget` | Full-height sidebar: **AI Chat** tab (markdown answers, numbered source chips, 👍/👎, ⋮ Clear history) + **Contact** tab (name/email/message, consent, Leave a message / Book a demo) |
| `/docs/[slug]` | Mock knowledge pages that citation chips link to |
| `/admin` | Dashboard: stats, conversation list, signals |
| `/admin/c/[id]` | Transcript (with sources + feedback), visitor info, signal tags |
| `/admin/guidance` | Facts (authoritative statements), Rules (guardrails), Skills (intent playbooks) — injected into every chat |
| `GET/POST/DELETE /api/guidance` | `POST {kind:"facts"\|"rules", text}` or `{kind:"skills", name, instructions}`; `DELETE ?kind=&id=` |
| `/admin/leads` | Leads from the Contact tab |
| `/admin/settings` | Branding (bot name, accent color, greeting) + embed snippet |
| `POST /api/chat` | `{conversationId?, text}` → `{conversationId, messageId, reply, citations: {title,url}[]}` |
| `POST /api/feedback` | `{conversationId, messageId, feedback: "up"\|"down"\|null}` |
| `POST /api/leads` / `GET` | `{name, email, message, consent: true, intent: "message"\|"demo", conversationId?}` |
| `GET/PUT /api/branding` | `{botName, accent, greeting}` |
| `PATCH /api/conversations/[id]` | `{signals: string[]}` |

Embed snippet:
```html
<script src="https://YOUR-DOMAIN/waylo.js" data-sidebar="true" async></script>
<!-- or iframe only (no tracking): <iframe src="https://YOUR-DOMAIN/widget" ...> -->
```

## Env vars (copy `.env.example` to `.env.local`)
- `OPENAI_API_KEY` — optional. Without it, a built-in mock responder answers with template replies.
- `OPENAI_MODEL` — default `gpt-4o-mini`.
- `WAYLO_DATA_FILE` — default `./data/db.json`.

## What v0 includes
- Local JSON file store (`src/lib/store.ts`) — no database to install.
- Keyword signal detection (`src/lib/signals.ts`): pricing, demo, ready-to-buy, enterprise, integration, support, and auto `high-intent`. Also infers visitor type and captures name/email from chat text.
- Mock or OpenAI responder (`src/lib/ai.ts`), grounded in the mock knowledge base `src/lib/knowledge.ts`; returns 1–3 citations. OpenAI is told to end with `SOURCES: n,n` which is parsed into chips.
- Design: Waylo's own look — warm stone neutrals, deep teal accent (configurable), underline tabs, accent-rule answer blocks.
- CRM extension point (`src/lib/crm.ts`) — not connected to anything.

Guidance in the mock responder: facts sharing a keyword with the question lead the answer; a rule containing "never/don't … pricing" suppresses pricing content; a skill whose name shares a word with the question appends its instructions. With OpenAI, all guidance goes into the system prompt. `/admin` shows a read-only setup checklist.

## Auth, members, audiences (Phase 4)
- **Admin auth:** set `WAYLO_ADMIN_PASSWORD` (optionally `WAYLO_ADMIN_EMAIL`, `WAYLO_SESSION_SECRET`). `src/middleware.ts` then guards `/admin/*` (redirect to `/admin/login`) and all admin APIs (401/403). Public: `POST /api/chat|track|feedback|handoff|leads`, `GET /api/branding`. Session = HMAC-signed httpOnly cookie (14 days). Without a password admin stays open and shows an amber banner. Login is rate-limited (5 fails → 1 min).
- **Roles:** Viewer = read-only; Editor = edit content/guidance/settings/crawl; Owner = also members, integrations, any `DELETE`.
- **Members** (`/admin/members`): Owners invite by email + role → copyable invite link `/admin/invite/<token>` (no email sent yet). The invitee sets a password (scrypt-hashed) and is signed in; later they log in with email + password. Change role / remove. API: `GET/POST/PATCH/DELETE /api/members`.
- **Audiences** (`/admin/audiences`): name + match all/any + rules on signal, visited path, referrer, pageviews (≥/=), visitor type. Shows live match counts against tracked visitors. Sidebar targeting per audience is "coming". API: `GET/POST/DELETE /api/audiences`.

## Deploy
Env vars: see `.env.example` (`DATABASE_URL`, `OPENAI_API_KEY`, `OPENAI_MODEL`, `WAYLO_ADMIN_PASSWORD`, `WAYLO_ADMIN_EMAIL`, `WAYLO_SESSION_SECRET`, `WAYLO_PUBLIC_URL`, `WAYLO_DATA_FILE`).

### Data store
`src/lib/store.ts` is an async facade over two backends:
- **Postgres (recommended for production)** — used whenever `DATABASE_URL` is set (`src/lib/store-pg.ts`, pool in `src/lib/db.ts`). Use Supabase, Neon, or Railway Postgres. Schema lives in `migrations/*.sql`.
  ```bash
  DATABASE_URL=postgres://… npm run db:migrate        # idempotent; tracks applied files in schema_migrations
  DATABASE_URL=postgres://… npm run db:import-json    # optional one-time copy of data/db.json → Postgres
  ```
  TLS is on automatically for non-localhost URLs. Pool size: `PG_POOL_MAX` (default 5; keep low on serverless).
- **JSON file** (`src/lib/store-json.ts`, `WAYLO_DATA_FILE`, default `./data/db.json`) — when `DATABASE_URL` is unset. Local dev / single-process only: no concurrency safety, needs a persistent disk.

**Node host (Render, Railway, Fly, a VPS):**
```bash
npm ci && npm run build && npm run db:migrate
DATABASE_URL=… WAYLO_ADMIN_PASSWORD=… WAYLO_PUBLIC_URL=https://chat.yourco.com npm start   # PORT defaults to 3000
```
Put it behind HTTPS (secure cookies are on in production). Without `DATABASE_URL`, mount a persistent volume where `WAYLO_DATA_FILE` points.

**Vercel:** `vercel.json` is included (longer timeouts for crawl/chat). Import the repo, set env vars **including `DATABASE_URL`** (use the provider's pooled connection string), run `npm run db:migrate` once, deploy. The JSON store does not persist on Vercel.

**After deploy:** sign in at `/admin/login` → Settings → set Website URL → Content → Crawl site → AI Chat → copy the `<script src="https://YOUR-WAYLO/waylo.js" data-sidebar="true" async>` snippet onto your site → Publish. Optionally connect Slack/CRM in Integrations and invite teammates in Members.

## Handoff + integrations (Phase 3)
- **Talk to a person** (widget link above the input, or ⋮ menu): optional email + note → `POST /api/handoff {conversationId?, visitorId?, email?, note?}` (one open request per conversation/visitor). Widget shows “We'll be with you soon.” Conversation gets a `handoff` signal.
- **Admin → Handoffs** (`/admin/handoffs?status=open|resolved|all`): list with conversation / journey / email links; Mark resolved / Reopen (`PATCH /api/handoffs {id, status}`).
- **Admin → Integrations** (`/admin/integrations`):
  - **Slack** incoming webhook → `{ text }` messages.
  - **CRM / outbound webhook** → `{ event, site, sentAt, data: { lead?, handoff?, conversation? } }` (conversation = summary with signals, last question, admin URL).
  - Toggles per event: `lead.created`, `conversation.high_intent` (fires once when a chat first turns high-intent), `handoff.requested`. **Send test** buttons; last 50 deliveries (status / error) logged in `db.json` `deliveries`.
  - API: `GET/PUT /api/integrations`, `POST /api/integrations/test {target:"slack"|"crm"}`. Set `WAYLO_PUBLIC_URL` so admin links in notifications point to your host.

## Visitor tracking + streaming (Phase 2)
**Embed (recommended):** one script tracks pageviews *and* docks the sidebar:
```html
<script src="https://YOUR-WAYLO/waylo.js" data-sidebar="true" async></script>
```
- `public/waylo.js` creates a `waylo_vid` in the host site's localStorage, sends `POST /api/track {visitorId, path, title, referrer}` on load and on SPA `pushState`/`popstate` (sendBeacon, CORS open), and opens `/widget?vid=…` so chats link to the same visitor. Omit `data-sidebar` to track only; `window.Waylo.track()` is exposed.
- Stored in `db.json` `visitors[]` (`id, firstSeen, lastSeen, pageviews[{path,title,referrer,at}]`, capped at 300); conversations get `visitorId`.
- `/demo`, `/demo/features`, `/demo/pricing`, `/demo/case-studies`, `/demo/contact` are a multi-page fake site using the script.
- **Admin → Tracking** lists tracked visitors (pages, last page, entry Browsing/AI Chat/Contact, value tier — pricing/demo/contact pages or 5+ pages lift Low→Medium). `/admin/tracking/[vid]` shows a merged journey timeline (pageviews + questions), summary, top pages, conversations. Conversation detail shows the journey too.

**Streaming:** `POST /api/chat {…, stream: true}` returns Server-Sent Events: `meta {conversationId, messageId}` → `delta {t}`* → `done {reply, citations}`. With `OPENAI_API_KEY` it proxies OpenAI streaming (holding back the trailing `SOURCES:` line); the mock streams word-by-word. Without `stream` it returns JSON as before. The widget streams with a caret; citations and 👍/👎 appear on `done`.

## Site crawl + RAG (Phase 1)
1. **Settings → General → Website URL** (e.g. `https://yoursite.com`).
2. **Content → Crawl site** (or `POST /api/crawl {url?, max?}`; default 50, max 100). Same-origin BFS, 4 parallel fetches, 10s timeout/page, honors `robots.txt` `Disallow` for `*`, HTML only (skips images/PDFs/assets), strips script/style/nav/header/footer/forms, prefers `<main>`/`<article>`. Re-crawl replaces the index. Pages live in `db.json` `pages[]` (`id,url,title,text,updatedAt`); last run in `lastCrawl`.
3. Chat retrieval (`src/lib/retrieve.ts`): pages are split into ~900-char chunks and ranked with BM25 + title boost; top 3 distinct pages become citation chips linking to the real URLs. Mock AI answers with the best-matching sentences (`[n]` markers); OpenAI gets up to 4 sources (~2.5k chars each) and must cite by number.
4. If nothing has been crawled, the sample pages in `src/lib/knowledge.ts` are used.
API: `GET /api/crawl` (last run), `GET /api/pages`, `DELETE /api/pages?id=`.

## Admin UI
Left nav: **Home** (`/admin` — metric tiles, 14-day questions chart, site card, visitor value, top topics) · **AI Chat** (`/admin/ai-chat` — Try/Preview/Install/Publish checklist, publish switch, live `/widget` preview) · **Questions** (`/admin/questions?q=&signal=&id=` — searchable log with answer, citations, feedback) · **Tracking** (`/admin/tracking?tier=` — visitors by value tier High/Medium/Low, entry AI Chat/Contact) · **Guidance** · **Content** (`/admin/content` — mock indexed pages + citation counts) · **Settings** (General: site name, company profile, published; sidebar branding; embed). Audience/Members/Integrations are shown as "Coming soon". `/admin/leads` and `/admin/c/[id]` remain (under Tracking).
Settings live in `db.json` `settings` (`GET/PUT /api/settings`). Company profile is injected into the AI system prompt (mock answers "about/company" questions from it). Unpublished → widget shows a "Preview only" banner.

Console-style shell (`src/app/admin/layout.tsx` + `AdminNav.tsx`): dark teal-black left rail with active states, sticky top bar (site, preview, help, user chip). Shared primitives in `src/app/admin/ui.tsx` (PageHeader, MetricCard, Card, Empty, Badge) and Tailwind component classes in `globals.css` (`w-card`, `w-input`, `w-btn`, `w-btn-ghost`, `w-label`, `w-th`). Waylo palette: teal `#0f766e` on warm stone neutrals.

## What's next
0. **Real crawl/RAG**: replace `knowledge.ts` with a site crawler + chunking + embeddings + vector search; cite real page URLs.
1. **Database** — swap the JSON store for Postgres/KV for multi-instance or serverless hosting; multi-tenant workspaces.
2. **Real database** (Postgres via Supabase + Prisma) — swap `store.ts` implementations.
3. **Multi-tenant**: workspaces, per-tenant widget keys, allowed origins, branding.
4. **CRM sync**: implement a `CrmProvider` (HubSpot first) — upsert contact, log signals as properties/timeline events.
5. **AI**: LLM-based signal classification, knowledge base from customer docs, lead summaries.
6. **Billing** (Stripe) and deploy (Vercel).

## Security

- **Rate limits** (per IP, per minute): chat 20, track 120, feedback 30, handoff 10, leads 10, login 10 (plus 5-failure lockout). Exceeding returns `429 {"error": ...}` with `Retry-After`. Limits are in-memory (`src/lib/guard.ts`) — fine for one instance; running multiple instances needs a shared store such as Redis / Render Key Value.
- **Embed origins:** set `WAYLO_ALLOWED_ORIGINS` (comma-separated) or Settings → General → *Allowed embed origins*. When set, public APIs return `403` for other `Origin`s; same-site and no-Origin (server) requests are allowed. When unset, any origin is accepted and a warning is logged once.

## Email: invites & password reset

Set `RESEND_API_KEY` (and `WAYLO_FROM_EMAIL`, default `Waylo <onboarding@resend.dev>`) plus `WAYLO_PUBLIC_URL`.
- **Invites:** creating a member emails the invite link; Copy link always works too.
- **Password reset:** `/admin/login` → *Forgot password?* emails a 1-hour, single-use link to `/admin/reset/<token>` (rate-limited). Invited members only — the env owner changes `WAYLO_ADMIN_PASSWORD` on the host instead.
- Without a key, nothing is sent: links are logged to the server console and the admin shows "Email not configured — copy link".
