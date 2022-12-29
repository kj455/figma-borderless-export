/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./ui/src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        darkgray: '#2b2b2b',
        lightgray: '#383838',
      },
    },
  },
  plugins: [],
};
