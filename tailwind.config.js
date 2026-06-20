/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0f111a',
          sidebar: '#0c0d14',
          accent: '#6366f1',
          accentDark: '#4f46e5',
          bg: '#f8fafc',
          textMuted: '#94a3b8',
          textActive: '#f8fafc',
          glow: 'rgba(99, 102, 241, 0.15)',
        }
      }
    },
  },
  plugins: [],
}

