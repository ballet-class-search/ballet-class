# SETUP.md

## Required Environment

- Windows PowerShell
- Python 3
- A static file server for local preview, for example Python `http.server`
- GitHub repository access for publishing
- Google Apps Script access for click logging changes

No Node package install is currently required.

## Install

There is no package installation step for the current static site.

Confirm Python is available:

```powershell
python --version
```

If `python` opens the Microsoft Store or is not recognized, use the Codex bundled Python in this environment:

```powershell
C:\Users\rei17\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe --version
```

## Run Locally

From the repository root:

```powershell
python -m http.server 4174
```

Open:

```text
http://127.0.0.1:4174/index.html
```

## Test

Run the integrity check:

```powershell
python scripts/check_site_integrity.py
```

If local `python` is unavailable, run the same check with:

```powershell
C:\Users\rei17\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe scripts/check_site_integrity.py
```

Run Python syntax checks:

```powershell
python -m py_compile scripts/check_site_integrity.py generate_index_with_static_text.py
```

Manual browser checks:

- 13 cards are shown.
- `隧ｳ邏ｰ讀懃ｴ｢` opens and shows `蜊呈･ｭ逕溷ｮ溽ｸｾ`.
- Graduate options split ballet company names from one spreadsheet cell.
- Keyword search and reset work.
- Detail modal opens.
- Official site button is near the top.
- No click count is visible.
- No horizontal scroll appears on mobile width.
- SEO tags are aligned: top page canonical is `https://ballet-class-search.com/`, every `school_*.html` page has a self canonical, no public HTML page contains `noindex`, `sitemap.xml` contains exactly the canonical URLs, and `robots.txt` points to the sitemap.

## Build

There is no build step. Public files are static:

- `index.html`
- `app.js`
- `schools-data.js`
- `school_*.html`
- `favicon.png`
- `sitemap.xml`
- `robots.txt`

When `app.js` or `schools-data.js` changes, update the cache query version in `index.html`, for example:

```html
<script src="schools-data.js?v=YYYYMMDD-N"></script>
<script src="app.js?v=YYYYMMDD-N"></script>
```

## Publish

Publish by updating the GitHub repository used by GitHub Pages. After publishing, verify:

```text
https://ballet-class-search.com/index.html?v=<current-version>
```

The current known version is:

```text
20260529-1
```

After publishing SEO changes, verify these URLs in Search Console URL Inspection:

```text
https://ballet-class-search.com/
https://ballet-class-search.com/school_1.html
https://ballet-class-search.com/sitemap.xml
```

Expected result: the user-declared canonical and Google-selected canonical should match. If Google still reports duplicate variants for `http`, `www`, `/index.html`, trailing slash, or query parameters, configure true 301 redirects at the DNS/CDN/hosting layer because GitHub Pages project files cannot emit server-side 301 responses for those variants.

## Common Errors

- Cards disappear:
  - Check that `schools-data.js` loads before `app.js`.
  - Check that `window.FALLBACK_SCHOOLS` exists.
  - Check browser console for CSV or syntax errors.
- Old `Ballet Classe` page returns:
  - Run `python scripts/check_site_integrity.py`.
  - Check `main/index.html` on GitHub.
  - Ensure no old generator or manual upload overwrote `index.html`.
- Graduate dropdown has only `縺吶∋縺ｦ`:
  - Confirm the CSV has a `蜊呈･ｭ逕歔 or compatible column.
  - Confirm fallback `schools-data.js` has non-empty `graduates` values.
  - Hard refresh with the latest cache version.
- Click logs do not appear:
  - Check `GAS_URL` in `app.js`.
  - Check Apps Script deployment permissions.
  - Check spreadsheet ID in `google_apps_script_click_logger.gs`.

## Environment Variables

No local environment variables are required.

Do not store secrets in this repository. If future scripts need credentials, document the variable names here without values.
