<div align="center">
  <h1>Sileo</h1>
  <p>An opinionated, physics-based toast component for Solid.</p>
  <p><a href="https://solid-sileo.pages.dev">Try Out</a> &nbsp; / &nbsp; <a href="https://solid-sileo.pages.dev/docs">Docs</a></p>
  <video src="https://github.com/user-attachments/assets/a292d310-9189-490a-9f9d-d0a1d09defce"></video>
</div>

### Installation

```bash
npm i solid-sileo
```

### Getting Started

```tsx
import { sileo, Toaster } from "solid-sileo";

export default function App() {
  return (
    <>
      <Toaster position="top-right" />
      <YourApp />
    </>
  );
}
```

For detailed docs, click here: https://solid-sileo.pages.dev

---

## Sileo Monorepo

This repository contains:

- `packages/sileo`: the `solid-sileo` SolidJS toast library package.
- `apps/site`: a Vike + Vike Solid app for local testing.

### Quick Start

```bash
bun install
bun run dev:site
```

### Workspace Scripts

```bash
bun run build
bun run build:site
bun run check
bun run lint
```

### Publishing

This repo uses Changesets.

```bash
bun run changeset
bun run version-packages
bun run release
```
