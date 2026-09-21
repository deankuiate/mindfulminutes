// IMPORTANT — read before changing this file:
// This app is a screening *nudge*, not a diagnostic tool. Nothing here
// should ever be phrased as "you have [condition]". The only outputs are:
//  1. "keep playing, not enough data yet"
//  2. "your trend looks stable/typical"
//  3. "your trend has been dropping — mention it at your next doctor visit"
// That third message is the ceiling. See README.md > "Why the assessment
// is deliberately limited" for the reasoning.

const MIN_SESSIONS_PER_GAME = 3
const MIN_TOTAL_SESSIONS = 6

// Normalize a raw score to 0-100 using each game's own max, so games with
// different scales can be combined into one composite trend line.
function normalize(session) {
  if (!session.max_score) return null
  return Math.max(0, Math.min(100, (session.score / session.max_score) * 100))
}

// Simple linear regression slope over normalized scores in chronological
// order. A negative slope means scores are trending down over time.
function trendSlope(values) {
  const n = values.length
  if (n < 2) return 0
  const xs = values.map((_, i) => i)
  const meanX = xs.reduce((a, b) => a + b, 0) / n
  const meanY = values.reduce((a, b) => a + b, 0) / n
  let num = 0
  let den = 0
  for (let i = 0; i < n; i++) {
    num += (xs[i] - meanX) * (values[i] - meanY)
    den += (xs[i] - meanX) ** 2
  }
  return den === 0 ? 0 : num / den
}

export function buildAssessment(sessions) {
  if (sessions.length < MIN_TOTAL_SESSIONS) {
    return {
      status: 'more-data',
      totalSessions: sessions.length,
      needed: MIN_TOTAL_SESSIONS,
      message: `Play a few more rounds! We like to see at least ${MIN_TOTAL_SESSIONS} completed games across a few different days before we show any kind of trend — that keeps a single off day from skewing things.`
    }
  }

  const byGame = {}
  for (const s of sessions) {
    if (!byGame[s.game_id]) byGame[s.game_id] = []
    const n = normalize(s)
    if (n !== null) byGame[s.game_id].push(n)
  }

  const perGameTrend = Object.entries(byGame)
    .filter(([, values]) => values.length >= MIN_SESSIONS_PER_GAME)
    .map(([gameId, values]) => ({
      gameId,
      slope: trendSlope(values),
      recentAvg: average(values.slice(-3)),
      earlyAvg: average(values.slice(0, 3)),
      count: values.length
    }))

  if (perGameTrend.length === 0) {
    return {
      status: 'more-data',
      totalSessions: sessions.length,
      needed: MIN_TOTAL_SESSIONS,
      message:
        'You\u2019ve played a good number of rounds, but spread across a few different games. Try playing the same game a few more times so we can compare it to itself over time.'
    }
  }

  const decliningGames = perGameTrend.filter(
    (g) => g.slope < -3 && g.earlyAvg - g.recentAvg > 10
  )

  const allSlopes = perGameTrend.map((g) => g.slope)
  const overallSlope = average(allSlopes)

  if (decliningGames.length >= 2 || (decliningGames.length >= 1 && overallSlope < -2)) {
    return {
      status: 'declining',
      totalSessions: sessions.length,
      decliningGames: decliningGames.map((g) => g.gameId),
      message:
        'Scores in a couple of your games have been drifting down over your last several sessions. That can happen for lots of harmless reasons \u2014 tiredness, a new routine, less practice \u2014 but it\u2019s worth mentioning at your next doctor visit, just so it\u2019s on record.'
    }
  }

  return {
    status: 'stable',
    totalSessions: sessions.length,
    message:
      'Your scores have been holding steady \u2014 nice and consistent across your recent sessions. Keep playing regularly; consistency is what makes this tracker useful over the months ahead.'
  }
}

function average(arr) {
  if (!arr.length) return 0
  return arr.reduce((a, b) => a + b, 0) / arr.length
}
