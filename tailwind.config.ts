import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        "8xl": "90rem",
      },
      fontFamily: {
        display: [
          '"Elice Digital Baeum"',
          '"Gmarket Sans"',
          "SUIT Variable",
          "Pretendard Variable",
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "sans-serif",
        ],
        heading: [
          '"Gmarket Sans"',
          '"Elice Digital Baeum"',
          "SUIT Variable",
          "Pretendard Variable",
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "sans-serif",
        ],
        body: [
          "SUIT Variable",
          "Pretendard Variable",
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "sans-serif",
        ],
        pretendard: [
          "SUIT Variable",
          "Pretendard Variable",
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "sans-serif",
        ],
      },
      colors: {
        neo: {
          bg: "#FFFFFF",
          text: "#111111",
          lime: "#89E586",
          blue: "#3374F6",
          border: "#111111",
        },
        brand: {
          primary: "#89E586",
          primaryHover: "#78D975",
          secondary: "#3374F6",
        },
        surface: {
          base: "#FFFFFF",
          muted: "#F6F8FB",
          mutedStrong: "#EEF2F8",
          panelDark: "#FFFFFF",
          stageDark: "#FFFFFF",
        },
        ink: {
          base: "#000000",
          muted: "#6B7280",
        },
        gray: {
          lg: "#000000",
          dark: "#000000",
        },
        point: "#89E586",
      },
      fontSize: {
        caption: ["12px", { lineHeight: "1.5" }],
        body: ["15px", { lineHeight: "1.85" }],
        bodyLg: ["16px", { lineHeight: "1.95" }],
        heading: ["30px", { lineHeight: "1.15" }],
      },
      borderRadius: {
        neo: "4px",
        card: "1rem",
        modal: "1.5rem",
      },
      boxShadow: {
        neo: "4px 4px 0px #111111",
        "neo-pressed": "0px 0px 0px #111111",
        card: "0 10px 30px rgba(0,0,0,0.06)",
        modal: "0 24px 90px rgba(0,0,0,0.55)",
        brand: "0 14px 40px rgba(228,0,63,0.28)",
      },
      backgroundColor: {
        screen: "#FFFFFF",
      },
    },
  },
  plugins: [],
};
export default config;
