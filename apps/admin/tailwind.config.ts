import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          saffron: "#FF9933",
          green: "#138808",
          navy: "#020810",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
