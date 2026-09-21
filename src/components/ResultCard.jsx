import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function ResultCard({ emoji, title, score, maxScore, detail, onPlayAgain }) {
  const pct = maxScore ? Math.round((score / maxScore) * 100) : 0
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="card p-10 text-center space-y-5 max-w-lg mx-auto"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 12 }}
        className="text-6xl"
        aria-hidden="true"
      >
        {emoji}
      </motion.div>
      <h2 className="text-2xl font-display font-medium">{title}</h2>
      <p className="text-4xl font-display text-coral">{score} / {maxScore}</p>
      <p className="text-mute">{pct}% — {detail}</p>
      <p className="text-mute/60 text-sm">Saved to your progress ✔</p>
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <motion.button
          onClick={onPlayAgain}
          whileHover={{ y: -2 }}
          whileTap={{ y: 0, scale: 0.98 }}
          className="btn btn-primary"
        >
          Play again
        </motion.button>
        <Link to="/games" className="btn btn-outline">
          More games
        </Link>
        <Link to="/progress" className="btn btn-outline">
          View progress
        </Link>
      </div>
    </motion.div>
  )
}
