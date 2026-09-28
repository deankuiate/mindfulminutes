import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/authcontext.jsx'

export default function ProtectedRoute({ children }) {
  const { user, loading, supabaseEnabled } = useAuth()
  const location = useLocation()

  // If Supabase isn't connected at all, there's no account system to
  // enforce — fall back to letting the app run in local demo mode, as
  // documented in the README.
  if (!supabaseEnabled) return children

  if (loading) {
    return <p className="text-center text-mute py-20">Loading…</p>
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}