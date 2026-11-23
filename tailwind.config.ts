import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060a14',
          900: '#0b132b',
          800: '#111d40',
          700: '#1c2541',
          600: '#2b3658',
        },
        emerald: {
          DEFAULT: '#10b981',
          500: '#10b981',
          400: '#34d399',
        },
        teal: {
          DEFAULT: '#14b8a6',
          500: '#14b8a6',
          400: '#2dd4bf',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;
