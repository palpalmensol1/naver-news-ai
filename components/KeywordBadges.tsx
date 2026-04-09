import { Keyword } from "@/lib/openai";

export default function KeywordBadges({ keywords }: { keywords: Keyword[] }) {
  const sorted = [...keywords].sort((a, b) => b.importance - a.importance);

  const style = (imp: number): React.CSSProperties => {
    if (imp >= 0.85) return { background: "var(--c-ink)", color: "#fff", fontSize: "14px", fontWeight: 900, padding: "8px 16px" };
    if (imp >= 0.70) return { background: "var(--c-blue)", color: "#fff", fontSize: "13px", fontWeight: 700, padding: "6px 14px" };
    if (imp >= 0.55) return { background: "var(--c-surface)", color: "var(--c-ink-2)", border: "1px solid var(--c-border)", fontSize: "13px", fontWeight: 600, padding: "5px 12px" };
    return { background: "var(--c-bg)", color: "var(--c-ink-3)", border: "1px solid var(--c-border)", fontSize: "12px", fontWeight: 500, padding: "4px 10px" };
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {sorted.map((kw) => (
        <span
          key={kw.word}
          className="inline-flex items-center gap-1 rounded-full cursor-default"
          style={style(kw.importance)}
          title={`중요도 ${Math.round(kw.importance * 100)}% · ${kw.count}회`}
        >
          {kw.word}
          {kw.count > 2 && <span style={{ opacity: 0.5, fontSize: "10px" }}>×{kw.count}</span>}
        </span>
      ))}
    </div>
  );
}
