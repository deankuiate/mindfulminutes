import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '/lib/AuthContext.jsx'

export default function Login() {
  const { signIn, signUp, supabaseEnabled } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mode, setMode] = useState('signin') // signin | signup
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [busy, setBusy] = useState(false)

  const redirectTo = location.state?.from || '/games'

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setBusy(true)

    const action = mode === 'signin' ? signIn : signUp
    const { error } = await action(email, password)

    setBusy(false)
    if (error) {
      setError(error)
      return
    }

    if (mode === 'signup') {
      setMessage('Account created! Check your email to confirm, then sign in below.')
      setMode('signin')
    } else {
      navigate(redirectTo, { replace: true })
    }
  }

  if (!supabaseEnabled) {
    return (
      <div className="max-w-md mx-auto card p-8 text-center space-y-3">
        <div className="text-4xl" aria-hidden="true">🔌</div>
        <h1 className="text-2xl font-display font-medium">Supabase isn't connected yet</h1>
        <p className="text-mute leading-relaxed">
          Accounts need a Supabase project connected. Add your project's URL and key to
          a <code className="bg-ink/5 px-1.5 py-0.5 rounded">.env.local</code> file (see
          the README), then restart the app.
        </p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-md mx-auto card p-9 space-y-6"
    >
      <div className="text-center space-y-2">
        <div className="text-4xl" aria-hidden="true">🧠</div>
        <h1 className="text-2xl font-display font-medium">
          {mode === 'signin' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="text-mute">
          {mode === 'signin'
            ? 'Sign in to play and see your progress.'
            : 'It only takes a minute — your scores will be saved from here on.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5 text-left">
          <label htmlFor="email" className="font-display text-sm text-mute">Email</label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full text-lg border border-line rounded-2xl px-4 py-3.5 focus:border-teal transition-colors outline-none"
          />
        </div>
        <div className="space-y-1.5 text-left">
          <label htmlFor="password" className="font-display text-sm text-mute">Password</label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full text-lg border border-line rounded-2xl px-4 py-3.5 focus:border-teal transition-colors outline-none"
          />
        </div>

        {error && <p className="text-coral text-sm text-left">{error}</p>}
        {message && <p className="text-teal text-sm text-left">{message}</p>}

        <button type="submit" disabled={busy} className="btn btn-primary w-full text-lg py-4 disabled:opacity-50">
          {busy ? 'One moment…' : mode === 'signin' ? 'Sign in' : 'Create account'}
        </button>
      </form>

      <p className="text-center text-mute text-sm">
        {mode === 'signin' ? "Don't have an account yet? " : 'Already have an account? '}
        <button
          onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); setMessage(null) }}
          className="link-underline text-ink font-display"
        >
          {mode === 'signin' ? 'Create one' : 'Sign in'}
        </button>
      </p>
    </motion.div>
  )
}