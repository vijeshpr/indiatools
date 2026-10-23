# Visual Asset Generation Guide — Film Reel Journey Cinematic Studio

This guide contains the exact visual reference generation prompts, parameters, and integration specifications for the **Film Reel Journey** cinematic studio feature inside IndiaTools Audio to Video Studio.

---

## 1. Overview & Architectural Rules

- **Role of Reference Assets:** The generated images serve as cinematic visual reference guides, texture sources, and preview cards. They do **not** replace the user's uploaded photographs.
- **Client-Side Procedural 3D Geometry:** The 35mm film strip ribbon, sprocket holes, projector volumetric light beam, and dust motes are rendered live in WebGL/Three.js with 100% browser-based processing.
- **Uploaded Photos as Hero Subject:** User photographs are dynamically mapped inside individual 35mm film frame apertures along the continuous ribbon, preserving aspect ratios and crystal-clear image sharpness.
- **No Reverse Black Surface:** When rotating or viewed from behind, photos reveal authentic translucent amber celluloid backing (`MeshBasicMaterial` with `side: BackSide`).

---

## 2. Dedicated Visual Asset Prompts

### Asset A — Hero Film Strip
- **Target File:** `public/images/filmReel/hero-film-strip.jpg`
- **Resolution:** 16:9 Widescreen (e.g. 1920×1080)
- **Prompt:**
> "Create a photorealistic premium 3D render of a vintage 35mm cinema film strip flowing through deep cinematic space in an elegant S-shaped curve. Clearly visible rectangular film frames, authentic sprocket holes on both edges, realistic translucent celluloid, warm amber projector light, subtle gold reflections, delicate dust particles, deep charcoal background, dramatic volumetric lighting, luxury Hollywood title-sequence aesthetic, physically believable materials, refined composition, widescreen 16:9. No text, no logos, no watermark. Keep the film strip clearly separated from the background. The frames should be large and easy to identify."

### Asset B — Vintage Film Reel
- **Target File:** `public/images/filmReel/vintage-film-reel.jpg`
- **Resolution:** 16:9 Widescreen (e.g. 1920×1080)
- **Prompt:**
> "Create a highly realistic vintage 35mm cinema film reel made of brushed dark metal, with authentic circular reel holes and a short length of celluloid film unwinding from it. Dramatic warm projector lighting, subtle bronze highlights, elegant shadows, premium cinematic product-render quality, deep black studio background, realistic material details, widescreen 16:9. No text, no logo, no watermark."

### Asset C — Projector Light Atmosphere
- **Target File:** `public/images/filmReel/projector-light-atmosphere.jpg`
- **Resolution:** 16:9 Widescreen (e.g. 1920×1080)
- **Prompt:**
> "Create a cinematic vintage movie projector light beam passing through a dark theatre atmosphere, with subtle floating dust and fine film particles illuminated by warm amber light. Deep black and charcoal surroundings, realistic volumetric rays, elegant atmospheric depth, restrained highlights, realistic photography, widescreen 16:9. No projector text, no logos, no watermark."

### Asset D — Film Frame Transition Reference
- **Target File:** `public/images/filmReel/film-frame-transition.jpg`
- **Resolution:** 16:9 Widescreen (e.g. 1920×1080)
- **Prompt:**
> "Create a premium cinematic transition reference showing two large rectangular photographs embedded inside a continuous vintage 35mm film strip. The camera perspective moves diagonally past the first photo toward the second. Realistic sprocket holes, warm amber edge light, gentle motion-blur impression around the strip only, sharp photographs, rich dark cinematic atmosphere, physically realistic 3D render, widescreen 16:9. No text, no logos, no watermark."

### Asset E — Grand Finale Composition
- **Target File:** `public/images/filmReel/grand-finale-composition.jpg`
- **Resolution:** 16:9 Widescreen (e.g. 1920×1080)
- **Prompt:**
> "Create an epic cinematic wide shot of a long vintage film strip forming a graceful spiral through deep space, with many rectangular photo frames following a continuous path. The frames show varied abstract landscapes and memory-like scenes. Warm golden projector light illuminates the central formation, subtle volumetric rays, refined dust particles, deep charcoal background, elegant composition, premium Hollywood end-credit sequence aesthetic, realistic 3D render, widescreen 16:9. No text, no logo, no watermark."

---

## 3. Continuous 3D Film Strip Ribbon Implementation

- **Procedural Celluloid Texture (`universeFilmReel.getOrCreateCelluloidTexture`):**
  - Generates authentic KS/BH sprocket hole perforations with rounded rectangle cuts using `destination-out` composite operations.
  - Adds edge markings (`EASTMAN 35MM • SAFETY FILM`, frame counters `▶ 18A • ◄`, dividing tracks, amber celluloid translucency).
  - Configurable warmth (0–100%) and translucency (10–100%).
- **3D Spline Path Generation:**
  - `s-curve`: Serpentine 3D curve weaving through space.
  - `spiral`: Helical ascending/descending spiral with majestic volumetric center.
  - `infinite-tunnel`: Deep forward perspective corridor.
- **Continuous Camera Journey:**
  - `Approach (0.00 – 0.35)`: Glides smoothly along ribbon toward photo frame.
  - `Hold (0.35 – 0.75)`: Settles into steady cinematic framing illuminated by projector light beam with gentle breathing drift.
  - `Departure (0.75 – 1.00)`: Slides along the celluloid ribbon edge past the photo toward the next station.
  - `Grand Finale`: Triggers in the last 12% of duration with a wide panoramic pull-back revealing the full spiral formation in space.
- **Post-Processing (2D Canvas):**
  - Warm amber radial projector vignette.
  - Procedural vintage film grain overlay with adjustable intensity.
