import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {noise2D} from '@remotion/noise';
import {COLORS} from './constants';

type OrbDef = {
	cx: number; // % from left
	cy: number; // % from top
	radius: number; // px
	color: string;
	seed: string;
	speedScale: number;
};

const ORBS: OrbDef[] = [
	{cx: 20, cy: 30, radius: 520, color: COLORS.blue, seed: 'orb-a', speedScale: 1},
	{cx: 78, cy: 20, radius: 400, color: COLORS.blue, seed: 'orb-b', speedScale: 0.7},
	{cx: 60, cy: 75, radius: 480, color: COLORS.green, seed: 'orb-c', speedScale: 1.2},
	{cx: 10, cy: 80, radius: 360, color: COLORS.green, seed: 'orb-d', speedScale: 0.9},
	{cx: 90, cy: 60, radius: 440, color: COLORS.blue, seed: 'orb-e', speedScale: 0.6},
];

export const Background: React.FC = () => {
	const frame = useCurrentFrame();

	return (
		<AbsoluteFill
			style={{
				background: `radial-gradient(ellipse at 30% 20%, #0D1830 0%, ${COLORS.bgDeep} 70%)`,
				overflow: 'hidden',
			}}
		>
			{/* Subtle grid lines for tech feel */}
			<AbsoluteFill
				style={{
					backgroundImage: `
						linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px),
						linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px)
					`,
					backgroundSize: '80px 80px',
				}}
			/>

			{/* Animated noise-driven orbs */}
			{ORBS.map((orb) => {
				const t = frame * 0.005 * orb.speedScale;
				const dx = noise2D(orb.seed + '-x', t, 0) * 60;
				const dy = noise2D(orb.seed + '-y', 0, t) * 60;
				const pulse = 1 + noise2D(orb.seed + '-r', t * 0.5, 0) * 0.15;

				return (
					<div
						key={orb.seed}
						style={{
							position: 'absolute',
							left: `${orb.cx}%`,
							top: `${orb.cy}%`,
							width: orb.radius * pulse * 2,
							height: orb.radius * pulse * 2,
							borderRadius: '50%',
							background: `radial-gradient(circle, ${orb.color}18 0%, ${orb.color}05 45%, transparent 70%)`,
							filter: 'blur(60px)',
							transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`,
							pointerEvents: 'none',
						}}
					/>
				);
			})}

			{/* Vignette — top and bottom darkening */}
			<AbsoluteFill
				style={{
					background:
						'linear-gradient(to bottom, rgba(4,7,15,0.6) 0%, transparent 20%, transparent 80%, rgba(4,7,15,0.8) 100%)',
				}}
			/>
		</AbsoluteFill>
	);
};
