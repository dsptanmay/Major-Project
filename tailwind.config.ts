import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // theme: {
  //   extend: {
  //     colors: {
  //       main: "#88aaee",
  //       mainAccent: "#4d80e6", // not needed for shadcn components
  //       overlay: "rgba(0,0,0,0.8)", // background color overlay for alert dialogs, modals, etc.

  //       // light mode
  //       bg: "#dfe5f2",
  //       text: "#000",
  //       border: "#000",

  //       // dark mode
  //       darkBg: "#272933",
  //       darkText: "#eeefe9",
  //       darkBorder: "#000",
  //       secondaryBlack: "#212121", // opposite of plain white, not used pitch black because borders and box-shadows are that color
  //     },
  //     borderRadius: {
  //       base: "0px",
  //     },
  //     boxShadow: {
  //       light: "3px 3px 0px 0px #000",
  //       dark: "3px 3px 0px 0px #000",
  //     },
  //     translate: {
  //       boxShadowX: "3px",
  //       boxShadowY: "3px",
  //       reverseBoxShadowX: "-3px",
  //       reverseBoxShadowY: "-3px",
  //     },
  //     fontWeight: {
  //       base: "500",
  //       heading: "700",
  //     },
  //   },
  // },
  theme: {
    extend: {
      colors: {
        main: "#88aaee",
        mainAccent: "#4d80e6", // not needed for shadcn components
        overlay: "rgba(0,0,0,0.8)", // background color overlay for alert dialogs, modals, etc.

        // light mode
        bg: "#dfe5f2",
        text: "#000",
        border: "#000",

        // dark mode
        darkBg: "#272933",
        darkText: "#eeefe9",
        darkBorder: "#000",
        secondaryBlack: "#212121", // opposite of plain white, not used pitch black because borders and box-shadows are that color
      },
      borderRadius: {
        base: "0px",
      },
      boxShadow: {
        light: "3px 3px 0px 0px #000",
        dark: "3px 3px 0px 0px #000",
      },
      translate: {
        boxShadowX: "3px",
        boxShadowY: "3px",
        reverseBoxShadowX: "-3px",
        reverseBoxShadowY: "-3px",
      },
      fontWeight: {
        base: "500",
        heading: "700",
      },
    },
  },
  plugins: [tailwindAnimate],
  darkMode: "class",
};
export default config;
