// Color palette
export const COLORS = {
	bg: '#09090B',
	bgAlt: '#0A0A0F',
	bgCard: '#111114',
	border: '#1A1A1F',
	borderMid: '#2A2A2F',
	text: '#FAFAF9',
	textMuted: '#E8E8E6',
	textDim: '#6B6B70',
	accent: '#C4A35A',
	accentDim: '#8A7040',
} as const;

// FPS for this composition
export const FPS = 24;

// Scene durations (in frames)
export const SCENE1_DURATION = 72;
export const SCENE2_DURATION = 108;
export const SCENE3_DURATION = 48;
export const SCENE4_DURATION = 48;
export const TRANSITION_DURATION = 12;

// Total: 72 + 108 + 48 + 48 - 3*12 = 240
export const TOTAL_DURATION = 240;
