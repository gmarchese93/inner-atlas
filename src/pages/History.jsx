import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ChevronDown, ChevronUp, Download, X } from 'lucide-react';
import { loadSessions, deleteSession, clearAllSessions, exportSessions } from '../lib/sessionStorage';
import { MODES, MOODS } from '../lib/constants';

function formatDuration(secs) {
  if (secs < 60) return `${secs}s`;
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) +
    ' · ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

const INTENTION_LABELS = {
  focus:            'Focus',
  decompress:       'Decompress',
  reflect:          'Reflect',
  sleep_transition: 'Sleep transition',
  empty_thoughts:   'Empty thoughts',
};

function SessionCard({ session, onDelete }) {
  const [open, setOpen] = useState(false);
  const mode = MODES.find(m => m.id === session.mode);
  const mood = MOODS.find(m => m.id === session.mood);

  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] overflow-hidden">
      <div className="px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap gap-2 items-center">
            {mode && (
              <span
                className="text-xs px-2.5 py-1 rounded-full border"
                style={{ borderColor: `${mode.accentColor}55`, color: mode.accentColor, background: `${mode.accentColor}15` }}
              >
                {mode.glyph} {mode.label}
              </span>
            )}
            {mood && (
              <span className="text-xs px-2.5 py-1 rounded-full border border-white/10 text-white/50 bg-white/5">
                {mood.emoji} {mood.label}
              </span>
            )}
            <span className="text-xs text-white/30">{formatDuration(session.durationSeconds)}</span>
            {session.intention && INTENTION_LABELS[session.intention] && (
              <span className="text-xs px-2 py-0.5 rounded-full border border-white/8 text-white/35 bg-white/[0.03]">
                {INTENTION_LABELS[session.intention]}
              </span>
            )}
          </div>

          <button
            onClick={() => onDelete(session.id)}
            className="text-white/20 hover:text-red-400/70 transition-colors shrink-0 mt-0.5"
          >
            <Trash2 size={14} />
          </button>
        </div>

        <p className="text-xs text-white/25 mt-2">{formatDate(session.createdAt)}</p>

        {session.journalText && (
          <button
            onClick={() => setOpen(o => !o)}
            className="flex items-center gap-1 mt-3 text-xs text-white/30 hover:text-white/55 transition-colors"
          >
            {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {open ? 'Hide journal' : 'Show journal'}
          </button>
        )}
      </div>

      {open && session.journalText && (
        <div className="px-5 pb-4 border-t border-white/5">
          <p className="text-sm text-white/55 leading-relaxed pt-4 whitespace-pre-wrap">
            {session.journalText}
          </p>
        </div>
      )}
    </div>
  );
}

export default function History() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState(() => loadSessions());
  const [confirmClear, setConfirmClear] = useState(false);

  function handleDelete(id) {
    deleteSession(id);
    setSessions(loadSessions());
  }

  function handleClear() {
    clearAllSessions();
    setSessions([]);
    setConfirmClear(false);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div
        className="fixed inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px',
        }}
      />

      <div className="relative z-10 max-w-lg mx-auto px-5 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate('/')}
              className="text-xs text-white/25 hover:text-white/55 transition-colors mb-2 block"
            >
              ← Home
            </button>
            <h2 className="text-xl font-light text-white/85">Session History</h2>
            <p className="text-xs text-white/30 mt-0.5">{sessions.length} session{sessions.length !== 1 ? 's' : ''}</p>
          </div>

          {sessions.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={exportSessions}
                title="Export JSON"
                className="p-2 rounded-xl border border-white/10 text-white/35 hover:text-white/65 hover:bg-white/5 transition-all"
              >
                <Download size={15} />
              </button>
              <button
                onClick={() => setConfirmClear(true)}
                title="Clear all"
                className="p-2 rounded-xl border border-white/10 text-white/35 hover:text-red-400/70 hover:border-red-400/30 transition-all"
              >
                <X size={15} />
              </button>
            </div>
          )}
        </div>

        {/* Confirm clear dialog */}
        {confirmClear && (
          <div className="mb-6 p-4 rounded-2xl border border-red-400/25 bg-red-400/5">
            <p className="text-sm text-white/70 mb-3">Delete all sessions? This cannot be undone.</p>
            <div className="flex gap-2">
              <button
                onClick={handleClear}
                className="px-4 py-1.5 rounded-full bg-red-500/20 text-red-300 text-xs hover:bg-red-500/35 transition-all"
              >
                Delete all
              </button>
              <button
                onClick={() => setConfirmClear(false)}
                className="px-4 py-1.5 rounded-full border border-white/10 text-white/45 text-xs hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Session list */}
        {sessions.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/20 text-sm">No sessions yet.</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 text-xs text-white/30 hover:text-white/60 transition-colors"
            >
              Start your first session →
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {sessions.map(session => (
              <SessionCard
                key={session.id}
                session={session}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}