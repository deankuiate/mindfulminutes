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

-- These policies restrict access to the signed-in user's own rows. The
-- app now requires a real Supabase Auth account (see src/lib/AuthContext.jsx
-- and src/components/ProtectedRoute.jsx) whenever Supabase is connected,
-- and src/lib/db.js always writes/reads using the authenticated user's
-- real auth.uid() as player_id — so these policies work out of the box,
-- no extra setup needed beyond enabling email/password auth (on by
-- default in a new Supabase project).
create policy "Users can insert their own sessions"
  on public.game_sessions for insert
  with check (auth.uid() = player_id);

create policy "Users can view their own sessions"
  on public.game_sessions for select
  using (auth.uid() = player_id);