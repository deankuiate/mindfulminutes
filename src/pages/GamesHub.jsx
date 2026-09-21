import { motion } from 'framer-motion'
import { GAMES } from '../lib/games.js'
import GameCard from '../components/GameCard.jsx'

export default function GamesHub() {
  return (
    <div className="space-y-10">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center space-y-3"
      >
        <h1 className="text-3xl sm:text-4xl font-display font-medium">Choose a game</h1>
        <p className="text-mute max-w-xl mx-auto leading-relaxed">
          Each round only takes a minute or two. Play whichever sounds fun today —
          we track them all separately, so there's no wrong choice.
        </p>
      </motion.div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {GAMES.map((game, i) => (
          <GameCard key={game.id} game={game} index={i} />
        ))}
      </div>
    </div>
  )
}
