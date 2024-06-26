/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-gray': "#333b50",
        'custom-green': '#00d646',
        'custom-green-v2': '#4CAF51'
      },
      fontFamily: {
        lulo: ['Lulo', 'sans-serif'],
      },
      screens: {
        'max-md': {'max': '1023px'}
      }
    },
  },
  plugins: [],
}

