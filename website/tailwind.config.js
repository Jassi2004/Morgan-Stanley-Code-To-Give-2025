/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {
        colors: {
          light: '#f9fafb',
          dark: '#1f2937',
          primary: '#2563eb',
          'primary-dark': '#1e40af',
          secondary: '#10b981',
          'secondary-dark': '#065f46',
          accent: '#f59e0b',
          'accent-hover': '#d97706',
        },
      },
    },
    plugins: [],
  };
  