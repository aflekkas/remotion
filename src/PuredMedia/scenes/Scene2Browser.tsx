import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	Easing,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {COLORS} from '../constants';
import {spaceGroteskFontFamily, interFontFamily} from '../fonts';

// Browser chrome top bar
const BrowserChrome: React.FC = () => {
	return (
		<div
			style={{
				height: 44,
				backgroundColor: '#141416',
				borderBottom: `1px solid ${COLORS.border}`,
				display: 'flex',
				alignItems: 'center',
				paddingLeft: 16,
				paddingRight: 16,
				gap: 8,
				flexShrink: 0,
			}}
		>
			{/* Traffic lights */}
			<div style={{display: 'flex', gap: 6, alignItems: 'center'}}>
				{['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
					<div
						key={c}
						style={{
							width: 10,
							height: 10,
							borderRadius: '50%',
							backgroundColor: c,
							opacity: 0.6,
						}}
					/>
				))}
			</div>

			{/* Address bar */}
			<div
				style={{
					flex: 1,
					maxWidth: 400,
					margin: '0 auto',
					height: 26,
					backgroundColor: '#1C1C20',
					border: `1px solid ${COLORS.border}`,
					borderRadius: 4,
					display: 'flex',
					alignItems: 'center',
					paddingLeft: 10,
					paddingRight: 10,
					gap: 6,
				}}
			>
				{/* Lock icon */}
				<svg width="10" height="12" viewBox="0 0 10 12" fill="none">
					<rect x="1" y="5" width="8" height="7" rx="1" fill="#4A4A50" />
					<path
						d="M3 5V3.5a2 2 0 014 0V5"
						stroke="#4A4A50"
						strokeWidth="1.2"
						fill="none"
					/>
				</svg>
				<span
					style={{
						fontSize: 11,
						fontFamily: interFontFamily,
						color: '#6B6B75',
						letterSpacing: '0.01em',
					}}
				>
					puredmedia.com
				</span>
			</div>

			{/* Right spacer */}
			<div style={{width: 68}} />
		</div>
	);
};

// Grid line pattern background
const GridPattern: React.FC = () => {
	return (
		<div
			style={{
				position: 'absolute',
				inset: 0,
				backgroundImage: `
					linear-gradient(${COLORS.border} 1px, transparent 1px),
					linear-gradient(90deg, ${COLORS.border} 1px, transparent 1px)
				`,
				backgroundSize: '40px 40px',
				opacity: 0.4,
			}}
		/>
	);
};

// Service card
const ServiceCard: React.FC<{
	title: string;
	description: string;
	isHovered: boolean;
	accentProgress: number;
}> = ({title, description, isHovered, accentProgress}) => {
	const borderColor = isHovered
		? interpolate(accentProgress, [0, 1], [0, 1]) > 0.5
			? COLORS.accent
			: COLORS.borderMid
		: COLORS.border;

	const bgOpacity = isHovered ? interpolate(accentProgress, [0, 1], [0, 0.06]) : 0;

	return (
		<div
			style={{
				flex: 1,
				border: `1px solid ${borderColor}`,
				padding: '24px 20px',
				backgroundColor: `rgba(196,163,90,${bgOpacity})`,
				position: 'relative',
			}}
		>
			{/* Accent dot */}
			{isHovered && (
				<div
					style={{
						position: 'absolute',
						top: 16,
						right: 16,
						width: 4,
						height: 4,
						borderRadius: '50%',
						backgroundColor: COLORS.accent,
						opacity: accentProgress,
					}}
				/>
			)}
			<div
				style={{
					fontSize: 11,
					fontFamily: interFontFamily,
					fontWeight: 400,
					color: COLORS.accent,
					letterSpacing: '0.12em',
					textTransform: 'uppercase' as const,
					marginBottom: 10,
				}}
			>
				{title}
			</div>
			<div
				style={{
					fontSize: 13,
					fontFamily: interFontFamily,
					fontWeight: 300,
					color: COLORS.textDim,
					lineHeight: 1.6,
				}}
			>
				{description}
			</div>
		</div>
	);
};

