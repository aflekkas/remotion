import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// Variable font — contains all weights (Light 300 → Black 900)
export const openSauceSans = loadFont({
	family: 'Open Sauce Sans',
	url: staticFile('fonts/OpenSauceSansVF.ttf'),
	weight: '300 900',
}).then(() => {
	console.log('Open Sauce Sans loaded');
});

export const openSauceSansItalic = loadFont({
	family: 'Open Sauce Sans',
	url: staticFile('fonts/OpenSauceSansVF-Italic.ttf'),
	weight: '300 900',
	style: 'italic',
}).then(() => {
	console.log('Open Sauce Sans Italic loaded');
});

export const fontFamily = 'Open Sauce Sans';

/**
 * Style presets for Open Sauce Sans.
 * Use spread syntax: style={{ ...fontPresets.tight, fontSize: 48 }}
 */
export const fontPresets = {
	/** Default spacing */
	normal: {
		fontFamily,
		letterSpacing: '0em',
		lineHeight: 1.4,
	} as const,
	/** Tight — reduced letter-spacing and line-height */
	tight: {
		fontFamily,
		letterSpacing: '-0.04em',
		lineHeight: 1.05,
	} as const,
	/** Extra tight — very compact, good for large headlines */
	extraTight: {
		fontFamily,
		letterSpacing: '-0.05em',
		lineHeight: 1.0,
	} as const,
} as const;
