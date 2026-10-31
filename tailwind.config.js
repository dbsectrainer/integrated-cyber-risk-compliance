/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './*.{ts,tsx}', './components/**/*.{ts,tsx}', './contexts/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'gray-900': '#121212',
        'gray-800': '#1e1e1e',
        'gray-700': '#2d2d2d',
        'gray-600': '#444444',
        'gray-400': '#9ca3af',
        'gray-300': '#d1d5db',
        'gray-200': '#e5e7eb',
        'blue-500': '#3b82f6',
        'blue-600': '#2563eb',
        'green-500': '#22c55e',
        'yellow-500': '#eab308',
        'red-500': '#ef4444',
        'purple-500': '#8b5cf6',
        'teal-500': '#14b8a6',
      },
      fontFamily: { sans: ['Inter', 'sans-serif'] },
      animation: { 'fade-in': 'fadeIn 0.5s ease-in-out' },
      keyframes: { fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } } },
    },
  },
  plugins: [],
};
