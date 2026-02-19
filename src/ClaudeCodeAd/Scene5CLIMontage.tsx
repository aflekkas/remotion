import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import { fontFamily } from './fonts';
import { PALETTE } from './palette';

// ─── Terminal card showing a CLI interaction ─────────────────────────────────
type TerminalCardProps = {
	lines: { text: string; color: string; indent?: number }[];
	startFrame: number;
	endFrame: number;
};

const TerminalCard: React.FC<TerminalCardProps> = ({
	lines,
	startFrame,
	endFrame,
}) => {
	const frame = useCurrentFrame();
	const { fps, width, height } = useVideoConfig();

	const localFrame = frame - startFrame;
	if (localFrame < -2) return null;

	// Pop in with spring
	const entrance = spring({
		frame: localFrame,
		fps,
		config: { damping: 14, stiffness: 180, mass: 0.6 },
	});

	// Scale snap out
	const exitFrame = endFrame - startFrame;
	const exitProgress = interpolate(
		localFrame,
		[exitFrame - 6, exitFrame],
		[0, 1],
		{ extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
	);

	const scale =
		interpolate(entrance, [0, 1], [0.88, 1], { extrapolateRight: 'clamp' }) *
		interpolate(exitProgress, [0, 1], [1, 0.92], {
			extrapolateRight: 'clamp',
		});
	const opacity =
		interpolate(entrance, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' }) *
		interpolate(exitProgress, [0, 1], [1, 0], { extrapolateRight: 'clamp' });
	const y =
		interpolate(entrance, [0, 1], [30, 0], { extrapolateRight: 'clamp' }) +
		interpolate(exitProgress, [0, 1], [0, -20], {
			extrapolateRight: 'clamp',
		});

	const winW = 760;
	const winH = lines.length * 32 + 80;

	// Typewriter — reveal lines one at a time
	const linesVisible = Math.min(
		lines.length,
		Math.floor(localFrame / 4) + 1,
	);

	return (
		<div
			style={{
				position: 'absolute',
				left: (width - winW) / 2,
				top: (height - winH) / 2 + y,
				width: winW,
				opacity,
				transform: `scale(${scale})`,
				transformOrigin: 'center center',
			}}
		>
			{/* Terminal window */}
			<div
				style={{
					background: 'rgba(13,17,23,0.95)',
					border: `1.5px solid rgba(255,255,255,0.12)`,
					borderRadius: 12,
					overflow: 'hidden',
					boxShadow:
						'0 30px 100px rgba(0,0,0,0.8), 0 0 60px rgba(217,119,6,0.05)',
				}}
			>
				{/* Title bar */}
				<div
					style={{
						height: 40,
						background: 'rgba(255,255,255,0.035)',
						borderBottom: '1px solid rgba(255,255,255,0.08)',
						display: 'flex',
						alignItems: 'center',
						paddingLeft: 16,
						gap: 8,
					}}
				>
					<div
						style={{
							width: 12,
							height: 12,
							borderRadius: '50%',
							background: '#FF5F57',
						}}
					/>
					<div
						style={{
							width: 12,
							height: 12,
							borderRadius: '50%',
							background: '#FEBC2E',
						}}
					/>
					<div
						style={{
							width: 12,
							height: 12,
							borderRadius: '50%',
							background: '#28C840',
						}}
					/>
					<span
						style={{
							fontFamily,
							fontSize: 12,
							fontWeight: 400,
							color: 'rgba(255,255,255,0.35)',
							marginLeft: 8,
						}}
					>
						claude
					</span>
				</div>

				{/* Content */}
				<div style={{ padding: '18px 24px', minHeight: winH - 40 }}>
					{lines.slice(0, linesVisible).map((line, i) => {
						const lineLocalFrame = localFrame - i * 4;
						const lineEntrance = spring({
							frame: lineLocalFrame,
							fps,
							config: { damping: 20, stiffness: 250, mass: 0.4 },
							durationInFrames: 10,
						});
						const lineOpacity = interpolate(lineEntrance, [0, 1], [0, 1], {
							extrapolateRight: 'clamp',
						});

						return (
							<div
								key={i}
								style={{
									fontFamily: 'monospace',
									fontSize: 17,
									lineHeight: '32px',
									color: line.color,
									opacity: lineOpacity,
									paddingLeft: (line.indent ?? 0) * 16,
									whiteSpace: 'pre',
								}}
							>
								{line.text}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

// ─── Scene 5: CLI Montage ───────────────────────────────────────────────────
export const Scene5CLIMontage: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const fadeIn = interpolate(frame, [0, 8], [0, 1], {
		extrapolateRight: 'clamp',
	});

	// Card timing — snappy cuts, ~2s per card
	const C1_START = 0;
	const C1_END = Math.round(2.2 * fps);
	const C2_START = C1_END - 4;
	const C2_END = C2_START + Math.round(2.2 * fps);
	const C3_START = C2_END - 4;
	const C3_END = C3_START + Math.round(2.2 * fps);
	const C4_START = C3_END - 4;
	const C4_END = C4_START + Math.round(2.5 * fps);

	// Card 1: Fix the bug
	const card1Lines = [
		{ text: '$ claude "Fix the auth bug in login.ts"', color: PALETTE.amber },
		{ text: '', color: PALETTE.white },
		{
			text: '⏵ Reading src/auth/login.ts...',
			color: PALETTE.codeDim,
			indent: 0,
		},
		{
			text: '⏵ Reading src/auth/middleware.ts...',
			color: PALETTE.codeDim,
			indent: 0,
		},
		{ text: '', color: PALETTE.white },
		{
			text: '  Found it — token expiry check is inverted',
			color: PALETTE.codeGreen,
			indent: 0,
		},
	];

	// Card 2: Edit with diff
	const card2Lines = [
		{ text: '⏵ Editing src/auth/login.ts', color: PALETTE.codeDim },
		{ text: '', color: PALETTE.white },
		{
			text: '  - if (token.exp > Date.now()) {',
			color: '#F87171',
			indent: 0,
		},
		{
			text: '  + if (token.exp < Date.now()) {',
			color: PALETTE.codeGreen,
			indent: 0,
		},
		{ text: '', color: PALETTE.white },
		{
			text: '  ✓ Applied 1 edit to login.ts',
			color: PALETTE.codeGreen,
			indent: 0,
		},
	];

	// Card 3: Run tests
	const card3Lines = [
		{ text: '⏵ Running npm test...', color: PALETTE.codeDim },
		{ text: '', color: PALETTE.white },
		{
			text: '  ✓ auth.login        12 tests passed',
			color: PALETTE.codeGreen,
			indent: 0,
		},
		{
			text: '  ✓ auth.register      8 tests passed',
			color: PALETTE.codeGreen,
			indent: 0,
		},
		{
			text: '  ✓ auth.middleware   15 tests passed',
			color: PALETTE.codeGreen,
			indent: 0,
		},
		{ text: '', color: PALETTE.white },
		{
			text: '  All 35 tests passed ✓',
			color: PALETTE.white,
			indent: 0,
		},
	];

	// Card 4: Create PR
	const card4Lines = [
		{ text: '⏵ Creating pull request...', color: PALETTE.codeDim },
		{ text: '', color: PALETTE.white },
		{
			text: '  PR #247: Fix token expiry validation',
			color: PALETTE.white,
			indent: 0,
		},
		{
			text: '  1 file changed, 1 insertion(+), 1 deletion(-)',
			color: PALETTE.codeDim,
			indent: 0,
		},
		{ text: '', color: PALETTE.white },
		{
			text: '  ✓ Ready for review',
			color: PALETTE.codeGreen,
			indent: 0,
		},
	];

	return (
		<AbsoluteFill style={{ background: PALETTE.bgDeep, opacity: fadeIn }}>
			{/* Subtle ambient glow */}
			<AbsoluteFill
				style={{
					background:
						'radial-gradient(ellipse 50% 40% at 50% 50%, rgba(217,119,6,0.04) 0%, transparent 70%)',
					pointerEvents: 'none',
				}}
			/>

			{frame >= C1_START && frame < C1_END && (
				<TerminalCard
					lines={card1Lines}
					startFrame={C1_START}
					endFrame={C1_END}
				/>
			)}

			{frame >= C2_START && frame < C2_END && (
				<TerminalCard
					lines={card2Lines}
					startFrame={C2_START}
					endFrame={C2_END}
				/>
			)}

			{frame >= C3_START && frame < C3_END && (
				<TerminalCard
					lines={card3Lines}
					startFrame={C3_START}
					endFrame={C3_END}
				/>
			)}

			{frame >= C4_START && (
				<TerminalCard
					lines={card4Lines}
					startFrame={C4_START}
					endFrame={C4_END}
				/>
			)}

			{/* Vignette */}
			<AbsoluteFill
				style={{
					background:
						'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 40%, rgba(10,10,15,0.5) 100%)',
					pointerEvents: 'none',
				}}
			/>
		</AbsoluteFill>
	);
};
