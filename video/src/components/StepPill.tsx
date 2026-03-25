import React from 'react';
import { useCurrentFrame, spring, useVideoConfig, interpolate } from 'remotion';
import { C, FONTS } from '../styles/theme';
import { SNAPPY, BOUNCY } from '../utils/animations';

interface StepPillProps {
  text: string;
  enterAt: number;
  explodeAt?: number;
  index: number;
}

export const StepPill: React.FC<StepPillProps> = ({
  text,
  enterAt,
  explodeAt = 170,
  index,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: frame - enterAt,
    fps,
    config: SNAPPY,
    durationInFrames: 12,
  });

  // Explode outward when red X hits
  const isExploding = frame >= explodeAt;
  const explodeProgress = isExploding
    ? interpolate(frame, [explodeAt, explodeAt + 15], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  // Each pill explodes in a different direction
  const angle = (index / 7) * Math.PI * 2 + Math.PI * 0.3;
  const explodeX = Math.cos(angle) * 600 * explodeProgress;
  const explodeY = Math.sin(angle) * 400 * explodeProgress;
  const explodeRotate = (index % 2 === 0 ? 1 : -1) * 360 * explodeProgress;
  const explodeOpacity = 1 - explodeProgress;

  // Slight chaotic rotation on enter
  const chaos = (index - 3) * 2.5;

  const baseY = -index * 52;

  if (enter <= 0 && !isExploding) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        bottom: '40%',
        transform: `
          translate(-50%, ${baseY}px)
          translate(${explodeX}px, ${explodeY}px)
          rotate(${chaos * (1 - enter * 0.5) + explodeRotate}deg)
          scale(${enter})
        `,
        opacity: Math.min(enter, explodeOpacity),
        padding: '10px 22px',
        background: C.surface1,
        borderRadius: 100,
        fontFamily: FONTS.mono,
        fontSize: 18,
        color: C.subtext0,
        whiteSpace: 'nowrap',
        border: `1px solid ${C.surface2}`,
      }}
    >
      {text}
    </div>
  );
};
