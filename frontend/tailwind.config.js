/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary: Electric Cyan
        primary: {
          50: '#e0faff',
          100: '#b3f3ff',
          200: '#80ebff',
          300: '#4de3ff',
          400: '#26dcff',
          500: '#00d2ff',
          600: '#00b8e0',
          700: '#0099bb',
          800: '#007a96',
          900: '#005c70',
          950: '#003d4d',
        },
        // Secondary: Futuristic Violet
        secondary: {
          50: '#f0e5ff',
          100: '#d9b8ff',
          200: '#c28aff',
          300: '#ab5cff',
          400: '#9433ff',
          500: '#7000ff',
          600: '#6200e0',
          700: '#5200bb',
          800: '#420096',
          900: '#320070',
          950: '#21004d',
        },
        // Accent: Neon Green
        neon: {
          50: '#e0fff4',
          100: '#b3ffe3',
          200: '#80ffd0',
          300: '#4dffbd',
          400: '#26ffad',
          500: '#00ff99',
          600: '#00e088',
          700: '#00bb72',
          800: '#00965c',
          900: '#007045',
          950: '#004d2e',
        },
        // Neutral grays (unchanged)
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
        // Dark mode surface colors
        dark: {
          bg: '#050505',
          surface: '#0d0d0d',
          card: '#111118',
          border: '#1e1e2e',
          muted: '#2a2a3a',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        heading: [
          'Poppins',
          'Inter',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        DEFAULT: '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        'full': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        'none': 'none',
        // Web3 glow shadows
        'glow-cyan': '0 0 20px rgba(0, 210, 255, 0.4), 0 0 60px rgba(0, 210, 255, 0.15)',
        'glow-violet': '0 0 20px rgba(112, 0, 255, 0.4), 0 0 60px rgba(112, 0, 255, 0.15)',
        'glow-neon': '0 0 20px rgba(0, 255, 153, 0.4), 0 0 60px rgba(0, 255, 153, 0.15)',
        'glow-sm-cyan': '0 0 10px rgba(0, 210, 255, 0.3)',
        'glow-sm-violet': '0 0 10px rgba(112, 0, 255, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-down': 'fadeInDown 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.6s ease-out',
        'slide-in-left': 'slideInLeft 0.6s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        // New Web3 animations
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'gradient-shift': 'gradientShift 4s ease infinite',
        'grid-flow': 'gridFlow 20s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 210, 255, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 210, 255, 0.7), 0 0 80px rgba(112, 0, 255, 0.3)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        gridFlow: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(60px)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '12px',
        'lg': '20px',
        'xl': '40px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        // Web3 gradients
        'gradient-web3': 'linear-gradient(135deg, #00d2ff, #7000ff)',
        'gradient-web3-rev': 'linear-gradient(135deg, #7000ff, #00d2ff)',
        'gradient-neon': 'linear-gradient(135deg, #00d2ff, #00ff99)',
        'gradient-dark': 'linear-gradient(135deg, #050505, #0a0a1a, #050505)',
        'gradient-hero': 'radial-gradient(ellipse at top, #0a0a2e 0%, #050505 60%)',
        'gradient-card': 'linear-gradient(135deg, rgba(0,210,255,0.05), rgba(112,0,255,0.05))',
        // Shimmer
        'shimmer-web3': 'linear-gradient(90deg, transparent 0%, rgba(0,210,255,0.15) 50%, transparent 100%)',
      },
      screens: {
        'xs': '475px',
        '3xl': '1600px',
        '4xl': '1920px',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [
    function ({ addUtilities, addComponents, theme }) {
      addUtilities({
        '.text-balance': {
          'text-wrap': 'balance',
        },
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        },
        // Glassmorphism utilities
        '.glass': {
          background: 'rgba(255, 255, 255, 0.08)',
          'backdrop-filter': 'blur(20px)',
          '-webkit-backdrop-filter': 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
        },
        '.glass-dark': {
          background: 'rgba(5, 5, 5, 0.6)',
          'backdrop-filter': 'blur(20px)',
          '-webkit-backdrop-filter': 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        },
        '.glass-card': {
          background: 'rgba(255, 255, 255, 0.05)',
          'backdrop-filter': 'blur(16px)',
          '-webkit-backdrop-filter': 'blur(16px)',
          border: '1px solid rgba(0, 210, 255, 0.15)',
        },
        // Gradient text
        '.text-gradient-web3': {
          background: 'linear-gradient(135deg, #00d2ff, #7000ff)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.text-gradient-neon': {
          background: 'linear-gradient(135deg, #00d2ff, #00ff99)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        // Neon border
        '.border-glow-cyan': {
          border: '1px solid rgba(0, 210, 255, 0.4)',
          'box-shadow': '0 0 10px rgba(0, 210, 255, 0.2), inset 0 0 10px rgba(0, 210, 255, 0.05)',
        },
        '.border-glow-violet': {
          border: '1px solid rgba(112, 0, 255, 0.4)',
          'box-shadow': '0 0 10px rgba(112, 0, 255, 0.2), inset 0 0 10px rgba(112, 0, 255, 0.05)',
        },
      });

      addComponents({
        // Web3 primary button
        '.btn-web3': {
          background: 'linear-gradient(135deg, #00d2ff, #7000ff)',
          color: '#ffffff',
          padding: `${theme('spacing.3')} ${theme('spacing.6')}`,
          borderRadius: theme('borderRadius.xl'),
          fontWeight: theme('fontWeight.semibold'),
          fontFamily: theme('fontFamily.heading'),
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            boxShadow: '0 0 25px rgba(0, 210, 255, 0.5), 0 0 50px rgba(112, 0, 255, 0.3)',
            transform: 'translateY(-2px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        // Outline Web3 button
        '.btn-web3-outline': {
          background: 'transparent',
          color: '#00d2ff',
          padding: `${theme('spacing.3')} ${theme('spacing.6')}`,
          borderRadius: theme('borderRadius.xl'),
          fontWeight: theme('fontWeight.semibold'),
          border: '1px solid rgba(0, 210, 255, 0.5)',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'rgba(0, 210, 255, 0.1)',
            boxShadow: '0 0 20px rgba(0, 210, 255, 0.3)',
            borderColor: '#00d2ff',
          },
        },
        // Web3 card
        '.card-web3': {
          background: 'rgba(255, 255, 255, 0.03)',
          'backdrop-filter': 'blur(16px)',
          border: '1px solid rgba(0, 210, 255, 0.1)',
          borderRadius: theme('borderRadius.2xl'),
          padding: theme('spacing.6'),
          transition: 'all 0.3s ease',
          '&:hover': {
            border: '1px solid rgba(0, 210, 255, 0.3)',
            boxShadow: '0 0 30px rgba(0, 210, 255, 0.1)',
            transform: 'translateY(-4px)',
          },
        },
        // Input Web3
        '.input-web3': {
          width: '100%',
          padding: `${theme('spacing.3')} ${theme('spacing.4')}`,
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(0, 210, 255, 0.2)',
          borderRadius: theme('borderRadius.xl'),
          color: 'inherit',
          fontSize: theme('fontSize.sm'),
          transition: 'all 0.2s ease',
          '&::placeholder': {
            color: 'rgba(156, 163, 175, 0.6)',
          },
          '&:focus': {
            outline: 'none',
            borderColor: '#00d2ff',
            boxShadow: '0 0 0 3px rgba(0, 210, 255, 0.15)',
            background: 'rgba(0, 210, 255, 0.05)',
          },
        },
      });
    },
  ],
};
