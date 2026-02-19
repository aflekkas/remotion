import {Composition} from 'remotion';
import {HelloWorld} from './HelloWorld';
import {CountdownTimer} from './CountdownTimer';
import {FontTest} from './FontTest';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          titleText: 'Hello from Remotion',
          titleColor: '#ffffff',
        }}
      />
      <Composition
        id="CountdownTimer"
        component={CountdownTimer}
        durationInFrames={330}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          from: 10,
          to: 0,
        }}
      />
      <Composition
        id="FontTest"
        component={FontTest}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
