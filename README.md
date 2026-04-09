# 📰 NewsAI — 실시간 뉴스 AI 요약 서비스

> 네이버 Search API로 최신 뉴스를 검색하고, OpenAI GPT-4o mini가 요약·분석·인사이트를 제공하는 Next.js 웹 서비스

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o_mini-412991?logo=openai)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)

---

## ✨ 주요 기능

| 기능 | 설명 |
|------|------|
| **AI 요약** | 뉴스 20건의 핵심 흐름을 3–5문장으로 압축 |
| **키워드 추출** | 중요도 기반 시각적 워드클라우드 (크기·색상으로 중요도 표현) |
| **감정 분석** | 긍정·중립·부정 맥락 판단 + 근거 설명 |
| **카테고리 분류** | 정치·경제·사회·기술·문화·스포츠·국제·연예 자동 분류 |
| **신문사별 관점** | 언론사별 보도 각도 비교 (보수·진보·중립·경제·IT·방송 성향) |
| **트렌드 인사이트** | 패턴 분석 및 향후 전망 3–5개 |
| **오늘/이번주 뉴스** | 빠른 버튼으로 기간별 뉴스 즉시 검색 |

---

## 🖥️ 스크린샷

### 메인 화면
```
┌─────────────────────────────────────────┐
│  NEWSAI  BETA              ● 실시간     │
├─────────────────────────────────────────┤
│                                         │
│  지금 이 순간의 뉴스를                  │
│  AI가 분석합니다                        │
│                                         │
│  [🔍 키워드 입력...        ] [검색]     │
│  빠른 검색  [오늘 뉴스] [이번주 뉴스]  │
│                                         │
├──────────┬──────────┬──────────────────┤
│ 01 AI요약│02 키워드 │ 03 감정분석      │
│ 04 카테고│05 신문사 │ 06 트렌드        │
└──────────┴──────────┴──────────────────┘
```

### 결과 화면
```
"인공지능" 분석 결과  20건

[AI 분석 요약] [신문사별 관점 8]
─────────────────────────────────
AI 요약  ● 기술
  최근 인공지능 분야에서...

핵심 키워드
  [인공지능] [GPT] [반도체] [규제] ...

감정 분석          트렌드 인사이트
  ↑ 긍정  72%      1 AI 규제 강화 움직임...
  ━━━━━━━━━━━━     2 빅테크 투자 확대...
```

---

## 🛠️ 기술 스택

- **Framework** — [Next.js 16](https://nextjs.org/) (App Router)
- **Language** — TypeScript
- **Styling** — Tailwind CSS v4 + shadcn/ui
- **AI** — [OpenAI GPT-4o mini](https://platform.openai.com/)
- **뉴스 데이터** — [네이버 Search API](https://developers.naver.com/docs/serviceapi/search/news/news.md)

---

## 🚀 시작하기

### 1. 저장소 클론

```bash
git clone https://github.com/palpalmensol1/naver-news-ai.git
cd naver-news-ai
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경변수 설정

`.env.local` 파일을 생성하고 아래 값을 입력합니다.

```env
NAVER_CLIENT_ID=your_naver_client_id
NAVER_CLIENT_SECRET=your_naver_client_secret
OPENAI_API_KEY=your_openai_api_key
```

| 변수 | 발급처 |
|------|--------|
| `NAVER_CLIENT_ID` | [네이버 개발자 센터](https://developers.naver.com/) → 애플리케이션 등록 → 검색 API |
| `NAVER_CLIENT_SECRET` | 위와 동일 |
| `OPENAI_API_KEY` | [OpenAI Platform](https://platform.openai.com/api-keys) |

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

---

## 📁 프로젝트 구조

```
├── app/
│   ├── page.tsx              # 메인 페이지 (검색 + 결과)
│   ├── layout.tsx            # 루트 레이아웃
│   ├── globals.css           # 글로벌 스타일 + CSS 변수
│   └── api/
│       └── news/
│           └── route.ts      # POST /api/news — 뉴스 검색 + AI 분석
├── components/
│   ├── SearchBar.tsx         # 검색 입력창 + 빠른 검색 버튼
│   ├── NewsSummaryCard.tsx   # AI 분석 결과 전체 레이아웃
│   ├── KeywordBadges.tsx     # 중요도별 키워드 배지
│   ├── SentimentIndicator.tsx # 감정 분석 게이지
│   ├── CategoryBadge.tsx     # 카테고리 색상 배지
│   ├── TrendInsights.tsx     # 트렌드 인사이트 목록
│   └── SourceTopics.tsx      # 신문사별 관점 카드
├── lib/
│   ├── naver.ts              # 네이버 Search API 클라이언트
│   └── openai.ts             # GPT-4o mini 분석 로직 + 타입 정의
└── .env.local                # API 키 (gitignore 처리됨)
```

---

## 🔌 API

### `POST /api/news`

뉴스 검색 및 AI 분석을 수행합니다.

**Request Body**

```json
{
  "query": "인공지능",
  "period": "today"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `query` | string | 선택 | 검색 키워드 |
| `period` | `"today"` \| `"week"` | 선택 | 기간 필터 (`query` 또는 `period` 중 하나 필수) |

**Response**

```json
{
  "success": true,
  "query": "인공지능",
  "totalArticles": 20,
  "analysis": {
    "summary": "...",
    "keywords": [{ "word": "AI", "importance": 0.95, "count": 8 }],
    "sentiment": { "label": "긍정", "score": 0.72, "reason": "..." },
    "category": "기술",
    "trends": ["..."],
    "articles": [{ "title": "...", "summary": "...", "url": "...", "pubDate": "..." }]
  },
  "sourceAnalysis": {
    "sources": [{ "source": "조선일보", "angle": "...", "topHeadline": "...", "stance": "보수", "articleCount": 3 }],
    "perspectiveSummary": "..."
  }
}
```

---

## 📝 라이선스

MIT
