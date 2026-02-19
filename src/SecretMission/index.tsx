import React from 'react';
import {
	AbsoluteFill,
	Img,
	interpolate,
	interpolateColors,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import '../load-fonts';
import {fontFamily} from '../load-fonts';

// ─── Palette ────────────────────────────────────────────────────────────────
const COLORS = {
	background: '#000000',
	headerBg: 'rgba(0,0,0,0.94)',
	headerBorder: 'rgba(255,255,255,0.06)',
	sentBubble: '#0A84FF',
	receivedBubble: '#1C1C1E',
	messageText: '#FFFFFF',
	systemText: 'rgba(255,255,255,0.32)',
	timeText: 'rgba(255,255,255,0.28)',
	typingDot: 'rgba(255,255,255,0.55)',
};

// ─── Layout ─────────────────────────────────────────────────────────────────
const CHAT_WIDTH = 820;
const HEADER_H = 160;
const FONT_SIZE = 28;
const BUBBLE_GAP = 6;
const NAME_HEIGHT = 24;
const BUBBLE_HEIGHT = FONT_SIZE * 1.45 + 28;
const ROW_HEIGHT_RECEIVED = NAME_HEIGHT + BUBBLE_HEIGHT + BUBBLE_GAP; // ~78
const ROW_HEIGHT_SENT = BUBBLE_HEIGHT + BUBBLE_GAP; // ~54

// ─── Participants ───────────────────────────────────────────────────────────
type Participant = {
	id: string;
	name: string;
	nameColor: string;
	avatarBg: string;
	initials: string;
	avatarFile: string | null;
};

const PEOPLE: Record<string, Participant> = {
	biden: {
		id: 'biden',
		name: 'Joe',
		nameColor: '#4ECDC4',
		avatarBg: '#1B4F72',
		initials: 'JB',
		avatarFile: 'avatars/biden.jpg',
	},
	trump: {
		id: 'trump',
		name: 'Donald',
		nameColor: '#FF6B6B',
		avatarBg: '#922B21',
		initials: 'DT',
		avatarFile: 'avatars/trump.jpg',
	},
	obama: {
		id: 'obama',
		name: 'Barack',
		nameColor: '#74B9FF',
		avatarBg: '#1A5276',
		initials: 'BO',
		avatarFile: 'avatars/obama.jpg',
	},
	epstein: {
		id: 'epstein',
		name: 'Jeffrey',
		nameColor: '#A855F7',
		avatarBg: '#1a1a1a',
		initials: '?',
		avatarFile: null,
	},
};

// Viewing from Biden's phone
const VIEWER = 'biden';

// ─── Messages ───────────────────────────────────────────────────────────────
type Message = {
	id: number;
	sender: string;
	text: string;
	typingStart: number;
	messageFrame: number;
};

const MESSAGES: Message[] = [
	{id: 1, sender: 'biden', text: 'who griefed my house', typingStart: 25, messageFrame: 50},
	{id: 2, sender: 'trump', text: 'Not me. I have the BEST house. Nobody builds better.', typingStart: 88, messageFrame: 118},
	{id: 3, sender: 'obama', text: 'joe that was a creeper lol', typingStart: 153, messageFrame: 178},
	{id: 4, sender: 'biden', text: 'a what', typingStart: 208, messageFrame: 225},
	{id: 5, sender: 'obama', text: 'how are you even on this server rn', typingStart: 255, messageFrame: 283},
	{id: 6, sender: 'trump', text: 'Creepers are AFRAID of my builds. They respect greatness.', typingStart: 318, messageFrame: 350},
	{id: 7, sender: 'biden', text: 'how do i craft a sword again', typingStart: 383, messageFrame: 410},
	{id: 8, sender: 'obama', text: 'joe we literally showed you yesterday', typingStart: 440, messageFrame: 470},
	{id: 9, sender: 'trump', text: 'Sad! I already have full diamond armor.', typingStart: 503, messageFrame: 533},
	{id: 10, sender: 'obama', text: "you've been in creative mode this whole time", typingStart: 563, messageFrame: 595},
	{id: 11, sender: 'trump', text: 'FAKE NEWS', typingStart: 620, messageFrame: 640},
	{id: 12, sender: 'biden', text: 'i just fell in lava', typingStart: 670, messageFrame: 695},
	{id: 13, sender: 'obama', text: '💀💀💀', typingStart: 720, messageFrame: 738},
	{id: 14, sender: 'trump', text: 'Should have built a WALL around the lava.', typingStart: 768, messageFrame: 798},
	{id: 15, sender: 'biden', text: 'i lost everything', typingStart: 828, messageFrame: 850},
	{id: 16, sender: 'obama', text: 'you had stuff??', typingStart: 875, messageFrame: 895},
	// ─── The twist ───
	{id: 17, sender: 'epstein', text: 'hey guys 👋', typingStart: 968, messageFrame: 998},
	{id: 18, sender: 'biden', text: 'wtf', typingStart: 1048, messageFrame: 1063},
	{id: 19, sender: 'trump', text: 'wtf', typingStart: 1068, messageFrame: 1083},
	{id: 20, sender: 'obama', text: 'wtf', typingStart: 1088, messageFrame: 1103},
];

const SYSTEM_MSG_FRAME = 935;
const TOTAL_FRAMES = 1170;

// ─── Spring configs ─────────────────────────────────────────────────────────
const SPRING_BUBBLE = {damping: 14, stiffness: 120, mass: 0.7};
const SPRING_SCROLL = {damping: 200, stiffness: 80, mass: 1.2};

// ─── Avatar Component ───────────────────────────────────────────────────────
const ParticipantAvatar: React.FC<{person: Participant; size: number}> = ({
	person,
	size,
}) => {
	if (person.avatarFile) {
		return (
			<div
				style={{
					width: size,
					height: size,
					borderRadius: size / 2,
					overflow: 'hidden',
					flexShrink: 0,
					boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
				}}
			>
				<Img
					src={staticFile(person.avatarFile)}
					style={{width: size, height: size, objectFit: 'cover'}}
				/>
			</div>
		);
	}
	return (
		<div
			style={{
				width: size,
				height: size,
				borderRadius: size / 2,
				background: person.avatarBg,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				flexShrink: 0,
				boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
				border: person.id === 'epstein' ? '2px solid rgba(168,85,247,0.4)' : 'none',
			}}
		>
			<span
				style={{
					fontFamily,
					fontSize: size * 0.4,
					fontWeight: 700,
					color: person.id === 'epstein' ? '#A855F7' : '#fff',
					opacity: 0.85,
				}}
			>
				{person.initials}
			</span>
		</div>
	);
};

// ─── Group Chat Header ──────────────────────────────────────────────────────
const GroupHeader: React.FC<{opacity: number; memberCount: number}> = ({
	opacity,
	memberCount,
}) => (
	<div
		style={{
			position: 'absolute',
			top: 0,
			left: '50%',
			transform: 'translateX(-50%)',
			width: CHAT_WIDTH + 96,
			zIndex: 10,
			opacity,
			paddingTop: 18,
			paddingBottom: 16,
			paddingLeft: 48,
			paddingRight: 48,
			background: COLORS.headerBg,
			borderBottom: `1px solid ${COLORS.headerBorder}`,
			backdropFilter: 'blur(24px)',
		}}
	>
		{/* Top bar: Back + video icon */}
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				marginBottom: 12,
			}}
		>
			<div style={{display: 'flex', alignItems: 'center', gap: 5}}>
				<svg width="10" height="18" viewBox="0 0 10 18" fill="none">
					<path
						d="M8.5 1.5L1.5 9L8.5 16.5"
						stroke="#0A84FF"
						strokeWidth="2.2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
				<span
					style={{fontFamily, fontSize: 17, color: '#0A84FF', fontWeight: 400}}
				>
					Back
				</span>
			</div>
			<svg
				width="28"
				height="22"
				viewBox="0 0 28 22"
				fill="none"
				opacity={0.5}
			>
				<rect
					x="1"
					y="2"
					width="18"
					height="17"
					rx="3.5"
					stroke="white"
					strokeWidth="2"
				/>
				<path
					d="M19 9L27 5.5V16.5L19 13V9Z"
					stroke="white"
					strokeWidth="2"
					strokeLinejoin="round"
				/>
			</svg>
		</div>

		{/* Group info: stacked avatars + name + count */}
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: 8,
			}}
		>
			{/* Overlapping avatars */}
			<div style={{display: 'flex', marginLeft: 20}}>
				{['trump', 'obama', 'biden'].map((pid, i) => (
					<div key={pid} style={{marginLeft: i === 0 ? 0 : -12, zIndex: 3 - i}}>
						<ParticipantAvatar person={PEOPLE[pid]} size={42} />
					</div>
				))}
			</div>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 2,
				}}
			>
				<span
					style={{
						fontFamily,
						fontSize: 17,
						fontWeight: 600,
						color: '#FFFFFF',
						letterSpacing: '-0.01em',
					}}
				>
					{'minecraft night 🎮'}
				</span>
				<span
					style={{
						fontFamily,
						fontSize: 13,
						fontWeight: 400,
						color: 'rgba(255,255,255,0.40)',
					}}
				>
					{memberCount} people
				</span>
			</div>
		</div>
	</div>
);

