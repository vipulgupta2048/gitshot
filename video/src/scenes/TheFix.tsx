import React from 'react';
import { useCurrentFrame, spring, useVideoConfig, interpolate, Easing, Img, staticFile } from 'remotion';
import { C, FONTS, GRADIENT_CSS, GRADIENT } from '../styles/theme';
import { Terminal } from '../components/Terminal';
import { TypingText } from '../components/TypingText';
import { GradientText } from '../components/GradientText';
import { SMOOTH, BOUNCY } from '../utils/animations';

export const TheFix: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // === TIMING (relative to Act 2 start) ===
  // Frame 0-15:   Brand "gitshot" springs in
  // Frame 25-80:  Tagline fades in with underline, holds
  // Frame 75-85:  Banner fades out
  // Frame 85+:    Terminal enters
  // Frame 95-135: First command types: $ npx gitshot rick.gif --pr 42
  // Frame 140+:   Output appears
  // Frame 165-210: Second command types
  // Frame 215+:   Check mark + output
  // Frame 235-270: Terminal fades, real screenshot morphs in

  const brandEnter = spring({
    frame: frame - 5,
    fps,
    config: { damping: 30, stiffness: 80, mass: 1.2 },
    durationInFrames: 30,
  });

  const bannerFade = interpolate(frame, [75, 88], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const termEnter = spring({
    frame: frame - 85,
    fps,
    config: SMOOTH,
    durationInFrames: 20,
  });

  const checkBounce = spring({
    frame: frame - 215,
    fps,
    config: BOUNCY,
    durationInFrames: 15,
  });

  // Morph: real screenshot flies in
  const morphProgress = interpolate(frame, [235, 260], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const termFadeDuringMorph = interpolate(frame, [235, 255], [1, 0.2], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const showBanner = frame < 88;
  const showTerminal = frame >= 82;
  const showMorph = frame >= 235;

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
        overflow: 'hidden',
      }}
    >
      {/* Brand reveal — "gitshot" large gradient text */}
      {showBanner && (
        <div
          style={{
            textAlign: 'center',
            opacity: bannerFade,
            transform: `translateY(${(1 - brandEnter) * 50}px) scale(${0.7 + brandEnter * 0.3})`,
          }}
        >
          <div style={{ position: 'relative', display: 'inline-block' }}>
            {/* Glow bloom */}
            <span
              style={{
                position: 'absolute',
                inset: 0,
                fontFamily: FONTS.mono,
                fontSize: 130,
                fontWeight: 900,
                letterSpacing: -3,
                background: GRADIENT_CSS,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'blur(30px)',
                opacity: 0.4,
              }}
            >
              gitshot
            </span>
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 130,
                fontWeight: 900,
                letterSpacing: -3,
                background: GRADIENT_CSS,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                position: 'relative',
              }}
            >
              gitshot
            </span>
          </div>

          <div style={{ marginTop: 28 }}>
            <GradientText
              text="Screenshots on GitHub, now without a browser."
              fontSize={36}
              enterAt={25}
              showUnderline
              fontFamily={FONTS.sans}
            />
          </div>
        </div>
      )}

      {/* Terminal demo */}
      {showTerminal && (
        <div
          style={{
            width: '100%',
            padding: '0 100px',
            opacity: termEnter * termFadeDuringMorph,
            transform: `translateY(${(1 - termEnter) * 40}px)`,
          }}
        >
          <Terminal enterAt={85} title="gitshot" width="100%">
            {/* First command — using new --pr flag */}
            <div>
              <TypingText
                text="$ npx gitshot rick.gif --pr 42"
                startFrame={95}
                msPerChar={55}
                color={C.green}
                fontSize={24}
                showCursor={frame < 140}
              />
            </div>

            {frame >= 140 && (
              <div style={{ marginTop: 6 }}>
                <span style={{ color: C.overlay0, fontSize: 20 }}>⠋ Uploading via release backend...</span>
              </div>
            )}

            {frame >= 150 && (
              <div style={{ fontSize: 20, marginTop: 2 }}>
                <span style={{ color: C.green }}>✓</span>
                <span style={{ color: C.overlay0 }}> Uploaded </span>
                <span style={{ color: GRADIENT.cyan, textShadow: `0 0 8px ${GRADIENT.cyan}30` }}>
                  rick-81f14d68.gif
                </span>
              </div>
            )}

            {frame >= 155 && (
              <div style={{ fontSize: 20, marginTop: 2 }}>
                <span style={{ color: C.green }}>✓</span>
                <span style={{ color: C.overlay0 }}> Commented on PR #42</span>
              </div>
            )}

            {/* Second command — using new --issue flag */}
            {frame >= 175 && (
              <div style={{ marginTop: 24 }}>
                <TypingText
                  text="$ gitshot rick.gif --new-issue &quot;Test: gitshot image upload&quot;"
                  startFrame={175}
                  msPerChar={40}
                  color={C.green}
                  fontSize={24}
                  showCursor={frame < 225}
                />
              </div>
            )}

            {frame >= 220 && (
              <div style={{ fontSize: 20, marginTop: 6 }}>
                <span style={{ color: C.green }}>✓</span>
                <span style={{ color: C.overlay0 }}> Created issue </span>
                <span style={{ color: GRADIENT.cyan }}>#1</span>
                <span style={{ color: C.overlay0 }}> with image</span>
              </div>
            )}

            {/* Green check mark */}
            {frame >= 218 && (
              <span
                style={{
                  position: 'absolute',
                  right: 40,
                  bottom: 30,
                  fontSize: 56,
                  color: C.green,
                  transform: `scale(${checkBounce})`,
                  textShadow: `0 0 20px ${C.green}80`,
                }}
              >
                ✓
              </span>
            )}
          </Terminal>
        </div>
      )}

      {/* Morph: REAL screenshot of GitHub issue with rick.gif */}
      {showMorph && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: `translate(-50%, ${-50 + (1 - morphProgress) * 20}%) scale(${0.85 + morphProgress * 0.15})`,
            opacity: morphProgress,
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: `0 24px 80px rgba(0,0,0,0.7), 0 0 60px ${GRADIENT.purple}20`,
            border: `2px solid ${C.surface1}`,
            maxWidth: 800,
          }}
        >
          <Img
            src={staticFile('result.png')}
            style={{
              width: 800,
              display: 'block',
            }}
          />
        </div>
      )}
    </div>
  );
};
