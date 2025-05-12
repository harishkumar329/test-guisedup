/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#FF6B9C',  // Light pink
          DEFAULT: '#FF1A75', // Bright pink
          dark: '#CC1660',   // Dark pink
        },
        secondary: {
          light: '#9D7CFF',  // Light purple
          DEFAULT: '#7C4DFF', // Bright purple
          dark: '#5E3ACC',   // Dark purple
        },
        accent: {
          yellow: '#FFD93D',
          cyan: '#00D4FF',
          green: '#4CAF50',
        }
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
