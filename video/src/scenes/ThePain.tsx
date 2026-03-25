import React from 'react';
import { useCurrentFrame, spring, useVideoConfig, interpolate, Easing } from 'remotion';
import { C, FONTS, GRADIENT_CSS, GRADIENT } from '../styles/theme';
import { TypingText } from '../components/TypingText';
import { StepPill } from '../components/StepPill';
import { ScreenFlash } from '../components/ScreenFlash';
import { BOUNCY, SMOOTH } from '../utils/animations';

const STEPS = [
  'take screenshot',
  'open browser',
  'find the issue',
  'drag image',
  'wait for upload',
  'copy the URL',
  'back to terminal',
];

export const ThePain: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // === TIMING ===
  // Frame 0-20:   Black, breathe
  // Frame 20-55:  "It's 2026." types (slower, 80ms/char)
  // Frame 60-110: "GitHub still can't upload images." types (holds longer)
  // Frame 80-120: Issue reference fades in
  // Frame 120-185: Step pills stack up (faster, 8 frames apart)
  // Frame 185-200: Red X stamp + pill explosion
  // Frame 195-218: 7→1 morph

  // Red X stamp
  const xStamp = spring({
    frame: frame - 185,
    fps,
    config: BOUNCY,
    durationInFrames: 15,
  });

  const xFade = interpolate(frame, [200, 215], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 7 → 1 morph
  const sevenAppear = interpolate(frame, [188, 195], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const morphProgress = interpolate(frame, [205, 218], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const counterFontSize = interpolate(morphProgress, [0, 1], [140, 200]);
  const sevenOpacity = 1 - morphProgress;
  const oneOpacity = morphProgress;
  const onePop = spring({
    frame: frame - 210,
    fps,
    config: { damping: 14, stiffness: 180, mass: 0.6 },
    durationInFrames: 15,
  });
  const oneScale = morphProgress > 0.5 ? 0.8 + onePop * 0.4 : 1;

  const showText = frame < 120;
  const showPills = frame >= 115 && frame < 218;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: C.base,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      {/* Scene 1.1: "It's 2026" — SLOW typing, holds on screen */}
      {showText && (
        <div
          style={{
            textAlign: 'center',
            opacity: interpolate(frame, [115, 125], [1, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          <div style={{ marginBottom: 24 }}>
            <TypingText
              text="It's 2026."
              startFrame={20}
              msPerChar={80}
              fontSize={92}
              color={C.text}
              showCursor={frame < 58}
            />
          </div>
          {frame >= 55 && (
            <div>
              <TypingText
                text="GitHub still can't upload images."
                startFrame={58}
                msPerChar={50}
                fontSize={58}
                color={C.subtext1}
                showCursor={frame < 105}
              />
            </div>
          )}
          {frame >= 85 && (
            <div
              style={{
                marginTop: 36,
                fontFamily: FONTS.mono,
                fontSize: 22,
                color: C.overlay0,
                opacity: interpolate(frame, [85, 100], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                }),
              }}
            >
              cli/cli#1895 — open since 2020. Closed. "Not planned."
            </div>
          )}
        </div>
      )}

      {/* Scene 1.2: Step pills */}
      {showPills && (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          {STEPS.map((step, i) => (
            <StepPill
              key={step}
              text={step}
              enterAt={120 + i * 8}
              explodeAt={185}
              index={i}
            />
          ))}

          {/* Red X stamp */}
          {frame >= 185 && (
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '45%',
                transform: `translate(-50%, -50%) scale(${xStamp * 1.3}) rotate(-12deg)`,
                fontSize: 220,
                color: C.red,
                fontWeight: 900,
                opacity: xStamp * xFade,
                textShadow: `0 0 60px ${C.red}, 0 0 120px ${C.red}40`,
              }}
            >
              ✗
            </div>
          )}

          {/* 7 → 1 counter */}
          {frame >= 188 && (
            <div
              style={{
                position: 'absolute',
                left: '50%',
                bottom: '18%',
                transform: `translate(-50%, 0) scale(${oneScale})`,
                fontFamily: FONTS.mono,
                fontSize: counterFontSize,
                fontWeight: 900,
                opacity: sevenAppear,
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  color: GRADIENT.magenta,
                  opacity: sevenOpacity,
                  textShadow: `0 0 40px ${GRADIENT.magenta}`,
                }}
              >
                7
              </span>
              <span
                style={{
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  color: C.green,
                  opacity: oneOpacity,
                  textShadow: `0 0 50px ${C.green}, 0 0 100px ${C.green}40`,
                }}
              >
                1
              </span>
              <span style={{ visibility: 'hidden' }}>7</span>
            </div>
          )}
        </div>
      )}

      <ScreenFlash triggerFrame={185} duration={3} opacity={0.12} />
    </div>
  );
};
