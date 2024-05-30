/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
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
