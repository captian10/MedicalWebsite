import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        /* ✅ Medical Blue (still available if needed) */
        medical: {
                  50: "#fff5f5",
          100: "#ffe3e3",
          200: "#ffc9c9",
          300: "#ffa8a8",
          400: "#ff8787",
          500: "#fa5252",
          600: "#e03131",
          700: "#c92a2a",
          800: "#a51111",
          900: "#8a0c0c",
          950: "#4a0404",
        },

        /* ✅ Soft Teal Accent */
        teal: {
          50: "#fff5f5",
          100: "#ffe3e3",
          200: "#ffc9c9",
          300: "#ffa8a8",
          400: "#ff8787",
          500: "#fa5252",
          600: "#e03131",
          700: "#c92a2a",
          800: "#a51111",
          900: "#8a0c0c",
          950: "#4a0404",
        },


        /* ✅ Professional Red (Main Theme) */
        redPro: {
          50: "#fff5f5",
          100: "#ffe3e3",
          200: "#ffc9c9",
          300: "#ffa8a8",
          400: "#ff8787",
          500: "#fa5252",
          600: "#e03131",
          700: "#c92a2a",
          800: "#a51111",
          900: "#8a0c0c",
          950: "#4a0404",
        },
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },

      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 2s infinite",
        fadeIn: "fadeIn 0.5s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;



  //  medical: {
  //         50: "#f6f9ff",
  //         100: "#edf3ff",
  //         200: "#d6e5ff",
  //         300: "#b5ceff",
  //         400: "#8aadff",
  //         500: "#5b86ff",
  //         600: "#3d66f5",
  //         700: "#2f4fe0",
  //         800: "#2a41b6",
  //         900: "#273b8f",
  //         950: "#172554",
  //       },

  //       /* ✅ Soft Teal Accent */
  //       teal: {
  //         50: "#f1fbfb",
  //         100: "#daf6f3",
  //         200: "#b3ece7",
  //         300: "#7eddd7",
  //         400: "#42c6c1",
  //         500: "#1aa8a3",
  //         600: "#138884",
  //         700: "#126c69",
  //         800: "#125757",
  //         900: "#114848",
  //         950: "#062a2b",