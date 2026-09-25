/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./docs/**/*.html'],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px', // the design's desktop board width
    },
    extend: {
      colors: {
        accent: { DEFAULT: '#C8283A', hover: '#A81F30' },
        brand: { DEFAULT: '#B82435', dark: '#8E1A28' },
        ink: '#141414',
        body: '#3D3A36',
        muted: '#55514C',
        paper: '#FAF8F5',
        line: '#E6E1DA',
        rule: '#D9D3CB',
        field: '#B5ADA2',
        blush: '#F2A1A9',
        mist: '#D6D2CC',
      },
      fontFamily: {
        display: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Source Sans 3"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
