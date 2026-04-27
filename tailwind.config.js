/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Fraunces'", "ui-serif", "Georgia", "serif"],
        sans: ["'Inter'", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        cream: "#FBF7F0",
        ink: "#1B1F1A",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(20, 30, 20, 0.04), 0 8px 24px rgba(20, 30, 20, 0.06)",
      },
    },
  },
  plugins: [],
};
