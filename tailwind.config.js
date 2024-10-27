/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'terminal-background': '#000000',
        'terminal-text': '#ffffff',
        'terminal-prompt': '#00ff00',
      },
    },
  },
  plugins: [],
}

