"""Problem_Solving 저장소를 읽어서 블로그용 JSON 데이터를 생성한다.

사용법:
    python scripts/build_data.py --src ../Problem_Solving --out data

출력:
    <out>/problems.json          전체 목록(메타데이터만)
    <out>/problems/<id>.json     문제별 상세(설명, 코드, 배운점)
"""
import argparse
import hashlib
import json
import re
import shutil
import subprocess
from pathlib import Path

CODE_EXT = {
    ".py": "python", ".cc": "cpp", ".cpp": "cpp", ".c": "c", ".java": "java",
    ".js": "javascript", ".ts": "typescript", ".kt": "kotlin", ".swift": "swift",
    ".go": "go", ".rs": "rust", ".rb": "ruby", ".cs": "csharp", ".sql": "sql",
    ".gs": "plaintext",
}
PLATFORMS = {"백준": "baekjoon", "프로그래머스": "programmers", "Leetcode": "leetcode"}

MJX_RE = re.compile(
    r"<mjx-container[^>]*>.*?<span[^>]*mjx-copytext[^>]*>(.*?)</span>\s*</mjx-container>",
    re.S,
)


def git_dates(src: Path) -> dict:
    """각 파일이 마지막으로 커밋된 시각(ISO)을 한 번의 git log로 구한다."""
    try:
        out = subprocess.run(
            ["git", "-c", "core.quotepath=off", "log", "--format=@@%cI", "--name-only"],
            cwd=src, capture_output=True, text=True, encoding="utf-8", check=True,
        ).stdout
    except Exception:
        return {}
    dates, cur = {}, None
    for line in out.splitlines():
        if line.startswith("@@"):
            cur = line[2:]
        elif line and cur:
            dates.setdefault(line, cur)  # 최신 커밋이 먼저 나온다
    return dates


def folder_date(rel_dir: str, dates: dict) -> str:
    prefix = rel_dir.rstrip("/") + "/"
    found = [d for p, d in dates.items() if p.startswith(prefix)]
    return max(found) if found else ""


def section(md: str, name: str) -> str:
    m = re.search(rf"^###\s*{re.escape(name)}\s*$(.*?)(?=^###\s|\Z)", md, re.M | re.S)
    return m.group(1).strip() if m else ""


def parse_kdate(s: str) -> str:
    m = re.search(r"(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일\s*(\d{1,2}):(\d{2}):(\d{2})", s)
    if not m:
        return ""
    y, mo, d, h, mi, se = m.groups()
    return f"{y}-{int(mo):02d}-{int(d):02d}T{int(h):02d}:{mi}:{se}+09:00"


def clean_html(html: str) -> str:
    """BaekjoonHub가 저장한 MathJax 렌더 결과를 $...$ 원문으로 되돌린다."""
    return MJX_RE.sub(lambda m: m.group(1), html)


def leetcode_slug(title: str) -> str:
    s = re.sub(r"[^a-z0-9\s-]", "", title.lower())
    return re.sub(r"[\s-]+", "-", s).strip("-")


def norm(s: str) -> str:
    """BaekjoonHub가 넣는 특수 공백(U+2005 등)을 일반 공백으로 바꾼다."""
    return re.sub(r"[ - 　 ]", " ", s).strip()


def read_text(p: Path) -> str:
    for enc in ("utf-8-sig", "cp949"):
        try:
            return p.read_text(encoding=enc)
        except UnicodeDecodeError:
            continue
    return p.read_text(encoding="utf-8", errors="replace")


