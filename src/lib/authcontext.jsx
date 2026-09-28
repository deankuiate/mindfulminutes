import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, supabaseEnabled } from './supabaseClient.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabaseEnabled) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function signUp(email, password) {
    if (!supabaseEnabled) return { error: 'Supabase is not connected yet.' }
    const { error } = await supabase.auth.signUp({ email, password })
    return { error: error?.message }
  }

  async function signIn(email, password) {
    if (!supabaseEnabled) return { error: 'Supabase is not connected yet.' }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message }
  }

  async function signOut() {
    if (!supabaseEnabled) return
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, supabaseEnabled }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}