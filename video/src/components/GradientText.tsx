import React from 'react';
import { useCurrentFrame, spring, useVideoConfig, interpolate } from 'remotion';
import { GRADIENT_CSS, FONTS } from '../styles/theme';
import { SMOOTH } from '../utils/animations';

interface GradientTextProps {
  text: string;
  fontSize?: number;
  enterAt?: number;
  showUnderline?: boolean;
  showGlow?: boolean;
  fontFamily?: string;
}

export const GradientText: React.FC<GradientTextProps> = ({
  text,
  fontSize = 48,
  enterAt = 0,
  showUnderline = false,
  showGlow = true,
  fontFamily = FONTS.sans,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: frame - enterAt,
    fps,
    config: SMOOTH,
    durationInFrames: 25,
  });

  const shimmerOffset = interpolate(frame, [enterAt, enterAt + 60], [-100, 200], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const underlineWidth = showUnderline
    ? interpolate(frame, [enterAt + 10, enterAt + 35], [0, 100], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        opacity: enter,
        transform: `translateY(${(1 - enter) * 20}px)`,
      }}
    >
      {/* Glow bloom behind */}
      {showGlow && (
        <span
          style={{
            position: 'absolute',
            inset: 0,
            background: GRADIENT_CSS,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'blur(12px)',
            opacity: 0.35,
            fontFamily,
            fontSize,
            fontWeight: 800,
            zIndex: -1,
          }}
        >
          {text}
        </span>
      )}

      {/* Main text */}
      <span
        style={{
          fontFamily,
          fontSize,
          fontWeight: 800,
          background: GRADIENT_CSS,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          position: 'relative',
        }}
      >
        {text}
        {/* Shimmer overlay */}
        <span
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`,
            backgroundSize: '50% 100%',
            backgroundPosition: `${shimmerOffset}% 0`,
            backgroundRepeat: 'no-repeat',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mixBlendMode: 'overlay',
          }}
        >
          {text}
        </span>
      </span>

      {/* Animated underline */}
      {showUnderline && (
        <div
          style={{
            height: 3,
            width: `${underlineWidth}%`,
            background: GRADIENT_CSS,
            borderRadius: 2,
            marginTop: 4,
          }}
        />
      )}
    </div>
  );
};
