import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { recordSession } from '../lib/db.js'
import ResultCard from '../components/ResultCard.jsx'
import IntroScreen from '../components/IntroScreen.jsx'

const GRID_SIZE = 9
const START_LENGTH = 3
const MAX_LENGTH = 8
const FLASH_MS = 650
const GAP_MS = 300

function randomSequence(len) {
  const seq = []
  while (seq.length < len) {
    const cell = Math.floor(Math.random() * GRID_SIZE)
    if (seq[seq.length - 1] !== cell) seq.push(cell)
  }
  return seq
}

export default function PatternMatch() {
  const [phase, setPhase] = useState('intro')
  const [length, setLength] = useState(START_LENGTH)
  const [sequence, setSequence] = useState([])
  const [litIndex, setLitIndex] = useState(-1)
  const [userSeq, setUserSeq] = useState([])
  const [best, setBest] = useState(0)
  const [result, setResult] = useState(null)
  const [wrongFlash, setWrongFlash] = useState(false)

  const startRound = useCallback((len) => {
    setSequence(randomSequence(len))
    setUserSeq([])
    setLitIndex(-1)
    setWrongFlash(false)
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
    let i = 0
    setLitIndex(sequence[0])
    const interval = setInterval(() => {
      i++
      if (i >= sequence.length) {
        clearInterval(interval)
        setLitIndex(-1)
        setTimeout(() => setPhase('input'), 200)
        return
      }
      setLitIndex(-1)
      setTimeout(() => setLitIndex(sequence[i]), GAP_MS / 2)
    }, FLASH_MS + GAP_MS)
    return () => clearInterval(interval)
  }, [phase, sequence])

  async function handleCellClick(cell) {
    if (phase !== 'input') return
    const nextUserSeq = [...userSeq, cell]
    const idx = nextUserSeq.length - 1

    if (cell !== sequence[idx]) {
      setWrongFlash(true)
      setTimeout(() => finish(best), 500)
      return
    }

    setUserSeq(nextUserSeq)

    if (nextUserSeq.length === sequence.length) {
      const newBest = Math.max(best, length)
      setBest(newBest)
      if (length + 1 > MAX_LENGTH) {
        await finish(newBest)
        return
      }
      const nextLen = length + 1
      setLength(nextLen)
      setTimeout(() => startRound(nextLen), 500)
    }
  }

  async function finish(finalBest) {
    const score = finalBest
    const maxScore = MAX_LENGTH
    await recordSession({
      game_id: 'pattern-match',
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
        emoji="✨"
        color="grape"
        title="Firefly Path"
        description="Watch the fireflies light up in order, then tap the same tiles in the same order. Each round adds one more step to the path."
        onStart={beginGame}
      />
    )
  }

  if (phase === 'done') {
    return (
      <ResultCard
        emoji="✨"
        color="grape"
        title="Firefly Path — Complete!"
        score={result.score}
        maxScore={result.maxScore}
        detail="longest path remembered"
        onPlayAgain={beginGame}
      />
    )
  }

  return (
    <div className="max-w-sm mx-auto text-center space-y-6 py-6">
      <h2 className="text-xl font-display font-semibold">
        {phase === 'show' ? 'Watch the path…' : wrongFlash ? 'Not quite — nice try!' : 'Your turn — repeat the path'}
      </h2>
      <div className="grid grid-cols-3 gap-3 mx-auto w-fit">
        {Array.from({ length: GRID_SIZE }).map((_, i) => {
          const isLit = phase === 'show' && litIndex === i
          const isChosen = phase === 'input' && userSeq.includes(i)
          return (
            <motion.button
              key={i}
              onClick={() => handleCellClick(i)}
              disabled={phase !== 'input'}
              aria-label={`tile ${i + 1}`}
              whileTap={phase === 'input' ? { scale: 0.92 } : {}}
              animate={isLit ? { scale: [1, 1.08, 1.05] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`w-20 h-20 rounded-2xl border transition-all duration-200 ease-smooth text-3xl flex items-center justify-center
                ${isLit ? 'bg-grape border-grape shadow-lift' : isChosen ? 'bg-grape/15 border-grape' : 'bg-surface border-line hover:border-grape/30'}
                ${wrongFlash ? 'animate-pulse' : ''}
              `}
            >
              {(isLit || isChosen) && <span aria-hidden="true">✨</span>}
            </motion.button>
          )
        })}
      </div>
      <p className="text-ink/40 text-sm">Path length: {length}</p>
    </div>
  )
}