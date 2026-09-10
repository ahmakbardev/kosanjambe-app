import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Kept identical to web/ so the app and the landing page read as one brand.
        background: "var(--background)",
        foreground: "var(--foreground)",
        accent: {
          DEFAULT: "#e4ee64",
          hover: "#d8e455",
        },
        ink: "#141414",
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
      spacing: {
        // Home-indicator / notch insets, for a UI that runs full-bleed on a phone.
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
      },
    },
  },
  plugins: [],
};

export default config;
