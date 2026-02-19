import { loadFont } from '@remotion/google-fonts/Inter';

// Load Inter at module top level — blocks render until ready
const { fontFamily } = loadFont('normal', {
	weights: ['300', '400', '500', '600', '700', '800'],
	subsets: ['latin'],
});

export { fontFamily };
