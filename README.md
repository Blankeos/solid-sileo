# Sileo Monorepo

This repository now contains:

- `packages/sileo`: the `solid-sileo` SolidJS toast library package.
- `apps/site`: a Vike + Vike Solid app for local testing.

## Quick Start

```bash
bun install
bun run dev:site
```

## Workspace Scripts

```bash
bun run build
bun run build:site
bun run check
bun run lint
```

## Publishing

This repo uses Changesets.

```bash
bun run changeset
bun run version-packages
bun run release
```
