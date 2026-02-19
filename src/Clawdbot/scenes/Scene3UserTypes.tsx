import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {ChatBubble, TypingDots} from '../ChatBubble';
import {colors} from '../colors';
import {OrganicBackground} from '../OrganicBackground';
import {ChatHeader, PhoneMockup} from '../PhoneMockup';
import {springConfigs} from '../springs';
import {TypewriterText} from '../TypewriterText';

const USER_MESSAGE =
	"Hey Clawdbot, manage my day for me — I'm overwhelmed";
const CHAR_FRAMES = 1;
const TYPING_TOTAL_FRAMES = USER_MESSAGE.length * CHAR_FRAMES; // ~54
const SEND_AT = TYPING_TOTAL_FRAMES + 8; // ~62
const DOTS_AT = SEND_AT + 15; // ~77

export const Scene3UserTypes: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const hasSent = frame >= SEND_AT;
	const showDots = frame >= DOTS_AT;

	// Bubble send animation
	const sendSpring = spring({
		frame: frame - SEND_AT,
		fps,
		config: springConfigs.snappy,
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
				<div style={{transform: 'scale(1.75)', transformOrigin: 'center center'}}>
				<PhoneMockup>
					<ChatHeader />

					{/* Chat area */}
					<div
						style={{
							flex: 1,
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'flex-end',
							padding: '16px 0',
							gap: 10,
						}}
					>
						{/* Sent bubble */}
						{hasSent ? (
							<div
								style={{
									opacity: sendSpring,
									transform: `translateY(${interpolate(sendSpring, [0, 1], [30, 0])}px)`,
								}}
							>
								<ChatBubble text={USER_MESSAGE} variant="user" />
							</div>
						) : null}

						{/* AI typing dots */}
						{showDots ? <TypingDots frame={frame - DOTS_AT} /> : null}
					</div>

					{/* Input bar with typewriter */}
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
								border: `1px solid ${hasSent ? 'rgba(255,255,255,0.1)' : colors.coral + '60'}`,
								color: colors.white,
								fontSize: 14,
								fontFamily: 'Open Sauce Sans',
								minHeight: 20,
							}}
						>
							{hasSent ? (
								<span style={{color: 'rgba(255,255,255,0.3)'}}>
									Type a message...
								</span>
							) : (
								<TypewriterText
									frame={frame}
									text={USER_MESSAGE}
									charFrames={CHAR_FRAMES}
								/>
							)}
						</div>
					</div>
				</PhoneMockup>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
