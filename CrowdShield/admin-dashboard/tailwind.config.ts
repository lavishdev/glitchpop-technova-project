import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "surface-variant": "#e0e3e5",
        "on-primary-container": "#eeefff",
        "surface-tint": "#0053db",
        "tertiary-fixed": "#dce2f3",
        "surface-container-low": "#f2f4f6",
        "on-secondary": "#ffffff",
        "tertiary": "#4e5562",
        "on-background": "#191c1e",
        "on-surface-variant": "#434655",
        "on-secondary-container": "#5c6274",
        "outline-variant": "#c3c6d7",
        "inverse-surface": "#2d3133",
        "surface": "#f7f9fb",
        "secondary-fixed-dim": "#c0c6db",
        "on-surface": "#191c1e",
        "on-primary-fixed": "#00174b",
        "primary-fixed": "#dbe1ff",
        "primary": "#004ac6",
        "on-tertiary": "#ffffff",
        "surface-dim": "#d8dadc",
        "on-error": "#ffffff",
        "inverse-on-surface": "#eff1f3",
        "surface-container-high": "#e6e8ea",
        "on-tertiary-fixed": "#151c27",
        "on-secondary-fixed-variant": "#404758",
        "background": "#f7f9fb",
        "secondary-fixed": "#dce2f7",
        "primary-fixed-dim": "#b4c5ff",
        "secondary-container": "#d9dff5",
        "surface-container-lowest": "#ffffff",
        "outline": "#737686",
        "error": "#ba1a1a",
        "on-primary": "#ffffff",
        "on-tertiary-container": "#eaf0ff",
        "on-primary-fixed-variant": "#003ea8",
        "surface-bright": "#f7f9fb",
        "surface-container": "#eceef0",
        "tertiary-container": "#666d7b",
        "inverse-primary": "#b4c5ff",
        "on-tertiary-fixed-variant": "#404754",
        "primary-container": "#2563eb",
        "on-secondary-fixed": "#141b2b",
        "tertiary-fixed-dim": "#c0c7d6",
        "secondary": "#575e70",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",
        "surface-container-highest": "#e0e3e5"
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px"
      },
      spacing: {
        "container-margin": "24px",
        "gutter": "16px",
        "stack-sm": "8px",
        "stack-md": "16px",
        "base": "4px",
        "stack-lg": "24px"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["jetbrainsMono", "monospace"],
      }
    },
  },
  plugins: [],
};

export default config;
