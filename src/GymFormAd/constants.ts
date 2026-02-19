// ─── Color palette ───────────────────────────────────────────────────────────
export const COLORS = {
	// Backgrounds
	bgDeep: '#04070F',
	bgNavy: '#080D1A',
	bgMid: '#0A1020',

	// Accent — electric blue
	blue: '#00D4FF',
	blueDim: '#00A8CC',
	blueGlow: '#00D4FF44',

	// Accent — vibrant green
	green: '#00FF88',
	greenDim: '#00CC6A',
	greenGlow: '#00FF8844',

	// Neutrals
	white: '#FFFFFF',
	offWhite: '#E8EEF4',
	muted: '#8899AA',
	dimText: '#4A5568',

	// Danger / crossed-out
	red: '#FF4B6E',
	redGlow: '#FF4B6E33',
} as const;

// ─── Spring configs ───────────────────────────────────────────────────────────
export const SPRINGS = {
	// Smooth entrance, no overshoot
	gentle: {damping: 200, stiffness: 100, mass: 1},
	// Organic settle with slight overshoot
	organic: {damping: 15, stiffness: 80, mass: 0.8},
	// Elastic pop — playful, bouncy
	elastic: {damping: 8, stiffness: 150, mass: 0.5},
	// Heavy, weighty entrance
	heavy: {damping: 30, stiffness: 40, mass: 2},
} as const;

// ─── Timing (at 30fps) ───────────────────────────────────────────────────────
// Total composition = 450 frames (15s @ 30fps)
// 5 scenes + 4 transitions of 15 frames each
// Sum of scene durations must = 450 + 4*15 = 510
export const SCENE_DURATIONS = {
	s1: 90, // 0-3s: Opening hook
	s2: 90, // 3-6s: Problem statement
	s3: 130, // 6-10.3s: Solution reveal
	s4: 110, // 10.3-13.3s: Key benefits
	s5: 90, // 13.3-16s (trimmed by comp): CTA
	transition: 15,
} as const;

// Total = 90+90+130+110+90 - 4*15 = 510 - 60 = 450 ✓
