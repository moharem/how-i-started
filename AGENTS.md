# How I Started (بدأت إزاي؟)

This file is the single source of truth for this project and the only instruction file. Codex and Claude Code both read it directly. There is no `CLAUDE.md`: adding one would stop Claude Code reading this file. Update it whenever a decision changes.

## What this is

A mobile-first web app (installable PWA, no app stores) where entrepreneurs share how they really started: how much money they had, where it came from, and how long it took to make the first revenue and the first profit.

- Market: Egypt first.
- Non-profit, open project. No monetization.
- Public GitHub repo: `moharem/how-i-started`.
- App name follows the interface language: **بدأت إزاي؟** (Arabic) and **How I Started** (English).

## Owner and working style

- Owner: Omar (the admin). Reads code at a high level and makes small edits. Explain anything that isn't obvious.
- Build in small steps, one feature at a time, so each one can be tested before the next.
- Budget: $0 (free tiers only). A domain gets bought before public launch.

## Working agreement

These rules exist so Omar can always tell what changed and who changed it.

### Announce before acting

State what you are about to do, then do it. This covers creating files or directories, running scripts that write to disk, installing dependencies, and fetching from the internet. "Announce" means a plain sentence before the tool call, not a summary afterwards. A batch of ten files is one announcement. Reading, searching and inspecting need no announcement.

### Identity: always the personal account

This is a personal project. Omar also has a company GitHub account (`moharem-ak`, `omar.moharem@akelius.de`) on the same machine: **never commit, push or open PRs with it.**

Before every commit, push or `gh` write action, check:

