import React, { useMemo } from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { GRADIENT } from '../styles/theme';

interface ParticleBurstProps {
  triggerFrame: number;
  x: number;
  y: number;
  count?: number;
  duration?: number;
}

const COLORS = [GRADIENT.magenta, GRADIENT.purple, GRADIENT.blue, GRADIENT.cyan, GRADIENT.teal];

export const ParticleBurst: React.FC<ParticleBurstProps> = ({
  triggerFrame,
  x,
  y,
  count = 30,
  duration = 40,
}) => {
  const frame = useCurrentFrame();

  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      angle: (i / count) * Math.PI * 2 + (i * 0.3),
      speed: 80 + Math.random() * 200,
      size: 3 + Math.random() * 5,
      color: COLORS[i % COLORS.length],
      delay: Math.random() * 3,
    }));
  }, [count]);

  const elapsed = frame - triggerFrame;
  if (elapsed < 0 || elapsed > duration) return null;

  return (
    <>
      {particles.map((p, i) => {
        const t = Math.max(0, elapsed - p.delay) / duration;
        const distance = p.speed * t;
        const px = x + Math.cos(p.angle) * distance;
        const py = y + Math.sin(p.angle) * distance;
        const opacity = interpolate(t, [0, 0.3, 1], [0, 1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const scale = interpolate(t, [0, 0.2, 1], [0, 1, 0.3], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: px,
              top: py,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: p.color,
              opacity,
              transform: `scale(${scale})`,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
              pointerEvents: 'none',
            }}
          />
        );
      })}
    </>
  );
};
