import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LG 프로젝트 매니지먼트 시뮬레이션",
  description: "12~16년차를 위한 프로젝트 매니지먼트 시뮬레이션",
  metadataBase: new URL("https://pmsim.kro.kr"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        {/* Preload LG Smart UI 2.0 TTF files present in public/fonts/lgsmart2 */}
        <link
          rel="preload"
          href="/fonts/lgsmart2/LGSmHaR.ttf"
          as="font"
          type="font/ttf"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/lgsmart2/LGSMHATB.TTF"
          as="font"
          type="font/ttf"
          crossOrigin=""
        />
      </head>
      <body className="antialiased min-h-screen bg-white text-[#6B6B6B] font-lgsmart">
        {children}
      </body>
    </html>
  );
}
