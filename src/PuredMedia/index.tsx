import React from 'react';
import {AbsoluteFill} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';

// Font loading — must be imported before rendering begins
import './fonts';

import {Scene1Opening} from './scenes/Scene1Opening';
import {Scene2Browser} from './scenes/Scene2Browser';
import {Scene3PrecisionText} from './scenes/Scene3PrecisionText';
import {Scene4Closing} from './scenes/Scene4Closing';

import {
	SCENE1_DURATION,
	SCENE2_DURATION,
	SCENE3_DURATION,
	SCENE4_DURATION,
	TRANSITION_DURATION,
	COLORS,
} from './constants';

// Duration math:
// 72 + 108 + 48 + 48 - 3*12 = 240 frames at 24fps = 10s
// Verified: 276 - 36 = 240 ✓

export type PuredMediaAdProps = Record<string, never>;

export const PuredMediaAd: React.FC<PuredMediaAdProps> = () => {
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<TransitionSeries>
				{/* Scene 1: Opening Statement */}
				<TransitionSeries.Sequence
					durationInFrames={SCENE1_DURATION}
					premountFor={TRANSITION_DURATION}
				>
					<Scene1Opening />
				</TransitionSeries.Sequence>

				<TransitionSeries.Transition
					presentation={fade()}
					timing={linearTiming({durationInFrames: TRANSITION_DURATION})}
				/>

				{/* Scene 2: Browser Interface */}
				<TransitionSeries.Sequence
					durationInFrames={SCENE2_DURATION}
					premountFor={TRANSITION_DURATION}
				>
					<Scene2Browser />
				</TransitionSeries.Sequence>

				<TransitionSeries.Transition
					presentation={fade()}
					timing={linearTiming({durationInFrames: TRANSITION_DURATION})}
				/>

				{/* Scene 3: Precision Text */}
				<TransitionSeries.Sequence
					durationInFrames={SCENE3_DURATION}
					premountFor={TRANSITION_DURATION}
				>
					<Scene3PrecisionText />
				</TransitionSeries.Sequence>

				<TransitionSeries.Transition
					presentation={fade()}
					timing={linearTiming({durationInFrames: TRANSITION_DURATION})}
				/>

				{/* Scene 4: Closing */}
				<TransitionSeries.Sequence
					durationInFrames={SCENE4_DURATION}
					premountFor={TRANSITION_DURATION}
				>
					<Scene4Closing />
				</TransitionSeries.Sequence>
			</TransitionSeries>
		</AbsoluteFill>
	);
};
