"use client";

import { useState, KeyboardEvent, useRef } from "react";

interface SearchBarProps {
  onSearch: (query: string, period?: "today" | "week") => void;
  isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const submit = () => { if (query.trim()) onSearch(query.trim()); };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter") submit(); };
  const clear = () => { setQuery(""); inputRef.current?.focus(); };

  return (
    <div className="space-y-3 w-full" style={{ maxWidth: "560px" }}>
      <div className="flex gap-2">
        <div
          className="flex-1 flex items-center gap-2.5 px-4 py-3 rounded-xl transition-all"
          style={{
            border: `2px solid ${focused ? "var(--c-blue)" : "var(--c-border)"}`,
            background: "var(--c-bg)",
            boxShadow: focused ? "0 0 0 4px #dbeafe" : "none",
          }}
        >
          <svg className="w-4 h-4 flex-shrink-0" style={{ color: "var(--c-ink-4)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKey}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="키워드를 입력하세요 (예: 인공지능, 반도체, 주식...)"
            className="flex-1 text-sm outline-none bg-transparent"
            style={{ color: "var(--c-ink)", caretColor: "var(--c-blue)" }}
            disabled={isLoading}
          />
          {query && (
            <button onClick={clear} tabIndex={-1} style={{ color: "var(--c-ink-4)" }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <button
          onClick={submit}
          disabled={isLoading || !query.trim()}
          className="px-6 py-3 rounded-xl text-sm font-bold transition-all"
          style={{
            background: "var(--c-blue)",
            color: "#fff",
            opacity: isLoading || !query.trim() ? 0.4 : 1,
            cursor: isLoading || !query.trim() ? "not-allowed" : "pointer",
            minWidth: "80px",
          }}
        >
          {isLoading
            ? <svg className="w-4 h-4 spin mx-auto" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
            : "검색"
          }
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs" style={{ color: "var(--c-ink-4)" }}>빠른 검색</span>
        {[{ label: "오늘 뉴스", period: "today" as const }, { label: "이번주 뉴스", period: "week" as const }].map((btn) => (
          <button
            key={btn.period}
            onClick={() => onSearch(query.trim(), btn.period)}
            disabled={isLoading}
            className="text-xs font-semibold px-3.5 py-1.5 rounded-full transition-colors"
            style={{ border: "1px solid var(--c-border)", color: "var(--c-ink-2)", background: "var(--c-bg)" }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.borderColor = "var(--c-blue)";
              el.style.color = "var(--c-blue)";
              el.style.background = "var(--c-blue-soft)";
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.borderColor = "var(--c-border)";
              el.style.color = "var(--c-ink-2)";
              el.style.background = "var(--c-bg)";
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
