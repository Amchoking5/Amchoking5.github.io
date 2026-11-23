"""assets/projects.js에 있는 GitHub 첨부 이미지들의 WebP 썸네일을 만든다.

사용법:
    python scripts/build_thumbs.py            # thumbs/ 에 생성 (이미 있으면 건너뜀)
    python scripts/build_thumbs.py --out thumbs

출력: thumbs/<asset-id>-640.webp  (카드, 갤러리)
      thumbs/<asset-id>-1400.webp (구조도처럼 넓게 보여 주는 이미지)
영상(mp4)은 건너뛴다.
"""
import argparse
import io
import re
import sys
import urllib.request
from pathlib import Path

from PIL import Image

SIZES = (640, 1400)
ROOT = Path(__file__).resolve().parent.parent


def asset_ids() -> list[str]:
    src = (ROOT / "assets" / "projects.js").read_text(encoding="utf-8")
    return sorted(set(re.findall(r'A\("([0-9a-f-]{36})"\)', src)))


def fetch(asset_id: str) -> bytes:
    url = f"https://github.com/user-attachments/assets/{asset_id}"
    req = urllib.request.Request(url, headers={"User-Agent": "portfolio-thumb-builder"})
    with urllib.request.urlopen(req, timeout=60) as r:
        ctype = r.headers.get("Content-Type", "")
        if not ctype.startswith("image/"):
            raise ValueError(f"not an image ({ctype})")
        return r.read()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=str(ROOT / "thumbs"))
    args = ap.parse_args()
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)

    made = skipped = failed = 0
    for aid in asset_ids():
        targets = [out / f"{aid}-{w}.webp" for w in SIZES]
        if all(t.exists() for t in targets):
            skipped += 1
            continue
        try:
            data = fetch(aid)
        except ValueError:
            continue  # 영상 등 이미지가 아닌 첨부
        except Exception as e:
            print(f"  ! {aid}: {e}", file=sys.stderr)
            failed += 1
            continue
        img = Image.open(io.BytesIO(data))
        img = img.convert("RGBA" if img.mode in ("RGBA", "LA", "P") else "RGB")
        for w, t in zip(SIZES, targets):
            im = img.copy()
            if im.width > w:
                im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
            im.save(t, "WEBP", quality=78, method=6)
        made += 1
        print(f"  + {aid} ({len(data) // 1024} KB -> {targets[0].stat().st_size // 1024} KB)")
    print(f"thumbs: {made} made, {skipped} cached, {failed} failed -> {out}")


if __name__ == "__main__":
    main()
