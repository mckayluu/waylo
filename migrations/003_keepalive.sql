-- Keep the Render free web service awake by hitting /api/health every 10 minutes.
-- GitHub Actions was the first choice, but pushing a workflow file needs the
-- `workflow` OAuth scope, which this repo's git credentials don't have.
-- Render cron jobs have a $1/month minimum, so this uses the existing Supabase
-- project (pg_cron + pg_net) at $0 instead.
create extension if not exists pg_net with schema extensions;
create extension if not exists pg_cron;

select cron.schedule(
  'waylo-keepalive',
  '*/10 * * * *',
  $$select net.http_get(url := 'https://waylo-j5hv.onrender.com/api/health');$$
);
