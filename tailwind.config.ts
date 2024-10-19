import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: "#FF7A00",
        gray: "#838383",
      },
      backgroundImage: {
        "text-orange-gradient":
          "linear-gradient(89.56deg, #FF5C00 -6.61%, #FFFFFF 99.62%)",
        "gray-gradient": "linear-gradient(180deg, #393939 0%, #262626 100%)",
        "text-gray-gradient":
          "linear-gradient(256.2deg, #FFFFFF 40.14%, #999999 71.76%)",
        homePagePic: "url('/assets/homePage.png')",
        missionPagePic: "url('/assets/missionPage.png')",
      },
      fontFamily: {
        chakra: ['"Chakra Petch"', "sans-serif"],
        poppins: ['"Poppins"', "sans-serif"],
      },
      fontSize: {
        sm: [
          "14px",
          {
            lineHeight: "24px",
            // letterSpacing: "2.1px",
          },
        ],
        title: [
          "64px",
          {
            lineHeight: "80px",
          },
        ],
        subtitle: [
          "40px",
          {
            lineHeight: "60px",
          },
        ],
        content: [
          "32px",
          {
            lineHeight: "48px",
          },
        ],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
