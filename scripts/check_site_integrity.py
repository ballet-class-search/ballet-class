from pathlib import Path
import sys


ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"
APP = ROOT / "app.js"
DATA = ROOT / "schools-data.js"


def fail(message: str) -> None:
    print(f"ERROR: {message}", file=sys.stderr)
    raise SystemExit(1)


def require(text: str, needle: str, label: str) -> None:
    if needle not in text:
        fail(f"{label} is missing: {needle}")


def forbid(text: str, needle: str, label: str) -> None:
    if needle in text:
        fail(f"{label} contains forbidden legacy text: {needle}")


def main() -> int:
    if not INDEX.exists():
        fail("index.html does not exist")
    if not APP.exists():
        fail("app.js does not exist")
    if not DATA.exists():
        fail("schools-data.js does not exist")

    index = INDEX.read_text(encoding="utf-8")
    app = APP.read_text(encoding="utf-8")
    data = DATA.read_text(encoding="utf-8")

    require(index, "Ballet Map|留学‣入賞実績からバレエ教室を検索", "index.html")
    require(index, 'meta name="description"', "index.html")
    require(index, 'rel="canonical" href="https://ballet-class-search.com/"', "index.html")
    require(index, "schools-data.js?v=20260527-2", "index.html")
    require(index, "app.js?v=20260527-2", "index.html")
    require(index, 'id="filterGraduates"', "index.html")
    require(index, "卒業生実績", "index.html")

    forbid(index, "Ballet Classe | バレエ教室検索", "index.html")
    forbid(index, "Ballet Classe", "index.html")
    forbid(index, "const CSV_URL", "index.html")
    forbid(index, "modalClickCount", "index.html")

    require(app, "splitGraduates", "app.js")
    require(app, "sendBeacon", "app.js")
    require(app, "卒業生実績", "app.js")
    forbid(app, "modalClickCount", "app.js")

    require(data, "window.FALLBACK_SCHOOLS", "schools-data.js")

    print("Site integrity check passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
