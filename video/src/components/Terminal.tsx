import React from 'react';
import { useCurrentFrame, spring, useVideoConfig } from 'remotion';
import { C, FONTS } from '../styles/theme';
import { SMOOTH } from '../utils/animations';

interface TerminalProps {
  children: React.ReactNode;
  title?: string;
  width?: string;
  enterAt?: number;
  showReflection?: boolean;
}

export const Terminal: React.FC<TerminalProps> = ({
  children,
  title = 'Terminal',
  width = '85%',
  enterAt = 0,
  showReflection = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: frame - enterAt,
    fps,
    config: SMOOTH,
    durationInFrames: 20,
  });

  const scale = 0.92 + enter * 0.08;
  const opacity = enter;
  const translateY = (1 - enter) * 40;

  return (
    <div style={{ width, margin: '0 auto', position: 'relative' }}>
      {/* Main terminal */}
      <div
        style={{
          background: C.surface0,
          borderRadius: 16,
          overflow: 'hidden',
          opacity,
          transform: `translateY(${translateY}px) scale(${scale})`,
          boxShadow: `0 20px 60px rgba(0,0,0,0.5)`,
        }}
      >
        {/* Title bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '14px 18px',
            background: C.mantle,
          }}
        >
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: C.red }} />
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: C.yellow }} />
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: C.green }} />
          <span
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: 13,
              color: C.overlay0,
              fontFamily: FONTS.mono,
            }}
          >
            {title}
          </span>
        </div>

        {/* Body */}
        <div
          style={{
            padding: '28px 32px',
            fontFamily: FONTS.mono,
            fontSize: 22,
            lineHeight: 1.8,
            color: C.text,
            minHeight: 320,
            position: 'relative',
          }}
        >
          {children}
        </div>
      </div>

      {/* Reflection */}
      {showReflection && (
        <div
          style={{
            width: '100%',
            height: 60,
            opacity: opacity * 0.15,
            transform: 'scaleY(-1)',
            filter: 'blur(3px)',
            overflow: 'hidden',
            marginTop: -2,
          }}
        >
          <div
            style={{
              background: C.surface0,
              borderRadius: 16,
              height: 200,
            }}
          />
        </div>
      )}
    </div>
  );
};
