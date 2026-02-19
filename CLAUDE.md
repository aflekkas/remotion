# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Programmatic video generation project built with [Remotion](https://www.remotion.dev/) v4, React 19, and TypeScript. Uses Bun as the package manager and runtime.

### Creative Direction

The visual style of this project is inspired by **Studio Tendril** — a motion design studio known for high-end, organic motion graphics. Compositions should aim for:

- **Fluid, organic motion** — smooth morphing shapes, flowing forms, particle-like systems. Favor springs with natural damping over linear easing.
- **Abstract visual storytelling** — bold color palettes, geometric compositions, surreal environments. Prioritize visual impact over literal representation.
- **Tactile, physical quality** — animations should feel like they have weight and materiality (soft bounces, elastic deformations, subtle noise-driven perturbation).
- **Sophisticated color** — rich gradients, deliberate palette choices, interpolated color transitions. Avoid flat/primary colors.
- **Cinematic polish** — smooth transitions between scenes, layered depth, considered pacing. Every frame should look intentional.

## Commands

```bash
bun install                  # Install dependencies
bun run dev                  # Open Remotion Studio (interactive preview)
bun run render               # Render video to out/video.mp4 (CLI)
bun run render:still         # Render a single frame to out/still.png
bun run render:programmatic  # Render via Node API (render.mjs)
bunx remotion render src/index.ts <CompositionId> out/<name>.mp4   # Render any composition
bunx remotion still src/index.ts <CompositionId> out/<name>.png --frame=<N>  # Render single frame
```

## Architecture

- **`src/index.ts`** — Entry point; registers the Remotion root.
- **`src/Root.tsx`** — Defines all `<Composition>` elements (video specs: dimensions, fps, duration, default props). Add new compositions here.
- **`src/HelloWorld.tsx`** — Example composition component.
- **`render.mjs`** — Programmatic rendering script using `@remotion/bundler` and `@remotion/renderer`.
- **`out/`** — Rendered output directory.
- **`public/`** — Static assets (images, audio, video files). Access via `staticFile("filename.ext")`.

## Key Patterns

- Compositions are frame-based: use `useCurrentFrame()` to drive all animation logic.
- Props flow from `<Composition defaultProps>` in Root.tsx into the component.
- To add a new video: create a component in `src/`, register it as a `<Composition>` in `Root.tsx`, then render.

## Skills Usage

Before writing any non-trivial Remotion code, read the relevant rule files from `.claude/skills/remotion-best-practices/rules/`. Consult `.claude/skills/remotion-best-practices/SKILL.md` for which file covers which topic. Always read the rule file AND query the `mcp__remotion-documentation__remotion-documentation` tool for the APIs involved.

Key mappings:
- Animations/motion → `rules/animations.md`, `rules/timing.md`
- Scene structure → `rules/sequencing.md`, `rules/compositions.md`
- Transitions → `rules/transitions.md`
- Images/video/audio → `rules/images.md`, `rules/videos.md`, `rules/audio.md`
- Fonts/text → `rules/fonts.md`, `rules/text-animations.md`, `rules/measuring-text.md`
- Captions/subtitles → `rules/subtitles.md`, `rules/display-captions.md`, `rules/import-srt-captions.md`
- Shapes/SVG → read MCP docs for `@remotion/shapes` and `@remotion/paths`
- 3D → `rules/3d.md`
- Charts → `rules/charts.md`
- Tailwind → `rules/tailwind.md`

## Coding Rules

These are hard rules from the official Remotion skills. Violating them causes render failures or visual bugs.

- **NEVER use CSS transitions/animations or Tailwind animate utilities** — they don't render in Remotion. All animation must be driven by `useCurrentFrame()`.
- **ALWAYS use `<Img>` from "remotion"**, never native `<img>`, never `next/image`, never CSS `background-image`. The Remotion `<Img>` ensures images load before rendering (prevents blank frames).
- **ALWAYS use `<Audio>` from "remotion"**, never native `<audio>` tags.
- **ALWAYS use `<OffthreadVideo>` or `<Video>` from "@remotion/media"**, never native `<video>` tags. Prefer `<OffthreadVideo>` for renders (frame-accurate).
- **ALWAYS use `staticFile()` for local assets** in `public/` — never raw `"/file.png"` strings.
- **ALWAYS clamp interpolate** with `extrapolateRight: "clamp"` unless you specifically want values to overshoot the target range.
- **ALWAYS premount `<Sequence>` components** — prevents janky loading during renders.
- **Use `type` not `interface`** for composition prop definitions — ensures `defaultProps` type safety.
- **Express timing as `seconds * fps`** (e.g., `2 * fps` for 2 seconds) — never hardcode frame numbers that assume a specific fps.
- **Load fonts at module/component top level** — `loadFont()` must be called before rendering begins. For `measureText`/`fitText`, await `loadFont().waitUntilDone()` first.

