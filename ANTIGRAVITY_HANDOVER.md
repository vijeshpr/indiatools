# ANTIGRAVITY ACCOUNT HANDOVER — COMPLETE PROJECT CONTEXT EXPORT

> **Notice for Successor Antigravity Assistant / Developer:**  
> This master handover document was prepared on **2026-10-22** because the user temporarily switched Antigravity accounts due to usage quota exhaustion. The user intends to resume on this account after quota resets in approximately 2 days.  
> Read this entire document before performing any operations in this workspace.

---

## A. Project Identity

| Property | Value |
| :--- | :--- |
| **Project Name** | **IndiaTools** (`india`) |
| **Purpose** | High-utility, 100% browser-based private web tools suite for Indian consumers, creators, students, and businesses (69 distinct tools including PDF, Audio, Video, Image, Finance, Calculations, and Education). |
| **Local Project Path** | `C:\Users\Admin\Desktop\Wayanad\India` |
| **GitHub Repository** | `https://github.com/<repo-owner>/indiatools` (run `git remote get-url origin`) |
| **Production Website** | `https://indiatools-rho.vercel.app/` |
| **Primary Tool Path** | `https://indiatools-rho.vercel.app/tools/audio-to-video-studio` |
| **Framework & UI** | **React 19** (`19.2.8`), **Vite 8** (`8.3.0`), **Tailwind CSS v4** (`@tailwindcss/vite 4.3.3`), **TypeScript 6** (`~6.0.2`), **Lucide React** (`1.49.0`), **Framer Motion** (`13.4.6`), **Three.js** (`0.186.1`). |
| **Audio & Media Stack** | Web Audio API (`AudioContext`, `AnalyserNode`, `decodeAudioData`), HTML5 Canvas 2D (`60 FPS`), MediaRecorder, `fix-webm-duration` (`1.0.6`), `@breezystack/lamejs` (`1.2.7`), `canvas-confetti`. |
| **Hosting & Deployment** | **Vercel** with automatic continuous deployment linked to the `main` branch of repository origin. |
| **Static Prerendering** | Node.js prerender engine (`scripts/prerender.cjs`) generating static HTML for all **217 production URLs** declared in `public/sitemap.xml`. |

---

## B. User Requirements and Permanent Rules

### 1. Zero External API / Zero Cloud Processing / 100% Local Privacy
- **Strict Rule:** NEVER upload user images, audio files, documents, or data to any third-party API, external cloud server, or AI backend.
- All media processing (beat detection, canvas rendering, video encoding, background removal, PDF modification) must execute **100% locally in the browser** using client-side Web APIs, WebAssembly, or Web Workers.
- Do NOT claim that features use external "AI" or remote neural networks unless explicitly configured via local on-device models.

### 2. Design System & Visual Direction
- **Theme:** Premium dark cinematic editing interface (`#090A0F`, `#030712`, deep charcoal surfaces).
- **Accents:** Electric blue, cyan (`#00F0FF`), neon violet, pink/rose, and emerald highlights.
- **Micro-Interactions:** Subtle glassmorphism, glowing borders, active pulse indicators, smooth transitions, tooltip feedback, and responsive layout across desktop, tablet, and mobile.
- **Cleanliness:** No oversized cards, no excessive dead space, and no outdated default HTML form controls.

### 3. Strict Effect Default States (Safety First)
- **CRITICAL PERMANENT RULE:** All optional decorative visual effects (such as heavy flashes, distortion shakes, portal glows, or filters) **MUST BE OFF BY DEFAULT** on initial tool load.
- When a user uploads a photo, the initial canvas preview MUST be a clean, neutral, undistorted representation of the original photo.
- Users must explicitly opt-in or select presets to activate dynamic visual effects.

