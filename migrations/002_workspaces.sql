-- Multi-tenant workspaces. Existing data becomes workspace 'default'.
CREATE TABLE IF NOT EXISTS workspaces (id text PRIMARY KEY, name text NOT NULL, owner_email text, created_at timestamptz NOT NULL DEFAULT now());
INSERT INTO workspaces(id,name,owner_email) VALUES('default','Waylo',NULL) ON CONFLICT DO NOTHING;
DO $$ DECLARE t text; BEGIN
  FOREACH t IN ARRAY ARRAY['conversations','leads','facts','rules','skills','pages','visitors','pageviews','handoffs','deliveries','members','audiences'] LOOP
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS workspace_id text NOT NULL DEFAULT %L REFERENCES workspaces(id) ON DELETE CASCADE', t, 'default');
    EXECUTE format('CREATE INDEX IF NOT EXISTS %I ON %I (workspace_id)', t || '_ws_idx', t);
  END LOOP; END $$;
-- pages: url unique per workspace
ALTER TABLE pages DROP CONSTRAINT IF EXISTS pages_url_key;
CREATE UNIQUE INDEX IF NOT EXISTS pages_ws_url_key ON pages (workspace_id, url);
-- visitors: client-generated ids are only unique per workspace
ALTER TABLE pageviews DROP CONSTRAINT IF EXISTS pageviews_visitor_id_fkey;
ALTER TABLE visitors DROP CONSTRAINT IF EXISTS visitors_pkey;
ALTER TABLE visitors ADD PRIMARY KEY (workspace_id, id);
ALTER TABLE pageviews ADD CONSTRAINT pageviews_visitor_fkey FOREIGN KEY (workspace_id, visitor_id) REFERENCES visitors(workspace_id, id) ON DELETE CASCADE;
DROP INDEX IF EXISTS pageviews_visitor_idx;
CREATE INDEX IF NOT EXISTS pageviews_ws_visitor_idx ON pageviews (workspace_id, visitor_id, at);
-- kv singletons → '<workspace>:<key>'
UPDATE kv SET key = 'default:' || key WHERE key IN ('branding','settings','billing','integrations','last_crawl');
