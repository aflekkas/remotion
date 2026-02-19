import {Composition} from 'remotion';
import {HelloWorld} from './HelloWorld';
import {CountdownTimer} from './CountdownTimer';
import {FontTest} from './FontTest';
import {Clawdbot} from './Clawdbot';
import {SecretMission} from './SecretMission';
import {KalshiAd} from './KalshiAd';
import {PuredMediaAd} from './PuredMedia';
import {ClavicularAd} from './ClavicularAd';
import {GymFormAd} from './GymFormAd';
import {ClaudeCodeAd} from './ClaudeCodeAd';

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
      <Composition
        id="Clawdbot"
        component={Clawdbot}
        durationInFrames={780}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SecretMission"
        component={SecretMission}
        durationInFrames={1170}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="KalshiAd"
        component={KalshiAd}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="PuredMediaAd"
        component={PuredMediaAd}
        durationInFrames={240}
        fps={24}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="ClavicularAd"
        component={ClavicularAd}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      <Composition
        id="GymFormAd"
        component={GymFormAd}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="ClaudeCodeAd"
        component={ClaudeCodeAd}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
    </>
  );
};
