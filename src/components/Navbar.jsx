import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'

const links = [
  { to: '/', label: 'Home' },
  { to: '/games', label: 'Games' },
  { to: '/progress', label: 'My Progress' },
  { to: '/assessment', label: 'Check-In' },
  { to: '/science', label: 'The Science' }
]

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-30 bg-paper/85 backdrop-blur-md border-b border-line"
    >
      <nav className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4 px-5 py-5">
        <NavLink to="/" className="flex items-center gap-2 text-xl font-display font-medium text-ink group">
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-300 ease-smooth group-hover:rotate-12"
          >
            🧠
          </span>
          <span>Mindful Minutes</span>
        </NavLink>
        <ul className="flex flex-wrap gap-1 sm:gap-2">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `link-underline px-3 py-2 font-display text-base ${
                    isActive ? 'text-ink is-active' : 'text-mute hover:text-ink'
                  }`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </motion.header>
  )
}
