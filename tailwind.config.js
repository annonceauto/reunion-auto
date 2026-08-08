/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        basalte: '#15181A',   // roche volcanique - fond principal
        basalte2: '#1E2226',
        lagon: '#1FB6A6',     // turquoise lagon - accent principal
        lagon2: '#17968A',
        fournaise: '#E8542A', // rouge lave - accent d'action
        vanille: '#F2EBDD',   // blanc cassé chaud - texte clair
        letchi: '#8A2E3B',    // rouge letchi profond - accent secondaire
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
