// File: tailwind.config.ts
// import { Config } from 'tailwindcss' // Removed TypeScript-only import

const config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Definisikan font custom kita
        heading: ['var(--font-amiri)'],
        sans: ['var(--font-poppins)'],
      },
      colors: {
        // Definisikan warna primer dan sekunder sesuai PRD
        primary: '#2ECC71', // Emerald
        secondary: '#D4AF37', // Gold
      }
    },
  },
  plugins: [],
}
export default config