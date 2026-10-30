# SeraPOS Website

Original Global SeraPOS marketing website. This first phase covers navigation, hero, an opening scroll story, responsive states, and replaceable product media. It uses Inter and the official supplied logo.

## Run and check

Requires Node.js 20 or newer. No runtime dependencies.

```sh
npm run check
npm run dev -- --host 0.0.0.0 --port 4173
npm run build
```

Vercel serves `dist/`. The review site is deliberately marked noindex. Remove review indexing restrictions only when public launch is approved.

## Replace product images

See `media.js` and `docs/media-guide.md`. The initial views use synthetic data. They are product illustrations, not a functioning merchant account. No payment is collected and no business records are written.

## Phase boundaries

Full pricing cards, demo/contact delivery, signup/login, CMS, legal policies, and real product integrations are not part of this first phase. The approved starting price is US$10/month. No trial, certification, customer count, or live gateway claim is made.

Icons: Lucide, ISC license included in `assets/icons/LICENSE.txt`. Font: Inter by Rasmus Andersson, SIL Open Font License.
