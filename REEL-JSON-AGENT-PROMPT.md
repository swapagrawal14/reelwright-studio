# REEL JSON AGENT PROMPT — write Reel JSON that is actually good

Use it like this. Tell your agent:

> Read https://github.com/swapagrawal14/reelwright-studio and follow REEL-JSON-AGENT-PROMPT.md. Make me a reel about: **[your idea]**. [Attached: my image(s)] / [No image: generate what you need].

Tip: commit this file to the repo root as `REEL-JSON-AGENT-PROMPT.md` (like SwapDraws' AI-STORYBOARD-PROMPT.md) and make the app's "Copy AI prompt" button copy it, so every agent that opens the repo finds it.

---

## 0. Your job
You are a motion director and technical writer in one. You produce **one Reel JSON file** for Reelwright Studio that imports with no errors, looks designed, and feels alive when rendered to MP4. A pile of default text layers is a failure. A short film with a beginning, a middle and a payoff is the goal.

## 1. Step zero: learn the real schema (never guess)
Before writing anything, open the repo and read, in this order: `README.md`, the JSON module (look in `js/` for `json.js` or the file that validates/imports Reel JSON), the sample gallery files, the "Copy AI prompt" text, the rigs/clips list, the font list and the effects list.

Write yourself a private cheat sheet with:
- exact top-level fields, scene fields, layer types and their fields
- allowed values: easings, effects (`in`/`out` fx), transitions, particle kinds, fonts, rig ids, clip names, background types
- coordinate conventions (fractions vs pixels), time units, defaults, limits (file size, scene/layer counts, duration)
- how images and audio are referenced (`@assetId`, data URL, https URL)

**The repo is the source of truth.** If this prompt and the repo disagree, follow the repo. Use only ids and fields you found. If something you want does not exist, pick the closest supported option or leave it out and say so in the notes. If you can run code, load the repo's validator on your output; if not, hand-check against section 7.

## 2. Inputs
### A. The user gave an image (or several)
1. **Look first.** Describe to yourself: subject, setting, mood, light direction, dominant 3 to 5 colors, empty areas (safe zones for text), orientation, and what could plausibly move (hair, cloth, water, sky, smoke, lights, eyes) or be revealed.
2. **Pick the treatment** that fits the image:
   - Photo or realistic image: camera push/pan, parallax if a subject mask is supported, gentle breathing/float, particles, light leaks, grain, vignette, text and captions. Never warp or change a real person's face.
   - Illustration or cartoon: animate parts (use `group` layers with real pivots) or character clips if a rig fits.
   - Product or object: slow orbit-like push, highlight sweeps, label callouts.
3. **Embed the image** as an asset. Downscale to at most 1600 px on the long side, JPEG quality about 82 (PNG only when transparency is needed). Embed as a `data:` URL, never paste a base64 wall into chat; save the JSON to a file. If you have code execution, use this:
```python
import base64, io, json
from PIL import Image
def embed(path, max_side=1600, q=82, png=False):
    im = Image.open(path); im.thumbnail((max_side, max_side))
    b = io.BytesIO()
    if png: im.save(b, "PNG", optimize=True); mime = "image/png"
    else: im.convert("RGB").save(b, "JPEG", quality=q); mime = "image/jpeg"
    return f"data:{mime};base64," + base64.b64encode(b.getvalue()).decode()
# reel["assets"]["hero"] = {"src": embed("photo.jpg")}
json.dump(reel, open("my-reel.reel.json", "w"), ensure_ascii=False, indent=1)
```
   If you cannot run code, write the JSON with asset ids (`@hero`) and `src` values like `"assets/hero.jpg"`, and tell the user exactly which file to drop in, or hand them this script to embed it. Keep the final file under the repo's size limit (25 MB unless the repo says otherwise).

### B. No image was given
You must create the visuals yourself. Choose per scene:
- **Vector first (preferred for explainers, characters, icons, charts):** write clean, flat SVG yourself (`svg` layer or `path`/`group` layers). It is sharp, tiny and animatable. Name groups by body part or function and set pivots at real joints.
- **Generated raster (for atmospheric or photoreal plates):** if you have an image-generation tool, use it. Otherwise write the exact prompts for the user and stop at "ready to receive images" with the JSON already wired to `@asset` names.

Image-generation guidance:
- Size and ratio: 9:16 (about 1080x1920 or the nearest your tool supports) unless the canvas says otherwise. Leave a quiet area for text.
- **One style sentence, repeated in every prompt**, for consistency (medium, palette, lighting, lens, texture).
- For parallax, ask for **layers**: (1) background plate with no subject, (2) subject on transparent or plain background, (3) optional foreground elements. Transparent PNG if supported.
- No text, logos or watermarks inside generated images (text belongs in `text` layers). No real people's likenesses and no copyrighted characters.
- Generate only what you need, usually 2 to 5 images for a 15 to 30 second reel.

## 3. Quality bar: what separates good from useless
**Useless (avoid):** one static slide with a title; all layers appearing at t=0; text over busy image areas; linear easing everywhere; no camera; ten layers doing the same fade; off-canvas or overlapping elements; placeholder copy; random decorative particles; ids like `layer1`..`layer40`; a 40 MB file; effects stacked on every layer.

**Good (aim for):**
- **Story shape:** hook (0 to 1.5 s: the most striking image or line), development (1 to 3 beats), payoff (the reveal, result or punchline), end card (clear takeaway or call to action, 1.5 to 2.5 s).
- **Length:** 8 s for a loop or teaser, 15 to 30 s for a story or explainer. Unless asked otherwise, default to 15 s in 3 to 5 scenes.
- **Camera in every scene:** a slow push (zoom 1.0 to 1.08 or 1.15), pan, or settle. Vary direction between scenes.
- **Staggered reveals:** elements enter 0.15 to 0.25 s apart, in reading order, with ease-out; exits are shorter than entrances. One hero element per scene gets the biggest motion.
- **Idle life:** something always moves a little (drift, breathing, particles, light sweep) and cycles close cleanly when looped.
- **Typography:** one display font and one text font from the available list; sentence case; hierarchy of 2 sizes (for example 0.07 and 0.035 of canvas height); max 7 words per line, max 2 lines; keep text inside a 6 percent safe margin and away from faces. Reading time: show each caption at least `0.8 + 0.3 x word count` seconds.
- **Color:** palette taken from the image or a deliberate 4-color set (background, ink, one accent, one neutral). Check text contrast.
- **Transitions:** 0.4 to 0.6 s, matching the mood (wipe or slide for energy, fade for calm); never more than two types per reel.
- **Sound (if audio is supported):** one music or ambience bed, volume 0.25 to 0.4, never required.
- **Restraint:** at most 3 effects per scene; remove anything that does not serve the beat.
- **Clean file:** human-readable ids (`hero`, `title`, `price_tag`), no dead layers, no duplicated assets, deterministic seeds for particles.

## 4. Process (follow in order)
1. **Brief in 3 lines:** goal, audience, tone. Ask at most one question, only if the idea is truly unclear; otherwise state assumptions.
2. **Shot list** as a compact table: scene, seconds, what the viewer sees, text on screen, camera, motion, transition.
3. **Style kit:** palette hex values, fonts, text sizes, motion language (fast/snappy or slow/dreamy).
4. **Assets:** analyze given images, or create SVGs/images (section 2).
5. **Write the JSON** using only supported fields (section 1).
6. **Validate** (section 7). Fix, then validate again.
7. **Deliver** (section 8).

## 5. Pattern library (adapt to the repo's real field names)
- **Photo push-in reel:** scene bg = the photo (`fx: kenburns/parallax`), zoom 1.0 to 1.12 over the scene, a particle layer (dust or sparks, low opacity), title rising in at 0.4 s, caption line at 1.6 s, vignette and grain on top.
- **Product teaser:** hero image enters with a small scale-up and light sweep; three callouts appear 0.25 s apart with leader lines drawn on; price or benefit last; end card with brand.
- **Character moment:** rig clip timeline `walk` then `run` then `wave`; camera follows; ground shadow; dust particles at foot contact; title at start, takeaway at end.
- **Explainer:** icon or shape per idea, drawn on (reveal "draw"), one sentence per scene, progress feel through consistent layout and a recurring accent color.
- **Quote card:** background gradient plate, large quote typed in or risen word by word, author line last, slow camera drift.

## 6. Hard rules
- No executable code, scripts or `procedural` fields in the JSON. Plain data only.
- SVG must be clean: no `<script>`, no event handlers, no external references.
- No text rendered into generated images; no real-person likenesses; no copyrighted characters; do not change a real person's face or expression.
- Stay within the repo's limits for duration, layers, scenes and size.
- Do not output base64 into chat. Save the JSON to a file and share the file.

## 7. Self-check before delivering (tick every box)
- [ ] JSON parses; `reelwright` version and all required fields match the repo.
- [ ] Every id is unique; every `@asset` reference exists; every `rig`, `clip`, `font`, `fx`, `transition` and `easing` value is one the repo supports.
- [ ] All times are inside the scene and total duration; no layer starts after it ends; loops close cleanly.
- [ ] All x/y/size values are within the canvas; text sits inside the safe margin; nothing overlaps unintentionally.
- [ ] Each scene has a camera move and a clear hero element; hook in the first 1.5 s; end card present.
- [ ] Text counts and reading times meet section 3.
- [ ] File size is under the limit; images are downscaled.
- [ ] If you could run the validator or the app, the import summary shows no errors and no unexpected warnings.

## 8. Final answer format
1. The file: `{slug}.reel.json` (and any separate image files you created).
2. A 5-line summary: concept, duration, scenes, palette and fonts, anything you could not do and why.
3. The shot list table.
4. If you created images by prompt only, the list of prompts and the exact asset names to drop in.
5. How to use it: open Reelwright Studio, Import JSON (or drag the file), review the summary card, "Render MP4 now".
