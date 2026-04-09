import { NextRequest, NextResponse } from "next/server";
import { searchNaverNews, searchNewsByPeriod } from "@/lib/naver";
import { analyzeNews, analyzeBySource } from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, period } = body as {
      query?: string;
      period?: "today" | "week";
    };

    if (!query && !period) {
      return NextResponse.json(
        { error: "검색어 또는 기간을 입력해주세요." },
        { status: 400 }
      );
    }

    let articles;
    let searchQuery = query || "";

    if (period) {
      articles = await searchNewsByPeriod(query || "", period);
      searchQuery = query
        ? `${query} (${period === "today" ? "오늘" : "이번주"})`
        : period === "today"
        ? "오늘의 뉴스"
        : "이번주 뉴스";
    } else {
      articles = await searchNaverNews(query!, 20, "date");
    }

    if (articles.length === 0) {
      return NextResponse.json(
        { error: "검색 결과가 없습니다. 다른 키워드로 시도해보세요." },
        { status: 404 }
      );
    }

    const [analysis, sourceAnalysis] = await Promise.all([
      analyzeNews(articles, searchQuery),
      analyzeBySource(articles, searchQuery),
    ]);

    return NextResponse.json({
      success: true,
      query: searchQuery,
      totalArticles: articles.length,
      analysis,
      sourceAnalysis,
    });
  } catch (error) {
    console.error("뉴스 분석 오류:", error);

    const message =
      error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