// ─── Typing Indicator ───────────────────────────────────────────────────────
const TypingIndicator: React.FC<{
	frame: number;
	isSent: boolean;
	entranceSpring: number;
	sender: string;
}> = ({frame, isSent, entranceSpring, sender}) => {
	const translateY = interpolate(entranceSpring, [0, 1], [18, 0], {
		extrapolateRight: 'clamp',
	});
	const opacity = interpolate(entranceSpring, [0, 0.5], [0, 1], {
		extrapolateRight: 'clamp',
	});
	const person = PEOPLE[sender];
	const isEpstein = sender === 'epstein';

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'flex-end',
				gap: 10,
				justifyContent: isSent ? 'flex-end' : 'flex-start',
				transform: `translateY(${translateY}px)`,
				opacity,
			}}
		>
			{!isSent && (
				<div style={{marginBottom: 2}}>
					<ParticipantAvatar person={person} size={32} />
				</div>
			)}
			<div>
				{!isSent && (
					<div
						style={{
							fontFamily,
							fontSize: 13,
							fontWeight: 500,
							color: person.nameColor,
							marginBottom: 4,
							marginLeft: 14,
						}}
					>
						{person.name}
					</div>
				)}
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 7,
						padding: '14px 18px',
						borderRadius: isSent
							? '20px 20px 6px 20px'
							: '20px 20px 20px 6px',
						background: isSent
							? COLORS.sentBubble
							: isEpstein
								? 'rgba(168,85,247,0.15)'
								: COLORS.receivedBubble,
						boxShadow: isEpstein
							? '0 0 20px rgba(168,85,247,0.2)'
							: '0 3px 12px rgba(0,0,0,0.4)',
					}}
				>
					{[0, 1, 2].map((i) => {
						const phase = ((frame + i * 9) % 28) / 28;
						const y = Math.sin(phase * Math.PI * 2) * 4;
						const sc = 0.78 + Math.sin(phase * Math.PI * 2) * 0.22;
						const dotOpacity =
							0.5 + Math.sin(phase * Math.PI * 2) * 0.35;
						return (
							<div
								key={i}
								style={{
									width: 9,
									height: 9,
									borderRadius: '50%',
									background: isEpstein
										? '#A855F7'
										: COLORS.typingDot,
									opacity: Math.max(0.25, dotOpacity),
									transform: `translateY(${y}px) scale(${sc})`,
								}}
							/>
						);
					})}
				</div>
			</div>
		</div>
	);
};

