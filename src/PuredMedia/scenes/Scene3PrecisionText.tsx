import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {COLORS} from '../constants';
import {spaceGroteskFontFamily, interFontFamily} from '../fonts';

type WordItemProps = {
	word: string;
	delayFrames: number;
};

const WordItem: React.FC<WordItemProps> = ({word, delayFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const localFrame = frame - delayFrames;

	// Tight snappy spring — no overshoot, fast settle
	const wordSpring = spring({
		frame: localFrame,
		fps,
		config: {damping: 200, stiffness: 180, mass: 0.8},
	});

	const translateY = interpolate(wordSpring, [0, 1], [32, 0], {
		extrapolateRight: 'clamp',
	});
	const opacity = interpolate(localFrame, [0, 8], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Accent dot spring — slightly delayed after word
	const dotSpring = spring({
		frame: localFrame - 4,
		fps,
		config: {damping: 200, stiffness: 200, mass: 0.5},
	});
	const dotScale = interpolate(dotSpring, [0, 1], [0, 1], {
		extrapolateRight: 'clamp',
	});
	const dotOpacity = interpolate(localFrame - 4, [0, 6], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	if (localFrame < 0) return null;

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'baseline',
				gap: 16,
				marginBottom: 8,
			}}
		>
			{/* Gold accent dot */}
			<div
				style={{
					width: 5,
					height: 5,
					borderRadius: '50%',
					backgroundColor: COLORS.accent,
					flexShrink: 0,
					transform: `scale(${dotScale})`,
					opacity: dotOpacity,
					marginBottom: 6,
				}}
			/>

			{/* Word */}
			<div
				style={{
					overflow: 'hidden',
					lineHeight: 1.0,
				}}
			>
				<div
					style={{
						transform: `translateY(${translateY}px)`,
						opacity,
						fontSize: 88,
						fontFamily: spaceGroteskFontFamily,
						fontWeight: 700,
						color: COLORS.text,
						letterSpacing: '-0.02em',
						lineHeight: 1.0,
					}}
				>
					{word}
				</div>
			</div>
		</div>
	);
};

export const Scene3PrecisionText: React.FC = () => {
	const frame = useCurrentFrame();

	const words: WordItemProps[] = [
		{word: 'Strategy.', delayFrames: 0},
		{word: 'Creative.', delayFrames: 8},
		{word: 'Performance.', delayFrames: 16},
	];

	// Scene fade in
	const sceneOpacity = interpolate(frame, [0, 6], [0, 1], {
		extrapolateRight: 'clamp',
	});

	// Ambient glow
	const glowOpacity = interpolate(frame, [0, 20], [0, 0.35], {
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill
			style={{
				backgroundColor: COLORS.bg,
				opacity: sceneOpacity,
			}}
		>
			{/* Subtle glow */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background: `radial-gradient(ellipse 55% 65% at 38% 50%, rgba(196,163,90,${glowOpacity * 0.12}) 0%, transparent 60%)`,
					pointerEvents: 'none',
				}}
			/>

			{/* Left-aligned content */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					paddingLeft: 160,
				}}
			>
				{words.map((item) => (
					<WordItem key={item.word} {...item} />
				))}
			</div>

			{/* Vignette */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background:
						'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 50%, rgba(0,0,0,0.5) 100%)',
					pointerEvents: 'none',
				}}
			/>
		</AbsoluteFill>
	);
};
