import { Sentiment } from "@/lib/openai";

const SENTIMENT_CFG = {
  긍정: { icon: "↑", color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0", bar: "#22c55e", tag: { bg: "#dcfce7", color: "#166534" } },
  부정: { icon: "↓", color: "#b91c1c", bg: "#fff1f1", border: "#fecaca", bar: "#ef4444", tag: { bg: "#fee2e2", color: "#991b1b" } },
  중립: { icon: "→", color: "var(--c-ink-2)", bg: "var(--c-surface)", border: "var(--c-border)", bar: "var(--c-ink-4)", tag: { bg: "var(--c-surface)", color: "var(--c-ink-3)" } },
};

export default function SentimentIndicator({ sentiment }: { sentiment: Sentiment }) {
  const { label, score, reason } = sentiment;
  const pct = Math.round(score * 100);
  const c = SENTIMENT_CFG[label] ?? SENTIMENT_CFG["중립"];

  return (
    <div className="space-y-4">
      {/* 레이블 */}
      <div
        className="flex items-center justify-between px-4 py-3 rounded-lg"
        style={{ background: c.bg, border: `1px solid ${c.border}` }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl font-black leading-none" style={{ color: c.color }}>{c.icon}</span>
          <span className="text-base font-bold" style={{ color: c.color }}>{label}</span>
        </div>
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-full tabular-nums"
          style={{ background: c.tag.bg, color: c.tag.color }}
        >
          {pct}%
        </span>
      </div>

      {/* 게이지 */}
      <div className="space-y-1.5">
        <div className="flex justify-between" style={{ fontSize: "10px", fontWeight: 700, color: "var(--c-ink-4)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          <span>부정</span><span>중립</span><span>긍정</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--c-surface)" }}>
          <div className="h-full rounded-full bar-in" style={{ width: `${pct}%`, background: c.bar }} />
        </div>
      </div>

      <p className="text-sm leading-relaxed" style={{ color: "var(--c-ink-3)" }}>{reason}</p>
    </div>
  );
}
