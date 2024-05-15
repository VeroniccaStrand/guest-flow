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
      } ,
       colors: {
        'brand-red': '#bf2519',
        'custom-bg': '#1c1c1e',
        'primary-text': '#e5e5e5',
        'secondary-text': '#a8a8a8'
        // You can add more custom colors here
      }
    }, 
  }, 
  // eslint-disable-next-line no-undef
  plugins: [require("daisyui")],
};


export default config;