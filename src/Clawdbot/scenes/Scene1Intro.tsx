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

export const Scene1Intro: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// "Clawdbot" title springs in — faster
	const titleSpring = spring({
		frame: frame - 8,
		fps,
		config: springConfigs.bouncy,
	});
	const titleY = interpolate(titleSpring, [0, 1], [80, 0]);
	const titleScale = interpolate(titleSpring, [0, 1], [0.6, 1]);

	// Lobster icon drops in from above — immediate
	const lobsterSpring = spring({
		frame: frame - 2,
		fps,
		config: springConfigs.elastic,
	});
	const lobsterY = interpolate(lobsterSpring, [0, 1], [-200, 0]);

	// Tagline fades in — sooner
	const taglineOpacity = interpolate(frame, [30, 50], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const taglineY = interpolate(frame, [30, 50], [20, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill>
			<OrganicBackground />
			<AbsoluteFill
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 24,
				}}
			>
				{/* Lobster icon */}
				<div
					style={{
						transform: `translateY(${lobsterY}px)`,
						opacity: lobsterSpring,
					}}
				>
					<LobsterIcon size={160} />
				</div>

				{/* Title */}
				<div
					style={{
						...fontPresets.extraTight,
						fontSize: 80,
						fontWeight: 800,
						color: colors.white,
						transform: `translateY(${titleY}px) scale(${titleScale})`,
						opacity: titleSpring,
						textAlign: 'center',
					}}
				>
					Clawdbot
				</div>

				{/* Tagline */}
				<div
					style={{
						...fontPresets.normal,
						fontSize: 32,
						fontWeight: 400,
						color: colors.peach,
						opacity: taglineOpacity,
						transform: `translateY(${taglineY}px)`,
						textAlign: 'center',
					}}
				>
					Your AI life manager
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
