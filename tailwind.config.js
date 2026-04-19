/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-gray': "#333b50",
        'custom-green': '#00d646',
        'custom-green-v2': '#4CAF51',
        'custom-dark': '#0a0a0a',
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
