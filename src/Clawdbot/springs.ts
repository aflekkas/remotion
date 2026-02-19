import type {SpringConfig} from 'remotion';

export const springConfigs = {
	smooth: {damping: 200, stiffness: 100, mass: 1} satisfies SpringConfig,
	snappy: {damping: 20, stiffness: 200, mass: 0.8} satisfies SpringConfig,
	bouncy: {damping: 12, stiffness: 150, mass: 1} satisfies SpringConfig,
	heavy: {damping: 18, stiffness: 80, mass: 1.5} satisfies SpringConfig,
	elastic: {damping: 8, stiffness: 120, mass: 1} satisfies SpringConfig,
} as const;
