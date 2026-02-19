import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { noise2D } from '@remotion/noise';
import { fontFamily } from './fonts';
import { PALETTE } from './palette';

// ─── Ambient particle ─────────────────────────────────────────────────────────
type ParticleProps = {
	seed: string;
	frame: number;
	width: number;
	height: number;
};

const Particle: React.FC<ParticleProps> = ({ seed, frame, width, height }) => {
	// Use noise for smooth organic drift
	const x = ((noise2D(seed + 'x', frame * 0.005, 0) + 1) / 2) * width;
	const y = ((noise2D(seed + 'y', frame * 0.004, 0) + 1) / 2) * height;
	const size = 1.5 + ((noise2D(seed + 's', frame * 0.003, 0) + 1) / 2) * 2;
	const opacity = 0.08 + ((noise2D(seed + 'o', frame * 0.006, 0) + 1) / 2) * 0.18;

	return (
		<circle
			cx={x} cy={y} r={size}
			fill={PALETTE.white}
			opacity={opacity}
		/>
	);
};

// ─── Scene 6: Hero Card ────────────────────────────────────────────────────────
export const Scene6HeroCard: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps, width, height } = useVideoConfig();

	// Fade in from black
	const fadeIn = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp' });

	// "Claude Code" title — springs in at start
	const titleSpring = spring({
		frame: frame - 8,
		fps,
		config: { damping: 200, stiffness: 80, mass: 1 },
	});
	const titleY = interpolate(titleSpring, [0, 1], [40, 0], { extrapolateRight: 'clamp' });
	const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1], { extrapolateRight: 'clamp' });

	// Subtitle — slightly delayed
	const subtitleSpring = spring({
		frame: frame - Math.round(0.6 * fps),
		fps,
		config: { damping: 200, stiffness: 80, mass: 1 },
	});
	const subtitleY = interpolate(subtitleSpring, [0, 1], [24, 0], { extrapolateRight: 'clamp' });
	const subtitleOpacity = interpolate(subtitleSpring, [0, 1], [0, 1], { extrapolateRight: 'clamp' });

	// URL — delayed more
	const urlSpring = spring({
		frame: frame - Math.round(1.2 * fps),
		fps,
		config: { damping: 200, stiffness: 80, mass: 1 },
	});
	const urlY = interpolate(urlSpring, [0, 1], [20, 0], { extrapolateRight: 'clamp' });
	const urlOpacity = interpolate(urlSpring, [0, 1], [0, 1], { extrapolateRight: 'clamp' });

	// URL cursor blink
	const urlVisible = frame >= Math.round(1.2 * fps);
	const cursorBlink = urlVisible
		? Math.sin(frame * (Math.PI / (fps * 0.5))) > 0
		: false;

	// Ambient glow behind title — breathes slowly
	const glowPulse = 0.6 + Math.sin(frame * 0.025) * 0.15;

	// Background gradient shifts subtly
	const bgX = 45 + Math.sin(frame * 0.01) * 8;
	const bgY = 48 + Math.cos(frame * 0.008) * 5;

	// Particle seeds
	const particleSeeds = Array.from({ length: 40 }, (_, i) => `p${i}`);

	return (
		<AbsoluteFill
			style={{
				background: `radial-gradient(ellipse 80% 80% at ${bgX}% ${bgY}%, ${PALETTE.bgWarm} 0%, ${PALETTE.bgMid} 40%, ${PALETTE.bgDeep} 100%)`,
				opacity: fadeIn,
			}}
		>

			{/* Particle field */}
			<svg
				style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
			>
				{particleSeeds.map((seed) => (
					<Particle key={seed} seed={seed} frame={frame} width={width} height={height} />
				))}
			</svg>

			{/* Ambient glow blob behind text */}
			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse 60% 40% at 50% 48%, rgba(218,119,86,${0.08 * glowPulse}) 0%, rgba(124,58,237,${0.06 * glowPulse}) 40%, transparent 70%)`,
					pointerEvents: 'none',
				}}
			/>

			{/* Deep purple left accent */}
			<AbsoluteFill
				style={{
					background: 'radial-gradient(ellipse 40% 60% at 0% 50%, rgba(45,27,105,0.2) 0%, transparent 60%)',
					pointerEvents: 'none',
				}}
			/>

			{/* Centered content */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 0,
				}}
			>
				{/* "Claude Code" — primary headline */}
				<div
					style={{
						transform: `translateY(${titleY}px)`,
						opacity: titleOpacity,
						marginBottom: 20,
					}}
				>
					<span
						style={{
							fontFamily,
							fontSize: 112,
							fontWeight: 700,
							color: PALETTE.white,
							letterSpacing: '-0.04em',
							lineHeight: 1,
							textShadow: `0 2px 60px rgba(255,255,255,0.08), 0 0 120px rgba(218,119,86,0.12)`,
							display: 'block',
						}}
					>
						Claude Code
					</span>
				</div>

				{/* Divider line */}
				<div
					style={{
						width: interpolate(subtitleSpring, [0, 1], [0, 320], { extrapolateRight: 'clamp' }),
						height: 1,
						background: `linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent)`,
						marginBottom: 24,
					}}
				/>

				{/* Tagline */}
				<div
					style={{
						transform: `translateY(${subtitleY}px)`,
						opacity: subtitleOpacity,
						marginBottom: 36,
					}}
				>
					<span
						style={{
							fontFamily,
							fontSize: 34,
							fontWeight: 300,
							color: PALETTE.muted,
							letterSpacing: '-0.01em',
							lineHeight: 1.3,
							display: 'block',
							textAlign: 'center',
						}}
					>
						Code at the speed of thought.
					</span>
				</div>

				{/* URL */}
				<div
					style={{
						transform: `translateY(${urlY}px)`,
						opacity: urlOpacity,
						display: 'flex',
						alignItems: 'center',
						gap: 2,
					}}
				>
					<span
						style={{
							fontFamily: 'monospace',
							fontSize: 28,
							fontWeight: 500,
							color: PALETTE.amber,
							letterSpacing: '0.01em',
							textShadow: `0 0 20px rgba(217,119,6,0.4)`,
						}}
					>
						claude.ai/code
					</span>
					{cursorBlink && (
						<span
							style={{
								fontFamily: 'monospace',
								fontSize: 28,
								color: PALETTE.amber,
								opacity: 0.9,
								textShadow: `0 0 12px rgba(217,119,6,0.7)`,
							}}
						>
							▌
						</span>
					)}
				</div>
			</div>

			{/* Horizontal rule lines — decorative frame */}
			<svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.08, pointerEvents: 'none' }}>
				<line x1={80} y1={height / 2} x2={width * 0.28} y2={height / 2} stroke={PALETTE.white} strokeWidth={0.8} />
				<line x1={width * 0.72} y1={height / 2} x2={width - 80} y2={height / 2} stroke={PALETTE.white} strokeWidth={0.8} />
			</svg>

			{/* Subtle vignette */}
			<AbsoluteFill
				style={{
					background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 50%, rgba(10,10,15,0.6) 100%)',
					pointerEvents: 'none',
				}}
			/>

			{/* Bottom ambient strip */}
			<div
				style={{
					position: 'absolute',
					bottom: 0,
					left: 0,
					right: 0,
					height: 2,
					background: `linear-gradient(to right, transparent, ${PALETTE.amber}33, transparent)`,
					opacity: 0.6,
				}}
			/>

		</AbsoluteFill>
	);
};
