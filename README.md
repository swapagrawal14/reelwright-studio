# Reelwright Studio

A browser-first prototype of an AI-assisted, layered animation editor. It opens directly into an editable sample scene; no account or backend is required.

## Run it

- Open `index.html` in a modern browser, or serve the folder with any static web server (`python3 -m http.server 4173`).
- Choose **Connect** to enter an OpenAI-compatible base URL, model, and API key. **Test connection** checks `GET /models`; the command bar then sends a small animation-director request to `/chat/completions`. The key is kept in memory unless **Remember on this device** is enabled.
- Without a key/model, local command mapping still animates the starter character. Try **Run**, **Wave**, **Idle breathing**, **Dance**, or **Zoom in slowly**.
- Drag a photo onto the artboard or use the image tool. The source file is read locally as a data URL.
- Use **Preview** for the phone-frame player. Use the Code tab to inspect/copy a compact scene snapshot.

## Responsive layout and scrolling

The editor uses independent scroll areas for the Layers and Inspector panels, so scrolling those lists does not move the whole workspace. On narrow screens, use the two canvas-header buttons to open Layers or Inspector as slide-over drawers; tap **Done**, the dimmed canvas, or press `Esc` to dismiss. The artboard, command bar, playback controls, and preview frame resize for mobile viewports, including short-height screens and safe-area insets.

## Controls

- `Enter`: send command · `Tab`: show/cycle command suggestions · `/` or `K`: focus the command bar
- `Ctrl/Cmd + Z`: undo · `Ctrl/Cmd + Shift + Z`: redo · `Esc`: close overlays
- Click the character or layer list to scope the command and inspector.

## Privacy

Scene data is saved to browser local storage on the same device. API credentials are sent directly to the configured model endpoint and are not uploaded to a Reelwright backend. Remembered credentials are stored in local storage only after the explicit opt-in. Use **Forget key** to clear them.

## Known limits

This is a functional front-end prototype, not a production animation renderer. The character is a hand-authored SVG sample; photo input remains raster and currently supports subtle camera-scale motion rather than subject segmentation or mesh warping. The local command interpreter maps a small set of requests to simple looping transforms; connected models are asked for a clip suggestion, not the full transactional vector-operation tool protocol. Scene state is locally persisted, but project history/IndexedDB, full multi-keyframe editing, rig manipulation, vectorization, state transitions, and sandboxed procedural scripts are not implemented. Export currently records a browser WebM preview when MediaRecorder is available; it does **not** produce H.264 MP4. Production MP4 output needs WebCodecs/MP4 muxing or an ffmpeg.wasm fallback. Audio muxing and the optional CORS-forwarding proxy are also not included.
