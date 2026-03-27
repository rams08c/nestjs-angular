# Quickstart: Landing Page

## Preconditions
- Workspace dependencies installed in `client/`
- Tailwind CSS and DaisyUI available in client dependencies

## Implementation Steps
- Add or verify landing page route as the default public route in `client/src/app/app.routes.ts`.
- Implement navbar section with:
  - app name/logo left
  - `Login` and `Register` links right
- Implement hero section with:
  - title
  - subtitle
  - `Get Started` and `Login` CTA buttons
- Implement features section with four cards:
  - expense tracking
  - categories
  - reports
  - group splitting
- Implement dashboard preview section using finance-style card layout and chart placeholders.
- Implement footer section for page closure and product identity.
- Ensure all route links target only `/login` and `/register`.
- Keep implementation UI-only with no API calls.

## Verification Checklist
- Landing page is reachable publicly without authentication.
- Navbar displays branding and both auth links.
- Hero section renders both CTA actions.
- All four required feature cards are visible.
- Dashboard preview shows card and chart-like mock blocks.
- Footer is present and responsive.
- `/login` and `/register` routes are navigable from the landing page.
- Layout remains usable on mobile, tablet, and desktop widths.
