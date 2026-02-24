/**
 * ============================================================================
 * SITE CONFIGURATION
 * ============================================================================
 *
 * Customize your landing page by editing the values below.
 * All text, links, and settings are centralized here for easy editing.
 */

export const siteConfig = {
  name: "Base India Circle",
  tagline: "India to the World. Building on Base.",
  description:
    "The ultimate directory of products and projects building on Base from India. Discover ecosystem projects, connect with founders, and submit your own.",
  url: "https://baseindiacircle.xyz",
  twitter: "@BaseIndiaCircle",

  nav: {
    cta: {
      text: "Submit Project",
      href: "/submit",
    },
    signIn: {
      text: "Directory",
      href: "/directory",
    },
  },
} as const;

/**
 * ============================================================================
 * FEATURE FLAGS
 * ============================================================================
 *
 * Toggle features on/off without touching component code.
 */
export const features = {
  smoothScroll: true,
  darkMode: true,
} as const;

/**
 * ============================================================================
 * THEME CONFIGURATION
 * ============================================================================
 *
 * Colors are defined in globals.css using CSS custom properties.
 * This config controls which theme features are enabled.
 */
export const themeConfig = {
  defaultTheme: "dark" as const,
  enableSystem: true,
} as const;
