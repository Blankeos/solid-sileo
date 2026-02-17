# AGENTS

Guidance for coding agents working in this monorepo.

## 1) Repository map

- `packages/sileo/`: publishable SolidJS toast library (`solid-sileo`).
- `apps/site/`: Vike + Solid playground used to validate library behavior and presentation.
- `devreference1/`: upstream React reference implementation (read-only).
- `devreference2/`: separate reference project for how to use solid vike and a bunch of existing components (read-only)

## 2) Source of truth

- Library logic lives in `packages/sileo/src`.
- The site imports package source directly (`packages/sileo/src/index`) for local development, so package changes can affect site behavior immediately.
- Keep API compatibility for `sileo` and `Toaster` unless a task explicitly calls for a breaking change.

## 3) Tooling and commands

- Use `bun` for dependency management and scripts.
- Common root commands:
  - `bun run dev:site`
  - `bun run build`
  - `bun run build:site`
  - `bun run lint`
  - `bun run check`
- Workspace-targeted commands:
  - `bun run --filter solid-sileo build|lint|check`
  - `bun run --filter site build|lint|check`

## 4) Coding conventions

- TypeScript-first, keep strict typing.
- Follow existing style per workspace instead of forcing one style everywhere:
  - `packages/sileo`: tab-indented, semicolon style in existing files.
  - `apps/site`: 2-space indentation, semicolons as needed, Tailwind classes sorted via Biome. Only reference `packages/sileo` via relative imports for Cloudflare compatibility (it hates `workspace:*`) and npm publish compatibility (it hates a relative `"sileo-solid": "../../some-relative-path"` convention in package.json).
- Prefer existing project patterns over introducing new abstractions.
- Keep imports tree-shake-friendly (prefer targeted/subpath imports when available).

## 5) Behavior and UX expectations

- Maintain close behavioral parity with upstream toast interactions when working on core toast UX.
- Favor update-in-place behavior for toast refreshes (avoid accidental remounts when state should morph).
- Keep site demo content and button behavior consistent across homepage and playground.
- Preserve theme parity between site shell and toast styling when adjusting visual defaults.

## 6) Validation checklist before handoff

- Run lint + build for each changed workspace.
- Run type checks when practical; if failures are unrelated pre-existing issues, report them clearly instead of making unrelated fixes.
- Do not modify generated/build output unless the task explicitly requires it.

## 7) Scope guardrails

- Keep changes focused on requested scope.
- Do not refactor unrelated areas opportunistically.
- Do not edit `devreference1/` or `devreference2/`, no usecase to ever do that.

## 8) React -> Solid porting reference

- For React-to-Solid porting tasks, use this reference index first:
  - `https://raw.githubusercontent.com/Blankeos/react-to-solid-llms/refs/heads/main/llms.txt`
- Treat it as supplemental guidance; repo-specific behavior and conventions in this file still take priority.
- When `llms.txt` links to repository-relative docs, resolve them via the same raw base:
  - `https://raw.githubusercontent.com/Blankeos/react-to-solid-llms/refs/heads/main/<path>.md`
  - Example: `https://raw.githubusercontent.com/Blankeos/react-to-solid-llms/refs/heads/main/concepts/state-vs-signals.md`
