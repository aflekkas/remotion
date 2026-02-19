import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

type DigitProps = {
  number: number;
};

const CountdownDigit: React.FC<DigitProps> = ({number}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const enterScale = spring({
    frame,
    fps,
    config: {damping: 12, stiffness: 200, overshootClamping: false},
    durationInFrames: Math.floor(durationInFrames * 0.3),
  });

  const opacity = interpolate(
    frame,
    [0, 8, durationInFrames - 8, durationInFrames],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0b1215',
      }}
    >
      <div
        style={{
          fontSize: 280,
          fontWeight: 'bold',
          fontFamily: 'sans-serif',
          color: '#ffffff',
          transform: `scale(${enterScale})`,
          opacity,
        }}
      >
        {number}
      </div>
    </AbsoluteFill>
  );
};

type Props = {
  from: number;
  to: number;
};

export const CountdownTimer: React.FC<Props> = ({from, to}) => {
  const {fps} = useVideoConfig();
  const count = from - to + 1;
  const numbers = Array.from({length: count}, (_, i) => from - i);

  return (
    <AbsoluteFill>
      {numbers.map((num, i) => (
        <Sequence
          key={num}
          from={i * fps}
          durationInFrames={fps}
          name={`Count-${num}`}
        >
          <CountdownDigit number={num} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
