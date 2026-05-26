// Inner Atlas — Mood Sigils
// Alchemical/lunar/astronomical style. Thin monoline strokes, SVG filter glow.

function GlowFilter({ id, color }) {
  return (
    <defs>
      <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2.5" result="blur" />
        <feFlood floodColor={color} floodOpacity="0.6" result="color" />
        <feComposite in="color" in2="blur" operator="in" result="glow" />
        <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
  );
}

const sigils = {
  // Quiet — lunar crescent with wave beneath
  calm: ({ size, color, opacity }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <GlowFilter id="glow-calm" color={color} />
      <g filter="url(#glow-calm)" strokeOpacity={opacity}>
        {/* Crescent */}
        <path d="M30 10 A14 14 0 1 0 30 38 A10 10 0 1 1 30 10Z"
          stroke={color} strokeWidth="1.4" fill="none" strokeLinecap="round" />
        {/* Water wave beneath */}
        <path d="M8 40 Q12 36 16 40 Q20 44 24 40 Q28 36 32 40"
          stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  ),

  // Saturated — fractured lightning inside broken circle
  overloaded: ({ size, color, opacity }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <GlowFilter id="glow-overloaded" color={color} />
      <g filter="url(#glow-overloaded)" strokeOpacity={opacity}>
        {/* Broken circle — gaps at fracture points */}
        <path d="M24 6 A18 18 0 0 1 40 18" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
        <path d="M42 24 A18 18 0 0 1 32 40" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
        <path d="M18 42 A18 18 0 0 1 6 24" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
        <path d="M8 16 A18 18 0 0 1 20 6" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
        {/* Fractured lightning inside */}
        <path d="M22 14 L17 25 L22 25 L16 36"
          stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Fracture shards */}
        <path d="M27 18 L30 13" stroke={color} strokeWidth="1.0" strokeLinecap="round" opacity="0.6" />
        <path d="M29 30 L33 34" stroke={color} strokeWidth="1.0" strokeLinecap="round" opacity="0.5" />
      </g>
    </svg>
  ),

  // Restless — spiral orbit / unstable loop
  anxious: ({ size, color, opacity }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <GlowFilter id="glow-anxious" color={color} />
      <g filter="url(#glow-anxious)" strokeOpacity={opacity}>
        {/* Outer incomplete orbit */}
        <path d="M24 5 A19 19 0 1 0 43 24"
          stroke={color} strokeWidth="1.2" strokeLinecap="round" fill="none" />
        {/* Inner spiral */}
        <path d="M24 10 A14 14 0 0 0 38 24 A10 10 0 0 1 24 34 A7 7 0 0 0 31 24 A4 4 0 0 1 24 28"
          stroke={color} strokeWidth="1.3" strokeLinecap="round" fill="none" />
        {/* Orbit node */}
        <circle cx="43" cy="24" r="1.8" fill={color} opacity={opacity} />
      </g>
    </svg>
  ),

  // Heavy — three descending plumb-drops with vertical axis
  sad: ({ size, color, opacity }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <GlowFilter id="glow-sad" color={color} />
      <g filter="url(#glow-sad)" strokeOpacity={opacity}>
        {/* Vertical axis */}
        <line x1="24" y1="4" x2="24" y2="44" stroke={color} strokeWidth="0.8" opacity={opacity * 0.3} />
        {/* Drop 1 — top */}
        <path d="M24 8 Q24 13 22 16 Q20 19 22 21 Q24 23 26 21 Q28 19 26 16 Q24 13 24 8Z"
          stroke={color} strokeWidth="1.3" fill="none" strokeLinejoin="round" />
        {/* Drop 2 — middle */}
        <path d="M24 22 Q24 26 22.5 28 Q21 30 22.5 31.5 Q24 33 25.5 31.5 Q27 30 25.5 28 Q24 26 24 22Z"
          stroke={color} strokeWidth="1.2" fill="none" strokeLinejoin="round" opacity={opacity * 0.72} />
        {/* Drop 3 — bottom, small */}
        <path d="M24 34 Q24 37 23 38.5 Q22 40 23 41 Q24 42 25 41 Q26 40 25 38.5 Q24 37 24 34Z"
          stroke={color} strokeWidth="1.1" fill="none" strokeLinejoin="round" opacity={opacity * 0.42} />
      </g>
    </svg>
  ),

  // Lucid — four-pointed star within a circle, precise
  clear: ({ size, color, opacity }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <GlowFilter id="glow-clear" color={color} />
      <g filter="url(#glow-clear)" strokeOpacity={opacity}>
        {/* Outer circle */}
        <circle cx="24" cy="24" r="18" stroke={color} strokeWidth="1.1" fill="none" />
        {/* Inner circle */}
        <circle cx="24" cy="24" r="3.5" stroke={color} strokeWidth="1.0" fill="none" />
        {/* Star arms */}
        <path d="M24 6 L25.4 22.6 M24 42 L22.6 25.4"
          stroke={color} strokeWidth="1.3" strokeLinecap="round" />
        <path d="M6 24 L22.6 25.4 M42 24 L25.4 22.6"
          stroke={color} strokeWidth="1.3" strokeLinecap="round" />
        {/* Diagonal accents */}
        <path d="M11.5 11.5 L21.5 21.5 M36.5 36.5 L26.5 26.5"
          stroke={color} strokeWidth="0.7" strokeLinecap="round" opacity={opacity * 0.5} />
        <path d="M36.5 11.5 L26.5 21.5 M11.5 36.5 L21.5 26.5"
          stroke={color} strokeWidth="0.7" strokeLinecap="round" opacity={opacity * 0.5} />
      </g>
    </svg>
  ),
};

