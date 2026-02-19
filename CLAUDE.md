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

Before writing any non-trivial Remotion code, read the relevant rule files from `.claude/skills/remotion-best-practices/rules/`. Consult `.claude/skills/remotion-best-practices/SKILL.md` for which file covers which topic. Use rule files for patterns and gotchas; use the `mcp__remotion-documentation__remotion-documentation` MCP tool for quick API lookups (imports, signatures, props).

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

## Subagents (`.claude/agents/`)

Custom agents are defined as markdown files in `.claude/agents/`. Claude Code auto-discovers them via `/agents`.

| Agent | Model | When to use |
|---|---|---|
| **composition-designer** | sonnet | Building or modifying compositions — researches APIs, designs structure, writes code, sets up media, installs packages |
| **render-debugger** | sonnet | Diagnosing render failures — reads code + docs, identifies root cause, provides fix |

---

## Orchestration Playbook

### Build a New Composition

```
User request
  ├── composition-designer (researches, designs, writes complete code)
  ├── Orchestrator registers in Root.tsx
  └── Orchestrator renders still via background Bash
```

### Multi-Composition Project

Spawn one **composition-designer** per composition in parallel. Register all in Root.tsx. Render stills sequentially (one at a time).

### Quick Iteration

```
User feedback → Edit code directly → Bash render still (background) → Show preview → Repeat
```

### Debug a Broken Render

```
Render fails → render-debugger (reads code + searches docs) → Fix applied → Bash render (retry)
```

### Orchestration Rules

1. **Research before code** — Dispatch `composition-designer` for non-trivial Remotion work.
2. **Renders run in background** — Use `Bash(run_in_background: true)` for all renders.
3. **One render at a time** — Remotion saturates system resources per render.
4. **Version lock** — All `@remotion/*` packages must be `4.0.399`.
5. **Sequential registration** — Write the component file BEFORE adding its `<Composition>` to Root.tsx.
6. **Still before full render** — Render a still at a key frame first. Full video only when the user is satisfied.
7. **Package check** — Verify `package.json` before using optional `@remotion/*` packages.

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
