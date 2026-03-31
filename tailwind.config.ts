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
        bg: { DEFAULT: "#0a0a0f", surface: "#12121a", elevated: "#1a1a28" },
        border: { DEFAULT: "#1e1e2e", hover: "#2e2e42" },
        text: { DEFAULT: "#e0e0e0", muted: "#888888", dim: "#555555" },
        accent: { DEFAULT: "#7c5cfc", light: "#9d85fd", dark: "#5a3fd4" },
        cyan: { DEFAULT: "#5ce0d8", light: "#8aeee8" },
        success: { DEFAULT: "#4ade80" },
        warn: { DEFAULT: "#f59e0b" },
        danger: { DEFAULT: "#ef4444" },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #7c5cfc, #5ce0d8)",
      },
      borderRadius: {
        "2xl": "16px",
      },
    },
  },
  plugins: [],
};
export default config;
