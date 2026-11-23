# Amchoking5.github.io

[Problem_Solving](https://github.com/Amchoking5/Problem_Solving) 저장소의 풀이를 자동으로 가져와 보여주는 블로그.

- `scripts/build_data.py` : Problem_Solving 폴더를 읽어 `data/*.json` 생성
- `.github/workflows/deploy.yml` : 데이터 생성 + GitHub Pages 배포

로컬 미리보기:

```
python scripts/build_data.py --src ../Problem_Solving --out data
python -m http.server 8000   # http://localhost:8000
```
