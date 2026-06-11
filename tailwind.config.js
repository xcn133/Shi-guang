/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        romantic: {
          pink: '#FFB6C1',
          rose: '#DC143C',
          lavender: '#E6E6FA',
          gold: '#FFD700'
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'petal-fall': 'petal-fall linear infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'scale-up': 'scale-up 0.3s ease-out'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' }
        },
        'petal-fall': {
          '0%': { transform: 'translateY(-10vh) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(110vh) rotate(720deg)', opacity: '0' }
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        'scale-up': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.1)' }
        }
      }
    }
  },
  plugins: [],
}
