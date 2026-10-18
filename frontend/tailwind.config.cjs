/** Stitch design tokens; adapted for Tailwind 3. */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,ts}', './src/assets/stitch/**/*.html'],
  theme: { extend: {
  "colors": {
    "outline-variant": "#c5c6d1",
    "error-container": "#ffdad6",
    "surface-container-low": "#f6f3f2",
    "dark-bg-primary": "#0B1220",
    "on-secondary": "#ffffff",
    "surface-container-high": "#eae8e7",
    "secondary-fixed-dim": "#acc7ff",
    "inverse-surface": "#303030",
    "secondary-container": "#659dfe",
    "accent-dark": "#8A4B00",
    "on-tertiary": "#ffffff",
    "primary-fixed": "#dae2ff",
    "surface-bright": "#fbf9f8",
    "on-secondary-fixed-variant": "#004491",
    "status-error": "#B42318",
    "status-success-bg": "#E9F7EF",
    "text-body": "#4A4A4A",
    "border-subtle": "#E5E7EB",
    "on-tertiary-fixed-variant": "#743400",
    "outline": "#757681",
    "surface-container-lowest": "#ffffff",
    "surface-hover": "#F1F5F9",
    "background": "#fbf9f8",
    "surface-dim": "#dcd9d9",
    "focus-halo": "#DCEAFE",
    "secondary-hover": "#00438C",
    "dark-surface": "#1A2941",
    "on-error-container": "#93000a",
    "on-background": "#1b1c1c",
    "on-tertiary-container": "#df6a00",
    "status-error-bg": "#FDEDEC",
    "surface-container": "#f0eded",
    "on-tertiary-fixed": "#321300",
    "error": "#ba1a1a",
    "dark-interactive": "#79B8FF",
    "primary-container": "#00205b",
    "on-primary-fixed": "#001849",
    "inverse-on-surface": "#f3f0f0",
    "primary-fixed-dim": "#b2c5ff",
    "primary-hover": "#003B80",
    "dark-text-primary": "#F8FAFC",
    "surface-tint": "#455c99",
    "on-primary-fixed-variant": "#2d447f",
    "dark-border": "#34445C",
    "text-secondary": "#64748B",
    "surface-container-highest": "#e4e2e1",
    "dark-bg-secondary": "#111C30",
    "secondary-fixed": "#d7e2ff",
    "dark-text-secondary": "#CBD5E1",
    "status-warning": "#8A4B00",
    "on-secondary-container": "#003370",
    "on-error": "#ffffff",
    "background-secondary": "#F8F9FA",
    "surface-muted": "#F3F6FA",
    "status-warning-bg": "#FFF4E5",
    "secondary-soft": "#E8F0FE",
    "tertiary": "#1f0900",
    "inverse-primary": "#b2c5ff",
    "border-interactive": "#7C8DA3",
    "on-surface-variant": "#444650",
    "tertiary-container": "#401a00",
    "text-disabled": "#94A3B8",
    "primary": "#000d2f",
    "tertiary-fixed": "#ffdbc8",
    "border-default": "#D1D5DB",
    "primary-active": "#001845",
    "on-secondary-fixed": "#001a40",
    "secondary": "#115cb9",
    "on-surface": "#1b1c1c",
    "on-primary": "#ffffff",
    "surface": "#fbf9f8",
    "surface-variant": "#e4e2e1",
    "on-primary-container": "#738aca",
    "tertiary-fixed-dim": "#ffb68b",
    "status-success": "#117548"
  },
  "borderRadius": {
    "DEFAULT": "0.125rem",
    "lg": "0.25rem",
    "xl": "0.5rem",
    "full": "0.75rem"
  },
  "spacing": {
    "gutter": "1.5rem",
    "margin": "2rem",
    "space-xl": "2rem",
    "gutter-mobile": "1rem",
    "margin-mobile": "1rem",
    "space-lg": "1.5rem",
    "space-md": "1rem",
    "space-xs": "0.25rem",
    "space-sm": "0.5rem"
  },
  "fontFamily": {
    "body-md": [
      "Inter"
    ],
    "headline-md": [
      "Outfit"
    ],
    "badge": [
      "Inter"
    ],
    "body-lg": [
      "Inter"
    ],
    "caption": [
      "Inter"
    ],
    "headline-xl": [
      "Outfit"
    ],
    "headline-lg": [
      "Outfit"
    ],
    "label-sm": [
      "Inter"
    ],
    "label-md": [
      "Inter"
    ],
    "body-sm": [
      "Inter"
    ],
    "headline-xl-mobile": [
      "Outfit"
    ],
    "headline-sm": [
      "Outfit"
    ],
    "kpi-metric": [
      "Outfit"
    ]
  },
  "fontSize": {
    "body-md": [
      "14px",
      {
        "lineHeight": "22px",
        "fontWeight": "400"
      }
    ],
    "headline-md": [
      "20px",
      {
        "lineHeight": "28px",
        "fontWeight": "600"
      }
    ],
    "badge": [
      "12px",
      {
        "lineHeight": "16px",
        "fontWeight": "600"
      }
    ],
    "body-lg": [
      "16px",
      {
        "lineHeight": "26px",
        "fontWeight": "400"
      }
    ],
    "caption": [
      "12px",
      {
        "lineHeight": "18px",
        "fontWeight": "500"
      }
    ],
    "headline-xl": [
      "30px",
      {
        "lineHeight": "38px",
        "fontWeight": "700"
      }
    ],
    "headline-lg": [
      "24px",
      {
        "lineHeight": "32px",
        "fontWeight": "600"
      }
    ],
    "label-sm": [
      "13px",
      {
        "lineHeight": "18px",
        "fontWeight": "600"
      }
    ],
    "label-md": [
      "14px",
      {
        "lineHeight": "20px",
        "fontWeight": "600"
      }
    ],
    "body-sm": [
      "13px",
      {
        "lineHeight": "20px",
        "fontWeight": "400"
      }
    ],
    "headline-xl-mobile": [
      "24px",
      {
        "lineHeight": "32px",
        "fontWeight": "700"
      }
    ],
    "headline-sm": [
      "16px",
      {
        "lineHeight": "24px",
        "fontWeight": "600"
      }
    ],
    "kpi-metric": [
      "28px",
      {
        "lineHeight": "34px",
        "fontWeight": "700"
      }
    ]
  }
} },
  plugins: [],
};