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

// Animated scanning line that sweeps top-to-bottom in a loop
const ScanLine: React.FC<{frame: number; height: number}> = ({frame, height}) => {
	const cycle = 60; // frames per sweep
	const progress = (frame % cycle) / cycle;
	const y = progress * height;
	const trailOpacity = interpolate(progress, [0, 0.1, 0.9, 1], [0, 1, 1, 0], {
		extrapolateRight: 'clamp',
	});

	return (
		<>
			{/* Main scan line */}
			<div
				style={{
					position: 'absolute',
					left: 0,
					top: y,
					width: '100%',
					height: 2,
					background: `linear-gradient(90deg, transparent, ${COLORS.blue}CC, ${COLORS.blue}, ${COLORS.blue}CC, transparent)`,
					boxShadow: `0 0 12px ${COLORS.blue}, 0 0 30px ${COLORS.blueGlow}`,
					opacity: trailOpacity,
				}}
			/>
			{/* Trailing gradient */}
			<div
				style={{
					position: 'absolute',
					left: 0,
					top: Math.max(0, y - 60),
					width: '100%',
					height: 60,
					background: `linear-gradient(to bottom, transparent, ${COLORS.blue}08)`,
					opacity: trailOpacity,
				}}
			/>
		</>
	);
};

// Tracking joint dot with pulsing ring
const TrackingDot: React.FC<{
	cx: number;
	cy: number;
	color: string;
	frame: number;
	delay: number;
	label?: string;
}> = ({cx, cy, color, frame, delay, label}) => {
	const localFrame = frame - delay;
	const appear = spring({
		frame: localFrame,
		fps: 30,
		config: SPRINGS.elastic,
	});
	const pulseScale = 1 + Math.sin(frame * 0.12 + delay) * 0.4;
	const dotNudgeX = noise2D('dot-nx' + delay, frame * 0.015, 0) * 3;
	const dotNudgeY = noise2D('dot-ny' + delay, 0, frame * 0.015) * 3;

	return (
		<g
			transform={`translate(${cx + dotNudgeX}, ${cy + dotNudgeY})`}
			opacity={Math.min(1, appear)}
		>
			{/* Outer pulsing ring */}
			<circle
				r={10 * pulseScale}
				fill="none"
				stroke={color}
				strokeWidth={1}
				opacity={0.4}
			/>
			{/* Mid ring */}
			<circle r={7} fill={`${color}20`} stroke={color} strokeWidth={1} opacity={0.7} />
			{/* Core dot */}
			<circle r={3.5} fill={color} opacity={0.95} />

			{/* Optional label */}
			{label && (
				<text
					x={14}
					y={4}
					fontSize={9}
					fill={color}
					opacity={0.8}
					fontFamily="monospace"
				>
					{label}
				</text>
			)}
		</g>
	);
};

