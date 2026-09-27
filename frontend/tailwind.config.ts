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
        market: {
          yellow: '#f8e05d',
          yellowDark: '#ecd246',
          yellowLight: '#fffbe5',
          black: '#222222',
          dark: '#1a1a1a',
          gray: '#797979',
          light: '#f9f9f9',
          border: '#e5e7eb',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Oswald', 'sans-serif'],
        script: ['Satisfy', 'cursive'],
      },
    },
  },
  plugins: [],
};

export default config;