### 4. Language & Communication Standards
- The user communicates in Malayalam and English.
- **UI Language:** All UI headings, buttons, sliders, tooltips, and badges MUST BE IN **CLEAN ENGLISH** unless the feature is a dedicated multilingual Indian language tool (e.g., Cheque Studio, Name Slip Maker). Do NOT inject Malayalam text into technical studio controls (e.g., use `"Rhythm Cinematic Zoom"` instead of adding Malayalam translations into button labels).
- **Chat Responses:** Explain changes clearly and politely, using concise Malayalam or English as requested.

### 5. Git & Deployment Boundaries
- **Standing User Preference:** The user has explicitly instructed to **always push and update to website** upon completing coding features, passing all tests, and completing verification builds.
- Ensure all 34 test suites, 60/60 SEO checks, and production prerender build pass cleanly before pushing to `origin/main`.
- Only run `git add`, `git commit`, and `git push origin main` when the user explicitly prompts (e.g., *"update to website"* / *"websitelkk update chyyuka"*).
- When asked to push, verify tests and SEO audits locally first.

### 6. Shell & Windows Execution Rules
- Operating System: **Windows (PowerShell)**.
- For commands with `npx` or `npm`, always prefix with `cmd /c` (e.g., `cmd /c npx tsx tests/memory-burst.test.ts`).
- **NEVER use `&&` in PowerShell**; use `;` or `cmd /c "command1 && command2"`.
- When running `npm run build`, kill any running `vite preview` daemon background tasks first, otherwise Windows file locks on `dist/` will cause build errors.

---

## C. Completed Work

### 1. Memory Burst Studio (`/tools/audio-to-video-studio?tab=memoryburst`)
- **Status:** **Completed, Tested, Built & Deployed** (Commit `1a12ec2`).
- **Files Created / Modified:**
  - `src/lib/memoryBurst/memoryBurstTypes.ts`: Full type definitions and default configuration (`DEFAULT_MEMORY_BURST_CONFIG`).
  - `src/lib/memoryBurst/memoryBurstBeatDetector.ts`: Web Audio API spectral transient & sub-band energy onset detector with adaptive baseline and tempo fallback.
  - `src/lib/memoryBurst/memoryBurstSequencer.ts`: Timeline scheduler for all 8 modes, exact aspect-ratio preserving cover-crop math, scale punch, bass micro-shake, BKU Climax acceleration curve, and rhythm zoom.
  - `src/lib/memoryBurst/memoryBurstEngine.ts`: 60 FPS Canvas 2D render pipeline with object URL caching, safe revocation, transitions (`instant-cut`, `smooth-crossfade`, `short-flash`, `scale-punch`, `whip-pan`, `fade-wipe`, `glitch-split`, `film-burn`, `random-shuffle`), and Before/After toggle.
  - `src/lib/memoryBurst/memoryBurstPresets.ts`: 7 curated presets (*Memory Rewind, Pure Neutral, Kinetic Rush, Nostalgic Film, Heavy Bass Strobe, Chill Mood Slide, Rapid Burst Pulse*).
  - `src/imageTools/audioToVideo/MemoryBurstStudioPanel.tsx`: Dedicated dark cinematic editing panel with multi-photo filmstrip, drag-and-drop reordering, replace, clear, shuffle, automatic audio beat analyzer, BKU Climax controls, and Rhythm Cinematic Zoom card.
  - `src/imageTools/AudioToVideoStudioTool.tsx`: Integrated `'memoryburst'` tab, top-bar quick switch pill, and studio dock tab.
  - `src/lib/audioToVideo/audioToVideoRenderEngine.ts`: Render pipeline branch for `config.memoryBurst?.enabled`.
  - `src/lib/audioToVideo/types.ts`: Added `memoryBurst?: MemoryBurstStudioConfig` to `StudioCompositionConfig`.
  - `tests/memory-burst.test.ts`: 11 automated unit tests verifying defaults, presets, crop ratios, sequence progression, beat fallback, BKU acceleration, and rhythm zoom.

