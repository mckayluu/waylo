// JSON file backend (local / single-process). Used when DATABASE_URL is unset.
import fs from "fs";
import path from "path";
import crypto from "crypto";

import type { Workspace, Branding, Conversation, Lead, SiteSettings, Member, Audience, Integrations, Handoff, Delivery, Visitor, Page, CrawlRun, Fact, Rule, Skill, Guidance, Pageview, Billing, InstallSeen, Engagement } from "./store-types";
import { DEFAULT_BRANDING, DEFAULT_SETTINGS, DEFAULT_INTEGRATIONS } from "./store-types";
type DB = { conversations: Conversation[]; leads?: Lead[]; branding?: Branding; settings?: SiteSettings; members?: Member[]; audiences?: Audience[]; integrations?: Integrations; handoffs?: Handoff[]; deliveries?: Delivery[]; visitors?: Visitor[]; pages?: Page[]; lastCrawl?: CrawlRun; facts?: Fact[]; rules?: Rule[]; skills?: Skill[]; billing?: Billing };

const FILE = path.resolve(process.env.WAYLO_DATA_FILE || "./data/db.json");
function load(): DB {
  try { return JSON.parse(fs.readFileSync(FILE, "utf8")); } catch { return { conversations: [] }; }
}
function save(db: DB) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  const tmp = FILE + ".tmp"; fs.writeFileSync(tmp, JSON.stringify(db, null, 2)); fs.renameSync(tmp, FILE);
}
export const newId = () => crypto.randomUUID();

