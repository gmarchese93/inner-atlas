const CURRENT_LAYERS = ['drone', 'pad', 'rain', 'analog', 'air'];

function clampMixValue(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.min(1, parsed));
}

export function normalizeMix(raw, preset) {
  const out = { ...preset };
  if (!raw) return out;

  for (const layer of CURRENT_LAYERS) {
    if (raw[layer] != null) out[layer] = clampMixValue(raw[layer]);
  }

  if (raw.tape != null) out.analog = clampMixValue(raw.tape);

  return out;
}
