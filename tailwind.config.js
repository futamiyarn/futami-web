/** @type {import('tailwindcss').Config} */
export default {
  content: ["./**/*.html", "./app/**/*.svelte", "./**/*.scss"],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
