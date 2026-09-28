import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AuthProvider } from '/lib/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
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

function Protected({ children }) {
  return (
    <ProtectedRoute>
      <PageFade>{children}</PageFade>
    </ProtectedRoute>
  )
}

export default function App() {
  const location = useLocation()

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-5xl w-full mx-auto px-5 py-10">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageFade><Home /></PageFade>} />
              <Route path="/login" element={<PageFade><Login /></PageFade>} />
              <Route path="/science" element={<PageFade><Science /></PageFade>} />

              <Route path="/games" element={<Protected><GamesHub /></Protected>} />
              <Route path="/games/word-recall" element={<Protected><WordRecall /></Protected>} />
              <Route path="/games/digit-span" element={<Protected><DigitSpan /></Protected>} />
              <Route path="/games/pattern-match" element={<Protected><PatternMatch /></Protected>} />
              <Route path="/games/reaction-tap" element={<Protected><ReactionTap /></Protected>} />
              <Route path="/games/face-name" element={<Protected><FaceNameMatch /></Protected>} />
              <Route path="/progress" element={<Protected><Progress /></Protected>} />
              <Route path="/assessment" element={<Protected><Assessment /></Protected>} />
            </Routes>
          </AnimatePresence>
        </main>
        <footer className="text-center text-mute text-sm py-10 border-t border-line mt-4">
          Mindful Minutes is a screening companion, not a medical device. Always talk to a doctor about memory concerns. 💛
        </footer>
      </div>
    </AuthProvider>
  )
}