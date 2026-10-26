# 🎬 Reelwright Studio

### Turn a motion idea into a tiny film—right in your browser.

**Write it. Shape it. Play it back.** Reelwright Studio is a static, browser-first editor for short animated reels. Bring a photo, a self-contained SVG/CSS HTML animation, or a Reel JSON script, refine the timing, then export a video—all without a Reelwright server or a build step.

> 🌐 **Static-first** &nbsp; · &nbsp; 🧩 **No bundler** &nbsp; · &nbsp; 📦 **Portable Reel JSON v1**

Your project is processed in the browser. If you choose to connect an AI model, the relevant project context is sent to that provider; Reelwright has no project backend.

---

## ✨ Make it move

| | What you can do |
|---|---|
| 🧾 **Import an animation** | Import, paste, or drop Reel JSON, or use **Import HTML** for inline SVG/CSS animations; validate before opening. |
| 🖼️ **Animate a photo** | Import a picture as a self-contained project with automatic camera motion, then customize it. |
| 🎛️ **Compose a scene** | Work with characters, text, shapes, paths, images, camera moves, and seeded particles. |
| 🤖 **Create with AI** | Connect a compatible model for scoped JSON edits—or copy the repo’s creative-agent prompt. |
| 🎞️ **Export a reel** | Render H.264 MP4 where supported, download a poster PNG, or save/copy Reel JSON. |
| ↩️ **Pick up where you left off** | Undo/redo, local autosave, and project history help keep experiments recoverable. |

## 🚀 Get started

Serve the folder locally (ES modules need an HTTP origin):

```bash
python3 -m http.server 4173
```

