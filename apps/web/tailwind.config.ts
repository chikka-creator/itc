import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#F4F7F9',
        'bg-alt': '#EBF1F5',
        surface: '#FFFFFF',
        hairline: '#DFE7ED',
        'hairline-soft': '#E9F0F5',
        'text-1': '#00222C',
        'text-2': '#445B62',
        'text-3': '#7F96A0',
        'bg-dark': '#001A22',
        'surface-dark': '#002530',
        'text-1-dark': '#F0F8FB',
        'text-2-dark': '#93B2BE',
        'text-3-dark': '#628492',
        'hairline-dark': '#003847',
        accent: '#00222C',
        'accent-hover': '#11323D',
        brand: '#28BBEA',
        'brand-hover': '#1698C2',
        'brand-soft': 'rgba(40, 187, 234, 0.12)',
        'brand-dark': '#00222C',
        success: '#10B981',
        warn: '#F59E0B',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-1': ['clamp(2.5rem, 5vw, 4rem)', { lineHeight: '1.08', fontWeight: '600', letterSpacing: '-0.02em' }],
        'display-2': ['clamp(2rem, 3.5vw, 3rem)', { lineHeight: '1.12', fontWeight: '600', letterSpacing: '-0.015em' }],
        'display-3': ['clamp(1.5rem, 2vw, 1.75rem)', { lineHeight: '1.3', fontWeight: '600', letterSpacing: '-0.01em' }],
        'body-lg': ['1.0625rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body': ['0.9375rem', { lineHeight: '1.65', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6', fontWeight: '400' }],
        'label': ['0.6875rem', { lineHeight: '1.2', fontWeight: '500', letterSpacing: '0.14em' }],
      },
      borderRadius: {
        none: '0px',
        sm: '0px',
        DEFAULT: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px',
        '2xl': '0px',
        '3xl': '0px',
        full: '0px',
        photo: '0px',
        card: '0px',
        chip: '0px',
      },
      boxShadow: {
        float: '0 12px 40px rgba(0,0,0,0.10)',
        photo: '0 24px 60px rgba(0,0,0,0.08)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'float-in': {
          '0%': { opacity: '0', transform: 'translateY(24px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        'spin-slow': 'spin-slow 20s linear infinite',
        'float-in': 'float-in 600ms cubic-bezier(0.16,1,0.3,1) forwards',
      },
      transitionDuration: {
        '400': '400ms',
      },
      transitionTimingFunction: {
        'ease-out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