// Mode sigils
export const modeSigils = {
  'deep-focus': ({ size, color, opacity }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <GlowFilter id="glow-df" color={color} />
      <g filter="url(#glow-df)" strokeOpacity={opacity}>
        <circle cx="24" cy="24" r="18" stroke={color} strokeWidth="1.1" fill="none" />
        <circle cx="24" cy="24" r="10" stroke={color} strokeWidth="1.0" fill="none" />
        <circle cx="24" cy="24" r="3"  stroke={color} strokeWidth="1.2" fill="none" />
        <circle cx="24" cy="24" r="1.5" fill={color} opacity={opacity} />
        <line x1="24" y1="6"  x2="24" y2="14" stroke={color} strokeWidth="0.8" opacity={opacity*0.5} />
        <line x1="24" y1="34" x2="24" y2="42" stroke={color} strokeWidth="0.8" opacity={opacity*0.5} />
        <line x1="6"  y1="24" x2="14" y2="24" stroke={color} strokeWidth="0.8" opacity={opacity*0.5} />
        <line x1="34" y1="24" x2="42" y2="24" stroke={color} strokeWidth="0.8" opacity={opacity*0.5} />
      </g>
    </svg>
  ),
  'night-reflection': ({ size, color, opacity }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <GlowFilter id="glow-nr" color={color} />
      <g filter="url(#glow-nr)" strokeOpacity={opacity}>
        <path d="M32 10 A14 14 0 1 0 32 38 A10 10 0 1 1 32 10Z"
          stroke={color} strokeWidth="1.3" fill="none" strokeLinecap="round" />
        <line x1="8" y1="24" x2="40" y2="24" stroke={color} strokeWidth="0.9" opacity={opacity*0.45} />
      </g>
    </svg>
  ),
  'cognitive-unload': ({ size, color, opacity }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <GlowFilter id="glow-cu" color={color} />
      <g filter="url(#glow-cu)" strokeOpacity={opacity}>
        <path d="M6 18 Q12 10 18 18 Q24 26 30 18 Q36 10 42 18"
          stroke={color} strokeWidth="1.4" strokeLinecap="round" fill="none" />
        <path d="M10 28 Q15 22 20 28 Q25 34 30 28 Q35 22 40 28"
          stroke={color} strokeWidth="1.1" strokeLinecap="round" fill="none" opacity={opacity*0.55} />
        <path d="M16 36 Q20 32 24 36 Q28 40 32 36"
          stroke={color} strokeWidth="0.9" strokeLinecap="round" fill="none" opacity={opacity*0.30} />
      </g>
    </svg>
  ),
};

export default function MoodGlyph({ moodId, size = 40, color = 'currentColor', opacity = 0.65, className = '', animated = false }) {
  const Sigil = sigils[moodId];
  if (!Sigil) return null;
  return (
    <span className={`inline-flex ${animated ? 'glyph-breathe' : ''} ${className}`}>
      <Sigil size={size} color={color} opacity={opacity} />
    </span>
  );
}