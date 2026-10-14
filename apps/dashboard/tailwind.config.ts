import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/config/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#F3F3F1',
        'bg-alt': '#ECECE9',
        surface: '#FFFFFF',
        'surface-2': '#F7F7F5',
        hairline: '#E4E4E1',
        'hairline-soft': '#EDEDEA',
        'text-1': '#111111',
        'text-2': '#5C5C5C',
        'text-3': '#8A8A8A',

        'bg-dark': '#0E0E0E',
        'surface-dark': '#1A1A1A',
        'surface-dark-2': '#242424',
        'hairline-dark': '#2A2A2A',
        'hairline-dark-soft': '#202020',
        'text-1-dark': '#FAFAFA',
        'text-2-dark': '#A0A0A0',
        'text-3-dark': '#6E6E6E',

        accent: '#111111',
        'accent-hover': '#2E2E2E',
        'accent-hi': '#111111',
        'accent-soft': 'rgba(17, 17, 17, 0.06)',
        'accent-line': '#E4E4E1',

        brand: '#7C8C6B',
        'brand-soft': 'rgba(124, 140, 107, 0.14)',
        success: '#3F7D5A',
        warn: '#B8860B',
        danger: '#B3261E',
      },
      fontFamily: {
        display: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tighter: '-0.03em',
        tight: '-0.025em',
        snug: '-0.02em',
        label: '0.18em',
      },
      borderRadius: {
        none: '0px',
        sm: '0px',
        DEFAULT: '0px',
        md: '0px',
        lg: '0px',
        full: '0px',
      },
      boxShadow: {
        float: '0 12px 40px rgba(0,0,0,0.08)',
        photo: '0 24px 60px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
};

export default config;
