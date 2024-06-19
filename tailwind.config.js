/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    // screens: {
    //   base: '940px',
    // },
    extend: {
      boxShadow: {
        popover: '0 0 4px 0 rgba(0, 0, 0, .3)',
        button: '0 2px 20px rgba(0,0,0,.1)',
        card: '0 4px 4px rgba(0,0,0,.15)',
      },
      zIndex: {
        popover: 1039,
      },
      colors: {
        primary: '#2dc08d',
        dark: '#384347',
        secondary: '#002b7f',
        sub: '#56acf2',
        red: {
          DEFAULT: '#ff576f',
          hover: '#ff2443',
          800: '#ff0025',
        },
        green: {
          DEFAULT: '#2dc08d',
          hover: '#008363',
        },
        gray: {
          DEFAULT: '#d8d7db',
          hover: '#999',
        },
        purple: {
          DEFAULT: '#8c7cdb',
        },
        black: '#384347',
      },
      width: {
        'page-a4': '2480px',
      },
      height: {
        'page-a4': '3508px',
      },
      transitionProperty: {
        radius: 'border-radius',
      },
    },
  },
  plugins: [],
};
