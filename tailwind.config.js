/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        popover: "0 0 4px 0 rgba(0, 0, 0, .3)",
      },
      zIndex: {
        popover: 1039,
      },
      colors: {
        primary: "#2dc08d",
        dark: "#384347",
      },
      width: {
        "page-a4": "2480px",
      },
      height: {
        "page-a4": "3508px",
      },
    },
  },
  plugins: [],
};
