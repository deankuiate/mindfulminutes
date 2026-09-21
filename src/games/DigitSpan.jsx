import { useState, useEffect, useCallback } from 'react'
import { recordSession } from '../lib/db.js'
import ResultCard from '../components/ResultCard.jsx'
import IntroScreen from '../components/IntroScreen.jsx'

const START_LENGTH = 3
const MAX_LENGTH = 9
const DIGIT_DISPLAY_MS = 900

function randomDigits(len) {
  return Array.from({ length: len }, () => Math.floor(Math.random() * 10))
}

export default function DigitSpan() {
  const [phase, setPhase] = useState('intro') // intro | show | input | done
  const [length, setLength] = useState(START_LENGTH)
  const [sequence, setSequence] = useState([])
  const [showIndex, setShowIndex] = useState(0)
  const [input, setInput] = useState('')
  const [best, setBest] = useState(0)
  const [result, setResult] = useState(null)

  const startRound = useCallback((len) => {
    setSequence(randomDigits(len))
    setShowIndex(0)
    setInput('')
    setPhase('show')
  }, [])

  const beginGame = useCallback(() => {
    setLength(START_LENGTH)
    setBest(0)
    setResult(null)
    startRound(START_LENGTH)
  }, [startRound])

  useEffect(() => {
    if (phase !== 'show') return
    if (showIndex >= sequence.length) {
      const t = setTimeout(() => setPhase('input'), 300)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setShowIndex((i) => i + 1), DIGIT_DISPLAY_MS)
    return () => clearTimeout(t)
  }, [phase, showIndex, sequence.length])

  async function submit() {
    const correct = input.replace(/\D/g, '') === sequence.join('')
    if (correct) {
      const newBest = Math.max(best, length)
      setBest(newBest)
      if (length + 1 > MAX_LENGTH) {
        await finish(newBest)
        return
      }
      const nextLen = length + 1
      setLength(nextLen)
      startRound(nextLen)
    } else {
      await finish(best)
    }
  }

  async function finish(finalBest) {
    const score = finalBest
    const maxScore = MAX_LENGTH
    await recordSession({
      game_id: 'digit-span',
      score,
      max_score: maxScore,
      accuracy: score / maxScore
    })
    setResult({ score, maxScore })
    setPhase('done')
  }

  if (phase === 'intro') {
    return (
      <IntroScreen
        emoji="🔢"
        color="teal"
        title="Number Nest"
        description="Numbers will appear one at a time. When they stop, type the whole number back, in the same order. Each round adds one more digit."
        onStart={beginGame}
      />
    )
  }

  if (phase === 'show') {
    return (
      <div className="text-center py-24 space-y-6">
        <p className="text-ink/50 font-display">Watch closely…</p>
        <p className="text-7xl font-display font-semibold text-teal" aria-live="polite">
          {sequence[showIndex] ?? '✅'}
        </p>
        <p className="text-ink/40">Digit {Math.min(showIndex + 1, sequence.length)} of {sequence.length}</p>
      </div>
    )
  }

  if (phase === 'input') {
    return (
      <div className="max-w-sm mx-auto text-center space-y-6 py-10">
        <h2 className="text-2xl font-display font-semibold">Type it back</h2>
        <p className="text-ink/60">{sequence.length} digits — same order you saw them</p>
        <input
          type="tel"
          inputMode="numeric"
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value.replace(/\D/g, ''))}
          className="w-full text-center text-3xl font-display border border-line rounded-2xl px-4 py-4 focus:border-teal transition-colors outline-none"
          aria-label="Type the digits you remember"
        />
        <button
          onClick={submit}
          disabled={input.length === 0}
          className="btn bg-teal text-white text-lg px-8 py-4 hover:-translate-y-0.5 transition-transform duration-300 disabled:opacity-40 disabled:hover:translate-y-0"
        >
          Submit
        </button>
      </div>
    )
  }

  return (
    <ResultCard
      emoji="🔢"
      title="Number Nest — Complete!"
      score={result.score}
      maxScore={result.maxScore}
      detail="longest number remembered"
      onPlayAgain={beginGame}
    />
  )
}
