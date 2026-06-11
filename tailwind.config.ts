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
          50: "#fff4f2",
          100: "#ffe5e0",
          200: "#ffcfc8",
          300: "#ffaa9e",
          400: "#f88070",
          500: "#f06b5d",
          600: "#dc5244",
          700: "#bb3d30",
          800: "#9a312b",
          900: "#7e2b27",
        },
        ink: {
          DEFAULT: "#0f1419",
          soft: "#3f4b59",
          muted: "#6b7785",
          faint: "#9aa3af",
        },
        surface: {
          DEFAULT: "#ffffff",
          soft: "#f8f5f4",
          tint: "#fff4f2",
        },
        line: {
          DEFAULT: "#ececec",
          soft: "#f0eded",
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
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        "marquee-reverse": "marquee-reverse 30s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
