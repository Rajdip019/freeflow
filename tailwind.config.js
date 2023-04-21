/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontSize: {
      "base": "16px",
      "lg": "18px",
      "xs": ".75rem",
      "sm": ".875rem",
      "md" : "1rem",
      "xl": "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "4rem",
      "7xl": "5rem",
      "13xl": "32px",
      "41xl": "60px",
      "4xl": "23px",
      "57xl": "76px",
      "20xl": "39px",
      "7xl": "26px",
      "5xl": "24px",
      "81xl": "100px",
    },
  },
  corePlugins: { preflight: false },
};
