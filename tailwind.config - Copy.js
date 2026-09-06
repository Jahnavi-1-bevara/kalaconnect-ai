/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        craft: {
          terracotta: '#C85A32',
          'terracotta-dark': '#A44220',
          'terracotta-light': '#F8EFE9',
          linen: '#FDFBF7',
          stone: '#F5EFEB',
          sand: '#EAE1D5',
          clay: '#8D5B4C',
          charcoal: '#1A1D1B',
          muted: '#636A66',
          brass: '#B8860B',
          'brass-light': '#FDF8EC',
          forest: '#2A4736',
          'forest-light': '#EBF2EE',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'Cambria', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'craft-sm': '0 1px 3px rgba(27, 30, 28, 0.05)',
        'craft-md': '0 4px 12px rgba(27, 30, 28, 0.08)',
        'craft-lg': '0 12px 28px rgba(27, 30, 28, 0.12)',
        'craft-xl': '0 20px 40px rgba(27, 30, 28, 0.15)',
      }
    },
  },
  plugins: [],
}
