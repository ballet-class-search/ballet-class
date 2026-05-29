from pathlib import Path
import re
import sys
import xml.etree.ElementTree as ET


ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"
APP = ROOT / "app.js"
DATA = ROOT / "schools-data.js"
SITEMAP = ROOT / "sitemap.xml"
ROBOTS = ROOT / "robots.txt"
SITE_ORIGIN = "https://ballet-class-search.com"


def fail(message: str) -> None:
    print(f"ERROR: {message}", file=sys.stderr)
    raise SystemExit(1)


def require(text: str, needle: str, label: str) -> None:
    if needle not in text:
        fail(f"{label} is missing: {needle}")


def forbid(text: str, needle: str, label: str) -> None:
    if needle in text:
        fail(f"{label} contains forbidden text: {needle}")


def extract_canonical(text: str, label: str) -> str:
    match = re.search(r'<link\s+rel="canonical"\s+href="([^"]+)"\s*/?>', text)
    if not match:
        fail(f"{label} is missing a canonical link")
    return match.group(1)


def sitemap_urls() -> set[str]:
    if not SITEMAP.exists():
        fail("sitemap.xml does not exist")
    try:
        tree = ET.parse(SITEMAP)
    except ET.ParseError as error:
        fail(f"sitemap.xml is not valid XML: {error}")

    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    return {
        loc.text.strip()
        for loc in tree.findall(".//sm:loc", ns)
        if loc.text and loc.text.strip()
    }


def main() -> int:
    for path in [INDEX, APP, DATA, SITEMAP, ROBOTS]:
        if not path.exists():
            fail(f"{path.name} does not exist")

    index = INDEX.read_text(encoding="utf-8")
    app = APP.read_text(encoding="utf-8")
    data = DATA.read_text(encoding="utf-8")
    robots = ROBOTS.read_text(encoding="utf-8")

    require(index, "Ballet Map", "index.html")
    require(index, 'meta name="description"', "index.html")
    require(index, 'rel="canonical" href="https://ballet-class-search.com/"', "index.html")
    require(index, 'meta name="robots" content="index,follow"', "index.html")
    require(index, 'schools-data.js?v=20260529-1', "index.html")
    require(index, 'app.js?v=20260529-1', "index.html")
    require(index, 'id="filterGraduates"', "index.html")
    require(index, "蜊呈･ｭ逕溷ｮ溽ｸｾ", "index.html")

    forbid(index, "Ballet Classe", "index.html")
    forbid(index, "const CSV_URL", "index.html")
    forbid(index, "modalClickCount", "index.html")
    forbid(index.lower(), "noindex", "index.html")

    require(app, "splitGraduates", "app.js")
    require(app, r"split(/[\n\r\s縲・・十/繝ｻ]+/)", "app.js")
    require(app, "sendBeacon", "app.js")
    require(app, "蜊呈･ｭ逕溷ｮ溽ｸｾ", "app.js")
    forbid(app, "modalClickCount", "app.js")

    require(data, "window.FALLBACK_SCHOOLS", "schools-data.js")

    urls = sitemap_urls()
    expected_urls = {f"{SITE_ORIGIN}/"} | {
        f"{SITE_ORIGIN}/school_{page_number}.html" for page_number in range(1, 14)
    }
    if urls != expected_urls:
        diff = ", ".join(sorted(urls ^ expected_urls))
        fail(f"sitemap.xml URLs do not match canonical URLs: {diff}")

    require(robots, f"Sitemap: {SITE_ORIGIN}/sitemap.xml", "robots.txt")
    if extract_canonical(index, "index.html") not in urls:
        fail("index.html canonical is not listed in sitemap.xml")

    for page_number in range(1, 14):
        page = ROOT / f"school_{page_number}.html"
        if not page.exists():
            fail(f"{page.name} does not exist")

        text = page.read_text(encoding="utf-8")
        expected = f"{SITE_ORIGIN}/school_{page_number}.html"
        if extract_canonical(text, page.name) != expected:
            fail(f"{page.name} canonical must be {expected}")
        require(text, 'meta name="robots" content="index,follow"', page.name)
        forbid(text.lower(), "noindex", page.name)
        if expected not in urls:
            fail(f"{page.name} canonical is not listed in sitemap.xml")

    print("Site integrity check passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
