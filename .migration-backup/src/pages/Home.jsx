import { useNavigate } from 'react-router-dom';
import { MODES } from '../lib/constants';
import { modeSigils } from '../components/MoodGlyph';
import GradientBackground from '../components/GradientBackground';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative text-white">
      <GradientBackground modeId="deep-focus" />

      {/* Grain layer */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }} />

      <div className="relative z-10 flex flex-col min-h-screen px-5 py-10 max-w-lg mx-auto w-full">

        {/* Header */}
        <div className="mb-12 card-appear" style={{ animationDelay: '0ms' }}>
          <p className="text-[9px] tracking-[0.45em] uppercase text-white/22 mb-3 font-body">
            Inner Atlas
          </p>
          <h1 className="font-display text-[2.8rem] font-light leading-[1.1] text-white/88 mb-2">
            Choose a state.<br />
            <em className="not-italic text-white/55">The space will adapt.</em>
          </h1>
        </div>

        {/* Mode cards */}
        <div className="flex flex-col gap-2.5 flex-1">
          {MODES.map((mode, i) => {
            const Sigil = modeSigils[mode.id];
            return (
              <button
                key={mode.id}
                onClick={() => navigate(`/mood?mode=${mode.id}`)}
                className="glass-card glass-card-hover group relative w-full text-left px-5 py-5 rounded-2xl transition-all duration-500 overflow-hidden card-appear"
                style={{
                  animationDelay: `${100 + i * 80}ms`,
                  boxShadow: `0 0 0 0.5px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.07)`,
                }}
              >
                {/* Hover accent glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl"
                  style={{ background: `radial-gradient(ellipse at 15% 50%, ${mode.accentColor}14 0%, transparent 68%)` }}
                />

                <div className="relative flex items-center gap-4">
                  {/* Sigil */}
                  <div className="shrink-0 transition-all duration-500 group-hover:scale-105">
                    {Sigil && (
                      <Sigil size={36} color={mode.accentColor} opacity={0.55} />
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-lg font-light text-white/82 mb-0.5 leading-tight">
                      {mode.label}
                    </p>
                    <p className="text-[13px] text-white/35 font-body leading-snug">
                      {mode.description}
                    </p>
                  </div>

                  <span className="text-white/18 group-hover:text-white/45 transition-colors duration-400 ml-2 font-light">→</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-10 flex justify-between items-center card-appear" style={{ animationDelay: '400ms' }}>
          <p className="text-[11px] text-white/14 font-body tracking-wide">All data stays on this device.</p>
          <button
            onClick={() => navigate('/history')}
            className="text-[11px] text-white/28 hover:text-white/55 transition-colors duration-300 font-body"
          >
            History →
          </button>
        </div>
      </div>
    </div>
  );
}