// Animated cursor
const Cursor: React.FC<{x: number; y: number}> = ({x, y}) => {
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				width: 12,
				height: 12,
				borderRadius: '50%',
				border: `1px solid rgba(250,250,249,0.7)`,
				backgroundColor: 'rgba(250,250,249,0.15)',
				transform: 'translate(-50%, -50%)',
				pointerEvents: 'none',
				zIndex: 100,
			}}
		/>
	);
};

export const Scene2Browser: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Browser entrance — spring scale + translate from above
	const browserEnterScale = spring({
		frame,
		fps,
		config: {damping: 200, stiffness: 100, mass: 1},
		durationInFrames: 30,
	});

	const browserY = interpolate(browserEnterScale, [0, 1], [60, 0], {
		extrapolateRight: 'clamp',
	});

	// Perspective tilt — subtle, breathes slowly
	const tiltY = interpolate(frame, [0, 108], [-2.5, 2.5], {
		extrapolateRight: 'clamp',
	});

	// Page scroll animation — starts at frame 30
	const scrollProgress = interpolate(frame, [30, 90], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
	});
	const pageScrollY = interpolate(scrollProgress, [0, 1], [0, -120], {
		extrapolateRight: 'clamp',
	});

	// Cursor movement — travels from center to Strategy card
	// Cursor sits still until frame 50, then moves to card
	const cursorMoveProgress = interpolate(frame, [50, 80], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.4, 0, 0.2, 1),
	});

	// Browser content area dimensions (approximate)
	const browserW = 860;
	const browserH = 480;
	// Start position: center-right of browser
	const cursorStartX = browserW * 0.55;
	const cursorStartY = browserH * 0.55;
	// End position: hovering over Strategy card (leftmost card)
	const cursorEndX = browserW * 0.24;
	const cursorEndY = browserH * 0.72;

	const cursorX = interpolate(
		cursorMoveProgress,
		[0, 1],
		[cursorStartX, cursorEndX],
		{extrapolateRight: 'clamp'},
	);
	const cursorY = interpolate(
		cursorMoveProgress,
		[0, 1],
		[cursorStartY, cursorEndY],
		{extrapolateRight: 'clamp'},
	);

	// Hover glow on Strategy card triggers at frame 75
	const hoverProgress = spring({
		frame: frame - 75,
		fps,
		config: {damping: 200, stiffness: 120},
	});

	// Overall scene in/out
	const sceneOpacity = interpolate(frame, [0, 6], [0, 1], {
		extrapolateRight: 'clamp',
	});

	// Shadow opacity
	const shadowOpacity = interpolate(frame, [0, 20], [0, 0.5], {
		extrapolateRight: 'clamp',
	});

	// Hero text reveal
	const heroReveal = interpolate(frame, [8, 28], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.16, 1, 0.3, 1),
	});

	return (
		<AbsoluteFill
			style={{
				backgroundColor: COLORS.bg,
				opacity: sceneOpacity,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			{/* Ambient background */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background: `radial-gradient(ellipse 60% 50% at 50% 40%, rgba(196,163,90,0.04) 0%, transparent 60%)`,
				}}
			/>

			{/* Browser shadow */}
			<div
				style={{
					position: 'absolute',
					width: 860,
					height: 20,
					bottom: 'calc(50% - 270px)',
					left: 'calc(50% - 430px)',
					background: 'rgba(0,0,0,0.8)',
					filter: 'blur(30px)',
					opacity: shadowOpacity,
					borderRadius: '50%',
					transform: `perspective(1200px) rotateY(${tiltY}deg) translateY(${browserY}px)`,
				}}
			/>

			{/* Browser window */}
			<div
				style={{
					width: 860,
					height: 500,
					backgroundColor: '#0D0D10',
					border: `1px solid ${COLORS.border}`,
					display: 'flex',
					flexDirection: 'column',
					overflow: 'hidden',
					position: 'relative',
					transform: `perspective(1200px) rotateY(${tiltY}deg) translateY(${browserY}px) scale(${browserEnterScale})`,
					opacity: browserEnterScale,
				}}
			>
				<BrowserChrome />

				{/* Page content — scrollable container */}
				<div
					style={{
						flex: 1,
						overflow: 'hidden',
						position: 'relative',
					}}
				>
					{/* Scrolling page */}
					<div
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							transform: `translateY(${pageScrollY}px)`,
						}}
					>
						{/* Grid background */}
						<GridPattern />

						{/* Hero section */}
						<div
							style={{
								padding: '48px 60px 36px',
								position: 'relative',
								zIndex: 1,
							}}
						>
							{/* Label */}
							<div
								style={{
									fontSize: 10,
									fontFamily: interFontFamily,
									fontWeight: 400,
									color: COLORS.accent,
									letterSpacing: '0.16em',
									textTransform: 'uppercase' as const,
									marginBottom: 14,
									opacity: heroReveal,
								}}
							>
								Digital Growth Agency
							</div>

							{/* Hero headline */}
							<div
								style={{
									overflow: 'hidden',
									lineHeight: 1.05,
								}}
							>
								<div
									style={{
										transform: `translateY(${interpolate(heroReveal, [0, 1], [40, 0], {extrapolateRight: 'clamp'})}px)`,
										opacity: heroReveal,
									}}
								>
									<span
										style={{
											fontSize: 52,
											fontFamily: spaceGroteskFontFamily,
											fontWeight: 700,
											color: COLORS.text,
											letterSpacing: '-0.02em',
											lineHeight: 1.05,
											display: 'block',
										}}
									>
										We Engineer Growth
									</span>
								</div>
							</div>

							{/* Subtitle */}
							<div
								style={{
									marginTop: 16,
									fontSize: 14,
									fontFamily: interFontFamily,
									fontWeight: 300,
									color: COLORS.textDim,
									lineHeight: 1.6,
									maxWidth: 480,
									opacity: interpolate(frame, [20, 36], [0, 1], {
										extrapolateLeft: 'clamp',
										extrapolateRight: 'clamp',
									}),
								}}
							>
								Full-funnel media strategies that compound.
								<br />
								From acquisition to retention — with precision.
							</div>

							{/* CTA */}
							<div
								style={{
									marginTop: 28,
									display: 'inline-flex',
									alignItems: 'center',
									gap: 8,
									opacity: interpolate(frame, [28, 44], [0, 1], {
										extrapolateLeft: 'clamp',
										extrapolateRight: 'clamp',
									}),
								}}
							>
								<div
									style={{
										fontSize: 11,
										fontFamily: interFontFamily,
										fontWeight: 500,
										color: COLORS.text,
										letterSpacing: '0.08em',
										textTransform: 'uppercase' as const,
										borderBottom: `1px solid ${COLORS.accent}`,
										paddingBottom: 2,
									}}
								>
									View Work
								</div>
								<div
									style={{
										color: COLORS.accent,
										fontSize: 12,
										marginBottom: -1,
									}}
								>
									→
								</div>
							</div>
						</div>

						{/* Divider */}
						<div
							style={{
								height: 1,
								backgroundColor: COLORS.border,
								margin: '0 60px',
								opacity: interpolate(frame, [32, 48], [0, 1], {
									extrapolateLeft: 'clamp',
									extrapolateRight: 'clamp',
								}),
							}}
						/>

						{/* Service pillars */}
						<div
							style={{
								padding: '28px 60px 48px',
								display: 'flex',
								gap: 1,
								position: 'relative',
								zIndex: 1,
							}}
						>
							{[
								{
									title: 'Strategy',
									desc: 'Market positioning and channel mix built on data, not intuition.',
									hovered: true,
								},
								{
									title: 'Creative',
									desc: 'Motion and visual assets engineered to convert at every touchpoint.',
									hovered: false,
								},
								{
									title: 'Performance',
									desc: 'Paid media, SEO, and analytics that compounds over time.',
									hovered: false,
								},
							].map((card) => (
								<ServiceCard
									key={card.title}
									title={card.title}
									description={card.desc}
									isHovered={card.hovered}
									accentProgress={hoverProgress}
								/>
							))}
						</div>
					</div>

					{/* Cursor */}
					<Cursor x={cursorX} y={cursorY} />

					{/* Bottom fade mask */}
					<div
						style={{
							position: 'absolute',
							bottom: 0,
							left: 0,
							right: 0,
							height: 60,
							background: `linear-gradient(to bottom, transparent, #0D0D10)`,
							pointerEvents: 'none',
						}}
					/>
				</div>
			</div>
		</AbsoluteFill>
	);
};