export function listConversations() {
  return load().conversations.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
export function getConversation(id: string) { return load().conversations.find((c) => c.id === id); }
export function upsertConversation(c: Conversation) {
  const db = load(); const i = db.conversations.findIndex((x) => x.id === c.id);
  if (i >= 0) db.conversations[i] = c; else db.conversations.push(c);
  save(db); return c;
}
export function updateConversation(id: string, patch: Partial<Conversation>) {
  const c = getConversation(id); if (!c) return undefined;
  return upsertConversation({ ...c, ...patch, updatedAt: new Date().toISOString() });
}
export function stats() {
  const all = load().conversations; const today = new Date().toISOString().slice(0, 10);
  return {
    totalConversations: all.length,
    messagesToday: all.flatMap((c) => c.messages).filter((m) => m.at.startsWith(today)).length,
    highIntent: all.filter((c) => c.signals.includes("high-intent")).length,
  };
}

export function listLeads() { return (load().leads || []).sort((a, b) => b.createdAt.localeCompare(a.createdAt)); }
export function addLead(l: Omit<Lead, "id" | "createdAt">) {
  const db = load(); const lead: Lead = { ...l, id: newId(), createdAt: new Date().toISOString() };
  db.leads = [...(db.leads || []), lead]; save(db); return lead;
}
export function getBranding(): Branding { return { ...DEFAULT_BRANDING, ...(load().branding || {}) }; }
export function setBranding(b: Partial<Branding>) { const db = load(); db.branding = { ...getBranding(), ...b }; save(db); return db.branding; }
export function setFeedback(conversationId: string, messageId: string, feedback: "up" | "down" | null) {
  const db = load(); const c = db.conversations.find((x) => x.id === conversationId); const m = c?.messages.find((x) => x.id === messageId);
  if (!m) return false; if (feedback) m.feedback = feedback; else delete m.feedback; save(db); return true;
}

export function getGuidance(): Guidance { const db = load(); return { facts: db.facts || [], rules: db.rules || [], skills: db.skills || [] }; }
export function addGuidance(kind: "facts" | "rules" | "skills", item: { text?: string; name?: string; instructions?: string }) {
  const db = load(); const base = { id: newId(), createdAt: new Date().toISOString() };
  const it = kind === "skills" ? { ...base, name: item.name!, instructions: item.instructions! } : { ...base, text: item.text! };
  (db as any)[kind] = [...((db as any)[kind] || []), it]; save(db); return it;
}
export function deleteGuidance(kind: "facts" | "rules" | "skills", id: string) {
  const db = load(); (db as any)[kind] = ((db as any)[kind] || []).filter((x: { id: string }) => x.id !== id); save(db);
}

export function getBilling(): Billing { return { status: "none", ...(load().billing || {}) }; }
export function setBilling(p: Partial<Billing>) { const db = load(); db.billing = { ...getBilling(), ...p }; save(db); return db.billing; }
export function getSettings(): SiteSettings { return { ...DEFAULT_SETTINGS, ...(load().settings || {}) }; }
export function setSettings(p: Partial<SiteSettings>) { const db = load(); db.settings = { ...getSettings(), ...p }; save(db); return db.settings; }

export function listPages(): Page[] { return load().pages || []; }
export function upsertPages(ps: Omit<Page, "id">[]) {
  const db = load(); const by = new Map((db.pages || []).map((p) => [p.url, p]));
  for (const p of ps) by.set(p.url, { id: by.get(p.url)?.id || newId(), ...p });
  db.pages = [...by.values()]; save(db);
}
export function deletePage(id: string) { const db = load(); db.pages = (db.pages || []).filter((p) => p.id !== id); save(db); }
export function clearPages() { const db = load(); db.pages = []; save(db); }
export function getLastCrawl() { return load().lastCrawl; }
export function setLastCrawl(r: CrawlRun) { const db = load(); db.lastCrawl = r; save(db); }
export function getInstall(): InstallSeen { return (load() as any).install || {}; }
export function setInstall(p: Partial<InstallSeen>) { const db = load() as any; db.install = { ...(db.install || {}), ...p }; save(db); return db.install as InstallSeen; }

const MAX_PV = 300;
export function listVisitors(): Visitor[] { return (load().visitors || []).sort((a, b) => b.lastSeen.localeCompare(a.lastSeen)); }
export function getVisitor(id: string) { return (load().visitors || []).find((v) => v.id === id); }
export function trackPageview(visitorId: string, pv: Omit<Pageview, "at">, userAgent?: string) {
  const db = load(); const now = new Date().toISOString(); db.visitors = db.visitors || [];
  let v = db.visitors.find((x) => x.id === visitorId);
  if (!v) { v = { id: visitorId, firstSeen: now, lastSeen: now, pageviews: [], userAgent }; db.visitors.push(v); }
  const last = v.pageviews.at(-1);
  // De-dupe instant reloads of the same path.
  if (!(last && last.path === pv.path && Date.now() - +new Date(last.at) < 3000)) v.pageviews.push({ ...pv, at: now });
  if (v.pageviews.length > MAX_PV) v.pageviews = v.pageviews.slice(-MAX_PV);
  v.lastSeen = now; save(db); return v;
}
export function engagePageview(visitorId: string, pvKey: string, e: Engagement) {
  const db = load(); const v = (db.visitors || []).find((x) => x.id === visitorId); const p = v?.pageviews.find((x) => x.pvKey === pvKey); if (!v || !p) return false;
  p.durationMs = Math.max(p.durationMs || 0, e.durationMs || 0); p.scrollPct = Math.max(p.scrollPct || 0, e.scrollPct || 0);
  if (e.clicks && e.clicks.length >= (p.clicks?.length || 0)) p.clicks = e.clicks; v.lastSeen = new Date().toISOString(); save(db); return true;
}
export function touchVisitor(visitorId: string) { const db = load(); const v = (db.visitors || []).find((x) => x.id === visitorId); if (v) { v.lastSeen = new Date().toISOString(); save(db); } }

export function getIntegrations(): Integrations { return { ...DEFAULT_INTEGRATIONS, ...(load().integrations || {}) }; }
export function setIntegrations(p: Partial<Integrations>) { const db = load(); db.integrations = { ...getIntegrations(), ...p }; save(db); return db.integrations; }
export function listHandoffs() { return (load().handoffs || []).sort((a, b) => b.createdAt.localeCompare(a.createdAt)); }
export function addHandoff(h: Omit<Handoff, "id" | "createdAt" | "status">) {
  const db = load(); const x: Handoff = { ...h, id: newId(), status: "open", createdAt: new Date().toISOString() };
  db.handoffs = [...(db.handoffs || []), x]; save(db); return x;
}
export function setHandoffStatus(id: string, status: Handoff["status"]) {
  const db = load(); const h = (db.handoffs || []).find((x) => x.id === id); if (!h) return undefined;
  h.status = status; h.resolvedAt = status === "resolved" ? new Date().toISOString() : undefined; save(db); return h;
}
export function logDelivery(d: Omit<Delivery, "id" | "at">) {
  const db = load(); db.deliveries = [{ ...d, id: newId(), at: new Date().toISOString() }, ...(db.deliveries || [])].slice(0, 50); save(db);
}
export function listDeliveries() { return load().deliveries || []; }

export function listMembers() { return (load().members || []).sort((a, b) => a.invitedAt.localeCompare(b.invitedAt)); }
export function findMember(q: { email?: string; token?: string; id?: string }) {
  return (load().members || []).find((m) => (q.email && m.email.toLowerCase() === q.email.toLowerCase()) || (q.token && m.inviteToken === q.token) || (q.id && m.id === q.id));
}
export function addMember(email: string, role: Member["role"], passwordHash?: string) {
  const db = load(); const now = new Date().toISOString();
  const m: Member = passwordHash ? { id: newId(), email: email.toLowerCase(), role, invitedAt: now, passwordHash, joinedAt: now } : { id: newId(), email: email.toLowerCase(), role, invitedAt: now, inviteToken: crypto.randomBytes(18).toString("base64url") };
  db.members = [...(db.members || []), m]; save(db); return m;
}
export function updateMember(id: string, p: Partial<Member>) {
  const db = load(); const m = (db.members || []).find((x) => x.id === id); if (!m) return undefined; Object.assign(m, p);
  for (const k of Object.keys(p) as (keyof Member)[]) if (p[k] === undefined) delete m[k];
  save(db); return m;
}
export function removeMember(id: string) { const db = load(); db.members = (db.members || []).filter((m) => m.id !== id); save(db); }
export function listAudiences() { return load().audiences || []; }
export function addAudience(a: Omit<Audience, "id" | "createdAt">) { const db = load(); const x = { ...a, id: newId(), createdAt: new Date().toISOString() }; db.audiences = [...(db.audiences || []), x]; save(db); return x; }
export function deleteAudience(id: string) { const db = load(); db.audiences = (db.audiences || []).filter((a) => a.id !== id); save(db); }

// JSON backend is single-tenant: only the "default" workspace exists (signup needs Postgres).
export function getWorkspace(id: string): Workspace | undefined { return id === "default" ? { id, name: "Waylo", createdAt: new Date(0).toISOString() } : undefined; }
export function createWorkspace(_w: { id: string; name: string; ownerEmail?: string }): Workspace | undefined { return undefined; }
export function deleteWorkspace(_id: string) {}
export function findWorkspaceByStripe(_c?: string, _s?: string): string | undefined { return "default"; }
