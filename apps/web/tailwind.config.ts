import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      container: { center: true, padding: '1rem' },
      fontFamily: {
        vazir: ['Vazirmatn', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
  rtl: true,
} satisfies Config;
