import React from 'react';
import { AbsoluteFill, interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamily } from './fonts';
import { PALETTE } from './palette';

// ─── Abstract blob behind each word ───────────────────────────────────────────
const GradientBlob: React.FC<{
	cx: number; cy: number;
	rx: number; ry: number;
	color1: string; color2: string;
	entrance: number;
}> = ({ cx, cy, rx, ry, color1, color2, entrance }) => {
	const scale = interpolate(entrance, [0, 1], [0.3, 1.2], { extrapolateRight: 'clamp' });
	const opacity = interpolate(entrance, [0, 0.3, 0.7, 1], [0, 0.5, 0.4, 0], { extrapolateRight: 'clamp' });
	const w = rx * 2 * scale;
	const h = ry * 2 * scale;

	return (
		<div
			style={{
				position: 'absolute',
				left: cx - w / 2,
				top: cy - h / 2,
				width: w,
				height: h,
				borderRadius: '50%',
				background: `radial-gradient(ellipse at 40% 40%, ${color1} 0%, ${color2} 50%, transparent 75%)`,
				opacity,
				filter: 'blur(60px)',
				pointerEvents: 'none',
				mixBlendMode: 'screen',
			}}
		/>
	);
};

// ─── Single feature word ───────────────────────────────────────────────────────
type WordProps = {
	word: string;
	color: string;
	blobColor1: string;
	blobColor2: string;
	sceneStart: number; // frame when this word's scene starts
	sceneEnd: number;   // frame when this word exits
};

const FeatureWord: React.FC<WordProps & { frame: number; fps: number }> = ({
	word, color, blobColor1, blobColor2, sceneStart, sceneEnd, frame, fps,
}) => {
	const { width, height } = useVideoConfig();
	const localFrame = frame - sceneStart;

	// Entrance spring — scale + opacity
	const entrance = spring({
		frame: localFrame,
		fps,
		config: { damping: 8, stiffness: 120, mass: 0.6 },
	});

	// Exit — words compress up and fly off
	const exitProgress = interpolate(
		frame, [sceneEnd - 10, sceneEnd],
		[0, 1],
		{ extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
	);
	const exitY = interpolate(exitProgress, [0, 1], [0, -200], { extrapolateRight: 'clamp' });
	const exitScale = interpolate(exitProgress, [0, 1], [1, 0.5], { extrapolateRight: 'clamp' });
	const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0], { extrapolateRight: 'clamp' });

	const wordScale = interpolate(entrance, [0, 1], [0.7, 1], { extrapolateRight: 'clamp' }) * exitScale;
	const wordOpacity = interpolate(entrance, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' }) * exitOpacity;
	const wordY = exitY;

	if (localFrame < 0) return null;

	return (
		<>
			{/* Blob background */}
			<GradientBlob
				cx={width / 2} cy={height / 2}
				rx={500} ry={350}
				color1={blobColor1} color2={blobColor2}
				entrance={interpolate(localFrame, [0, 15], [0, 1], { extrapolateRight: 'clamp' }) * exitOpacity}
			/>

			{/* Word */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					transform: `translateY(${wordY}px) scale(${wordScale})`,
					opacity: wordOpacity,
				}}
			>
				<span
					style={{
						fontFamily,
						fontSize: 160,
						fontWeight: 800,
						color,
						letterSpacing: '-0.04em',
						lineHeight: 1,
						textShadow: color === PALETTE.amber
							? `0 0 60px rgba(217,119,6,0.4), 0 0 120px rgba(217,119,6,0.15)`
							: `0 2px 40px rgba(255,255,255,0.08)`,
					}}
				>
					{word}
				</span>
			</div>
		</>
	);
};

