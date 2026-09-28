import { useEffect } from 'react'
import confetti from 'canvas-confetti'

const palette = {
  coral: ['#E8674F', '#FFD9CF', '#1C1B19'],
  teal: ['#3D8C86', '#D4EFEC', '#1C1B19'],
  grape: ['#7C63C9', '#E5DEFA', '#1C1B19'],
  sun: ['#E0A83E', '#FBEBC7', '#1C1B19'],
  blush: ['#D9698A', '#FADCE5', '#1C1B19']
}

export default function Confetti({ good = true, color = 'coral' }) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !good) return

    confetti({
      particleCount: 70,
      spread: 65,
      startVelocity: 32,
      gravity: 1.1,
      origin: { y: 0.35 },
      colors: palette[color] || palette.coral,
      scalar: 0.9
    })
  }, [good, color])

  return null
}