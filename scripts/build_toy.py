"""Toy-Project 저장소를 읽어서 '토이 프로젝트' 그룹 데이터를 만든다.

최상위 폴더 중 README.md가 YAML frontmatter(---)로 시작하는 폴더만 프로젝트로 본다.
형식은 Toy-Project/README.md 참고.

사용법:
    python scripts/build_toy.py --src ../Toy-Project

출력:
    assets/toy-projects.js   PROJECTS 배열에 toy 그룹 항목을 추가하는 스크립트
    toy/<id>/...             README에서 참조한 이미지·영상 사본
    toy/<id>/demo/           frontmatter의 demo로 지정한 정적 웹 페이지 사본
"""
import argparse
import html
import json
import posixpath
import re
import shutil
import subprocess
import sys
from pathlib import Path
from urllib.parse import quote

import markdown
import yaml

ROOT = Path(__file__).resolve().parent.parent
FRONT_RE = re.compile(r"\A---\s*\n(.*?)\n---\s*\n?(.*)\Z", re.S)
FEATURE_TITLE = "핵심 기능"
MD_EXT = ["fenced_code", "tables", "sane_lists"]


def git_range(src: Path, rel_dir: str) -> str:
    """폴더의 첫 커밋 ~ 마지막 커밋 월을 'YYYY.MM – YYYY.MM'으로 돌려준다."""
    try:
        out = subprocess.run(
            ["git", "log", "--format=%cs", "--", rel_dir],
            cwd=src, capture_output=True, text=True, encoding="utf-8", check=True,
        ).stdout.split()
    except Exception:
        return ""
    if not out:
        return ""
    first, last = out[-1][:7].replace("-", "."), out[0][:7].replace("-", ".")
    return first if first == last else f"{first} – {last}"


def split_sections(body: str):
    """본문을 (개요, [(## 제목, 내용), ...])로 나눈다. 코드 블록 안의 #은 무시한다."""
    intro, sections, cur, in_code = [], [], None, False
    for line in body.splitlines():
        if line.lstrip().startswith("```"):
            in_code = not in_code
        if not in_code and re.match(r"^#\s", line) and cur is None and not sections:
            continue  # 맨 위 '# 제목'은 frontmatter title과 중복이라 버린다
        m = None if in_code else re.match(r"^##\s+(.+?)\s*#*\s*$", line)
        if m:
            cur = [m.group(1), []]
            sections.append(cur)
        elif cur is None:
            intro.append(line)
        else:
            cur[1].append(line)
    return "\n".join(intro).strip(), [(t, "\n".join(ls).strip()) for t, ls in sections]


def parse_features(md: str):
    """'### 제목' + '- 항목' 묶음을 features 목록으로 만든다."""
    feats, cur = [], None
    for line in md.splitlines():
        if m := re.match(r"^###\s+(.+?)\s*$", line):
            cur = {"title": m.group(1), "items": []}
            feats.append(cur)
        elif cur is not None and (m := re.match(r"^\s*[-*]\s+(.+)$", line)):
            cur["items"].append(m.group(1))
        elif cur is not None and line.strip() and cur["items"]:
            cur["items"][-1] += " " + line.strip()  # 줄바꿈된 항목 이어 붙이기
    return feats


def inline_html(md: str) -> str:
    out = markdown.markdown(md, extensions=MD_EXT).strip()
    return re.sub(r"\A<p>(.*)</p>\Z", r"\1", out, flags=re.S)


def plain(md: str) -> str:
    text = re.sub(r"<[^>]+>", "", markdown.markdown(md, extensions=MD_EXT))
    return re.sub(r"\s+", " ", html.unescape(text)).strip()


class Assets:
    """README가 가리키는 상대 경로 파일을 toy/<id>/로 복사하고 사이트 주소를 돌려준다."""

    def __init__(self, folder: Path, pid: str, out: Path, repo_tree: str):
        self.folder, self.pid, self.out, self.repo_tree = folder, pid, out, repo_tree

    @staticmethod
    def is_external(u: str) -> bool:
        return bool(re.match(r"^([a-z]+:|//|#)", u, re.I))

    def file(self, rel: str) -> str:
        if self.is_external(rel):
            return rel
        src = (self.folder / rel).resolve()
        if self.folder.resolve() not in src.parents or not src.is_file():
            print(f"  ! {self.pid}: 파일 없음 {rel}", file=sys.stderr)
            return rel
        rel_posix = src.relative_to(self.folder.resolve()).as_posix()
        dst = self.out / self.pid / rel_posix
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dst)
        return f"toy/{self.pid}/" + quote(rel_posix)

    def repo_link(self, rel: str) -> str:
        """README 기준 상대 링크(../다른 폴더 등)를 GitHub 주소로 바꾼다."""
        base, _, tail = self.repo_tree.partition("/tree/main/")
        return f"{base}/tree/main/" + posixpath.normpath(f"{tail}/{rel}")

    def rewrite_html(self, h: str) -> str:
        h = re.sub(r'(<img[^>]*\ssrc=")([^"]+)"', lambda m: m.group(1) + self.file(html.unescape(m.group(2))) + '"', h)
        # 이미지가 아닌 상대 링크(코드 파일 등)는 GitHub 원본으로 연결
        return re.sub(
            r'(<a[^>]*\shref=")([^"]+)"',
            lambda m: m.group(1) + (m.group(2) if self.is_external(m.group(2))
                                    else self.repo_link(m.group(2))) + '"',
            h)


