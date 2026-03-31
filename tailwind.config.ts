import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: "#06060b", surface: "#0d0d14", "surface-2": "#13131e", elevated: "#1a1a28" },
        border: { DEFAULT: "#1a1a2a", subtle: "#111119", hover: "#2e2e42" },
        text: { DEFAULT: "#e8e8ed", muted: "#8b8b9e", dim: "#4e4e62" },
        accent: { DEFAULT: "#7c5cfc", light: "#9d85fd", dark: "#5a3fd4" },
        cyan: { DEFAULT: "#5ce0d8", light: "#8aeee8" },
        success: { DEFAULT: "#4ade80" },
        warn: { DEFAULT: "#f59e0b" },
        danger: { DEFAULT: "#ef4444" },
      },
      fontFamily: {
        sans: ["Space Grotesk", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
