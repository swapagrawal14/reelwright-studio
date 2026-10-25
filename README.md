# Reelwright Studio

A static, browser-first animation editor. No application server or build step is required. Reelwright JSON v1 is the portable project format: import a script, preview it with the editor's deterministic scene clock, edit it with a connected model or local command shortcuts, and export an MP4 when supported.

## Run and deploy

Open `index.html` locally or serve this folder from any static host. It works as a static Vercel project and with GitHub Pages (deploy the repository root). No secrets or project assets are sent to a Reelwright backend.

## Reel JSON workflow

- Use **Import JSON** in the top bar, or **Projects → Import JSON**. Drop a `.json` or `.reel.json` anywhere in the page, or use **Paste JSON**.
- Validation opens a summary with project name, canvas, duration, scene/layer/asset counts, and any warnings before the current scene is replaced.
- Choose **Projects → Try a sample** for Run cycle, Wave hello, Photo push-in, Title card, or Product teaser. The starter sample file is `samples/run-cycle.reel.json`.
- **Download as Reel JSON** embeds assets or downloads them separately; **Copy JSON** copies the active project; **Download poster PNG** renders the current deterministic frame; **Copy AI prompt** puts the authoring prompt on the clipboard. The full prompt is also in `REEL-JSON-PROMPT.md`.
- Files over 25 MB, more than 30 scenes, a scene over 400 layers, canvases above 3840 px per side, or projects longer than 120 seconds are rejected. Unknown rigs, clips, layer types, and missing asset references are recovered with warnings. Imported JavaScript/procedural code is never executed. SVG content is sanitized. HTTPS media is used only when the browser can fetch it; CORS may prevent loading.

The JSON schema is documented in `REEL-JSON-PROMPT.md`. The code in `js/json.js` is the normalizer and validator; it resolves assets, converts fractional positions to canvas units, and creates deterministic auto timings. Sample `.reel.json` files are in `samples/`.

## Animation and rendering

`js/engine.js` provides `evaluate(project, t)` and deterministic SVG frame output. The editor artboard, phone preview, PNG poster export, and video exporter use the same SVG frame function so the same project/time produces the same picture. Current built-in rigs are `starter-boy`, `starter-girl`, `cat`, and `robot`; character clip presets include idle, walk, run, wave, jump, dance, nod, and turn. Particles use seeded randomness.

MP4 export uses WebCodecs through Mediabunny, loaded from a CDN only when exporting. If that path is unavailable, the exporter attempts an ffmpeg.wasm conversion; if the browser or CDN blocks that fallback, it downloads a deterministic, clearly labelled WebM instead. Export remains on-device. A network connection is needed to load these optional CDN libraries.

Connected models use the configured OpenAI-compatible endpoint. For Reel projects the model receives a compact project and the Reel schema and returns validated, selected-layer-scoped JSON patches; invalid patches are retried up to three times. Model keys are not included in Reel JSON or export files. With no model connected, local keyword motion commands remain available.

## Source layout

- `index.html` — static editor shell
- `css/style.css` — editor and responsive/mobile layouts
- `js/util.js` — common utilities, seeded random, toast and event helpers
- `js/model.js` — project store, undo/redo, IndexedDB autosave and local backup
- `js/engine.js` — pure evaluator and SVG/Canvas frame path
- `js/rigs.js` — built-in rig and clip registry
- `js/json.js` — Reel JSON schema, migration/SwapDraws adapter, validation, and samples
- `js/ai.js` — endpoint client, patch validation/scoping, and JSON repair
- `js/export.js` — MP4, ffmpeg.wasm, WebM fallback and poster export
- `js/ui/json-dialogs.js` — import, sample gallery, summary, repair, and export dialogs

The app is plain ES modules; no bundler is required. Projects are autosaved to IndexedDB with a local-storage crash backup. API credentials are only remembered if the user opts in.

## Tests

- `npm test` — validates all built-in samples and checks JSON normalization, bad input, rig fallbacks, deterministic evaluation, and stored SVG golden hashes.
- `npm run test:golden` — renders 9 browser PNG frames (time 0, middle, and last for Run cycle, Wave hello, and Photo push-in) and compares them with `tests/golden/png/`. The test runner needs Playwright and Chromium.
- `npm run golden:update` — intentionally regenerate the golden PNGs after a renderer change.

## Current scope / remaining work

Reel JSON import/export, sample scripts, deterministic multi-scene rendering, WebCodecs MP4 export, AI JSON patches, IndexedDB autosave, and golden-frame checks are implemented. The photo sample is illustrative; automatic subject segmentation, feathered parallax/mesh warping, and vision-based vector redraw still need implementation. Audio muxing, rich draggable keyframe/pivot editing, a complete clip/state-transition UI, full multi-project thumbnail browser, and all layer transform controls remain future work. Character group/palette support is minimal in this first modular pass.