def copy_demo(folder: Path, rel: str, dst: Path, pid: str) -> str:
    """frontmatter의 demo(정적 웹 페이지 폴더)를 사이트로 복사한다. 시작 페이지 경로를 돌려준다."""
    src = (folder / rel).resolve()
    if folder.resolve() != src and folder.resolve() not in src.parents:
        print(f"  ! {pid}: demo 경로가 프로젝트 폴더 밖입니다 ({rel})", file=sys.stderr)
        return ""
    if not (src / "index.html").is_file():
        print(f"  ! {pid}: demo 폴더에 index.html이 없습니다 ({rel})", file=sys.stderr)
        return ""
    shutil.copytree(src, dst, dirs_exist_ok=True,
                    ignore=shutil.ignore_patterns("README.md", ".*", "__pycache__", "*.py", "*.exe"))
    return "index.html"


def media_list(raw, assets: Assets, pid: str, key: str):
    items = []
    for it in raw or []:
        if not isinstance(it, (list, tuple)) or len(it) < 2:
            print(f"  ! {pid}: {key} 항목 형식 오류 {it!r} (예: [캡션, images/a.png])", file=sys.stderr)
            continue
        cap, src, *rest = [str(x) for x in it]
        items.append([cap, assets.file(src), *rest[:1]])
    return items


def build_project(folder: Path, src: Path, out_assets: Path, repo_url: str, taken: set):
    readme = folder / "README.md"
    if not readme.is_file():
        return None
    m = FRONT_RE.match(readme.read_text(encoding="utf-8-sig").replace("\r\n", "\n"))
    if not m:
        return None
    meta = yaml.safe_load(m.group(1)) or {}
    body = m.group(2)

    rel_dir = folder.relative_to(src).as_posix()
    pid = str(meta.get("id") or re.sub(r"[^a-z0-9]+", "-", rel_dir.lower()).strip("-") or "toy")
    if pid in taken:
        raise SystemExit(f"[ERROR] id 중복: '{pid}' ({rel_dir}/README.md의 id를 바꿔 주세요)")
    taken.add(pid)

    repo_tree = f"{repo_url}/tree/main/{quote(rel_dir)}"
    assets = Assets(folder, pid, out_assets, repo_tree)
    intro, sections = split_sections(body)

    features, extra = [], []
    for title, content in sections:
        if title == FEATURE_TITLE:
            features = [{"title": f["title"], "items": [plain(i) for i in f["items"]],
                         "itemsHTML": [assets.rewrite_html(inline_html(i)) for i in f["items"]]}
                        for f in parse_features(content)]
        elif content:
            extra.append({"title": title, "html": assets.rewrite_html(markdown.markdown(content, extensions=MD_EXT))})

    summary_md = str(meta.get("summary") or intro)
    stack = {str(k): [str(x) for x in (v or [])] for k, v in (meta.get("stack") or {}).items()}
    links = [[str(t), str(u)] for t, u in (meta.get("links") or [])]
    if meta.get("demo"):
        demo = copy_demo(folder, str(meta["demo"]), out_assets / pid / "demo", pid)
        if demo:
            links.insert(0, ["데모 바로가기", f"toy/{pid}/demo/{demo}"])
    links.append(["코드 (GitHub)", repo_tree])

    return {
        "id": pid, "group": "toy", "emoji": str(meta.get("emoji") or "🛠️"),
        "title": str(meta.get("title") or folder.name),
        "subtitle": str(meta.get("subtitle") or ""),
        "period": str(meta.get("period") or git_range(src, rel_dir)),
        "team": str(meta.get("team") or "개인 프로젝트"),
        "summary": plain(summary_md),
        "summaryHTML": assets.rewrite_html(inline_html(summary_md)),
        "roles": [str(r) for r in (meta.get("roles") or [])],
        "stack": stack,
        "features": features,
        "gallery": media_list(meta.get("gallery"), assets, pid, "gallery"),
        "structure": media_list(meta.get("structure"), assets, pid, "structure"),
        "links": links,
        "extra": extra,
        "_order": meta.get("order"),
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", required=True, help="Toy-Project 저장소 경로")
    ap.add_argument("--js", default=str(ROOT / "assets" / "toy-projects.js"))
    ap.add_argument("--assets", default=str(ROOT / "toy"), help="이미지 사본 폴더")
    ap.add_argument("--repo", default="https://github.com/Amchoking5/Toy-Project")
    args = ap.parse_args()

    src, out_assets = Path(args.src), Path(args.assets)
    if out_assets.exists():
        shutil.rmtree(out_assets)

    # projects.js에 직접 적은 id와 겹치지 않게 한다
    taken = set(re.findall(r'^\s*id:\s*"([^"]+)"', (ROOT / "assets" / "projects.js").read_text(encoding="utf-8"), re.M))

    projects = []
    for folder in sorted(p for p in src.iterdir() if p.is_dir() and not p.name.startswith((".", "_"))):
        p = build_project(folder, src, out_assets, args.repo.rstrip("/"), taken)
        if p:
            projects.append(p)
            print(f"  + {p['id']}: {p['title']} ({folder.name})")

    projects.sort(key=lambda p: (p["_order"] is None, p["_order"] if isinstance(p["_order"], (int, float)) else 0, p["title"]))
    for p in projects:
        del p["_order"]

    js = ("// 자동 생성 파일: scripts/build_toy.py가 Toy-Project 저장소의 README.md를 읽어 만든다. 직접 수정하지 말 것.\n"
          f"PROJECTS.push(...{json.dumps(projects, ensure_ascii=False, indent=1)});\n")
    Path(args.js).write_text(js, encoding="utf-8")
    print(f"toy projects: {len(projects)} -> {args.js}")


if __name__ == "__main__":
    main()
