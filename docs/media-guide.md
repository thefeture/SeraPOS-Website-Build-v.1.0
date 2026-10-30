# Replaceable product media

`media.js` owns the dashboard, POS and inventory visual sources. Put replacements in `assets/product/`, then update the corresponding `src`, `alt`, `width`, `height`, `objectFit`, and `objectPosition` in that one file. Every placement consumes the same key.

The authored concept interfaces in `product-preview.js` are the fallback if a replacement fails to load. `/preview.html?view=dashboard`, `/preview.html?view=pos`, and `/preview.html?view=inventory` render the synthetic 1200 × 720 source views for capturing future screenshot assets. The source views are illustrative; they do not create invoices or make payments.

Use approved screenshots stripped of private identities and real records. Preserve aspect ratio and choose `contain` when the whole screen must be visible. There is no visual asset editor/CMS in this phase.

Replace the SVG logo only with approved artwork. Icon files come from Lucide and retain its license. Inter is bundled locally; do not replace it with another font.