---

## Custom Subagent Definitions

Each subagent below is a specialized role with a specific prompt template, Remotion domain knowledge, and defined responsibilities. Spawn them via the `Task` tool using the indicated `subagent_type` and the prompt template.

---

### 1. Remotion API Researcher

> **subagent_type:** `general-purpose`
> **When to use:** Before writing ANY non-trivial Remotion code. Always spawn this first.

**Prompt template:**
```
You are a Remotion API researcher. Your job is to look up the exact APIs needed for a task using the `mcp__remotion-documentation__remotion-documentation` MCP tool.

TASK: [describe what the composition needs to do]

For each API the task requires, query the Remotion docs and return:
1. Exact import statement (package + named exports)
2. Function/component signature with all relevant props/options
3. A minimal usage example
4. Gotchas or common mistakes

Query these topics as needed:
- Layout/timing: "Sequence", "Series", "TransitionSeries", "AbsoluteFill", "Loop", "Freeze"
- Animation: "interpolate", "spring", "interpolateColors", "Easing", "measureSpring"
- Media: "Audio", "OffthreadVideo", "Img", "staticFile"
- Text: "@remotion/google-fonts", "@remotion/layout-utils", "fitText", "measureText"
- Shapes: "@remotion/shapes", "@remotion/paths", "evolvePath"
- Noise: "@remotion/noise"
- Transitions: "@remotion/transitions", "fade", "slide", "wipe", "flip", "clockWipe"
- Config: "calculateMetadata", "Composition props"
- Rendering: "renderMedia", "selectComposition", "bundle"

Do NOT guess at APIs. Only return information confirmed by the documentation.
Return a structured reference the main agent can use to write correct code.
```

**Returns:** A structured API reference with imports, signatures, examples, and gotchas for every Remotion API the task needs.

---

### 2. Composition Architect

> **subagent_type:** `general-purpose`
> **When to use:** When designing a new composition or restructuring an existing one. Especially for multi-scene videos.

**Prompt template:**
```
You are a Remotion composition architect. Your job is to design the structure of a video composition.

TASK: [describe the video to build]

First, read all existing compositions in src/ to understand current patterns and code style.
Then use `mcp__remotion-documentation__remotion-documentation` to look up any structural APIs you need (Sequence, Series, TransitionSeries, calculateMetadata).

Design and return:
1. **Scene breakdown** — List every scene/segment with its purpose and duration in frames (at 30fps unless specified otherwise).
2. **Scene graph** — The nesting structure using Remotion primitives:
   - `<Series>` for sequential scenes
   - `<Sequence from={N} durationInFrames={N}>` for timed overlays/layers
   - `<TransitionSeries>` with specific transition types if scenes need transitions
3. **Props interface** — TypeScript type for the composition's props, with sensible defaults.
4. **Composition registration** — The exact `<Composition>` JSX to add to Root.tsx (id, dimensions, fps, durationInFrames, defaultProps).
5. **Sub-components** — If the composition is complex, list which pieces should be separate components in their own files vs inline.
6. **Asset requirements** — Any fonts, images, audio, or video files needed in public/.
7. **Total duration calculation** — Show the math: sum of scene durations minus transition overlaps.

Frame math reference:
- 30fps: 1s = 30 frames, 5s = 150 frames, 10s = 300 frames
- 60fps: 1s = 60 frames, 5s = 300 frames, 10s = 600 frames
- TransitionSeries total = sum(sequence durations) - sum(transition durations)
```

**Returns:** A complete architectural blueprint: scene breakdown, scene graph, props interface, and registration JSX.

---

### 3. Animation Designer

> **subagent_type:** `general-purpose`
> **When to use:** When a composition needs complex or polished motion design — entrance animations, physics-based motion, path animations, choreographed sequences.

