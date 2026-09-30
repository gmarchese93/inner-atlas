import { MODES } from '../lib/constants';

// Per-mode blob palette — [primary, secondary, accent]
const MODE_PALETTES = {
  'deep-focus':       ['#3d2f8a', '#1a1060', '#6b56c4'],
  'night-reflection': ['#0f2e5c', '#0c1f3a', '#1d4f8a'],
  'cognitive-unload': ['#0a2e1e', '#0d3324', '#1a5c40'],
};

const MOTION_SCALE = { still: 0, slow: 1.35, gentle: 1 };

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`;

export default function GradientBackground({ modeId, visual }) {
  const fallback = MODE_PALETTES[modeId] || MODE_PALETTES['deep-focus'];
  const palette = visual?.palette?.length === 3 ? visual.palette : fallback;
  const [p1, p2, p3] = palette;
  const motionScale = MOTION_SCALE[visual?.motion] ?? 1;
  const motion = seconds => motionScale === 0
    ? { animationPlayState: 'paused' }
    : { animationDuration: `${seconds * motionScale}s` };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Base dark ground */}
      <div className="absolute inset-0" style={{ background: '#060608' }} />

      {/* Blob 1 — large, primary, top-left drift */}
      <div
        className="gradient-blob-1 absolute"
        style={{
          width: '75vw', height: '70vh',
          top: '-15vh', left: '-10vw',
          background: `radial-gradient(ellipse at center, ${p1}55 0%, ${p1}18 40%, transparent 72%)`,
          filter: 'blur(55px)',
          ...motion(22),
        }}
      />

      {/* Blob 2 — medium, secondary, bottom-right drift */}
      <div
        className="gradient-blob-2 absolute"
        style={{
          width: '65vw', height: '65vh',
          bottom: '-20vh', right: '-15vw',
          background: `radial-gradient(ellipse at center, ${p2}60 0%, ${p2}20 45%, transparent 70%)`,
          filter: 'blur(60px)',
          ...motion(28),
        }}
      />

      {/* Blob 3 — center breathing pulse */}
      <div
        className="gradient-blob-3 absolute"
        style={{
          width: '55vw', height: '55vh',
          top: '50%', left: '50%',
          background: `radial-gradient(ellipse at center, ${p3}22 0%, ${p3}08 50%, transparent 72%)`,
          filter: 'blur(72px)',
          ...motion(18),
        }}
      />

      {/* Blob 4 — small accent, slow horizontal drift */}
      <div
        className="gradient-blob-1 absolute"
        style={{
          width: '40vw', height: '40vh',
          top: '30%', right: '5vw',
          background: `radial-gradient(ellipse at center, ${p1}30 0%, transparent 65%)`,
          filter: 'blur(45px)',
          animationDelay: '-8s',
          ...motion(32),
        }}
      />

      {/* Blob 5 — subtle low warmth */}
      <div
        className="gradient-blob-2 absolute"
        style={{
          width: '50vw', height: '30vh',
          bottom: '10%', left: '20%',
          background: `radial-gradient(ellipse at center, ${p3}16 0%, transparent 68%)`,
          filter: 'blur(50px)',
          animationDelay: '-14s',
          ...motion(36),
        }}
      />

      {/* Grain overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: GRAIN_SVG,
          backgroundSize: '256px 256px',
          opacity: 0.028,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Vignette for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.55) 100%)',
        }}
      />
    </div>
  );
}
