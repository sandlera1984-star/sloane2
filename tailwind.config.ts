import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"] ,
  theme: {
    extend: {
      colors: {
        blush: "#f8d7e8",
        rose: "#f4b3d2",
        orchid: "#d7a2f6",
        plum: "#8b5cf6",
        cream: "#fff7f2",
        night: "#1f1230",
      },
      boxShadow: {
        glow: "0 15px 40px rgba(236, 72, 153, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
