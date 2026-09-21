import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { getSessions } from '../lib/db.js'
import { getGameById, GAMES } from '../lib/games.js'

const strokeColor = {
  coral: '#E8674F',
  teal: '#3D8C86',
  grape: '#7C63C9',
  sun: '#E0A83E',
  blush: '#D9698A'
}

export default function ProgressPage() {
  const [sessions, setSessions] = useState(null)

  useEffect(() => {
    getSessions().then(setSessions)
  }, [])

  if (sessions === null) {
    return <p className="text-center text-mute py-20">Loading your progress…</p>
  }

  if (sessions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 py-20"
      >
        <p className="text-4xl float" aria-hidden="true">📈</p>
        <h1 className="text-2xl font-display font-medium">No games played yet</h1>
        <p className="text-mute">Play a round of any game and your progress will show up here.</p>
      </motion.div>
    )
  }

  const byGame = {}
  for (const s of sessions) {
    if (!byGame[s.game_id]) byGame[s.game_id] = []
    byGame[s.game_id].push(s)
  }

  const totalPoints = sessions.reduce((sum, s) => sum + (s.score || 0), 0)

  return (
    <div className="space-y-12">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-2"
      >
        <h1 className="text-3xl sm:text-4xl font-display font-medium">My Progress</h1>
        <p className="text-mute">
          {sessions.length} games played · {totalPoints} total points earned since you started
        </p>
      </motion.header>

      <div className="grid sm:grid-cols-2 gap-5">
        {GAMES.filter((g) => byGame[g.id]?.length).map((g, i) => (
          <GameChart key={g.id} game={g} sessions={byGame[g.id]} index={i} />
        ))}
      </div>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5 }}
        className="card p-7"
      >
        <h2 className="text-xl font-display font-medium mb-4">Full history</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-mute text-sm border-b border-line">
                <th className="py-2 pr-4 font-display font-medium">Date</th>
                <th className="py-2 pr-4 font-display font-medium">Game</th>
                <th className="py-2 pr-4 font-display font-medium">Score</th>
              </tr>
            </thead>
            <tbody>
              {[...sessions].reverse().map((s) => (
                <tr key={s.id} className="border-b border-line/70 hover:bg-ink/[0.02] transition-colors">
                  <td className="py-2.5 pr-4 text-mute">
                    {new Date(s.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-2.5 pr-4">{getGameById(s.game_id)?.name || s.game_id}</td>
                  <td className="py-2.5 pr-4 font-display">{s.score} / {s.max_score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>
    </div>
  )
}

function GameChart({ game, sessions, index }) {
  const data = sessions.map((s, i) => ({
    round: i + 1,
    score: s.score,
    date: new Date(s.created_at).toLocaleDateString()
  }))
  const color = strokeColor[game.color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="card p-6"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl" aria-hidden="true">{game.emoji}</span>
        <h3 className="font-display font-medium text-lg">{game.name}</h3>
      </div>
      <ResponsiveContainer width="100%" height={190}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1C1B1912" vertical={false} />
          <XAxis dataKey="round" tick={{ fontSize: 12, fill: '#6B6862' }} axisLine={{ stroke: '#E8E5DE' }} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#6B6862' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: '1px solid #E8E5DE', fontFamily: 'Nunito' }}
            formatter={(value) => [`${value} points`, 'Score']}
            labelFormatter={(label, payload) => payload?.[0]?.payload?.date || `Round ${label}`}
          />
          <Line type="monotone" dataKey="score" stroke={color} strokeWidth={2.5} dot={{ r: 3.5, fill: color }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
