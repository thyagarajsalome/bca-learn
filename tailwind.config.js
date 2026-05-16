/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        bg:       'var(--color-bg)',
        surface:  'var(--color-surface)',
        surface2: 'var(--color-surface2)',
        border:   'var(--color-border)',
        accent:   'var(--color-accent)',
        accent2:  'var(--color-accent2)',
        muted:    'var(--color-muted)',
        subtle:   'var(--color-subtle)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}
