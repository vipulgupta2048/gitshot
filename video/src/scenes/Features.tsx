import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { C, FONTS, GRADIENT } from '../styles/theme';
import { FeatureCard } from '../components/FeatureCard';
import { Terminal } from '../components/Terminal';
import { SMOOTH } from '../utils/animations';

const FEATURES = [
  { title: 'Zero deps', subtitle: 'Just Node.js built-ins.\nNo axios, no node-fetch.', from: 'left' as const },
  { title: '4 backends', subtitle: 'GitHub Releases · Catbox\nCloudinary · imgbb', from: 'top' as const },
  { title: 'Agent-ready', subtitle: 'Claude · Cursor · Copilot\n--json mode, clean stdout', from: 'right' as const },
  { title: 'SSH + CI', subtitle: 'No browser, no display.\nWorks everywhere.', from: 'left' as const },
  { title: '10 formats', subtitle: 'PNG JPG GIF SVG WebP\nBMP ICO TIFF AVIF', from: 'bottom' as const },
  { title: 'Composable', subtitle: 'Pipe to any gh command.\ngitshot | gh pr comment', from: 'right' as const },
];

const COMMANDS = [
  { text: '$ gitshot bug.png | gh issue create --title "Bug" --body-file -', highlight: '|', color: GRADIENT.magenta },
  { text: '$ gitshot --json shot.png  →  {"url":"...","markdown":"..."}', highlight: '--json', color: GRADIENT.cyan },
  { text: '$ gitshot before.png after.png    # two images, one command', highlight: 'before.png after.png', color: GRADIENT.teal },
];

export const Features: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Bento grid visible for first 120 frames, then commands
  const showGrid = frame < 120;
  const commandIndex = showGrid
    ? -1
    : Math.min(2, Math.floor((frame - 120) / 40));

  // Grid fade out
  const gridOpacity = showGrid
    ? 1
    : interpolate(frame, [115, 128], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });

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
        padding: '0 80px',
      }}
    >
      {/* Bento grid — larger maxWidth, more gap */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 24,
          width: '100%',
          maxWidth: 1200,
          opacity: gridOpacity,
        }}
      >
        {FEATURES.map((feat, i) => (
          <FeatureCard
            key={feat.title}
            title={feat.title}
            subtitle={feat.subtitle}
            enterAt={i * 5}
            fromDirection={feat.from}
          />
        ))}
      </div>

      {/* Command cycling */}
      {!showGrid && (
        <div style={{ width: '100%', padding: '0 20px' }}>
          <Terminal enterAt={120} title="gitshot" width="100%">
            {COMMANDS.map((cmd, i) => {
              if (i !== commandIndex) return null;

              const cmdFrame = 120 + i * 40;
              const slideIn = spring({
                frame: frame - cmdFrame,
                fps,
                config: SMOOTH,
                durationInFrames: 15,
              });

              // Highlight the key part
              const parts = cmd.text.split(cmd.highlight);

              return (
                <div
                  key={i}
                  style={{
                    opacity: slideIn,
                    transform: `translateX(${(1 - slideIn) * 50}px)`,
                    fontSize: 26,
                    lineHeight: 2,
                  }}
                >
                  {parts[0]}
                  <span
                    style={{
                      color: cmd.color,
                      textShadow: `0 0 12px ${cmd.color}50`,
                      fontWeight: 700,
                    }}
                  >
                    {cmd.highlight}
                  </span>
                  {parts[1]}
                </div>
              );
            })}
          </Terminal>
        </div>
      )}
    </div>
  );
};
