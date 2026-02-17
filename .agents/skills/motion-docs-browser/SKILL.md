---
name: motion-docs-browser
description: Browse Motion docs with agent-browser and extract accurate, source-linked answers.
license: Proprietary
---

Use this skill when you need to answer questions about Motion documentation (vanilla Motion and Motion for React) or verify API behavior from the official docs.

Primary docs entry points:
- https://motion.dev/docs/quick-start
- https://motion.dev/docs/react

Browser CLI reference:
- `agent-browser --help`

## Goal

Quickly navigate Motion docs pages, verify details directly from source, and return concise notes with exact page URLs.

## Workflow

1. Open Motion docs in a named session.
2. Capture a fresh snapshot for stable refs.
3. Navigate by link text (preferred) or direct URL.
4. Extract relevant API details (props/options/defaults/examples).
5. Return findings with URL(s) and any uncertainty called out.

## Command Pattern

Use a shared session so state persists across commands.
Run in headed mode so browser actions are visible:

```bash
agent-browser --session motion-docs --headed open https://motion.dev/docs/quick-start
agent-browser --session motion-docs --headed snapshot -i -c
```

Then navigate and extract:

```bash
agent-browser --session motion-docs --headed find role link click --name "Layout animation"
agent-browser --session motion-docs --headed wait 500
agent-browser --session motion-docs --headed get title
agent-browser --session motion-docs --headed get url
agent-browser --session motion-docs --headed snapshot -i -c
```

## Tactics

- Prefer `find role link click --name "..."` for docs nav and in-page links.
- Re-run `snapshot -i -c` after navigation before new interactions.
- Capture both `get title` and `get url` before recording facts.
- Use `get text <selector-or-ref>` for exact wording of API docs.
- If a section is hard to locate via UI, jump directly with known URLs.

## Quality Bar

- Never infer Motion behavior without checking docs first.
- Cite exact page URL for each key claim.
- If docs are ambiguous, list what was checked and mark uncertainty.

## Quick Example

```bash
agent-browser --session motion-docs --headed open https://motion.dev/docs/quick-start
agent-browser --session motion-docs --headed snapshot -i -c
agent-browser --session motion-docs --headed find role link click --name "React"
agent-browser --session motion-docs --headed wait 500
agent-browser --session motion-docs --headed get title
agent-browser --session motion-docs --headed get url
```
