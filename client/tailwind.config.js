/** @type {import('tailwindcss').Config} */

const config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'body': ['Poppins', 'sans-serif'],
      },
      colors: {
        'brand-red': '#bf2519',
        'custom-bg': '#FFFFFF',
        'primary-text': '#000000',
        'secondary-text': '#999999',
        'nyans-text': '#444444',
        'secondary-bg': '#B3B3B3',
      },
      textShadow: {
        'red': '2px 2px 4px rgba(191, 37, 25, 0.5)', // Adding red text shadow
      },
          gridTemplateColumns: {
        'auto-fill-100': 'repeat(auto-fill, minmax(400px, 1fr))',
        'auto-fit-100': 'repeat(auto-fit, minmax(400px, 1fr))',
      },
    },
  },
 
  plugins: [
     // eslint-disable-next-line no-undef
    require("daisyui"),
    function ({ addUtilities }) {
      addUtilities({
         '.text-shadow': {
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
        },
        '.text-shadow-md': {
          textShadow: '3px 3px 6px rgba(0, 0, 0, 0.2)',
        },
        '.text-shadow-lg': {
          textShadow: '4px 4px 8px rgba(0, 0, 0, 0.3)',
        },
      });
    },
  ],
};

export default config;
