# Todo — Ofrenda Local

## Task 1: Prompt builder + tests
**Acceptance:**
- [x] `buildMessages(person)` returns system and user chat messages that include every provided detail
- [x] `validatePerson` rejects a missing name
**Verify:** `node --test`
**Deps:** none · **Files:** `ofrenda.js`, `ofrenda.test.mjs` · **Size:** S

## Task 2: Model load + streamed remembrance
**Acceptance:**
- [x] The model loads with a visible progress bar, and a no-WebGPU message appears when unsupported
- [x] Submitting the form streams the remembrance and calavera into the page
**Verify:** manual in Chrome/Edge at http://localhost:8000
**Deps:** 1 · **Files:** `index.html`, `app.js`, `style.css` · **Size:** M

## Checkpoint: Core
- [x] Tests pass · model streams text end to end

## Task 3: Ofrenda visuals
**Acceptance:**
- [x] Altar with flickering candles, marigolds, papel picado and an optional photo (read locally, never uploaded)
- [x] Generated text renders on the altar
**Verify:** manual visual check, desktop + phone width
**Deps:** 2 · **Files:** `index.html`, `style.css`, `app.js` · **Size:** M

## Task 4: Save/list/delete + model picker
**Acceptance:**
- [x] Saved ofrendas survive a reload; delete works
- [x] Model dropdown swaps between Llama 3.2 3B and Qwen 2.5 1.5B
**Verify:** `node --test` (serialization) + manual reload
**Deps:** 3 · **Files:** `ofrenda.js`, `app.js`, `ofrenda.test.mjs` · **Size:** S

## Checkpoint: Complete
- [x] README with run steps + "why open" section
