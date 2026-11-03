// Postgres backend. Used when DATABASE_URL is set. Schema: migrations/*.sql (npm run db:migrate).
import crypto from "crypto";
import { pool, q } from "./db";
import type { Branding, Conversation, Lead, SiteSettings, Member, Audience, Integrations, Handoff, Delivery, Visitor, Page, CrawlRun, Guidance, Pageview, Message, Billing } from "./store-types";
import { DEFAULT_BRANDING, DEFAULT_SETTINGS, DEFAULT_INTEGRATIONS } from "./store-types";

const newId = () => crypto.randomUUID();
const iso = (d: any) => (d == null ? undefined : new Date(d).toISOString());
const u = <T,>(v: T | null) => (v == null ? undefined : v);
const strip = <T extends object>(o: T): T => { for (const k of Object.keys(o)) if ((o as any)[k] === undefined) delete (o as any)[k]; return o; };

async function kvGet<T>(key: string): Promise<T | undefined> { const r = await q("SELECT value FROM kv WHERE key=$1", [key]); return r[0]?.value; }
async function kvSet(key: string, value: unknown) { await q("INSERT INTO kv(key,value) VALUES($1,$2) ON CONFLICT(key) DO UPDATE SET value=EXCLUDED.value", [key, JSON.stringify(value)]); }

// ── Conversations
const toMsg = (r: any): Message => strip({ id: r.id, role: r.role, text: r.text, at: iso(r.at)!, citations: u(r.citations), feedback: u(r.feedback) });
const toConv = (r: any, msgs: Message[]): Conversation => strip({ id: r.id, visitorId: u(r.visitor_id), visitorName: u(r.visitor_name), visitorEmail: u(r.visitor_email), visitorType: u(r.visitor_type), themes: r.themes || [], signals: r.signals || [], crmContactId: u(r.crm_contact_id), messages: msgs, createdAt: iso(r.created_at)!, updatedAt: iso(r.updated_at)! });
async function withMessages(rows: any[]) {
  if (!rows.length) return [];
  const ms = await q("SELECT * FROM messages WHERE conversation_id = ANY($1) ORDER BY seq", [rows.map((r) => r.id)]);
  const by = new Map<string, Message[]>(); for (const m of ms) { if (!by.has(m.conversation_id)) by.set(m.conversation_id, []); by.get(m.conversation_id)!.push(toMsg(m)); }
  return rows.map((r) => toConv(r, by.get(r.id) || []));
}
export async function listConversations() { return withMessages(await q("SELECT * FROM conversations ORDER BY updated_at DESC")); }
export async function getConversation(id: string) { return (await withMessages(await q("SELECT * FROM conversations WHERE id=$1", [id])))[0]; }
export async function upsertConversation(c: Conversation) {
  const cl = await pool().connect();
  try {
    await cl.query("BEGIN");
    await cl.query(`INSERT INTO conversations(id,visitor_id,visitor_name,visitor_email,visitor_type,themes,signals,crm_contact_id,created_at,updated_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      ON CONFLICT(id) DO UPDATE SET visitor_id=EXCLUDED.visitor_id,visitor_name=EXCLUDED.visitor_name,visitor_email=EXCLUDED.visitor_email,visitor_type=EXCLUDED.visitor_type,themes=EXCLUDED.themes,signals=EXCLUDED.signals,crm_contact_id=EXCLUDED.crm_contact_id,updated_at=EXCLUDED.updated_at`,
      [c.id, c.visitorId ?? null, c.visitorName ?? null, c.visitorEmail ?? null, c.visitorType ?? null, JSON.stringify(c.themes || []), JSON.stringify(c.signals || []), c.crmContactId ?? null, c.createdAt, c.updatedAt]);
    const ids = c.messages.map((m) => m.id);
    await cl.query("DELETE FROM messages WHERE conversation_id=$1 AND NOT (id = ANY($2))", [c.id, ids]);
    for (const [i, m] of c.messages.entries())
      await cl.query(`INSERT INTO messages(id,conversation_id,seq,role,text,at,citations,feedback) VALUES($1,$2,$3,$4,$5,$6,$7,$8)
        ON CONFLICT(conversation_id,id) DO UPDATE SET seq=EXCLUDED.seq,role=EXCLUDED.role,text=EXCLUDED.text,at=EXCLUDED.at,citations=EXCLUDED.citations,feedback=EXCLUDED.feedback`,
        [m.id, c.id, i, m.role, m.text, m.at, m.citations ? JSON.stringify(m.citations) : null, m.feedback ?? null]);
    await cl.query("COMMIT");
  } catch (e) { await cl.query("ROLLBACK"); throw e; } finally { cl.release(); }
  return c;
}
export async function updateConversation(id: string, patch: Partial<Conversation>) {
  const c = await getConversation(id); if (!c) return undefined;
  return upsertConversation({ ...c, ...patch, updatedAt: new Date().toISOString() });
}
export async function stats() {
  const [r] = await q(`SELECT (SELECT count(*) FROM conversations)::int AS total,
    (SELECT count(*) FROM messages WHERE to_char(at AT TIME ZONE 'UTC','YYYY-MM-DD') = $1)::int AS today,
    (SELECT count(*) FROM conversations WHERE signals ? 'high-intent')::int AS hi`, [new Date().toISOString().slice(0, 10)]);
  return { totalConversations: r.total, messagesToday: r.today, highIntent: r.hi };
}
export async function setFeedback(conversationId: string, messageId: string, feedback: "up" | "down" | null) {
  const r = await q("UPDATE messages SET feedback=$3 WHERE conversation_id=$1 AND id=$2 RETURNING id", [conversationId, messageId, feedback]);
  return r.length > 0;
}