Open [http://localhost:4173](http://localhost:4173). No install or compilation step is needed to run the editor. The project can also be deployed as static files to **Vercel** or **GitHub Pages** from the repository root.

### Try a sample

Open **Projects → Try a sample**:

| Sample | A little inspiration |
|---|---|
| 🏃 Run cycle | Character clips and a camera move |
| 👋 Wave hello | A friendly character greeting |
| 📷 Photo push-in | An image, a caption, and a gentle push |
| ✨ Title card | A simple animated title treatment |
| 📱 Product teaser | A product-style reveal |
| ❄️ Cooler ownership | A self-contained illustrated photo with a subtle camera move and animated airflow |
| 🛹 Skate & Shake | A purple-haired skater bounces and sways in an 8-second looping dance |
| ✂️ Barber’s Big Snip | A separately editable moustache wiggles through two timed snips over the supplied illustration |
| 🛹 Skate Kid | A layered rider and board flip with a seamless 3.2-second loop |

Or bring your own: choose **Import JSON**, paste JSON, or drop a `.json` / `.reel.json` file onto the page. For an AI-generated HTML animation, choose **Import HTML**: Reelwright converts inline SVG shapes/groups and CSS `@keyframes` transforms into editable Reel layers and offers a sandboxed reference preview. Review the conversion warnings before opening it. JavaScript/canvas animation, external assets, and advanced SVG/CSS effects are not converted; the preview omits scripts and external requests.

## 🎥 From JSON to MP4

1. **Create** a scene in Reel JSON v1, start from a sample, or import a photo.
2. **Preview and edit** against the deterministic scene clock; use the editor’s timeline and controls to refine the result.
3. **Export** from the top bar or project panel. The poster action captures the current deterministic frame.

`js/engine.js` provides `evaluate(project, t)` and the shared SVG frame renderer. The editor artboard, preview, poster, and video export use that same frame path, so a project at a given time renders consistently. Built-in rigs include `starter-boy`, `starter-girl`, `cat`, and `robot`; available clips include idle, walk, run, wave, jump, dance, nod, and turn. Particle layouts use seeded randomness.

### Export notes

- 🎞️ **MP4:** WebCodecs via Mediabunny is attempted first; optional export libraries load from a CDN when needed.
- 🧰 **Fallback:** the exporter attempts ffmpeg.wasm, then offers a clearly labelled WebM if MP4 conversion is unavailable.
- 🌐 **Network:** the editor itself is static, but loading optional export libraries may require an internet connection and browser support.
- 🔊 **Audio:** audio layers can be represented in projects, but audio is not yet muxed into exported video.

## 🤖 AI prompt and model edits

**Projects → Copy AI prompt** copies [`REEL-JSON-AGENT-PROMPT.md`](REEL-JSON-AGENT-PROMPT.md), a practical creative and technical brief for making stronger reels. [`REEL-JSON-PROMPT.md`](REEL-JSON-PROMPT.md) is the compact schema/authoring reference.

You can also connect an OpenAI-compatible model from the editor. Reel edits are validated as JSON patches and limited to the selected layer’s scope; invalid results are retried up to three times. Model keys are not included in Reel JSON or exported files. With no model connected, local motion commands remain available.

## 🧩 Image-to-SVG: faithful first, editable where possible

For flat illustrations or generated vector-style art, our agent prompts now ask for a high-fidelity, named-path/group trace that preserves composition, pose, palette, and details. See [`IMAGE-TO-SVG-GUIDE.md`](IMAGE-TO-SVG-GUIDE.md).

There is an unavoidable trade-off: embedding the original raster inside an SVG keeps its pixels exact but does **not** make its shapes editable; tracing those pixels into vector paths makes them editable but can only approximate the original. Photos and textured art should generally remain raster with editable vector overlays. In Reelwright today, an SVG asset is a single editor layer—use separate Reel `path`, `shape`, or `group` layers for app-level part editing. Automatic raster-to-vector tracing is not implemented yet.

## 🛡️ Portable by design

Reel JSON v1 is plain data—not executable scripts. The importer checks and normalizes projects before opening them, sanitizes SVG, rejects unsupported asset sources and unsafe identifiers, and enforces these limits:

- **25 MB** per Reel JSON file
- **30** scenes; **400** layers per scene
- **3,840 px** maximum per canvas dimension
- **120 seconds** maximum project duration

Images can be embedded as data URLs or referenced by HTTPS when browser CORS permits. Projects autosave to IndexedDB with a local-storage crash backup. There is no Reelwright backend; remote assets and connected AI providers are used only when requested.

## 🧪 Run the checks

```bash
npm test
npm run test:golden
```

`npm test` checks Reel JSON validation, sample projects, security handling, and deterministic behavior. `npm run test:golden` compares nine browser-rendered PNG frames with the golden fixtures; it needs Playwright and Chromium.

## 🧭 What’s here—and what’s next

**Implemented:** Reel JSON import/export, samples, deterministic multi-scene rendering, H.264 MP4 export with fallbacks, model-assisted JSON patches, local history/autosave, photo push-in projects, and golden-frame tests.

**Still in progress:** automatic photo subject segmentation, feathered parallax/mesh warping, vision-based vector redraw, audio muxing, rich keyframe/pivot editing, a complete clip/state-transition UI, a full thumbnail-based project browser, and complete layer controls. Character group/palette support is also minimal. GIF export is not currently available.

## 🗂️ Project map

| Path | What lives there |
|---|---|
| `index.html`, `css/style.css` | Static app shell and responsive editor UI |
| `js/app.js` | Editor wiring, persistence, imports, and exports |
| `js/json.js` | Reel JSON schema, normalizer, validator, and built-in samples |
| `js/engine.js`, `js/rigs.js` | Deterministic renderer, evaluator, rigs, and clips |
| `js/export.js` | MP4/WebM and poster rendering |
| `js/ai.js`, `js/model.js` | Model-assisted patches and local project history |
| `js/ui/json-dialogs.js` | Import, sample gallery, prompt copy, and export dialogs |
| `IMAGE-TO-SVG-GUIDE.md` | Raster fidelity vs. editable vector tracing guidance |
| `samples/` | Importable `.reel.json` examples |
| `tests/` | JSON checks and browser golden-frame fixtures |
