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

// Radiating ring pulse — like sonar/heartbeat
const PulseRing: React.FC<{
	frame: number;
	delay: number;
	maxRadius: number;
	color: string;
}> = ({frame, delay, maxRadius, color}) => {
	const localFrame = (frame + delay * 20) % 60;
	const progress = localFrame / 60;
	const radius = progress * maxRadius;
	const opacity = interpolate(progress, [0, 0.3, 1], [0.6, 0.4, 0], {
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				position: 'absolute',
				width: radius * 2,
				height: radius * 2,
				borderRadius: '50%',
				border: `1.5px solid ${color}`,
				opacity,
				transform: 'translate(-50%, -50%)',
				left: '50%',
				top: '50%',
				pointerEvents: 'none',
			}}
		/>
	);
};

// Orbiting particle dots
const OrbitingDots: React.FC<{frame: number}> = ({frame}) => {
	const dots = [
		{radius: 200, speed: 0.02, offset: 0, color: COLORS.blue, size: 5},
		{radius: 240, speed: -0.015, offset: Math.PI, color: COLORS.green, size: 4},
		{radius: 280, speed: 0.025, offset: Math.PI / 2, color: COLORS.blue, size: 3},
		{radius: 180, speed: -0.03, offset: Math.PI * 1.5, color: COLORS.green, size: 5},
		{radius: 320, speed: 0.018, offset: Math.PI / 3, color: COLORS.blue, size: 3},
		{radius: 260, speed: -0.022, offset: Math.PI * 0.8, color: COLORS.green, size: 4},
	];

	return (
		<div style={{position: 'absolute', left: '50%', top: '50%'}}>
			{dots.map((dot, i) => {
				const angle = frame * dot.speed + dot.offset;
				const x = Math.cos(angle) * dot.radius;
				const y = Math.sin(angle) * dot.radius;
				const noiseOpacity = 0.5 + noise2D('dot-o' + i, frame * 0.01, i) * 0.5;

				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							width: dot.size,
							height: dot.size,
							borderRadius: '50%',
							background: dot.color,
							opacity: noiseOpacity,
							transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))`,
							boxShadow: `0 0 8px ${dot.color}`,
						}}
					/>
				);
			})}
		</div>
	);
};

export const Scene5CTA: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Main headline springs in
	const headlineSpring = spring({
		frame: frame - 0,
		fps,
		config: SPRINGS.gentle,
	});
	const headlineY = interpolate(headlineSpring, [0, 1], [60, 0]);

	// Tagline fades in
	const taglineOpacity = interpolate(frame, [20, 40], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const taglineY = interpolate(frame, [20, 40], [24, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// CTA button springs in with a pop
	const buttonSpring = spring({
		frame: frame - 35,
		fps,
		config: SPRINGS.elastic,
	});
	const buttonScale = interpolate(buttonSpring, [0, 1], [0.4, 1]);

	// Pulse glow intensity — breathing effect
	const glowIntensity = 0.7 + Math.sin(frame * 0.12) * 0.3;

	// "Coming soon" label fades in last
	const soonOpacity = interpolate(frame, [50, 68], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Headline second line slides in from right
	const line2Spring = spring({
		frame: frame - 8,
		fps,
		config: SPRINGS.organic,
	});
	const line2X = interpolate(line2Spring, [0, 1], [100, 0]);

	return (
		<AbsoluteFill>
			<Background />

			{/* Orbiting particles — ambient decoration */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					opacity: interpolate(frame, [0, 20], [0, 0.6], {
						extrapolateRight: 'clamp',
					}),
				}}
			>
				<OrbitingDots frame={frame} />
			</div>

			{/* Pulse rings emanating from center */}
			{[0, 1, 2].map((i) => (
				<PulseRing
					key={i}
					frame={frame}
					delay={i}
					maxRadius={380}
					color={i % 2 === 0 ? COLORS.blue : COLORS.green}
				/>
			))}

			{/* Central glow bloom */}
			<div
				style={{
					position: 'absolute',
					left: '50%',
					top: '50%',
					width: 600,
					height: 600,
					borderRadius: '50%',
					background: `radial-gradient(circle, ${COLORS.blue}${Math.round(glowIntensity * 25).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
					transform: 'translate(-50%, -50%)',
					pointerEvents: 'none',
					filter: 'blur(20px)',
				}}
			/>

			{/* Main content — centered */}
			<AbsoluteFill
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 16,
					textAlign: 'center',
					padding: '0 200px',
				}}
			>
				{/* Main CTA headline */}
				<div
					style={{
						transform: `translateY(${headlineY}px)`,
						opacity: headlineSpring,
					}}
				>
					<div
						style={{
							...textStyles.hero,
							fontSize: 90,
							background: `linear-gradient(135deg, ${COLORS.white} 30%, ${COLORS.blue} 100%)`,
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							backgroundClip: 'text',
							display: 'block',
							filter: `drop-shadow(0 0 40px ${COLORS.blueGlow})`,
						}}
					>
						Train smarter.
					</div>
				</div>

				<div
					style={{
						transform: `translateX(${line2X}px)`,
						opacity: line2Spring,
					}}
				>
					<div
						style={{
							...textStyles.hero,
							fontSize: 90,
							color: COLORS.muted,
							display: 'block',
						}}
					>
						Not more expensive.
					</div>
				</div>

				{/* Spacer */}
				<div style={{height: 16}} />

				{/* Tagline */}
				<div
					style={{
						opacity: taglineOpacity,
						transform: `translateY(${taglineY}px)`,
					}}
				>
					<div
						style={{
							...textStyles.body,
							fontSize: 22,
							color: COLORS.muted,
							maxWidth: 600,
						}}
					>
						Perfect form for everyone — from beginners to pros.
						No gym membership required.
					</div>
				</div>

				{/* CTA button */}
				<div
					style={{
						marginTop: 24,
						transform: `scale(${buttonScale})`,
						opacity: buttonSpring,
					}}
				>
					<div
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							gap: 16,
							background: `linear-gradient(135deg, ${COLORS.green}25, ${COLORS.blue}25)`,
							border: `2px solid ${COLORS.green}`,
							borderRadius: 100,
							padding: '20px 52px',
							boxShadow: `
								0 0 ${40 * glowIntensity}px ${COLORS.green}60,
								0 0 ${80 * glowIntensity}px ${COLORS.greenGlow},
								inset 0 0 30px ${COLORS.green}10
							`,
						}}
					>
						<div
							style={{
								width: 12,
								height: 12,
								borderRadius: '50%',
								background: COLORS.green,
								boxShadow: `0 0 12px ${COLORS.green}`,
							}}
						/>
						<span
							style={{
								...textStyles.heading,
								fontSize: 26,
								color: COLORS.white,
								letterSpacing: '0.06em',
							}}
						>
							Join the Beta
						</span>
					</div>
				</div>

				{/* Coming soon label */}
				<div
					style={{
						opacity: soonOpacity,
						marginTop: 8,
					}}
				>
					<div
						style={{
							...textStyles.label,
							fontSize: 14,
							color: COLORS.dimText,
							letterSpacing: '0.2em',
							textTransform: 'uppercase',
						}}
					>
						Free during beta · No credit card
					</div>
				</div>

				{/* App name watermark at bottom */}
				<div
					style={{
						position: 'absolute',
						bottom: 60,
						left: '50%',
						transform: 'translateX(-50%)',
						opacity: soonOpacity * 0.5,
					}}
				>
					<div
						style={{
							...textStyles.label,
							fontSize: 13,
							color: COLORS.dimText,
							letterSpacing: '0.3em',
							textTransform: 'uppercase',
						}}
					>
						FORMCHECK AI
					</div>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
