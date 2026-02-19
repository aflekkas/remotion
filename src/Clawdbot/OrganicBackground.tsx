import React from 'react';
import {AbsoluteFill, interpolateColors, useCurrentFrame} from 'remotion';
import {colors} from './colors';

type Blob = {
	x: number;
	y: number;
	size: number;
	color: string;
	speedX: number;
	speedY: number;
	phase: number;
};

const blobs: Blob[] = [
	{
		x: 25,
		y: 20,
		size: 400,
		color: colors.coral,
		speedX: 0.008,
		speedY: 0.006,
		phase: 0,
	},
	{
		x: 75,
		y: 35,
		size: 350,
		color: colors.coralDeep,
		speedX: 0.006,
		speedY: 0.009,
		phase: 1.2,
	},
	{
		x: 40,
		y: 70,
		size: 450,
		color: colors.orange,
		speedX: 0.007,
		speedY: 0.005,
		phase: 2.5,
	},
	{
		x: 65,
		y: 85,
		size: 300,
		color: colors.navyMid,
		speedX: 0.005,
		speedY: 0.008,
		phase: 3.8,
	},
];

export const OrganicBackground: React.FC<{
	warmth?: number;
}> = ({warmth = 0}) => {
	const frame = useCurrentFrame();

	const bgColor = interpolateColors(
		warmth,
		[0, 1],
		[colors.navyDeep, '#1A0E1E'],
	);

	return (
		<AbsoluteFill style={{background: bgColor}}>
			{blobs.map((blob, i) => {
				const bx =
					blob.x + Math.sin(frame * blob.speedX + blob.phase) * 12;
				const by =
					blob.y + Math.cos(frame * blob.speedY + blob.phase) * 10;
				const scale =
					1 + Math.sin(frame * 0.003 + blob.phase * 2) * 0.15;

				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: `${bx}%`,
							top: `${by}%`,
							width: blob.size * scale,
							height: blob.size * scale,
							borderRadius: '50%',
							background: `radial-gradient(circle, ${blob.color}30 0%, transparent 70%)`,
							filter: 'blur(80px)',
							transform: 'translate(-50%, -50%)',
							pointerEvents: 'none',
						}}
					/>
				);
			})}
		</AbsoluteFill>
	);
};
