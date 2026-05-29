# HANDOFF.md

## Current Status

- Public top page is `Ballet Map`.
- `index.html` loads `schools-data.js?v=20260529-1` and `app.js?v=20260529-1`.
- 13 fallback cards render.
- Top page includes navigation links, a stronger first-view hero, search card, "Ballet Map縺ｧ讀懃ｴ｢縺ｧ縺阪ｋ縺薙→", Methods, About, Policy, guidebook teaser, listing CTA, and a navy footer.
- Top page has an elegant muted palette: ivory/greige base, dusty rose accents, bordeaux CTA, charcoal text, and deep navy footer.
- Hero uses `https://d.kuku.lu/j6nenp78j` as a low-opacity background image with abstract fallback gradients and line motifs.
- Search has a primary row for keyword, nearest station, age, method, and the main search button; advanced filters remain collapsed.
- `app.js` now supports a dedicated `filterStation` nearest-station text input while preserving the broad keyword search.
- School cards use the updated muted palette and comparison metric styling.
- Top page includes placeholder guidebook cards and a placeholder "謨吝ｮ､謗ｲ霈峨↓縺､縺・※" CTA.
- Top page has an elegant classic visual treatment, trust badges, and a listing policy section.
- The policy section explains comparison transparency, final official-site confirmation, and recommendation/ad display handling.
- Footer region links reset current search conditions, filter the school list by regional group, and scroll back to the list.
- `蜊呈･ｭ逕溷ｮ溽ｸｾ` filter exists and splits multiple ballet company names from a single cell.
- Click logging remains in `app.js` and `google_apps_script_click_logger.gs`.
- Click counts are hidden from users.
- Canonical URLs are explicit: top page self-canonicalizes to `https://ballet-class-search.com/`, and each `school_*.html` page self-canonicalizes to its own public URL.
- Root `sitemap.xml` and `robots.txt` are present and aligned with the canonical URLs.
- Old `Ballet Classe` inline page is guarded against by `scripts/check_site_integrity.py`.

## Next Things To Do

1. Build or replace the legacy generation flow so individual `school_*.html` pages can be regenerated from the latest spreadsheet.
2. Confirm GitHub Actions is enabled and the site integrity check runs on pushes.
3. Document the spreadsheet column schema.
4. Submit `https://ballet-class-search.com/sitemap.xml` in Search Console and request indexing for the root page plus representative `school_*.html` URLs.

## Watch Outs

- Do not use old generated `site_work/index.html` or `ballet_classe_static_site_fixed/index.html` as the public top page.
- Do not reintroduce inline `const CSV_URL` inside `index.html`.
- Do not reintroduce `Ballet Classe` branding.
- Static individual pages do not automatically update when the spreadsheet changes.
- GitHub Pages cannot enforce 301 redirects for `http`, `www`, query parameter, trailing slash, or `/index.html` variants from this repo alone; use DNS/CDN/hosting redirect rules if Google keeps discovering those variants.
- Always bump `?v=` on JS assets after changing `app.js` or `schools-data.js`.
- Keep `filterStation` in `index.html` if `app.js` expects nearest-station search.
- Keep footer regional groups in `app.js` updated if new prefectures or area labels are added to the CSV.
- Do not claim operator verification, legal credentials, or school endorsement until real source information exists.

## Recently Changed Files

- `index.html`
- `app.js`
- `scripts/check_site_integrity.py`
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
