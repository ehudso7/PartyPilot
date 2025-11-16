import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#6C63FF',
        dark: '#121212'
      }
    }
  },
  plugins: []
};

export default config;
