import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "뉴스 AI — 실시간 뉴스 분석",
  description: "네이버 뉴스 검색 + OpenAI GPT-4o mini로 실시간 뉴스를 요약하고 키워드, 감정, 트렌드를 분석합니다.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${geist.variable} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
