import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONTS } from '../styles/theme';

interface TypingTextProps {
  text: string;
  startFrame: number;
  msPerChar?: number;
  color?: string;
  fontSize?: number;
  showCursor?: boolean;
  cursorColor?: string;
}

export const TypingText: React.FC<TypingTextProps> = ({
  text,
  startFrame,
  msPerChar = 60,
  color = C.text,
  fontSize = 22,
  showCursor = true,
  cursorColor = C.green,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const framesPerChar = Math.max(1, Math.round((msPerChar / 1000) * fps));
  const elapsed = frame - startFrame;

  if (elapsed < 0) return null;

  const charsVisible = Math.min(text.length, Math.floor(elapsed / framesPerChar));
  const visibleText = text.slice(0, charsVisible);
  const isDone = charsVisible >= text.length;
  const cursorVisible = showCursor && (!isDone || frame % 30 < 15);

  return (
    <span
      style={{
        fontFamily: FONTS.mono,
        fontSize,
        color,
        whiteSpace: 'pre',
      }}
    >
      {visibleText}
      {cursorVisible && (
        <span
          style={{
            display: 'inline-block',
            width: fontSize * 0.55,
            height: fontSize * 1.1,
            background: cursorColor,
            marginLeft: 1,
            verticalAlign: 'text-bottom',
            opacity: isDone ? (frame % 30 < 15 ? 1 : 0) : 1,
          }}
        />
      )}
    </span>
  );
};
