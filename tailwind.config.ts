import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/pages/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette — gold / black / silver (see kickoff.md).
        brand: {
          dark: "#08080b",
          accent: "#c9a96a", // champagne gold
          gold: "#c9a96a",
          "gold-2": "#e8d8a8",
          silver: "#b8bcc4",
          light: "#f4efe6", // cream
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Didot', 'Georgia', 'serif'],
        sans: ['var(--font-geist-sans)', 'Optima', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