def build_problem(folder: Path, src: Path, platform: str, category: str, dates: dict):
    rel = folder.relative_to(src).as_posix()
    m = re.match(r"^(\d+)\.\s*(.+)$", folder.name)
    pid, title = (m.group(1), norm(m.group(2))) if m else ("", norm(folder.name))

    files = sorted(f for f in folder.iterdir() if f.is_file())
    codes, notes = [], []
    for f in files:
        ext = f.suffix.lower()
        if ext in CODE_EXT:
            codes.append({"name": f.name, "lang": CODE_EXT[ext], "code": read_text(f)})
        elif ext in (".txt",) or (ext == ".md" and f.name.lower() != "readme.md"):
            notes.append({"name": f.name, "text": read_text(f)})

    item = {
        "platform": platform, "category": category, "pid": pid, "title": title,
        "level": category, "link": "", "tags": [], "memory": "", "time": "",
        "date": "", "langs": sorted({c["lang"] for c in codes}), "hasNote": bool(notes),
        "path": rel,
    }
    detail = {"description": "", "input": "", "output": "", "codes": codes, "notes": notes}

    readme = folder / "README.md"
    if readme.exists():
        md = read_text(readme)
        h = re.search(r"^#\s*\[([^\]]+)\]\s*(.+?)\s*-\s*(\d+)\s*$", md, re.M)
        if h:
            item["level"], item["title"], item["pid"] = h.group(1), norm(h.group(2)), h.group(3)
        link = re.search(r"\[문제 링크\]\((.+?)\)", md)
        if link:
            item["link"] = link.group(1)
        perf = section(md, "성능 요약")
        if mm := re.search(r"메모리:\s*([^,\n]+)", perf):
            item["memory"] = mm.group(1).strip()
        if tm := re.search(r"시간:\s*([^,\n]+)", perf):
            item["time"] = tm.group(1).strip()
        tags = section(md, "분류") or section(md, "구분")
        item["tags"] = [norm(t) for t in re.split(r",|>", tags) if norm(t)]
        item["date"] = parse_kdate(section(md, "제출 일자"))
        detail["description"] = clean_html(section(md, "문제 설명"))
        detail["input"] = clean_html(section(md, "입력"))
        detail["output"] = clean_html(section(md, "출력"))

    if platform == "leetcode":
        item["level"] = "LeetCode"
        item["link"] = f"https://leetcode.com/problems/{leetcode_slug(title)}/"
    if platform == "programmers" and re.fullmatch(r"\d+", item["level"] or ""):
        item["level"] = f"level {item['level']}"
    if not item["date"]:
        item["date"] = folder_date(rel, dates)

    item["id"] = f"{platform}-{item['pid'] or hashlib.md5(rel.encode()).hexdigest()[:8]}"
    return item, detail


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", required=True, help="Problem_Solving 저장소 경로")
    ap.add_argument("--out", default="data", help="출력 폴더")
    args = ap.parse_args()
    src, out = Path(args.src).resolve(), Path(args.out).resolve()

    dates = git_dates(src)
    if (out / "problems").exists():
        shutil.rmtree(out / "problems")
    (out / "problems").mkdir(parents=True)

    items, seen = [], set()
    for top, platform in PLATFORMS.items():
        root = src / top
        if not root.is_dir():
            continue
        # 백준/프로그래머스: <플랫폼>/<등급>/<문제>,  Leetcode: Leetcode/<문제>
        if platform == "leetcode":
            groups = [("", root)]
        else:
            groups = [(d.name, d) for d in sorted(root.iterdir()) if d.is_dir()]
        for category, gdir in groups:
            for folder in sorted(gdir.iterdir()):
                if not folder.is_dir():
                    continue
                item, detail = build_problem(folder, src, platform, category, dates)
                if not detail["codes"] and not detail["description"]:
                    continue
                base, n = item["id"], 2
                while item["id"] in seen:
                    item["id"] = f"{base}-{n}"
                    n += 1
                seen.add(item["id"])
                (out / "problems" / f"{item['id']}.json").write_text(
                    json.dumps({**item, **detail}, ensure_ascii=False), encoding="utf-8")
                items.append(item)

    items.sort(key=lambda x: x["date"], reverse=True)
    (out / "problems.json").write_text(
        json.dumps({"count": len(items), "problems": items}, ensure_ascii=False),
        encoding="utf-8")
    print(f"{len(items)} problems -> {out}")


if __name__ == "__main__":
    main()
