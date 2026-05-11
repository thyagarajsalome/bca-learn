/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0c0f1a',
        surface: '#13172a',
        accent: '#5b6af0',
        green: '#4ecca3',
        gold: '#f0b15b',
        'text-primary': '#e8eaf6',
        'text-muted': '#8890b5',
      },
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-in-out',
        'slideDown': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%': { maxHeight: '0' },
          '100%': { maxHeight: '1000px' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}