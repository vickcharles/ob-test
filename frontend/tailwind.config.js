/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ffab40',
          50: '#fffaeb',
          100: '#fff1c7',
          200: '#ffe08a',
          300: '#ffcb4d',
          400: '#ffab40', // Main primary color
          500: '#f99000',
          600: '#dd6e00',
          700: '#b74d00',
          800: '#943d05',
          900: '#7a3508',
          950: '#461a00',
        },
        gray: {
          600: '#272b30',
          700: '#272b30',
          900: '#101415',
          800: '#1a1d1f' // Dark background color
        },
        background: {
          dark: '#101415', // Dark background color
        },
        utilia: {
          500: '#ffab40',
        },
      },
    },
  },
  plugins: [],
}

