import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import Confetti from './Confetti.jsx'

function useCountUp(target, durationMs = 900) {
  const [value, setValue] = useState(0)
  const startRef = useRef(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setValue(target)
      return
    }
    let raf
    function tick(t) {
      if (startRef.current === null) startRef.current = t
      const progress = Math.min(1, (t - startRef.current) / durationMs)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, durationMs])

  return value
}

export default function ResultCard({ emoji, title, score, maxScore, detail, onPlayAgain, color = 'coral' }) {
  const pct = maxScore ? Math.round((score / maxScore) * 100) : 0
  const animatedScore = useCountUp(score)
  const didWell = maxScore ? score / maxScore >= 0.5 : true

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="card p-10 text-center space-y-5 max-w-lg mx-auto"
    >
      <Confetti good={didWell} color={color} />
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
      <p className="text-4xl font-display text-coral tabular-nums">{animatedScore} / {maxScore}</p>
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