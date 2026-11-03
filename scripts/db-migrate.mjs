// Applies migrations/*.sql in order to DATABASE_URL. Usage: npm run db:migrate
import fs from "fs"; import path from "path"; import pg from "pg";
const url = process.env.DATABASE_URL;
if (!url) { console.log("DATABASE_URL not set — nothing to migrate (JSON store in use)."); process.exit(0); }
const local = /localhost|127\.0\.0\.1|sslmode=disable/.test(url);
const c = new pg.Client({ connectionString: url, ssl: local ? undefined : { rejectUnauthorized: false } });
await c.connect();
await c.query("CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())");
const done = new Set((await c.query("SELECT name FROM schema_migrations")).rows.map((r) => r.name));
const dir = path.resolve("migrations");
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) {
  if (done.has(f)) { console.log("✓", f, "(already applied)"); continue; }
  await c.query("BEGIN");
  try { await c.query(fs.readFileSync(path.join(dir, f), "utf8")); await c.query("INSERT INTO schema_migrations(name) VALUES($1)", [f]); await c.query("COMMIT"); console.log("→ applied", f); }
  catch (e) { await c.query("ROLLBACK"); console.error("✗", f, e.message); process.exit(1); }
}
await c.end();
