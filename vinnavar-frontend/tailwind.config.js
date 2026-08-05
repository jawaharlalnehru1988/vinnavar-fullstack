/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        vinnavar: {
          50: '#f2fdf5',
          100: '#e1fbe8',
          200: '#c2f6d2',
          500: '#2d6a4f',
          600: '#1b4332',
          700: '#081c15',
        }
      }
    },
  },
  plugins: [],
}

