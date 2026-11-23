// 포트폴리오 프로젝트 데이터 (출처: Amchoking5/Portfolio, Amchoking5/Team_Project README)
// 이미지/영상은 GitHub user-attachments 원본 주소를 그대로 사용한다.
const A = id => `https://github.com/user-attachments/assets/${id}`;
const TP = "https://github.com/Amchoking5/Team_Project/tree/main/";

const PROJECT_GROUPS = [
  { id: "naver", title: "네이버클라우드 인턴", note: "Video Generation 부서 · 2026.02 – 2026.08" },
  { id: "solid", title: "솔리드이엔지 인턴", note: "AI 부서 인턴 및 프리랜서 · 2024.06 – 2025.05" },
  { id: "team", title: "팀 프로젝트", note: "동아리 및 수업에서 진행" },
];

const PROJECTS = [
  {
    id: "adgen", group: "naver", emoji: "🎨",
    title: "ADGen", subtitle: "광고 영상 생성 프로젝트",
    period: "2026.07 – 2026.08", team: "1인 + 멘토",
    summary: "네이버 영상 생성 AI를 활용한 광고 생성 프로젝트입니다. 광고 URL을 입력하면 핵심 정보를 수집해 선택한 광고 전략과 목표 시간에 맞는 스토리보드를 구성하고, 광고 레퍼런스를 분석해 시작 이미지를 만든 뒤 I2V로 광고 영상을 생성합니다.",
    roles: ["영상 생성 일관성 유지", "AI 스토리보드 및 광고 생성 파이프라인 설계"],
    stack: { "Back-end": ["FastAPI", "ChatGPT", "LangChain", "LightX2V"], "Front-end": ["JavaScript", "TypeScript", "React", "Vite"] },
    features: [
      { title: "AI 스토리보드 생성", items: [
        "크롤링으로 분석한 상품 정보를 활용해 AI가 스토리보드를 구성하고 제안합니다.",
        "목표 전략과 목표 설정에 맞게 컷을 구성하고 트리 구조로 만들어 줍니다.",
        "컷별로 배경과 등장인물을 구체적으로 설정합니다."] },
      { title: "레퍼런스 고정", items: [
        "I2V 모델은 자체적으로 레퍼런스를 유지하는 기능이 없어, 레퍼런스 특징과 동일한 컷별 시작 이미지를 GPT Image로 만든 뒤 자사 I2V 모델로 생성했습니다.",
        "배경, 인물, 사물을 고정해 저장해 두고 컷 이미지 생성 시 관련 레퍼런스를 첨부하는 R2I 방식으로 일관성을 유지했습니다."] },
      { title: "광고 영상 생성", items: [
        "스토리보드별 시작 이미지로 I2V 영상을 만들고, 프롬프트를 수정해 재생성할 수 있습니다.",
        "영상의 앞뒤를 잘라내거나 배속을 바꿀 수 있습니다.",
        "마음에 드는 컷을 골라 합성해 최종 광고 영상을 만듭니다."] },
    ],
    gallery: [
      ["ADGen 메인 페이지", A("c154b73d-385c-4a92-ac5f-065571b4986d")],
      ["스토리보드 전략 설정", A("f4c9df4a-a602-4a0f-9652-792d640a852e")],
      ["스토리보드 구성 트리", A("d0c5df4b-bede-4dcc-b3a8-c327192b4b74")],
      ["등장인물, 배경 레퍼런스 고정", A("8f1aa6fb-33b0-43a4-a41c-03a231efb82f")],
      ["스토리보드 상세 결과 확인", A("593f9dd9-0815-4686-92e6-40e1931257d5")],
      ["스토리보드 이미지, 컷 영상 생성", A("9ece71d2-2a01-4916-aeb4-c5cec5f2a4b5")],
      ["영상 세부 편집", A("85fccb60-493d-46e0-ab64-4ad0261e6335")],
      ["AI 광고 영상 합성", A("3cc01e12-66aa-45bc-b2cf-214d7b2c2713")],
    ],
    structure: [["Structure", A("96ed3b97-143d-404c-a8c1-bdc33f9c2301")]],
    links: [["GitHub 정리", TP + "Intern%20Project/ADGen"]],
  },
  {
    id: "necroflow", group: "naver", emoji: "⚙️",
    title: "Necro Flow", subtitle: "스스로 개선하는 AI",
    period: "2026.03 – 2026.06", team: "1인 + 멘토",
    summary: "영상 생성 모델을 고도화하기 위한 프로젝트입니다. 구간별 체크포인트를 이전 혹은 타겟 체크포인트와 비교해 스스로 성능을 개선합니다. Unified Reward Model로 두 영상을 비교해 AI로 약점을 분석하고, 이를 보완할 데이터셋을 오픈소스 사이트에서 추가 수집해 재학습합니다.",
    roles: ["전체 파이프라인 설계", "기존 코드 기반 작업들을 FastAPI 서버 API 통신으로 결합"],
    stack: { "Back-end": ["FastAPI", "Chroma DB", "MongoDB", "LangChain", "LightX2V", "Unified Reward Model", "Face Detection", "OCR", "API Data Crawl"], "Front-end": ["JavaScript", "TypeScript", "React", "Vite"] },
    features: [
      { title: "AI Agent로 관리하는 영상 생성 · 평가 · 학습", items: [
        "AI Agent가 24시간 영상 생성 모델 고도화를 위한 데이터를 처리합니다.",
        "영상은 자사 모델 Necro와 경쟁사 모델(Runware)로 생성합니다.",
        "평가는 얼굴 인식, QA 인간 평가, AI 평가로 구성됩니다.",
        "AI Agent report에서 약점 분석 결과와 데이터 처리 흐름을 확인할 수 있습니다."] },
      { title: "영상 평가를 위한 구체적인 분석", items: [
        "얼굴 인식 후 벡터 비교로 가장 유사한 얼굴을 찾고, 코사인 유사도로 얼굴 일관성 점수를 측정합니다.",
        "Unified Reward Model로 AI 기반 통합 점수를 측정해 데이터셋 영상별로 비교하고 모델 순위를 매깁니다.",
        "Annohub와 API 연동해 추가 비교가 필요하면 Pairwise 데이터셋을 만들어 작업자에게 자동 할당합니다."] },
      { title: "수집 데이터 전처리 알고리즘", items: [
        "Pixabay, Pexels 등 라이선스가 자유로운 사이트에서 약점 키워드 기반으로 데이터를 수집합니다.",
        "컷 편집으로 5~10초 길이의 짧은 영상으로 나눕니다.",
        "각 컷을 임베딩해 Chroma DB에 저장하고 중복 영상을 제거합니다.",
        "Sky caption, FIBO 등으로 캡셔닝해 (시작 이미지, 영상, 캡션) 트리플렛 데이터셋을 만듭니다.",
        "추가 학습 결과를 이전과 비교해 롤백하거나 새 체크포인트로 이동합니다."] },
    ],
    gallery: [
      ["Necro Flow 메인 페이지", A("b0e007ee-f85f-4ab4-8422-f4a5ef4dfbfa")],
      ["AI Agent 사용 예시", A("398d74e5-f450-4682-a3b0-491f5dbda381")],
      ["AI Agent report 페이지", A("97073db9-02c3-41a7-bbca-4e0367ae3181")],
      ["데이터 수집 페이지", A("92388f72-dc71-4850-bff7-7c294efcee4e")],
      ["영상 캡셔닝 페이지", A("ca8ae348-d738-418b-aaa9-00a6e08ff2e6")],
      ["컷 분할 페이지", A("b53e4332-6250-4302-8549-59a27e81a1dd")],
      ["AI 학습 페이지", A("3ae602a8-a383-4acc-8bd6-276ac8b66b07")],
      ["영상 생성 페이지", A("748a2738-b746-4cb6-a387-be6fc6b5b161")],
      ["영상 평가 페이지", A("0bf3c71b-591c-4363-bd1c-73e41617c0e1")],
      ["영상 평가 상세 페이지", A("a4806d6f-e12d-4bcb-8d7c-5eb06f5fa82c")],
      ["얼굴 인식 페이지", A("63d2b18c-47bc-4967-9504-7914289a7475")],
      ["QA 평가 분석 페이지", A("c842ac55-a7c5-486f-beca-341ff8a78084")],
      ["API 연동 관리 페이지", A("7a40e6da-ffb9-446a-a754-0ea913353c8a")],
      ["데이터 흐름 관리 페이지", A("a2444124-b613-46ff-9327-960a1e1c82dd")],
    ],
    structure: [["Structure", A("bd43088e-ed69-4a14-a1ca-679214b20e85")]],
    links: [["GitHub 정리", TP + "Intern%20Project/NecroFlow"]],
  },
  {
    id: "annohub", group: "naver", emoji: "📊",
    title: "Annohub", subtitle: "QA 데이터 수집 웹 페이지",
    period: "2026.02 – 2026.03", team: "1인 + 멘토",
    summary: "경쟁사 영상 생성 모델과 비교해 성능을 파악하기 위한 벤치마크 QA 페이지입니다. JavaScript와 Node.js로 프론트엔드와 백엔드를 구성했고, PairWise · PointWise 방식으로 측정한 QA 점수와 회원 · 근태 정보를 MongoDB에 저장합니다. QA 작업자 근태 관리 시스템도 함께 만들었습니다.",
    roles: ["QA 평가 데이터 수집 파이프라인 구축 및 웹 페이지 제작", "QA 작업자 근태 관리 시스템 제작"],
    stack: { "Back-end": ["JavaScript", "Node.js", "MongoDB", "공공데이터포털 API"], "Front-end": ["JavaScript", "TypeScript", "React"] },
    features: [
      { title: "관리자 · 작업자 페이지 분리", items: [
        "작업자는 블라인드 영상에 대해 평가 항목별 평가를 진행합니다.",
        "관리자는 모든 평가자의 진행 상황과 결과를 확인합니다.",
        "통계 페이지에서 작업자, 카테고리, 평가 항목별 점수 분포를 분석합니다."] },
      { title: "PointWise 평가", items: [
        "영상미, 모션, 프롬프트 적합성, 물체 보존 등을 1~5점으로 평가하고 코멘트를 남깁니다.",
        "Mean Opinion Score로 평균 3, 표준편차 1이 되도록 보정한 점수를 확인합니다.",
        "숫자 단축키와 방향키로 빠르게 평가할 수 있습니다."] },
      { title: "PairWise 평가", items: [
        "같은 항목에 대해 두 영상 중 더 나은 영상을 고르며, n개 영상에 대해 nC2번 평가합니다.",
        "편향을 막기 위해 사용자별로 순서와 좌우 위치를 무작위로 배치합니다.",
        "관리자는 정렬된 순서로 영상별 평가 정보를 확인합니다."] },
      { title: "근태 관리 시스템", items: [
        "메인 페이지의 출근 · 퇴근 버튼으로 출퇴근을 기록합니다.",
        "공공데이터포털 공휴일 정보로 총 근무 시간을 계산하고 식사 · 휴게 시간을 자동 처리합니다.",
        "메모 기능으로 특이 출퇴근이나 휴가를 파악해 교육 일정을 빠르게 조정합니다."] },
    ],
    gallery: [
      ["PointWise 영상 점수 측정 페이지", A("06eab15e-43b7-4380-82c9-56bc162f57ff")],
      ["PointWise 영상 점수 분석 페이지", A("ecc0e054-7dc8-4b4f-a920-ceeede8075a1")],
      ["PairWise 영상 점수 측정 페이지", A("a39dfd40-9c67-4ae6-b8f7-6c4db38e42fa")],
      ["PairWise 영상 점수 분석 페이지", A("7e8a04ae-bd59-42d2-b0ac-b304114f2bc5")],
      ["근태 확인 달력 페이지", A("dc6053f1-1e04-4ebb-be09-6e69d9855f45")],
      ["근태 분석 및 통계", A("380fc1e0-4046-4147-a93e-eb5f34413c12")],
    ],
    structure: [["Structure", A("a1955bb2-06f7-48f4-a91c-4a179884d76e")]],
    links: [["GitHub 정리", TP + "Intern%20Project/Annohub"]],
  },
  {
    id: "sejong", group: "solid", emoji: "💬",
    title: "세종시 챗봇 AI 충녕", subtitle: "RAG 기반 공공기관 챗봇",
    period: "2024.06 – 2024.10", team: "3명",
    summary: "세종시 관련 데이터를 스스로 학습해 답변을 제공하는 시스템입니다. LangChain과 RAG로 질문과 관련된 문장을 찾고 LLM으로 답변을 생성합니다.",
    roles: ["답변 정확도 향상 및 할루시네이션 억제", "전처리 구조 개선, 코사인 유사도 Top-k 적용, Threshold 적용"],
    stack: { "Back-end": ["Python", "FastAPI", "Pinecone", "LangChain", "Poetry"], "Front-end": ["JavaScript", "TypeScript", "React"] },
    features: [
      { title: "문서 전처리", items: [
        "업로드한 자료를 Naver Clova Studio의 Chunking 기능으로 분리해 임베딩합니다.",
        "세종시 사이트 자료를 크롤링해 같은 방식으로 전처리합니다.",
        "키워드, 예상 질문과 답변, 본문으로 나눈 뒤 Pinecone DB에 저장합니다."] },
      { title: "답변 생성", items: [
        "질문을 임베딩해 Pinecone DB의 값들과 코사인 유사도를 비교합니다.",
        "어떤 문서도 Threshold를 넘지 못하면 정보를 찾지 못했다고 답해 할루시네이션을 예방합니다.",
        "Top-K 문서를 프롬프트에 함께 제공해 답변을 생성합니다."] },
    ],
    gallery: [["웹 사이트", A("89890bbb-a37a-4ec0-af9a-f834f7040362")]],
    structure: [
      ["문서 전처리 학습 과정", A("e81e720f-146f-4520-bfe3-9b7c786ad8ff")],
      ["답변 생성 과정", A("bd355e67-02a5-40d4-b646-4768f546ab2c")],
    ],
    links: [["서비스 바로가기", "https://aichat.sejong.go.kr/"], ["GitHub 정리", TP + "Intern%20Project/%EC%84%B8%EC%A2%85%EC%8B%9C%20%EC%B1%97%EB%B4%87%20AI%20%EC%B6%A9%EB%85%95"]],
  },
  {
    id: "kaf", group: "solid", emoji: "🏭",
    title: "KAF 방사 공장 매뉴얼 챗봇", subtitle: "세종시 챗봇 후속 프로젝트",
    period: "2024.11 – 2025.01", team: "3명",
    summary: "KAF 방사 공장의 매뉴얼 데이터를 학습해 답변하고 매뉴얼 작성을 돕는 시스템입니다. 다국어, 음성 입출력, 답변 내 이미지 출력 기능을 구현했고, 관리자 페이지에서 파일을 업로드 · 검색 · 삭제하며 피드백 페이지에서 잘못된 답변을 수정해 다음 출력을 개선합니다.",
    roles: ["관리자 및 피드백 페이지 개발 (Back-end, Front-end)", "참고자료 및 이미지 출력을 위한 DB 구조 변경"],
    stack: { "Back-end": ["Python", "FastAPI", "Pinecone", "LangChain", "Poetry", "Whisper", "Docker", "Azure Blob Storage"], "Front-end": ["JavaScript", "TypeScript", "React"] },
    features: [
      { title: "참고자료 및 답변 이미지 제공", items: [
        "전처리 과정에서 관련 이미지와 원본 페이지를 Azure Blob Storage에 저장합니다.",
        "Pinecone metadata에 이미지 주소, 원본 문서 이름, 페이지 정보를 저장합니다.",
        "답변과 함께 참고 문서, 페이지 위치, 이미지를 프론트엔드에 제공합니다."] },
      { title: "관리자 페이지", items: [
        "문서 첫 페이지 미리보기를 반응형 그리드로 보여 줍니다.",
        "키워드로 문서를 검색하고, 선택해 삭제하거나 새 문서를 업로드해 학습시킵니다."] },
      { title: "피드백 페이지", items: [
        "잘못된 답변을 클릭하면 피드백 팝업이 뜨고 수정 내용을 제출할 수 있습니다.",
        "관리자가 Accept하면 DB 문서에 해당 내용이 반영됩니다."] },
      { title: "다국어 · 음성 입출력", items: [
        "영어, 한국어, 태국어, 베트남어 등 언어를 선택할 수 있습니다.",
        "입력 언어를 인식해 같은 언어로 답변합니다."] },
    ],
    gallery: [
      ["서비스 소개", A("e29d4b4c-286b-48ef-a394-327ea68d5084")],
      ["데모 영상", A("f60694de-59a6-4e8e-b134-09abae814d72"), "video"],
      ["관리자 페이지", A("378a8299-0507-44a6-a687-cc86a4d888dd")],
      ["피드백 페이지", A("bb1d3bdc-18d8-46ba-91e1-1600a2a73911")],
    ],
    structure: [
      ["기능 정리", A("da88f93a-8b80-408e-9434-0888b2b0d30e")],
      ["Structure", A("6878563f-fd2c-4cc1-b2d6-580f8a86651d")],
    ],
    links: [["GitHub 정리", TP + "Intern%20Project/KAF%20%EB%B0%A9%EC%82%AC%20%EA%B3%B5%EC%9E%A5%20%EB%A7%A4%EB%89%B4%EC%96%BC%20%EC%B1%97%EB%B4%87"]],
  },
  {
    id: "maeum", group: "solid", emoji: "🖼️",
    title: "마음돌봄 프로젝트", subtitle: "AI 대화 기반 아동 심리 케어",
    period: "2025.02 – 2025.05", team: "3명",
    summary: "AI와 대화하며 위로를 받는 심리 케어 프로젝트입니다. '주변에 속마음을 표현하지 않는 아동의 감정을 AI로 이끌어내 보자'는 아이디어에서 시작했습니다. 성격 · 심리 테스트로 나만의 캐릭터를 만들고, AI와 하루를 돌아본 대화는 이미지 생성 AI로 그림일기가 됩니다. KAIST 어린이집을 방문해 아이들이 좋아하는 그림체를 확인하고 MVP 테스트를 진행했습니다.",
    roles: ["멀티턴 LLM", "Stable Diffusion 3 API 서버 연결", "캐릭터 일관성 향상 (프롬프트 딕셔너리, 사용자별 LoRA 생성 및 관리)"],
    stack: { "Back-end": ["Python", "FastAPI", "LangChain", "Stable Diffusion 3", "LoRA"], "Front-end": ["Python", "Gradio", "JavaScript", "TypeScript", "React"] },
    features: [
      { title: "캐릭터 생성", items: [
        "좋아하는 것, 현재 심리 상태 등을 입력받아 사용자만의 캐릭터를 만듭니다.",
        "캐릭터 사진으로 One-page LoRA를 학습해 프롬프트와 함께 저장합니다.",
        "이미지 생성 시 사용자의 LoRA를 불러와 같은 캐릭터를 유지합니다."] },
      { title: "멀티턴 LLM", items: [
        "아동 · 청소년 상담 데이터를 Naver Clova Studio로 파인튜닝했습니다.",
        "그때 느낀 감정, 어떻게 행동하고 싶었는지 등 꼬리를 무는 질문을 이어 갑니다."] },
      { title: "갤러리", items: [
        "AI가 대화를 요약해 일기를 쓰고, 그 내용으로 이미지를 생성합니다.",
        "그림일기는 갤러리에 시간순으로 저장됩니다."] },
    ],
    gallery: [["그림일기 예시", A("cc40b43a-3a71-4a80-bac5-b59f2dd4eb17")]],
    structure: [["Structure", A("7c24bdf9-c085-42c2-bbdc-0cd7babf2d0f")]],
    links: [["GitHub 정리", TP + "Intern%20Project/%EB%A7%88%EC%9D%8C%EB%8F%8C%EB%B4%84%20%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8"]],
  },
  {
    id: "fruitbox", group: "team", emoji: "🍎",
    title: "Fruit Box RL", subtitle: "사과 게임 강화학습 AI",
    period: "2024.05 – 2024.06", team: "심층강화학습과 게임AI 수업",
    summary: "사과 게임에서 고득점을 얻는 AI를 개발한 팀 프로젝트입니다. 게임을 파이썬 환경으로 옮긴 뒤 RLlib, CNN, Monte Carlo, MCTS 등 다양한 방법을 시도했습니다.",
    roles: ["Fruit Box 파이썬 클론 코딩", "Monte Carlo Search"],
    stack: { "구현": ["Python", "RLlib", "NumPy"] },
    features: [],
    gallery: [
      ["발표 자료 1", A("10da661a-95ab-4553-bb24-3af78c826d64")],
      ["발표 자료 2", A("272a1b9d-d4a5-4d69-956d-828516928c7f")],
      ["발표 자료 3", A("0cbc5be9-1863-4f22-b6de-cffebe6c042f")],
      ["발표 자료 4", A("f6c1b5ee-5a7a-4a59-a6a2-6c1a99163626")],
      ["발표 자료 5", A("685e6601-9ac9-434d-a412-1263a75c028a")],
    ],
    structure: [["요약", A("d7505aa2-c3e9-478d-8017-1dcf40f85abd")]],
    links: [["코드 (GitHub)", TP + "Fruit%20Box"], ["참고 영상", "https://www.youtube.com/watch?v=gtc1nRaxyMQ"]],
  },
  {
    id: "antrobot", group: "team", emoji: "🤖",
    title: "개미 로봇", subtitle: "협력형 물류 이동 로봇",
    period: "2018.03 – 2018.12", team: "KAIST 로봇제작 동아리 MR",
    summary: "무거운 물체를 만나면 여러 대가 서로 협력해 물건을 옮기는 물류 이동 로봇입니다.",
    roles: ["이동 경로 프로토타입 제작", "아두이노 회로 제작 및 코딩"],
    stack: { "구현": ["C", "C++", "Arduino"] },
    features: [], gallery: [], structure: [],
    links: [["MR 프로젝트 페이지", "https://mr.kaist.ac.kr/projects/74"]],
  },
];
