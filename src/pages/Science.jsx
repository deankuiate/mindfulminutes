import { motion } from 'framer-motion'
import { GAMES } from '../lib/games.js'

const borderColor = {
  coral: 'hover:border-coral/40',
  teal: 'hover:border-teal/40',
  grape: 'hover:border-grape/40',
  sun: 'hover:border-sun/40',
  blush: 'hover:border-blush/40'
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 }
}

export default function Science() {
  return (
    <div className="space-y-16 max-w-3xl mx-auto">
      <motion.header
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-3"
      >
        <h1 className="text-3xl sm:text-4xl font-display font-medium">The evidence behind Mindful Minutes</h1>
        <p className="text-mute leading-relaxed">
          Every game, color choice, and threshold in this app was a deliberate
          decision. Here's the reasoning, game by game and choice by choice.
        </p>
      </motion.header>

      <section className="space-y-4">
        <h2 className="text-2xl font-display font-medium">The five games, and what they're modeled on</h2>
        <div className="grid gap-4">
          {GAMES.map((g, i) => (
            <motion.div
              key={g.id}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-40px' }}
              variants={fadeUp}
              transition={{ duration: 0.4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className={`card card-hover ${borderColor[g.color]} p-6 space-y-2`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl" aria-hidden="true">{g.emoji}</span>
                <h3 className="text-xl font-display font-medium">{g.name}</h3>
              </div>
              <p className="text-mute text-sm uppercase tracking-wide">{g.domain}</p>
              <p className="text-ink/90"><b className="font-display font-medium">Based on:</b> {g.basedOn}</p>
              <p className="text-mute text-sm leading-relaxed">{g.citation}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
        className="card p-9 space-y-7"
      >
        <h2 className="text-2xl font-display font-medium">Design decisions, explained</h2>

        <div className="space-y-1.5">
          <h3 className="font-display font-medium text-lg">Why five separate games instead of one score</h3>
          <p className="text-mute leading-relaxed">
            Cognition isn't one thing. Verbal memory, working memory, visuospatial memory,
            processing speed, and associative memory are treated as at least partly
            independent domains in the neuropsychological literature, and they don't
            always decline together. Testing only one domain (as most "brain training"
            apps do) misses changes that show up in another.
          </p>
        </div>

        <div className="space-y-1.5">
          <h3 className="font-display font-medium text-lg">Why the Check-In waits for 6+ sessions</h3>
          <p className="text-mute leading-relaxed">
            Cognitive test scores are naturally noisy — sleep, stress, time of day, and
            practice effects all move a single score by a meaningful amount. A trend
            line built from at least three sessions per game, across six sessions
            total, mirrors how real clinical follow-up works: a single low score is
            rarely acted on; a consistent trend is.
          </p>
        </div>

        <div className="space-y-1.5">
          <h3 className="font-display font-medium text-lg">Why the assessment is deliberately limited</h3>
          <p className="text-mute leading-relaxed">
            This app can never diagnose anything, and it's built so that it structurally
            can't drift toward doing so. The assessment logic (see{' '}
            <code className="bg-ink/5 px-1.5 py-0.5 rounded text-[0.9em]">Check-In Page</code>) only
            ever returns "not enough data yet," "trend looks stable," or "trend has been
            dropping — worth mentioning to your doctor." There is no code path that
            produces a diagnosis or a risk percentage.
          </p>
        </div>

        <div className="space-y-1.5">
          <h3 className="font-display font-medium text-lg">Why the visual design looks the way it does</h3>
          <p className="text-mute leading-relaxed">
            Large text, high-contrast focus states, 44px+ tap targets, and a single
            primary action per screen all follow standard accessible-design guidance
            for older adults. A restrained, mostly-neutral palette with one quiet
            accent color per game keeps the interface calm and easy to scan, while
            small motion cues (hover states, gentle entrance animation) confirm what's
            interactive without adding visual noise.
          </p>
        </div>
      </motion.section>

      <p className="text-center text-mute/70 text-sm pb-6">
        Sources are summarized here for context and are not a substitute for reading
        the original instruments and their validation studies.
      </p>
    </div>
  )
}
