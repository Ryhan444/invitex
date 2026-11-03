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
        background: "var(--background)",
        foreground: "var(--foreground)",
        netflix: {
          red: "#E50914",
          redHover: "#B80710",
          black: "#141414",
          carbon: "#0b0b0b",
          dark: "#181818",
          card: "#1f1f1f",
          gray: "#808080",
          lightGray: "#e5e5e5",
          border: "#2f2f2f",
        },
      },
      fontFamily: {
        netflix: ["Bebas Neue", "Impact", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-cinzel)", "Georgia", "serif"],
      },
      backgroundImage: {
        "netflix-gradient": "linear-gradient(180deg, rgba(20,20,20,0) 0%, rgba(20,20,20,0.8) 70%, #141414 100%)",
        "radial-netflix": "radial-gradient(circle at top center, rgba(229,9,20,0.18) 0%, rgba(20,20,20,0) 70%)",
      },
      keyframes: {
        pulseSlow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
      animation: {
        "pulse-slow": "pulseSlow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;

