import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from 'remotion';

type Props = {
  titleText: string;
  titleColor: string;
};

export const HelloWorld: React.FC<Props> = ({titleText, titleColor}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const opacity = interpolate(frame, [0, 1 * fps], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const scale = spring({
    frame,
    fps,
    config: {damping: 200},
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0b1215',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          color: titleColor,
          fontSize: 80,
          fontWeight: 'bold',
          fontFamily: 'sans-serif',
        }}
      >
        {titleText}
      </div>
    </AbsoluteFill>
  );
};
