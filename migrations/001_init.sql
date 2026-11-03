-- Waylo schema v1. Idempotent: safe to run repeatedly.
CREATE TABLE IF NOT EXISTS kv (key text PRIMARY KEY, value jsonb NOT NULL); -- settings, branding, integrations, last_crawl
CREATE TABLE IF NOT EXISTS conversations (
  id text PRIMARY KEY, visitor_id text, visitor_name text, visitor_email text, visitor_type text,
  themes jsonb NOT NULL DEFAULT '[]', signals jsonb NOT NULL DEFAULT '[]', crm_contact_id text,
  created_at timestamptz NOT NULL, updated_at timestamptz NOT NULL);
CREATE INDEX IF NOT EXISTS conversations_updated_idx ON conversations (updated_at DESC);
CREATE TABLE IF NOT EXISTS messages (
  id text NOT NULL, conversation_id text NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  seq int NOT NULL, role text NOT NULL, text text NOT NULL, at timestamptz NOT NULL,
  citations jsonb, feedback text, PRIMARY KEY (conversation_id, id));
CREATE INDEX IF NOT EXISTS messages_at_idx ON messages (at);
CREATE TABLE IF NOT EXISTS leads (id text PRIMARY KEY, name text NOT NULL, email text NOT NULL, message text NOT NULL, intent text NOT NULL, consent boolean NOT NULL, conversation_id text, created_at timestamptz NOT NULL);
CREATE TABLE IF NOT EXISTS facts (id text PRIMARY KEY, text text NOT NULL, created_at timestamptz NOT NULL);
CREATE TABLE IF NOT EXISTS rules (id text PRIMARY KEY, text text NOT NULL, created_at timestamptz NOT NULL);
CREATE TABLE IF NOT EXISTS skills (id text PRIMARY KEY, name text NOT NULL, instructions text NOT NULL, created_at timestamptz NOT NULL);
CREATE TABLE IF NOT EXISTS pages (id text PRIMARY KEY, url text NOT NULL UNIQUE, title text NOT NULL, text text NOT NULL, updated_at timestamptz NOT NULL);
CREATE TABLE IF NOT EXISTS visitors (id text PRIMARY KEY, first_seen timestamptz NOT NULL, last_seen timestamptz NOT NULL, user_agent text);
CREATE INDEX IF NOT EXISTS visitors_last_seen_idx ON visitors (last_seen DESC);
CREATE TABLE IF NOT EXISTS pageviews (id bigserial PRIMARY KEY, visitor_id text NOT NULL REFERENCES visitors(id) ON DELETE CASCADE, path text NOT NULL, title text, referrer text, at timestamptz NOT NULL);
CREATE INDEX IF NOT EXISTS pageviews_visitor_idx ON pageviews (visitor_id, at);
CREATE TABLE IF NOT EXISTS handoffs (id text PRIMARY KEY, conversation_id text, visitor_id text, name text, email text, note text, status text NOT NULL, created_at timestamptz NOT NULL, resolved_at timestamptz);
CREATE TABLE IF NOT EXISTS deliveries (id text PRIMARY KEY, at timestamptz NOT NULL, target text NOT NULL, event text NOT NULL, ok boolean NOT NULL, status int, error text, test boolean);
-- members doubles as invites: invite_token set until accepted.
CREATE TABLE IF NOT EXISTS members (id text PRIMARY KEY, email text NOT NULL UNIQUE, role text NOT NULL, invited_at timestamptz NOT NULL, invite_token text UNIQUE, password_hash text, joined_at timestamptz);
CREATE TABLE IF NOT EXISTS audiences (id text PRIMARY KEY, name text NOT NULL, match text NOT NULL, rules jsonb NOT NULL DEFAULT '[]', created_at timestamptz NOT NULL);
CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now());
