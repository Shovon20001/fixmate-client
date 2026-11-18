/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#0f2a3d", 800: "#173a52", 700: "#27475c", 500: "#5a7184", 300: "#9db0bf", 200: "#c9d5de", 100: "#e3eaf0", 50: "#eef2f6" },
        mist: "#f3f5f7",
        brand: { 50: "#fff4ec", 100: "#ffe4d0", 200: "#ffc79f", 500: "#f26b1d", 600: "#d9500a", 700: "#b04008" },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', "ui-sans-serif", "system-ui", "sans-serif"],
        body: ['"Instrument Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        tag: "0 1px 0 rgba(15,42,61,.06), 0 10px 30px -12px rgba(15,42,61,.25)",
      },
    },
  },
  plugins: [],
};
