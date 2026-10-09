/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      // Direction A "Knižnica": warm paper background, white cards, burgundy accent.
      colors: {
        paper: '#FAF7F2',
        surface: '#FFFFFF',
        sunken: '#F3EEE6',
        line: {
          DEFAULT: '#E7DFD2',
          strong: '#D6CBBB',
        },
        ink: {
          DEFAULT: '#292524',
          soft: '#57534E',
          muted: '#78716C',
          faint: '#A8A29E',
        },
        brand: {
          DEFAULT: '#7C2D3A',
          hover: '#6A2531',
          soft: '#F5E9EB',
          ring: '#C98A95',
        },
        success: {
          DEFAULT: '#2F6B45',
          soft: '#E3EFE6',
        },
        warning: {
          DEFAULT: '#9A4B1C',
          soft: '#F6E6D8',
        },
        danger: {
          DEFAULT: '#B42318',
          hover: '#912018',
          soft: '#FDECEA',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
      borderRadius: {
        card: '14px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(41, 37, 36, 0.04), 0 4px 16px rgba(41, 37, 36, 0.05)',
        pop: '0 12px 40px rgba(41, 37, 36, 0.18)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
