export function mkPink(ctx, secs = 5) {
  const n = ctx.sampleRate * secs;
  const buffer = ctx.createBuffer(2, n, ctx.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < n; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) / 7.5;
      b6 = white * 0.115926;
    }
  }
  return buffer;
}

export function mkBrown(ctx, secs = 6) {
  const n = ctx.sampleRate * secs;
  const buffer = ctx.createBuffer(2, n, ctx.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    let last = 0;
    for (let i = 0; i < n; i++) {
      last = (last + 0.016 * (Math.random() * 2 - 1)) / 1.016;
      data[i] = last * 3.0;
    }
  }
  return buffer;
}

export function mkDarkNoise(ctx, secs = 8) {
  const n = ctx.sampleRate * secs;
  const buffer = ctx.createBuffer(2, n, ctx.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    let last = 0, b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < n; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      const pink = (b0 + b1 + b2 + white * 0.5) / 4;
      last = (last + 0.02 * pink) / 1.02;
      data[i] = last * 5.0;
    }
  }
  return buffer;
}

export function mkBurst(ctx, ms = 55) {
  const n = Math.floor(ctx.sampleRate * ms / 1000);
  const buffer = ctx.createBuffer(1, n, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0;
  for (let i = 0; i < n; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    data[i] = (b0 + b1 + b2 + b3 + white * 0.5362) / 7.5;
  }
  return buffer;
}