// ── Leads
const toLead = (r: any): Lead => strip({ id: r.id, name: r.name, email: r.email, message: r.message, intent: r.intent, consent: r.consent, conversationId: u(r.conversation_id), createdAt: iso(r.created_at)! });
export async function listLeads() { return (await q("SELECT * FROM leads ORDER BY created_at DESC")).map(toLead); }
export async function addLead(l: Omit<Lead, "id" | "createdAt">) {
  const lead: Lead = { ...l, id: newId(), createdAt: new Date().toISOString() };
  await q("INSERT INTO leads VALUES($1,$2,$3,$4,$5,$6,$7,$8)", [lead.id, lead.name, lead.email, lead.message, lead.intent, lead.consent, lead.conversationId ?? null, lead.createdAt]);
  return lead;
}

// ── Singletons
export async function getBranding(): Promise<Branding> { return { ...DEFAULT_BRANDING, ...((await kvGet<Branding>("branding")) || {}) }; }
export async function setBranding(b: Partial<Branding>) { const v = { ...(await getBranding()), ...b }; await kvSet("branding", v); return v; }
export async function getBilling(): Promise<Billing> { return { status: "none", ...((await kvGet<Billing>("billing")) || {}) }; }
export async function setBilling(p: Partial<Billing>) { const v = { ...(await getBilling()), ...p }; await kvSet("billing", v); return v; }
export async function getSettings(): Promise<SiteSettings> { return { ...DEFAULT_SETTINGS, ...((await kvGet<SiteSettings>("settings")) || {}) }; }
export async function setSettings(p: Partial<SiteSettings>) { const v = { ...(await getSettings()), ...p }; await kvSet("settings", v); return v; }
export async function getIntegrations(): Promise<Integrations> { return { ...DEFAULT_INTEGRATIONS, ...((await kvGet<Integrations>("integrations")) || {}) }; }
export async function setIntegrations(p: Partial<Integrations>) { const v = { ...(await getIntegrations()), ...p }; await kvSet("integrations", v); return v; }
export async function getLastCrawl() { return kvGet<CrawlRun>("last_crawl"); }
export async function setLastCrawl(r: CrawlRun) { await kvSet("last_crawl", r); }

// ── Guidance
export async function getGuidance(): Promise<Guidance> {
  const [f, r, s] = await Promise.all([q("SELECT * FROM facts ORDER BY created_at"), q("SELECT * FROM rules ORDER BY created_at"), q("SELECT * FROM skills ORDER BY created_at")]);
  return { facts: f.map((x) => ({ id: x.id, text: x.text, createdAt: iso(x.created_at)! })), rules: r.map((x) => ({ id: x.id, text: x.text, createdAt: iso(x.created_at)! })), skills: s.map((x) => ({ id: x.id, name: x.name, instructions: x.instructions, createdAt: iso(x.created_at)! })) };
}
const GT = { facts: "facts", rules: "rules", skills: "skills" } as const;
export async function addGuidance(kind: "facts" | "rules" | "skills", item: { text?: string; name?: string; instructions?: string }) {
  const base = { id: newId(), createdAt: new Date().toISOString() };
  if (kind === "skills") { const it = { ...base, name: item.name!, instructions: item.instructions! }; await q("INSERT INTO skills VALUES($1,$2,$3,$4)", [it.id, it.name, it.instructions, it.createdAt]); return it; }
  const it = { ...base, text: item.text! }; await q(`INSERT INTO ${GT[kind]} VALUES($1,$2,$3)`, [it.id, it.text, it.createdAt]); return it;
}
export async function deleteGuidance(kind: "facts" | "rules" | "skills", id: string) { await q(`DELETE FROM ${GT[kind]} WHERE id=$1`, [id]); }

