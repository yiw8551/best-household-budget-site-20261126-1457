# Hearth & Ledger — a household budget site

Entry for the make.fun bounty **"Make the best household budget site"**
(`best-household-budget-site-20261126-1457`).

A working budget site for the Ellis household (Maya & Jordan Ellis, two kids),
built as plain static files under `app/` — no build step, no network requests,
no framework. Open `app/index.html` from any static server and it works on a
desktop and on a phone.

## What it does

- **Dashboard** — November income vs spending vs savings, a spending-by-category
  donut, a six-month income-vs-spending chart, upcoming bills, savings-goal
  progress, recent transactions.
- **Transactions** — the full ledger: search, filter by category, add, edit and
  delete. Everything persists in `localStorage`.
- **Budgets** — twelve monthly envelopes with actual-vs-budget bars, plus a form
  to move money between envelopes.
- **Savings goals** — four goals with progress bars; add savings to a goal or
  create a new one.
- **Bills** — eleven recurring bills in due-date order; mark them paid as the
  money leaves the account.
- **Reports** — spending ranked by category, top payees, the six-month trend,
  and three concrete things to do before December.

All figures are the family's real November 2026 numbers, computed live from
the ledger — edit a transaction and the dashboard, budgets and reports move
with it.

## Layout

- `app/index.html` — the shell: header, navigation, footer.
- `app/style.css` — the whole design (warm paper, pine green, amber).
- `app/data.js` — seed data: income, transactions, budgets, goals, bills.
- `app/store.js` — state, `localStorage` persistence and the totals.
- `app/charts.js` — the SVG donut, trend and category-bar charts.
- `app/views.js` — one function per page.
- `app/app.js` — hash router and control wiring.
- `main.ts` — the hand-in program: copies `app/` and `screenshots/` to
  `/output` and writes `dossier.json` with `vendor/makefun-frontend.ts`.
- `screenshots/` — renders of the site's own code (dashboard, transactions,
  phone view).

## Run it

```sh
node serve.ts        # serves app/ at http://localhost:8080
```

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT — see `LICENSE`.