// Phone mockup outline drawn with SVG
const PhoneMockup: React.FC<{frame: number; drawProgress: number}> = ({
	frame,
	drawProgress,
}) => {
	const W = 280;
	const H = 520;
	const R = 36;
	const perim = 2 * (W + H - 4 * R) + 2 * Math.PI * R; // approximate perimeter
	const strokeDash = perim;
	const strokeOffset = perim * (1 - drawProgress);

	return (
		<div style={{position: 'relative', width: W, height: H}}>
			<svg
				viewBox={`0 0 ${W} ${H}`}
				width={W}
				height={H}
				style={{position: 'absolute', top: 0, left: 0}}
			>
				<defs>
					<filter id="phone-glow">
						<feGaussianBlur stdDeviation="3" result="blur" />
						<feMerge>
							<feMergeNode in="blur" />
							<feMergeNode in="SourceGraphic" />
						</feMerge>
					</filter>
					<clipPath id="phone-clip">
						<rect x={2} y={2} width={W - 4} height={H - 4} rx={R} ry={R} />
					</clipPath>
				</defs>

				{/* Phone body fill — very subtle */}
				<rect
					x={2}
					y={2}
					width={W - 4}
					height={H - 4}
					rx={R}
					ry={R}
					fill={`${COLORS.bgNavy}CC`}
				/>

				{/* Screen content area with scan lines */}
				<g clipPath="url(#phone-clip)">
					{/* Screen bg */}
					<rect x={16} y={48} width={W - 32} height={H - 80} rx={8} fill={`${COLORS.bgDeep}`} />

					{/* Scanning line inside phone screen */}
					<g clipPath="url(#phone-clip)">
						<ScanLine frame={frame} height={H - 80} />
					</g>

					{/* Body tracking skeleton inside phone */}
					<g transform={`translate(${W / 2}, ${(H - 80) / 2 + 30})`}>
						{/* Simplified skeleton lines */}
						<line x1={0} y1={-130} x2={0} y2={-90} stroke={`${COLORS.blue}60`} strokeWidth={1.5} />
						<line x1={-50} y1={-70} x2={50} y2={-70} stroke={`${COLORS.blue}60`} strokeWidth={1.5} />
						<line x1={-50} y1={-70} x2={-60} y2={10} stroke={`${COLORS.blue}60`} strokeWidth={1.5} />
						<line x1={50} y1={-70} x2={60} y2={10} stroke={`${COLORS.blue}60`} strokeWidth={1.5} />
						<line x1={-20} y1={10} x2={-35} y2={100} stroke={`${COLORS.green}60`} strokeWidth={1.5} />
						<line x1={20} y1={10} x2={35} y2={100} stroke={`${COLORS.green}60`} strokeWidth={1.5} />

						{/* Joint dots */}
						<TrackingDot cx={0} cy={-145} color={COLORS.blue} frame={frame} delay={5} label="HEAD" />
						<TrackingDot cx={-50} cy={-70} color={COLORS.blue} frame={frame} delay={10} label="L.SH" />
						<TrackingDot cx={50} cy={-70} color={COLORS.blue} frame={frame} delay={15} label="R.SH" />
						<TrackingDot cx={0} cy={10} color={COLORS.green} frame={frame} delay={20} label="HIP" />
						<TrackingDot cx={-35} cy={100} color={COLORS.green} frame={frame} delay={25} />
						<TrackingDot cx={35} cy={100} color={COLORS.green} frame={frame} delay={30} />
					</g>

					{/* UI status bar at bottom of screen */}
					<rect
						x={16}
						y={H - 96}
						width={W - 32}
						height={36}
						rx={6}
						fill={`${COLORS.blue}15`}
						stroke={`${COLORS.blue}30`}
						strokeWidth={1}
					/>
					<text
						x={W / 2}
						y={H - 74}
						textAnchor="middle"
						fontSize={10}
						fill={COLORS.blue}
						fontFamily="monospace"
						opacity={0.9}
					>
						ANALYZING FORM...
					</text>
				</g>

				{/* Phone outline — drawn via stroke-dashoffset */}
				<rect
					x={2}
					y={2}
					width={W - 4}
					height={H - 4}
					rx={R}
					ry={R}
					fill="none"
					stroke={COLORS.blue}
					strokeWidth={2}
					strokeDasharray={strokeDash}
					strokeDashoffset={strokeOffset}
					filter="url(#phone-glow)"
				/>

				{/* Camera notch */}
				<rect
					x={W / 2 - 28}
					y={8}
					width={56}
					height={14}
					rx={7}
					fill={`${COLORS.bgDeep}`}
					stroke={`${COLORS.blue}40`}
					strokeWidth={1}
					opacity={drawProgress}
				/>

				{/* Side buttons */}
				<rect
					x={W - 4}
					y={120}
					width={4}
					height={50}
					rx={2}
					fill={COLORS.blue}
					opacity={drawProgress * 0.5}
				/>
			</svg>
		</div>
	);
};

