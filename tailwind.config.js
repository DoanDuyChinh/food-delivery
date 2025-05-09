/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF5F1',
          100: '#FFE9E0',
          200: '#FFD3C2',
          light: '#FF7E54',
          DEFAULT: '#FF6B3D',
          dark: '#E55A2B',
        },
        secondary: {
          50: '#F0F3FA',
          100: '#E2E7F5',
          200: '#C4D0EB',
          light: '#6B7FD7',
          DEFAULT: '#5367C2',
          dark: '#3F51B5',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
