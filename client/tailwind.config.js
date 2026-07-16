/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#111522",
        "surface-dim": "#090c15",
        "surface-bright": "#1b2234",
        "surface-container-lowest": "#131826",
        "surface-container-low": "#191f2f",
        "surface-container": "#1f2638",
        "surface-container-high": "#293146",
        "surface-container-highest": "#333c53",
        "on-surface": "#f3f6ff",
        "on-surface-variant": "#a4aec6",
        "inverse-surface": "#edf2ff",
        "inverse-on-surface": "#151b2d",
        outline: "#5d6782",
        "outline-variant": "#313a52",
        "surface-tint": "#8ea2ff",
        primary: "#8ea2ff",
        "on-primary": "#101833",
        "primary-container": "#25346d",
        "on-primary-container": "#e1e7ff",
        "inverse-primary": "#4b64d4",
        secondary: "#9ed0ff",
        "on-secondary": "#0d1d36",
        "secondary-container": "#173454",
        "on-secondary-container": "#d6e9ff",
        tertiary: "#ffb27a",
        "on-tertiary": "#371300",
        "tertiary-container": "#5b2c0d",
        "on-tertiary-container": "#ffd9c0",
        error: "#ffb4ab",
        "on-error": "#690005",
        "error-container": "#601411",
        "on-error-container": "#ffdad5",
        success: "#7ee2b8",
        "on-success": "#0a2118",
        "success-container": "#12382b",
        "on-success-container": "#bcf8dc",
        background: "#070a12",
        "on-background": "#f3f6ff"
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
        card: "0px 18px 40px rgba(4, 8, 20, 0.28)",
        elevated: "0px 28px 60px rgba(2, 6, 18, 0.42)"
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
