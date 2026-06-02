/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        takraay: {
          footer: '#0081a7'
        }
      },
      fontFamily: {
        sans: ['Vazirmatn', 'sans-serif'],
      }
    },
  },
  plugins: [],
}