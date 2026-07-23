import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        "13": "repeat(13, minmax(0, 1fr))",
      },
      colors: {
        blue: {
          400: "#2589FE",
          500: "#0070F3",
          600: "#2F6FEB",
        },
      },
    },
    keyframes: {
      shimmer: {
        "100%": {
          transform: "translateX(100%)",
        },
      },
      ring: {
        "0%": { transform: "rotate(0deg)" },
        "25%": { transform: "rotate(15deg)" },
        "50%": { transform: "rotate(0deg)" },
        "75%": { transform: "rotate(-15deg)" },
        "100%": { transform: "rotate(0deg)" },
      },
      fadeIn: {
        "0%": { opacity: "0" },
        "100%": { opacity: "1" },
      },
      slideUp: {
        "0%": { opacity: "0", transform: "translateY(20px)" },
        "100%": { opacity: "1", transform: "translateY(0)" },
      },
      shake: {
        "0%, 100%": { transform: "translateX(0)" },
        "25%": { transform: "translateX(-5px)" },
        "75%": { transform: "translateX(5px)" },
      },
    },
    animation: {
      shimmer: "shimmer 1s linear infinite",
      ring: "ring 1s ease-in-out infinite",
      fadeIn: "fadeIn 0.5s ease-out forwards",
      slideUp: "slideUp 0.5s ease-out forwards",
      shake: "shake 0.3s ease-in-out",
    },
  },

  plugins: [require("@tailwindcss/forms")],
};
export default config;
