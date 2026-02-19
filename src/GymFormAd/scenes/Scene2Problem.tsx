import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {noise2D} from '@remotion/noise';
import {Background} from '../Background';
import {COLORS, SPRINGS} from '../constants';
import {textStyles} from '../fonts';

// Abstract body silhouette made from SVG ellipses — distorts on glitch frames
const BodySilhouette: React.FC<{frame: number}> = ({frame}) => {
	// Glitch pulses every ~25 frames
	const glitchCycle = frame % 27;
	const isGlitching = glitchCycle > 20;
	const glitchIntensity = isGlitching
		? interpolate(glitchCycle, [20, 23, 26], [0, 1, 0], {
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			})
		: 0;

	// Noise-driven organic sway for "bad form" feel
	const swayX = noise2D('body-sway-x', frame * 0.02, 0) * 30 * glitchIntensity;
	const swayY = noise2D('body-sway-y', 0, frame * 0.02) * 20 * glitchIntensity;
	const skewX = noise2D('body-skew', frame * 0.015, 0) * 12 * glitchIntensity;

	// Fade the silhouette in over first 20 frames of the scene
	const silhouetteOpacity = interpolate(frame, [0, 20], [0, 0.7], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Joint tracking dots — positions as % of SVG viewport
	const joints = [
		{cx: 200, cy: 60, r: 8, label: 'head'},    // head
		{cx: 200, cy: 115, r: 6, label: 'neck'},   // neck
		{cx: 140, cy: 180, r: 8, label: 'lshoulder'}, // left shoulder
		{cx: 260, cy: 180, r: 8, label: 'rshoulder'}, // right shoulder
		{cx: 200, cy: 280, r: 6, label: 'hip'},     // hip center
		{cx: 120, cy: 360, r: 7, label: 'lknee'},  // left knee
		{cx: 280, cy: 360, r: 7, label: 'rknee'},  // right knee
		{cx: 110, cy: 450, r: 6, label: 'lankle'}, // left ankle
		{cx: 290, cy: 450, r: 6, label: 'rankle'}, // right ankle
	];

	return (
		<div
			style={{
				position: 'absolute',
				left: '50%',
				top: '50%',
				transform: `translate(-50%, -50%) translateX(${swayX}px) translateY(${swayY}px) skewX(${skewX}deg)`,
				opacity: silhouetteOpacity,
				width: 400,
				height: 500,
			}}
		>
			<svg viewBox="0 0 400 500" width={400} height={500}>
				{/* Body silhouette — simplified stick figure with volume */}
				<defs>
					<filter id="body-glow">
						<feGaussianBlur stdDeviation="4" result="blur" />
						<feMerge>
							<feMergeNode in="blur" />
							<feMergeNode in="SourceGraphic" />
						</feMerge>
					</filter>
					<linearGradient id="body-grad" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor={COLORS.blue} stopOpacity="0.6" />
						<stop offset="100%" stopColor={COLORS.green} stopOpacity="0.3" />
					</linearGradient>
				</defs>

				{/* Head */}
				<ellipse cx={200} cy={60} rx={38} ry={44} fill="none" stroke="url(#body-grad)" strokeWidth={2} filter="url(#body-glow)" />

				{/* Torso */}
				<path
					d={`M 140 120 L 200 115 L 260 120 L 270 280 L 200 290 L 130 280 Z`}
					fill={`${COLORS.blue}10`}
					stroke="url(#body-grad)"
					strokeWidth={2}
					filter="url(#body-glow)"
				/>

				{/* Left arm */}
				<path d="M 140 170 L 100 260 L 90 310" fill="none" stroke={`${COLORS.blue}80`} strokeWidth={3} strokeLinecap="round" />
				{/* Right arm */}
				<path d="M 260 170 L 300 260 L 315 310" fill="none" stroke={`${COLORS.blue}80`} strokeWidth={3} strokeLinecap="round" />

				{/* Left leg */}
				<path d="M 175 285 L 150 370 L 130 455" fill="none" stroke={`${COLORS.green}80`} strokeWidth={3} strokeLinecap="round" />
				{/* Right leg */}
				<path d="M 225 285 L 250 370 L 270 455" fill="none" stroke={`${COLORS.green}80`} strokeWidth={3} strokeLinecap="round" />

				{/* Joint tracking dots with noise-displaced positions during glitch */}
				{joints.map((j) => {
					const jdx = noise2D(j.label + '-jx', frame * 0.1, 0) * 15 * glitchIntensity;
					const jdy = noise2D(j.label + '-jy', 0, frame * 0.1) * 15 * glitchIntensity;
					const dotOpacity = 0.4 + Math.sin(frame * 0.15 + j.cx * 0.1) * 0.3;
					return (
						<g key={j.label}>
							<circle
								cx={j.cx + jdx}
								cy={j.cy + jdy}
								r={j.r + 4}
								fill={`${COLORS.blue}20`}
								stroke={COLORS.blue}
								strokeWidth={1}
								strokeDasharray={`${j.r} ${j.r * 0.5}`}
							/>
							<circle
								cx={j.cx + jdx}
								cy={j.cy + jdy}
								r={j.r}
								fill={COLORS.blue}
								opacity={dotOpacity}
							/>
						</g>
					);
				})}

				{/* Glitch artifact lines */}
				{isGlitching && (
					<>
						<rect
							x={0}
							y={160 + noise2D('g1', frame, 0) * 80}
							width={400}
							height={6}
							fill={COLORS.red}
							opacity={glitchIntensity * 0.5}
						/>
						<rect
							x={0}
							y={280 + noise2D('g2', frame, 0) * 60}
							width={400}
							height={4}
							fill={COLORS.blue}
							opacity={glitchIntensity * 0.4}
						/>
					</>
				)}
			</svg>
		</div>
	);
};

export const Scene2Problem: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Main headline springs in
	const headlineSpring = spring({
		frame: frame - 5,
		fps,
		config: SPRINGS.gentle,
	});
	const headlineY = interpolate(headlineSpring, [0, 1], [50, 0]);

	// Sub-text fades in a beat later
	const subOpacity = interpolate(frame, [25, 45], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const subY = interpolate(frame, [25, 45], [20, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Warning pill springs in
	const warningSpring = spring({
		frame: frame - 38,
		fps,
		config: SPRINGS.elastic,
	});
	const warningScale = interpolate(warningSpring, [0, 1], [0.5, 1]);

	return (
		<AbsoluteFill>
			<Background />

			{/* Body silhouette — positioned left of center */}
			<div
				style={{
					position: 'absolute',
					left: '62%',
					top: '50%',
					transform: 'translate(-50%, -50%)',
					opacity: 0.85,
				}}
			>
				<BodySilhouette frame={frame} />
			</div>

			{/* Scan-line overlay on silhouette area */}
			<div
				style={{
					position: 'absolute',
					left: '42%',
					top: 0,
					width: '58%',
					height: '100%',
					backgroundImage: `repeating-linear-gradient(
						0deg,
						transparent,
						transparent 3px,
						rgba(0, 212, 255, 0.025) 3px,
						rgba(0, 212, 255, 0.025) 4px
					)`,
					pointerEvents: 'none',
				}}
			/>

			{/* Text content — left side */}
			<AbsoluteFill
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					paddingLeft: 120,
					paddingRight: '50%',
					gap: 24,
				}}
			>
				{/* Label */}
				<div
					style={{
						...textStyles.label,
						fontSize: 14,
						color: COLORS.red,
						letterSpacing: '0.25em',
						textTransform: 'uppercase',
						opacity: headlineSpring,
					}}
				>
					The problem
				</div>

				{/* Main headline */}
				<div
					style={{
						transform: `translateY(${headlineY}px)`,
						opacity: headlineSpring,
					}}
				>
					<div
						style={{
							...textStyles.hero,
							fontSize: 64,
							color: COLORS.white,
							marginBottom: 8,
						}}
					>
						Bad form.
					</div>
					<div
						style={{
							...textStyles.hero,
							fontSize: 64,
							color: COLORS.red,
						}}
					>
						Wasted reps.
					</div>
					<div
						style={{
							...textStyles.hero,
							fontSize: 64,
							color: COLORS.red,
							filter: `drop-shadow(0 0 20px ${COLORS.redGlow})`,
						}}
					>
						Injury risk.
					</div>
				</div>

				{/* Sub-text */}
				<div
					style={{
						opacity: subOpacity,
						transform: `translateY(${subY}px)`,
					}}
				>
					<div
						style={{
							...textStyles.body,
							fontSize: 20,
							color: COLORS.muted,
							maxWidth: 480,
						}}
					>
						Most gym-goers never get real feedback on their form.
						The result? Plateau, pain, and zero progress.
					</div>
				</div>

				{/* Warning stat pill */}
				<div
					style={{
						display: 'inline-flex',
						alignItems: 'center',
						gap: 12,
						background: `${COLORS.red}15`,
						border: `1px solid ${COLORS.red}40`,
						borderRadius: 100,
						padding: '12px 24px',
						transform: `scale(${warningScale})`,
						opacity: warningSpring,
						transformOrigin: 'left center',
						alignSelf: 'flex-start',
					}}
				>
					<div
						style={{
							width: 10,
							height: 10,
							borderRadius: '50%',
							background: COLORS.red,
							boxShadow: `0 0 10px ${COLORS.red}`,
						}}
					/>
					<span
						style={{
							...textStyles.body,
							fontSize: 18,
							color: COLORS.offWhite,
						}}
					>
						80% of gym injuries caused by bad form
					</span>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
