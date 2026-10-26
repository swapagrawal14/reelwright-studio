# 🖼️ Image-to-SVG: preserve the art, make it editable where possible

Use this guide whenever a user supplies an image—or asks for an image to be created—and wants an editable SVG or editable animation parts.

## The fidelity/editability trade-off

There are two different things people may mean by “convert this image to SVG”:

1. **Keep the pixels exactly the same:** put the original raster image inside an SVG `<image>` element. It will look the same, but the artwork is still a bitmap; paths, colors, facial features, and limbs are not individually editable.
2. **Make the artwork vector-editable:** trace or reconstruct it as SVG paths, shapes, and groups. This can be highly faithful for flat illustrations, icons, and clean generated art, but it is an approximation—not a pixel-identical conversion. Photos and textured paintings are particularly difficult to represent faithfully as a small, useful set of editable paths.

**Never promise both exact pixel identity and fully editable vector shapes.** Explain the trade-off when it matters, and preserve the original raster as a reference or fallback if useful.

## Recommended approach

### Flat illustration, cartoon, icon, or generated vector-style art

When editability is requested, aim for a careful, high-fidelity trace:

- Keep the original image dimensions and aspect ratio as the SVG `viewBox`; preserve composition, silhouette, pose, proportions, line placement, and negative space.
- Sample and reuse the original palette. Match the original background color, gradients, outlines, and overlapping order instead of redesigning or “improving” the art.
- Build semantic groups and parts with meaningful names—such as `hair`, `face`, `eyes`, `shirt`, `left_arm`, `skateboard`, and `shadow`—so later animation or edits can target a component.
- Prefer a small number of accurate, clean paths and shapes over hundreds of noisy auto-trace fragments. Retain tiny details that materially affect recognition; simplify only where it does not change the visual identity.
- For animation, put independently moving parts in separate groups and set pivots at their real joints. Do not split or deform a face just to create motion.
- Compare the rendered SVG with the source at the same size. Overlay or blink between them, inspect the silhouette and details, and iterate until the difference is as small as practical.

### Photo, texture, or painterly image

Do not pretend a photo has become vector-editable just because it is wrapped in SVG. Keep it as an embedded raster image for faithful appearance. If the user wants editable additions, place vector shapes, labels, masks, or callouts on separate layers over it. Offer a stylized trace only if the user accepts the visual approximation.

### In Reelwright Studio specifically

- An SVG supplied as an `svg`/image asset currently behaves as **one image layer** in the editor; the editor does not expose its internal SVG paths as separate controls.
- For parts that need to be independently animated or edited inside Reelwright, model them as separate Reel `path`, `shape`, or `group` layers. Keep IDs descriptive and hierarchy shallow.
- The browser includes a raster-to-vector trace tool for flat illustrations: color quantization, connected-region contour paths, tiny-region merging, and editable part naming/pivots. A connected vision model may suggest names and pivots; manual labeling works offline. This is an approximation, not a perfect detector: it may merge small details, miss semantic joints, and does not reliably reconstruct hidden/occluded fill. Review and adjust the trace, especially for complex doodles.
- An imported SVG asset still behaves as one image layer; use separate Reel `path`, `shape`, `vector`, or nested `group` layers for app-level part edits. Follow the actual Reel JSON schema and sanitizer.
- Follow the repository's actual Reel JSON schema and SVG sanitizer. Use plain SVG data—no scripts, event handlers, external references, or executable content.

## Delivery checklist

- [ ] State whether the output is an exact raster embedded in SVG, a high-fidelity editable trace, or a hybrid.
- [ ] Preserve the source composition, orientation, palette, and proportions; don't silently restyle it.
- [ ] For editable art, group and name meaningful parts; retain the original image separately when useful for comparison.
- [ ] Preview the SVG at the intended Reel canvas size and compare it with the source.
- [ ] Validate the SVG and the containing Reel JSON; disclose any details that could not be matched faithfully.
