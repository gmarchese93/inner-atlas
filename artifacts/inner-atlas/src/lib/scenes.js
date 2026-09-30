export const SCENES = [
  {
    id: 'still_room',
    moodId: 'calm',
    label: 'Still Room',
    description: 'A quiet room with only a trace of weather at its edges.',
    mix: { drone: 0.50, pad: 0.60, rain: 0.15, analog: 0.05, air: 0.14 },
    audio: { rainCurve: 'low_sparse', padVoicing: 'warm_open', eventPattern: 'bowl_start' },
    visual: { palette: ['#322a52', '#1b2635', '#56656f'], motion: 'still' },
    prompt: 'Let the room quiet around one thought.',
  },
  {
    id: 'soft_rain',
    moodId: 'calm',
    label: 'Soft Rain',
    description: 'A sheltered, low-density rain space.',
    mix: { drone: 0.20, pad: 0.48, rain: 0.28, analog: 0.06, air: 0.12 },
    audio: { rainCurve: 'sheltered', padVoicing: 'warm_open', eventPattern: 'crystal_start' },
    visual: { palette: ['#293f59', '#24474d', '#687b89'], motion: 'slow' },
    prompt: 'Notice what softens when nothing asks for an answer.',
  },
  {
    id: 'warm_drift',
    moodId: 'calm',
    label: 'Warm Drift',
    description: 'A warm harmonic bed moving almost imperceptibly.',
    mix: { drone: 0.32, pad: 0.58, rain: 0.10, analog: 0.15, air: 0.15 },
    audio: { rainCurve: 'low_sparse', padVoicing: 'warm_low', eventPattern: 'bowl_start' },
    visual: { palette: ['#513a4a', '#3d3d2d', '#8a7157'], motion: 'slow' },
    prompt: 'Stay with the feeling before giving it a name.',
  },
  {
    id: 'rain_shelter',
    moodId: 'overloaded',
    label: 'Rain Shelter',
    description: 'Steady rain held outside a protected interior.',
    mix: { drone: 0.18, pad: 0.32, rain: 0.52, analog: 0.12, air: 0.08 },
    audio: { rainCurve: 'sheltered', padVoicing: 'grounded_low', eventPattern: 'gong_start' },
    visual: { palette: ['#263d4a', '#304738', '#666052'], motion: 'gentle' },
    prompt: 'Set down one thing that does not need carrying now.',
  },
  {
    id: 'low_fog',
    moodId: 'overloaded',
    label: 'Low Fog',
    description: 'A muted room where sharp edges recede.',
    mix: { drone: 0.34, pad: 0.42, rain: 0.24, analog: 0.10, air: 0.10 },
    audio: { rainCurve: 'distant', padVoicing: 'warm_low', eventPattern: 'bowl_start' },
    visual: { palette: ['#333b45', '#424a42', '#6c7274'], motion: 'slow' },
    prompt: 'What can become less precise for a little while?',
  },
  {
    id: 'static_clearing',
    moodId: 'overloaded',
    label: 'Static Clearing',
    description: 'A spare signal opening through softened noise.',
    mix: { drone: 0.24, pad: 0.36, rain: 0.16, analog: 0.22, air: 0.16 },
    audio: { rainCurve: 'low_sparse', padVoicing: 'clear_open', eventPattern: 'crystal_start' },
    visual: { palette: ['#3b344c', '#263f45', '#6b5a72'], motion: 'gentle' },
    prompt: 'Find the one signal worth keeping.',
  },
  {
    id: 'grounded_body',
    moodId: 'anxious',
    label: 'Grounded Body',
    description: 'A low, steady room with weight beneath it.',
    mix: { drone: 0.44, pad: 0.38, rain: 0.18, analog: 0.08, air: 0.08 },
    audio: { rainCurve: 'low_sparse', padVoicing: 'grounded_low', eventPattern: 'bowl_start' },
    visual: { palette: ['#3d3a2d', '#2f4438', '#69544a'], motion: 'still' },
    prompt: 'Begin with what your body already knows.',
  },
  {
    id: 'distant_weather',
    moodId: 'anxious',
    label: 'Distant Weather',
    description: 'Weather moving far enough away to observe.',
    mix: { drone: 0.28, pad: 0.40, rain: 0.38, analog: 0.06, air: 0.12 },
    audio: { rainCurve: 'distant', padVoicing: 'warm_open', eventPattern: 'gong_start' },
    visual: { palette: ['#253949', '#3b4149', '#4f6670'], motion: 'gentle' },
    prompt: 'Watch the thought pass without following it.',
  },
  {
    id: 'slow_breathing',
    moodId: 'anxious',
    label: 'Slow Breathing',
    description: 'A spacious pulse shaped by gentle air and tone.',
    mix: { drone: 0.30, pad: 0.52, rain: 0.14, analog: 0.06, air: 0.18 },
    audio: { rainCurve: 'low_sparse', padVoicing: 'clear_open', eventPattern: 'chime_start' },
    visual: { palette: ['#35424a', '#3f3547', '#5e6b5e'], motion: 'slow' },
    prompt: 'Give the next breath more room than the last.',
  },
  {
    id: 'night_window',
    moodId: 'sad',
    label: 'Night Window',
    description: 'A dim interior looking toward distant rain.',
    mix: { drone: 0.52, pad: 0.56, rain: 0.18, analog: 0.08, air: 0.08 },
    audio: { rainCurve: 'distant', padVoicing: 'warm_low', eventPattern: 'bowl_start' },
    visual: { palette: ['#252b4a', '#3a2f45', '#4c596d'], motion: 'slow' },
    prompt: 'What remains when you stop asking it to leave?',
  },
  {
    id: 'warm_analog',
    moodId: 'sad',
    label: 'Warm Analog',
    description: 'Soft harmonic wear around a steady low center.',
    mix: { drone: 0.44, pad: 0.50, rain: 0.10, analog: 0.24, air: 0.08 },
    audio: { rainCurve: 'low_sparse', padVoicing: 'warm_low', eventPattern: 'gong_start' },
    visual: { palette: ['#49363c', '#3d4030', '#725c4d'], motion: 'still' },
    prompt: 'Let the memory be present without becoming the whole room.',
  },
  {
    id: 'deep_water',
    moodId: 'sad',
    label: 'Deep Water',
    description: 'A submerged, slow, low-lit room.',
    mix: { drone: 0.34, pad: 0.42, rain: 0.10, analog: 0.18, air: 0.08 },
    audio: { rainCurve: 'low_sparse', padVoicing: 'grounded_low', eventPattern: 'gong_start' },
    visual: { palette: ['#153743', '#252d4a', '#315c61'], motion: 'slow' },
    prompt: 'Let one feeling sink until it becomes shape.',
  },
  {
    id: 'open_air',
    moodId: 'clear',
    label: 'Open Air',
    description: 'A wide, breathable room with a light horizon.',
    mix: { drone: 0.18, pad: 0.36, rain: 0.06, analog: 0.02, air: 0.26 },
    audio: { rainCurve: 'low_sparse', padVoicing: 'clear_open', eventPattern: 'chime_start' },
    visual: { palette: ['#31545a', '#3e4a63', '#6d7973'], motion: 'gentle' },
    prompt: 'What becomes visible when the room opens?',
  },
  {
    id: 'blue_focus',
    moodId: 'clear',
    label: 'Blue Focus',
    description: 'A cool, narrow field for one clean line of thought.',
    mix: { drone: 0.24, pad: 0.44, rain: 0.08, analog: 0.03, air: 0.18 },
    audio: { rainCurve: 'low_sparse', padVoicing: 'clear_open', eventPattern: 'crystal_start' },
    visual: { palette: ['#27435d', '#30365c', '#4a6f7c'], motion: 'slow' },
    prompt: 'Name the clearest thing you know right now.',
  },
  {
    id: 'minimal_signal',
    moodId: 'clear',
    label: 'Minimal Signal',
    description: 'A reduced room with only the essential tone remaining.',
    mix: { drone: 0.30, pad: 0.30, rain: 0.03, analog: 0.02, air: 0.12 },
    audio: { rainCurve: 'low_sparse', padVoicing: 'clear_open', eventPattern: 'none' },
    visual: { palette: ['#343940', '#3f3b48', '#596367'], motion: 'still' },
    prompt: 'Keep only the sentence that matters.',
  },
];

export function getScenesForMood(moodId) {
  return SCENES.filter(scene => scene.moodId === moodId);
}

export function getDefaultScene(moodId) {
  return getScenesForMood(moodId)[0] || SCENES[0];
}

export function getSceneById(sceneId) {
  return SCENES.find(scene => scene.id === sceneId) || null;
}

export function resolveScene(sceneId, moodId) {
  const scene = getSceneById(sceneId);
  return scene?.moodId === moodId ? scene : getDefaultScene(moodId);
}
