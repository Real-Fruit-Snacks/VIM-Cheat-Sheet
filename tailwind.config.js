/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Map theme variables to Tailwind color names
        background: {
          primary: 'var(--color-background-primary)',
          secondary: 'var(--color-background-secondary)',
          tertiary: 'var(--color-background-tertiary)',
          elevated: 'var(--color-background-elevated)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          subtle: 'var(--color-border-subtle)',
        },
        accent: {
          primary: {
            DEFAULT: 'var(--color-accent-primary)',
            hover: 'var(--color-accent-primary-hover)',
          },
          secondary: {
            DEFAULT: 'var(--color-accent-secondary)',
            hover: 'var(--color-accent-secondary-hover)',
          },
        },
        status: {
          success: 'var(--color-status-success)',
          error: 'var(--color-status-error)',
          warning: 'var(--color-status-warning)',
          info: 'var(--color-status-info)',
        },
        code: {
          background: 'var(--color-code-background)',
          text: 'var(--color-code-text)',
        },
        selection: 'var(--color-selection)',
      },
    },
  },
  plugins: [],
}