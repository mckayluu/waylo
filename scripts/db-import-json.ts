// One-time: copy data/db.json (or WAYLO_DATA_FILE) into Postgres. Usage: npm run db:import-json
// Run db:migrate first. Safe to re-run: rows upsert / skip on id conflicts.
import fs from "fs"; import path from "path";
import * as P from "../src/lib/store-pg";
import { q, pool } from "../src/lib/db";
async function main() {
  if (!process.env.DATABASE_URL) throw new Error("Set DATABASE_URL");
  const file = path.resolve(process.env.WAYLO_DATA_FILE || "./data/db.json");
  const db = JSON.parse(fs.readFileSync(file, "utf8"));
  const ins = (sql: string, p: unknown[]) => q(sql + " ON CONFLICT DO NOTHING", p);
  const n = (v: unknown) => (v === undefined ? null : v);
  if (db.settings) await P.setSettings(db.settings);
  if (db.branding) await P.setBranding(db.branding);
  if (db.integrations) await P.setIntegrations(db.integrations);
  if (db.lastCrawl) await P.setLastCrawl(db.lastCrawl);
  for (const c of db.conversations || []) await P.upsertConversation({ themes: [], signals: [], messages: [], ...c });
  for (const l of db.leads || []) await ins("INSERT INTO leads VALUES($1,$2,$3,$4,$5,$6,$7,$8)", [l.id, l.name, l.email, l.message, l.intent, !!l.consent, n(l.conversationId), l.createdAt]);
  for (const k of ["facts", "rules"]) for (const x of db[k] || []) await ins(`INSERT INTO ${k} VALUES($1,$2,$3)`, [x.id, x.text, x.createdAt]);
  for (const x of db.skills || []) await ins("INSERT INTO skills VALUES($1,$2,$3,$4)", [x.id, x.name, x.instructions, x.createdAt]);
  for (const p of db.pages || []) await ins("INSERT INTO pages VALUES($1,$2,$3,$4,$5)", [p.id, p.url, p.title, p.text, p.updatedAt]);
  for (const v of db.visitors || []) {
    const r = await ins("INSERT INTO visitors VALUES($1,$2,$3,$4) RETURNING id", [v.id, v.firstSeen, v.lastSeen, n(v.userAgent)]);
    if (r.length) for (const pv of v.pageviews || []) await q("INSERT INTO pageviews(visitor_id,path,title,referrer,at) VALUES($1,$2,$3,$4,$5)", [v.id, pv.path, n(pv.title), n(pv.referrer), pv.at]);
  }
  for (const h of db.handoffs || []) await ins("INSERT INTO handoffs VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)", [h.id, n(h.conversationId), n(h.visitorId), n(h.name), n(h.email), n(h.note), h.status, h.createdAt, n(h.resolvedAt)]);
  for (const d of db.deliveries || []) await ins("INSERT INTO deliveries VALUES($1,$2,$3,$4,$5,$6,$7,$8)", [d.id, d.at, d.target, d.event, d.ok, n(d.status), n(d.error), n(d.test)]);
  for (const m of db.members || []) await ins("INSERT INTO members VALUES($1,$2,$3,$4,$5,$6,$7)", [m.id, m.email.toLowerCase(), m.role, m.invitedAt, n(m.inviteToken), n(m.passwordHash), n(m.joinedAt)]);
  for (const a of db.audiences || []) await ins("INSERT INTO audiences VALUES($1,$2,$3,$4,$5)", [a.id, a.name, a.match, JSON.stringify(a.rules || []), a.createdAt]);
  console.log(`Imported ${file}: ${(db.conversations || []).length} conversations, ${(db.leads || []).length} leads, ${(db.visitors || []).length} visitors, ${(db.pages || []).length} pages, ${(db.members || []).length} members.`);
  await pool().end();
}
main().catch((e) => { console.error(e); process.exit(1); });
