/** @type {import('tailwindcss').Config} */
// Colors live here. Change them once and the whole app updates.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: { 50: '#FFFDF9', 100: '#FAF7F2', 200: '#F2ECE2', 300: '#E6DDCF' },
        ink: { DEFAULT: '#14213D', soft: '#3B4663', muted: '#667090' },
        brand: {
          50: '#F1EFFF', 100: '#E4E0FF', 200: '#CBC4FF', 300: '#A99DFF', 400: '#8A78FA',
          500: '#6D57F0', 600: '#5B3FE0', 700: '#4A31BF', 800: '#3C2A99', 900: '#2A1D6E',
        },
      },
      fontFamily: {
        sans: ['"Albert Sans"', 'system-ui', 'sans-serif'],
        display: ['"Bricolage Grotesque"', '"Albert Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(20,33,61,.04), 0 10px 28px -14px rgba(20,33,61,.14)',
        lift: '0 2px 4px rgba(20,33,61,.05), 0 20px 44px -18px rgba(91,63,224,.34)',
      },
    },
  },
  plugins: [],
}
