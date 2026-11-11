-- Plan enforcement: AI reply counters per workspace and period ('YYYY-MM' for paid plans, 'trial' for the trial total).
CREATE TABLE IF NOT EXISTS usage_counters (
  workspace_id text NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  period text NOT NULL,
  replies int NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (workspace_id, period));
