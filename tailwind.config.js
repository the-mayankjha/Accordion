/** @type {import('tailwindcss').Config} */
import { colors, spacing, shadows, typography } from './src/theme';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // or 'class'
  theme: {
    extend: {
      colors: {
        notion: {
          bg: {
            DEFAULT: 'var(--bg-default)',
            secondary: 'var(--bg-secondary)',
            hover: 'var(--bg-hover)',
            active: 'var(--bg-active)',
          },
          text: {
            DEFAULT: 'var(--text-default)',
            secondary: 'var(--text-secondary)',
            disabled: 'var(--text-disabled)',
          },
          border: {
            DEFAULT: 'var(--border-default)',
            focus: 'var(--border-focus)',
          },
          accent: {
            gold: 'var(--accent-gold)',
          }
        },
      },
      spacing: spacing,
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeight,
      boxShadow: shadows,
    },
  },
  plugins: [],
}
