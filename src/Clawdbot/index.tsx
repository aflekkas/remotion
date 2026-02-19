import React from 'react';
import {AbsoluteFill} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {Scene1Intro} from './scenes/Scene1Intro';
import {Scene2PhoneAppears} from './scenes/Scene2PhoneAppears';
import {Scene3UserTypes} from './scenes/Scene3UserTypes';
import {Scene4AIResponds} from './scenes/Scene4AIResponds';
import {Scene5Outro} from './scenes/Scene5Outro';
import type {ClawdbotProps} from './types';

// Import fonts
import '../load-fonts';

// Scene durations (raw frames at 30fps) — snappy pacing
const SCENE1 = 90;
const SCENE2 = 100;
const SCENE3 = 170;
const SCENE4 = 200;
const SCENE5 = 280;
const TRANSITION = 15;

// Total: 90+100+170+200+280 - 4*15 = 780. Comp duration updated to match.

export const Clawdbot: React.FC<ClawdbotProps> = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#0A0E27'}}>
			<TransitionSeries>
				{/* Scene 1: Hook/Intro */}
				<TransitionSeries.Sequence durationInFrames={SCENE1}>
					<Scene1Intro />
				</TransitionSeries.Sequence>

				<TransitionSeries.Transition
					presentation={fade()}
					timing={linearTiming({durationInFrames: TRANSITION})}
				/>

				{/* Scene 2: Phone Appears */}
				<TransitionSeries.Sequence durationInFrames={SCENE2}>
					<Scene2PhoneAppears />
				</TransitionSeries.Sequence>

				<TransitionSeries.Transition
					presentation={slide({direction: 'from-bottom'})}
					timing={linearTiming({durationInFrames: TRANSITION})}
				/>

				{/* Scene 3: User Types */}
				<TransitionSeries.Sequence durationInFrames={SCENE3}>
					<Scene3UserTypes />
				</TransitionSeries.Sequence>

				<TransitionSeries.Transition
					presentation={fade()}
					timing={linearTiming({durationInFrames: TRANSITION})}
				/>

				{/* Scene 4: AI Responds */}
				<TransitionSeries.Sequence durationInFrames={SCENE4}>
					<Scene4AIResponds />
				</TransitionSeries.Sequence>

				<TransitionSeries.Transition
					presentation={fade()}
					timing={linearTiming({durationInFrames: TRANSITION})}
				/>

				{/* Scene 5: Outro */}
				<TransitionSeries.Sequence durationInFrames={SCENE5}>
					<Scene5Outro />
				</TransitionSeries.Sequence>
			</TransitionSeries>
		</AbsoluteFill>
	);
};
