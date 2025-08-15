const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Amiri', 'serif'],
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: '#2ECC71',
        secondary: '#D4AF37',
      },
    },
  },
  plugins: [],
}
module.exports = config