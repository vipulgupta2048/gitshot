import React from 'react';
import { useCurrentFrame, spring, useVideoConfig, interpolate } from 'remotion';
import { C, FONTS, GRADIENT_CSS, GRADIENT } from '../styles/theme';
import { GradientText } from '../components/GradientText';
import { ParticleBurst } from '../components/ParticleBurst';
import { SMOOTH, BOUNCY } from '../utils/animations';

const ASCII_BANNER_SMALL = `██████╗ ██╗████████╗███████╗██╗  ██╗ ██████╗ ████████╗
██╔════╝ ██║╚══██╔══╝██╔════╝██║  ██║██╔═══██╗╚══██╔══╝
██║  ███╗██║   ██║   ███████╗███████║██║   ██║   ██║
██║   ██║██║   ██║   ╚════██║██╔══██║██║   ██║   ██║
╚██████╔╝██║   ██║   ███████║██║  ██║╚██████╔╝   ██║
 ╚═════╝ ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝ ╚═════╝    ╚═╝`;

export const Install: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Install command entrance
  const cmdEnter = spring({
    frame,
    fps,
    config: SMOOTH,
    durationInFrames: 20,
  });

  // Shimmer sweep
  const shimmerX = interpolate(frame, [5, 50], [-100, 200], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Alternatives fade in
  const altOpacity = interpolate(frame, [60, 80], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // End card (frame 120+)
  const showEndCard = frame >= 120;
  const endCardEnter = spring({
    frame: frame - 120,
    fps,
    config: BOUNCY,
    durationInFrames: 20,
  });

  // Star counter
  const starCount = showEndCard
    ? Math.min(47, Math.floor(interpolate(frame, [130, 165], [0, 47], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })))
    : 0;

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
      {!showEndCard && (
        <>
          {/* Main install command */}
          <div
            style={{
              opacity: cmdEnter,
              transform: `scale(${0.9 + cmdEnter * 0.1})`,
              position: 'relative',
            }}
          >
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 52,
                fontWeight: 700,
                background: GRADIENT_CSS,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                position: 'relative',
                display: 'inline-block',
              }}
            >
              npx gitshot your-image.png
              {/* Shimmer */}
              <span
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)`,
                  backgroundSize: '40% 100%',
                  backgroundPosition: `${shimmerX}% 0`,
                  backgroundRepeat: 'no-repeat',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                npx gitshot your-image.png
              </span>
            </span>

            {/* Glow bloom */}
            <span
              style={{
                position: 'absolute',
                inset: 0,
                fontFamily: FONTS.mono,
                fontSize: 52,
                fontWeight: 700,
                background: GRADIENT_CSS,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'blur(15px)',
                opacity: 0.3,
                zIndex: -1,
              }}
            >
              npx gitshot your-image.png
            </span>
          </div>

          {/* Alternatives */}
          <div
            style={{
              marginTop: 40,
              opacity: altOpacity,
              textAlign: 'center',
              fontFamily: FONTS.mono,
              fontSize: 24,
              color: C.subtext0,
            }}
          >
            <div>npm i -g gitshot</div>
            <div style={{ marginTop: 8, color: C.overlay0 }}>
              gh extension install vipulgupta2048/gitshot
            </div>
          </div>
        </>
      )}

      {/* End Card */}
      {showEndCard && (
        <div
          style={{
            textAlign: 'center',
            transform: `scale(${endCardEnter})`,
            opacity: endCardEnter,
          }}
        >
          {/* Particle burst behind */}
          <ParticleBurst triggerFrame={120} x={960} y={400} count={40} duration={50} />

          {/* ASCII banner (smaller) */}
          <pre
            style={{
              fontFamily: FONTS.mono,
              fontSize: 16,
              lineHeight: 1.15,
              background: GRADIENT_CSS,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
              filter: `drop-shadow(0 0 20px ${GRADIENT.purple}40)`,
            }}
          >
            {ASCII_BANNER_SMALL}
          </pre>

          {/* Tagline */}
          <div style={{ marginTop: 20 }}>
            <GradientText
              text="Screenshots on GitHub, now without a browser."
              fontSize={32}
              enterAt={125}
              showUnderline
              fontFamily={FONTS.sans}
            />
          </div>

          {/* Star counter */}
          <div
            style={{
              marginTop: 32,
              fontFamily: FONTS.mono,
              fontSize: 22,
              color: C.yellow,
            }}
          >
            ★ {starCount}
          </div>

          {/* URL */}
          <div
            style={{
              marginTop: 16,
              fontFamily: FONTS.mono,
              fontSize: 20,
              color: C.overlay0,
            }}
          >
            github.com/vipulgupta2048/gitshot
          </div>
        </div>
      )}
    </div>
  );
};
