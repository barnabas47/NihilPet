/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'void-base': '#050508',
        'surface': '#131317',
        'surface-dim': '#131317',
        'surface-bright': '#39393d',
        'surface-container-lowest': '#0e0e12',
        'surface-container-low': '#1b1b1f',
        'surface-container': '#1f1f23',
        'surface-container-high': '#2a292e',
        'surface-container-highest': '#353439',
        'on-surface': '#e5e1e7',
        'on-surface-variant': '#b9cacb',
        'outline': '#849495',
        'outline-variant': '#3a494b',
        'primary': '#e0fdff',
        'primary-container': '#00f2fe',
        'on-primary': '#00373a',
        'on-primary-container': '#006a70',
        'secondary': '#e0b6ff',
        'secondary-container': '#6d11ad',
        'on-secondary-container': '#d7a4ff',
        'tertiary': '#fff5f5',
        'tertiary-container': '#ffceda',
        'on-tertiary-container': '#bc0061',
        'error': '#ffb4ab',
        'error-container': '#93000a',
        'on-error': '#690005',
        'on-error-container': '#ffdad6',
        'lcd-bg': '#9BBC0F',
        'lcd-pixel-light': '#8BAC0F',
        'lcd-pixel-mid': '#306230',
        'lcd-pixel-dark': '#0F380F',
        'surface-glass': 'rgba(255, 255, 255, 0.04)',
        'border-glass': 'rgba(255, 255, 255, 0.08)',
        'border-glow': 'rgba(0, 242, 254, 0.25)',
      },
      fontFamily: {
        headline: ['Geist', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
        body: ['Geist', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse-subtle 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer-beam 4s ease infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        'shimmer-beam': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      },
    },
  },
  plugins: [],
};

