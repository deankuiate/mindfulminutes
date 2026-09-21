import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const textColor = {
  coral: 'text-coral',
  teal: 'text-teal',
  grape: 'text-grape',
  sun: 'text-sun',
  blush: 'text-blush'
}

const borderColor = {
  coral: 'group-hover:border-coral/40',
  teal: 'group-hover:border-teal/40',
  grape: 'group-hover:border-grape/40',
  sun: 'group-hover:border-sun/40',
  blush: 'group-hover:border-blush/40'
}

export default function GameCard({ game, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={game.path}
        className={`group card card-hover ${borderColor[game.color]} p-7 flex flex-col gap-5 h-full`}
      >
        <div className="flex items-start justify-between">
          <span
            className="text-3xl transition-transform duration-300 ease-smooth group-hover:scale-110 group-hover:-rotate-6"
            aria-hidden="true"
          >
            {game.emoji}
          </span>
          <span
            className={`text-sm font-display ${textColor[game.color]} opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-smooth`}
          >
            Play →
          </span>
        </div>
        <div>
          <h3 className="text-xl font-display font-medium">{game.name}</h3>
          <p className="text-mute mt-1.5 leading-snug">{game.tagline}</p>
        </div>
        <div className="text-xs uppercase tracking-wide text-mute/70 mt-auto pt-4 border-t border-line">
          {game.domain}
        </div>
      </Link>
    </motion.div>
  )
}
