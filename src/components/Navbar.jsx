import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { to: '/', label: 'Home' },
  { to: '/games', label: 'Games' },
  { to: '/progress', label: 'My Progress' },
  { to: '/assessment', label: 'Check-In' },
  { to: '/science', label: 'The Science' }
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  // Close the mobile menu whenever the route changes
  useEffect(() => setOpen(false), [location.pathname])

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-30 bg-paper/85 backdrop-blur-md border-b border-line"
    >
      <nav className="max-w-5xl mx-auto flex items-center justify-between gap-4 px-5 py-5">
        <NavLink to="/" className="flex items-center gap-2 text-xl font-display font-medium text-ink group shrink-0">
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-300 ease-smooth group-hover:rotate-12"
          >
            🧠
          </span>
          <span>Mindful Minutes</span>
        </NavLink>

        {/* Desktop nav — hidden below sm, plain underline links */}
        <ul className="hidden sm:flex flex-wrap gap-1 md:gap-2">
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

        {/* Mobile menu button — hidden from sm up */}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-nav-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="sm:hidden flex flex-col justify-center items-center gap-1.5 w-11 h-11 rounded-full border border-line shrink-0"
        >
          <motion.span
            animate={{ rotate: open ? 45 : 0, y: open ? 6 : 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="block w-5 h-0.5 bg-ink rounded-full"
          />
          <motion.span
            animate={{ opacity: open ? 0 : 1 }}
            transition={{ duration: 0.2 }}
            className="block w-5 h-0.5 bg-ink rounded-full"
          />
          <motion.span
            animate={{ rotate: open ? -45 : 0, y: open ? -6 : 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="block w-5 h-0.5 bg-ink rounded-full"
          />
        </button>
      </nav>

      {/* Mobile dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="sm:hidden overflow-hidden border-b border-line bg-paper"
          >
            <ul className="flex flex-col px-5 py-2">
              {links.map((l, i) => (
                <motion.li
                  key={l.to}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.25 }}
                >
                  <NavLink
                    to={l.to}
                    end={l.to === '/'}
                    className={({ isActive }) =>
                      `block py-3.5 font-display text-lg border-b border-line/60 last:border-b-0 ${
                        isActive ? 'text-ink' : 'text-mute'
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}