import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {colors} from '../colors';
import {LobsterIcon} from '../LobsterIcon';
import {OrganicBackground} from '../OrganicBackground';
import {springConfigs} from '../springs';
import {fontPresets} from '../../load-fonts';

export const Scene5Outro: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Lobster icon springs in — faster
	const lobsterSpring = spring({
		frame: frame - 8,
		fps,
		config: springConfigs.bouncy,
	});

	// Brand name springs in — faster
	const brandSpring = spring({
		frame: frame - 18,
		fps,
		config: springConfigs.bouncy,
	});
	const brandY = interpolate(brandSpring, [0, 1], [40, 0]);

	// Tagline fades — sooner
	const taglineOpacity = interpolate(frame, [30, 50], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const taglineY = interpolate(frame, [30, 50], [20, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// CTA button bounces in — sooner
	const ctaSpring = spring({
		frame: frame - 45,
		fps,
		config: springConfigs.elastic,
	});
	const ctaScale = interpolate(ctaSpring, [0, 1], [0.5, 1]);

	// Background glow expands — faster
	const glowScale = interpolate(frame, [0, 70], [0.3, 1.2], {
		extrapolateRight: 'clamp',
	});
	const glowOpacity = interpolate(frame, [0, 35], [0, 0.5], {
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill>
			<OrganicBackground warmth={0.6} />

			{/* Warm coral glow */}
			<AbsoluteFill
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<div
					style={{
						width: 800,
						height: 800,
						borderRadius: '50%',
						background: `radial-gradient(circle, ${colors.coral}50 0%, transparent 70%)`,
						filter: 'blur(60px)',
						transform: `scale(${glowScale})`,
						opacity: glowOpacity,
					}}
				/>
			</AbsoluteFill>

			<AbsoluteFill
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 28,
				}}
			>
				{/* Lobster icon */}
				<div
					style={{
						transform: `scale(${lobsterSpring})`,
						opacity: lobsterSpring,
					}}
				>
					<LobsterIcon size={200} />
				</div>

				{/* Brand name */}
				<div
					style={{
						...fontPresets.extraTight,
						fontSize: 96,
						fontWeight: 800,
						color: colors.white,
						transform: `translateY(${brandY}px)`,
						opacity: brandSpring,
						textAlign: 'center',
					}}
				>
					Clawdbot
				</div>

				{/* Tagline */}
				<div
					style={{
						...fontPresets.normal,
						fontSize: 36,
						fontWeight: 400,
						color: colors.peach,
						opacity: taglineOpacity,
						transform: `translateY(${taglineY}px)`,
						textAlign: 'center',
					}}
				>
					Your AI life manager
				</div>

				{/* CTA button */}
				<div
					style={{
						marginTop: 20,
						transform: `scale(${ctaScale})`,
						opacity: ctaSpring,
					}}
				>
					<div
						style={{
							padding: '18px 56px',
							borderRadius: 40,
							background: `linear-gradient(135deg, ${colors.coral}, ${colors.orange})`,
							color: colors.white,
							fontSize: 28,
							fontWeight: 700,
							fontFamily: 'Open Sauce Sans',
							boxShadow: `0 8px 40px ${colors.coral}60`,
						}}
					>
						Try free
					</div>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
