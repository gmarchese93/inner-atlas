export function lfo(ctx, freq, depth, targetParam, type = 'sine') {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = depth;
  osc.connect(gain);
  gain.connect(targetParam);
  osc.start();
  return osc;
}

export function loopSrc(ctx, buffer) {
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  return source;
}
