import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { noise2D } from '@remotion/noise';
import { PALETTE } from './palette';

// ─── Radial gradient orb ──────────────────────────────────────────────────────
type OrbProps = {
	seed: string;
	baseX: number;
	baseY: number;
	baseRadius: number;
	color1: string;
	color2: string;
	frame: number;
	fps: number;
	entranceDelay: number;
};

const Orb: React.FC<OrbProps> = ({
	seed, baseX, baseY, baseRadius, color1, color2, frame, fps, entranceDelay,
}) => {
	const localFrame = frame - entranceDelay;

	const entrance = spring({
		frame: localFrame,
		fps,
		config: { damping: 12, stiffness: 60, mass: 1.2 },
	});

	// Organic drift via noise
	const driftX = noise2D(seed + 'x', localFrame * 0.008, 0) * 80;
	const driftY = noise2D(seed + 'y', localFrame * 0.008, 0) * 60;
	const sizeNoise = noise2D(seed + 's', localFrame * 0.005, 0);

	const cx = baseX + driftX;
	const cy = baseY + driftY;
	const r = baseRadius * entrance * (1 + sizeNoise * 0.25);

	const opacity = interpolate(entrance, [0, 0.4, 1], [0, 0.6, 0.45], { extrapolateRight: 'clamp' });

	if (localFrame < 0 || entrance < 0.01) return null;

	return (
		<div
			style={{
				position: 'absolute',
				left: cx - r,
				top: cy - r,
				width: r * 2,
				height: r * 2,
				borderRadius: '50%',
				background: `radial-gradient(ellipse at 40% 35%, ${color1} 0%, ${color2} 50%, transparent 75%)`,
				opacity,
				pointerEvents: 'none',
				filter: 'blur(40px)',
				mixBlendMode: 'screen',
			}}
		/>
	);
};

// ─── Pulse ring radiating outward ─────────────────────────────────────────────
const PulseRing: React.FC<{ frame: number; delay: number; maxR: number; cx: number; cy: number }> = ({
	frame, delay, maxR, cx, cy,
}) => {
	const localFrame = Math.max(0, frame - delay);
	const duration = 45;
	const progress = (localFrame % duration) / duration;

	const r = progress * maxR;
	const opacity = interpolate(progress, [0, 0.3, 1], [0.5, 0.3, 0], { extrapolateRight: 'clamp' });

	return (
		<circle
			cx={cx} cy={cy} r={r}
			fill="none"
			stroke={PALETTE.amber}
			strokeWidth={1}
			opacity={opacity * 0.3}
		/>
	);
};

// ─── Dot grid radar pulse ─────────────────────────────────────────────────────
const DotGrid: React.FC<{ frame: number; cx: number; cy: number }> = ({ frame, cx, cy }) => {
	const dots = [];
	const step = 60;
	const cols = 16;
	const rows = 10;
	const startX = cx - (cols / 2) * step;
	const startY = cy - (rows / 2) * step;

	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			const x = startX + c * step;
			const y = startY + r * step;
			const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);

			// Wave ripple based on distance from center
			const wavePhase = (dist * 0.006 - frame * 0.05) % (Math.PI * 2);
			const pulse = (Math.sin(wavePhase) + 1) / 2;
			const dotOpacity = 0.04 + pulse * 0.12;

			dots.push(
				<circle
					key={`${r}-${c}`}
					cx={x} cy={y} r={2}
					fill={PALETTE.amberLight}
					opacity={dotOpacity}
				/>
			);
		}
	}
	return <>{dots}</>;
};

