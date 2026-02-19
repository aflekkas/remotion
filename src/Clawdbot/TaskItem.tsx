import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors} from './colors';
import {springConfigs} from './springs';

type TaskItemProps = {
	icon: string;
	text: string;
	delay: number;
};

export const TaskItem: React.FC<TaskItemProps> = ({icon, text, delay}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const localFrame = frame - delay;

	const slideIn = spring({
		frame: localFrame,
		fps,
		config: springConfigs.snappy,
	});

	const x = interpolate(slideIn, [0, 1], [60, 0]);
	const opacity = interpolate(slideIn, [0, 1], [0, 1]);

	// Checkmark appears 12 frames after the card
	const checkFrame = localFrame - 12;
	const checkScale = spring({
		frame: checkFrame,
		fps,
		config: springConfigs.elastic,
	});

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 10,
				padding: '8px 12px',
				borderRadius: 12,
				background: 'rgba(255,255,255,0.06)',
				border: '1px solid rgba(255,255,255,0.08)',
				transform: `translateX(${x}px)`,
				opacity,
				marginBottom: 6,
			}}
		>
			<span style={{fontSize: 16}}>{icon}</span>
			<span
				style={{
					flex: 1,
					color: colors.white,
					fontSize: 12,
					fontFamily: 'Open Sauce Sans',
					fontWeight: 400,
					lineHeight: 1.3,
				}}
			>
				{text}
			</span>
			<div
				style={{
					width: 20,
					height: 20,
					borderRadius: 10,
					background: colors.taskCheck,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					transform: `scale(${checkScale})`,
					opacity: checkScale,
				}}
			>
				<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
					<path
						d="M2.5 6L5 8.5L9.5 3.5"
						stroke="white"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</div>
		</div>
	);
};
