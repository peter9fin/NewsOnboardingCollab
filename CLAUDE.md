@AGENTS.md

# NewsOnboarding — 9fin Employee Onboarding Portal

## Overview

A Next.js 16 web app that onboards new 9fin News team members through structured learning paths: general financial literacy, then team-specific workflows (9news, NewsApp, Ratings). Each team section has three sequential steps — best-practice guides, presentations, and training quizzes — with progress gated (must complete each before unlocking the next). Deployed as a static site to GitHub Pages; auth and data via Supabase.

## Tech Stack

- **Framework**: Next.js 16.2.4 (App Router, React 19)
- **Auth + DB**: Supabase (`@supabase/ssr` browser client)
- **Styling**: Tailwind CSS v4 (PostCSS plugin), inline styles for the custom dark theme
- **Fonts**: Inter (body), Space Mono (UI labels/monospace)
- **Deployment**: GitHub Pages via GitHub Actions (`nextjs.yml`), static export (`output: 'export'` injected by `configure-pages`)
- **Images**: Unoptimized (`next.config.ts` — required for static export)

## Key Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL    # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY  # Supabase anon key
NEXT_PUBLIC_BASE_PATH       # Set by GitHub Pages action (empty locally)
```

## Project Structure

```
app/
  page.tsx              # Home — hero + team cards + additional learning
  layout.tsx            # Root layout (fonts, metadata)
  login/page.tsx        # Supabase auth login
  signup/page.tsx       # Supabase auth signup
  general-learning/     # Credit Markets 101 presentation + quiz
  9news/page.tsx        # 9news team hub (uses TeamHub component)
  newsapp/page.tsx      # NewsApp team hub
  ratings/page.tsx      # Ratings team hub
  notion-guides/        # Notion-sourced best practice guides
  presentations/        # Training presentations (data.ts + page.tsx)
  additional-learning/  # Unlimited drill practice (9news triage, ratings triage)
  components/
    TeamHub.tsx         # Reusable team hub with step cards + progress tracking
    NextStepToast.tsx   # Toast notification for step completion
    CompletionFooter.tsx
    SignOutButton.tsx
    StagingApps.tsx
data/
  training-articles.csv   # 9news triage training data (source, title, decisions, reasoning)
  ratings-training.csv    # Ratings triage training data (slack type, company, correct answer)
lib/
  progress.ts           # Supabase progress helpers (getTeamProgress, markStepComplete, saveTrainingAttempt)
  supabase/
    client.ts           # Browser Supabase client
    server.ts           # Server Supabase client
```

## Supabase Schema (inferred from code)

- `user_progress` — tracks step completion per user per team. Columns: `user_id`, `team`, `step`. Unique on `(user_id, team, step)`.
- `training_attempts` — records quiz attempts. Columns: `id`, `user_id`, `team`, `score`, `total`.
- `training_answers` — individual quiz answers. Columns: `attempt_id`, `user_id`, `article_title`, `source`, `user_answer`, `correct_answer`, `is_correct`.

## Design System

Dark theme with `#0A1628` background, `#1E90FF` (Dodger Blue) as primary accent, `#22c55e` for success/completed states, `#a855f7` for additional learning. Dot grid + radial glow background effects. Cards use gradient backgrounds (`#0e2345` → `#091830`) with blue borders.

## Conventions

- Team pages delegate to the `TeamHub` component — pass `team`, `label`, `description`, and `steps[]`.
- Progress is gated: step N+1 is locked until step N is complete.
- The `?step_done=` query param triggers the toast notification on return to team hub.
- Training data lives in `data/*.csv` — the quiz pages read and randomize questions from these files.
- All image paths use `process.env.NEXT_PUBLIC_BASE_PATH` prefix for GitHub Pages compatibility.
- Use Tailwind utility classes + inline `style` props (not CSS modules). The codebase doesn't use CSS modules anywhere.

## Commands

```bash
npm run dev     # Local dev server (localhost:3000)
npm run build   # Production build (static export)
npm run lint    # ESLint
```

## Deployment

Push to `main` → GitHub Actions builds static export → deploys to GitHub Pages. The `configure-pages` action auto-injects `basePath` and `output: 'export'`.
