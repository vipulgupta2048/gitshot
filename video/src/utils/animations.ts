import { SpringConfig } from 'remotion';

// Spring presets
export const SMOOTH: SpringConfig = { damping: 200, stiffness: 100, mass: 1 };
export const BOUNCY: SpringConfig = { damping: 12, stiffness: 200, mass: 0.5 };
export const SNAPPY: SpringConfig = { damping: 30, stiffness: 300, mass: 0.8 };
export const GENTLE: SpringConfig = { damping: 100, stiffness: 50, mass: 1.2 };

// Camera drift — subtle breathing motion
export function cameraDrift(frame: number): { x: number; y: number } {
  return {
    x: Math.sin(frame * 0.02) * 2.5,
    y: Math.cos(frame * 0.015) * 1.5,
  };
}