export const Scene3Solution: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// App name springs in from top
	const titleSpring = spring({
		frame: frame - 0,
		fps,
		config: SPRINGS.gentle,
	});
	const titleY = interpolate(titleSpring, [0, 1], [-60, 0]);

	// Phone draws in — outline traces over 40 frames
	const phoneDrawProgress = interpolate(frame, [8, 48], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const phoneSpring = spring({
		frame: frame - 8,
		fps,
		config: SPRINGS.gentle,
	});
	const phoneScale = interpolate(phoneSpring, [0, 1], [0.7, 1]);
	const phoneOpacity = interpolate(frame, [8, 28], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Subtitle fades in
	const subtitleOpacity = interpolate(frame, [50, 70], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const subtitleY = interpolate(frame, [50, 70], [20, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// "AI-powered" badge
	const badgeSpring = spring({
		frame: frame - 65,
		fps,
		config: SPRINGS.elastic,
	});

	// Floating accuracy badge to the right of phone
	const accuracyPulse = 1 + Math.sin(frame * 0.1) * 0.04;

	return (
		<AbsoluteFill>
			<Background />

			{/* Left side — text */}
			<AbsoluteFill
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					paddingLeft: 120,
					paddingRight: '52%',
					gap: 32,
				}}
			>
				{/* Label */}
				<div
					style={{
						...textStyles.label,
						fontSize: 13,
						color: COLORS.green,
						letterSpacing: '0.28em',
						textTransform: 'uppercase',
						opacity: titleSpring,
					}}
				>
					Introducing
				</div>

				{/* App name */}
				<div
					style={{
						transform: `translateY(${titleY}px)`,
						opacity: titleSpring,
					}}
				>
					<div
						style={{
							...textStyles.hero,
							fontSize: 76,
							background: `linear-gradient(135deg, ${COLORS.white} 0%, ${COLORS.blue} 100%)`,
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							backgroundClip: 'text',
							display: 'block',
							lineHeight: 0.95,
							filter: `drop-shadow(0 0 30px ${COLORS.blueGlow})`,
						}}
					>
						FORM
					</div>
					<div
						style={{
							...textStyles.hero,
							fontSize: 76,
							background: `linear-gradient(135deg, ${COLORS.blue} 0%, ${COLORS.green} 100%)`,
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							backgroundClip: 'text',
							display: 'block',
							lineHeight: 0.95,
							filter: `drop-shadow(0 0 30px ${COLORS.greenGlow})`,
						}}
					>
						CHECK
					</div>
					<div
						style={{
							...textStyles.hero,
							fontSize: 76,
							color: COLORS.green,
							display: 'block',
							lineHeight: 0.95,
							filter: `drop-shadow(0 0 30px ${COLORS.greenGlow})`,
						}}
					>
						AI
					</div>
				</div>

				{/* Subtitle */}
				<div
					style={{
						opacity: subtitleOpacity,
						transform: `translateY(${subtitleY}px)`,
					}}
				>
					<div
						style={{
							...textStyles.body,
							fontSize: 18,
							color: COLORS.muted,
							maxWidth: 420,
						}}
					>
						Real-time computer vision that tracks every joint,
						every rep — like a coach in your pocket.
					</div>
				</div>

				{/* AI-powered badge */}
				<div
					style={{
						display: 'inline-flex',
						alignItems: 'center',
						gap: 10,
						background: `linear-gradient(135deg, ${COLORS.green}20, ${COLORS.blue}20)`,
						border: `1px solid ${COLORS.green}50`,
						borderRadius: 100,
						padding: '10px 20px',
						transform: `scale(${badgeSpring})`,
						opacity: badgeSpring,
						transformOrigin: 'left center',
						alignSelf: 'flex-start',
						boxShadow: `0 0 20px ${COLORS.greenGlow}`,
					}}
				>
					<div style={{width: 8, height: 8, borderRadius: '50%', background: COLORS.green, boxShadow: `0 0 8px ${COLORS.green}`}} />
					<span style={{...textStyles.label, fontSize: 13, color: COLORS.green, letterSpacing: '0.12em'}}>
						AI-POWERED FORM ANALYSIS
					</span>
				</div>
			</AbsoluteFill>

			{/* Right side — phone mockup */}
			<div
				style={{
					position: 'absolute',
					right: 160,
					top: '50%',
					transform: `translateY(-50%) scale(${phoneScale})`,
					opacity: phoneOpacity,
				}}
			>
				<PhoneMockup frame={frame} drawProgress={phoneDrawProgress} />

				{/* Accuracy badge floating beside phone */}
				<div
					style={{
						position: 'absolute',
						top: 80,
						right: -160,
						background: `${COLORS.bgNavy}EE`,
						border: `1px solid ${COLORS.green}50`,
						borderRadius: 12,
						padding: '14px 20px',
						transform: `scale(${accuracyPulse})`,
						opacity: Math.min(1, phoneSpring),
						boxShadow: `0 0 30px ${COLORS.greenGlow}`,
					}}
				>
					<div style={{...textStyles.hero, fontSize: 32, color: COLORS.green}}>98.7%</div>
					<div style={{...textStyles.label, fontSize: 11, color: COLORS.muted, letterSpacing: '0.1em', marginTop: 4}}>
						ACCURACY
					</div>
				</div>

				{/* Latency badge */}
				<div
					style={{
						position: 'absolute',
						bottom: 100,
						right: -150,
						background: `${COLORS.bgNavy}EE`,
						border: `1px solid ${COLORS.blue}50`,
						borderRadius: 12,
						padding: '12px 18px',
						opacity: Math.min(1, phoneSpring),
						boxShadow: `0 0 20px ${COLORS.blueGlow}`,
					}}
				>
					<div style={{...textStyles.hero, fontSize: 28, color: COLORS.blue}}>{'<'}10ms</div>
					<div style={{...textStyles.label, fontSize: 11, color: COLORS.muted, letterSpacing: '0.1em', marginTop: 4}}>
						RESPONSE
					</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};