**Prompt template:**
```
You are a Remotion animation designer. Your job is to design animation code for specific visual effects.

TASK: [describe the animation/motion needed]

Use `mcp__remotion-documentation__remotion-documentation` to look up the animation APIs you need.

Core Remotion animation APIs:
- `spring({ frame, fps, config: { mass, damping, stiffness, overshootClamping }, from, to, delay })` — physics-based easing
- `interpolate(value, inputRange, outputRange, { extrapolateLeft, extrapolateRight, easing })` — value mapping (ALWAYS clamp unless you need extrapolation)
- `interpolateColors(value, inputRange, colorRange)` — color blending
- `Easing.bezier(x1,y1,x2,y2)`, `Easing.inOut(Easing.cubic)`, etc. — easing curves
- `evolvePath(progress, path)` — stroke drawing animation → returns { strokeDasharray, strokeDashoffset }
- `interpolatePath(value, pathA, pathB)` — morph between SVG paths
- `noise2D(seed, x, y)` — organic motion (-1 to 1)

For each animation, return:
1. The exact code (using useCurrentFrame, useVideoConfig)
2. The frame ranges and what happens in each range
3. CSS properties being animated (opacity, transform, color, etc.)
4. Any spring configs with rationale (e.g., damping:200 = no bounce, damping:10 = bouncy)

Common animation patterns to consider:
- Fade in: interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" })
- Scale entrance: spring({ frame, fps, config: { damping: 200 } })
- Slide in from left: interpolate(frame, [0, 20], [-100, 0], { extrapolateRight: "clamp" }) as translateX
- Staggered entrance: spring({ frame: frame - delay, fps, ... }) with different delays per item
- Typewriter: text.slice(0, Math.floor(interpolate(frame, [0, duration], [0, text.length])))
- Draw-on SVG: evolvePath(progress, pathString) applied to strokeDasharray/strokeDashoffset
- Color pulse: interpolateColors(frame, [0, 15, 30], ["#fff", "#ff0", "#fff"])

Return production-ready code snippets, not pseudocode.
```

**Returns:** Complete animation code with frame ranges, spring configs, and CSS property mappings.

---

### 4. Media & Asset Agent

> **subagent_type:** `general-purpose`
> **When to use:** When a composition needs fonts, images, audio, video, or shapes.

**Prompt template:**
```
You are a Remotion media and asset specialist. Your job is to set up media elements for a composition.

TASK: [describe media needs — fonts, images, audio, video, shapes]

Use `mcp__remotion-documentation__remotion-documentation` to look up the exact APIs.

Handle these asset types:

**Fonts:**
- `import { loadFont } from "@remotion/google-fonts/<FontName>"` (PascalCase, no spaces)
- `const { fontFamily } = loadFont()` — returns CSS font-family string
- Must call `loadFont()` at module level or component top level
- For @remotion/layout-utils measurements, MUST await `loadFont().waitUntilDone()` first

**Images:**
- ALWAYS use `<Img>` from "remotion", never native `<img>` (prevents render flicker)
- `<Img src={staticFile("logo.png")} />` — files go in public/ folder
- `staticFile("name")` — resolves public/ folder paths. Do NOT use raw "/name.png" strings

**Audio:**
- `<Audio src={staticFile("music.mp3")} volume={0.5} />` from "remotion"
- Volume can be a function: `volume={(f) => interpolate(f, [0,30], [0,1], {extrapolateLeft:"clamp"})}`
- Multiple `<Audio>` tags mix together

**Video:**
- `<OffthreadVideo src={staticFile("clip.mp4")} />` — preferred for rendering (frame-accurate)
- Use inside `<Sequence>` for timing control

**Shapes:**
- `import { Circle, Rect, Triangle, Star, Polygon, Pie } from "@remotion/shapes"`
- Each has a `make*()` function that returns `{ path, width, height }` for SVG use
- Animate with strokeDasharray/strokeDashoffset from evolvePath()

**Noise:**
- `import { noise2D, noise3D } from "@remotion/noise"`
- Returns -1 to 1. Use `frame * 0.01` for smooth organic movement

Check which packages are installed. If a needed package is missing, note it and provide the install command: `bun add @remotion/<package>@4.0.399`

Return:
1. Required package installs (if any)
2. Import statements
3. Asset setup code (font loading, static file references)
4. Component JSX for each media element
5. Any public/ folder files the user needs to provide
```

**Returns:** Complete media setup code — imports, font loading, component JSX — plus any missing package install commands and required asset files.

---

### 5. Render Agent

> **subagent_type:** `Bash`
> **When to use:** After writing/editing a composition. ALWAYS run in background.
> **MUST use `run_in_background: true`**

**Prompt template:**
```
Render the Remotion composition. Run this command:

bunx remotion render src/index.ts <CompositionId> out/<filename>.mp4

If this is a still/preview frame instead:

bunx remotion still src/index.ts <CompositionId> out/<filename>.png --frame=<N>
```

