import type { Config } from "tailwindcss";

const config = {
  darkMode: "class",
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        vault: {
          primary: {
            DEFAULT: "#2D6A4F",
            light: "#40916C",
            dark: "#52B788",
          },
          accent: {
            DEFAULT: "#B5179E",
            light: "#CC44BB",
            dark: "#F72585",
          },
          bg: {
            DEFAULT: "#F0F4F0",
            surface: "#FFFFFF",
            dark: "#0D1B2A",
            "dark-surface": "#112233",
          },
          text: {
            primary: "#1A1A2E",
            secondary: "#4A5568",
            "dark-primary": "#E8F4F0",
            "dark-secondary": "#94A3B8",
          },
          border: {
            DEFAULT: "#CBD5CD",
            dark: "#1E3A4A",
          },
          success: { DEFAULT: "#38A169", dark: "#68D391" },
          warning: { DEFAULT: "#D97706", dark: "#FBD38D" },
          danger:  { DEFAULT: "#C53030", dark: "#FC8181" },
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "DM Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
