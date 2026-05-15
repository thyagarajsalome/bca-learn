/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        bg:       '#080c18',
        surface:  '#0f1526',
        surface2: '#161d35',
        border:   '#1e2a4a',
        accent:   '#6366f1',
        accent2:  '#818cf8',
        muted:    '#8890b5',
        subtle:   '#4a5280',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}
