/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // allows light/dark mode toggle
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // app router
    "./pages/**/*.{js,ts,jsx,tsx}", // pages router
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-inner": "var(--bg-inner)",
        "text-inner": "var(--text-inner)",
      },
    },
  },
  plugins: [],
};