### 2. SonicCam 3D Studio (`/tools/audio-to-video-studio?tab=soniccam`)
- **Status:** **Completed, Tested & Deployed**.
- **Files:** `src/lib/sonicCam/`, `src/imageTools/audioToVideo/SonicCamStudioPanel.tsx`.
- Single-photo beat-synced multi-region camera motion studio with 24 cinematic transitions, dynamic auto-cycling, bass shake, inner motion, and 9 curated presets.

### 3. Portal VFX Studio (`/tools/audio-to-video-studio?tab=portal`)
- **Status:** **Completed & Deployed**.
- Procedural audio-reactive interdimensional portal VFX with particle shockwaves, energy flow, and interior scene rendering.

### 4. 2.5D Photo Motion & Mask Studio (`/tools/audio-to-video-studio?tab=photomotion`)
- **Status:** **Completed & Deployed**.
- Parallax depth simulation with canvas brush masking, foreground/background separation, and directional camera motion.

### 5. Music-Grown Garden Studio (`/tools/audio-to-video-studio?tab=garden`)
- **Status:** **Completed & Deployed**.
- 6 photorealistic botanical garden scenes with audio-reactive blooming flowers, glowing stardust pollen, and ambient lighting.

---

## D. Current Work in Progress

### Latest Working State
- **Branch:** `main`
- **Head Commit:** `1a12ec2 style(memoryburst): use clean English title Rhythm Cinematic Zoom without Malayalam subtitle`
- **Working Tree:** Clean (all files committed and pushed).
- **Vercel Deployment:** Automatically building/deployed from commit `1a12ec2`.
- **Known Bugs / Errors:** None. All 31 test suites pass 100%, and SEO audit passes 60/60 checks.

---

## E. Feature Breakdown: Memory Burst Studio

When continuing work on Memory Burst Studio, preserve these exact features and behaviors:

### 1. Multi-Photo Filmstrip & Order
- Supports multiple JPG, PNG, and WebP files uploaded at once via drag-and-drop or file picker.
- Reorder photos dynamically using drag-and-drop or **Move Left / Move Right** buttons.
- Photo controls: Replace photo, Remove photo, Clear all, Add more, and Random Shuffle.
- Memory safety: Image object URLs are tracked and explicitly revoked with `URL.revokeObjectURL()` upon replacement or removal.

### 2. Automatic Beat-Synchronized Cutting
- Web Audio API analyzes audio tracks (`audioTrack.url || '/audio/default-studio-track.mp3'`) using sub-band bass energy analysis.
- When beats are detected, photo cuts align **strictly to musical rhythm onset markers**.
- Fallback protection: If audio analysis is unavailable or silent, the sequencer automatically generates algorithmic musical tempo beats (e.g., 120 BPM = 0.4s – 0.5s intervals) rather than dropping to a static timer.
- Manual marker editing: Users can tap `"Tap Beat Marker"` at the current playhead or clear markers.
- Manual re-analysis: A prominent `"Analyze Music Beats"` button allows users to re-run detection after adjusting the sensitivity slider.

### 3. BKU Climax / Memory Rewind Mode
- Inspired by dramatic, viral Indian cinema climax flashback sequences (rapid memory rewind).
- **Climax Window:** Configurable `startSec` and `burstDurationSec` (default 8.0s), with a `"Set to Current Playhead"` shortcut.
- **Rhythmic Acceleration:** Cut intervals shrink progressively from $\sim 0.36\text{s}$ down to $\sim 0.08\text{s}$ as the music reaches its peak climax.
- **Sequence Ordering:**
  - `Reverse (Rewind)`: Flashback sequence moving from recent photos backwards to the oldest.
  - `Forward`: Sequential order.
  - `Shuffle`: Random memory flash.
  - `Custom`: Exact order in the filmstrip.
- **Emotional Hold Frames:**
  - `Intro Hold Frame`: Holds the initial photo before the rapid burst triggers (default 2.0s).
  - `Ending Hold Frame`: Holds the final emotional climax photo after the montage ends (default 3.0s).

