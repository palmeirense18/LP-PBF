import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,js,jsx,mdx}",
    "./components/**/*.{ts,tsx,js,jsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        royal: "#2B5BA6",
        royalLight: "#6FA0E6",
        navy: "#1E3A5F",
        silver: "#C0C5CE",
        charcoal: "#2D3436",
        mediumGray: "#95A5A6",
        ink: "#0A0A0A",
        bone: "#F5F5F5",
      },
      fontFamily: {
        display: ["var(--font-orbitron)", "sans-serif"],
        body: ["var(--font-roboto)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
