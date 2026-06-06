export const STATE = {
  IDLE: 'idle',
  STARTING: 'starting',
  PLAYING: 'playing',
  PAUSING: 'pausing',
  PAUSED: 'paused',
  RESUMING: 'resuming',
  DISPOSING: 'disposing',
};

export const AUDIBLE_STATES = new Set([STATE.STARTING, STATE.PLAYING, STATE.RESUMING]);
