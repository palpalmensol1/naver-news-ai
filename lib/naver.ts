export interface NaverNewsItem {
  title: string;
  originallink: string;
  link: string;
  description: string;
  pubDate: string;
  source?: string;
}

export interface NaverNewsResponse {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: NaverNewsItem[];
}

function stripHtmlTags(str: string): string {
  return str.replace(/<[^>]*>/g, "").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#39;/g, "'");
}

function extractSource(originallink: string, link: string): string {
  const url = originallink || link;
  try {
    const hostname = new URL(url).hostname.replace("www.", "");
    const knownSources: Record<string, string> = {
      "chosun.com": "조선일보",
      "donga.com": "동아일보",
      "joongang.co.kr": "중앙일보",
      "hani.co.kr": "한겨레",
      "khan.co.kr": "경향신문",
      "ohmynews.com": "오마이뉴스",
      "yonhapnews.co.kr": "연합뉴스",
      "yna.co.kr": "연합뉴스",
      "newsis.com": "뉴시스",
      "news1.kr": "뉴스1",
      "mk.co.kr": "매일경제",
      "hankyung.com": "한국경제",
      "sedaily.com": "서울경제",
      "etnews.com": "전자신문",
      "zdnet.co.kr": "ZDNet Korea",
      "bloter.net": "블로터",
      "jtbc.co.kr": "JTBC",
      "mbc.co.kr": "MBC",
      "kbs.co.kr": "KBS",
      "sbs.co.kr": "SBS",
      "ytn.co.kr": "YTN",
      "tvchosun.com": "TV조선",
      "mbn.co.kr": "MBN",
      "munhwa.com": "문화일보",
      "seoul.co.kr": "서울신문",
      "hankookilbo.com": "한국일보",
      "kmib.co.kr": "국민일보",
      "fnnews.com": "파이낸셜뉴스",
      "mt.co.kr": "머니투데이",
      "edaily.co.kr": "이데일리",
      "inews24.com": "아이뉴스24",
      "ddaily.co.kr": "디지털데일리",
    };
    for (const [domain, name] of Object.entries(knownSources)) {
      if (hostname.includes(domain)) return name;
    }
    const parts = hostname.split(".");
    return parts.length >= 2 ? parts[parts.length - 2] : hostname;
  } catch {
    return "기타";
  }
}

function getDateRange(period: "today" | "week"): { start: string; end: string } {
  const now = new Date();
  const end = now.toISOString().split("T")[0].replace(/-/g, "");

  if (period === "today") {
    return { start: end, end };
  }

  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const start = weekAgo.toISOString().split("T")[0].replace(/-/g, "");
  return { start, end };
}

export async function searchNaverNews(
  query: string,
  display: number = 20,
  sort: "date" | "sim" = "date"
): Promise<NaverNewsItem[]> {
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("네이버 API 키가 설정되지 않았습니다.");
  }

  const params = new URLSearchParams({
    query,
    display: String(display),
    sort,
  });

  const response = await fetch(
    `https://openapi.naver.com/v1/search/news.json?${params}`,
    {
      headers: {
        "X-Naver-Client-Id": clientId,
        "X-Naver-Client-Secret": clientSecret,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`네이버 API 오류 (${response.status}): ${errorText}`);
  }

  const data: NaverNewsResponse = await response.json();

  return data.items.map((item) => ({
    ...item,
    title: stripHtmlTags(item.title),
    description: stripHtmlTags(item.description),
    source: extractSource(item.originallink, item.link),
  }));
}

export async function searchNewsByPeriod(
  keyword: string,
  period: "today" | "week"
): Promise<NaverNewsItem[]> {
  const periodLabel = period === "today" ? "오늘" : "이번주";
  const query = keyword ? `${keyword} ${periodLabel}` : periodLabel === "오늘" ? "오늘 뉴스" : "이번주 뉴스";
  return searchNaverNews(query, 20, "date");
}
