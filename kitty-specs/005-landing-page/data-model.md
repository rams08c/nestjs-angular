# Data Model: Landing Page

## Entity: LandingSection
- Purpose: Defines each top-level section rendered in order on the landing page.
- Fields:
  - id: unique section key
  - title: display title
  - order: render sequence
  - visible: section visibility flag
- Relationships:
  - contains FeatureCard items when section type is features
  - contains DashboardPreviewCard items when section type is dashboard preview
- Note: Navbar and Footer are implemented as independent shared components (`app-navbar`, `app-footer`) rather than inline landing page sections.

## Entity: NavigationLink
- Purpose: Represents navbar and CTA navigation targets.
- Fields:
  - label: display text
  - route: target route path
  - placement: navbar or hero
  - emphasis: primary or secondary visual emphasis
- Validation:
  - route must be one of `/login` or `/register` for this feature scope

## Entity: FeatureCard
- Purpose: Displays a core capability summary.
- Fields:
  - key: capability identifier
  - heading: capability title
  - description: concise value statement
  - iconToken: visual icon reference
- Required set:
  - expense tracking
  - categories
  - reports
  - group splitting

## Entity: DashboardPreviewCard
- Purpose: Presents finance dashboard-like mock metrics and chart blocks.
- Fields:
  - cardType: summary or chart
  - label: card title
  - valueText: mock metric text for summary cards
  - visualVariant: placeholder style token
- Validation:
  - all values are mock/static and must not require API data

## Entity: FooterInfo
- Purpose: Provides closing context and product identity in footer.
- Fields:
  - brandText: product/app name
  - auxiliaryText: brief supporting text
  - links: optional public links list
