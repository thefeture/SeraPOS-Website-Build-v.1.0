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
- `style.css`: responsive layout and typography.
- `app.js`: menus, accessible tabs, image viewer and local inquiry preparation.
- `hero-scene.js`: Three.js animation with pause/reduced-motion/fallback behavior.
- `media.js`: centrally replaceable product images.
- `site-config.js`: package proposals and reserved public contact/app configuration.

`npm run build` generates HTML and copies only public assets, with Three.js bundled locally. Vercel serves `dist/`. No analytics, database, payment processor or contact delivery is configured. Contact inquiries are generated locally and downloaded only on request. Public contact details are pending.

Preview pages remain noindex. The higher pricing tiers and package allocations are explicitly proposed. Do not remove those labels until commercial terms are approved.
