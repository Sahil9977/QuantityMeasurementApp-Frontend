/** @type {import('tailwindcss').Config} */
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default {
  content: [
    join(__dirname, "./index.html"),
    join(__dirname, "./src/**/*.{js,jsx,ts,tsx}"),
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10b981',
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        dark: {
          950: '#030706',
          900: '#0a0f0d',
          800: '#0d1117',
          700: '#151b23',
          600: '#1c2432',
          500: '#252d3d',
          400: '#374151',
        },
        accent: {
          cyan: '#22d3ee',
          teal: '#2dd4bf',
          emerald: '#34d399',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-sm': '0 0 20px rgba(16, 185, 129, 0.15)',
        'glow-md': '0 0 40px rgba(16, 185, 129, 0.2)',
        'glow-lg': '0 0 60px rgba(16, 185, 129, 0.3)',
        'inner-glow': 'inset 0 0 20px rgba(16, 185, 129, 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      }
    },
  },
  plugins: [],
}
