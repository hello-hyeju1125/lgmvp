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
      </head>
      <body className="antialiased min-h-screen bg-white text-black font-body">
        {children}
      </body>
    </html>
  );
}
