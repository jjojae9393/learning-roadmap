import type { Metadata } from "next";
import { Gaegu, Patrick_Hand } from "next/font/google";
import "./globals.css";

// 한글 손글씨(카툰) 폰트
const gaegu = Gaegu({
  variable: "--font-gaegu",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

// 영문 손글씨(카툰) 폰트
const patrickHand = Patrick_Hand({
  variable: "--font-patrick",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Learning Roadmap",
  description: "단계별 학습 로드맵 — 카툰 스타일",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${gaegu.variable} ${patrickHand.variable} h-full antialiased`}
    >
      <body className="h-full flex flex-col">{children}</body>
    </html>
  );
}
