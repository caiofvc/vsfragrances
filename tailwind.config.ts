import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        offwhite: "#F5F2ED",
        ink: "#1A1A1A",
        gold: "#C6A25A",
        "gold-soft": "#D4B883",
        "gray-soft": "#D6D1C9",
        "gray-mid": "#8C8C8C",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        wordmark: ["var(--font-wordmark)", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        wordmark: "0.18em",
        title: "0.08em",
      },
      opacity: {
        8: "0.08",
        12: "0.12",
        15: "0.15",
        18: "0.18",
        22: "0.22",
        28: "0.28",
        32: "0.32",
        35: "0.35",
        65: "0.65",
        85: "0.85",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(26,26,26,0.04), 0 8px 24px rgba(26,26,26,0.06)",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.22, 0.61, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
