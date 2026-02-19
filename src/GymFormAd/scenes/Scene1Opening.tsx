import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {Background} from '../Background';
import {COLORS, SPRINGS} from '../constants';
import {textStyles} from '../fonts';

// A single pulsing particle dot
const Particle: React.FC<{
	x: number;
	y: number;
	size: number;
	color: string;
	phase: number;
	frame: number;
}> = ({x, y, size, color, phase, frame}) => {
	const opacity = interpolate(
		Math.sin(frame * 0.04 + phase),
		[-1, 1],
		[0.1, 0.6],
		{extrapolateRight: 'clamp'},
	);
	const s = size * (1 + Math.sin(frame * 0.06 + phase) * 0.3);
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				width: s,
				height: s,
				borderRadius: '50%',
				background: color,
				opacity,
				transform: 'translate(-50%, -50%)',
			}}
		/>
	);
};

const PARTICLES = [
	{x: 120, y: 200, size: 4, color: COLORS.blue, phase: 0},
	{x: 1780, y: 150, size: 3, color: COLORS.green, phase: 1.3},
	{x: 200, y: 880, size: 5, color: COLORS.blue, phase: 2.1},
	{x: 1700, y: 920, size: 4, color: COLORS.green, phase: 3.0},
	{x: 960, y: 80, size: 3, color: COLORS.blue, phase: 0.7},
	{x: 400, y: 540, size: 3, color: COLORS.green, phase: 1.9},
	{x: 1500, y: 600, size: 4, color: COLORS.blue, phase: 2.8},
	{x: 80, y: 540, size: 3, color: COLORS.green, phase: 4.2},
	{x: 1850, y: 540, size: 4, color: COLORS.blue, phase: 0.4},
	{x: 700, y: 1000, size: 3, color: COLORS.green, phase: 3.5},
];

export const Scene1Opening: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// "$200/hr" entrance — spring in from above
	const priceSpring = spring({
		frame: frame - 0,
		fps,
		config: SPRINGS.gentle,
	});
	const priceY = interpolate(priceSpring, [0, 1], [-120, 0]);
	const priceOpacity = interpolate(priceSpring, [0, 0.3], [0, 1], {
		extrapolateRight: 'clamp',
	});

	// Strikethrough line draws across from left → right
	// Starts at frame 18, takes 20 frames to draw
	const strikeProgress = interpolate(frame, [18, 38], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// "$0" springs in after strike, with a scale pop
	const freeSpring = spring({
		frame: frame - 42,
		fps,
		config: SPRINGS.elastic,
	});
	const freeScale = interpolate(freeSpring, [0, 1], [0.3, 1]);
	const freeOpacity = freeSpring;

	// "No coach required" fades up
	const taglineOpacity = interpolate(frame, [55, 72], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const taglineY = interpolate(frame, [55, 72], [24, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill>
			<Background />

			{/* Ambient particles */}
			{PARTICLES.map((p, i) => (
				<Particle key={i} {...p} frame={frame} />
			))}

			{/* Main content — centered */}
			<AbsoluteFill
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 0,
				}}
			>
				{/* "$200/hr" with strikethrough */}
				<div
					style={{
						position: 'relative',
						transform: `translateY(${priceY}px)`,
						opacity: priceOpacity,
						marginBottom: 32,
					}}
				>
					<div
						style={{
							...textStyles.hero,
							fontSize: 140,
							color: COLORS.muted,
							userSelect: 'none',
						}}
					>
						$200/hr
					</div>

					{/* Animated strikethrough line */}
					<div
						style={{
							position: 'absolute',
							top: '52%',
							left: -16,
							height: 8,
							width: `calc(${strikeProgress * 100}% + 32px)`,
							background: `linear-gradient(90deg, ${COLORS.red}, ${COLORS.red}CC)`,
							borderRadius: 4,
							boxShadow: `0 0 20px ${COLORS.red}, 0 0 40px ${COLORS.redGlow}`,
							transformOrigin: 'left center',
						}}
					/>
				</div>

				{/* "$0" reveal */}
				<div
					style={{
						...textStyles.hero,
						fontSize: 200,
						background: `linear-gradient(135deg, ${COLORS.green} 0%, ${COLORS.blue} 100%)`,
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						backgroundClip: 'text',
						transform: `scale(${freeScale})`,
						opacity: freeOpacity,
						display: 'block',
						lineHeight: 1,
						filter: `drop-shadow(0 0 40px ${COLORS.blueGlow}) drop-shadow(0 0 80px ${COLORS.greenGlow})`,
					}}
				>
					$0
				</div>

				{/* Tagline */}
				<div
					style={{
						...textStyles.label,
						fontSize: 24,
						color: COLORS.muted,
						letterSpacing: '0.2em',
						textTransform: 'uppercase',
						marginTop: 32,
						opacity: taglineOpacity,
						transform: `translateY(${taglineY}px)`,
					}}
				>
					AI coaching. No monthly fees.
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
