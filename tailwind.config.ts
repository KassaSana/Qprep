import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx,js,jsx,mdx}",
    "./components/**/*.{ts,tsx,js,jsx,mdx}",
    "./lib/**/*.{ts,tsx,js,jsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      colors: {
        bg: {
          DEFAULT: "#f7f6f2",
          subtle: "#efeee9",
          raised: "#ffffff",
        },
        border: {
          DEFAULT: "#e2e1dc",
          subtle: "#ececea",
        },
        fg: {
          DEFAULT: "#1c1c1a",
          muted: "#62625e",
          subtle: "#8e8d87",
        },
        accent: {
          DEFAULT: "#1c1c1a",
          muted: "#353532",
        },
        success: "#3b7a4a",
        danger: "#a83232",
        warning: "#9a6a13",
      },
      boxShadow: {
        card: "0 1px 0 0 rgba(0,0,0,0.02), 0 1px 2px 0 rgba(28,28,26,0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
