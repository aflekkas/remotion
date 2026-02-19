import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {Background} from '../Background';
import {COLORS, SPRINGS} from '../constants';
import {textStyles} from '../fonts';

type Benefit = {
	icon: string;
	title: string;
	desc: string;
	color: string;
	accentColor: string;
};

const BENEFITS: Benefit[] = [
	{
		icon: '◎',
		title: 'Real-time feedback',
		desc: 'AI analyses your form frame-by-frame. No delay, no guessing.',
		color: COLORS.blue,
		accentColor: COLORS.blueGlow,
	},
	{
		icon: '◈',
		title: 'Track every rep',
		desc: 'Full session history. See your form improve over time.',
		color: COLORS.green,
		accentColor: COLORS.greenGlow,
	},
	{
		icon: '◆',
		title: 'Fix form instantly',
		desc: 'Specific, actionable cues — not just "good job" or "keep going".',
		color: COLORS.blue,
		accentColor: COLORS.blueGlow,
	},
];

// Animated icon — bounces and glows
const BenefitIcon: React.FC<{
	icon: string;
	color: string;
	frame: number;
	delay: number;
}> = ({icon, color, frame, delay}) => {
	const localFrame = frame - delay;
	const s = spring({frame: localFrame, fps: 30, config: SPRINGS.elastic});
	const scale = interpolate(s, [0, 1], [0, 1]);
	const rotation = interpolate(s, [0, 0.6, 1], [0, -15, 0]);
	const glow = 0.6 + Math.sin(frame * 0.08 + delay * 0.5) * 0.4;

	return (
		<div
			style={{
				width: 64,
				height: 64,
				borderRadius: 16,
				background: `${color}15`,
				border: `1.5px solid ${color}60`,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				fontSize: 28,
				color,
				transform: `scale(${scale}) rotate(${rotation}deg)`,
				opacity: Math.min(1, s),
				boxShadow: `0 0 ${20 * glow}px ${color}40, inset 0 0 20px ${color}10`,
				flexShrink: 0,
			}}
		>
			{icon}
		</div>
	);
};

const BenefitCard: React.FC<{
	benefit: Benefit;
	index: number;
	frame: number;
	fps: number;
}> = ({benefit, index, frame, fps}) => {
	const delay = index * 18;
	const localFrame = frame - delay;

	const cardSpring = spring({
		frame: localFrame,
		fps,
		config: SPRINGS.gentle,
	});

	const cardX = interpolate(cardSpring, [0, 1], [-80, 0]);
	const cardOpacity = interpolate(cardSpring, [0, 0.3], [0, 1], {
		extrapolateRight: 'clamp',
	});

	// Hover-like subtle float using noise-ish sin
	const floatY = Math.sin(frame * 0.04 + index * 1.2) * 3;

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'flex-start',
				gap: 24,
				background: `linear-gradient(135deg, ${benefit.color}08 0%, transparent 100%)`,
				border: `1px solid ${benefit.color}20`,
				borderRadius: 20,
				padding: '28px 32px',
				transform: `translateX(${cardX}px) translateY(${floatY}px)`,
				opacity: cardOpacity,
				boxShadow: `0 0 40px ${benefit.accentColor}`,
				backdropFilter: 'blur(4px)',
			}}
		>
			<BenefitIcon
				icon={benefit.icon}
				color={benefit.color}
				frame={frame}
				delay={delay}
			/>

			<div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
				<div
					style={{
						...textStyles.heading,
						fontSize: 26,
						color: COLORS.white,
					}}
				>
					{benefit.title}
				</div>
				<div
					style={{
						...textStyles.body,
						fontSize: 17,
						color: COLORS.muted,
						maxWidth: 480,
					}}
				>
					{benefit.desc}
				</div>
			</div>

			{/* Accent bar on left edge */}
			<div
				style={{
					position: 'absolute',
					left: 0,
					top: '20%',
					width: 3,
					height: '60%',
					background: `linear-gradient(to bottom, transparent, ${benefit.color}, transparent)`,
					borderRadius: 2,
					opacity: Math.min(1, cardSpring),
				}}
			/>
		</div>
	);
};

export const Scene4Benefits: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Header springs in
	const headerSpring = spring({
		frame: frame - 0,
		fps,
		config: SPRINGS.gentle,
	});
	const headerY = interpolate(headerSpring, [0, 1], [-40, 0]);

	// Divider line draws across
	const lineProgress = interpolate(frame, [10, 35], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill>
			<Background />

			<AbsoluteFill
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					paddingLeft: 160,
					paddingRight: 160,
					gap: 32,
				}}
			>
				{/* Section header */}
				<div
					style={{
						transform: `translateY(${headerY}px)`,
						opacity: headerSpring,
					}}
				>
					<div
						style={{
							...textStyles.label,
							fontSize: 13,
							color: COLORS.green,
							letterSpacing: '0.28em',
							textTransform: 'uppercase',
							marginBottom: 8,
						}}
					>
						Why it works
					</div>
					<div
						style={{
							...textStyles.hero,
							fontSize: 60,
							background: `linear-gradient(90deg, ${COLORS.white} 0%, ${COLORS.blue} 100%)`,
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							backgroundClip: 'text',
							display: 'block',
						}}
					>
						Everything a coach does.
					</div>
					<div
						style={{
							...textStyles.hero,
							fontSize: 60,
							color: COLORS.muted,
							display: 'block',
						}}
					>
						At zero cost.
					</div>
				</div>

				{/* Animated divider */}
				<div
					style={{
						height: 1,
						width: `${lineProgress * 100}%`,
						background: `linear-gradient(90deg, ${COLORS.blue}80, transparent)`,
					}}
				/>

				{/* Benefit cards */}
				<div style={{display: 'flex', flexDirection: 'column', gap: 16, position: 'relative'}}>
					{BENEFITS.map((b, i) => (
						<BenefitCard key={i} benefit={b} index={i} frame={frame} fps={fps} />
					))}
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
