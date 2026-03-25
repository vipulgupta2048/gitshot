import { Composition } from 'remotion';
import { GitshotDemo } from './GitshotDemo';
import { FPS, DURATION_FRAMES, WIDTH, HEIGHT } from './utils/constants';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="GitshotDemo"
        component={GitshotDemo}
        durationInFrames={DURATION_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      {/* Twitter/X landscape */}
      <Composition
        id="GitshotTwitter"
        component={GitshotDemo}
        durationInFrames={DURATION_FRAMES}
        fps={FPS}
        width={1280}
        height={720}
      />

      {/* Product Hunt square */}
      <Composition
        id="GitshotSquare"
        component={GitshotDemo}
        durationInFrames={DURATION_FRAMES}
        fps={FPS}
        width={1080}
        height={1080}
      />
    </>
  );
};
