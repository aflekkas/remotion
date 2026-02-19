import React from 'react';
import {AbsoluteFill} from 'remotion';
import {TransitionSeries, springTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {wipe} from '@remotion/transitions/wipe';

// Import fonts at module level — blocks rendering until ready
import './fonts';

import {Scene1Opening} from './scenes/Scene1Opening';
import {Scene2Problem} from './scenes/Scene2Problem';
import {Scene3Solution} from './scenes/Scene3Solution';
import {Scene4Benefits} from './scenes/Scene4Benefits';
import {Scene5CTA} from './scenes/Scene5CTA';
import {SCENE_DURATIONS} from './constants';

// Duration math:
// S1=90 + S2=90 + S3=130 + S4=110 + S5=90 = 510
// 4 transitions × 15 frames = 60 overlap
// Total = 510 - 60 = 450 frames (15s @ 30fps) ✓

export type GymFormAdProps = Record<string, never>;

export const GymFormAd: React.FC<GymFormAdProps> = () => {
	const transitionTiming = springTiming({
		config: {damping: 200, stiffness: 80, mass: 1},
		durationInFrames: SCENE_DURATIONS.transition,
	});

	return (
		<AbsoluteFill style={{background: '#04070F'}}>
			<TransitionSeries>
				{/* Scene 1: Opening hook — "$200/hr" crossed out → "$0" */}
				<TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.s1}>
					<Scene1Opening />
				</TransitionSeries.Sequence>

				<TransitionSeries.Transition
					presentation={fade()}
					timing={transitionTiming}
				/>

				{/* Scene 2: Problem statement — bad form, glitching silhouette */}
				<TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.s2}>
					<Scene2Problem />
				</TransitionSeries.Sequence>

				<TransitionSeries.Transition
					presentation={wipe({direction: 'from-left'})}
					timing={transitionTiming}
				/>

				{/* Scene 3: Solution reveal — FORMCHECK AI, phone mockup */}
				<TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.s3}>
					<Scene3Solution />
				</TransitionSeries.Sequence>

				<TransitionSeries.Transition
					presentation={wipe({direction: 'from-right'})}
					timing={transitionTiming}
				/>

				{/* Scene 4: Key benefits — staggered bullet cards */}
				<TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.s4}>
					<Scene4Benefits />
				</TransitionSeries.Sequence>

				<TransitionSeries.Transition
					presentation={fade()}
					timing={transitionTiming}
				/>

				{/* Scene 5: CTA — "Train smarter. Not more expensive." */}
				<TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.s5}>
					<Scene5CTA />
				</TransitionSeries.Sequence>
			</TransitionSeries>
		</AbsoluteFill>
	);
};
