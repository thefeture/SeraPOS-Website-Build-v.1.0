# Product media

All current public visuals come from user-approved SeraPOS interface design crops.

- Change `media.js` to replace a visual across the WebGL hero, content panels and image viewer.
- Keep each entry's dimensions and meaningful alt text accurate.
- Original source screenshots are not committed. `asset-crops.json` records the exact crop rectangles.
- Dashboard: remove the whole top navigation and private staff portrait.
- Invoice/customer designs: use only panels without contact information or unrelated store identity.
- Do not use the full invoice, profile or transaction source image publicly.
- Existing `product-preview.*` and `assets/product` are legacy synthetic concepts. They are not part of the new build output.

The hero uses the same WebP images as the content, transformed by a locally bundled Three.js renderer. If WebGL fails, the image-based layout remains visible. Motion pauses when the hero is off screen or the tab is hidden; the user can pause motion, and reduced-motion preferences are respected.
