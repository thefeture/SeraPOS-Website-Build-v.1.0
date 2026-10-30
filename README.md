# Global SeraPOS website

Original six-section Home, Services, Pricing, About and Contact pages. Inter, the official SeraPOS wordmark, approved cropped product designs and a WebGL tile hero.

## Develop

```sh
npm ci
npm run build
npm run check
npm run dev
```

The local server serves the built `dist/` folder. Rebuild after editing sources.

## Edit

- `scripts/generate.mjs`: shared header/footer and page content.
- `style.css`: base responsive layout and typography.
- `motion.css`: centered glass header, scroll stage, patterns, dark section and interaction styles.
- `motion.js`: native-scroll chapter transitions, reveals and interruptible FAQ animation.
- `scripts/story-template.mjs`: shared Home/Services story content and accessible markup.
- `app.js`: menus, motion setup, image viewer and local inquiry preparation.
- `hero-scene.js`: Three.js animation with pause/reduced-motion/fallback behavior.
- `media.js`: centrally replaceable product images.
- `site-config.js`: package proposals and reserved public contact/app configuration.

`npm run build` generates HTML and copies only public assets, with Three.js bundled locally. Vercel serves `dist/`. No analytics, database, payment processor or contact delivery is configured. Contact inquiries are generated locally and downloaded only on request. Public contact details are pending.

Preview pages remain noindex. The higher pricing tiers and package allocations are explicitly proposed. Do not remove those labels until commercial terms are approved.

## Motion behavior

On screens at least 1000px wide and 680px high, Home and Services pin a four-chapter product stage while native scrolling controls the scene. Every chapter includes a reading hold. Scroll in either direction, click a chapter, or use arrow/Home/End keys. Smaller screens and reduced-motion mode use the same accessible tabs without scroll pinning.

The WebGL hero uses approved UI crops with restrained depth, damped pointer movement and scroll response. Pause motion stops the hero animation; the system reduced-motion preference also disables the pinned story and decorative reveals. The page remains usable if WebGL is unavailable.

FAQ panels use measured height animations with cancellation on repeated clicks. Product media can still be enlarged. SVG background patterns are decorative and can be replaced separately from product media.
