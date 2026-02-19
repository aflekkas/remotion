/**
 * ClaudeCodeAd — "Code at the Speed of Thought"
 * 30-second cinematic advertisement for Claude Code (Anthropic CLI).
 * 1920×1080 @ 30fps = 900 frames total.
 *
 * Scene map (snappy pacing):
 *   Scene 1 — Cold Open        (0–45f    / 0–1.5s)
 *   Scene 2 — The Prompt       (45–135f  / 1.5–4.5s)
 *   Scene 3 — Thinking Surge   (135–195f / 4.5–6.5s)
 *   Scene 4 — Code Cascade     (195–390f / 6.5–13s)
 *   Scene 5 — CLI Montage      (390–690f / 13–23s)
 *   Scene 6 — Hero Card        (690–900f / 23–30s)
 */

import React from 'react';
import { AbsoluteFill, Sequence, useVideoConfig } from 'remotion';

// Font loaded at module top-level — ensures it's ready before first render
import './fonts';

import { Scene1ColdOpen } from './Scene1ColdOpen';
import { Scene2Prompt } from './Scene2Prompt';
import { Scene3ThinkingSurge } from './Scene3ThinkingSurge';
import { Scene4CodeCascade } from './Scene4CodeCascade';
import { Scene5CLIMontage } from './Scene5CLIMontage';
import { Scene6HeroCard } from './Scene6HeroCard';
import { PALETTE } from './palette';

export type ClaudeCodeAdProps = Record<string, never>;

export const ClaudeCodeAd: React.FC<ClaudeCodeAdProps> = () => {
	const { fps } = useVideoConfig();

	// ─── Scene timing — tight, snappy cuts ──────────────────────────────────
	const S1_START = 0;
	const S1_DUR = Math.round(1.5 * fps); // 45f

	const S2_START = S1_DUR;
	const S2_DUR = 3 * fps; // 90f

	const S3_START = S2_START + S2_DUR;
	const S3_DUR = 2 * fps; // 60f

	const S4_START = S3_START + S3_DUR;
	const S4_DUR = Math.round(6.5 * fps); // 195f

	const S5_START = S4_START + S4_DUR;
	const S5_DUR = 10 * fps; // 300f

	const S6_START = S5_START + S5_DUR;
	const S6_DUR = 30 * fps - S6_START; // remaining frames

	const PREMOUNT = Math.round(0.5 * fps);

	return (
		<AbsoluteFill style={{ background: PALETTE.bgDeep }}>
			{/* Scene 1 — Cold Open */}
			<Sequence
				from={S1_START}
				durationInFrames={S1_DUR + 8}
				premountFor={PREMOUNT}
			>
				<Scene1ColdOpen />
			</Sequence>

			{/* Scene 2 — The Prompt */}
			<Sequence
				from={S2_START}
				durationInFrames={S2_DUR + 8}
				premountFor={PREMOUNT}
			>
				<Scene2Prompt />
			</Sequence>

			{/* Scene 3 — AI Thinking Surge */}
			<Sequence
				from={S3_START}
				durationInFrames={S3_DUR + 8}
				premountFor={PREMOUNT}
			>
				<Scene3ThinkingSurge />
			</Sequence>

			{/* Scene 4 — Code Cascade */}
			<Sequence
				from={S4_START}
				durationInFrames={S4_DUR}
				premountFor={PREMOUNT}
			>
				<Scene4CodeCascade />
			</Sequence>

			{/* Scene 5 — CLI Montage */}
			<Sequence
				from={S5_START}
				durationInFrames={S5_DUR}
				premountFor={PREMOUNT}
			>
				<Scene5CLIMontage />
			</Sequence>

			{/* Scene 6 — Hero Card */}
			<Sequence
				from={S6_START}
				durationInFrames={S6_DUR}
				premountFor={PREMOUNT}
			>
				<Scene6HeroCard />
			</Sequence>
		</AbsoluteFill>
	);
};
