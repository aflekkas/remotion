import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	Easing,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {COLORS} from '../constants';
import {spaceGroteskFontFamily, interFontFamily} from '../fonts';

// Grain noise using multiple layered radial gradients animated via frame
const FilmGrain: React.FC<{frame: number}> = ({frame}) => {
	// Noise-like movement using deterministic frame-based offsets
	const x1 = interpolate(Math.sin(frame * 0.17) * 0.5 + 0.5, [0, 1], [10, 90], {
		extrapolateRight: 'clamp',
	});
	const y1 = interpolate(Math.cos(frame * 0.13) * 0.5 + 0.5, [0, 1], [10, 90], {
		extrapolateRight: 'clamp',
	});
	const x2 = interpolate(Math.sin(frame * 0.11 + 2) * 0.5 + 0.5, [0, 1], [20, 80], {
		extrapolateRight: 'clamp',
	});
	const y2 = interpolate(Math.cos(frame * 0.19 + 1) * 0.5 + 0.5, [0, 1], [20, 80], {
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				position: 'absolute',
				inset: 0,
				background: `
					radial-gradient(ellipse 60% 50% at ${x1}% ${y1}%, rgba(196,163,90,0.025) 0%, transparent 70%),
					radial-gradient(ellipse 40% 60% at ${x2}% ${y2}%, rgba(196,163,90,0.015) 0%, transparent 60%)
				`,
				pointerEvents: 'none',
			}}
		/>
	);
};

// Individual word reveal with clip-path mask animation
const WordReveal: React.FC<{
	word: string;
	startFrame: number;
	frame: number;
	fontSize: number;
	fontFamily: string;
	fontWeight: string | number;
	letterSpacing?: string;
	color?: string;
}> = ({
	word,
	startFrame,
	frame,
	fontSize,
	fontFamily,
	fontWeight,
	letterSpacing = '0em',
	color = COLORS.text,
}) => {
	const localFrame = frame - startFrame;

	// Primary lift — text rises from below the clip boundary
	const yOffset = interpolate(localFrame, [0, 18], [100, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.16, 1, 0.3, 1),
	});

	const opacity = interpolate(localFrame, [0, 12], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.quad),
	});

	if (localFrame < 0) return null;

	return (
		<div
			style={{
				overflow: 'hidden',
				display: 'inline-block',
				marginRight: 40,
				lineHeight: 1.1,
			}}
		>
			<div
				style={{
					transform: `translateY(${yOffset}%)`,
					opacity,
					fontSize,
					fontFamily,
					fontWeight,
					letterSpacing,
					color,
					lineHeight: 1.1,
				}}
			>
				{word}
			</div>
		</div>
	);
};

export const Scene1Opening: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Words: "ATTENTION IS CURRENCY"
	const words = ['ATTENTION', 'IS', 'CURRENCY'];
	// Stagger: 0, 10, 20 frames
	const wordDelays = [0, 10, 20];

	// Horizontal rule draws from center outward
	const lineWidth = interpolate(frame, [28, 52], [0, 200], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.16, 1, 0.3, 1),
	});

	// Ambient glow — slow drift
	const glowX = interpolate(frame, [0, 72], [45, 55], {
		extrapolateRight: 'clamp',
	});
	const glowOpacity = interpolate(frame, [0, 24, 60, 72], [0, 0.15, 0.15, 0.08], {
		extrapolateRight: 'clamp',
	});

	// Overall scene fade-in
	const sceneOpacity = interpolate(frame, [0, 8], [0, 1], {
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill
			style={{
				backgroundColor: COLORS.bg,
				opacity: sceneOpacity,
			}}
		>
			{/* Ambient background glow */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background: `radial-gradient(ellipse 55% 45% at ${glowX}% 50%, rgba(196,163,90,${glowOpacity}) 0%, transparent 65%)`,
					pointerEvents: 'none',
				}}
			/>

			{/* Film grain overlay */}
			<FilmGrain frame={frame} />

			{/* Main content — centered */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				{/* Headline */}
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'flex-end',
						flexWrap: 'nowrap',
					}}
				>
					{words.map((word, i) => (
						<WordReveal
							key={word}
							word={word}
							startFrame={wordDelays[i]}
							frame={frame}
							fontSize={96}
							fontFamily={spaceGroteskFontFamily}
							fontWeight={700}
							letterSpacing='0.06em'
							color={COLORS.text}
						/>
					))}
				</div>

				{/* Accent line — draws from center */}
				<div
					style={{
						marginTop: 28,
						height: 1,
						width: lineWidth,
						background: `linear-gradient(90deg, transparent 0%, ${COLORS.accent} 50%, transparent 100%)`,
					}}
				/>
			</div>

			{/* Subtle vignette */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background:
						'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.6) 100%)',
					pointerEvents: 'none',
				}}
			/>
		</AbsoluteFill>
	);
};
