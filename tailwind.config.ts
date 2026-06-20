import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        surface: "#F5F7FA",
        silver: "#E5E9F0",
        navy: "#102A56",
        deepblue: {
          DEFAULT: "#1E3A8A",
          light: "#3B5BB5",
          dark: "#142B66",
        },
        emerald: {
          DEFAULT: "#10B981",
          light: "#34D399",
          dark: "#0B8F63",
        },
        teal: "#0D7377",
        ink: "#1A2233",
        muted: "#5B677A",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Helvetica", "Arial", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgba(16, 42, 86, 0.10)",
        elevated: "0 20px 60px -12px rgba(30, 58, 138, 0.25)",
        glow: "0 0 0 1px rgba(16, 185, 129, 0.35), 0 8px 32px -8px rgba(16, 185, 129, 0.35)",
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(circle at 1px 1px, rgba(30,58,138,0.08) 1px, transparent 0)",
        "hero-gradient":
          "linear-gradient(135deg, #FFFFFF 0%, #F5F7FA 45%, #EAF6F0 100%)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-500px 0" },
          "100%": { backgroundPosition: "500px 0" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "gradient-x": "gradient-x 6s ease infinite",
        "fade-up": "fade-up 0.6s ease-out forwards",
        shimmer: "shimmer 2.5s infinite linear",
      },
      backgroundSize: {
        "200%": "200% 200%",
      },
    },
  },
  plugins: [],
};
export default config;
