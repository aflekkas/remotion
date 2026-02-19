import React from 'react';
import {
	AbsoluteFill,
	Sequence,
	interpolate,
	interpolateColors,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {noise2D} from '@remotion/noise';
import {fontPresets} from '../load-fonts';
import '../load-fonts';

// ─── Palette ────────────────────────────────────────────────────────────────
const C = {
	black:     '#0a0a0a',
	charcoal:  '#1a1a1a',
	charcoalM: '#141414',
	gold:      '#c8a45c',
	goldBright:'#d4a847',
	steel:     '#8a9bb0',
	white:     '#f0f0f0',
	offwhite:  '#d8d8d8',
} as const;

// ─── Spring configs ──────────────────────────────────────────────────────────
const SP_HEAVY   = {damping: 180, stiffness: 90,  mass: 1.2}; // weighty entrance
const SP_SHARP   = {damping: 200, stiffness: 120, mass: 1.0}; // controlled, no bounce
const SP_REVEAL  = {damping: 160, stiffness: 80,  mass: 1.0}; // smooth reveal

// ─── Shared helpers ──────────────────────────────────────────────────────────

/** Thin gold horizontal rule */
const GoldRule: React.FC<{
	width: number | string;
	opacity?: number;
	marginTop?: number;
}> = ({width, opacity = 1, marginTop = 0}) => (
	<div
		style={{
			width,
			height: 2,
			background: `linear-gradient(90deg, ${C.gold} 0%, ${C.goldBright} 60%, transparent 100%)`,
			marginTop,
			opacity,
			borderRadius: 1,
		}}
	/>
);

/** Subtle grain texture overlay — driven by frame noise */
const GrainOverlay: React.FC<{frame: number}> = ({frame}) => {
	// Grain flickers across frames via noise
	const grainOpacity = interpolate(
		noise2D('grain-master', frame * 0.18, 0.5),
		[-1, 1],
		[0.018, 0.045],
		{extrapolateRight: 'clamp'},
	);

	return (
		<AbsoluteFill
			style={{
				pointerEvents: 'none',
				zIndex: 100,
				opacity: grainOpacity,
				background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
				backgroundSize: '256px 256px',
				mixBlendMode: 'overlay',
			}}
		/>
	);
};

/** Drifting geometric scaffold lines */
const ScaffoldLines: React.FC<{frame: number; opacity?: number}> = ({
	frame,
	opacity = 1,
}) => {
	const lines = [
		{x1: 0.12, y1: 0,    x2: 0.12, y2: 1,    speed: 0.00008, seed: 'v1'},
		{x1: 0.88, y1: 0,    x2: 0.88, y2: 1,    speed: 0.00010, seed: 'v2'},
		{x1: 0,    y1: 0.22, x2: 1,    y2: 0.22,  speed: 0.00006, seed: 'h1'},
		{x1: 0,    y1: 0.78, x2: 1,    y2: 0.78,  speed: 0.00009, seed: 'h2'},
		{x1: 0,    y1: 0.50, x2: 1,    y2: 0.50,  speed: 0.00005, seed: 'h3'},
	];

	return (
		<AbsoluteFill style={{pointerEvents: 'none', zIndex: 1}}>
			<svg
				width="100%"
				height="100%"
				style={{position: 'absolute', inset: 0, opacity: opacity * 0.12}}
			>
				{lines.map((l) => {
					const drift = noise2D(l.seed, frame * l.speed, 0) * 0.015;
					const isVertical = l.x1 === l.x2;
					const x1Pct = isVertical ? (l.x1 + drift) * 100 : l.x1 * 100;
					const x2Pct = isVertical ? (l.x2 + drift) * 100 : l.x2 * 100;
					const y1Pct = !isVertical ? (l.y1 + drift) * 100 : l.y1 * 100;
					const y2Pct = !isVertical ? (l.y2 + drift) * 100 : l.y2 * 100;

					return (
						<line
							key={l.seed}
							x1={`${x1Pct}%`}
							y1={`${y1Pct}%`}
							x2={`${x2Pct}%`}
							y2={`${y2Pct}%`}
							stroke={C.steel}
							strokeWidth="1"
						/>
					);
				})}
			</svg>
		</AbsoluteFill>
	);
};

/** Pulsing radial vignette */
const Vignette: React.FC<{frame: number; intensity?: number}> = ({
	frame,
	intensity = 1,
}) => {
	const pulse = interpolate(
		noise2D('vig-pulse', frame * 0.006, 0),
		[-1, 1],
		[0.7, 1.0],
		{extrapolateRight: 'clamp'},
	);

	return (
		<AbsoluteFill
			style={{
				background: `radial-gradient(ellipse 70% 85% at 50% 50%, transparent 30%, rgba(0,0,0,${0.72 * pulse * intensity}) 100%)`,
				pointerEvents: 'none',
				zIndex: 2,
			}}
		/>
	);
};

// ─── Scene 1: Hook ────────────────────────────────────────────────────────────

const HOOK_WORDS = ['YOUR', 'POTENTIAL', 'IS', 'WASTED'];

const Scene1Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Background gradient shift
	const bgColor = interpolateColors(
		frame,
		[0, 2 * fps],
		[C.black, C.charcoal],
	);

	// Subtle radial glow behind text — animates in
	const glowOpacity = interpolate(frame, [0, 1.5 * fps], [0, 0.25], {
		extrapolateRight: 'clamp',
	});

	// Scene exit fade (last 0.6s)
	const sceneExitOpacity = interpolate(
		frame,
		[2 * fps, 2.5 * fps],
		[1, 0],
		{extrapolateRight: 'clamp'},
	);

	return (
		<AbsoluteFill style={{background: bgColor, overflow: 'hidden'}}>
			{/* Warm glow behind text */}
			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse 60% 40% at 50% 50%, rgba(200,164,92,${glowOpacity}) 0%, transparent 70%)`,
					pointerEvents: 'none',
				}}
			/>

			<Vignette frame={frame} intensity={1.2} />
			<ScaffoldLines frame={frame} opacity={sceneExitOpacity} />

			{/* Word-by-word stagger */}
			<AbsoluteFill
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					opacity: sceneExitOpacity,
					gap: 0,
				}}
			>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: 4,
					}}
				>
					{HOOK_WORDS.map((word, i) => {
						const delay = i * Math.round(0.12 * fps);
						const wordSpring = spring({
							frame: frame - delay,
							fps,
							config: SP_HEAVY,
						});

						const translateY = interpolate(wordSpring, [0, 1], [60, 0], {
							extrapolateRight: 'clamp',
						});
						const wordOpacity = interpolate(wordSpring, [0, 0.3], [0, 1], {
							extrapolateRight: 'clamp',
						});
						const scaleX = interpolate(wordSpring, [0, 1], [0.92, 1], {
							extrapolateRight: 'clamp',
						});

						// "WASTED" gets gold accent
						const isAccent = word === 'WASTED';

						return (
							<div
								key={word}
								style={{
									...fontPresets.extraTight,
									fontSize: isAccent ? 148 : 118,
									fontWeight: 900,
									color: isAccent ? C.gold : C.white,
									transform: `translateY(${translateY}px) scaleX(${scaleX})`,
									opacity: wordOpacity,
									lineHeight: 0.92,
									textTransform: 'uppercase',
									letterSpacing: '-0.055em',
								}}
							>
								{word}
							</div>
						);
					})}

					{/* Gold accent line beneath */}
					{(() => {
						const lineDelay = HOOK_WORDS.length * Math.round(0.12 * fps) + Math.round(0.1 * fps);
						const lineSpring = spring({
							frame: frame - lineDelay,
							fps,
							config: SP_SHARP,
						});
						const lineWidth = interpolate(lineSpring, [0, 1], [0, 280], {
							extrapolateRight: 'clamp',
						});
						const lineOpacity = interpolate(lineSpring, [0, 0.5], [0, 1], {
							extrapolateRight: 'clamp',
						});
						return (
							<div style={{marginTop: 24}}>
								<GoldRule width={lineWidth} opacity={lineOpacity} />
							</div>
						);
					})()}
				</div>
			</AbsoluteFill>

			<GrainOverlay frame={frame} />
		</AbsoluteFill>
	);
};

// ─── Scene 2: Transformation Pillars ─────────────────────────────────────────

const PILLARS = [
	'PHYSIQUE',
	'PRESENCE',
	'STYLE',
	'DISCIPLINE',
	'STANDARDS',
] as const;

// Each pillar: hold duration in seconds
const PILLAR_HOLD    = 0.72; // seconds each word is fully visible
const PILLAR_IN_DUR  = 0.30; // seconds to enter
const PILLAR_OUT_DUR = 0.22; // seconds to exit
const PILLAR_STEP    = PILLAR_HOLD + PILLAR_IN_DUR + PILLAR_OUT_DUR;

const PillarWord: React.FC<{
	word: string;
	startFrame: number;
	frame: number;
	fps: number;
}> = ({word, startFrame, frame, fps}) => {
	const local = frame - startFrame;
	const inDur  = Math.round(PILLAR_IN_DUR * fps);
	const holdEnd = Math.round((PILLAR_IN_DUR + PILLAR_HOLD) * fps);
	const totalDur = Math.round(PILLAR_STEP * fps);

	// Slide-in from right with spring
	const inSpring = spring({
		frame: local,
		fps,
		config: SP_HEAVY,
		durationInFrames: inDur,
	});

	// Exit: translate left + fade out
	const outProgress = interpolate(
		local,
		[holdEnd, holdEnd + Math.round(PILLAR_OUT_DUR * fps)],
		[0, 1],
		{extrapolateRight: 'clamp', extrapolateLeft: 'clamp'},
	);

	const slideInX  = interpolate(inSpring, [0, 1], [120, 0], {extrapolateRight: 'clamp'});
	const slideOutX = interpolate(outProgress, [0, 1], [0, -80], {extrapolateRight: 'clamp'});
	const fadeIn    = interpolate(inSpring, [0, 0.25], [0, 1], {extrapolateRight: 'clamp'});
	const fadeOut   = interpolate(outProgress, [0, 1], [1, 0], {extrapolateRight: 'clamp'});

	const translateX = slideInX + slideOutX;
	const opacity    = Math.min(fadeIn, fadeOut);
	const isVisible  = local >= 0 && local < totalDur + Math.round(0.1 * fps);

	if (!isVisible) return null;

	// Small gold geometric accent — thin vertical bar to the left of word
	const accentScale = spring({
		frame: local,
		fps,
		config: SP_SHARP,
		durationInFrames: Math.round(0.25 * fps),
	});
	const accentHeight = interpolate(accentScale, [0, 1], [0, 80], {extrapolateRight: 'clamp'});

	return (
		<div
			style={{
				position: 'absolute',
				left: 0,
				right: 0,
				top: 0,
				bottom: 0,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 28,
				transform: `translateX(${translateX}px)`,
				opacity,
			}}
		>
			{/* Gold accent bar */}
			<div
				style={{
					width: 3,
					height: accentHeight,
					background: `linear-gradient(180deg, transparent 0%, ${C.gold} 40%, ${C.goldBright} 60%, transparent 100%)`,
					borderRadius: 2,
					flexShrink: 0,
				}}
			/>

			<div
				style={{
					...fontPresets.extraTight,
					fontSize: 130,
					fontWeight: 800,
					color: C.white,
					letterSpacing: '-0.055em',
					lineHeight: 1.0,
					textTransform: 'uppercase',
				}}
			>
				{word}
			</div>
		</div>
	);
};

const Scene2Pillars: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Slow background gradient shift through deep tones
	const bgColor = interpolateColors(
		frame,
		[0, 2 * fps, 4 * fps],
		[C.charcoal, C.charcoalM, C.black],
	);

	// Scene fade in
	const sceneIn = interpolate(frame, [0, Math.round(0.5 * fps)], [0, 1], {
		extrapolateRight: 'clamp',
	});

	// Subtle geometric abstract shapes in background
	const rectOpacity = interpolate(frame, [0, fps], [0, 0.06], {
		extrapolateRight: 'clamp',
	});

	const stepFrames = Math.round(PILLAR_STEP * fps);

	return (
		<AbsoluteFill style={{background: bgColor, overflow: 'hidden', opacity: sceneIn}}>
			{/* Abstract background rectangles — slow drift */}
			<AbsoluteFill style={{pointerEvents: 'none', opacity: rectOpacity}}>
				{[
					{x: 5,  y: 15, w: 1, h: 70, seed: 'r1'},
					{x: 94, y: 25, w: 1, h: 50, seed: 'r2'},
					{x: 10, y: 60, w: 80, h: 0.12, seed: 'r3'},
					{x: 15, y: 35, w: 70, h: 0.12, seed: 'r4'},
				].map((r) => {
					const driftX = noise2D(r.seed + 'x', frame * 0.0004, 0) * 2;
					const driftY = noise2D(r.seed + 'y', frame * 0.0004, 0) * 2;
					return (
						<div
							key={r.seed}
							style={{
								position: 'absolute',
								left:   `${r.x + driftX}%`,
								top:    `${r.y + driftY}%`,
								width:  `${r.w}%`,
								height: `${r.h}%`,
								background: C.steel,
							}}
						/>
					);
				})}
			</AbsoluteFill>

			<Vignette frame={frame} intensity={1.4} />
			<ScaffoldLines frame={frame} opacity={0.7} />

			{/* Pillar words — one at a time */}
			<AbsoluteFill>
				{PILLARS.map((word, i) => (
					<PillarWord
						key={word}
						word={word}
						startFrame={i * stepFrames}
						frame={frame}
						fps={fps}
					/>
				))}
			</AbsoluteFill>

			<GrainOverlay frame={frame} />
		</AbsoluteFill>
	);
};

// ─── Scene 3: Brand Reveal ────────────────────────────────────────────────────

const Scene3Brand: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Total scene is ~4s = 120 frames at 30fps
	// Timing map:
	//   0  – 0.8s: "ENGINEERED SELF-UPGRADE" fades in
	//   0.8– 1.6s: hold
	//   1.6– 2.0s: tagline fades out
	//   1.8– 2.4s: "CLAVICULAR" springs in
	//   2.4– 3.0s: hold
	//   2.8– 3.4s: CTA fades in
	//   3.0– end:  hold on full reveal

	// Background deepens to near-black
	const bgColor = interpolateColors(
		frame,
		[0, 1.5 * fps, 3 * fps],
		[C.charcoal, C.charcoalM, C.black],
	);

	// Sub-tagline fade in/out
	const tagFadeIn = interpolate(
		frame,
		[0, Math.round(0.7 * fps)],
		[0, 1],
		{extrapolateRight: 'clamp'},
	);
	const tagFadeOut = interpolate(
		frame,
		[Math.round(1.4 * fps), Math.round(1.9 * fps)],
		[1, 0],
		{extrapolateRight: 'clamp'},
	);
	const tagOpacity = Math.min(tagFadeIn, tagFadeOut);

	// "CLAVICULAR" spring entrance
	const brandFrame = frame - Math.round(1.7 * fps);
	const brandSpring = spring({
		frame: brandFrame,
		fps,
		config: SP_REVEAL,
	});
	const brandScale = interpolate(brandSpring, [0, 1], [0.82, 1], {
		extrapolateRight: 'clamp',
	});
	const brandOpacity = interpolate(brandSpring, [0, 0.25], [0, 1], {
		extrapolateRight: 'clamp',
	});
	const brandY = interpolate(brandSpring, [0, 1], [30, 0], {
		extrapolateRight: 'clamp',
	});

	// Gold glow behind brand — pulses in with brand
	const glowOpacity = interpolate(
		brandSpring,
		[0, 1],
		[0, 0.35],
		{extrapolateRight: 'clamp'},
	);

	// Light streak — horizontal scan effect behind brand name
	const streakProgress = interpolate(
		frame,
		[Math.round(1.7 * fps), Math.round(2.4 * fps)],
		[-1.2, 1.2],
		{extrapolateRight: 'clamp'},
	);
	const streakOpacity = interpolate(
		frame,
		[Math.round(1.7 * fps), Math.round(2.0 * fps), Math.round(2.4 * fps), Math.round(2.7 * fps)],
		[0, 0.7, 0.7, 0],
		{extrapolateRight: 'clamp'},
	);

	// CTA fade in
	const ctaOpacity = interpolate(
		frame,
		[Math.round(2.6 * fps), Math.round(3.2 * fps)],
		[0, 1],
		{extrapolateRight: 'clamp'},
	);
	const ctaY = interpolate(
		frame,
		[Math.round(2.6 * fps), Math.round(3.2 * fps)],
		[20, 0],
		{extrapolateRight: 'clamp'},
	);

	// Gold accent line under brand
	const lineSpring = spring({
		frame: brandFrame,
		fps,
		config: SP_SHARP,
		durationInFrames: Math.round(0.8 * fps),
	});
	const lineWidth = interpolate(lineSpring, [0, 1], [0, 380], {extrapolateRight: 'clamp'});
	const lineOpacity = interpolate(lineSpring, [0, 0.4], [0, 1], {extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill style={{background: bgColor, overflow: 'hidden'}}>
			{/* Warm glow behind brand */}
			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse 55% 30% at 50% 52%, rgba(200,164,92,${glowOpacity}) 0%, transparent 70%)`,
					pointerEvents: 'none',
				}}
			/>

			<Vignette frame={frame} intensity={1.6} />
			<ScaffoldLines frame={frame} opacity={0.5} />

			{/* Light streak */}
			<AbsoluteFill
				style={{
					pointerEvents: 'none',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					opacity: streakOpacity,
				}}
			>
				<div
					style={{
						position: 'absolute',
						width: '200%',
						height: 2,
						background: `linear-gradient(90deg, transparent 0%, rgba(212,168,71,0.9) 50%, transparent 100%)`,
						transform: `translateX(${streakProgress * 100}%) translateY(0px)`,
						top: '50%',
						marginTop: -1,
						filter: 'blur(3px)',
					}}
				/>
				<div
					style={{
						position: 'absolute',
						width: '200%',
						height: 1,
						background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)`,
						transform: `translateX(${streakProgress * 100}%) translateY(0px)`,
						top: '50%',
					}}
				/>
			</AbsoluteFill>

			{/* Content stack */}
			<AbsoluteFill
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 0,
				}}
			>
				{/* Sub-tagline */}
				<div
					style={{
						...fontPresets.tight,
						fontSize: 36,
						fontWeight: 500,
						color: C.steel,
						letterSpacing: '0.18em',
						textTransform: 'uppercase',
						opacity: tagOpacity,
						marginBottom: 56,
					}}
				>
					ENGINEERED SELF-UPGRADE
				</div>

				{/* CLAVICULAR hero */}
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: 20,
						opacity: brandOpacity,
						transform: `scale(${brandScale}) translateY(${brandY}px)`,
					}}
				>
					<div
						style={{
							...fontPresets.extraTight,
							fontSize: 148,
							fontWeight: 900,
							color: C.gold,
							letterSpacing: '-0.06em',
							lineHeight: 0.9,
							textTransform: 'uppercase',
							textShadow: `0 0 80px rgba(200,164,92,0.25), 0 0 160px rgba(200,164,92,0.10)`,
						}}
					>
						CLAVICULAR
					</div>

					{/* Gold rule under brand */}
					<GoldRule width={lineWidth} opacity={lineOpacity} />
				</div>

				{/* CTA */}
				<div
					style={{
						...fontPresets.tight,
						fontSize: 32,
						fontWeight: 400,
						color: C.offwhite,
						letterSpacing: '0.08em',
						marginTop: 52,
						opacity: ctaOpacity,
						transform: `translateY(${ctaY}px)`,
						display: 'flex',
						alignItems: 'center',
						gap: 12,
					}}
				>
					Begin Your Transformation
					<span style={{color: C.gold, fontWeight: 500}}>→</span>
				</div>
			</AbsoluteFill>

			<GrainOverlay frame={frame} />
		</AbsoluteFill>
	);
};

// ─── Root Composition ─────────────────────────────────────────────────────────

// Scene durations (in seconds × fps = frames at 30fps):
//   Scene 1:   0 → 2.5s  (75 frames) — starts at absolute frame 0
//   Scene 2:  60 → 195   (135 frames local) — starts at absolute frame 60
//   Scene 3: 180 → 300   (120 frames local) — starts at absolute frame 180
// Using Sequence with overlap. Scenes live in absolute timeline.

export type ClavicularAdProps = Record<string, never>;

export const ClavicularAd: React.FC<ClavicularAdProps> = () => {
	const {fps} = useVideoConfig();

	return (
		<AbsoluteFill style={{background: C.black}}>
			{/* Scene 1: Hook — frames 0..74 */}
			<Sequence
				from={0}
				durationInFrames={Math.round(2.5 * fps)}
				premountFor={0}
			>
				<Scene1Hook />
			</Sequence>

			{/* Scene 2: Pillars — frames 60..194 (overlaps S1 exit + S3 start) */}
			<Sequence
				from={Math.round(2.0 * fps)}
				durationInFrames={Math.round(4.5 * fps)}
				premountFor={Math.round(0.5 * fps)}
			>
				<Scene2Pillars />
			</Sequence>

			{/* Scene 3: Brand reveal — frames 180..299 */}
			<Sequence
				from={Math.round(6.0 * fps)}
				durationInFrames={Math.round(4.0 * fps)}
				premountFor={Math.round(0.5 * fps)}
			>
				<Scene3Brand />
			</Sequence>
		</AbsoluteFill>
	);
};
