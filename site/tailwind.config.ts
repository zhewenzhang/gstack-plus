import type { Config } from 'tailwindcss';
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Instrument Serif"', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        ink: '#000000',
        muted: '#6F6F6F',
        background: '#FFFFFF',
      },
      animation: {
        'fade-rise': 'fadeRise 0.8s ease-out both',
        'fade-rise-delay': 'fadeRise 0.8s ease-out 0.2s both',
        'fade-rise-delay-2': 'fadeRise 0.8s ease-out 0.4s both',
      },
      keyframes: {
        fadeRise: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
