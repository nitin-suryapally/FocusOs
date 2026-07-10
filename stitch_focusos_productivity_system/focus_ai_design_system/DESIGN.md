---
name: Focus AI Design System
colors:
  surface: '#fcf8ff'
  surface-dim: '#dbd8e4'
  surface-bright: '#fcf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f2fe'
  surface-container: '#efecf8'
  surface-container-high: '#e9e6f3'
  surface-container-highest: '#e4e1ed'
  on-surface: '#1b1b23'
  on-surface-variant: '#464554'
  inverse-surface: '#303038'
  inverse-on-surface: '#f2effb'
  outline: '#767586'
  outline-variant: '#c7c4d7'
  surface-tint: '#494bd6'
  primary: '#4648d4'
  on-primary: '#ffffff'
  primary-container: '#6063ee'
  on-primary-container: '#fffbff'
  inverse-primary: '#c0c1ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#904900'
  on-tertiary: '#ffffff'
  tertiary-container: '#b55d00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#ffdcc5'
  tertiary-fixed-dim: '#ffb783'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#703700'
  background: '#fcf8ff'
  on-background: '#1b1b23'
  surface-variant: '#e4e1ed'
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style

The design system is rooted in the philosophy of "Quiet Intelligence." It prioritizes cognitive ease over visual flair, ensuring that the AI capabilities feel like a seamless extension of the user's workflow rather than a disruptive spectacle. The target audience consists of professionals, researchers, and power users who require a high-signal, low-noise environment to perform deep work.

The aesthetic follows a **Modern Minimalist** approach. It leverages heavy whitespace, a disciplined color palette, and precise typography to create an atmosphere of calm authority. By stripping away non-essential decorations—avoiding common AI tropes like iridescent gradients or heavy glows—the design system fosters a sense of reliability and clarity. The emotional response is intended to be one of "composed productivity."

## Colors

The palette is strictly functional, designed to guide the eye toward action and content without causing visual fatigue.

- **Primary (#6366F1):** A vibrant Indigo used exclusively for primary actions, active states, and critical indicators. It provides a sharp, professional contrast against the neutral base.
- **Secondary (#0F172A):** A Deep Slate/Teal used for high-level information architecture, such as sidebars or primary headings, grounding the interface with a sense of stability.
- **Neutral Base (#F8FAFC):** The foundational background color. It is a cool, soft grey that reduces screen glare compared to pure white.
- **Surfaces (#FFFFFF):** High-level containers, cards, and input fields utilize pure white to create a clear "layered" distinction against the neutral base.
- **Success/Error/Warning:** Use muted versions of green, red, and amber to maintain the calm aesthetic, ensuring they only command attention when necessary.

## Typography

This design system utilizes **Inter** across all roles to maintain a systematic, utilitarian feel. The type scale is optimized for readability and hierarchical clarity.

For large displays and headlines, a slight negative letter-spacing is applied to create a more "locked-in" and professional appearance. Body text remains at default tracking to ensure maximum legibility during long reading sessions. Uppercase styling is reserved strictly for small labels and category tags to differentiate them from interactive text elements.

## Layout & Spacing

The layout philosophy is based on a **Fluid-Fixed Hybrid**. Content containers use a maximum width of 1280px for desktop viewing to prevent line lengths from becoming unreadable, while the sidebar and navigation remain fixed. 

The spacing rhythm follows an **8px linear scale**, ensuring mathematical harmony across all components. 
- **Desktop:** 12-column grid with 24px gutters.
- **Tablet:** 8-column grid with 20px gutters.
- **Mobile:** 4-column grid with 16px gutters and 16px side margins.

Generous padding (24px - 40px) is preferred within containers to maintain the "calm" aesthetic, giving the data-rich AI outputs room to breathe.

## Elevation & Depth

Hierarchy is established through **Tonal Layering** and **Ambient Shadows**. Instead of heavy borders, the design system uses depth to indicate interactivity and separation.

- **Level 0 (Base):** The #F8FAFC background.
- **Level 1 (Surface):** White cards (#FFFFFF) with a very soft, diffused shadow (0px 4px 20px rgba(15, 23, 42, 0.05)).
- **Level 2 (Interactive/Hover):** Raised state with a slightly more pronounced shadow (0px 10px 30px rgba(15, 23, 42, 0.08)).
- **Overlays:** Modals and menus use a backdrop blur (8px) on a semi-transparent white wash to maintain context of the background while focusing the user.

## Shapes

The shape language is consistently "Soft-Modern." Using a base roundedness of **12px (0.75rem)** for primary containers and buttons, the UI feels approachable yet structured.

- **Standard Elements (Buttons, Inputs, Small Cards):** 12px corner radius.
- **Large Containers (Sections, Main Feed):** 16px corner radius.
- **Tags/Chips:** Fully rounded (pill-shaped) to distinguish them from actionable buttons.

## Components

- **Buttons:** Primary buttons use a solid Indigo (#6366F1) background with white text. Secondary buttons use a subtle Slate (#0F172A) ghost style with a 1px border. All buttons have a height of 40px or 48px to remain "touch-friendly."
- **Input Fields:** White backgrounds with a subtle 1px border (#E2E8F0). On focus, the border transitions to Indigo with a soft 2px outer glow.
- **Cards:** Pure white surfaces, 12px rounded corners, and the Level 1 Ambient Shadow. Headers within cards should have a subtle bottom divider.
- **Chips:** Small, pill-shaped elements with a light grey background (#F1F5F9) and Slate text for metadata or categories.
- **Lists:** Use 16px vertical padding between items with a light divider (#F1F5F9). No icons unless they provide direct functional utility.
- **AI Feedback:** Use a subtle, light-blue tinted container for AI-generated responses to distinguish them from user-inputted content without using flashy effects.