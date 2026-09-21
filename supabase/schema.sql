-- Mindful Minutes — Supabase schema
-- Run this in the Supabase SQL editor (Project > SQL Editor > New query)

create table if not exists public.game_sessions (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null,
  game_id text not null,
  score integer not null,
  max_score integer not null,
  accuracy numeric,
  reaction_ms integer,
  created_at timestamptz not null default now()
);

create index if not exists game_sessions_player_id_idx on public.game_sessions (player_id);
create index if not exists game_sessions_game_id_idx on public.game_sessions (game_id);

-- Row Level Security: every player can only see and write their own rows.
alter table public.game_sessions enable row level security;

-- If you turn on Supabase Auth (recommended for real multi-user use),
-- these policies restrict access to the signed-in user's own rows:
create policy "Users can insert their own sessions"
  on public.game_sessions for insert
  with check (auth.uid() = player_id);

create policy "Users can view their own sessions"
  on public.game_sessions for select
  using (auth.uid() = player_id);

-- NOTE: While the app is running WITHOUT Supabase Auth wired up (the
-- default, out-of-the-box state), player_id is a random UUID generated
-- client-side and stored in localStorage — it is NOT a Supabase auth
-- user id, so the policies above will block writes until you either:
--   1. Add Supabase Auth (email or magic link) and use auth.uid() as
--      the player_id everywhere, matching src/lib/db.js, OR
--   2. Relax these policies for a trusted single-user/demo deployment.
-- This is called out explicitly in README.md > "Connecting Supabase".
