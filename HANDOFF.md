# HANDOFF.md

## Current Status

- Public top page is `Ballet Map`.
- `index.html` loads `schools-data.js?v=20260527-2` and `app.js?v=20260527-2`.
- 13 fallback cards render.
- `卒業生実績` filter exists and splits multiple ballet company names from a single cell.
- Click logging remains in `app.js` and `google_apps_script_click_logger.gs`.
- Click counts are hidden from users.
- Old `Ballet Classe` inline page is guarded against by `scripts/check_site_integrity.py`.

## Next Things To Do

1. Build or replace the legacy generation flow so individual `school_*.html` pages can be regenerated from the latest spreadsheet.
2. Confirm GitHub Actions is enabled and the site integrity check runs on pushes.
3. Document the spreadsheet column schema.
4. Submit updated URLs and sitemap in Search Console if SEO snippets still show old text.

## Watch Outs

- Do not use old generated `site_work/index.html` or `ballet_classe_static_site_fixed/index.html` as the public top page.
- Do not reintroduce inline `const CSV_URL` inside `index.html`.
- Do not reintroduce `Ballet Classe` branding.
- Static individual pages do not automatically update when the spreadsheet changes.
- Always bump `?v=` on JS assets after changing `app.js` or `schools-data.js`.

## Recently Changed Files

- `index.html`
- `app.js`
- `schools-data.js`
- `generate_index_with_static_text.py`
- `scripts/check_site_integrity.py`
- `.github/workflows/site-integrity.yml`
- `AGENTS.md`
- `PROJECT_CONTEXT.md`
- `TODO.md`
- `DECISIONS.md`
- `SETUP.md`
- `HANDOFF.md`

## First Files For Next Codex

Read these first:

1. `AGENTS.md`
2. `PROJECT_CONTEXT.md`
3. `TODO.md`
4. `DECISIONS.md`
5. `SETUP.md`
6. `HANDOFF.md`

Then inspect the task-specific source files.
