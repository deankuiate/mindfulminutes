import { supabase, supabaseEnabled } from './supabaseClient'

const LOCAL_KEY = 'mindful_minutes_sessions_v1'
const PROFILE_KEY = 'mindful_minutes_profile_v1'

function readLocal() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY)) || []
  } catch {
    return []
  }
}

function writeLocal(sessions) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(sessions))
}

// A "session" row is intentionally the same shape whether it comes from
// Supabase or localStorage, so every component downstream (Progress,
// Assessment) never needs to know which backend is active.
// Shape: { id, game_id, score, max_score, accuracy, reaction_ms, created_at, player_id }

export async function getOrCreatePlayerId() {
  if (supabaseEnabled && supabase) {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) return user.id
  }
  let id = localStorage.getItem(PROFILE_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(PROFILE_KEY, id)
  }
  return id
}

export async function recordSession(session) {
  const player_id = await getOrCreatePlayerId()
  const row = {
    id: crypto.randomUUID(),
    player_id,
    created_at: new Date().toISOString(),
    ...session
  }

  if (supabaseEnabled && supabase) {
    const { error } = await supabase.from('game_sessions').insert(row)
    if (error) {
      console.error('Supabase insert failed, falling back to local save:', error)
      writeLocal([...readLocal(), row])
    }
    return row
  }

  writeLocal([...readLocal(), row])
  return row
}

export async function getSessions() {
  const player_id = await getOrCreatePlayerId()

  if (supabaseEnabled && supabase) {
    const { data, error } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('player_id', player_id)
      .order('created_at', { ascending: true })
    if (!error && data) return data
    console.error('Supabase read failed, using local sessions:', error)
  }

  return readLocal()
    .filter((s) => s.player_id === player_id)
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
}
