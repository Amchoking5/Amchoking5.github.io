# Amchoking5.github.io

[Problem_Solving](https://github.com/Amchoking5/Problem_Solving) 저장소의 풀이를 자동으로 가져와 보여주는 블로그.

- `scripts/build_data.py` : Problem_Solving 폴더를 읽어 `data/*.json` 생성
- `scripts/build_toy.py` : [Toy-Project](https://github.com/Amchoking5/Toy-Project) 폴더별 README frontmatter를 읽어 `assets/toy-projects.js`(토이 프로젝트 그룹) 생성. frontmatter에 `demo`를 쓰면 해당 정적 페이지를 `toy/<id>/demo/`로 함께 배포
- `.github/workflows/deploy.yml` : 데이터 생성 + GitHub Pages 배포 (Problem_Solving / Toy-Project에 push되면 자동 실행)

로컬 미리보기:

```
python scripts/build_data.py --src ../Problem_Solving --out data
python scripts/build_toy.py --src ../Toy-Project
python -m http.server 8000   # http://localhost:8000
```
