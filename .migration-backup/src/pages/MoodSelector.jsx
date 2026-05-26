import { useNavigate } from 'react-router-dom';
import { MOODS, MODES } from '../lib/constants';
import MoodGlyph from '../components/MoodGlyph';
import GradientBackground from '../components/GradientBackground';

export default function MoodSelector() {
  const navigate = useNavigate();
  const params   = new URLSearchParams(window.location.search);
  const modeId   = params.get('mode') || 'deep-focus';
  const mode     = MODES.find(m => m.id === modeId) || MODES[0];

  return (
    <div className="min-h-screen relative text-white">
      <GradientBackground modeId={modeId} />

      <div className="relative z-10 flex flex-col min-h-screen px-5 py-10 max-w-lg mx-auto w-full">

        {/* Back */}
        <button
          onClick={() => navigate('/')}
          className="text-[11px] text-white/22 hover:text-white/52 transition-colors duration-300 mb-10 self-start font-body tracking-wide card-appear"
        >
          ← back
        </button>

        {/* Header */}
        <div className="mb-10 card-appear" style={{ animationDelay: '60ms' }}>
          <p
            className="text-[9px] tracking-[0.45em] uppercase mb-3 font-body"
            style={{ color: mode.accentColor + 'bb' }}
          >
            {mode.label}
          </p>
          <h2 className="font-display text-[2.4rem] font-light text-white/85 leading-[1.1] mb-2">
            How are you arriving?
          </h2>
          <p className="text-sm text-white/32 font-body">
            The room will shape itself to your state.
          </p>
        </div>

        {/* Mood grid */}
        <div className="grid grid-cols-2 gap-2.5 flex-1">
          {MOODS.map((mood, i) => (
            <button
              key={mood.id}
              onClick={() => navigate(`/session?mode=${modeId}&mood=${mood.id}`)}
              className="glass-card glass-card-hover group relative flex flex-col items-center justify-center gap-5 py-10 rounded-2xl transition-all duration-500 overflow-hidden card-appear"
              style={{
                animationDelay: `${120 + i * 70}ms`,
              }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-600 pointer-events-none rounded-2xl"
                style={{ background: `radial-gradient(ellipse at 50% 65%, ${mode.accentColor}13 0%, transparent 70%)` }}
              />

              {/* Sigil */}
              <div className="relative transition-transform duration-500 group-hover:scale-105">
                <MoodGlyph
                  moodId={mood.id}
                  size={38}
                  color={mode.accentColor}
                  opacity={0.52}
                  animated={false}
                />
              </div>

              <span className="relative font-display text-base font-light text-white/48 group-hover:text-white/78 transition-colors duration-300 tracking-wide">
                {mood.label}
              </span>
            </button>
          ))}

          {/* Spacer for odd count */}
          {MOODS.length % 2 !== 0 && <div />}
        </div>

        <p className="mt-8 text-[11px] text-white/12 text-center tracking-wide font-body card-appear" style={{ animationDelay: '500ms' }}>
          You can adjust the mix any time during your session.
        </p>
      </div>
    </div>
  );
}