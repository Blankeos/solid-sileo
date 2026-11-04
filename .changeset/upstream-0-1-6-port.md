---
"solid-sileo": patch
---

Port upstream sileo v0.1.6 fixes:

- Gooey filter is now applied to an SVG `<g>` with an explicit `userSpaceOnUse` region (blur margin around the toast) instead of a CSS `filter` on the canvas div. Avoids clipping/oversized filter regions and is cheaper to rasterize.
- `<Toaster>` re-reads the store when it subscribes, so toasts cleared between render and mount (e.g. on route change) no longer linger.
- SVG title lowercased to "sileo notification".
