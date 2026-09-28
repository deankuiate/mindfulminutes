import { supabase, supabaseEnabled } from './supabaseClient'

const LOCAL_KEY = 'mindful_minutes_sessions_v1'

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

async function getPlayerId() {
  if (!supabaseEnabled) return 'local-demo'
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No signed-in user — recordSession/getSessions require auth when Supabase is connected.')
  return user.id
}

export async function recordSession(session) {
  const player_id = await getPlayerId()
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
  const player_id = await getPlayerId()

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