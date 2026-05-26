import { Play, Pause, RotateCcw } from 'lucide-react';

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function Timer({ seconds, running, onStart, onPause, onReset }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="text-6xl md:text-7xl font-mono font-thin tracking-widest text-white/90 tabular-nums select-none"
        style={{ textShadow: '0 0 40px rgba(255,255,255,0.15)' }}
      >
        {formatTime(seconds)}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onReset}
          className="p-2 rounded-full text-white/40 hover:text-white/70 hover:bg-white/10 transition-all"
          title="Reset"
        >
          <RotateCcw size={18} />
        </button>

        <button
          onClick={running ? onPause : onStart}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/20 bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-all text-sm tracking-widest uppercase"
        >
          {running ? <Pause size={16} /> : <Play size={16} />}
          {running ? 'Pause' : 'Start'}
        </button>
      </div>
    </div>
  );
}