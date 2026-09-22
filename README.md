# 🧠 Mindful Minutes

Five short, colorful memory mini-games for older adults modeled on a
real, published cognitive-assessment tasks!

Built with **React + Vite + Tailwind CSS**, ready to deploy to **Vercel** or
**Netlify**, with an optional **Supabase** backend for real accounts and
persistent, cross-device score history.

---

## What's inside

| Game | Domain tested | Based on |
|---|---|---|
| 🌷 Garden of Words | Verbal / episodic memory | Rey Auditory Verbal Learning Test (RAVLT) |
| 🔢 Number Nest | Working memory | WAIS Digit Span |
| ✨ Firefly Path | Visuospatial short-term memory | Corsi Block-Tapping Test |
| ☀️ Sunbeam Tap | Processing speed / attention | Simple reaction-time task |
| 🙂 Friendly Faces | Associative / episodic memory | Face-Name Associative Memory Test (FNAME) |

Every game, color, text size, and threshold in this app is a deliberate
choice — the full reasoning lives on the in-app **`Science`** page, which doubles as documentation for anyone reviewing or extending this project.


---

## Why the assessment is deliberately limited

**This app is a screening companion, not a diagnostic tool**, and it's
built so it structurally can't become one. `MindfulMinutes` only
ever produces one of three outcomes:

1. Not enough data yet (fewer than 6 sessions, or fewer than 3 per game)
2. Scores look stable
3. Scores have shown a sustained downward trend — worth mentioning at your
   next doctor's visit

There is no code path that outputs a diagnosis, a risk score, or a
condition name. A single low score never triggers anything — only a
pattern sustained across several sessions does. The goal is to hand a
doctor better longitudinal information going into a real appointment, not
to replace one.

## Accessibility choices

- High-contrast focus outlines on every interactive element
- Color is never the only signal — every game also has a distinct icon and
  label
- Short game sessions (1–3 minutes) to reduce fatigue

## License

MIT — do whatever's useful with it.
