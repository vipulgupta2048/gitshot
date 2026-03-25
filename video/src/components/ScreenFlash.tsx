import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

interface ScreenFlashProps {
  triggerFrame: number;
  duration?: number;
  opacity?: number;
}

export const ScreenFlash: React.FC<ScreenFlashProps> = ({
  triggerFrame,
  duration = 3,
  opacity: maxOpacity = 0.08,
}) => {
  const frame = useCurrentFrame();

  const flashOpacity = interpolate(
    frame,
    [triggerFrame, triggerFrame + 1, triggerFrame + duration],
    [0, maxOpacity, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  if (flashOpacity <= 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'white',
        opacity: flashOpacity,
        pointerEvents: 'none',
        zIndex: 98,
      }}
    />
  );
};
