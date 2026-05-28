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
      },
      fontFamily: {
        headline: ['Poppins', 'Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        card: '0 4px 6px -1px rgba(30, 90, 168, 0.1), 0 2px 4px -2px rgba(30, 90, 168, 0.1)',
      },
    },
  },
  plugins: [],
}
