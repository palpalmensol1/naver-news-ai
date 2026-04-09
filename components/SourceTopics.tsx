import { SourceAnalysis, SourceTopic } from "@/lib/openai";

const STANCE: Record<SourceTopic["stance"], { label: string; dot: string; bg: string; color: string; border: string }> = {
  보수: { label: "보수", dot: "#ef4444", bg: "#fff1f1", color: "#b91c1c", border: "#fecaca" },
  진보: { label: "진보", dot: "#3b82f6", bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  중립: { label: "중립", dot: "var(--c-ink-4)", bg: "var(--c-surface)", color: "var(--c-ink-3)", border: "var(--c-border)" },
  경제: { label: "경제", dot: "#22c55e", bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
  IT:   { label: "IT",   dot: "#8b5cf6", bg: "#f5f3ff", color: "#6d28d9", border: "#ddd6fe" },
  방송: { label: "방송", dot: "#f97316", bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" },
};

function SourceCard({ s }: { s: SourceTopic }) {
  const c = STANCE[s.stance] ?? STANCE["중립"];
  return (
    <div
      className="flex flex-col gap-2.5 p-4 rounded-xl transition-all"
      style={{ border: "1px solid var(--c-border)", background: "var(--c-bg)" }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = c.dot; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--c-border)"; }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.dot }} />
          <span className="text-base font-bold" style={{ color: "var(--c-ink)" }}>{s.source}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}` }}
          >
            {c.label}
          </span>
          <span className="text-[10px] tabular-nums" style={{ color: "var(--c-ink-4)" }}>{s.articleCount}건</span>
        </div>
      </div>
      <p className="text-sm leading-relaxed line-clamp-2" style={{ color: "var(--c-ink-3)" }}>{s.angle}</p>
      <div className="pt-2.5" style={{ borderTop: "1px solid var(--c-border)" }}>
        <p className="text-sm font-semibold line-clamp-1" style={{ color: "var(--c-ink-2)" }}>{s.topHeadline}</p>
      </div>
    </div>
  );
}

export default function SourceTopics({ sourceAnalysis }: { sourceAnalysis: SourceAnalysis }) {
  const counts = sourceAnalysis.sources.reduce<Record<string, number>>((a, s) => {
    a[s.stance] = (a[s.stance] || 0) + 1; return a;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="label">신문사별 보도 관점</p>
        <div className="flex gap-1.5">
          {Object.entries(counts).map(([stance, n]) => {
            const c = STANCE[stance as SourceTopic["stance"]] ?? STANCE["중립"];
            return (
              <span
                key={stance}
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}` }}
              >
                {c.label} {n}
              </span>
            );
          })}
        </div>
      </div>

      {sourceAnalysis.perspectiveSummary && (
        <div
          className="px-4 py-3 rounded-lg text-sm leading-relaxed"
          style={{ borderLeft: "3px solid #d97706", background: "#fffbeb", color: "#92400e" }}
        >
          <span className="font-bold">관점 요약 · </span>
          {sourceAnalysis.perspectiveSummary}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sourceAnalysis.sources.map((s) => <SourceCard key={s.source} s={s} />)}
      </div>
    </div>
  );
}