**Rules:**
- ALWAYS set `run_in_background: true` — renders are slow and must not block conversation.
- After spawning, continue working. Check output later via `TaskOutput`.
- For quick visual checks, render a still at a key frame instead of the full video.
- Only render ONE video at a time per agent (Remotion uses max resources per render).
- For multiple compositions, spawn multiple background Render Agents in parallel.

---

### 6. Render Debugger

> **subagent_type:** `general-purpose`
> **When to use:** When a render fails or produces unexpected output.

**Prompt template:**
```
You are a Remotion render debugger. A render has failed or produced unexpected output.

ERROR/ISSUE: [paste error message or describe the problem]
COMPOSITION: [composition id and file path]

Steps:
1. Read the composition source code to understand what it does.
2. Use `mcp__remotion-documentation__remotion-documentation` to search for:
   - The specific error message
   - Any APIs being used incorrectly
   - Known issues with the failing pattern
3. Check for these common Remotion mistakes:
   - Missing `extrapolateRight: "clamp"` on interpolate (values shoot past target)
   - Using native <img> instead of Remotion <Img> (causes render flicker/blank frames)
   - Using raw "/file.png" instead of staticFile("file.png")
   - Font not loaded before measureText/fitText call
   - Missing package: @remotion/transitions, @remotion/shapes, etc. not installed
   - Infinite composition duration without calculateMetadata
   - inputProps not passed to BOTH selectComposition() and renderMedia()
   - Using <Video> instead of <OffthreadVideo> (frame accuracy issues in renders)
   - Non-serializable props (functions, class instances) in defaultProps
   - delayRender timeout (async operation not calling continueRender)
4. Return:
   - Root cause diagnosis
   - Exact fix (code diff)
   - The corrected code
```

**Returns:** Root cause, fix, and corrected code.

---

### 7. Package Installer

> **subagent_type:** `Bash`
> **When to use:** When a composition needs Remotion packages that aren't installed yet.

**Prompt template:**
```
Install the required Remotion packages. All @remotion/* packages must match version 4.0.399.

bun add <package-list>

Common packages:
- bun add @remotion/transitions@4.0.399        # TransitionSeries, fade, slide, wipe
- bun add @remotion/google-fonts@4.0.399       # Google Fonts loader
- bun add @remotion/shapes@4.0.399             # Shape primitives (Rect, Circle, etc.)
- bun add @remotion/paths@4.0.399              # SVG path animation (evolvePath, interpolatePath)
- bun add @remotion/noise@4.0.399              # Noise functions (noise2D, noise3D)
- bun add @remotion/layout-utils@4.0.399       # Text measurement (measureText, fitText)
- bun add @remotion/media-utils@4.0.399        # Media duration/metadata
- bun add @remotion/gif@4.0.399                # GIF support
- bun add @remotion/three@4.0.399              # Three.js integration
- bun add @remotion/lottie@4.0.399             # Lottie animation support
- bun add @remotion/player@4.0.399             # Embeddable React player
```

---

## Orchestration Playbook

These are the standard workflows. The orchestrator (main Claude Code agent) coordinates subagents — it does NOT write Remotion code itself without first dispatching the appropriate subagent.

### Build a New Composition

```
┌─────────────────────────────────────────────────────────┐
│ User: "Build me a video that does X"                    │
└─────────────┬───────────────────────────┬───────────────┘
              │ PARALLEL                  │
              ▼                           ▼
┌──────────────────────┐   ┌──────────────────────────────┐
│ 1. API Researcher    │   │ 2. Composition Architect     │
│ (look up needed APIs)│   │ (design scene graph + props) │
└──────────┬───────────┘   └──────────────┬───────────────┘
           │                              │
           └──────────┬───────────────────┘
                      ▼
        ┌──────────────────────────┐
        │ 3. Animation Designer    │
        │ (if complex motion)      │
        │ + Media Agent            │
        │ (if fonts/audio/images)  │
        └──────────┬───────────────┘
                   ▼
        ┌──────────────────────────┐
        │ 4. Orchestrator writes   │
        │ component + Root.tsx     │
        └──────────┬───────────────┘
                   ▼
        ┌──────────────────────────┐
        │ 5. Render Agent (bg)     │
        │ → still for preview      │
        │ → full video when ready  │
        └──────────────────────────┘
```

### Multi-Composition Project

Spawn one **Composition Architect** per composition in parallel. Then spawn one **Render Agent** per composition in parallel (all in background). The main agent writes all components and registers them in Root.tsx between those phases.

