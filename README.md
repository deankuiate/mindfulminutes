# 🧠 Mindful Minutes

Five short, colorful memory mini-games for older adults — each modeled on a
real, published cognitive-assessment task — plus a progress dashboard and a
gentle, non-diagnostic "should I mention this to my doctor?" check-in.

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
choice — the full reasoning lives on the in-app **`/science`** page
(`src/pages/Science.jsx`), which doubles as documentation for anyone
reviewing or extending this project.

---

## Running it locally

```bash
npm install
npm run dev
```

The app runs immediately with **no setup required** — scores are saved to
the browser's `localStorage` until you connect Supabase (see below).

```bash
npm run build      # production build -> dist/
npm run preview    # preview the production build locally
```

---

## Connecting Supabase (optional, for real accounts + cross-device sync)

1. Create a free project at [supabase.com](https://supabase.com).
2. In the Supabase SQL editor, run `supabase/schema.sql` from this repo —
   it creates the `game_sessions` table and sets up Row Level Security.
3. Copy `.env.example` to `.env.local` and fill in your project's URL and
   anon key (**Project Settings → API**):

   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. Restart `npm run dev`. The app will now write every game session to
   Supabase instead of localStorage — `src/lib/db.js` handles this switch
   automatically, no other code changes needed.

**Important:** the schema's Row Level Security policies assume you'll also
enable **Supabase Auth** (email or magic-link sign-in) and use the
authenticated user's `auth.uid()` as `player_id`. Until Auth is wired up,
`player_id` is a random UUID stored in the browser, which the default RLS
policies will reject. See the comments at the bottom of
`supabase/schema.sql` for both options (add Auth, or relax the policies for
a trusted single-user/demo deployment).

---

## Deploying

This is a static Vite build — both platforms deploy it the same way:

### Vercel
1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. Framework preset: **Vite**. Add the two `VITE_SUPABASE_*` env vars
   under Project Settings → Environment Variables if using Supabase.
4. Deploy. `vercel.json` is already set up to handle client-side routing.

### Netlify
1. Push this repo to GitHub.
2. "Add new site" → "Import an existing project" at
   [app.netlify.com](https://app.netlify.com).
3. Build command `npm run build`, publish directory `dist` (already set in
   `netlify.toml`, so Netlify should auto-detect this).
4. Add the two `VITE_SUPABASE_*` env vars under Site settings → Environment
   variables if using Supabase.

---

## Project structure

```
src/
  lib/
    supabaseClient.js   # Supabase client, or null if env vars aren't set
    db.js                # reads/writes sessions — Supabase or localStorage
    games.js              # registry of all 5 games + their citations
    assessment.js         # trend-detection logic for the Check-In page
  components/
    Navbar.jsx, GameCard.jsx, IntroScreen.jsx, ResultCard.jsx
  pages/
    Home.jsx, GamesHub.jsx, Progress.jsx, Assessment.jsx, Science.jsx
  games/
    WordRecall.jsx, DigitSpan.jsx, PatternMatch.jsx,
    ReactionTap.jsx, FaceNameMatch.jsx
supabase/
  schema.sql             # run this in the Supabase SQL editor
```

---

## Why the assessment is deliberately limited

**This app is a screening companion, not a diagnostic tool**, and it's
built so it structurally can't become one. `src/lib/assessment.js` only
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

- 18px+ base font size, large tap targets (44px minimum, most are 56px+)
- High-contrast focus outlines on every interactive element
- Color is never the only signal — every game also has a distinct icon and
  label
- Short game sessions (1–3 minutes) to reduce fatigue

## License

MIT — do whatever's useful with it.
