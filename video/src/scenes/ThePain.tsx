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

// GitHub Invertocat SVG (simplified mark)
const GitHubLogo: React.FC<{ size: number; opacity: number }> = ({ size, opacity }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 98 96"
    style={{ opacity }}
    fill={C.overlay0}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
    />
  </svg>
);

export const ThePain: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // === TIMING ===
  // "It's 2026." = 10 chars × 60ms = 600ms = 18 frames. Start 12, done ~30.
  // "GitHub still can't upload images." = 33 chars × 40ms = 1320ms = 40 frames. Start 38, done ~78.
  // Issue ref fades in at 70, fully visible by 85.
  // Text holds until frame 125, fades 125-135.
  // Pills start at 130.

  const xStamp = spring({
    frame: frame - 190,
    fps,
    config: BOUNCY,
    durationInFrames: 15,
  });

  const xFade = interpolate(frame, [205, 218], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const sevenAppear = interpolate(frame, [193, 200], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const morphProgress = interpolate(frame, [208, 222], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const counterFontSize = interpolate(morphProgress, [0, 1], [140, 200]);
  const sevenOpacity = 1 - morphProgress;
  const oneOpacity = morphProgress;
  const onePop = spring({
    frame: frame - 215,
    fps,
    config: { damping: 14, stiffness: 180, mass: 0.6 },
    durationInFrames: 15,
  });
  const oneScale = morphProgress > 0.5 ? 0.8 + onePop * 0.4 : 1;

  // GitHub logo fades in with the text
  const logoOpacity = interpolate(frame, [8, 18], [0, 0.5], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const logoFadeOut = interpolate(frame, [125, 135], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const showText = frame < 135;
  const showPills = frame >= 128 && frame < 228;

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
      {/* Scene 1.1: Text + GitHub logo */}
      {showText && (
        <div
          style={{
            textAlign: 'center',
            opacity: interpolate(frame, [125, 135], [1, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          {/* GitHub logo — fades in above text */}
          <div style={{ marginBottom: 28 }}>
            <GitHubLogo size={64} opacity={logoOpacity * logoFadeOut} />
          </div>

          {/* "It's 2026." — 10 chars × 60ms = done in 18 frames */}
          <div style={{ marginBottom: 20 }}>
            <TypingText
              text="It's 2026."
              startFrame={12}
              msPerChar={60}
              fontSize={92}
              color={C.text}
              showCursor={frame < 36}
            />
          </div>

          {/* "GitHub still can't upload images." — 33 chars × 40ms = done in 40 frames */}
          {frame >= 34 && (
            <div>
              <TypingText
                text="GitHub still can't upload images."
                startFrame={36}
                msPerChar={40}
                fontSize={58}
                color={C.subtext1}
                showCursor={frame < 85}
              />
            </div>
          )}

          {/* Issue reference — fades in, plenty of time to read */}
          {frame >= 72 && (
            <div
              style={{
                marginTop: 32,
                fontFamily: FONTS.mono,
                fontSize: 22,
                color: C.overlay0,
                opacity: interpolate(frame, [72, 88], [0, 1], {
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
              enterAt={130 + i * 8}
              explodeAt={190}
              index={i}
            />
          ))}

          {/* Red X stamp */}
          {frame >= 190 && (
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
          {frame >= 193 && (
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

      <ScreenFlash triggerFrame={190} duration={3} opacity={0.12} />
    </div>
  );
};