// ─── Scene 5: Feature Hits ─────────────────────────────────────────────────────
export const Scene5FeatureHits: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps, width, height } = useVideoConfig();

	// Scene spans 8s = 240 frames at local frame
	// Words: 2s each = 60 frames each
	const w1Start = 0;
	const w2Start = 2 * fps;
	const w3Start = 4 * fps;
	const w4Start = 6 * fps;
	const totalDuration = 8 * fps;

	// Background color evolves through words
	const bgColor = interpolateColors(
		frame,
		[0, w2Start, w3Start, w4Start, totalDuration],
		[PALETTE.bgDeep, '#0d0820', '#0a0f1a', '#1a0a00', PALETTE.bgDeep]
	);

	// Fade in
	const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: 'clamp' });

	return (
		<AbsoluteFill style={{ background: bgColor, opacity: fadeIn }}>

			{/* Background grid lines — subtle */}
			<svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04 }}>
				{Array.from({ length: 8 }).map((_, i) => (
					<line
						key={i}
						x1={0} y1={height / 8 * i}
						x2={width} y2={height / 8 * i}
						stroke={PALETTE.white}
						strokeWidth={0.5}
					/>
				))}
				{Array.from({ length: 12 }).map((_, i) => (
					<line
						key={i}
						x1={width / 12 * i} y1={0}
						x2={width / 12 * i} y2={height}
						stroke={PALETTE.white}
						strokeWidth={0.5}
					/>
				))}
			</svg>

			{/* Word 1: READS. */}
			{frame < w2Start + 10 && (
				<FeatureWord
					word="READS."
					color={PALETTE.white}
					blobColor1={PALETTE.deepPurple}
					blobColor2={PALETTE.purple}
					sceneStart={w1Start}
					sceneEnd={w2Start}
					frame={frame}
					fps={fps}
				/>
			)}

			{/* Word 2: WRITES. */}
			{frame >= w2Start && frame < w3Start + 10 && (
				<FeatureWord
					word="WRITES."
					color={PALETTE.offWhite}
					blobColor1={PALETTE.terracotta}
					blobColor2={PALETTE.deepPurple}
					sceneStart={w2Start}
					sceneEnd={w3Start}
					frame={frame}
					fps={fps}
				/>
			)}

			{/* Word 3: RUNS. */}
			{frame >= w3Start && frame < w4Start + 10 && (
				<FeatureWord
					word="RUNS."
					color={PALETTE.white}
					blobColor1={PALETTE.codeBlue}
					blobColor2={PALETTE.deepPurple}
					sceneStart={w3Start}
					sceneEnd={w4Start}
					frame={frame}
					fps={fps}
				/>
			)}

			{/* Word 4: THINKS. (amber, slightly larger) */}
			{frame >= w4Start && (
				<div
					style={{
						position: 'absolute',
						inset: 0,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					{(() => {
						const localFrame = frame - w4Start;
						const entrance = spring({
							frame: localFrame,
							fps,
							config: { damping: 8, stiffness: 120, mass: 0.6 },
						});
						const wordScale = interpolate(entrance, [0, 1], [0.7, 1], { extrapolateRight: 'clamp' });
						const wordOpacity = interpolate(entrance, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });
						return (
							<>
								<GradientBlob
									cx={width / 2} cy={height / 2}
									rx={600} ry={420}
									color1={PALETTE.amber}
									color2={PALETTE.warmAmber}
									entrance={interpolate(localFrame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })}
								/>
								<span
									style={{
										fontFamily,
										fontSize: 180,
										fontWeight: 800,
										color: PALETTE.amber,
										letterSpacing: '-0.04em',
										lineHeight: 1,
										transform: `scale(${wordScale})`,
										opacity: wordOpacity,
										display: 'block',
										textShadow: `0 0 80px rgba(217,119,6,0.5), 0 0 160px rgba(217,119,6,0.2)`,
									}}
								>
									THINKS.
								</span>
							</>
						);
					})()}
				</div>
			)}

			{/* Vignette */}
			<AbsoluteFill
				style={{
					background: 'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 40%, rgba(10,10,15,0.5) 100%)',
					pointerEvents: 'none',
				}}
			/>

		</AbsoluteFill>
	);
};
