/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#fcf8ff",
        "surface-dim": "#dbd8e4",
        "surface-bright": "#fcf8ff",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f5f2fe",
        "surface-container": "#efecf8",
        "surface-container-high": "#e9e6f3",
        "surface-container-highest": "#e4e1ed",
        "on-surface": "#1b1b23",
        "on-surface-variant": "#464554",
        "inverse-surface": "#303038",
        "inverse-on-surface": "#f2effb",
        outline: "#767586",
        "outline-variant": "#c7c4d7",
        "surface-tint": "#494bd6",
        primary: "#4648d4",
        "on-primary": "#ffffff",
        "primary-container": "#6063ee",
        "on-primary-container": "#fffbff",
        "inverse-primary": "#c0c1ff",
        secondary: "#565e74",
        "on-secondary": "#ffffff",
        "secondary-container": "#dae2fd",
        "on-secondary-container": "#5c647a",
        tertiary: "#904900",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#b55d00",
        "on-tertiary-container": "#fffbff",
        error: "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",
        background: "#fcf8ff",
        "on-background": "#1b1b23"
      },
      spacing: {
        xs: "4px",
        sm: "12px",
        md: "24px",
        lg: "40px",
        xl: "64px",
        gutter: "24px",
        "margin-mobile": "16px",
        "margin-desktop": "48px"
      },
      borderRadius: {
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem"
      },
      boxShadow: {
        card: "0px 4px 20px rgba(15, 23, 42, 0.05)",
        elevated: "0px 10px 30px rgba(15, 23, 42, 0.08)"
      },
      fontSize: {
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-lg-mobile": ["24px", { lineHeight: "32px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "body-sm": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "label-md": ["14px", { lineHeight: "20px", letterSpacing: "0.01em", fontWeight: "500" }],
        "label-sm": ["12px", { lineHeight: "16px", fontWeight: "600" }]
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"]
      }
    }
  },
  plugins: []
};
