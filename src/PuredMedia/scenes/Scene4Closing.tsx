import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	interpolateColors,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {COLORS} from '../constants';
import {spaceGroteskFontFamily, interFontFamily} from '../fonts';

export const Scene4Closing: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Scene fade in
	const sceneOpacity = interpolate(frame, [0, 10], [0, 1], {
		extrapolateRight: 'clamp',
	});

	// Logo word mark spring reveal
	const logoSpring = spring({
		frame: frame - 6,
		fps,
		config: {damping: 200, stiffness: 100, mass: 1},
	});

	const logoY = interpolate(logoSpring, [0, 1], [24, 0], {
		extrapolateRight: 'clamp',
	});
	const logoOpacity = interpolate(frame - 6, [0, 14], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// URL reveal — delayed after logo
	const urlOpacity = interpolate(frame, [20, 34], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const urlY = interpolate(frame, [20, 34], [12, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Accent line above logo — draws outward from center
	const lineWidth = interpolate(frame, [2, 22], [0, 120], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const lineOpacity = interpolate(frame, [2, 14], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Ambient pulse — two very close dark tones cycling
	const pulseBg = interpolateColors(frame, [0, 24, 48], [
		'#09090B',
		'#0C0C0E',
		'#09090B',
	]);

	// Subtle glow opacity
	const glowOpacity = interpolate(frame, [0, 12, 36, 48], [0, 0.1, 0.1, 0.05], {
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill
			style={{
				backgroundColor: pulseBg,
				opacity: sceneOpacity,
			}}
		>
			{/* Ambient glow — full-screen radial, no visible edge */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background: `radial-gradient(ellipse 70% 60% at 50% 48%, rgba(196,163,90,${glowOpacity}) 0%, transparent 100%)`,
					pointerEvents: 'none',
				}}
			/>

			{/* Vignette */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background:
						'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.5) 100%)',
					pointerEvents: 'none',
				}}
			/>

			{/* Center content */}
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
				{/* Accent line above */}
				<div
					style={{
						width: lineWidth,
						height: 1,
						background: `linear-gradient(90deg, transparent 0%, ${COLORS.accent} 50%, transparent 100%)`,
						opacity: lineOpacity,
						marginBottom: 24,
					}}
				/>

				{/* PUREDMEDIA wordmark */}
				<div
					style={{
						overflow: 'hidden',
						lineHeight: 1.0,
					}}
				>
					<div
						style={{
							transform: `translateY(${logoY}px)`,
							opacity: logoOpacity,
							fontSize: 72,
							fontFamily: spaceGroteskFontFamily,
							fontWeight: 700,
							color: COLORS.text,
							letterSpacing: '0.22em',
							textTransform: 'uppercase' as const,
							lineHeight: 1.0,
						}}
					>
						PUREDMEDIA
					</div>
				</div>

				{/* Domain */}
				<div
					style={{
						marginTop: 16,
						transform: `translateY(${urlY}px)`,
						opacity: urlOpacity,
					}}
				>
					<span
						style={{
							fontSize: 15,
							fontFamily: interFontFamily,
							fontWeight: 300,
							color: COLORS.textDim,
							letterSpacing: '0.08em',
						}}
					>
						puredmedia.com
					</span>
				</div>
			</div>
		</AbsoluteFill>
	);
};
