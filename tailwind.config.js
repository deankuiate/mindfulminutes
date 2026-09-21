/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Neutral base — the whole UI leans on this, color is reserved
        // for one small accent per game, never for backgrounds.
        paper: '#FAFAF7',
        surface: '#FFFFFF',
        ink: '#1C1B19',
        mute: '#6B6862',
        line: '#E8E5DE',
        // One quiet accent per game domain — desaturated on purpose,
        // so they read as a system rather than five separate "brands."
        coral: '#E8674F',
        teal: '#3D8C86',
        grape: '#7C63C9',
        sun: '#E0A83E',
        blush: '#D9698A'
      },
      fontFamily: {
        display: ['"Fredoka"', 'system-ui', 'sans-serif'],
        body: ['"Nunito"', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        xl2: '1.25rem'
      },
      boxShadow: {
        soft: '0 1px 2px rgba(28,27,25,0.04), 0 8px 24px -12px rgba(28,27,25,0.10)',
        lift: '0 20px 40px -16px rgba(28,27,25,0.18)'
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)'
      }
    }
  },
  plugins: []
}