// ─── Scene 3: AI Thinking Surge ────────────────────────────────────────────────
export const Scene3ThinkingSurge: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps, width, height } = useVideoConfig();

	const cx = width / 2;
	const cy = height / 2;

	// Terminal vibration / breathe
	const winW = 900;
	const winH = 540;
	const winX = (width - winW) / 2;
	const winY = (height - winH) / 2;
	const titleBarH = 44;

	const vibX = noise2D('vib-x', frame * 0.3, 0) * 3;
	const vibY = noise2D('vib-y', frame * 0.3, 0) * 2;
	const breathe = 1 + Math.sin(frame * 0.08) * 0.004;

	// Energy pulse burst — springs out at frame 0, snappy
	const burstScale = spring({
		frame,
		fps,
		config: { damping: 6, stiffness: 120, mass: 0.7 },
	});
	const burstOpacity = interpolate(frame, [0, 5, 20, 45], [0, 0.8, 0.5, 0], { extrapolateRight: 'clamp' });

	// Scene fade in
	const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });

	return (
		<AbsoluteFill style={{ background: PALETTE.bgDeep, opacity: fadeIn }}>

			{/* Dot grid radar */}
			<svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.8 }}>
				<DotGrid frame={frame} cx={cx} cy={cy} />

				{/* Pulse rings */}
				{[0, 15, 30].map((delay) => (
					<PulseRing key={delay} frame={frame} delay={delay} maxR={480} cx={cx} cy={cy} />
				))}
			</svg>

			{/* Orbs bloom outward */}
			<AbsoluteFill>
				{[
					{ seed: 'orb0', bx: cx - 280, by: cy - 100, r: 260, c1: '#7C3AED', c2: '#2D1B69', delay: 2 },
					{ seed: 'orb1', bx: cx + 260, by: cy + 120, r: 220, c1: '#92400E', c2: '#D97706', delay: 6 },
					{ seed: 'orb2', bx: cx - 60, by: cy - 160, r: 280, c1: '#DA7756', c2: '#7C3AED', delay: 4 },
					{ seed: 'orb3', bx: cx + 140, by: cy - 140, r: 200, c1: '#D97706', c2: '#2D1B69', delay: 8 },
					{ seed: 'orb4', bx: cx - 200, by: cy + 160, r: 240, c1: '#2D1B69', c2: '#DA7756', delay: 3 },
					{ seed: 'orb5', bx: cx + 60, by: cy + 60, r: 180, c1: '#7C3AED', c2: '#D97706', delay: 10 },
				].map((orb) => (
					<Orb
						key={orb.seed}
						seed={orb.seed}
						baseX={orb.bx}
						baseY={orb.by}
						baseRadius={orb.r}
						color1={orb.c1}
						color2={orb.c2}
						frame={frame}
						fps={fps}
						entranceDelay={orb.delay}
					/>
				))}
			</AbsoluteFill>

			{/* Energy burst ring expanding from center */}
			<svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: burstOpacity }}>
				<circle
					cx={cx} cy={cy}
					r={burstScale * 500}
					fill="none"
					stroke={PALETTE.amber}
					strokeWidth={2}
				/>
			</svg>

			{/* Terminal window — vibrating */}
			<div
				style={{
					position: 'absolute',
					left: winX + vibX,
					top: winY + vibY,
					width: winW,
					height: winH,
					background: 'rgba(13,17,23,0.90)',
					border: `1.5px solid rgba(255,255,255,0.15)`,
					borderRadius: 10,
					backdropFilter: 'blur(16px)',
					overflow: 'hidden',
					transform: `scale(${breathe})`,
					transformOrigin: 'center center',
					boxShadow: '0 24px 80px rgba(0,0,0,0.8), 0 0 60px rgba(217,119,6,0.06)',
				}}
			>
				{/* Title bar */}
				<div
					style={{
						height: titleBarH,
						background: 'rgba(255,255,255,0.035)',
						borderBottom: '1px solid rgba(255,255,255,0.08)',
						display: 'flex',
						alignItems: 'center',
						paddingLeft: 16,
						gap: 8,
					}}
				>
					<div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF5F57' }} />
					<div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FEBC2E' }} />
					<div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28C840' }} />
				</div>

				{/* Content */}
				<div style={{ padding: '20px 28px' }}>
					<div
						style={{
							fontFamily: 'monospace',
							fontSize: 22,
							color: PALETTE.amber,
							display: 'flex',
							gap: 6,
						}}
					>
						<span style={{ color: 'rgba(107,114,128,0.7)' }}>$</span>
						<span>claude</span>
					</div>
					<div
						style={{
							fontFamily: 'monospace',
							fontSize: 22,
							color: PALETTE.white,
							marginTop: 4,
							display: 'flex',
							gap: 6,
						}}
					>
						<span style={{ color: 'rgba(164,131,250,0.7)' }}>{'>'}</span>
						<span>Build me a full-stack app with auth</span>
					</div>

					{/* Thinking indicator */}
					<div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
						{[0, 1, 2].map((i) => {
							const phase = ((frame + i * 8) % 24) / 24;
							const scale = 0.7 + Math.sin(phase * Math.PI * 2) * 0.3;
							return (
								<div
									key={i}
									style={{
										width: 8,
										height: 8,
										borderRadius: '50%',
										background: PALETTE.terracotta,
										transform: `scale(${scale})`,
										opacity: 0.6 + Math.sin(phase * Math.PI * 2) * 0.4,
									}}
								/>
							);
						})}
						<span
							style={{
								fontFamily: 'monospace',
								fontSize: 16,
								color: 'rgba(218,119,86,0.7)',
								letterSpacing: '0.05em',
							}}
						>
							Thinking...
						</span>
					</div>
				</div>
			</div>

			{/* Subtle vignette */}
			<AbsoluteFill
				style={{
					background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(10,10,15,0.55) 100%)',
					pointerEvents: 'none',
				}}
			/>

		</AbsoluteFill>
	);
};
