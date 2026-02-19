import React from 'react';
import {colors} from './colors';

export const ChatBubble: React.FC<{
	text: string;
	variant: 'user' | 'ai';
	style?: React.CSSProperties;
}> = ({text, variant, style}) => {
	const isUser = variant === 'user';
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: isUser ? 'flex-end' : 'flex-start',
				padding: '0 16px',
				...style,
			}}
		>
			<div
				style={{
					maxWidth: '85%',
					padding: '12px 16px',
					borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
					background: isUser
						? colors.userBubble
						: `linear-gradient(135deg, ${colors.coral}, ${colors.coralDeep})`,
					color: colors.white,
					fontSize: 14,
					lineHeight: 1.45,
					fontFamily: 'Open Sauce Sans',
					fontWeight: 400,
				}}
			>
				{text}
			</div>
		</div>
	);
};

export const TypingDots: React.FC<{frame: number}> = ({frame}) => {
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'flex-start',
				padding: '0 16px',
			}}
		>
			<div
				style={{
					padding: '14px 20px',
					borderRadius: '18px 18px 18px 4px',
					background: `linear-gradient(135deg, ${colors.coral}, ${colors.coralDeep})`,
					display: 'flex',
					gap: 6,
					alignItems: 'center',
				}}
			>
				{[0, 1, 2].map((i) => {
					const phase = ((frame + i * 6) % 24) / 24;
					const y = Math.sin(phase * Math.PI * 2) * -4;
					const opacity = 0.4 + Math.sin(phase * Math.PI * 2) * 0.3 + 0.3;
					return (
						<div
							key={i}
							style={{
								width: 8,
								height: 8,
								borderRadius: 4,
								background: 'white',
								opacity,
								transform: `translateY(${y}px)`,
							}}
						/>
					);
				})}
			</div>
		</div>
	);
};
