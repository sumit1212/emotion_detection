/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // 👈 Add this to match your React components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
