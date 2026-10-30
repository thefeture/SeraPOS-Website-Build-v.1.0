# SeraPOS website implementation contract

- This repository is the Global SeraPOS marketing website only.
- Latest approved scope: redesign Home with six sections and actual screenshot tiles; add Pricing, About, Services and Contact. This replaces the earlier three-section first-phase constraint.
- Use Inter, the exact official logo, blue and light neutrals. Rounded floating navigation and an original 3D hero are required.
- Imported screenshot crops are approved. Never publish original sources containing private contact details, staff portraits or unrelated store branding.
- All replaceable product image paths belong in media.js; crop provenance belongs in docs/asset-crops.json.
- Preserve native scrolling, keyboard navigation, mobile layouts and reduced-motion support.
- Three pricing packages start at US$10/month. US$30/US$50 higher tiers and allocations are a proposal and must stay labelled until finalised.
- The public contact destination will be supplied later. The form prepares a local inquiry file and must never claim delivery.
- Keep noindex until launch is approved. Do not invent release status, testimonials, support SLAs, integrations or company facts.
- Use the existing GitHub repository and Vercel project. Test actual output in the user's connected Chrome.

## Motion revision, 2026-10-31

- Home and Services use a four-chapter scroll-linked sticky story: Sell, Stock, Customers, Insights. Keep forward and reverse scroll transitions, tab clicks and keyboard navigation synchronized.
- Header stays centered within 1180px, with translucent white fill and background blur.
- Use faint wave/grid/contour patterns only on selected pale-blue backgrounds. Product overview stays plain. Keep the navy extensions section for contrast.
- Motion must remain restrained, reversible and readable. Use native scrolling; small screens and reduced-motion preferences get manual chapter tabs without a long pinned area.
- FAQ height animates in both directions and tolerates interrupted clicks. Buttons have visible hover feedback.