// ─── System Message ─────────────────────────────────────────────────────────
const SystemMessage: React.FC<{opacity: number; text: string}> = ({
	opacity,
	text,
}) => (
	<div
		style={{
			display: 'flex',
			justifyContent: 'center',
			opacity,
			padding: '8px 0',
		}}
	>
		<span
			style={{
				fontFamily,
				fontSize: 13,
				fontWeight: 400,
				color: COLORS.systemText,
				textAlign: 'center',
			}}
		>
			{text}
		</span>
	</div>
);

// ─── Message Bubble ─────────────────────────────────────────────────────────
const MessageBubble: React.FC<{
	message: Message;
	localFrame: number;
	fps: number;
	showName: boolean;
}> = ({message, localFrame, fps, showName}) => {
	const isSent = message.sender === VIEWER;
	const person = PEOPLE[message.sender];
	const isEpstein = message.sender === 'epstein';

	const s = spring({frame: localFrame, fps, config: SPRING_BUBBLE});
	const translateY = interpolate(s, [0, 1], [28, 0], {
		extrapolateRight: 'clamp',
	});
	const scale = interpolate(s, [0, 1], [0.88, 1], {
		extrapolateRight: 'clamp',
	});
	const opacity = interpolate(s, [0, 0.3], [0, 1], {
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'flex-end',
				gap: 10,
				justifyContent: isSent ? 'flex-end' : 'flex-start',
				transform: `translateY(${translateY}px) scale(${scale})`,
				opacity,
				transformOrigin: isSent ? 'right bottom' : 'left bottom',
			}}
		>
			{!isSent && (
				<div style={{marginBottom: 2}}>
					<ParticipantAvatar person={person} size={32} />
				</div>
			)}
			<div style={{maxWidth: '72%'}}>
				{!isSent && showName && (
					<div
						style={{
							fontFamily,
							fontSize: 13,
							fontWeight: 500,
							color: person.nameColor,
							marginBottom: 4,
							marginLeft: 14,
						}}
					>
						{person.name}
					</div>
				)}
				<div
					style={{
						padding: '12px 18px',
						borderRadius: isSent
							? '20px 20px 6px 20px'
							: '20px 20px 20px 6px',
						background: isSent
							? COLORS.sentBubble
							: isEpstein
								? 'rgba(168,85,247,0.15)'
								: COLORS.receivedBubble,
						color: COLORS.messageText,
						fontSize: FONT_SIZE,
						lineHeight: 1.45,
						fontFamily,
						fontWeight: 400,
						letterSpacing: '-0.01em',
						boxShadow: isSent
							? '0 4px 18px rgba(10,132,255,0.35)'
							: isEpstein
								? '0 0 24px rgba(168,85,247,0.25), 0 3px 12px rgba(0,0,0,0.4)'
								: '0 3px 14px rgba(0,0,0,0.45)',
						border: isEpstein
							? '1px solid rgba(168,85,247,0.25)'
							: 'none',
					}}
				>
					{message.text}
				</div>
			</div>
		</div>
	);
};

