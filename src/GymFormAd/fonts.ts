import {loadFont} from '@remotion/google-fonts/Inter';

// Load Inter at module level — blocks rendering until font is ready.
// Only latin subset, needed weights only — avoids timeout.
const {fontFamily} = loadFont('normal', {
	weights: ['400', '500', '700', '900'],
	subsets: ['latin'],
});

export const interFont = fontFamily;

export const textStyles = {
	hero: {
		fontFamily,
		fontWeight: 900,
		letterSpacing: '-0.04em',
		lineHeight: 1.0,
	} as const,
	heading: {
		fontFamily,
		fontWeight: 700,
		letterSpacing: '-0.03em',
		lineHeight: 1.1,
	} as const,
	body: {
		fontFamily,
		fontWeight: 500,
		letterSpacing: '-0.01em',
		lineHeight: 1.4,
	} as const,
	label: {
		fontFamily,
		fontWeight: 400,
		letterSpacing: '0.08em',
		lineHeight: 1.2,
	} as const,
} as const;
