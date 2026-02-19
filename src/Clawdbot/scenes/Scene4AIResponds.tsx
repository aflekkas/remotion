import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {ChatBubble} from '../ChatBubble';
import {OrganicBackground} from '../OrganicBackground';
import {ChatHeader, PhoneMockup} from '../PhoneMockup';
import {springConfigs} from '../springs';
import {TaskItem} from '../TaskItem';

const USER_MESSAGE =
	"Hey Clawdbot, manage my day for me — I'm overwhelmed";

const AI_RESPONSE = "On it! Here's what I've handled:";

const tasks = [
	{icon: '📅', text: 'Rescheduled 2pm meeting to Thursday'},
	{icon: '✈️', text: 'Booked SFO → JFK for Friday'},
	{icon: '📧', text: 'Cleared 47 emails, flagged 3 urgent'},
	{icon: '🛒', text: 'Ordered groceries, delivery at 6pm'},
];

export const Scene4AIResponds: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// AI response bubble springs in — faster
	const aiSpring = spring({
		frame: frame - 5,
		fps,
		config: springConfigs.snappy,
	});
	const aiY = interpolate(aiSpring, [0, 1], [30, 0]);

	// Warmth increases as tasks appear
	const warmth = interpolate(frame, [0, 180], [0, 0.4], {
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill>
			<OrganicBackground warmth={warmth} />
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
							overflow: 'hidden',
						}}
					>
						{/* User's previous message */}
						<ChatBubble text={USER_MESSAGE} variant="user" />

						{/* AI response bubble */}
						<div
							style={{
								opacity: aiSpring,
								transform: `translateY(${aiY}px)`,
							}}
						>
							<ChatBubble text={AI_RESPONSE} variant="ai" />
						</div>

						{/* Task items stagger in */}
						<div style={{padding: '6px 16px 0'}}>
							{tasks.map((task, i) => (
								<TaskItem
									key={i}
									icon={task.icon}
									text={task.text}
									delay={25 + i * 8}
								/>
							))}
						</div>
					</div>

					{/* Input bar */}
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
