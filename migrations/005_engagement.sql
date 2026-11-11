-- Free visitor analytics: traffic channel/UTM, time on page, scroll depth, key clicks.
ALTER TABLE pageviews ADD COLUMN IF NOT EXISTS pv_key text;
ALTER TABLE pageviews ADD COLUMN IF NOT EXISTS channel text;
ALTER TABLE pageviews ADD COLUMN IF NOT EXISTS source text;
ALTER TABLE pageviews ADD COLUMN IF NOT EXISTS utm_source text;
ALTER TABLE pageviews ADD COLUMN IF NOT EXISTS utm_medium text;
ALTER TABLE pageviews ADD COLUMN IF NOT EXISTS utm_campaign text;
ALTER TABLE pageviews ADD COLUMN IF NOT EXISTS duration_ms integer;
ALTER TABLE pageviews ADD COLUMN IF NOT EXISTS scroll_pct smallint;
ALTER TABLE pageviews ADD COLUMN IF NOT EXISTS clicks jsonb;
CREATE INDEX IF NOT EXISTS pageviews_ws_pvkey_idx ON pageviews (workspace_id, visitor_id, pv_key) WHERE pv_key IS NOT NULL;
