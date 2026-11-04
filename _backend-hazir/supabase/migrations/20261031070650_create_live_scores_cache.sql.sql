/*
# Create live_scores_cache table for edge function caching

1. New Tables
- `live_scores_cache`: single-row cache table for live score data fetched from ESPN.
  Prevents every user request from hitting the external API, reducing latency and quota usage.

2. Columns
- `id`: always 1 (singleton row).
- `payload`: JSONB storing the full scores array.
- `fetched_at`: timestamp of the last successful upstream fetch.
- `ttl_seconds`: cache validity window (default 15 seconds).

3. Security
- RLS enabled; no client role gets access — only the service_role (edge function) reads/writes this table.
- No grants to anon or authenticated.
*/

CREATE TABLE IF NOT EXISTS public.live_scores_cache (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  payload jsonb NOT NULL DEFAULT '[]'::jsonb,
  fetched_at timestamptz NOT NULL DEFAULT now(),
  ttl_seconds integer NOT NULL DEFAULT 15
);

ALTER TABLE public.live_scores_cache ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.live_scores_cache TO service_role;