// ── Pages
const toPage = (r: any): Page => ({ id: r.id, url: r.url, title: r.title, text: r.text, updatedAt: iso(r.updated_at)! });
export async function listPages() { return (await q("SELECT * FROM pages ORDER BY url")).map(toPage); }
export async function upsertPages(ps: Omit<Page, "id">[]) {
  for (const p of ps) await q("INSERT INTO pages(id,url,title,text,updated_at) VALUES($1,$2,$3,$4,$5) ON CONFLICT(url) DO UPDATE SET title=EXCLUDED.title,text=EXCLUDED.text,updated_at=EXCLUDED.updated_at", [newId(), p.url, p.title, p.text, p.updatedAt]);
}
export async function deletePage(id: string) { await q("DELETE FROM pages WHERE id=$1", [id]); }
export async function clearPages() { await q("DELETE FROM pages"); }

// ── Visitors
const MAX_PV = 300;
async function loadVisitors(rows: any[]): Promise<Visitor[]> {
  if (!rows.length) return [];
  const pv = await q("SELECT * FROM pageviews WHERE visitor_id = ANY($1) ORDER BY at, id", [rows.map((r) => r.id)]);
  const by = new Map<string, Pageview[]>(); for (const p of pv) { if (!by.has(p.visitor_id)) by.set(p.visitor_id, []); by.get(p.visitor_id)!.push(strip({ path: p.path, title: u(p.title), referrer: u(p.referrer), at: iso(p.at)! })); }
  return rows.map((r) => strip({ id: r.id, firstSeen: iso(r.first_seen)!, lastSeen: iso(r.last_seen)!, userAgent: u(r.user_agent), pageviews: by.get(r.id) || [] }));
}
export async function listVisitors() { return loadVisitors(await q("SELECT * FROM visitors ORDER BY last_seen DESC")); }
export async function getVisitor(id: string) { return (await loadVisitors(await q("SELECT * FROM visitors WHERE id=$1", [id])))[0]; }
export async function trackPageview(visitorId: string, pv: Omit<Pageview, "at">, userAgent?: string) {
  const now = new Date().toISOString();
  await q("INSERT INTO visitors(id,first_seen,last_seen,user_agent) VALUES($1,$2,$2,$3) ON CONFLICT(id) DO UPDATE SET last_seen=EXCLUDED.last_seen", [visitorId, now, userAgent ?? null]);
  const [last] = await q("SELECT path, at FROM pageviews WHERE visitor_id=$1 ORDER BY at DESC, id DESC LIMIT 1", [visitorId]);
  if (!(last && last.path === pv.path && Date.now() - +new Date(last.at) < 3000)) {
    await q("INSERT INTO pageviews(visitor_id,path,title,referrer,at) VALUES($1,$2,$3,$4,$5)", [visitorId, pv.path, pv.title ?? null, pv.referrer ?? null, now]);
    await q("DELETE FROM pageviews WHERE visitor_id=$1 AND id NOT IN (SELECT id FROM pageviews WHERE visitor_id=$1 ORDER BY at DESC, id DESC LIMIT $2)", [visitorId, MAX_PV]);
  }
  return (await getVisitor(visitorId))!;
}
export async function touchVisitor(visitorId: string) { await q("UPDATE visitors SET last_seen=now() WHERE id=$1", [visitorId]); }

