/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Surfaces
        page: '#F9F8F6',
        subtle: '#F4F2EF',
        muted: '#F0ECE9',
        card: '#FFFFFF',

        // Ink ladder
        ink: '#100F0E',
        'ink-2': '#47443F',
        'ink-3': '#665F55',
        ghost: '#999085',

        // Accent family
        accent: '#E3EB84',
        'accent-pale': '#F4F7DC',
        'accent-dark': '#8B9A3B',
        'accent-deep': '#6F7C2D',
        'accent-ink': '#3F4618',
        cream: '#FBFCF3',

        // Amber — warnings only
        amber: '#F59E0B',
        'amber-bg': '#FDF4E3',
        'amber-text': '#A05A06',
        'amber-border': '#F5D9A8',

        // Hairline borders (foreground at low alpha)
        'hairline-soft': 'rgba(16,15,14,0.07)',
        hairline: 'rgba(16,15,14,0.10)',
        'hairline-strong': 'rgba(16,15,14,0.16)',

        // Legacy aliases (kept pointing at new palette during migration)
        bg: '#F9F8F6',
        surface: '#F0ECE9',
        border: 'rgba(16,15,14,0.10)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        card: '1rem',
      },
      letterSpacing: {
        eyebrow: '0.14em',
      },
      boxShadow: {
        elevated: '0 10px 24px -6px rgba(16,15,14,0.14)',
      },
      animation: {
        'fade-up': 'fadeUp 0.25s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
