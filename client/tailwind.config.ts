import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
export default {
  // darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#e56e1e",
        secondary: "#434343",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
