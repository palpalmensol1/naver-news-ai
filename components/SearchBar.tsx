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
    <div className="space-y-4 w-full">
      <div className="flex gap-3">
        <div
          className="flex-1 flex items-center gap-3 px-5 py-4 rounded-xl transition-all"
          style={{
            border: `2px solid ${focused ? "var(--c-blue)" : "var(--c-border)"}`,
            background: "var(--c-bg)",
            boxShadow: focused ? "0 0 0 4px #dbeafe" : "none",
          }}
        >
          <svg className="w-5 h-5 flex-shrink-0" style={{ color: "var(--c-ink-4)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
            className="flex-1 text-base outline-none bg-transparent"
            style={{ color: "var(--c-ink)", caretColor: "var(--c-blue)" }}
            disabled={isLoading}
          />
          {query && (
            <button onClick={clear} tabIndex={-1} style={{ color: "var(--c-ink-4)" }}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <button
          onClick={submit}
          disabled={isLoading || !query.trim()}
          className="px-8 py-4 rounded-xl text-base font-bold transition-all hover:brightness-110 active:brightness-90 active:scale-95"
          style={{
            background: "var(--c-blue)",
            color: "#fff",
            opacity: isLoading || !query.trim() ? 0.4 : 1,
            cursor: isLoading || !query.trim() ? "not-allowed" : "pointer",
            minWidth: "96px",
            transition: "opacity 0.15s, filter 0.15s, transform 0.1s, box-shadow 0.15s",
            boxShadow: "0 2px 10px rgba(26,86,219,0.3)",
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
            className="btn-ghost text-sm font-semibold px-4 py-2 rounded-full"
            style={{ border: "1px solid var(--c-border)", color: "var(--c-ink-2)", background: "var(--c-bg)" }}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
