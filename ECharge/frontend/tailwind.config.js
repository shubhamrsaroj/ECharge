/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EAFFE7',
          100: '#D5FBD0',
          200: '#B0F7A1',
          300: '#8BF372',
          400: '#66EF43',
          500: '#41EB14',
          600: '#32BC0F',
          700: '#258D0B',
          800: '#195E08',
          900: '#0C2F04',
          950: '#061703',
        },
        dark: {
          100: '#2A2A2A', 
          200: '#202020', 
          300: '#181818', 
          400: '#121212', 
          500: '#0A0A0A',
        },
        neon: {
          green: '#41EB14',
          glow: 'rgba(65, 235, 20, 0.5)',
        }
      },
      backgroundColor: {
        'dark-gradient': 'linear-gradient(to right, #0A0A0A, #121212)',
      },
      boxShadow: {
        'neon': '0 0 5px rgba(65, 235, 20, 0.5), 0 0 20px rgba(65, 235, 20, 0.3)',
        'neon-sm': '0 0 2px rgba(65, 235, 20, 0.5), 0 0 10px rgba(65, 235, 20, 0.3)',
        'neon-lg': '0 0 10px rgba(65, 235, 20, 0.5), 0 0 30px rgba(65, 235, 20, 0.3)',
      },
      textShadow: {
        'neon': '0 0 5px rgba(65, 235, 20, 0.7)',
      }
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.text-shadow-neon': {
          textShadow: '0 0 5px rgba(65, 235, 20, 0.7)',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}; 