### 4. Rhythm-Synced Cinematic Zoom
- Breathes and pulses in real-time with bass and kick drum audio energy.
- **Toggleable:** Has an explicit **ON / OFF** toggle switch so users can easily disable it if they prefer static framing.
- **Styles:** `Rhythm Pulse` (bass/sub-bass bounce), `Cinematic Push` (smooth Ken Burns drift + beat bounce), `Beat Kick` (sharp kick punch).
- **Controls:** Intensity slider (10% – 100%), Max Zoom slider (1.02x – 1.15x), and live visual beat reaction meter.

### 5. Visual Transitions & FX
- Transitions: `Instant Cut`, `Smooth Crossfade`, `Fade Wipe` (directional feathered wipe), `Short Flash`, `Scale Punch` ($105\% \to 100\%$), `Whip Pan`, `Glitch Split`, `Film Burn`, `Random Shuffle`.
- Optional effects: Bass Micro-Shake, White/Warm Flash Cut, Scale Punch.
- **STRICT RULE:** All visual effects start **OFF by default** on initial launch.

---

## F. SEO and Production Safety

### 1. Critical SEO Configurations
- Production Domain: `https://indiatools-rho.vercel.app`
- Sitemap: `public/sitemap.xml` contains exactly **217 URLs**.
- Robots: `public/robots.txt` (`User-agent: *`, `Allow: /`, pointing to absolute HTTPS sitemap).
- Verification Files:
  - `public/google11a4b4cf825c95a6.html` (Google Search Console — DO NOT DELETE)
  - `public/google11a4b4cf825c95a6 (1).html`
  - `public/BingSiteAuth.xml` (Bing Webmaster Tools — DO NOT DELETE)
- Prohibited Test Domains: The automated SEO audit script (`scripts/seo-audit.cjs`) strictly prohibits dummy placeholder domains and local dev URLs anywhere in the codebase (including unit test files). Always use `https://indiatools-rho.vercel.app` or relative paths for test dummy data.

### 2. Verification Scripts
Before any commit or push, run:
```powershell
# 1. TypeScript compilation check
cmd /c npx tsc --noEmit

# 2. Run all 31 unit test suites
node scripts/run-all-tests.cjs

# 3. Run production SEO & cleanliness audit (must pass 60/60 checks)
node scripts/seo-audit.cjs

# 4. Production build test (Vite build + 217-page static prerender)
cmd /c npm run build
```

---

## G. Git and Deployment State

- **Current Git Branch:** `main`
- **Latest Commit Hash:** `79f8704`
- **Latest Commit Subject:** `feat(hybrid-video): add music-reactive VFX panel, beat-synced transitions, and 8 presets`
- **Remote Origin:** Repository origin on GitHub (`https://github.com/vijeshpr/indiatools.git`).
- **Working Tree:** Clean (all files committed and pushed to `origin/main`).
- **Live Vercel Production URL:** `https://indiatools-rho.vercel.app/tools/hybrid-video-studio`
- **Total Tools in Registry:** 70 Tools (all 34 test suites passing 100%, 60/60 SEO checks passing, 218 prerendered pages).

---

## H. Exact Next Steps for the Next Assistant

1. **Verify Workspace State:**
   - Run `git status` to verify clean working tree.
   - Run `cmd /c npx tsc -b` to confirm TypeScript health.
2. **Launch Local Preview (if testing):**
   - Run `cmd /c npx vite preview --port 4173 --host` as a background task.
   - Access preview on local port 4173: `/tools/hybrid-video-studio`.
3. **If User Requests New Features or Tweaks:**
   - Follow all permanent rules in Section B.
   - Ensure all optional decorative effects remain OFF by default.
   - Keep UI labels strictly in English.
   - Run the verification scripts (`npx tsc -b`, `run-all-tests.cjs`, `seo-audit.cjs`, `npm run build`).
   - Push to `origin/main` to update the production website on Vercel as instructed.

---

*Handover document successfully generated on 2026-10-22.*
