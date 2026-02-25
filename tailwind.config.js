/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // La Diabla HOT & SPICY brand colors - Dark theme with fire
        diabla: {
          black: '#0a0a0a',        // Pure deep black
          charcoal: '#1a1a1a',     // Slightly lighter black
          darkGray: '#2d2d2d',     // Dark gray for cards
          fireRed: '#FF0000',      // Intense fire red
          hotRed: '#DC143C',       // Crimson hot
          emberRed: '#8B0000',     // Dark ember red
          flameOrange: '#FF4500',  // Orange flame
          pepperYellow: '#FFD700', // Yellow pepper accent
          smokeGray: '#4a4a4a',    // Smoke gray
        },
      },
      fontFamily: {
        'metal': ['Metal Mania', 'cursive'],      // Main edgy font
        'burned': ['Rubik Burned', 'cursive'],    // Fire burned effect
        'rye': ['Rye', 'cursive'],                // Grunge western style
        'creepster': ['Creepster', 'cursive'],    // Horror/dark style
      },
      backgroundImage: {
        'fire-gradient': 'linear-gradient(to top, #0a0a0a, #8B0000, #FF0000)',
        'ember-gradient': 'linear-gradient(135deg, #0a0a0a 0%, #8B0000 50%, #FF0000 100%)',
        'hot-gradient': 'linear-gradient(to right, #8B0000, #DC143C, #FF4500)',
      },
      boxShadow: {
        'fire': '0 0 20px rgba(255, 0, 0, 0.5), 0 0 40px rgba(255, 0, 0, 0.3)',
        'ember': '0 0 15px rgba(139, 0, 0, 0.6)',
        'glow-red': '0 0 30px rgba(255, 0, 0, 0.7)',
      },
      textShadow: {
        'fire': '0 0 10px rgba(255, 0, 0, 0.8), 0 0 20px rgba(255, 69, 0, 0.6)',
        'red': '0 0 5px rgba(220, 20, 60, 0.9)',
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        diabla: {
          "primary": "#DC143C",      // Hot Red
          "secondary": "#FF4500",    // Flame Orange
          "accent": "#FFD700",       // Pepper Yellow
          "neutral": "#1a1a1a",      // Charcoal
          "base-100": "#0a0a0a",     // Deep Black
          "base-200": "#1a1a1a",     // Charcoal
          "base-300": "#2d2d2d",     // Dark Gray
          "info": "#FF4500",         // Flame Orange
          "success": "#FFD700",      // Pepper Yellow
          "warning": "#FF4500",      // Flame Orange
          "error": "#FF0000",        // Fire Red
        },
      },
    ],
  },
}
