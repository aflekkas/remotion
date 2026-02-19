import React from 'react';
import {colors} from './colors';

export const PhoneMockup: React.FC<{
	children: React.ReactNode;
	style?: React.CSSProperties;
}> = ({children, style}) => {
	return (
		<div
			style={{
				width: 420,
				height: 860,
				borderRadius: 48,
				background: '#1C2040',
				border: '3px solid rgba(255,255,255,0.12)',
				boxShadow:
					'0 40px 100px rgba(0,0,0,0.6), 0 0 60px rgba(255,107,74,0.15)',
				position: 'relative',
				overflow: 'hidden',
				...style,
			}}
		>
			{/* Notch */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: '50%',
					transform: 'translateX(-50%)',
					width: 160,
					height: 32,
					background: '#1C2040',
					borderRadius: '0 0 20px 20px',
					zIndex: 10,
				}}
			/>

			{/* Screen */}
			<div
				style={{
					position: 'absolute',
					top: 12,
					left: 12,
					right: 12,
					bottom: 12,
					borderRadius: 36,
					background: colors.phoneScreen,
					overflow: 'hidden',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				{children}
			</div>

			{/* Home indicator */}
			<div
				style={{
					position: 'absolute',
					bottom: 8,
					left: '50%',
					transform: 'translateX(-50%)',
					width: 120,
					height: 5,
					borderRadius: 3,
					background: 'rgba(255,255,255,0.25)',
					zIndex: 10,
				}}
			/>
		</div>
	);
};

export const ChatHeader: React.FC = () => {
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 12,
				padding: '48px 20px 14px',
				borderBottom: '1px solid rgba(255,255,255,0.08)',
			}}
		>
			{/* Mini lobster avatar */}
			<div
				style={{
					width: 40,
					height: 40,
					borderRadius: 20,
					background: `linear-gradient(135deg, ${colors.coral}, ${colors.orange})`,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					fontSize: 20,
				}}
			>
				<svg
					width="24"
					height="24"
					viewBox="0 0 120 120"
					fill="none"
				>
					<ellipse cx="60" cy="68" rx="28" ry="32" fill="white" />
					<circle cx="60" cy="42" r="22" fill="white" />
					<circle cx="50" cy="36" r="4" fill={colors.coralDeep} />
					<circle cx="70" cy="36" r="4" fill={colors.coralDeep} />
				</svg>
			</div>
			<div style={{flex: 1}}>
				<div
					style={{
						color: colors.white,
						fontSize: 16,
						fontWeight: 700,
						fontFamily: 'Open Sauce Sans',
					}}
				>
					Clawdbot
				</div>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 6,
						marginTop: 2,
					}}
				>
					<div
						style={{
							width: 7,
							height: 7,
							borderRadius: 4,
							background: colors.taskCheck,
						}}
					/>
					<span
						style={{
							color: colors.whiteFaded,
							fontSize: 12,
							fontFamily: 'Open Sauce Sans',
						}}
					>
						Online
					</span>
				</div>
			</div>
		</div>
	);
};
