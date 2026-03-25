import React from 'react';
import { useCurrentFrame } from 'remotion';

export const FilmGrain: React.FC = () => {
  const frame = useCurrentFrame();

  // Animated SVG noise — shifts every frame for organic feel
  const seed = frame * 7;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.035,
        mixBlendMode: 'overlay',
        pointerEvents: 'none',
        zIndex: 100,
      }}
    >
      <svg width="100%" height="100%">
        <filter id={`grain-${frame}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="4"
            seed={seed}
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${frame})`} />
      </svg>
    </div>
  );
};
