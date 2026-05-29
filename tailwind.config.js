/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
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
};
