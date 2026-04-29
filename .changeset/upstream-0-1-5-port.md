---
"solid-sileo": minor
---

Port upstream sileo v0.1.4 and v0.1.5 features:

- Add `theme` prop to `<Toaster>` (`"light" | "dark" | "system"`) that auto-sets toast fill and description color, with `prefers-color-scheme` listener for `"system"`.
- Allow `sileo.show({ type })` to render stateful toasts (success/error/warning/info/action/loading) without a separate method call. State-specific methods continue to take precedence.
- Scope `prefers-reduced-motion: reduce` CSS to `[data-sileo-viewport]` only, so it no longer disables animations across the host app.
- Sync `fill` updates into the active view immediately, so dynamic fill changes apply without waiting for a refresh swap.
- Allow full `SileoOptions` (not just `title`/`icon`) on `sileo.promise({ loading })`.
- Tighten the duration-`null` (sticky toast) check so `null` is preserved through `??` fallback.
- `DEFAULT_ROUNDNESS` 18 → 16 to match upstream.
