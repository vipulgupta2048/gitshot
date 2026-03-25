import React from 'react';
import { useCurrentFrame, spring, useVideoConfig } from 'remotion';
import { C, FONTS, GRADIENT_CSS } from '../styles/theme';
import { SNAPPY } from '../utils/animations';

interface FeatureCardProps {
  title: string;
  subtitle: string;
  enterAt: number;
  fromDirection?: 'left' | 'right' | 'top' | 'bottom';
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  subtitle,
  enterAt,
  fromDirection = 'bottom',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: frame - enterAt,
    fps,
    config: SNAPPY,
    durationInFrames: 18,
  });

  const directionMap = {
    left: { x: -60, y: 0 },
    right: { x: 60, y: 0 },
    top: { x: 0, y: -60 },
    bottom: { x: 0, y: 60 },
  };

  const dir = directionMap[fromDirection];
  const tx = dir.x * (1 - enter);
  const ty = dir.y * (1 - enter);
  const initialRotate = fromDirection === 'left' ? -3 : fromDirection === 'right' ? 3 : 0;
  const rotate = initialRotate * (1 - enter);

  return (
    <div
      style={{
        background: 'rgba(49, 50, 68, 0.6)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: 16,
        padding: '32px 28px',
        border: '1px solid rgba(205, 214, 244, 0.1)',
        opacity: enter,
        transform: `translate(${tx}px, ${ty}px) rotate(${rotate}deg) perspective(800px) rotateY(${(1 - enter) * 5}deg)`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)`,
      }}
    >
      <div
        style={{
          fontFamily: FONTS.sans,
          fontSize: 26,
          fontWeight: 700,
          color: C.text,
          marginBottom: 10,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: FONTS.mono,
          fontSize: 17,
          color: C.subtext0,
          lineHeight: 1.6,
          whiteSpace: 'pre-line',
        }}
      >
        {subtitle}
      </div>
    </div>
  );
};
