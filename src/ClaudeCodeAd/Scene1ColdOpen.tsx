import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamily } from './fonts';
import { PALETTE } from './palette';

// ─── Animated border segment that draws itself from center outward ─────────────
type BorderSegmentProps = {
	progress: number;
	x1: number; y1: number;
	x2: number; y2: number;
	color: string;
};

const BorderSegment: React.FC<BorderSegmentProps> = ({ progress, x1, y1, x2, y2, color }) => {
	const cx = x1 + (x2 - x1) * 0.5;
	const cy = y1 + (y2 - y1) * 0.5;
	const dx = (x2 - x1) * 0.5 * progress;
	const dy = (y2 - y1) * 0.5 * progress;
	return (
		<line
			x1={cx - dx} y1={cy - dy}
			x2={cx + dx} y2={cy + dy}
			stroke={color}
			strokeWidth={1.5}
			strokeLinecap="round"
		/>
	);
};

// ─── Scene 1: Cold Open ────────────────────────────────────────────────────────
export const Scene1ColdOpen: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps, width, height } = useVideoConfig();

	// Cursor blink — appears at frame 0, blinks every 0.5s
	const cursorOpacity = frame < 5
		? interpolate(frame, [0, 5], [0, 1], { extrapolateRight: 'clamp' })
		: Math.sin(frame * (Math.PI / (fps * 0.5))) > 0 ? 1 : 0.15;

	// Window border draws in from 0.3s — snappy
	const borderProgress = spring({
		frame: frame - Math.round(0.3 * fps),
		fps,
		config: { damping: 200, stiffness: 120, mass: 0.6 },
	});

	// Window dimensions (centered)
	const winW = 900;
	const winH = 540;
	const winX = (width - winW) / 2;
	const winY = (height - winH) / 2;
	const titleBarH = 44;

	// Window fade in — fast
	const winAppear = Math.round(0.3 * fps);
	const windowOpacity = interpolate(frame, [winAppear - 3, winAppear + 3], [0, 1], {
		extrapolateRight: 'clamp',
		extrapolateLeft: 'clamp',
	});

	// Traffic lights spring in staggered — fast
	const dot1 = spring({ frame: frame - (winAppear + 4), fps, config: { damping: 10, stiffness: 200, mass: 0.4 } });
	const dot2 = spring({ frame: frame - (winAppear + 7), fps, config: { damping: 10, stiffness: 200, mass: 0.4 } });
	const dot3 = spring({ frame: frame - (winAppear + 10), fps, config: { damping: 10, stiffness: 200, mass: 0.4 } });

	// Ambient glow from cursor
	const glowPulse = 0.4 + Math.sin(frame * 0.08) * 0.15;

	return (
		<AbsoluteFill style={{ background: PALETTE.bgDeep }}>

			{/* Ambient cursor glow */}
			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse 320px 220px at 50% 50%, rgba(217,119,6,${glowPulse * 0.18}) 0%, transparent 70%)`,
					pointerEvents: 'none',
				}}
			/>

			{/* Terminal window SVG border — draws itself in */}
			<svg
				style={{
					position: 'absolute',
					inset: 0,
					width: '100%',
					height: '100%',
					opacity: windowOpacity,
				}}
			>
				{/* Window body fill */}
				<rect
					x={winX} y={winY}
					width={winW} height={winH}
					fill="rgba(13,17,23,0.82)"
					rx={10}
				/>
				{/* Title bar */}
				<rect
					x={winX} y={winY}
					width={winW} height={titleBarH}
					fill="rgba(255,255,255,0.04)"
					rx={10}
				/>
				{/* Bottom corners fix */}
				<rect
					x={winX} y={winY + titleBarH - 4}
					width={winW} height={4}
					fill="rgba(255,255,255,0.04)"
				/>
				{/* Frosted scan lines — very subtle */}
				{Array.from({ length: 12 }).map((_, i) => (
					<line
						key={i}
						x1={winX} y1={winY + titleBarH + (winH - titleBarH) / 12 * i}
						x2={winX + winW} y2={winY + titleBarH + (winH - titleBarH) / 12 * i}
						stroke="rgba(255,255,255,0.012)"
						strokeWidth={1}
					/>
				))}

				{/* Top border */}
				<BorderSegment progress={borderProgress}
					x1={winX} y1={winY} x2={winX + winW} y2={winY}
					color={PALETTE.termBorder} />
				{/* Bottom border */}
				<BorderSegment progress={borderProgress}
					x1={winX} y1={winY + winH} x2={winX + winW} y2={winY + winH}
					color={PALETTE.termBorder} />
				{/* Left border */}
				<BorderSegment progress={borderProgress}
					x1={winX} y1={winY} x2={winX} y2={winY + winH}
					color={PALETTE.termBorder} />
				{/* Right border */}
				<BorderSegment progress={borderProgress}
					x1={winX + winW} y1={winY} x2={winX + winW} y2={winY + winH}
					color={PALETTE.termBorder} />
				{/* Title bar divider */}
				<BorderSegment progress={borderProgress}
					x1={winX} y1={winY + titleBarH} x2={winX + winW} y2={winY + titleBarH}
					color={PALETTE.termBorder} />

				{/* Traffic light dots */}
				{[
					{ cx: winX + 18, fill: '#FF5F57', s: dot1 },
					{ cx: winX + 38, fill: '#FEBC2E', s: dot2 },
					{ cx: winX + 58, fill: '#28C840', s: dot3 },
				].map(({ cx, fill, s }) => (
					<circle
						key={cx}
						cx={cx} cy={winY + titleBarH / 2}
						r={6 * s}
						fill={fill}
						opacity={0.9}
					/>
				))}

				{/* Window title */}
				<text
					x={winX + winW / 2}
					y={winY + titleBarH / 2 + 5}
					textAnchor="middle"
					fill="rgba(255,255,255,0.35)"
					fontSize={12}
					fontFamily={fontFamily}
					fontWeight={400}
					opacity={borderProgress}
				>
					claude — bash
				</text>
			</svg>

			{/* Cursor — centered, inside terminal */}
			<div
				style={{
					position: 'absolute',
					left: winX + 28,
					top: winY + titleBarH + 28,
					fontFamily,
					fontSize: 22,
					fontWeight: 400,
					color: PALETTE.amber,
					opacity: cursorOpacity,
					letterSpacing: '-0.02em',
					lineHeight: 1,
					textShadow: `0 0 12px rgba(217,119,6,0.8), 0 0 24px rgba(217,119,6,0.4)`,
					pointerEvents: 'none',
				}}
			>
				▌
			</div>

			{/* Corner energy flow — decorative lines emanating from window corners */}
			<svg
				style={{
					position: 'absolute',
					inset: 0,
					width: '100%',
					height: '100%',
					opacity: interpolate(borderProgress, [0, 1], [0, 0.18], { extrapolateRight: 'clamp' }),
					pointerEvents: 'none',
				}}
			>
				{/* Outer corner traces */}
				<line x1={winX - 40} y1={winY} x2={winX} y2={winY} stroke={PALETTE.amber} strokeWidth={0.8} />
				<line x1={winX} y1={winY - 30} x2={winX} y2={winY} stroke={PALETTE.amber} strokeWidth={0.8} />
				<line x1={winX + winW} y1={winY - 30} x2={winX + winW} y2={winY} stroke={PALETTE.amber} strokeWidth={0.8} />
				<line x1={winX + winW} y1={winY} x2={winX + winW + 40} y2={winY} stroke={PALETTE.amber} strokeWidth={0.8} />
				<line x1={winX - 40} y1={winY + winH} x2={winX} y2={winY + winH} stroke={PALETTE.amber} strokeWidth={0.8} />
				<line x1={winX} y1={winY + winH} x2={winX} y2={winY + winH + 30} stroke={PALETTE.amber} strokeWidth={0.8} />
				<line x1={winX + winW} y1={winY + winH} x2={winX + winW + 40} y2={winY + winH} stroke={PALETTE.amber} strokeWidth={0.8} />
				<line x1={winX + winW} y1={winY + winH} x2={winX + winW} y2={winY + winH + 30} stroke={PALETTE.amber} strokeWidth={0.8} />
			</svg>

		</AbsoluteFill>
	);
};
