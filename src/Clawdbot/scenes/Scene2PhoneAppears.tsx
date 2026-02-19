import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {OrganicBackground} from '../OrganicBackground';
import {ChatHeader, PhoneMockup} from '../PhoneMockup';
import {springConfigs} from '../springs';

export const Scene2PhoneAppears: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Phone slides up from below — faster, less delay
	const phoneSpring = spring({
		frame: frame - 3,
		fps,
		config: springConfigs.heavy,
	});
	const phoneY = interpolate(phoneSpring, [0, 1], [1200, 0]);
	const phoneOpacity = interpolate(phoneSpring, [0, 0.3], [0, 1], {
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill>
			<OrganicBackground />
			<AbsoluteFill
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<div
					style={{
						transform: `translateY(${phoneY}px) scale(1.75)`,
						transformOrigin: 'center center',
						opacity: phoneOpacity,
					}}
				>
					<PhoneMockup>
						<ChatHeader />
						{/* Empty chat area — ready for messages */}
						<div
							style={{
								flex: 1,
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'flex-end',
								padding: '16px 0',
							}}
						/>
						{/* Input bar placeholder */}
						<div
							style={{
								padding: '12px 16px 24px',
								borderTop: '1px solid rgba(255,255,255,0.06)',
							}}
						>
							<div
								style={{
									padding: '10px 16px',
									borderRadius: 20,
									background: 'rgba(255,255,255,0.06)',
									border: '1px solid rgba(255,255,255,0.1)',
									color: 'rgba(255,255,255,0.3)',
									fontSize: 14,
									fontFamily: 'Open Sauce Sans',
								}}
							>
								Type a message...
							</div>
						</div>
					</PhoneMockup>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
