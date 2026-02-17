---
name: animejs-docs-browser
description: Browse Anime.js documentation with agent-browser and quickly extract accurate answers.
license: Proprietary
---

Use this skill when you need to answer questions about Anime.js docs or pull exact details from the official documentation.

Primary docs entry point:
- https://animejs.com/documentation/getting-started

Browser CLI reference:
- `agent-browser --help`

## Goal

Efficiently navigate Anime.js docs pages, open relevant sections, and extract precise facts (API names, options, defaults, examples, and links).

## Workflow

1. Start from the docs root in an isolated session.
2. Capture a snapshot to get stable element refs.
3. Navigate by link name (preferred) or direct URL.
4. Extract text and metadata from the target page.
5. Return concise notes with page URL(s) for traceability.

## Command Pattern

Use a named session so all commands share the same browser state.
Run in headed mode so you can watch the browser actions live:

```bash
agent-browser --session animejs-docs --headed open https://animejs.com/documentation/getting-started
agent-browser --session animejs-docs --headed snapshot -i -c
```

Then navigate and extract:

```bash
agent-browser --session animejs-docs --headed find role link click --name "Installation"
agent-browser --session animejs-docs --headed wait 500
agent-browser --session animejs-docs --headed get title
agent-browser --session animejs-docs --headed get url
agent-browser --session animejs-docs --headed snapshot -i -c
```

## Tactics

- Prefer `find role link click --name "..."` for sidebar navigation labels.
- Re-run `snapshot -i -c` after each navigation before interacting again.
- Use `get url` and `get title` whenever you collect facts.
- Use `get text <selector-or-ref>` for exact snippets.
- Use direct URLs when the target section slug is known.

## Quality Bar

- Do not guess API behavior. Verify on the relevant page.
- Include the exact page URL for each key claim.
- If docs are unclear, report uncertainty explicitly and list what was checked.

## Quick Example

```bash
agent-browser --session animejs-docs --headed open https://animejs.com/documentation/getting-started
agent-browser --session animejs-docs --headed snapshot -i -c
agent-browser --session animejs-docs --headed find role link click --name "Using with React"
agent-browser --session animejs-docs --headed wait 500
agent-browser --session animejs-docs --headed get title
agent-browser --session animejs-docs --headed get url
```
