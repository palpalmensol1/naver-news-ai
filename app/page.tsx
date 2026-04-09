"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import NewsSummaryCard from "@/components/NewsSummaryCard";
import SourceTopics from "@/components/SourceTopics";
import { NewsAnalysis, SourceAnalysis } from "@/lib/openai";

interface SearchResult {
  query: string;
  totalArticles: number;
  analysis: NewsAnalysis;
  sourceAnalysis: SourceAnalysis;
}

const TRENDING = ["인공지능", "반도체", "주식", "부동산", "기후변화", "전기차", "K-POP", "의료AI"];

const FEATURES = [
  { n: "01", title: "AI 요약",         desc: "핵심 흐름을 3–5문장으로" },
  { n: "02", title: "키워드 추출",     desc: "중요도 기반 워드클라우드" },
  { n: "03", title: "감정 분석",       desc: "긍정·중립·부정 맥락 판단" },
  { n: "04", title: "카테고리",        desc: "주제별 자동 분류" },
  { n: "05", title: "신문사 관점",     desc: "언론사별 보도 각도 비교" },
  { n: "06", title: "트렌드 인사이트", desc: "패턴 분석 및 향후 전망" },
];

function Skeleton() {
  return (
    <div className="space-y-6 pt-2">
      {[100, 80, 60].map((w) => (
        <div key={w} className="space-y-3">
          <div className="skeleton h-4 rounded" style={{ width: `${w}%` }} />
          <div className="skeleton h-4 rounded" style={{ width: `${w * 0.85}%` }} />
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"summary" | "sources">("summary");

  const search = async (query: string, period?: "today" | "week") => {
    setLoading(true); setError(null); setResult(null); setTab("summary");
    try {
      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query || undefined, period }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "분석에 실패했습니다.");
      setResult({ query: data.query, totalArticles: data.totalArticles, analysis: data.analysis, sourceAnalysis: data.sourceAnalysis });
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--c-bg)" }}>

      {/* ── NAV ── */}
      <nav style={{ borderBottom: "1px solid var(--c-border)" }}>
        <div className="container-wide h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl font-black tracking-tight" style={{ color: "var(--c-ink)" }}>NEWS</span>
            <span className="text-xl font-black tracking-tight" style={{ color: "var(--c-blue)" }}>AI</span>
            <span
              className="text-[11px] font-bold px-2 py-0.5 rounded"
              style={{ color: "var(--c-blue)", background: "var(--c-blue-soft)", border: "1px solid #c7d8f8" }}
            >
              BETA
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="ping absolute inset-0 rounded-full bg-emerald-400 opacity-60" />
              <span className="relative block h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-sm font-medium" style={{ color: "var(--c-ink-4)" }}>실시간</span>
          </div>
        </div>
      </nav>

      {/* ── BODY ── */}
      <div className="flex-1 container-wide py-14">
        <div className="flex gap-20 items-start">

          {/* ── 좌측: 히어로 + 기능 소개 (고정 사이드바) ── */}
          <aside className="w-96 flex-shrink-0 sticky top-10">
            <p className="text-xs font-bold uppercase tracking-[0.14em] mb-5" style={{ color: "var(--c-blue)" }}>
              Naver Search API + GPT-4o mini
            </p>
            <h1
              className="text-5xl font-black leading-[1.15] tracking-tight mb-5"
              style={{ color: "var(--c-ink)" }}
            >
              지금 이 순간의<br />뉴스를<br />
              <span style={{ color: "var(--c-blue)" }}>AI가 분석</span>합니다
            </h1>
            <p className="text-base leading-relaxed mb-10" style={{ color: "var(--c-ink-3)" }}>
              키워드를 입력하면 최신 뉴스 20건을 검색해<br />
              요약·키워드·감정·신문사별 관점을 한눈에 보여드립니다
            </p>

            {/* 기능 목록 */}
            <div className="space-y-0" style={{ border: "1px solid var(--c-border)", borderRadius: "12px", overflow: "hidden" }}>
              {FEATURES.map((f, i) => (
                <div
                  key={f.n}
                  className={`fade-up d${i + 1} flex items-start gap-3 px-4 py-3.5`}
                  style={{
                    background: "var(--c-bg)",
                    borderBottom: i < FEATURES.length - 1 ? "1px solid var(--c-border)" : "none",
                  }}
                >
                  <p className="label mt-0.5 w-6 flex-shrink-0" style={{ color: "var(--c-blue)" }}>{f.n}</p>
                  <div>
                    <p className="text-sm font-bold" style={{ color: "var(--c-ink)" }}>{f.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--c-ink-3)" }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* ── 우측: 검색 + 결과 ── */}
          <main className="flex-1 min-w-0">

            {/* 검색창 */}
            <div className="mb-10">
              <SearchBar onSearch={search} isLoading={loading} />
            </div>

            {/* 인기 검색어 */}
            {!result && !loading && !error && (
              <div className="fade-up">
                <p className="label mb-4">인기 검색어</p>
                <div className="flex flex-wrap gap-2.5">
                  {TRENDING.map((kw) => (
                    <button
                      key={kw}
                      onClick={() => search(kw)}
                      className="btn-ghost text-sm font-medium px-5 py-2 rounded-full"
                      style={{ border: "1px solid var(--c-border)", color: "var(--c-ink-2)", background: "var(--c-bg)" }}
                    >
                      {kw}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 로딩 */}
            {loading && (
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-5 h-5 rounded-full border-2 spin" style={{ borderColor: "var(--c-border)", borderTopColor: "var(--c-blue)" }} />
                  <div>
                    <p className="text-base font-bold" style={{ color: "var(--c-ink)" }}>뉴스를 분석하고 있습니다</p>
                    <p className="text-sm mt-0.5" style={{ color: "var(--c-ink-3)" }}>네이버 검색 → AI 분석 → 인사이트 생성</p>
                  </div>
                </div>
                <Skeleton />
              </div>
            )}

            {/* 에러 */}
            {error && (
              <div className="flex gap-4 p-5 rounded-xl" style={{ border: "1px solid #fca5a5", background: "#fff5f5" }}>
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="text-sm font-bold text-red-700">오류가 발생했습니다</p>
                  <p className="text-sm mt-0.5 text-red-600">{error}</p>
                  <button onClick={() => setError(null)} className="text-xs font-semibold mt-2 underline text-red-500">다시 시도</button>
                </div>
              </div>
            )}

            {/* 결과 */}
            {result && !loading && (
              <div className="fade-up">
                {/* 결과 헤더 */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-black tracking-tight" style={{ color: "var(--c-ink)" }}>
                      &ldquo;{result.query}&rdquo;
                    </h2>
                    <span
                      className="text-sm font-semibold px-3 py-1 rounded-full tabular-nums"
                      style={{ background: "var(--c-surface)", color: "var(--c-ink-3)" }}
                    >
                      {result.totalArticles}건
                    </span>
                  </div>
                  <button
                    onClick={() => { setResult(null); setError(null); }}
                    className="text-sm font-medium flex items-center gap-1.5 transition-colors"
                    style={{ color: "var(--c-ink-4)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--c-ink-2)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--c-ink-4)")}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    초기화
                  </button>
                </div>

                {/* 탭 */}
                <div className="flex gap-0 mb-8" style={{ borderBottom: "1px solid var(--c-border)" }}>
                  {[
                    { id: "summary" as const, label: "AI 분석 요약" },
                    { id: "sources" as const, label: `신문사별 관점 (${result.sourceAnalysis?.sources?.length ?? 0})` },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTab(t.id)}
                      className="px-5 py-3 text-base font-bold -mb-px transition-colors"
                      style={{
                        borderBottom: tab === t.id ? `2px solid var(--c-blue)` : "2px solid transparent",
                        color: tab === t.id ? "var(--c-blue)" : "var(--c-ink-3)",
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {tab === "summary" && (
                  <NewsSummaryCard analysis={result.analysis} query={result.query} totalArticles={result.totalArticles} />
                )}
                {tab === "sources" && result.sourceAnalysis && (
                  <SourceTopics sourceAnalysis={result.sourceAnalysis} />
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid var(--c-border)" }}>
        <div className="container-wide py-5 flex items-center justify-between">
          <span className="text-sm" style={{ color: "var(--c-ink-4)" }}>Naver Search API · OpenAI GPT-4o mini</span>
          <span className="text-sm" style={{ color: "var(--c-ink-4)" }}>© 2026</span>
        </div>
      </footer>
    </div>
  );
}
