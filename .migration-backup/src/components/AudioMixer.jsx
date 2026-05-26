import { LAYERS, LAYER_LABELS, MOOD_PRESETS, MOODS } from '../lib/constants';

export default function AudioMixer({ mix, onChange, disabled }) {
  function applyPreset(moodId) {
    onChange({ ...MOOD_PRESETS[moodId] });
  }

  function setLayer(layer, value) {
    onChange({ ...mix, [layer]: value });
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Mood presets */}
      <div>
        <p className="text-xs text-white/30 tracking-widest uppercase mb-2">Mood Presets</p>
        <div className="flex flex-wrap gap-2">
          {MOODS.map(m => (
            <button
              key={m.id}
              onClick={() => applyPreset(m.id)}
              disabled={disabled}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/15 bg-white/5 text-white/60 text-xs hover:bg-white/15 hover:text-white/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span>{m.emoji}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Layer sliders */}
      <div className="flex flex-col gap-3">
        <p className="text-xs text-white/30 tracking-widest uppercase">Mix</p>
        {LAYERS.map(layer => (
          <div key={layer} className="flex items-center gap-3">
            <span className="w-16 text-xs text-white/50 shrink-0">{LAYER_LABELS[layer]}</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={mix[layer] ?? 0}
              onChange={e => setLayer(layer, parseFloat(e.target.value))}
              disabled={disabled}
              className="flex-1 h-1 appearance-none bg-white/15 rounded-full outline-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed accent-white"
            />
            <span className="w-8 text-right text-xs text-white/30 tabular-nums">
              {Math.round((mix[layer] ?? 0) * 100)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}