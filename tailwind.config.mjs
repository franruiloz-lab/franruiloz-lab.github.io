/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        navy: {
          50:  '#f0f4ff',
          100: '#e0e9ff',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'blueprint': `
          linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px),
          linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)
        `,
      },
      backgroundSize: {
        'blueprint': '40px 40px',
      },
    },
  },
  plugins: [],
};
