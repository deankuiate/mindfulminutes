import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getSessions } from '../lib/db.js'
import { buildAssessment } from '../lib/assessment.js'

const statusStyles = {
  'more-data': { accent: 'border-l-sun', emoji: '🌱' },
  stable: { accent: 'border-l-teal', emoji: '💚' },
  declining: { accent: 'border-l-coral', emoji: '💛' }
}

export default function Assessment() {
  const [result, setResult] = useState(null)

  useEffect(() => {
    getSessions().then((sessions) => setResult(buildAssessment(sessions)))
  }, [])

  if (!result) {
    return <p className="text-center text-mute py-20">Looking at your sessions…</p>
  }

  const style = statusStyles[result.status]

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-2"
      >
        <h1 className="text-3xl sm:text-4xl font-display font-medium">Your Check-In</h1>
        <p className="text-mute">A gentle look at how your scores have been trending — not a diagnosis, just a heads-up.</p>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className={`card border-l-4 ${style.accent} p-9 text-center space-y-4`}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 12 }}
          className="text-5xl"
          aria-hidden="true"
        >
          {style.emoji}
        </motion.div>
        <p className="text-lg text-ink/90 leading-relaxed">{result.message}</p>
        {result.status === 'declining' && (
          <p className="text-sm text-mute">
            Affected games: {result.decliningGames.join(', ')}. Remember — lots of harmless
            things can cause this. This is worth a mention, not a worry.
          </p>
        )}
      </motion.div>

      {result.status !== 'more-data' && (
        <Link to="/progress" className="link-underline block text-center text-teal font-display">
          View your full progress chart →
        </Link>
      )}

      <div className="card p-6 text-sm text-mute space-y-2 leading-relaxed">
        <p><b className="font-display font-medium text-ink">How this works:</b> We wait for at least 6 completed games, spread across a
        few different sessions, before saying anything at all. Then we compare your most
        recent rounds of each game to your earliest rounds. A single bad day never
        triggers a flag — only a sustained pattern does.</p>
        <p>This tool is not a medical device and cannot diagnose any condition. If you
        have any concern about your memory, please talk to a doctor regardless of what
        this page says.</p>
      </div>
    </div>
  )
}
