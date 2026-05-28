/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E5AA8',
          dark: '#143C73',
          light: '#E8F1FB',
        },
        neutral: {
          DEFAULT: '#6B7280',
        },
        background: '#F9FAFB',
        sidebar: '#0F172A',
      },
      fontFamily: {
        headline: ['Poppins', 'Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
