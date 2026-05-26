import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      colors: {
        brand: {
          50: "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
          300: "#fda4af",
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
          700: "#be123c",
          800: "#9f1239",
          900: "#881337",
        },
        ink: {
          DEFAULT: "#0f1419",
          soft: "#3f4b59",
          muted: "#6b7785",
          faint: "#9aa3af",
        },
        surface: {
          DEFAULT: "#ffffff",
          soft: "#f7f6f3",
          tint: "#fdf6f7",
        },
        line: {
          DEFAULT: "#ececec",
          soft: "#f1f1ef",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,20,25,0.04), 0 1px 3px rgba(15,20,25,0.04)",
        cardHover:
          "0 10px 30px rgba(15,20,25,0.08), 0 2px 6px rgba(15,20,25,0.04)",
      },
      borderRadius: {
        pill: "999px",
      },
    },
  },
  plugins: [],
};

export default config;
