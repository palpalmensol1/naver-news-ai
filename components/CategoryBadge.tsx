const cfg: Record<string, { bg: string; color: string; dot: string }> = {
  정치: { bg: "#fff1f1", color: "#b91c1c", dot: "#ef4444" },
  경제: { bg: "#f0fdf4", color: "#15803d", dot: "#22c55e" },
  사회: { bg: "#fff7ed", color: "#c2410c", dot: "#f97316" },
  기술: { bg: "#eff6ff", color: "#1d4ed8", dot: "#3b82f6" },
  문화: { bg: "#fdf4ff", color: "#86198f", dot: "#d946ef" },
  스포츠: { bg: "#fefce8", color: "#a16207", dot: "#eab308" },
  국제: { bg: "#ecfeff", color: "#0e7490", dot: "#06b6d4" },
  연예: { bg: "#f5f3ff", color: "#6d28d9", dot: "#8b5cf6" },
};

export default function CategoryBadge({ category, size = "md" }: { category: string; size?: "sm" | "md" | "lg" }) {
  const c = cfg[category] ?? { bg: "var(--c-surface)", color: "var(--c-ink-2)", dot: "var(--c-ink-4)" };
  const sz = { sm: "text-[10px] px-2 py-0.5 gap-1", md: "text-xs px-2.5 py-1 gap-1.5", lg: "text-sm px-3 py-1.5 gap-1.5" }[size];
  return (
    <span className={`inline-flex items-center rounded-full font-semibold ${sz}`} style={{ background: c.bg, color: c.color }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.dot }} />
      {category}
    </span>
  );
}
