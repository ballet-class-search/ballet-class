"""Legacy generator guard.

This repository now serves Ballet Map with a thin index.html plus external
schools-data.js and app.js. The previous generator produced a large inline
JavaScript index.html and caused old pages to be republished automatically.

Do not use this script for normal updates. Update the canonical site files
instead, then run scripts/check_site_integrity.py before publishing.
"""

from __future__ import annotations

import argparse
import sys


NOTICE = (
    "generate.py is disabled because it produces the old inline HTML build. "
    "Use the canonical Ballet Map files: index.html, schools-data.js, app.js, "
    "school_*.html, and sitemap.xml."
)


def main() -> int:
    parser = argparse.ArgumentParser(description="Disabled legacy generator guard.")
    parser.add_argument(
        "--explain",
        action="store_true",
        help="Print why this legacy generator is disabled.",
    )
    parser.parse_args()
    print(f"ERROR: {NOTICE}", file=sys.stderr)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
