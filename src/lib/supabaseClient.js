import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseEnabled = Boolean(url && anonKey)

// If env vars aren't set yet, `supabase` is null and every function in
// db.js quietly falls back to localStorage. This means the app is fully
// playable and demoable before anyone connects a real database — flip on
// Supabase later just by setting the two env vars, no code changes needed.
export const supabase = supabaseEnabled ? createClient(url, anonKey) : null
