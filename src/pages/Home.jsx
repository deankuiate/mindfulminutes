import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GAMES } from '../lib/games.js'
import GameCard from '../components/GameCard.jsx'

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 }
}

export default function Home() {
  return (
    <div className="space-y-24">
      {/* Hero */}
      <motion.section
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        className="text-center space-y-7 pt-6"
      >
        <motion.div variants={fadeUp} className="flex justify-center gap-4 text-3xl" aria-hidden="true">
          {['🌷', '🔢', '✨', '☀️', '🙂'].map((e, i) => (
            <span key={e} className="float" style={{ animationDelay: `${i * 0.4}s` }}>{e}</span>
          ))}
        </motion.div>
        <motion.h1
          variants={fadeUp}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-6xl font-display font-medium leading-[1.1] tracking-tight"
        >
          Five small games.<br />
          <span className="text-mute">One gentle way to watch over your memory.</span>
        </motion.h1>
        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl mx-auto text-lg text-mute leading-relaxed"
        >
          Mindful Minutes turns five real, research-based memory tests into short,
          friendly games. Play a couple of minutes a day, and we'll quietly keep
          track — so you and your doctor always have the real picture.
        </motion.p>
        <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3 pt-2">
          <Link to="/games" className="btn btn-primary text-lg px-8 py-4">
            Start playing
          </Link>
          <Link to="/science" className="btn btn-outline text-lg px-8 py-4">
            See the science
          </Link>
        </motion.div>
      </motion.section>

      {/* Why it's structured this way */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="card p-10 space-y-6"
      >
        <h2 className="text-2xl font-display font-medium">Why this app is built the way it is</h2>
        <p className="text-mute leading-relaxed">
          Nothing here was picked at random — every screen solves one specific
          problem in memory-screening tools built for older adults:
        </p>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
          {[
            {
              t: 'Five games, not one.',
              d: 'Real memory has several independent parts — verbal recall, working memory, visuospatial memory, processing speed, and associative memory. Each game targets a different, well-established clinical task.'
            },
            {
              t: 'Large text, big buttons.',
              d: 'Vision and fine-motor changes are common with age. Every tap target is 44px+, text defaults to 18px+, and color is never the only signal.'
            },
            {
              t: 'Trends over single scores.',
              d: 'One bad day doesn\u2019t mean anything. The Check-In waits for six sessions and only ever flags a sustained downward trend.'
            },
            {
              t: 'A nudge, never a diagnosis.',
              d: 'The most this app will ever say is "mention this to your doctor." It adds useful data to a real conversation, not a replacement for one.'
            }
          ].map((item) => (
            <div key={item.t}>
              <h3 className="font-display font-medium mb-1.5">{item.t}</h3>
              <p className="text-mute text-[0.95rem] leading-relaxed">{item.d}</p>
            </div>
          ))}
        </div>
        <Link to="/science" className="link-underline inline-block text-teal font-display">
          Read the full evidence behind each game →
        </Link>
      </motion.section>

      {/* Game grid */}
      <section className="space-y-8">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-display font-medium text-center"
        >
          Pick a game to play
        </motion.h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {GAMES.map((game, i) => (
            <GameCard key={game.id} game={game} index={i} />
          ))}
        </div>
      </section>
    </div>
  )
}