// ── Handoffs & deliveries
const toHandoff = (r: any): Handoff => strip({ id: r.id, conversationId: u(r.conversation_id), visitorId: u(r.visitor_id), name: u(r.name), email: u(r.email), note: u(r.note), status: r.status, createdAt: iso(r.created_at)!, resolvedAt: iso(r.resolved_at) });
export async function listHandoffs() { return (await q("SELECT * FROM handoffs ORDER BY created_at DESC")).map(toHandoff); }
export async function addHandoff(h: Omit<Handoff, "id" | "createdAt" | "status">) {
  const x: Handoff = { ...h, id: newId(), status: "open", createdAt: new Date().toISOString() };
  await q("INSERT INTO handoffs(id,conversation_id,visitor_id,name,email,note,status,created_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8)", [x.id, x.conversationId ?? null, x.visitorId ?? null, x.name ?? null, x.email ?? null, x.note ?? null, x.status, x.createdAt]);
  return x;
}
export async function setHandoffStatus(id: string, status: Handoff["status"]) {
  const r = await q("UPDATE handoffs SET status=$2, resolved_at=$3 WHERE id=$1 RETURNING *", [id, status, status === "resolved" ? new Date().toISOString() : null]);
  return r[0] ? toHandoff(r[0]) : undefined;
}
export async function logDelivery(d: Omit<Delivery, "id" | "at">) {
  await q("INSERT INTO deliveries VALUES($1,$2,$3,$4,$5,$6,$7,$8)", [newId(), new Date().toISOString(), d.target, d.event, d.ok, d.status ?? null, d.error ?? null, d.test ?? null]);
  await q("DELETE FROM deliveries WHERE id NOT IN (SELECT id FROM deliveries ORDER BY at DESC LIMIT 50)");
}
export async function listDeliveries(): Promise<Delivery[]> {
  return (await q("SELECT * FROM deliveries ORDER BY at DESC LIMIT 50")).map((r) => strip({ id: r.id, at: iso(r.at)!, target: r.target, event: r.event, ok: r.ok, status: u(r.status), error: u(r.error), test: u(r.test) }));
}

// ── Members / invites
const toMember = (r: any): Member => strip({ id: r.id, email: r.email, role: r.role, invitedAt: iso(r.invited_at)!, inviteToken: u(r.invite_token), passwordHash: u(r.password_hash), joinedAt: iso(r.joined_at) });
export async function listMembers() { return (await q("SELECT * FROM members ORDER BY invited_at")).map(toMember); }
export async function findMember(qq: { email?: string; token?: string }) {
  if (!qq.email && !qq.token) return undefined;
  const r = await q("SELECT * FROM members WHERE ($1::text IS NOT NULL AND lower(email)=lower($1)) OR ($2::text IS NOT NULL AND invite_token=$2) LIMIT 1", [qq.email || null, qq.token || null]);
  return r[0] ? toMember(r[0]) : undefined;
}
export async function addMember(email: string, role: Member["role"]) {
  const m: Member = { id: newId(), email: email.toLowerCase(), role, invitedAt: new Date().toISOString(), inviteToken: crypto.randomBytes(18).toString("base64url") };
  await q("INSERT INTO members(id,email,role,invited_at,invite_token) VALUES($1,$2,$3,$4,$5)", [m.id, m.email, m.role, m.invitedAt, m.inviteToken]);
  return m;
}
const MCOL: Record<string, string> = { email: "email", role: "role", invitedAt: "invited_at", inviteToken: "invite_token", passwordHash: "password_hash", joinedAt: "joined_at" };
export async function updateMember(id: string, p: Partial<Member>) {
  const keys = Object.keys(p).filter((k) => MCOL[k]);
  if (keys.length) await q(`UPDATE members SET ${keys.map((k, i) => `${MCOL[k]}=$${i + 2}`).join(",")} WHERE id=$1`, [id, ...keys.map((k) => (p as any)[k] ?? null)]);
  const r = await q("SELECT * FROM members WHERE id=$1", [id]); return r[0] ? toMember(r[0]) : undefined;
}
export async function removeMember(id: string) { await q("DELETE FROM members WHERE id=$1", [id]); }

// ── Audiences
export async function listAudiences(): Promise<Audience[]> { return (await q("SELECT * FROM audiences ORDER BY created_at")).map((r) => ({ id: r.id, name: r.name, match: r.match, rules: r.rules, createdAt: iso(r.created_at)! })); }
export async function addAudience(a: Omit<Audience, "id" | "createdAt">) {
  const x = { ...a, id: newId(), createdAt: new Date().toISOString() };
  await q("INSERT INTO audiences VALUES($1,$2,$3,$4,$5)", [x.id, x.name, x.match, JSON.stringify(x.rules), x.createdAt]); return x;
}
export async function deleteAudience(id: string) { await q("DELETE FROM audiences WHERE id=$1", [id]); }
