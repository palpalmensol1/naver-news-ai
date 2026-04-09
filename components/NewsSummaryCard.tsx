import { NewsAnalysis } from "@/lib/openai";
import CategoryBadge from "./CategoryBadge";
import KeywordBadges from "./KeywordBadges";
import SentimentIndicator from "./SentimentIndicator";
import TrendInsights from "./TrendInsights";

function formatDate(s: string) {
  if (!s) return "";
  try {
    const d = new Date(s);
    if (isNaN(d.getTime())) return s;
    return d.toLocaleDateString("ko-KR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch { return s; }
}

/* 섹션 구분 — 구분선 + 레이블 */
function Section({ label, children, action }: { label: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="py-8 divider">
      <div className="flex items-center justify-between mb-5">
        <p className="label">{label}</p>
        {action}
      </div>
      {children}
    </div>
  );
}

export default function NewsSummaryCard({ analysis }: {
  analysis: NewsAnalysis; query: string; totalArticles: number;
}) {
  return (
    <div>
      {/* AI 요약 */}
      <div className="pb-8">
        <div className="flex items-center gap-2.5 mb-4">
          <p className="label">AI 요약</p>
          <CategoryBadge category={analysis.category} size="sm" />
        </div>
        <p className="text-base leading-[1.9]" style={{ color: "var(--c-ink)" }}>
          {analysis.summary}
        </p>
      </div>

      {/* 키워드 */}
      <Section label="핵심 키워드">
        <KeywordBadges keywords={analysis.keywords} />
      </Section>

      {/* 감정 분석 */}
      <Section label="감정 분석">
        <SentimentIndicator sentiment={analysis.sentiment} />
      </Section>

      {/* 트렌드 */}
      <Section label="트렌드 인사이트">
        <TrendInsights trends={analysis.trends} />
      </Section>

      {/* 기사 목록 */}
      <Section label="기사 목록" action={
        <span className="text-xs tabular-nums" style={{ color: "var(--c-ink-4)" }}>
          {analysis.articles.length}건
        </span>
      }>
        <div>
          {analysis.articles.map((article, i) => (
            <a
              key={i}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex gap-4 py-4 transition-colors"
              style={{ borderBottom: i < analysis.articles.length - 1 ? "1px solid var(--c-border)" : "none" }}
            >
              <span
                className="flex-shrink-0 w-5 h-5 rounded text-[10px] font-black flex items-center justify-center mt-0.5 tabular-nums transition-colors"
                style={{ background: "var(--c-surface)", color: "var(--c-ink-4)" }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = "var(--c-blue)";
                  (e.currentTarget as HTMLElement).style.color = "#fff";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = "var(--c-surface)";
                  (e.currentTarget as HTMLElement).style.color = "var(--c-ink-4)";
                }}
              >
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold line-clamp-1 transition-colors" style={{ color: "var(--c-ink)" }}>
                  {article.title}
                </p>
                <p className="text-sm mt-1.5 line-clamp-2 leading-relaxed" style={{ color: "var(--c-ink-3)" }}>
                  {article.summary}
                </p>
                {article.pubDate && (
                  <span className="text-xs mt-2 block tabular-nums" style={{ color: "var(--c-ink-4)" }}>
                    {formatDate(article.pubDate)}
                  </span>
                )}
              </div>
              <svg
                className="w-3.5 h-3.5 flex-shrink-0 self-center transition-colors"
                style={{ color: "var(--c-border)" }}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          ))}
        </div>
      </Section>
    </div>
  );
}
