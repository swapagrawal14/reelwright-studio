# Changelog

## 0.2.0 — Reel JSON and modular core

- Moved editor styling and JavaScript out of `index.html` into static CSS and ES modules.
- Added Reel JSON v1 validation, fractional-coordinate normalization, limits, SVG sanitization, missing/unknown reference warnings, and a SwapDraws storyboard adapter.
- Added import via file chooser, paste dialog, global JSON drag-and-drop, five built-in sample reels plus self-contained Cooler ownership and Skate & Shake illustration samples, import summary, repair with a connected model, download/copy JSON, and the AI authoring prompt.
- Added an eight-second Skate & Shake loop with whole-illustration bounce/sway, camera breathing, and animated accent stars.
- Added a deterministic time-based scene evaluator and matching preview/export SVG frame path for multi-scene scripts, character clips, camera keys, shapes, text, images, and seeded particles.
- Replaced the previous default WebM-only exporter with Mediabunny/WebCodecs H.264 MP4, then ffmpeg.wasm attempt, then a clearly disclosed WebM fallback.
- Added OpenAI-compatible JSON patch edits with validation, selected-layer scope checks, and up to three retries.
- Added IndexedDB autosave/history plus a local crash backup, and nine browser PNG golden frames across three samples.
- Added the repository-root `REEL-JSON-AGENT-PROMPT.md`; **Copy AI prompt** now copies this full creative brief from the static site.
- Updated static deployment, schema, and test documentation.

## 0.1.0 — Editor prototype

- Initial browser-only editor shell, sample SVG character, layer tree, inspector, local motion commands, BYOK settings, phone preview, responsive drawers, and local persistence.
