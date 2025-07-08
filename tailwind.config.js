/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],  theme: {
    extend: {
      colors: {
        'water-blue': '#60a5fa',
        'sleep-indigo': '#818cf8',
        'exercise-green': '#34d399',
        'mood-yellow': '#fbbf24',
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
