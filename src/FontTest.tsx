import {AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import './load-fonts';
import {fontFamily, fontPresets} from './load-fonts';

const weights = [300, 400, 500, 600, 700, 800, 900] as const;
const weightLabels: Record<number, string> = {
	300: 'Light',
	400: 'Regular',
	500: 'Medium',
	600: 'SemiBold',
	700: 'Bold',
	800: 'ExtraBold',
	900: 'Black',
};

const WeightShowcase: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	return (
		<AbsoluteFill
			style={{
				backgroundColor: '#0f0f0f',
				padding: 80,
				justifyContent: 'center',
				gap: 8,
			}}
		>
			<div
				style={{
					fontFamily,
					fontSize: 28,
					color: '#666',
					marginBottom: 24,
					fontWeight: 400,
				}}
			>
				Open Sauce Sans — All Weights
			</div>
			{weights.map((weight, i) => {
				const delay = i * Math.round(fps / 6);
				const opacity = interpolate(frame - delay, [0, Math.round(0.5 * fps)], [0, 1], {
					extrapolateRight: 'clamp',
					extrapolateLeft: 'clamp',
				});
				const x = interpolate(frame - delay, [0, Math.round(0.5 * fps)], [30, 0], {
					extrapolateRight: 'clamp',
					extrapolateLeft: 'clamp',
				});

				return (
					<div
						key={weight}
						style={{
							fontFamily,
							fontWeight: weight,
							fontSize: 52,
							color: '#ffffff',
							opacity,
							transform: `translateX(${x}px)`,
						}}
					>
						{weightLabels[weight]} ({weight}) — The quick brown fox
					</div>
				);
			})}
			<div
				style={{
					fontFamily,
					fontWeight: 400,
					fontStyle: 'italic',
					fontSize: 42,
					color: '#aaaaaa',
					marginTop: 24,
					opacity: interpolate(frame - Math.round(1.33 * fps), [0, Math.round(0.5 * fps)], [0, 1], {
						extrapolateRight: 'clamp',
						extrapolateLeft: 'clamp',
					}),
				}}
			>
				Italic — The quick brown fox jumps over the lazy dog
			</div>
		</AbsoluteFill>
	);
};

const SpacingShowcase: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const presetEntries = [
		{name: 'Normal', preset: fontPresets.normal},
		{name: 'Tight', preset: fontPresets.tight},
		{name: 'Extra Tight', preset: fontPresets.extraTight},
	] as const;

	return (
		<AbsoluteFill
			style={{
				backgroundColor: '#0f0f0f',
				padding: 80,
				justifyContent: 'center',
				gap: 40,
			}}
		>
			<div
				style={{
					fontFamily,
					fontSize: 28,
					color: '#666',
					fontWeight: 400,
				}}
			>
				Open Sauce Sans — Spacing Presets
			</div>
			{presetEntries.map(({name, preset}, i) => {
				const delay = i * Math.round(fps / 3);
				const opacity = interpolate(frame - delay, [0, Math.round(0.5 * fps)], [0, 1], {
					extrapolateRight: 'clamp',
					extrapolateLeft: 'clamp',
				});

				return (
					<div key={name} style={{opacity}}>
						<div
							style={{
								fontFamily,
								fontSize: 20,
								color: '#888',
								marginBottom: 8,
								fontWeight: 400,
							}}
						>
							{name} (letter-spacing: {preset.letterSpacing}, line-height:{' '}
							{preset.lineHeight})
						</div>
						<div
							style={{
								...preset,
								fontWeight: 700,
								fontSize: 72,
								color: '#ffffff',
							}}
						>
							Build Something Great
						</div>
						<div
							style={{
								...preset,
								fontWeight: 400,
								fontSize: 36,
								color: '#cccccc',
							}}
						>
							The quick brown fox jumps over the lazy dog
						</div>
					</div>
				);
			})}
		</AbsoluteFill>
	);
};

export const FontTest: React.FC = () => {
	const {fps} = useVideoConfig();

	return (
		<>
			<Sequence durationInFrames={3 * fps}>
				<WeightShowcase />
			</Sequence>
			<Sequence from={3 * fps} durationInFrames={3 * fps}>
				<SpacingShowcase />
			</Sequence>
		</>
	);
};
