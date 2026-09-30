import { RotateCcw } from 'lucide-react';
import { LAYERS, LAYER_LABELS } from '../lib/constants';

export default function AudioMixer({ mix, onChange, disabled, sceneLabel, sceneMix }) {
  function setLayer(layer, value) {
    onChange({ ...mix, [layer]: value });
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Layer sliders */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-white/30 tracking-widest uppercase">Mix</p>
          {sceneMix && (
            <button
              type="button"
              onClick={() => onChange({ ...sceneMix })}
              disabled={disabled}
              aria-label={`Reset mix to ${sceneLabel}`}
              className="flex items-center gap-1.5 text-[11px] text-white/24 hover:text-white/50 transition-colors disabled:opacity-30"
            >
              <RotateCcw size={11} />
              Reset
            </button>
          )}
        </div>
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
