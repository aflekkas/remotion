import React from 'react';
import {colors} from './colors';

export const LobsterIcon: React.FC<{size?: number}> = ({size = 120}) => {
	const s = size;
	return (
		<svg
			width={s}
			height={s}
			viewBox="0 0 120 120"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			{/* Body */}
			<ellipse cx="60" cy="68" rx="28" ry="32" fill={colors.coral} />
			<ellipse cx="60" cy="72" rx="22" ry="24" fill={colors.coralDeep} />

			{/* Head */}
			<circle cx="60" cy="42" r="22" fill={colors.coral} />

			{/* Eyes */}
			<circle cx="50" cy="36" r="7" fill="white" />
			<circle cx="70" cy="36" r="7" fill="white" />
			<circle cx="51" cy="37" r="4" fill="#1a1a2e" />
			<circle cx="71" cy="37" r="4" fill="#1a1a2e" />
			{/* Eye highlights */}
			<circle cx="53" cy="35" r="1.5" fill="white" />
			<circle cx="73" cy="35" r="1.5" fill="white" />

			{/* Smile */}
			<path
				d="M50 48 Q60 56 70 48"
				stroke="white"
				strokeWidth="2.5"
				strokeLinecap="round"
				fill="none"
			/>

			{/* Left claw */}
			<path
				d="M32 52 Q18 40 12 48 Q8 54 18 56 Q12 58 14 66 Q18 72 28 62 L34 58"
				fill={colors.orange}
				stroke={colors.coralDeep}
				strokeWidth="1.5"
			/>

			{/* Right claw */}
			<path
				d="M88 52 Q102 40 108 48 Q112 54 102 56 Q108 58 106 66 Q102 72 92 62 L86 58"
				fill={colors.orange}
				stroke={colors.coralDeep}
				strokeWidth="1.5"
			/>

			{/* Antennae */}
			<path
				d="M48 24 Q42 8 36 4"
				stroke={colors.orange}
				strokeWidth="2.5"
				strokeLinecap="round"
				fill="none"
			/>
			<circle cx="36" cy="4" r="3" fill={colors.peach} />
			<path
				d="M72 24 Q78 8 84 4"
				stroke={colors.orange}
				strokeWidth="2.5"
				strokeLinecap="round"
				fill="none"
			/>
			<circle cx="84" cy="4" r="3" fill={colors.peach} />

			{/* Tail segments */}
			<ellipse cx="60" cy="96" rx="14" ry="6" fill={colors.coral} />
			<ellipse cx="60" cy="104" rx="10" ry="4" fill={colors.orange} />
			<ellipse cx="60" cy="110" rx="7" ry="3" fill={colors.peach} />
		</svg>
	);
};
