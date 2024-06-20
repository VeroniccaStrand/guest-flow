/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        body: ['Poppins', 'sans-serif'],
      },
      colors: {
        'brand-red': '#bf2519',
        'custom-bg': '#FFFFFF',
        'primary-text': '#000000',
        'secondary-text': '#999999',
        'nyans-text': '#444444',
        'secondary-bg': '#B3B3B3',
      },
      backgroundImage: {
        'bg-image': "url('assets/Welcome_toNolato_2024-1080p.png')",
        'gray-gradient':
          'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(249, 249, 244, 0.4), #f3f3ed, #ededeb, #e7e7e4, #e1e1dd, #dbdbd6, #d5d5cf)',
      },
      gridTemplateColumns: {
        'auto-fill-sm': 'repeat(auto-fill, minmax(300px, 1fr))',
        'auto-fill-100': 'repeat(auto-fill, minmax(700px, 1fr))',
        'auto-fit-100': 'repeat(auto-fit, minmax(200px, 3fr))',
      },
      screens: {
        laptop: '1024px', // Standard för laptop
        desktop: '1440px', // Standard för desktop
        tv: '2560px', // Större skärm, t.ex. 55 tum TV
      },
    },
  },
  plugins: [
    // eslint-disable-next-line no-undef
    require('daisyui'),
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
