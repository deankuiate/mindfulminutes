import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { recordSession } from '../lib/db.js'
import ResultCard from '../components/ResultCard.jsx'
import IntroScreen from '../components/IntroScreen.jsx'

const TRIALS = 5
const MIN_DELAY = 1200
const MAX_DELAY = 3500

function scoreForRT(ms) {
  const clamped = Math.max(300, Math.min(1200, ms))
  return Math.round(100 - ((clamped - 300) / (1200 - 300)) * 100)
}

export default function ReactionTap() {
  const [phase, setPhase] = useState('intro')
  const [trial, setTrial] = useState(0)
  const [times, setTimes] = useState([])
  const [result, setResult] = useState(null)
  const timeoutRef = useRef(null)
  const shownAtRef = useRef(0)

  const runTrial = useCallback(() => {
    setPhase('waiting')
    const delay = MIN_DELAY + Math.random() * (MAX_DELAY - MIN_DELAY)
    timeoutRef.current = setTimeout(() => {
      shownAtRef.current = performance.now()
      setPhase('ready')
    }, delay)
  }, [])

  const beginGame = useCallback(() => {
    setTrial(0)
    setTimes([])
    setResult(null)
    runTrial()
  }, [runTrial])

  function handleTap() {
    if (phase === 'waiting') {
      clearTimeout(timeoutRef.current)
      setPhase('tooSoon')
      setTimeout(() => runTrial(), 1200)
      return
    }
    if (phase === 'ready') {
      const rt = performance.now() - shownAtRef.current
      const nextTimes = [...times, rt]
      setTimes(nextTimes)
      const nextTrial = trial + 1
      setTrial(nextTrial)
      if (nextTrial >= TRIALS) {
        finish(nextTimes)
      } else {
        setTimeout(() => runTrial(), 500)
      }
    }
  }

  async function finish(finalTimes) {
    const avgRt = finalTimes.reduce((a, b) => a + b, 0) / finalTimes.length
    const score = scoreForRT(avgRt)
    const maxScore = 100
    await recordSession({
      game_id: 'reaction-tap',
      score,
      max_score: maxScore,
      accuracy: score / maxScore,
      reaction_ms: Math.round(avgRt)
    })
    setResult({ score, maxScore, avgRt: Math.round(avgRt) })
    setPhase('done')
  }

  if (phase === 'intro') {
    return (
      <IntroScreen
        emoji="☀️"
        color="sun"
        title="Sunbeam Tap"
        description={`A gray circle will turn into a sun — the moment it does, tap it as fast as you can! We'll do ${TRIALS} quick rounds.`}
        onStart={beginGame}
      />
    )
  }

  if (phase === 'done') {
    return (
      <ResultCard
        emoji="☀️"
        color="sun"
        title="Sunbeam Tap — Complete!"
        score={result.score}
        maxScore={result.maxScore}
        detail={`average reaction time: ${result.avgRt}ms`}
        onPlayAgain={beginGame}
      />
    )
  }

  return (
    <div className="text-center py-16 space-y-6">
      <p className="text-mute font-display">Round {Math.min(trial + 1, TRIALS)} of {TRIALS}</p>
      <div className="relative flex items-center justify-center">
        {phase === 'waiting' && (
          <motion.div
            className="absolute w-56 h-56 rounded-full border-2 border-ink/10"
            animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.15, 0.5] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          />
        )}
        <motion.button
          onClick={handleTap}
          aria-label={phase === 'ready' ? 'Tap the sun now' : 'Wait for it'}
          initial={false}
          animate={phase === 'ready' ? { scale: [0.85, 1.05, 1] } : { scale: 1 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          whileTap={{ scale: 0.92 }}
          className={`relative w-56 h-56 rounded-full flex items-center justify-center text-7xl transition-colors duration-300 ease-smooth border-4
            ${phase === 'ready' ? 'bg-sun border-sun shadow-lift' : 'bg-ink/[0.04] border-transparent hover:bg-ink/[0.07]'}
          `}
        >
          {phase === 'ready' ? '☀️' : phase === 'tooSoon' ? '⏳' : '·'}
        </motion.button>
      </div>
      <p className="text-mute">
        {phase === 'waiting' && 'Wait for the sun…'}
        {phase === 'ready' && 'Tap now!'}
        {phase === 'tooSoon' && 'Too soon! Wait for the sun this time.'}
      </p>
    </div>
  )
}