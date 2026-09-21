// Central source of truth for the five games. Each entry links a playable
// game to the specific, published cognitive-assessment task it's inspired
// by, so nothing in this app is an invented "brain game" — every mechanic
// traces to a real, peer-reviewed instrument.
export const GAMES = [
  {
    id: 'word-recall',
    name: 'Garden of Words',
    tagline: 'Remember a short list, then find it again.',
    color: 'coral',
    emoji: '🌷',
    domain: 'Verbal / episodic memory',
    basedOn: 'Rey Auditory Verbal Learning Test (RAVLT)',
    citation:
      'Schmidt, M. (1996). Rey Auditory Verbal Learning Test. Western Psychological Services. Word-list recall is one of the most widely used and validated measures of episodic verbal memory in aging research.',
    path: '/games/word-recall'
  },
  {
    id: 'digit-span',
    name: 'Number Nest',
    tagline: 'Watch a number appear, then type it back.',
    color: 'teal',
    emoji: '🔢',
    domain: 'Working memory',
    basedOn: 'Digit Span subtest (Wechsler Adult Intelligence Scale)',
    citation:
      'Wechsler, D. (2008). WAIS-IV. Digit span (forward and backward) is a standard clinical measure of attention and working-memory capacity.',
    path: '/games/digit-span'
  },
  {
    id: 'pattern-match',
    name: 'Firefly Path',
    tagline: 'Watch the lights blink, then repeat the pattern.',
    color: 'grape',
    emoji: '✨',
    domain: 'Visuospatial short-term memory',
    basedOn: 'Corsi Block-Tapping Test',
    citation:
      'Corsi, P.M. (1972). Human memory and the medial temporal region of the brain. The block-tapping paradigm is a standard tool for assessing visuospatial short-term memory span.',
    path: '/games/pattern-match'
  },
  {
    id: 'reaction-tap',
    name: 'Sunbeam Tap',
    tagline: 'Tap the sun the moment it appears.',
    color: 'sun',
    emoji: '☀️',
    domain: 'Processing speed / attention',
    basedOn: 'Simple & choice reaction-time tasks',
    citation:
      'Deary, I.J. et al. (2001). Processing speed, reaction time and mental ability. Reaction-time tasks are a well-established, sensitive marker of age-related change in processing speed.',
    path: '/games/reaction-tap'
  },
  {
    id: 'face-name',
    name: 'Friendly Faces',
    tagline: 'Meet new friends, then remember their names.',
    color: 'blush',
    emoji: '🙂',
    domain: 'Associative / episodic memory',
    basedOn: 'Face-Name Associative Memory Test (FNAME)',
    citation:
      'Rentz, D.M. et al. (2011). Face-Name Associative Memory Test. Face-name pairing is a sensitive early marker used in preclinical Alzheimer\u2019s research because it stresses associative binding, one of the first abilities affected.',
    path: '/games/face-name'
  }
]

export function getGameById(id) {
  return GAMES.find((g) => g.id === id)
}
