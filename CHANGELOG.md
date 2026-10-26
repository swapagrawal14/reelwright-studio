# Changelog

## 0.3.0 — Editable motion, image tracing, and Skate Kid

- Added hierarchical group and vector layers, draggable local pivots, per-segment cubic easing, delayed/windowed/repeating/yoyo tracks, continuous rotation, and wrapped scroll.
- Added browser-side color quantization and connected-region SVG tracing with manual labels/pivots and optional connected vision-model suggestions; automatic part detection remains approximate.
- Added complete Reel JSON generation with validator-error retries, animation-direction guidance, offline motion presets, and the existing local command bar.
- Added editor grouping/ungrouping and a keyframe modal for add/move/delete, easing, loop/yoyo, and window controls; edits participate in undo/redo.
- Added `samples/skate-kid.reel.json` and three Skate Kid golden frames; the sample preserves the recognizable doodle, rider/stretch/squash hierarchy, ollie/board flip, moving streaks, and seamless 3.2-second loop.
- Updated authoring prompts and image-to-SVG guidance. Validation: `npm test` and 12 browser PNG golden comparisons pass.

## 0.2.0 — Reel JSON and modular core

- Moved editor styling and JavaScript out of `index.html` into static CSS and ES modules.
- Added Reel JSON v1 validation, fractional-coordinate normalization, limits, SVG sanitization, missing/unknown reference warnings, and a SwapDraws storyboard adapter.
- Added import via file chooser, paste dialog, global JSON drag-and-drop, five built-in sample reels plus self-contained Cooler ownership, Skate & Shake, and Barber’s Big Snip illustration samples, import summary, repair with a connected model, download/copy JSON, and the AI authoring prompt.
- Added an eight-second Skate & Shake loop with whole-illustration bounce/sway, camera breathing, and animated accent stars.
- Added Barber’s Big Snip as a hybrid sample: the illustration stays faithful, while the moustache is a separate animated vector path with timed snip cues.
- Added a deterministic time-based scene evaluator and matching preview/export SVG frame path for multi-scene scripts, character clips, camera keys, shapes, text, images, and seeded particles.
- Replaced the previous default WebM-only exporter with Mediabunny/WebCodecs H.264 MP4, then ffmpeg.wasm attempt, then a clearly disclosed WebM fallback.
- Added OpenAI-compatible JSON patch edits with validation, selected-layer scope checks, and up to three retries.
- Added IndexedDB autosave/history plus a local crash backup, and nine browser PNG golden frames across three samples.
- Added the repository-root `REEL-JSON-AGENT-PROMPT.md`; **Copy AI prompt** now copies this full creative brief from the static site.
- Added `IMAGE-TO-SVG-GUIDE.md` and updated both agent prompts to request faithful, editable traces when appropriate and explain the pixel-fidelity trade-off.
- Updated static deployment, schema, and test documentation.

## 0.1.0 — Editor prototype

- Initial browser-only editor shell, sample SVG character, layer tree, inspector, local motion commands, BYOK settings, phone preview, responsive drawers, and local persistence.
