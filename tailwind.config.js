/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "gradient-bg": "#0c111b",
        "gradient-bg-2": "#141a28",
      }
    },
  },
  plugins: [require('@tailwindcss/typography'), require("daisyui"), require("@tailwindcss/line-clamp")],
}
