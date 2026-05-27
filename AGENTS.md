# AGENTS.md

## Project Overview

This repository contains the static site for **Ballet Map**, a Japanese ballet school search portal published on GitHub Pages at `https://ballet-class-search.com/`.

The top page is intentionally structured as:

- `index.html`: visual HTML shell, SEO tags, `sr-only` crawler text, modal DOM, and script tags
- `schools-data.js`: fallback school data rendered immediately when CSV is slow or unavailable
- `app.js`: CSV loading, filtering, modal behavior, graduate performance filtering, and click logging

Do not restore the old large inline JavaScript `Ballet Classe` version.

## Read First

At the start of every task, read these files in this order:

1. `PROJECT_CONTEXT.md`
2. `TODO.md`
3. `DECISIONS.md`
4. `SETUP.md`
5. `HANDOFF.md`
6. Relevant source files for the task, usually `index.html`, `app.js`, `schools-data.js`, `scripts/check_site_integrity.py`

## Implementation Policy

- Treat repository Markdown files as the source of project context, not chat history.
- Preserve the current thin-shell architecture: `index.html` loads `schools-data.js` before `app.js`.
- Keep SEO-critical static text in `index.html` under `#initialSeoText` with `sr-only`.
- Keep user-visible brand text as `Ballet Map`.
- Keep the detailed search label as `卒業生実績`.
- Keep mobile horizontal scrolling blocked.
- Do not show click counts to users.
- Keep official site buttons visible near the top of modal/detail views.
- When changing JS or fallback data, bump the cache query version in `index.html`.
- Never commit secrets, tokens, or private spreadsheet credentials.

## Files To Update After Changes

- Update `TODO.md` when a task is completed, deferred, or newly discovered.
- Update `DECISIONS.md` when a behavior or architecture decision changes.
- Update `HANDOFF.md` after any meaningful code, site, SEO, deployment, or data-flow change.
- Update `SETUP.md` when commands, dependencies, deployment steps, or verification steps change.

## If Something Is Unclear

- First inspect the current files and public site behavior.
- Prefer the existing architecture and documented decisions.
- If GitHub Pages differs from local files, check `main/index.html`, public `https://ballet-class-search.com/index.html?v=...`, and cache-busting script versions.
- If spreadsheet data differs from fallback data, keep fallback safe and document that static individual pages need regeneration.
- Ask the user only when the decision changes product behavior, data ownership, or public SEO wording.

## Test And Verification Policy

Run the fastest applicable checks before publishing:

```powershell
python scripts/check_site_integrity.py
python -m py_compile scripts/check_site_integrity.py generate_index_with_static_text.py
```

For public verification, check:

- `https://ballet-class-search.com/index.html?v=<current-version>`
- title contains `Ballet Map`
- `app.js` and `schools-data.js` use the current cache version
- 13 cards render
- `卒業生実績` dropdown appears
- no `Ballet Classe` text appears
- no inline `const CSV_URL` appears in `index.html`
