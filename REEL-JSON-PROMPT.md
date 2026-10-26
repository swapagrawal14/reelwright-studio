# Reelwright Studio authoring prompt

Paste this prompt into ChatGPT, Claude, or another model, then save the JSON answer as a `.reel.json` file and import it in Reelwright Studio. Reelwright also has **Import HTML** for self-contained inline SVG/CSS animations; if you want an HTML handoff instead, ask the model for inline SVG with semantic groups and CSS `@keyframes` transforms (not canvas or JavaScript), then upload its `.html` file.

---

You write Reel JSON for Reelwright Studio. Output **one JSON object in a fenced JSON code block and nothing else**. It must match Reelwright JSON version 1.

## Top-level shape

```json
{
  "reelwright": 1,
  "name": "My Reel",
  "canvas": { "w": 1080, "h": 1920, "fps": 30, "bg": "#F6F7F9" },
  "duration": 8,
  "assets": {},
  "scenes": [
    {
      "name": "Scene name",
      "duration": 8,
      "background": { "type": "color", "color": "#F6F7F9" },
      "camera": { "auto": true },
      "layers": []
    }
  ]
}
```

`reelwright` must be `1`. `canvas` defaults to 1080 × 1920, 30 fps, `#F6F7F9`. Total duration may be a number or `"auto"`, and cannot exceed 120 seconds. A Reel can contain up to 30 scenes, each up to 400 layers. Times are seconds; angles are degrees. `x`, `y`, `w`, `h`, and `size` use fractions of the canvas for values from -1 to 1, or pixels for values greater than 1. `x` supports `center`, `left`, and `right`; `y` supports `center`, `top`, and `bottom`. Unspecified layer timing auto-sequences with a 0.2 second gap.

Background types: `color`, `dots`, `grid`, and `paper`. A camera may be `{ "auto": true }` or `{ "keys": [{ "t": 0, "x": 0.5, "y": 0.5, "zoom": 1, "ease": "inOut" }] }`.

## Layer types

Common fields: `id`, `name`, `type`, `x`, `y`, `w`, `h`, `rot`, `scale`, `opacity`, `pivot`, `start`, `delay`, `duration`, `hidden`, `in`, `out`, `tracks`, `fx`.

- `character`: `rig`, `palette`, `clips` (`[{ "clip": "run", "t": 0, "duration": 2, "loop": true, "speed": 1 }]`), `facing`.
- `group`: `children` (nested layers), `pivot`.
- `path`: SVG path data `d`, `fill`, `stroke`, `strokeWidth`, `pivot`.
- `text`: `text`, `font`, `size`, `color`, `align`, `weight`, `reveal` (`none`, `type`, `rise`, `handwrite`).
- `image`: `src`, `fit`, `mask`, `fx`.
- `svg`: `src`, `reveal` (`none`, `draw`, `fade`).
- `shape`: `shape` (`rect`, `roundRect`, `circle`, `arrow`, `star`), `fill`, `stroke`.
- `particles`: `kind` (`dust`, `snow`, `sparks`, `confetti`), `count`, `seed`, `color`.
- `caption`: `text`, `style` (`bold-bottom`, `karaoke`), optional `words`.
- `audio`: `src`, `start`, `duration`, `volume`, `loop`.

Tracks are data-only objects such as `{ "prop": "translateY", "mode": "keyframes", "period": 4, "delay": 0, "repeat": true, "alternate": false, "window": [0.2, 0.8], "keys": [{ "t": 0, "v": 0, "ease": "inOut" }, { "t": 4, "v": 0, "ease": "cubic-bezier(0.2,0.7,0.3,1)" }] }`. Supported properties include `translateX`, `translateY`, `rotate`, `scale`, `scaleX`, `scaleY`, `opacity`, `width`, `height`, and `size`. Modes: `keyframes`, `continuous` (with `speed`), and `scroll` (with `speed` and optional `wrap`). Easing includes `linear`, `in`, `out`, `inOut`, `steps(n)`, and `cubic-bezier(x1,y1,x2,y2)`. Tracks support delays, repeat, yoyo (`alternate`), and cycle windows. Close loop keyframes to the starting pose; negative `scaleY` is allowed for flips. Assets are keyed in `assets` and referenced as `@assetId`; supported sources are embedded `data:` URLs or HTTPS URLs.

Built-in rig IDs: `starter-boy`, `starter-girl`, `cat`, `robot`. Character clip presets: `idle`, `walk`, `run`, `wave`, `jump`, `dance`, `nod`, `turn`.

## Authoring rules

- Use 1080 × 1920 unless the user requests another format. Keep text inside a 6% safe margin.
- Give the scene a clear beat: establish, develop, payoff, settle.
- Direct motion with anticipation, squash/stretch, arcs, staggered timing, follow-through, secondary motion, and responsive shadows. Add blinking/head tilt only when appropriate; avoid synchronized, mechanical movement.
- Use at most 3 effects per scene. Prefer smooth motion, small amplitudes, trailing parts, and loops that close cleanly.
- Use only listed rigs, clips, fonts, and shapes; choose safe defaults if unsure.
- Do not emit JavaScript, procedural code, script tags, event handlers, or external SVG references.
- For real photos, reference an `@assetId` and use only subtle camera push, parallax, breathing, or particles. Do not alter a real person's face.
- If a user asks to make supplied or generated art editable as SVG, preserve the source composition and make a careful high-fidelity path/group trace for flat illustrations. An SVG `<image>` containing the original raster looks pixel-identical but is not vector-editable; a vector trace is editable but cannot be guaranteed pixel-identical. For photos/textures, keep the raster and make only overlays editable unless the user accepts a stylized trace. In Reelwright, an SVG asset may be one editor layer; use separate Reel `path`, `shape`, `vector`, or nested `group` layers for app-level editing. The browser includes an approximate raster-to-vector trace with editable region labels and pivots; automatic part detection is not perfect and hidden/occluded areas may need manual repair. See [`IMAGE-TO-SVG-GUIDE.md`](IMAGE-TO-SVG-GUIDE.md).
- Default to 8 seconds if the user does not specify a duration.

## User request

<paste what you want here>
