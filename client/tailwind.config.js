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
        'custom-bg': '#FFFFFF',
        'primary-text': '#000000',
        'secondary-text': '#999999',
        'secondary-bg':'#B3B3B3'
        // You can add more custom colors here
      }
    }, 
  }, 
  // eslint-disable-next-line no-undef
  plugins: [require("daisyui")],
};


export default config;