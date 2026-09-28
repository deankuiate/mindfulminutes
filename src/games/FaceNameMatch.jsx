import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { recordSession } from '../lib/db.js'
import ResultCard from '../components/ResultCard.jsx'
import IntroScreen from '../components/IntroScreen.jsx'

const PEOPLE_POOL = [
  { emoji: '👵', name: 'Rosa' },
  { emoji: '👴', name: 'Walter' },
  { emoji: '👩', name: 'Mei' },
  { emoji: '👨', name: 'Kofi' },
  { emoji: '👱‍♀️', name: 'Elsie' },
  { emoji: '🧔', name: 'Ravi' },
  { emoji: '👩‍🦳', name: 'June' },
  { emoji: '👨‍🦳', name: 'Otto' }
]

const STUDY_COUNT = 5
const STUDY_SECONDS = 3

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function FaceNameMatch() {
  const [phase, setPhase] = useState('intro')
  const [people, setPeople] = useState([])
  const [studyIndex, setStudyIndex] = useState(0)
  const [quizOrder, setQuizOrder] = useState([])
  const [quizIndex, setQuizIndex] = useState(0)
  const [options, setOptions] = useState([])
  const [correctCount, setCorrectCount] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [result, setResult] = useState(null)

  const beginGame = useCallback(() => {
    const chosen = shuffle(PEOPLE_POOL).slice(0, STUDY_COUNT)
    setPeople(chosen)
    setStudyIndex(0)
    setCorrectCount(0)
    setResult(null)
    setPhase('study')
  }, [])

  function nextStudy() {
    if (studyIndex + 1 >= people.length) {
      const order = shuffle(people.map((_, i) => i))
      setQuizOrder(order)
      setQuizIndex(0)
      setupQuizOptions(order[0])
      setPhase('quiz')
    } else {
      setStudyIndex((i) => i + 1)
    }
  }

  function setupQuizOptions(personIdx) {
    const correct = people[personIdx]
    const distractors = shuffle(PEOPLE_POOL.filter((p) => p.name !== correct.name)).slice(0, 3)
    setOptions(shuffle([correct, ...distractors]))
    setFeedback(null)
  }

  async function handleAnswer(name) {
    const person = people[quizOrder[quizIndex]]
    const isCorrect = name === person.name
    setFeedback(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) setCorrectCount((c) => c + 1)

    setTimeout(async () => {
      const nextIdx = quizIndex + 1
      if (nextIdx >= quizOrder.length) {
        const finalCorrect = isCorrect ? correctCount + 1 : correctCount
        await recordSession({
          game_id: 'face-name',
          score: finalCorrect,
          max_score: STUDY_COUNT,
          accuracy: finalCorrect / STUDY_COUNT
        })
        setResult({ score: finalCorrect, maxScore: STUDY_COUNT })
        setPhase('done')
      } else {
        setQuizIndex(nextIdx)
        setupQuizOptions(quizOrder[nextIdx])
      }
    }, 700)
  }

  if (phase === 'intro') {
    return (
      <IntroScreen
        emoji="🙂"
        color="blush"
        title="Friendly Faces"
        description={`You'll meet ${STUDY_COUNT} new friends, one at a time. Remember their names — then we'll show you their faces again and ask who's who.`}
        onStart={beginGame}
      />
    )
  }

  if (phase === 'study') {
    const person = people[studyIndex]
    return (
      <div className="text-center py-16 space-y-6">
        <p className="text-mute font-display">Meet your new friend…</p>
        <AnimatePresence mode="wait">
          <motion.div
            key={studyIndex}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="text-8xl" aria-hidden="true">{person.emoji}</div>
            <p className="text-4xl font-display font-semibold text-blush mt-2">{person.name}</p>
          </motion.div>
        </AnimatePresence>
        <button onClick={nextStudy} className="btn bg-blush text-white px-8 py-4 hover:-translate-y-0.5 transition-transform duration-300">
          {studyIndex + 1 >= people.length ? "I'm ready!" : 'Next friend'}
        </button>
      </div>
    )
  }

  if (phase === 'quiz') {
    const person = people[quizOrder[quizIndex]]
    return (
      <div className="max-w-md mx-auto text-center space-y-6 py-10">
        <p className="text-mute font-display">Who is this?</p>
        <motion.div
          key={quizIndex}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-8xl"
          aria-hidden="true"
        >
          {person.emoji}
        </motion.div>
        <div className="grid grid-cols-2 gap-3">
          {options.map((opt) => {
            const isCorrectOpt = feedback && opt.name === person.name
            const isWrongPick = feedback === 'wrong' && opt.name !== person.name
            return (
              <motion.button
                key={opt.name}
                onClick={() => handleAnswer(opt.name)}
                disabled={feedback !== null}
                animate={isCorrectOpt ? { scale: [1, 1.08, 1] } : {}}
                whileTap={!feedback ? { scale: 0.95 } : {}}
                transition={{ duration: 0.3 }}
                className={`px-4 py-4 rounded-2xl font-display border text-lg transition-all duration-200 ease-smooth
                  ${isCorrectOpt ? 'bg-teal/15 border-teal' : isWrongPick ? 'opacity-50' : 'bg-surface border-line hover:border-blush/40 hover:-translate-y-0.5'}
                `}
              >
                {opt.name}
              </motion.button>
            )
          })}
        </div>
        {feedback && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-lg"
          >
            {feedback === 'correct' ? '✅ That\u2019s right!' : `The answer was ${person.name}`}
          </motion.p>
        )}
      </div>
    )
  }

  return (
    <ResultCard
      emoji="🙂"
      color="blush"
      title="Friendly Faces — Complete!"
      score={result.score}
      maxScore={result.maxScore}
      detail="names remembered correctly"
      onPlayAgain={beginGame}
    />
  )
}