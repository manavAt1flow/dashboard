import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: [
          "Aeonik Pro VF, sans-serif",
          {
            fontFeatureSettings: '"kern", "liga", "calt"',
          },
        ],
        mono: ["IBM Plex Mono", "monospace"],
      },
      colors: {
        border: {
          DEFAULT: "hsl(var(--border))",
          100: "hsl(var(--border-100))",
          200: "hsl(var(--border-200))",
          300: "hsl(var(--border-300))",
          400: "hsl(var(--border-400))",
          500: "hsl(var(--border-500))",
        },
        bg: {
          DEFAULT: "hsl(var(--bg))",
          100: "hsl(var(--bg-100))",
          200: "hsl(var(--bg-200))",
          300: "hsl(var(--bg-300))",
          400: "hsl(var(--bg-400))",
          500: "hsl(var(--bg-500))",
        },
        fg: {
          DEFAULT: "hsl(var(--fg))",
          100: "hsl(var(--fg-100))",
          200: "hsl(var(--fg-200))",
          300: "hsl(var(--fg-300))",
          400: "hsl(var(--fg-400))",
          500: "hsl(var(--fg-500))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          100: "hsl(var(--accent-100))",
          200: "hsl(var(--accent-200))",
          300: "hsl(var(--accent-300))",
          400: "hsl(var(--accent-400))",
          500: "hsl(var(--accent-500))",
        },
        error: {
          DEFAULT: "hsl(var(--error))",
          100: "hsl(var(--error-100))",
          200: "hsl(var(--error-200))",
          300: "hsl(var(--error-300))",
          400: "hsl(var(--error-400))",
          500: "hsl(var(--error-500))",
        },
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "100% 0" },
          "100%": { backgroundPosition: "-100% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 1s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
