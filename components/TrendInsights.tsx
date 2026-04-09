const ACCENTS = ["#1a56db", "#7c3aed", "#0891b2", "#16a34a", "#d97706"];
const ACCENT_BG = ["#eef2fd", "#f5f3ff", "#ecfeff", "#f0fdf4", "#fffbeb"];

export default function TrendInsights({ trends }: { trends: string[] }) {
  return (
    <div className="space-y-3">
      {trends.map((trend, i) => (
        <div
          key={i}
          className="flex gap-3 px-4 py-3 rounded-lg"
          style={{
            borderLeft: `3px solid ${ACCENTS[i % ACCENTS.length]}`,
            background: ACCENT_BG[i % ACCENT_BG.length],
          }}
        >
          <span
            className="flex-shrink-0 text-[10px] font-black tabular-nums mt-0.5 w-4"
            style={{ color: ACCENTS[i % ACCENTS.length] }}
          >
            {i + 1}
          </span>
          <p className="text-sm leading-relaxed" style={{ color: "var(--c-ink-2)" }}>{trend}</p>
        </div>
      ))}
    </div>
  );
}
