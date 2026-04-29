# solid-sileo

## 0.2.0

### Minor Changes

- [`c42b2eb`](https://github.com/Blankeos/solid-sileo/commit/c42b2eba8dd23c1924a64343bc501db2c2cd5057) Thanks [@Blankeos](https://github.com/Blankeos)! - Port upstream sileo v0.1.4 and v0.1.5 features:

  - Add `theme` prop to `<Toaster>` (`"light" | "dark" | "system"`) that auto-sets toast fill and description color, with `prefers-color-scheme` listener for `"system"`.
  - Allow `sileo.show({ type })` to render stateful toasts (success/error/warning/info/action/loading) without a separate method call. State-specific methods continue to take precedence.
  - Scope `prefers-reduced-motion: reduce` CSS to `[data-sileo-viewport]` only, so it no longer disables animations across the host app.
  - Sync `fill` updates into the active view immediately, so dynamic fill changes apply without waiting for a refresh swap.
  - Allow full `SileoOptions` (not just `title`/`icon`) on `sileo.promise({ loading })`.
  - Tighten the duration-`null` (sticky toast) check so `null` is preserved through `??` fallback.
  - `DEFAULT_ROUNDNESS` 18 → 16 to match upstream.

## 0.1.2

### Patch Changes

- [`2baa499`](https://github.com/Blankeos/solid-sileo/commit/2baa49996e69316d179bb8b945cf8c4f3d52bb74) Thanks [@Blankeos](https://github.com/Blankeos)! - fix: timing (less jittery animation, more consistent with upstream).

- [`1461daa`](https://github.com/Blankeos/solid-sileo/commit/1461daa21189432c87e9b4ce42e1cbd312f1e92a) Thanks [@Blankeos](https://github.com/Blankeos)! - fix: bug fixes for safari (behavior seems to now be more consistent with safari).

## 0.1.1

### Patch Changes

- [`286c05f`](https://github.com/Blankeos/solid-sileo/commit/286c05f96452fcc1fab1ddc4603e13092f020d87) Thanks [@Blankeos](https://github.com/Blankeos)! - feat: upgraded to motion (same as the react upstream).

## 0.1.0

### Minor Changes

- [`f16d110`](https://github.com/Blankeos/solid-sileo/commit/f16d11096cac7b9f2ab699b3b7dee148a77a3976) Thanks [@Blankeos](https://github.com/Blankeos)! - feat: Port Sileo from React to SolidJS, move the repo into a monorepo with a Vike Solid demo app, and migrate library bundling to tsdown.
