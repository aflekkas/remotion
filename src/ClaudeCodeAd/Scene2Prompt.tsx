import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import { fontFamily } from './fonts';
import { PALETTE } from './palette';

// Typewriter — reveals characters up to count, with per-character spring pop
const TypewriterLine: React.FC<{
	text: string;
	charRevealFrame: number; // how many frames per char
	startFrame: number;
	color: string;
	prefix?: string;
	prefixColor?: string;
	fontSize?: number;
}> = ({
	text,
	charRevealFrame,
	startFrame,
	color,
	prefix = '',
	prefixColor,
	fontSize = 22,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const localFrame = frame - startFrame;
	const charsVisible = Math.max(0, Math.floor(localFrame / charRevealFrame));
	const visibleText = text.slice(0, charsVisible);

	// Show cursor ahead of text, blinking
	const cursorVisible = charsVisible <= text.length;
	const cursorBlink = cursorVisible
		? Math.sin(localFrame * (Math.PI / (fps * 0.4))) > 0
		: false;

	return (
		<div
			style={{
				fontFamily,
				fontSize,
				fontWeight: 400,
				lineHeight: 1.6,
				letterSpacing: '-0.01em',
				display: 'flex',
				alignItems: 'center',
				whiteSpace: 'pre',
			}}
		>
			{prefix && (
				<span style={{ color: prefixColor ?? color, marginRight: 4 }}>
					{prefix}
				</span>
			)}
			<span style={{ color }}>
				{visibleText.split('').map((char, i) => {
					// Each char pops in with a tiny spring
					const charFrame = localFrame - i * charRevealFrame;
					const s = spring({
						frame: charFrame,
						fps,
						config: { damping: 10, stiffness: 300, mass: 0.3 },
						durationInFrames: 8,
					});
					const scale = interpolate(s, [0, 1], [0.5, 1], { extrapolateRight: 'clamp' });
					return (
						<span
							key={i}
							style={{
								display: 'inline-block',
								transform: `scale(${scale})`,
								transformOrigin: 'bottom center',
							}}
						>
							{char}
						</span>
					);
				})}
			</span>
			{cursorBlink && (
				<span
					style={{
						color: PALETTE.amber,
						opacity: 0.9,
						textShadow: `0 0 8px rgba(217,119,6,0.7)`,
					}}
				>
					▌
				</span>
			)}
		</div>
	);
};

// ─── Scene 2: The Prompt ──────────────────────────────────────────────────────
export const Scene2Prompt: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps, width, height } = useVideoConfig();

	// Window constants (same as Scene1 for continuity)
	const winW = 900;
	const winH = 540;
	const winX = (width - winW) / 2;
	const winY = (height - winH) / 2;
	const titleBarH = 44;

	// Line 1: "$ claude" — starts at frame 0 of this scene
	// Line 2: "> Build me a full-stack app with auth" — starts at 1.2s in
	const line1Text = 'claude';
	const line1Start = 0;
	const line2Start = Math.round(1.2 * fps);
	const line2Text = 'Build me a full-stack app with auth';

	// CRT scan-line pulse
	const scanOpacity = 0.025 + Math.sin(frame * 0.06) * 0.008;

	// Subtle terminal breathe
	const breatheScale = 1 + Math.sin(frame * 0.04) * 0.0015;

	// Scene fade-in
	const sceneOpacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: 'clamp' });

	return (
		<AbsoluteFill
			style={{
				background: PALETTE.bgDeep,
				opacity: sceneOpacity,
			}}
		>

			{/* Ambient warm glow */}
			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse 600px 400px at 50% 50%, rgba(217,119,6,0.06) 0%, transparent 70%)`,
					pointerEvents: 'none',
				}}
			/>

			{/* Terminal window */}
			<div
				style={{
					position: 'absolute',
					left: winX,
					top: winY,
					width: winW,
					height: winH,
					background: PALETTE.termBg,
					border: `1.5px solid ${PALETTE.termBorder}`,
					borderRadius: 10,
					backdropFilter: 'blur(24px)',
					overflow: 'hidden',
					transform: `scale(${breatheScale})`,
					transformOrigin: 'center center',
					boxShadow: '0 24px 80px rgba(0,0,0,0.7), 0 0 40px rgba(217,119,6,0.04)',
				}}
			>
				{/* Title bar */}
				<div
					style={{
						height: titleBarH,
						background: 'rgba(255,255,255,0.035)',
						borderBottom: `1px solid ${PALETTE.termBorder}`,
						display: 'flex',
						alignItems: 'center',
						paddingLeft: 16,
						paddingRight: 16,
						gap: 8,
						position: 'relative',
					}}
				>
					{/* Traffic lights */}
					<div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF5F57' }} />
					<div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FEBC2E' }} />
					<div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28C840' }} />
					<span
						style={{
							position: 'absolute',
							left: '50%',
							transform: 'translateX(-50%)',
							fontFamily,
							fontSize: 12,
							fontWeight: 400,
							color: 'rgba(255,255,255,0.35)',
							letterSpacing: '0.01em',
						}}
					>
						claude — bash
					</span>
				</div>

				{/* Terminal content area */}
				<div
					style={{
						padding: '20px 28px',
						display: 'flex',
						flexDirection: 'column',
						gap: 4,
						position: 'relative',
					}}
				>
					{/* CRT scanlines overlay */}
					<div
						style={{
							position: 'absolute',
							inset: 0,
							background: `repeating-linear-gradient(
								0deg,
								transparent,
								transparent 3px,
								rgba(0,0,0,${scanOpacity}) 3px,
								rgba(0,0,0,${scanOpacity}) 4px
							)`,
							pointerEvents: 'none',
						}}
					/>

					{/* Line 1 — "$ claude" */}
					<TypewriterLine
						text={line1Text}
						charRevealFrame={2}
						startFrame={line1Start}
						color={PALETTE.amber}
						prefix="$"
						prefixColor={PALETTE.codeDim}
						fontSize={22}
					/>

					{/* Line 2 — "> Build me a full-stack app with auth" — appears after delay */}
					{frame >= line2Start - 4 && (
						<TypewriterLine
							text={line2Text}
							charRevealFrame={2}
							startFrame={line2Start}
							color={PALETTE.white}
							prefix=">"
							prefixColor="rgba(164,131,250,0.7)"
							fontSize={22}
						/>
					)}
				</div>

				{/* Vignette inside terminal */}
				<div
					style={{
						position: 'absolute',
						inset: 0,
						background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 50%, rgba(0,0,0,0.35) 100%)',
						pointerEvents: 'none',
						borderRadius: 10,
					}}
				/>
			</div>

		</AbsoluteFill>
	);
};
