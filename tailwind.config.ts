import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        indigo: {
          50: '#eef0fb',
          100: '#daddf5',
          200: '#b3baeb',
          300: '#8b97e0',
          400: '#5c6bce',
          500: '#3c4aad',
          600: '#2f3a8a',
          700: '#252d6b',
          800: '#1c2252',
          900: '#141939',
          950: '#0c0f24',
        },
        jade: {
          50: '#e9f7f1',
          100: '#cdeee0',
          200: '#9adcc2',
          300: '#66c9a3',
          400: '#3aab84',
          500: '#288a69',
          600: '#1f6e54',
          700: '#195842',
          800: '#134030',
          900: '#0d2c21',
        },
        parchment: {
          50: '#fdfbf6',
          100: '#f9f3e7',
          200: '#f1e6cd',
          300: '#e8d7ae',
          400: '#dcc188',
          500: '#c9a75f',
        },
        ink: {
          50: '#f4f5f6',
          100: '#e2e4e7',
          200: '#c3c8ce',
          300: '#9aa1aa',
          400: '#6b7280',
          500: '#4a5058',
          600: '#363b42',
          700: '#262a30',
          800: '#1a1d21',
          900: '#101215',
          950: '#08090a',
        },
        sand: {
          100: '#f3ede2',
          200: '#e6dac6',
          300: '#d5c3a2',
        },
        gold: {
          400: '#c9a05a',
          500: '#b5893f',
          600: '#96702f',
        },
      },
      fontFamily: {
        arabic: [
          '"Noto Naskh Arabic"',
          '"Amiri"',
          '"Traditional Arabic"',
          '"Scheherazade New"',
          'serif',
        ],
        sans: [
          '"Inter"',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
        serif: ['"Source Serif 4"', 'ui-serif', 'Georgia', 'serif'],
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'rise-in': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.55' },
        },
        'letter-shift': {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '50%': { transform: 'translateX(-6px)', opacity: '.4' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in .4s ease-out',
        'rise-in': 'rise-in .45s cubic-bezier(.2,.8,.2,1)',
        'pulse-soft': 'pulse-soft 1.8s ease-in-out infinite',
        'letter-shift': 'letter-shift .6s ease-in-out',
      },
    },
  },
  plugins: [],
};

export default config;
