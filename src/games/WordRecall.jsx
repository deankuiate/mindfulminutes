import { useState, useEffect, useCallback } from 'react'
import { recordSession } from '../lib/db.js'
import ResultCard from '../components/ResultCard.jsx'
import IntroScreen from '../components/IntroScreen.jsx'

const WORD_BANK = [
  'GARDEN', 'RIVER', 'PENCIL', 'BASKET', 'CANDLE', 'PILLOW', 'VIOLIN', 'ORANGE',
  'BLANKET', 'WINDOW', 'BICYCLE', 'FEATHER', 'HAMMER', 'CHERRY', 'ISLAND', 'MITTEN'
]

const STUDY_COUNT = 6
const DISTRACTOR_COUNT = 6
const STUDY_SECONDS_PER_WORD = 2.2

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function WordRecall() {
  const [phase, setPhase] = useState('intro') // intro | study | recall | done
  const [studyWords, setStudyWords] = useState([])
  const [choices, setChoices] = useState([])
  const [selected, setSelected] = useState([])
  const [studyIndex, setStudyIndex] = useState(0)
  const [result, setResult] = useState(null)

  const setup = useCallback(() => {
    const pool = shuffle(WORD_BANK)
    const study = pool.slice(0, STUDY_COUNT)
    const distractors = pool.slice(STUDY_COUNT, STUDY_COUNT + DISTRACTOR_COUNT)
    setStudyWords(study)
    setChoices(shuffle([...study, ...distractors]))
    setSelected([])
    setStudyIndex(0)
    setResult(null)
    setPhase('study')
  }, [])

  useEffect(() => {
    if (phase !== 'study') return
    if (studyIndex >= studyWords.length) {
      const t = setTimeout(() => setPhase('recall'), 400)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setStudyIndex((i) => i + 1), STUDY_SECONDS_PER_WORD * 1000)
    return () => clearTimeout(t)
  }, [phase, studyIndex, studyWords.length])

  function toggleChoice(word) {
    setSelected((prev) => (prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]))
  }

  async function submit() {
    const correct = selected.filter((w) => studyWords.includes(w)).length
    const falsePositives = selected.filter((w) => !studyWords.includes(w)).length
    const score = Math.max(0, correct - falsePositives)
    const maxScore = STUDY_COUNT

    const session = await recordSession({
      game_id: 'word-recall',
      score,
      max_score: maxScore,
      accuracy: score / maxScore
    })
    setResult({ score, maxScore })
    setPhase('done')
    return session
  }

  if (phase === 'intro') {
    return (
      <IntroScreen
        emoji="🌷"
        title="Garden of Words"
        description={`You'll see ${STUDY_COUNT} words, one at a time. Try to remember them. Then we'll show you a bigger list — pick out just the words you saw.`}
        onStart={setup}
      />
    )
  }

  if (phase === 'study') {
    const word = studyWords[studyIndex]
    return (
      <div className="text-center py-24 space-y-6">
        <p className="text-ink/50 font-display">Remember this word…</p>
        <p className="text-6xl font-display font-semibold text-coral" aria-live="polite">
          {word || '✅'}
        </p>
      </div>
    )
  }

  if (phase === 'recall') {
    return (
      <div className="max-w-xl mx-auto space-y-6">
        <h2 className="text-2xl font-display font-semibold text-center">Which words did you see?</h2>
        <p className="text-center text-ink/60">Tap every word you remember from the list.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {choices.map((word) => (
            <button
              key={word}
              onClick={() => toggleChoice(word)}
              className={`px-4 py-4 rounded-2xl font-display border transition-all duration-200 ease-smooth ${
                selected.includes(word)
                  ? 'bg-coral text-white border-coral shadow-soft'
                  : 'bg-surface border-line text-ink hover:border-coral/40 hover:-translate-y-0.5'
              }`}
            >
              {word}
            </button>
          ))}
        </div>
        <div className="text-center">
          <button onClick={submit} className="btn btn-primary text-lg px-8 py-4">
            Submit answers
          </button>
        </div>
      </div>
    )
  }

  return (
    <ResultCard
      emoji="🌷"
      title="Garden of Words — Complete!"
      score={result.score}
      maxScore={result.maxScore}
      detail="words correctly remembered"
      onPlayAgain={setup}
    />
  )
}