- `git config user.name` is `moharem` and `git config user.email` is `omar.moharem96@gmail.com` (set in this repo's local git config). If not, fix them with `git config user.name moharem` and `git config user.email omar.moharem96@gmail.com`.
- `gh auth status` shows `moharem` as the active account. If not, run `gh auth switch -u moharem`.

### Never contribute as an AI

Commits and PRs are authored by Omar. Write commit messages and PR bodies with **no** AI attribution: no `Co-Authored-By` footer, no "Generated with" line. `.claude/settings.json` turns off Claude Code's attribution.

### Git: the agent merges on Omar's word

- The default branch is `master`.
- Every change goes on its own branch from `master` and is merged back one PR at a time. Parallel work runs in separate worktrees. A session that starts on an app-created branch (`claude/<name>`) renames it with `git branch -m` before any work.
- Branch names: `ticket/<number>-<short-slug>` when there is a GitHub issue (the PR body says `Closes #<number>`), otherwise by type: `feat/<slug>`, `fix/<slug>`, `docs/<slug>` or `chore/<slug>`.
- On a branch the agent commits, pushes, rebases onto `master`, and opens the PR. When it is ready, ask Omar whether to merge. Each merge waits for his "merge". Then run `gh pr merge <number> --merge --delete-branch`, and finish with the remote and local branch deleted and local `master` fast-forwarded. In a worktree, detach HEAD (`git switch --detach`) before deleting its branch.
- Versions follow semantic versioning (`vMAJOR.MINOR.PATCH`).

### Follow the conventions already here

When a project pattern is unclear (file layout, naming, whether some file belongs), ask which convention is in use. Where the repo already shows a pattern, follow it over a personal preference.

### When the plan changes, stop

If something discovered mid-task means the agreed plan no longer makes sense, say so and wait for a decision.

### Report accurately

Say what was actually done, including what failed and what was skipped. Where it is unclear who or what changed something on disk, say it is unclear.

### Writing

Never write em dashes (the long dash, Unicode U+2014) in docs, comments, UI text, commit messages or PRs. Use a colon, comma, period or parentheses instead.

### Testing

- Test critical logic: language choice, invite tokens and expiry, validation, data transformations. Leave simple UI rendering and routing config untested.
- Test files sit beside their source: `lang.ts` → `lang.test.ts`.
- Mock the Supabase client in unit tests. Database security rules are tested against the real dev database with SQL, never against production data.
- One behaviour per test, with a descriptive name. Keep existing tests running: fix the code rather than skipping a test.

### Agent tooling

- Library docs (React, Vite, Tailwind, Supabase): use the Context7 MCP when it is connected, before web search.

## Definition of done (v1 prototype)

Online, installable on a phone, seeded with 4 sample stories, and the admin can create, approve and publish stories end to end.

## Hosting and security

- Static site on **GitHub Pages**. Data and admin login on **Supabase**.
- Live site: https://moharem.github.io/how-i-started/ (base path `/how-i-started/`).
- Search engines are blocked with a `noindex` meta tag until public launch. The site is unlisted, not private. (`public/robots.txt` only takes effect once the site has its own domain, because crawlers read robots.txt from the domain root.)
- Only the Supabase **publishable (anon) key** may appear in the repo. All access control lives in Postgres Row Level Security and database functions. The service/secret key must never be committed.
- Every table has RLS enabled with explicit policies. Admin checks use `auth.uid()`, never a client-provided user ID.
- Validate input in the database (constraints and function checks), not only in the browser.
- Keep tokens, passwords and personal data out of logs.
- Run the Supabase security advisors after every schema change.

## Languages and text direction

- Interface: Arabic and English, with a language switch.
- Opening language priority: (1) language in the URL (`/ar/...`, `/en/...`), (2) the visitor's saved choice on this device, (3) the device language: Arabic if it starts with `ar`, otherwise English.
- Each story is written in **one** language (`ar` or `en`). No translation of story text. Fixed option lists (industry, governorate, money source, etc.) are translated.
- **Mixed text is critical.** Egyptians often write Arabic with English words in the middle (for example "Database كانت أكبر مشكلة"). Rules:
  - Never use `dir="auto"` for story text or story inputs. The browser guesses the direction from the first word and gets it wrong when an Arabic sentence starts with an English word.
  - Set `dir` from the story's language: Arabic story → `rtl`, English story → `ltr`. This applies to display **and** to form inputs while typing.
  - Use CSS logical properties (start/end, not left/right) everywhere.
  - Use a font that pairs Arabic and Latin well (IBM Plex Sans Arabic).
  - Sample stories must include tricky mixed sentences: a line starting with an English word, numbers like "50,000 جنيه", brand names, and punctuation after an English word.
- Franco-Arabic (Arabic written in Latin letters) needs no special handling. It is treated as `ltr` text.

## Users

1. **Readers**: browse and read stories. No login.
2. **Founders**: get a private invite link from the admin (sent manually, e.g. WhatsApp). No account, no email.
3. **Admin (owner only)**: email + password login. Public sign-ups disabled in Supabase.

## v1 pages

1. **Home**: story cards, newest first. Each card shows business name, founder name or "Anonymous", industry, location, capital range, and months to first revenue. **No filters and no search in v1.**
2. **Story page**: a "starting point" summary card with the key numbers at the top, then the answers to the story questions. No photos in v1.
3. **Founder form**: reachable only through an invite link. **There is no public form.**
4. **Admin**: create and cancel invite links, see pending stories, edit any story, publish and unpublish, see a list of recent founder edits with one-click undo to the previous version, and hide all sample stories with one action.

## Founder flow

1. The admin creates an invite link (with a note, e.g. "Invite for Ahmed") and sends it manually.
2. The founder opens it, picks the story language, fills in the form, and submits. The story is saved as **pending**.
3. The admin reviews it and publishes it. **Only the first publish needs admin approval.**
4. The same link stays the founder's private link to view and edit their story. Edits to a published story go live immediately. Every save keeps the previous version so the admin can undo.
5. Unused invite links expire after 30 days. The admin can cancel any link at any time.

## Story data

Required: business name, industry, location, year started, starting capital range, source of money, full-time or side project, months to first revenue, and **at least one** of the story questions.

| Field                              | Values / notes                                                                                                                                |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Business name                      | text                                                                                                                                          |
| Founder name                       | optional, empty means "Anonymous"                                                                                                             |
| Story language                     | `ar` / `en`                                                                                                                                   |
| Industry                           | food & drinks, fashion, tech, services, retail, education, health & beauty, crafts & handmade, **other (+ free text)**                        |
| Location                           | one of the 27 Egyptian governorates + optional city, **or** "Outside Egypt" + country + city                                                  |
| Year started                       | number                                                                                                                                        |
| Starting capital range             | 0 / under 10k / 10k–50k / 50k–200k / 200k–1M / 1M+ EGP                                                                                        |
| Exact amount                       | optional                                                                                                                                      |
| Original currency note             | optional free text for stories that started abroad (e.g. "20,000 AED"). The founder picks the closest EGP range. **EGP only, no conversion.** |
| Source of money                    | savings, family/friends, loan, investor, none, mixed                                                                                          |
| Full-time or side project at start |                                                                                                                                               |
| Kept their job?                    | optional                                                                                                                                      |
| Team size at start                 | optional                                                                                                                                      |
| Months to first revenue            | number                                                                                                                                        |
| Months to first profit             | number or "not yet", optional                                                                                                                 |
| Outcome                            | still running & profitable / still running, not profitable yet / pivoted / closed. All outcomes show in the list.                             |
| Today                              | optional: team size now, rough stage                                                                                                          |
| Is sample                          | boolean, sample stories show a "Sample (fictional)" label                                                                                     |

Story questions (free text, at least one required):
1. What did you have when you started (money, skills, contacts)?
2. What did you spend the first money on?
3. What was the hardest moment in the first year?
4. How did you get your first customer?
5. What would you tell someone starting with little money?

## Synced constants

Some values live in two places on purpose. Change one, change both:

- **Option lists** (industries, governorates, capital ranges, money sources, work modes, outcomes, story statuses): the keys in `src/data/options.ts` and the `check` constraints on `public.stories` (a new migration in `supabase/migrations/`). A key missing from the database check makes saving fail.
- **Story columns**: the `Story` type in `src/data/story.ts` and the `public.stories` table.

## Database changes

- Every schema or data change is a new SQL file in `supabase/migrations/` (named `YYYYMMDDHHMMSS_description.sql`), committed with the code, and applied to the Supabase project with the same SQL.
- After applying, run the Supabase security advisors and test the access rules with the publishable key (reads allowed, writes blocked where expected).

## Seed data

4 fictional Egyptian stories written by the agent, clearly labeled "Sample (fictional)": 3 in Arabic with English words mixed in, 1 in English. Different industries, amounts and outcomes, including one that closed.

## Offline

Stories a visitor has already opened stay readable offline, and the app shell loads offline. Submitting and editing need a connection.

## Not in v1

Filters, search, photos and video, comments and reactions, founder accounts, sending email, inflation-adjusted amounts, verified badges, SEO beyond basics, monetization.

## Tech stack

Agreed 2026-10-31. Use the current stable version of each.

| Part              | Choice                                                                           |
| ----------------- | -------------------------------------------------------------------------------- |
| Framework         | React 19 + Vite 8, TypeScript (strict)                                           |
| Routing           | React Router 8, URLs prefixed with `/ar` or `/en`                                |
| Styling           | Tailwind CSS 4, logical properties only (`ms-`/`me-`/`ps-`/`pe-`, `start`/`end`) |
| Font              | IBM Plex Sans Arabic, bundled locally (works offline)                            |
| Translations      | Two typed dictionary files (`ar`, `en`), no i18n library                         |
| PWA               | vite-plugin-pwa (manifest, icons, offline cache)                                 |
| Data + admin auth | Supabase (Postgres + RLS + database functions), `@supabase/supabase-js`          |
| Lint/format       | Biome                                                                            |
| Tests             | Vitest for logic (invite expiry, language choice, validation)                    |
| Deploy            | GitHub Actions → GitHub Pages on every push to `master`                          |

Notes:
- Supabase: this project lives in Omar's **`rehla`** organization (second account), which the Supabase MCP tool is connected to. Never create or change anything in the `SolveSystems` organization for this project. The other project in `rehla` ("rehla's Project") belongs to something else: don't touch it.
- Supabase project: `how-i-started`, ref `qbikujozfytbaqnennxx`, region `eu-central-1`. URL and publishable key are in 1Password item `Supabase` (vault `How I Started`).
- GitHub Pages only serves files, so the build copies `index.html` to `404.html` to make deep links like `/ar/story/123` work.
- Free Supabase projects pause after about a week without activity. A weekly GitHub Action pings the database to keep it awake.
- Invite links and founder edits go through Postgres functions (`security definer`) that check the invite token, so no server of our own is needed.

## Secrets (1Password)

- **All secrets and tokens live in 1Password**, vault `How I Started`. Never paste them into chat, commit them, or print them in logs.
- Local `.env` files contain only `op://` references, never real values. Run commands that need secrets with `op run --env-file=.env -- <command>`.
- GitHub Actions secrets are set by piping from 1Password, e.g. `op read "op://How I Started/<item>/<field>" | gh secret set NAME`.
- `.env` files with real values must stay gitignored.
