export const MODES = [
  {
    id: 'deep-focus',
    label: 'Deep Focus',
    glyph: '◉',
    description: 'Eliminate distraction. Enter the zone.',
    gradientColors: ['#0f0c29', '#302b63', '#24243e'],
    accentColor: '#7c6fcd',
  },
  {
    id: 'night-reflection',
    label: 'Night Reflection',
    glyph: '☽',
    description: 'Slow down. Let thoughts settle.',
    gradientColors: ['#1a1a2e', '#16213e', '#0f3460'],
    accentColor: '#4a90d9',
  },
  {
    id: 'cognitive-unload',
    label: 'Cognitive Unload',
    glyph: '∿',
    description: 'Empty the mind. Release the noise.',
    gradientColors: ['#0d1b2a', '#1b4332', '#081c15'],
    accentColor: '#2d9b6f',
  },
];

export const MOODS = [
  { id: 'calm',       label: 'Quiet'     },
  { id: 'overloaded', label: 'Saturated' },
  { id: 'anxious',    label: 'Restless'  },
  { id: 'sad',        label: 'Heavy'     },
  { id: 'clear',      label: 'Lucid'     },
];

// Intention audio nudges — additive deltas applied on top of the base mix
export const INTENTION_NUDGES = {
  focus:            { rain: -0.08, air: -0.06, pad: +0.05 },
  decompress:       { rain: +0.07, analog: +0.06 },
  reflect:          { pad: +0.06, air: +0.07 },
  sleep_transition: { air: -0.05, drone: +0.04, pad: +0.04 },
  empty_thoughts:   { rain: +0.05, analog: +0.04, pad: -0.04 },
};

export const INTENTION_MICROCOPY = {
  focus:            'The room narrows. Distractions dissolve.',
  decompress:       'Let the weight release, layer by layer.',
  reflect:          'Space opens. Thoughts settle gently.',
  sleep_transition: 'The room softens and grows still.',
  empty_thoughts:   'Nothing to hold. Let it pass through.',
};

export const LAYERS = ['drone', 'pad', 'rain', 'analog', 'air'];

export const LAYER_LABELS = {
  drone:  'Drone',
  pad:    'Pad',
  rain:   'Rain',
  analog: 'Analog',
  air:    'Air',
};

// Presets: one tonal (Drone or Pad), one environmental (Rain or Air), one color layer low
export const MOOD_PRESETS = {
  calm:       { drone: 0.50, pad: 0.60, rain: 0.15, analog: 0.05, air: 0.14 },
  overloaded: { drone: 0.18, pad: 0.32, rain: 0.52, analog: 0.12, air: 0.08 },
  anxious:    { drone: 0.28, pad: 0.45, rain: 0.28, analog: 0.06, air: 0.10 },
  sad:        { drone: 0.58, pad: 0.62, rain: 0.22, analog: 0.08, air: 0.07 },
  clear:      { drone: 0.22, pad: 0.42, rain: 0.10, analog: 0.03, air: 0.18 },
};

export const DEFAULT_MIX = { drone: 0.42, pad: 0.52, rain: 0.15, analog: 0.05, air: 0.12 };
