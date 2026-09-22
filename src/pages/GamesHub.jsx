import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GAMES } from '../lib/games.js'

const glow = {
  coral: 'group-hover:shadow-[0_0_0_1px_rgba(232,103,79,0.35),0_20px_40px_-12px_rgba(232,103,79,0.35)]',
  teal: 'group-hover:shadow-[0_0_0_1px_rgba(61,140,134,0.35),0_20px_40px_-12px_rgba(61,140,134,0.35)]',
  grape: 'group-hover:shadow-[0_0_0_1px_rgba(124,99,201,0.35),0_20px_40px_-12px_rgba(124,99,201,0.35)]',
  sun: 'group-hover:shadow-[0_0_0_1px_rgba(224,168,62,0.35),0_20px_40px_-12px_rgba(224,168,62,0.35)]',
  blush: 'group-hover:shadow-[0_0_0_1px_rgba(217,105,138,0.35),0_20px_40px_-12px_rgba(217,105,138,0.35)]'
}

const iconBg = {
  coral: 'bg-coral/10 group-hover:bg-coral/15',
  teal: 'bg-teal/10 group-hover:bg-teal/15',
  grape: 'bg-grape/10 group-hover:bg-grape/15',
  sun: 'bg-sun/10 group-hover:bg-sun/15',
  blush: 'bg-blush/10 group-hover:bg-blush/15'
}

const textColor = {
  coral: 'text-coral',
  teal: 'text-teal',
  grape: 'text-grape',
  sun: 'text-sun',
  blush: 'text-blush'
}

export default function GamesHub() {
  return (
    <div className="relative">
      {/* Decorative floating blobs — purely ambient, ignored by assistive tech */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10" aria-hidden="true">
        <div className="absolute -top-10 left-[8%] w-40 h-40 rounded-full bg-coral/10 blur-3xl float" />
        <div className="absolute top-40 right-[6%] w-56 h-56 rounded-full bg-grape/10 blur-3xl float" style={{ animationDelay: '1.2s' }} />
        <div className="absolute bottom-0 left-[30%] w-48 h-48 rounded-full bg-sun/10 blur-3xl float" style={{ animationDelay: '2.4s' }} />
      </div>

      <div className="max-w-2xl mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center space-y-3"
        >
          <h1 className="text-3xl sm:text-4xl font-display font-medium">Choose a game</h1>
          <p className="text-mute leading-relaxed">
            Each round only takes a minute or two. Play whichever sounds fun today —
            we track them all separately, so there's no wrong choice.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5 justify-items-center">
          {GAMES.map((game, i) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 24, scale: 0.9, rotate: i % 2 === 0 ? -3 : 3 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              transition={{
                duration: 0.55,
                delay: i * 0.09,
                type: 'spring',
                stiffness: 140,
                damping: 14
              }}
              whileHover={{ y: -6, rotate: i % 2 === 0 ? -1.5 : 1.5 }}
              className="w-full max-w-sm"
            >
              <Link
                to={game.path}
                className={`group card ${glow[game.color]} transition-all duration-300 ease-smooth p-7 flex flex-col items-center text-center gap-4 h-full`}
              >
                <motion.div
                  whileHover={{ scale: 1.15, rotate: [0, -8, 8, 0] }}
                  transition={{ duration: 0.5 }}
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-colors duration-300 ${iconBg[game.color]}`}
                  aria-hidden="true"
                >
                  {game.emoji}
                </motion.div>
                <div>
                  <h3 className="text-xl font-display font-medium">{game.name}</h3>
                  <p className="text-mute mt-1.5 leading-snug">{game.tagline}</p>
                </div>
                <div className="text-xs uppercase tracking-wide text-mute/70">{game.domain}</div>
                <span
                  className={`font-display text-sm ${textColor[game.color]} flex items-center gap-1 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-smooth`}
                >
                  Play now
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    →
                  </motion.span>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}