// ─── Main Composition ───────────────────────────────────────────────────────
export type SecretMissionProps = Record<string, never>;

export const SecretMission: React.FC<SecretMissionProps> = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Header entrance
	const headerS = spring({
		frame,
		fps,
		config: {damping: 200, stiffness: 100, mass: 1},
		durationInFrames: Math.round(0.9 * fps),
	});
	const headerOpacity = interpolate(headerS, [0, 1], [0, 1], {
		extrapolateRight: 'clamp',
	});

	// Member count changes when Epstein arrives
	const memberCount = frame >= SYSTEM_MSG_FRAME ? 4 : 3;

	// Scroll — start scrolling after message index 7
	const SCROLL_START = 7;
	let scrollY = 0;
	const allScrollItems: number[] = [];
	for (let i = SCROLL_START; i < MESSAGES.length; i++) {
		allScrollItems.push(MESSAGES[i].messageFrame);
	}
	// Also scroll for system message
	if (frame >= SYSTEM_MSG_FRAME) {
		const localF = frame - SYSTEM_MSG_FRAME;
		const s = spring({frame: localF, fps, config: SPRING_SCROLL});
		scrollY += s * 40; // system message is shorter
	}
	for (const msgFrame of allScrollItems) {
		if (frame >= msgFrame) {
			const localF = frame - msgFrame;
			const s = spring({frame: localF, fps, config: SPRING_SCROLL});
			const msg = MESSAGES.find((m) => m.messageFrame === msgFrame)!;
			const rowH =
				msg.sender === VIEWER ? ROW_HEIGHT_SENT : ROW_HEIGHT_RECEIVED;
			scrollY += s * rowH;
		}
	}

	// Epstein arrival — subtle background color shift
	const epsteinProgress = interpolate(
		frame,
		[SYSTEM_MSG_FRAME, SYSTEM_MSG_FRAME + 60],
		[0, 1],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
	);
	const bgColor = interpolateColors(
		epsteinProgress,
		[0, 1],
		['#000000', '#05000a'],
	);

	// Ambient glow — shifts from blue to purple when Epstein arrives
	const glowOpacity = interpolate(
		Math.sin(frame * 0.015),
		[-1, 1],
		[0.03, 0.08],
		{extrapolateRight: 'clamp'},
	);
	const glowColor = interpolateColors(
		epsteinProgress,
		[0, 1],
		['rgba(10,132,255,1)', 'rgba(168,85,247,1)'],
	);

	// System message opacity
	const systemMsgOpacity = interpolate(
		frame,
		[SYSTEM_MSG_FRAME, SYSTEM_MSG_FRAME + 20],
		[0, 1],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
	);

	// Determine which messages should show sender names
	// Show name when sender differs from previous message's sender
	const shouldShowName = (index: number): boolean => {
		if (index === 0) return true;
		const prevVisible = MESSAGES.slice(0, index)
			.reverse()
			.find((m) => frame >= m.messageFrame);
		if (!prevVisible) return true;
		return prevVisible.sender !== MESSAGES[index].sender;
	};

	return (
		<AbsoluteFill style={{background: bgColor, overflow: 'hidden'}}>
			{/* Ambient glow */}
			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse 70% 55% at 50% 105%, ${glowColor} 0%, transparent 70%)`,
					opacity: glowOpacity,
					pointerEvents: 'none',
				}}
			/>

			{/* Top vignette */}
			<AbsoluteFill
				style={{
					background:
						'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 16%)',
					pointerEvents: 'none',
					zIndex: 5,
				}}
			/>

			{/* Header */}
			<GroupHeader opacity={headerOpacity} memberCount={memberCount} />

			{/* Chat lane */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: '50%',
					transform: 'translateX(-50%)',
					width: CHAT_WIDTH + 96,
					bottom: 0,
					paddingTop: HEADER_H + 16,
					paddingBottom: 48,
					paddingLeft: 48,
					paddingRight: 48,
					overflow: 'hidden',
					boxSizing: 'border-box',
				}}
			>
				{/* Scrolling container */}
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: BUBBLE_GAP,
						transform: `translateY(-${scrollY}px)`,
					}}
				>
					{/* Time label */}
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							opacity: interpolate(frame, [8, 25], [0, 1], {
								extrapolateLeft: 'clamp',
								extrapolateRight: 'clamp',
							}),
							padding: '4px 0 8px',
						}}
					>
						<span
							style={{
								fontFamily,
								fontSize: 13,
								fontWeight: 500,
								color: COLORS.timeText,
							}}
						>
							Today 11:42 PM
						</span>
					</div>

					{MESSAGES.map((msg, index) => {
						const typingVisible =
							frame >= msg.typingStart && frame < msg.messageFrame;
						const bubbleVisible = frame >= msg.messageFrame;
						const isSent = msg.sender === VIEWER;

						// Insert system message before Epstein's first message
						const isEpsteinMsg = msg.sender === 'epstein' && msg.id === 17;

						if (!typingVisible && !bubbleVisible) {
							// Still render system message if it's time
							if (isEpsteinMsg && frame >= SYSTEM_MSG_FRAME) {
								return (
									<React.Fragment key={`sys-${msg.id}`}>
										<SystemMessage
											opacity={systemMsgOpacity}
											text="Jeffrey Epstein was added to the conversation"
										/>
									</React.Fragment>
								);
							}
							return null;
						}

						const typingLocalFrame = frame - msg.typingStart;
						const typingEntranceS = spring({
							frame: typingLocalFrame,
							fps,
							config: {damping: 200, stiffness: 120, mass: 0.8},
						});

						return (
							<React.Fragment key={msg.id}>
								{/* System message before Epstein */}
								{isEpsteinMsg && frame >= SYSTEM_MSG_FRAME && (
									<SystemMessage
										opacity={systemMsgOpacity}
										text="Jeffrey Epstein was added to the conversation"
									/>
								)}
								{typingVisible && (
									<TypingIndicator
										frame={typingLocalFrame}
										isSent={isSent}
										entranceSpring={typingEntranceS}
										sender={msg.sender}
									/>
								)}
								{bubbleVisible && (
									<MessageBubble
										message={msg}
										localFrame={frame - msg.messageFrame}
										fps={fps}
										showName={shouldShowName(index)}
									/>
								)}
							</React.Fragment>
						);
					})}
				</div>
			</div>

			{/* Bottom fade */}
			<div
				style={{
					position: 'absolute',
					bottom: 0,
					left: 0,
					right: 0,
					height: 80,
					background: `linear-gradient(to top, ${bgColor} 0%, transparent 100%)`,
					pointerEvents: 'none',
					zIndex: 4,
				}}
			/>

			{/* Clock */}
			<div
				style={{
					position: 'absolute',
					top: 14,
					right: 60,
					opacity: interpolate(frame, [0, 20], [0, 0.4], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					}),
					fontFamily,
					fontSize: 15,
					fontWeight: 400,
					color: COLORS.timeText,
					zIndex: 20,
				}}
			>
				11:42 PM
			</div>
		</AbsoluteFill>
	);
};
