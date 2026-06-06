export function buildDarkReverb(engine) {
  const ctx = engine.ctx;

  engine.reverbIn = ctx.createGain();
  engine.reverbIn.gain.value = 1.0;

  const combTimes = [0.0297, 0.0371, 0.0437, 0.0513];
  const combFB = [0.78, 0.76, 0.74, 0.72];
  const combMix = ctx.createGain();
  combMix.gain.value = 0.22;

  combTimes.forEach((time, index) => {
    const delay = ctx.createDelay(0.5);
    delay.delayTime.value = time;
    const fbGain = ctx.createGain();
    fbGain.gain.value = combFB[index];
    const fbLp = ctx.createBiquadFilter();
    fbLp.type = 'lowpass';
    fbLp.frequency.value = 1600;

    engine.reverbIn.connect(delay);
    delay.connect(fbLp);
    fbLp.connect(fbGain);
    fbGain.connect(delay);
    delay.connect(combMix);
  });

  const ap1 = ctx.createBiquadFilter();
  ap1.type = 'allpass';
  ap1.frequency.value = 740;
  const ap2 = ctx.createBiquadFilter();
  ap2.type = 'allpass';
  ap2.frequency.value = 420;
  combMix.connect(ap1);
  ap1.connect(ap2);

  const returnLp = ctx.createBiquadFilter();
  returnLp.type = 'lowpass';
  returnLp.frequency.value = 1000;
  ap2.connect(returnLp);

  const reverbReturn = ctx.createGain();
  reverbReturn.gain.value = 0.55;
  returnLp.connect(reverbReturn);
  reverbReturn.connect(engine.masterGain);
}
