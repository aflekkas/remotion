import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamily } from './fonts';
import { PALETTE } from './palette';
import { SERVER_TS, AUTH_TS, SCHEMA_PRISMA, APP_TSX, CodeLine } from './codeSnippets';

// ─── Code panel ───────────────────────────────────────────────────────────────
type PanelConfig = {
	title: string;
	code: CodeLine[];
	slideFrom: 'left' | 'right' | 'bottom' | 'top';
	rotate: number;      // degrees
	entranceDelay: number;
	x: number;           // absolute x
	y: number;           // absolute y
	zIndex: number;
	scrollSpeed: number; // px per frame for code scroll
};

const CodePanel: React.FC<PanelConfig & { frame: number; fps: number }> = ({
	title, code, slideFrom, rotate, entranceDelay, x, y, zIndex, scrollSpeed, frame, fps,
}) => {
	const panelW = 520;
	const panelH = 380;
	const lineH = 22;
	const maxScroll = Math.max(0, code.length * lineH - panelH + 60);

	const localFrame = frame - entranceDelay;

	const entrance = spring({
		frame: localFrame,
		fps,
		config: { damping: 18, stiffness: 80, mass: 0.9 },
	});

	// Slide direction
	let slideX = 0;
	let slideY = 0;
	const slideAmount = 120;
	if (slideFrom === 'left')   slideX = interpolate(entrance, [0, 1], [-slideAmount, 0], { extrapolateRight: 'clamp' });
	if (slideFrom === 'right')  slideX = interpolate(entrance, [0, 1], [slideAmount, 0], { extrapolateRight: 'clamp' });
	if (slideFrom === 'top')    slideY = interpolate(entrance, [0, 1], [-slideAmount, 0], { extrapolateRight: 'clamp' });
	if (slideFrom === 'bottom') slideY = interpolate(entrance, [0, 1], [slideAmount, 0], { extrapolateRight: 'clamp' });

	const opacity = interpolate(entrance, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' });

	// Code scrolling
	const scrollOffset = Math.min(maxScroll, Math.max(0, localFrame * scrollSpeed));

	if (localFrame < -5 || entrance < 0.005) return null;

	return (
		<div
			style={{
				position: 'absolute',
				left: x + slideX,
				top: y + slideY,
				width: panelW,
				height: panelH,
				background: 'rgba(13,17,23,0.92)',
				border: '1px solid rgba(255,255,255,0.10)',
				borderRadius: 10,
				overflow: 'hidden',
				opacity,
				transform: `rotate(${rotate}deg)`,
				zIndex,
				boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 0 30px rgba(124,58,237,0.06)',
				backdropFilter: 'blur(12px)',
			}}
		>
			{/* Panel title bar */}
			<div
				style={{
					height: 38,
					background: 'rgba(255,255,255,0.04)',
					borderBottom: '1px solid rgba(255,255,255,0.08)',
					display: 'flex',
					alignItems: 'center',
					paddingLeft: 14,
					paddingRight: 14,
					gap: 8,
					flexShrink: 0,
				}}
			>
				{/* Traffic lights — tiny */}
				<div style={{ width: 9, height: 9, borderRadius: '50%', background: '#FF5F57', opacity: 0.7 }} />
				<div style={{ width: 9, height: 9, borderRadius: '50%', background: '#FEBC2E', opacity: 0.7 }} />
				<div style={{ width: 9, height: 9, borderRadius: '50%', background: '#28C840', opacity: 0.7 }} />

				{/* File name */}
				<span
					style={{
						fontFamily,
						fontSize: 12,
						fontWeight: 500,
						color: 'rgba(255,255,255,0.5)',
						marginLeft: 8,
						letterSpacing: '0.01em',
					}}
				>
					{title}
				</span>

				{/* Modified indicator */}
				<div
					style={{
						width: 6, height: 6, borderRadius: '50%',
						background: PALETTE.amber,
						opacity: 0.8,
						marginLeft: 4,
					}}
				/>
			</div>

			{/* Code area */}
			<div
				style={{
					padding: '10px 16px',
					overflow: 'hidden',
					height: panelH - 38,
					position: 'relative',
				}}
			>
				{/* Line numbers + code */}
				<div
					style={{
						transform: `translateY(-${scrollOffset}px)`,
						display: 'flex',
						flexDirection: 'column',
						gap: 2,
					}}
				>
					{code.map((line, lineIdx) => (
						<div
							key={lineIdx}
							style={{
								display: 'flex',
								gap: 0,
								lineHeight: `${lineH}px`,
								minHeight: lineH,
							}}
						>
							{/* Line number */}
							<span
								style={{
									fontFamily: 'monospace',
									fontSize: 11,
									color: 'rgba(255,255,255,0.15)',
									width: 28,
									flexShrink: 0,
									userSelect: 'none',
									textAlign: 'right',
									paddingRight: 12,
									lineHeight: `${lineH}px`,
								}}
							>
								{lineIdx + 1}
							</span>
							{/* Code spans */}
							<span
								style={{
									fontFamily: 'monospace',
									fontSize: 12.5,
									lineHeight: `${lineH}px`,
									whiteSpace: 'pre',
								}}
							>
								{line.map((span, spanIdx) => (
									<span key={spanIdx} style={{ color: span.color }}>{span.text}</span>
								))}
							</span>
						</div>
					))}
				</div>

				{/* Fade out at bottom */}
				<div
					style={{
						position: 'absolute',
						bottom: 0, left: 0, right: 0,
						height: 60,
						background: 'linear-gradient(to top, rgba(13,17,23,0.95) 0%, transparent 100%)',
						pointerEvents: 'none',
					}}
				/>
			</div>
		</div>
	);
};

// ─── Scene 4: Code Cascade ─────────────────────────────────────────────────────
export const Scene4CodeCascade: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps, width, height } = useVideoConfig();

	const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
	const { durationInFrames } = useVideoConfig();
	const fadeOut = interpolate(frame, [durationInFrames - fps, durationInFrames], [1, 0], { extrapolateRight: 'clamp' });

	// Background ambient
	const bgShift = interpolate(frame, [0, durationInFrames], [0, 1], { extrapolateRight: 'clamp' });

	// Center the 4 panels in a 2x2-ish grid, slightly overlapping
	const panelW = 520;
	const gapX = 40;
	const gapY = 20;
	const gridW = panelW * 2 + gapX;
	const gridLeft = (width - gridW) / 2;
	const gridTop = height * 0.06;

	const panels: (PanelConfig)[] = [
		{
			title: 'server.ts',
			code: SERVER_TS,
			slideFrom: 'left',
			rotate: -1.5,
			entranceDelay: 0,
			x: gridLeft,
			y: gridTop,
			zIndex: 1,
			scrollSpeed: 0.4,
		},
		{
			title: 'auth.ts',
			code: AUTH_TS,
			slideFrom: 'right',
			rotate: 1.2,
			entranceDelay: 6,
			x: gridLeft + panelW + gapX,
			y: gridTop + 30,
			zIndex: 2,
			scrollSpeed: 0.45,
		},
		{
			title: 'schema.prisma',
			code: SCHEMA_PRISMA,
			slideFrom: 'bottom',
			rotate: -0.8,
			entranceDelay: 12,
			x: gridLeft + 60,
			y: gridTop + 340 + gapY,
			zIndex: 3,
			scrollSpeed: 0.35,
		},
		{
			title: 'App.tsx',
			code: APP_TSX,
			slideFrom: 'top',
			rotate: 1.8,
			entranceDelay: 18,
			x: gridLeft + panelW + gapX - 60,
			y: gridTop + 320 + gapY,
			zIndex: 4,
			scrollSpeed: 0.42,
		},
	];

	return (
		<AbsoluteFill
			style={{
				background: PALETTE.bgDeep,
				opacity: fadeIn * fadeOut,
			}}
		>
			{/* Deep gradient background */}
			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse 70% 60% at ${30 + bgShift * 40}% 50%, rgba(45,27,105,0.25) 0%, transparent 70%)`,
					pointerEvents: 'none',
				}}
			/>
			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse 50% 50% at 70% 60%, rgba(146,64,14,0.12) 0%, transparent 65%)`,
					pointerEvents: 'none',
				}}
			/>

			{/* Code panels */}
			{panels.map((panel) => (
				<CodePanel key={panel.title} {...panel} frame={frame} fps={fps} />
			))}

			{/* Vignette */}
			<AbsoluteFill
				style={{
					background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 55%, rgba(10,10,15,0.45) 100%)',
					pointerEvents: 'none',
				}}
			/>

			{/* Corner accents */}
			<svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.15 }}>
				<line x1={0} y1={0} x2={200} y2={0} stroke={PALETTE.amber} strokeWidth={0.8} />
				<line x1={0} y1={0} x2={0} y2={100} stroke={PALETTE.amber} strokeWidth={0.8} />
				<line x1={width} y1={height} x2={width - 200} y2={height} stroke={PALETTE.amber} strokeWidth={0.8} />
				<line x1={width} y1={height} x2={width} y2={height - 100} stroke={PALETTE.amber} strokeWidth={0.8} />
			</svg>

		</AbsoluteFill>
	);
};
