# PROJECT_CONTEXT.md

## Purpose

Ballet Map helps users compare ballet schools by location, method, study-abroad results, competition awards, and graduate performance records. The site is designed for SEO, so crawlers should see useful static HTML while users get interactive search and modal behavior.

## Target Users

- Parents looking for serious ballet lessons for children
- Students aiming for competitions, study abroad, or professional training
- Adults looking for ballet classes by area or method
- Search engines crawling school pages and top-page static text

## Main Features

- Top-page card list with 13 fallback schools
- CSV loading from Google Sheets for latest school data
- Keyword search across school name, description, address, station, method, awards, study-abroad data, and `卒業生実績`
- Detailed dropdown filters for area, method, age, study country, study school, award year, contest name, and graduate performance
- Modal detail view with official site button near the top
- Click logging to Google Apps Script with one-hour duplicate suppression per school
- Individual static pages `school_1.html` through `school_13.html`
- `sr-only` SEO text in `index.html`
- GitHub Actions integrity check to prevent the old inline page from returning

## Tech Stack

- Static HTML/CSS/JavaScript
- Tailwind CSS via CDN
- Google Sheets CSV export as primary data source
- `schools-data.js` as fallback data
- Google Apps Script for click logs
- GitHub Pages with custom domain `ballet-class-search.com`
- Python utility checks and legacy generation script

## Directory Overview

- `index.html`: public top page HTML shell and SEO metadata
- `app.js`: browser-side search, CSV parsing, modal, click logging
- `schools-data.js`: fallback school data
- `school_*.html`: static individual school pages
- `favicon.png`: site icon
- `google_apps_script_click_logger.gs`: Apps Script click logging code
- `scripts/check_site_integrity.py`: guard against old or broken top-page structure
- `.github/workflows/site-integrity.yml`: GitHub Actions check
- `generate_index_with_static_text.py`: legacy inline generator, guarded against accidental normal use
- `site_work/` and `ballet_classe_static_site_fixed/`: older generated/reference outputs, not the current public source of truth

## Design And UX Policy

- Keep the visual style quiet, practical, and search-focused.
- Preserve pink/rose Ballet Map styling unless intentionally redesigning.
- Keep keyword search visible at all times.
- Keep advanced filters inside a collapsible `詳細検索` area with a visible arrow.
- Prevent horizontal scrolling on mobile.
- Do not show click counts to users.
- Keep official site CTA high in the detail modal.

## Important Constraints

- Google search snippets and favicon changes are not immediate; Search Console recrawl may be needed.
- Spreadsheet updates affect the top page after CSV load, but static `school_*.html` files do not update automatically.
- GitHub Pages and browser caches can hold old JS/HTML; bump query versions on changed assets.
- The old `Ballet Classe | バレエ教室検索` inline `index.html` must not be reintroduced.
- `generate.py` on GitHub was disabled because it regenerated the old inline version.
