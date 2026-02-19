// Font loading — must happen at module level before any rendering
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadSpaceGrotesk } from '@remotion/google-fonts/SpaceGrotesk';

// Inter — body/UI text: 300, 400, 500
export const interFont = loadInter('normal', {
	weights: ['300', '400', '500'],
	subsets: ['latin'],
});
export const interFontFamily = interFont.fontFamily;

// Space Grotesk — headlines: 400, 500, 600, 700
export const spaceGroteskFont = loadSpaceGrotesk('normal', {
	weights: ['400', '500', '600', '700'],
	subsets: ['latin'],
});
export const spaceGroteskFontFamily = spaceGroteskFont.fontFamily;
