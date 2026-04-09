import OpenAI from "openai";
import { NaverNewsItem } from "./naver";

export interface Keyword {
  word: string;
  importance: number;
  count: number;
}

export interface Sentiment {
  label: "긍정" | "중립" | "부정";
  score: number;
  reason: string;
}

export interface ArticleSummary {
  title: string;
  summary: string;
  url: string;
  pubDate: string;
}

export interface NewsAnalysis {
  summary: string;
  keywords: Keyword[];
  sentiment: Sentiment;
  category: string;
  trends: string[];
  articles: ArticleSummary[];
}

export interface SourceTopic {
  source: string;
  angle: string;
  topHeadline: string;
  stance: "진보" | "보수" | "중립" | "경제" | "IT" | "방송";
  articleCount: number;
}

export interface SourceAnalysis {
  sources: SourceTopic[];
  perspectiveSummary: string;
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeNews(
  articles: NaverNewsItem[],
  searchQuery: string
): Promise<NewsAnalysis> {
  const articleTexts = articles
    .slice(0, 15)
    .map(
      (a, i) =>
        `[기사 ${i + 1}]\n제목: ${a.title}\n내용: ${a.description}\n날짜: ${a.pubDate}\nURL: ${a.link}`
    )
    .join("\n\n");

  const prompt = `당신은 뉴스 분석 전문가입니다. 아래 뉴스 기사들을 분석하여 정확히 JSON 형식으로만 응답해주세요.

검색어: "${searchQuery}"

뉴스 기사 목록:
${articleTexts}

다음 JSON 형식으로 분석 결과를 반환하세요. JSON 외에 다른 텍스트는 절대 포함하지 마세요:

{
  "summary": "전체 뉴스 흐름을 3-5문장으로 요약. 핵심 사건과 맥락을 포함할 것",
  "keywords": [
    {"word": "키워드1", "importance": 0.95, "count": 8},
    {"word": "키워드2", "importance": 0.85, "count": 6},
    {"word": "키워드3", "importance": 0.75, "count": 5},
    {"word": "키워드4", "importance": 0.65, "count": 4},
    {"word": "키워드5", "importance": 0.55, "count": 3}
  ],
  "sentiment": {
    "label": "긍정 또는 중립 또는 부정",
    "score": 0.0에서 1.0 사이의 숫자,
    "reason": "감정 판단의 구체적 근거 1-2문장"
  },
  "category": "정치, 경제, 사회, 기술, 문화, 스포츠, 국제, 연예 중 하나",
  "trends": [
    "트렌드 인사이트 1: 구체적인 트렌드나 패턴",
    "트렌드 인사이트 2: 향후 전망이나 영향",
    "트렌드 인사이트 3: 주목할 만한 변화나 이슈"
  ],
  "articles": [
    {"title": "기사 제목", "summary": "한 문장 요약", "url": "기사 URL", "pubDate": "발행일"},
    ...
  ]
}

중요 지침:
- keywords는 중요도(importance) 순으로 5-8개 제공
- sentiment score는 긍정이면 0.6-1.0, 중립이면 0.4-0.6, 부정이면 0.0-0.4
- trends는 단순 사실 나열이 아닌 인사이트 중심으로 작성
- articles는 모든 기사를 포함`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.3,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI 응답이 비어있습니다.");
  }

  const parsed = JSON.parse(content) as NewsAnalysis;

  if (!parsed.summary || !parsed.keywords || !parsed.sentiment || !parsed.category || !parsed.trends) {
    throw new Error("AI 분석 결과 형식이 올바르지 않습니다.");
  }

  const articlesWithDates = parsed.articles.map((article, i) => ({
    ...article,
    pubDate: article.pubDate || articles[i]?.pubDate || "",
    url: article.url || articles[i]?.link || "",
  }));

  return { ...parsed, articles: articlesWithDates };
}

export async function analyzeBySource(
  articles: NaverNewsItem[],
  searchQuery: string
): Promise<SourceAnalysis> {
  const sourceGroups: Record<string, NaverNewsItem[]> = {};
  for (const article of articles) {
    const src = article.source || "기타";
    if (!sourceGroups[src]) sourceGroups[src] = [];
    sourceGroups[src].push(article);
  }

  const sourceTexts = Object.entries(sourceGroups)
    .filter(([, items]) => items.length > 0)
    .slice(0, 10)
    .map(([source, items]) => {
      const headlines = items.map((a) => `- ${a.title}`).join("\n");
      return `[${source}] (${items.length}건)\n${headlines}`;
    })
    .join("\n\n");

  const knownStances: Record<string, string> = {
    조선일보: "보수", 동아일보: "보수", 중앙일보: "보수", TV조선: "보수", MBN: "보수",
    한겨레: "진보", 경향신문: "진보", 오마이뉴스: "진보",
    연합뉴스: "중립", 뉴시스: "중립", 뉴스1: "중립", KBS: "중립", MBC: "중립", SBS: "중립", YTN: "중립", JTBC: "중립",
    매일경제: "경제", 한국경제: "경제", 서울경제: "경제", 머니투데이: "경제", 이데일리: "경제", 파이낸셜뉴스: "경제",
    전자신문: "IT", "ZDNet Korea": "IT", 블로터: "IT", 아이뉴스24: "IT", 디지털데일리: "IT",
  };

  const prompt = `당신은 미디어 분석 전문가입니다. 검색어 "${searchQuery}"에 대해 각 언론사가 어떤 관점과 각도로 보도하는지 분석해주세요.

언론사별 헤드라인:
${sourceTexts}

다음 JSON 형식으로 응답하세요. JSON 외 텍스트는 절대 포함하지 마세요:

{
  "sources": [
    {
      "source": "언론사명",
      "angle": "이 언론사의 보도 각도와 강조점 (1-2문장)",
      "topHeadline": "가장 대표적인 헤드라인 제목",
      "stance": "진보, 보수, 중립, 경제, IT, 방송 중 하나",
      "articleCount": 기사수
    }
  ],
  "perspectiveSummary": "언론사들 간 시각 차이나 공통점을 1-3문장으로 요약"
}

지침:
- sources는 기사가 많은 순으로 최대 8개
- angle은 해당 언론사만의 독특한 보도 시각을 구체적으로 서술
- stance는 해당 언론사의 일반적 성향을 반영`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("OpenAI 응답이 비어있습니다.");

  const parsed = JSON.parse(content) as SourceAnalysis;

  const sourcesWithStance = parsed.sources.map((s) => ({
    ...s,
    stance: (knownStances[s.source] as SourceTopic["stance"]) || s.stance || "중립",
    articleCount: s.articleCount || sourceGroups[s.source]?.length || 0,
  }));

  return { ...parsed, sources: sourcesWithStance };
}
