# Implementation Plan: Ofrenda Local — a private digital ofrenda

## Overview
A single-page web app for Día de los Muertos. You tell it about a loved one (name, years, favorite foods, songs, a story).
An open-weight LLM (Llama 3.2 3B via WebLLM) running **on your own GPU inside the browser** writes a remembrance
and a short *calavera literaria* (a playful rhyming Día de los Muertos poem). The app then shows it on an animated ofrenda with candles, marigolds and papel picado.
Everything stays on the machine: no API key, no server, and it works offline once the model is cached.

## Why open (for the post)
- Memories of the dead are intimate. With an open-weight model they never leave the device.
- Free to run with no key, and once cached it works offline.
- You can swap models (Llama / Qwen / Phi) from a dropdown, which a closed API would not allow.

## Architecture Decisions
- **WebLLM (`@mlc-ai/web-llm@0.2.79`, Apache-2.0) from jsDelivr, pinned.** No install, and it uses WebGPU on the local GPU. The weights are cached in the browser's Cache Storage after the first download.
- **No framework or build step.** Plain HTML, CSS and ES modules, served by `python -m http.server`, because ES modules don't load from `file://`.
- **Pure logic in `ofrenda.js`** (prompt building, validation, persistence shape). It is unit-tested with `node --test`, and the UI is in `app.js`.
- **localStorage for saved ofrendas.** It is per device and private, which is the point.

## Dependency graph
```
ofrenda.js (prompt + validation)  ──► app.js (UI + WebLLM engine) ──► index.html/style.css
                  └── ofrenda.test.mjs
```

## Task List

### Phase 1: Core path (the riskiest part first: does the model run?)
- [x] Task 1: Prompt builder and tests (`ofrenda.js`, `ofrenda.test.mjs`)
- [x] Task 2: Page loads the model with a progress bar and streams a remembrance from the form

### Checkpoint: Core
- [x] `node --test` passes
- [x] In Chrome/Edge: the model loads, the form submits, and text streams in

### Phase 2: Ofrenda experience
- [x] Task 3: Ofrenda visuals (candles, marigolds, papel picado, photo slot) that render the generated text
- [x] Task 4: Save/list/delete ofrendas in localStorage, plus a model picker

### Checkpoint: Complete
- [x] Full flow works again after a reload (saved ofrendas are still there)
- [x] README explains how to run it and why it is open

## Risks and Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| No WebGPU (Firefox/old browser) | High | Detect `navigator.gpu` and show a clear message |
| First model download ~2 GB | Med | Progress bar; smaller Qwen 1.5B option |
| 6 GB VRAM limit | Low | 3B q4f16 needs ~2.5 GB |

## Open Questions
- Should an Ollama backend toggle be added later for users who prefer a native runtime? (Out of scope for now.)
