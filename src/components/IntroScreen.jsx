import { motion } from 'framer-motion'

const textColor = {
  coral: 'text-coral',
  teal: 'text-teal',
  grape: 'text-grape',
  sun: 'text-sun',
  blush: 'text-blush'
}

export default function IntroScreen({ emoji, title, description, onStart, color = 'coral' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-lg mx-auto text-center space-y-7 py-14"
    >
      <div className="text-6xl float" aria-hidden="true">{emoji}</div>
      <div className="space-y-3">
        <p className={`font-display text-sm uppercase tracking-wide ${textColor[color]}`}>Ready?</p>
        <h1 className="text-3xl sm:text-4xl font-display font-medium">{title}</h1>
        <p className="text-mute text-lg leading-relaxed">{description}</p>
      </div>
      <motion.button
        onClick={onStart}
        whileHover={{ y: -2 }}
        whileTap={{ y: 0, scale: 0.98 }}
        className="btn btn-primary text-lg px-9 py-4"
      >
        Start
      </motion.button>
    </motion.div>
  )
}
