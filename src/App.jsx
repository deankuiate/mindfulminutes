import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import GamesHub from './pages/GamesHub.jsx'
import Progress from './pages/Progress.jsx'
import Assessment from './pages/Assessment.jsx'
import Science from './pages/Science.jsx'
import WordRecall from './games/WordRecall.jsx'
import DigitSpan from './games/DigitSpan.jsx'
import PatternMatch from './games/PatternMatch.jsx'
import ReactionTap from './games/ReactionTap.jsx'
import FaceNameMatch from './games/FaceNameMatch.jsx'

function PageFade({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl w-full mx-auto px-5 py-10">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageFade><Home /></PageFade>} />
            <Route path="/games" element={<PageFade><GamesHub /></PageFade>} />
            <Route path="/games/word-recall" element={<PageFade><WordRecall /></PageFade>} />
            <Route path="/games/digit-span" element={<PageFade><DigitSpan /></PageFade>} />
            <Route path="/games/pattern-match" element={<PageFade><PatternMatch /></PageFade>} />
            <Route path="/games/reaction-tap" element={<PageFade><ReactionTap /></PageFade>} />
            <Route path="/games/face-name" element={<PageFade><FaceNameMatch /></PageFade>} />
            <Route path="/progress" element={<PageFade><Progress /></PageFade>} />
            <Route path="/assessment" element={<PageFade><Assessment /></PageFade>} />
            <Route path="/science" element={<PageFade><Science /></PageFade>} />
          </Routes>
        </AnimatePresence>
      </main>
      <footer className="text-center text-mute text-sm py-10 border-t border-line mt-4">
        Mindful Minutes is a screening companion, not a medical device. Always talk to a doctor about memory concerns. 💛
      </footer>
    </div>
  )
}
