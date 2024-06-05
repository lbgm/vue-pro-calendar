/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  mode: "jit",
  darkMode: false,
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    screens: {
      mobile: { max: "767px" },
      large: { min: "768px" },
    },
    extend: {
      backgroundColor: {
        "14-165-233": "rgb(14, 165, 233)",
      },
      width: {
        "10dt125rem": "10.125rem",
      },
      padding: {
        "0dt375": "0.375rem",
      },
      margin: {
        "1dt125": "1.125rem",
      },
      gridTemplateColumns: {
        "3rem-1fr-3rem": "3rem 1fr 3rem",
        "repeat-7-minmax-0v1fr": "repeat(7,minmax(0,1fr))",
        "3-repeat-7-minmax-0v1fr-3rem": "3rem,repeat(7,minmax(0,1fr)),3rem",
      },
      fontFamily: {
        vpc: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
        ],
      },
      fontSize: {
        "0dt625": "0.625rem",
        "1dt375": "1.375rem",
        "1dt563": "1.563rem",
        "0dt688": "0.688rem",
        "0dt813": "0.813rem",
      },
      height: {
        "50p": "50%",
        "92px": "92px",
      },
      minHeight: {
        "2dt25": "2.25rem",
        "5dt063": "5.063rem",
      },
      maxHeight: {
        "18dt75": "18.75rem",
      },
      minWidth: {
        "24dt813": "24.813rem",
        "11dt5": "11.5rem",
        "16dt563": "16.563rem",
      },
      maxWidth: {
        "50p": "50%",
        "20rm": "20rem",
      },
      zIndex: {
        one: 1,
        two: 2,
      },
      letterSpacing: {
        m0dt02: "-0.02em",
      },
    },
    colors: {
      white: "white",
      black: "black",
      "2062F6": "#2062F6",
      "18181B": "#18181B",
      "09101D": "#09101D",
      "006A52": "#006A52",
      E07A2C: "#E07A2C",
      E0E0E0: "#E0E0E0",
      FAFAFA: "#FAFAFA",
      "71717A": "#71717A",
      F4F4F5: "#F4F4F5",
      A1A1AA: "#A1A1AA",
      "005743": "#005743",
      F7F7F7: "#F7F7F7",
      "6D7580": "#6D7580",
      "3B82F6": "#3B82F6",
      DD4816: "#DD4816",
      "0EA5E9": "#0EA5E9",
      "0369A1": "#0369A1",
      EFF6FF: "#eff6ff",
    },
  },
  plugins: [],
};
