/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // <--- هذا السطر هو الأهم
  theme: {
    extend: {
      fontFamily: {
        sans: ['Cairo', 'sans-serif'], // تأكدنا من الخط هنا
      },
    },
  },
  plugins: [],
}