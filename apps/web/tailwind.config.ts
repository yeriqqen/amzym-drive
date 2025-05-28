import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#ff6600",
          light: "#ff9900",
          dark: "#ff3300",
        },
        secondary: {
          DEFAULT: "#007bff",
          dark: "#0056b3",
        },
        background: {
          DEFAULT: "#fff8f0",
        },
        text: {
          DEFAULT: "#2c3e50",
          light: "#6c7483",
          placeholder: "#901",
        },
      },
      fontFamily: {
        sans: ["Gill Sans", "Arial", "sans-serif"],
      },
      boxShadow: {
        custom: "0 4px 8px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