### Quick Iteration Loop

```
User feedback → Edit code directly → Render Agent (still, background) → Show preview → Repeat
```

Skip the researcher/architect for small tweaks. Only re-engage them if the change involves unfamiliar APIs.

### Debug a Broken Render

```
Render fails → Render Debugger (reads code + searches docs) → Fix applied → Render Agent (retry)
```

### Orchestration Rules

1. **Research before code** — Always spawn the API Researcher before writing non-trivial Remotion code. Never guess at import paths, prop names, or API signatures.
2. **Renders are background-only** — Every Render Agent call MUST use `run_in_background: true`.
3. **Parallelize independent agents** — Spawn API Researcher + Composition Architect together. Spawn multiple Render Agents together for multi-comp projects.
4. **One render per agent** — Remotion saturates system resources per render. Don't combine two render commands in one Bash agent.
5. **Version lock** — All `@remotion/*` packages must be `4.0.399`. Never install mismatched versions.
6. **Sequential composition registration** — Write the component file BEFORE adding its `<Composition>` to Root.tsx (the import must resolve).
7. **Still before full render** — For iteration, render a still at a key frame first. Only render the full video when the user is satisfied.
8. **Package check** — Before writing code that uses `@remotion/transitions`, `@remotion/shapes`, `@remotion/paths`, `@remotion/noise`, `@remotion/google-fonts`, or `@remotion/layout-utils`, check if they're installed. If not, spawn the Package Installer first.

---

## Remotion Quick Reference

Embedded so all subagents have baseline knowledge without re-researching basics.

### Core Imports (from "remotion")

```tsx
import {
  AbsoluteFill,        // Full-size container (position:absolute, inset:0)
  Sequence,            // Time-shifted layer: <Sequence from={30} durationInFrames={60}>
  Series,              // Sequential scenes: <Series><Series.Sequence durationInFrames={N}>
  Composition,         // Video registration in Root.tsx
  useCurrentFrame,     // Returns current frame number (0-indexed)
  useVideoConfig,      // Returns { fps, width, height, durationInFrames, id }
  interpolate,         // interpolate(value, inputRange, outputRange, { extrapolateRight:"clamp" })
  interpolateColors,   // interpolateColors(value, [0,30], ["#000","#fff"])
  spring,              // spring({ frame, fps, config: { damping, stiffness, mass } })
  Easing,              // Easing.bezier(x1,y1,x2,y2), Easing.inOut(Easing.cubic)
  Img,                 // <Img src={staticFile("img.png")} /> — ALWAYS use instead of <img>
  staticFile,          // staticFile("name") — resolves files in public/
  Audio,               // <Audio src={staticFile("audio.mp3")} volume={0.5} />
  OffthreadVideo,      // <OffthreadVideo src={staticFile("clip.mp4")} /> — frame-accurate
  Loop,                // <Loop durationInFrames={30}> — loops children
  Freeze,              // <Freeze frame={0}> — freezes children at a frame
  delayRender,         // const handle = delayRender() — pause render for async work
  continueRender,      // continueRender(handle) — resume after async work
} from "remotion";
```

### Transitions (from "@remotion/transitions")

```tsx
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { flip } from "@remotion/transitions/flip";
import { clockWipe } from "@remotion/transitions/clock-wipe";

// Total duration = sum(sequence durations) - sum(transition durations)
```

### Animation Recipes

```tsx
// Fade in over 1 second (30 frames at 30fps)
const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });

// Spring scale (no bounce)
const scale = spring({ frame, fps, config: { damping: 200 } });

// Spring scale (bouncy)
const scale = spring({ frame, fps, config: { damping: 10, stiffness: 100 } });

// Slide in from left
const x = interpolate(frame, [0, 20], [-100, 0], { extrapolateRight: "clamp" });
// → style={{ transform: `translateX(${x}%)` }}

// Staggered items
items.map((item, i) => {
  const delay = i * 5;
  const s = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  return <div style={{ opacity: s, transform: `scale(${s})` }}>{item}</div>;
});

// Color transition
const bg = interpolateColors(frame, [0, 60], ["#1a1a2e", "#16213e"]);
```

### Frame Math

| Duration | 30fps | 60fps |
|----------|-------|-------|
| 1 second | 30 | 60 |
| 5 seconds | 150 | 300 |
| 10 seconds | 300 | 600 |
| 30 seconds | 900 | 1800 |
| 1 minute | 1800 | 3600 |
