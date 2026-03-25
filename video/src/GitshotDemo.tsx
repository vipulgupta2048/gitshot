import React from 'react';
import { useCurrentFrame, Sequence, Audio, interpolate, AbsoluteFill } from 'remotion';
import { staticFile } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { wipe } from '@remotion/transitions/wipe';
import { slide } from '@remotion/transitions/slide';
import { C } from './styles/theme';
import { cameraDrift } from './utils/animations';
import { FilmGrain } from './components/FilmGrain';
import { Vignette } from './components/Vignette';
import { ScreenFlash } from './components/ScreenFlash';
import { ThePain } from './scenes/ThePain';
import { TheFix } from './scenes/TheFix';
import { Features } from './scenes/Features';
import { Install } from './scenes/Install';

export const GitshotDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = cameraDrift(frame);

  // Background music volume envelope
  const bgVolume = interpolate(
    frame,
    [0, 60, 200, 240, 840, 900],
    [0, 0.10, 0.10, 0.18, 0.10, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: C.base,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ═══ AUDIO LAYER ═══ */}
      {/* All SFX are trimmed to <1.5s — no looping, no tails */}

      {/* Background ambient pad */}
      <Audio src={staticFile('audio/bg-track.mp3')} volume={bgVolume} />

      {/* Act 1: "It's 2026" typing + pills + X stamp */}
      <Sequence from={12}><Audio src={staticFile('audio/key-click.mp3')} volume={0.25} /></Sequence>
      <Sequence from={130}><Audio src={staticFile('audio/typing-burst.mp3')} volume={0.15} /></Sequence>
      <Sequence from={190}><Audio src={staticFile('audio/stamp-impact.mp3')} volume={0.5} /></Sequence>

      {/* Act 2: Brand reveal + terminal demo */}
      <Sequence from={218}><Audio src={staticFile('audio/whoosh.mp3')} volume={0.25} /></Sequence>
      <Sequence from={222}><Audio src={staticFile('audio/magic-chime.mp3')} volume={0.2} /></Sequence>
      <Sequence from={300}><Audio src={staticFile('audio/ui-pop.mp3')} volume={0.2} /></Sequence>
      <Sequence from={370}><Audio src={staticFile('audio/success-ding.mp3')} volume={0.3} /></Sequence>
      <Sequence from={450}><Audio src={staticFile('audio/shimmer.mp3')} volume={0.2} /></Sequence>

      {/* Act 3: Feature card pops (staggered) */}
      <Sequence from={490}><Audio src={staticFile('audio/ui-pop.mp3')} volume={0.15} /></Sequence>
      <Sequence from={495}><Audio src={staticFile('audio/ui-pop.mp3')} volume={0.15} /></Sequence>
      <Sequence from={500}><Audio src={staticFile('audio/ui-pop.mp3')} volume={0.15} /></Sequence>
      <Sequence from={505}><Audio src={staticFile('audio/ui-pop.mp3')} volume={0.15} /></Sequence>
      <Sequence from={510}><Audio src={staticFile('audio/ui-pop.mp3')} volume={0.15} /></Sequence>
      <Sequence from={515}><Audio src={staticFile('audio/ui-pop.mp3')} volume={0.15} /></Sequence>
      {/* Command cycling soft whooshes */}
      <Sequence from={610}><Audio src={staticFile('audio/whoosh-soft.mp3')} volume={0.12} /></Sequence>
      <Sequence from={650}><Audio src={staticFile('audio/whoosh-soft.mp3')} volume={0.12} /></Sequence>
      <Sequence from={690}><Audio src={staticFile('audio/whoosh-soft.mp3')} volume={0.12} /></Sequence>

      {/* Act 4: Install + end card */}
      <Sequence from={725}><Audio src={staticFile('audio/bass-hit.mp3')} volume={0.3} /></Sequence>
      <Sequence from={730}><Audio src={staticFile('audio/shimmer.mp3')} volume={0.15} /></Sequence>
      <Sequence from={845}><Audio src={staticFile('audio/sparkle.mp3')} volume={0.25} /></Sequence>
      <Sequence from={847}><Audio src={staticFile('audio/ui-pop.mp3')} volume={0.2} /></Sequence>

      {/* ═══ VISUAL LAYER ═══ */}

      <div
        style={{
          width: '100%',
          height: '100%',
          transform: `translate(${drift.x}px, ${drift.y}px)`,
          position: 'absolute',
          inset: 0,
        }}
      >
        <TransitionSeries>
          {/* Act 1: THE PAIN — extended to 228 frames for text readability */}
          <TransitionSeries.Sequence durationInFrames={228}>
            <AbsoluteFill><ThePain /></AbsoluteFill>
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={fade()}
            timing={linearTiming({ durationInFrames: 16 })}
          />

          {/* Act 2: THE FIX */}
          <TransitionSeries.Sequence durationInFrames={278}>
            <AbsoluteFill><TheFix /></AbsoluteFill>
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={wipe({ direction: 'from-left' })}
            timing={linearTiming({ durationInFrames: 14 })}
          />

          {/* Act 3: FEATURES */}
          <TransitionSeries.Sequence durationInFrames={244}>
            <AbsoluteFill><Features /></AbsoluteFill>
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={slide({ direction: 'from-bottom' })}
            timing={linearTiming({ durationInFrames: 14 })}
          />

          {/* Act 4: INSTALL — 208 frames to fill remaining */}
          <TransitionSeries.Sequence durationInFrames={208}>
            <AbsoluteFill><Install /></AbsoluteFill>
          </TransitionSeries.Sequence>
        </TransitionSeries>
        {/* Total: 228+278+244+208 - 16-14-14 = 958-44 = 914... but TransitionSeries
            handles overlap correctly. The last sequence extends to fill. */}
      </div>

      {/* Global overlays */}
      <FilmGrain />
      <Vignette />

      {/* Screen flashes on impacts */}
      <ScreenFlash triggerFrame={190} duration={3} opacity={0.12} />
      <ScreenFlash triggerFrame={218} duration={4} opacity={0.06} />
      <ScreenFlash triggerFrame={490} duration={3} opacity={0.04} />
      <ScreenFlash triggerFrame={725} duration={4} opacity={0.06} />
    </div>
  );
};
