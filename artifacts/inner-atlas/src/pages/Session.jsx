import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import GradientBackground from '../components/GradientBackground';
import MoodGlyph from '../components/MoodGlyph';
import AudioMixer from '../components/AudioMixer';
import audioEngine from '../lib/audioEngine';
import { saveSession } from '../lib/sessionStorage';
import { saveActiveDraft, loadActiveDraft, clearActiveDraft } from '../lib/activeSession';
import {
  MODES, MOODS, MOOD_PRESETS, DEFAULT_MIX,
  INTENTION_NUDGES, INTENTION_MICROCOPY,
} from '../lib/constants';

// ── Constants ──────────────────────────────────────────────────────────────

const JOURNAL_PLACEHOLDERS = {
  'deep-focus':       'What needs your full attention right now?',
  'night-reflection': 'What image, thought, or feeling is still with you?',
  'cognitive-unload': 'Drop the noise here. Let it land.',
};

const INTENTIONS = [
  { id: 'focus',            label: 'Focus' },
  { id: 'decompress',       label: 'Decompress' },
  { id: 'reflect',          label: 'Reflect' },
  { id: 'sleep_transition', label: 'Sleep' },
  { id: 'empty_thoughts',   label: 'Empty' },
];

const SESSION_STATE = {
  IDLE: 'idle',
  STARTING: 'starting',
  PLAYING: 'playing',
  PAUSING: 'pausing',
  PAUSED: 'paused',
  RESUMING: 'resuming',
  DISPOSING: 'disposing',
};

const TRANSITION_STATES = new Set([
  SESSION_STATE.STARTING,
  SESSION_STATE.PAUSING,
  SESSION_STATE.RESUMING,
  SESSION_STATE.DISPOSING,
]);

// ── Helpers ────────────────────────────────────────────────────────────────

function formatTime(s) {
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  return `${m}:${(s % 60).toString().padStart(2, '0')}`;
}

function normalizeMix(raw, moodId) {
  const base = { ...(MOOD_PRESETS[moodId] || DEFAULT_MIX) };
  if (!raw) return base;
  const out = { ...base };
  if (raw.drone  != null) out.drone  = raw.drone;
  if (raw.pad    != null) out.pad    = raw.pad;
  if (raw.rain   != null) out.rain   = raw.rain;
  if (raw.analog != null) out.analog = raw.analog;
  if (raw.tape   != null) out.analog = raw.tape;
  if (raw.pulse  != null) out.pulse  = raw.pulse;
  if (raw.air    != null) out.air    = raw.air;
  return out;
}

function applyNudge(mix, intentionId) {
  if (!intentionId || !INTENTION_NUDGES[intentionId]) return mix;
  const out = { ...mix };
  Object.entries(INTENTION_NUDGES[intentionId]).forEach(([layer, delta]) => {
    if (out[layer] != null) out[layer] = Math.max(0, Math.min(1, out[layer] + delta));
  });
  return out;
}

function calcElapsed(accumulated, startedAt, isRunning) {
  if (isRunning && startedAt != null)
    return accumulated + Math.floor((Date.now() - startedAt) / 1000);
  return accumulated;
}

function isTransitionState(state) {
  return TRANSITION_STATES.has(state);
}

// ── Component ──────────────────────────────────────────────────────────────

export default function Session() {
  const navigate = useNavigate();
  const params   = new URLSearchParams(window.location.search);
  const modeId   = params.get('mode') || 'deep-focus';
  const moodId   = params.get('mood') || 'calm';
  const mode     = MODES.find(m => m.id === modeId) || MODES[0];
  const mood     = MOODS.find(m => m.id === moodId) || MOODS[0];

  const [sessionState,   setSessionState]   = useState(SESSION_STATE.IDLE);
  const [accumulated,    setAccumulated]    = useState(0);
  const [startedAt,      setStartedAt]      = useState(null);
  const [displaySecs,    setDisplaySecs]    = useState(0);
  const [journal,        setJournal]        = useState('');
  const [mix,            setMix]            = useState(() => normalizeMix(null, moodId));
  const [intention,      setIntention]      = useState(null);
  const [mixerOpen,      setMixerOpen]      = useState(false);
  const [roomMode,       setRoomMode]       = useState(false);
  const [roomVisible,    setRoomVisible]    = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [createdAt,      setCreatedAt]      = useState(() => new Date().toISOString());
  const [audioError,     setAudioError]     = useState(null);

  const tickRef = useRef(null);
  const transitionLockRef = useRef(false);

  // ── Restore draft ──────────────────────────────────────────────────────
  useEffect(() => {
    const draft = loadActiveDraft();
    if (draft && draft.mode === modeId && draft.mood === moodId) {
      if (draft.journalText) setJournal(draft.journalText);
      if (draft.intention)   setIntention(draft.intention);
      if (draft.audioMix)    setMix(normalizeMix(draft.audioMix, moodId));
      if (draft.createdAt)   setCreatedAt(draft.createdAt);
      const saved = draft.accumulatedSeconds || 0;
      setAccumulated(saved); setDisplaySecs(saved);
    }
    return () => { audioEngine.pause().catch(() => {}); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Tick ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (sessionState === SESSION_STATE.PLAYING) {
      tickRef.current = setInterval(
        () => setDisplaySecs(calcElapsed(accumulated, startedAt, true)), 1000
      );
    } else {
      clearInterval(tickRef.current);
    }
    return () => clearInterval(tickRef.current);
  }, [sessionState, accumulated, startedAt]);

  // ── Autosave draft ─────────────────────────────────────────────────────
  const buildDraft = useCallback(() => ({
    mode: modeId, mood: moodId, createdAt,
    journalText:        journal,
    intention,
    audioMix:           mix,
    accumulatedSeconds: calcElapsed(accumulated, startedAt, sessionState === SESSION_STATE.PLAYING),
    startedAt:          sessionState === SESSION_STATE.PLAYING ? startedAt : null,
    isTimerRunning:     sessionState === SESSION_STATE.PLAYING,
  }), [modeId, moodId, createdAt, journal, intention, mix, accumulated, startedAt, sessionState]);

  useEffect(() => { saveActiveDraft(buildDraft()); }, [buildDraft]);
  useEffect(() => {
    const id = setInterval(() => saveActiveDraft(buildDraft()), 2000);
    return () => clearInterval(id);
  }, [buildDraft]);
  useEffect(() => {
    const flush = () => saveActiveDraft(buildDraft());
    document.addEventListener('visibilitychange', flush);
    window.addEventListener('beforeunload', flush);
    return () => {
      document.removeEventListener('visibilitychange', flush);
      window.removeEventListener('beforeunload', flush);
    };
  }, [buildDraft]);

  // ── Sync mix + nudge ───────────────────────────────────────────────────
  useEffect(() => {
    if (sessionState === SESSION_STATE.PLAYING) {
      audioEngine.applyMix(applyNudge(mix, intention));
    }
  }, [mix, intention, sessionState]);

  function beginTransition() {
    if (transitionLockRef.current || isTransitionState(sessionState)) return false;
    transitionLockRef.current = true;
    return true;
  }

  function finishTransition() {
    transitionLockRef.current = false;
  }

  // ── Primary control ────────────────────────────────────────────────────
  async function handlePrimary() {
    if (!beginTransition()) return;

    try {
    if (sessionState === SESSION_STATE.IDLE) {
      setSessionState(SESSION_STATE.STARTING);
      try {
        await audioEngine.play(applyNudge(mix, intention));
        setAudioError(null);
      } catch {
        setAudioError('Audio unavailable — session continues silently.');
      }
      setStartedAt(Date.now());
      setSessionState(SESSION_STATE.PLAYING);
    } else if (sessionState === SESSION_STATE.PLAYING) {
      const elapsed = calcElapsed(accumulated, startedAt, true);
      setAccumulated(elapsed); setStartedAt(null); setDisplaySecs(elapsed);
      setSessionState(SESSION_STATE.PAUSING);
      await audioEngine.pause().catch(() => {});
      setSessionState(SESSION_STATE.PAUSED);
    } else if (sessionState === SESSION_STATE.PAUSED) {
      setSessionState(SESSION_STATE.RESUMING);
      try {
        await audioEngine.resume();
        setAudioError(null);
      } catch {
        setAudioError('Audio unavailable — continuing silently.');
      }
      setStartedAt(Date.now());
      setSessionState(SESSION_STATE.PLAYING);
    }
    } finally {
      finishTransition();
    }
  }

  // ── End & Save ─────────────────────────────────────────────────────────
  async function handleEndSave() {
    if (!beginTransition()) return;

    const finalSecs = calcElapsed(accumulated, startedAt, sessionState === SESSION_STATE.PLAYING);
    setSessionState(SESSION_STATE.DISPOSING);
    saveSession({
      id:              `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      mode:            modeId, mood: moodId,
      durationSeconds: finalSecs,
      journalText:     journal.trim(),
      audioMix:        { ...mix },
      intention:       intention || null,
      createdAt,
    });
    clearActiveDraft();
    audioEngine.pause().catch(() => {});
    setTimeout(() => navigate('/history'), 350);
  }

  // ── Discard ────────────────────────────────────────────────────────────
  function handleDiscard() {
    if (!beginTransition()) return;

    setSessionState(SESSION_STATE.DISPOSING);
    clearActiveDraft();
    audioEngine.pause().catch(() => {});
    setTimeout(() => navigate('/'), 300);
  }

  // ── Room mode ──────────────────────────────────────────────────────────
  function enterRoom() {
    setRoomMode(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setRoomVisible(true)));
  }
  function exitRoom() {
    setRoomVisible(false);
    setTimeout(() => setRoomMode(false), 350);
  }
  useEffect(() => {
    if (!roomMode) return;
    const h = (e) => { if (e.key === 'Escape') exitRoom(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [roomMode]);

  const isTransitioning = TRANSITION_STATES.has(sessionState);
  const isActive = sessionState === SESSION_STATE.PLAYING;
  const isStarted = sessionState !== SESSION_STATE.IDLE;
  const primaryLabel =
    sessionState === SESSION_STATE.IDLE || sessionState === SESSION_STATE.STARTING
      ? 'Begin Session'
      : sessionState === SESSION_STATE.PLAYING || sessionState === SESSION_STATE.PAUSING
        ? 'Pause'
        : 'Resume';

  // ── Room Mode ──────────────────────────────────────────────────────────
  if (roomMode) {
    return (
      <div
        className="fixed inset-0 flex flex-col items-center justify-center select-none cursor-pointer"
        style={{ opacity: roomVisible ? 1 : 0, transition: 'opacity 400ms ease' }}
        onClick={exitRoom}
      >
        <GradientBackground modeId={modeId} />
        <div className="relative z-10 flex flex-col items-center gap-10 pointer-events-none">
          {/* Animated sigil — large and sigil-pulsing */}
          <div className="sigil-pulse">
            <MoodGlyph moodId={moodId} size={96} color={mode.accentColor} opacity={0.22} />
          </div>

          {/* Timer */}
          <div
            className="font-display text-[4.5rem] md:text-[6rem] font-light tracking-[0.15em] text-white/70 tabular-nums leading-none"
            style={{ textShadow: `0 0 100px ${mode.accentColor}28` }}
          >
            {formatTime(displaySecs)}
          </div>

          {/* Minimal context */}
          <div className="flex flex-col items-center gap-1.5">
            <p className="text-[9px] text-white/16 tracking-[0.38em] uppercase font-body">
              {mode.label} · {mood.label}
            </p>
            {intention && INTENTION_MICROCOPY[intention] && (
              <p className="text-xs text-white/10 italic font-display">
                {INTENTION_MICROCOPY[intention]}
              </p>
            )}
          </div>

          <p className="text-[9px] text-white/08 tracking-[0.25em] mt-4 font-body">tap to return</p>
        </div>
      </div>
    );
  }

  // ── Main Session ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col text-white relative">
      <GradientBackground modeId={modeId} />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-5 pb-1">
        <button
          onClick={() => isStarted ? setConfirmDiscard(true) : navigate('/')}
          className="text-[11px] text-white/22 hover:text-white/50 transition-colors duration-300 font-body"
        >
          ← Exit
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-white/28 font-body">{mode.label}</span>
          <span className="text-white/14">·</span>
          <span className="text-[11px] text-white/28 font-body">{mood.label}</span>
        </div>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1 px-5 pb-10 pt-4 max-w-xl mx-auto w-full
                      md:justify-center md:py-14 gap-5">

        {audioError && (
          <p className="text-center text-xs text-amber-400/50 fade-in font-body">{audioError}</p>
        )}

        {/* Discard confirmation */}
        {confirmDiscard && (
          <div className="glass-card rounded-2xl p-4 flex flex-col gap-3 fade-in">
            <p className="text-sm text-white/68 font-body">Discard this session permanently?</p>
            <div className="flex gap-2">
              <button onClick={handleDiscard}
                className="px-4 py-1.5 rounded-full bg-red-500/14 text-red-300/72 text-xs hover:bg-red-500/24 transition-all font-body">
                Discard
              </button>
              <button onClick={() => setConfirmDiscard(false)}
                className="px-4 py-1.5 rounded-full border border-white/08 text-white/38 text-xs hover:bg-white/5 transition-all font-body">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Timer */}
        <div className="flex flex-col items-center gap-1 py-3 card-appear">
          <div
            className="font-display text-[4.5rem] md:text-[5.5rem] font-light tracking-[0.12em] text-white/82 tabular-nums select-none leading-none"
            style={{ textShadow: `0 0 60px ${mode.accentColor}1a` }}
          >
            {formatTime(displaySecs)}
          </div>
        </div>

        {/* Primary action */}
        <div className="flex flex-col items-center gap-3 card-appear" style={{ animationDelay: '80ms' }}>
          <button
            onClick={handlePrimary}
            disabled={isTransitioning}
            aria-busy={isTransitioning}
            className="px-8 py-2.5 rounded-full transition-all duration-500 font-body text-sm tracking-[0.18em] uppercase"
            style={{
              background:   isActive ? `${mode.accentColor}16` : 'rgba(255,255,255,0.04)',
              border:       `1px solid ${isActive ? mode.accentColor + '55' : 'rgba(255,255,255,0.10)'}`,
              borderTopColor: isActive ? mode.accentColor + '80' : 'rgba(255,255,255,0.15)',
              color:        isActive ? mode.accentColor + 'ee' : 'rgba(255,255,255,0.58)',
              boxShadow:    isActive ? `0 0 20px ${mode.accentColor}14, inset 0 1px 0 ${mode.accentColor}20` : 'inset 0 1px 0 rgba(255,255,255,0.07)',
            }}
          >
            {primaryLabel}
          </button>

          {/* Enter Room — shown once session has started */}
          {isStarted && (
            <button
              onClick={enterRoom}
              className="flex items-center gap-2 px-5 py-1.5 rounded-full transition-all duration-400 fade-in"
              style={{
                border: `1px solid ${mode.accentColor}25`,
                color: `${mode.accentColor}bb`,
                background: `${mode.accentColor}08`,
              }}
            >
              <div className="sigil-pulse">
                <MoodGlyph moodId={moodId} size={14} color={mode.accentColor} opacity={0.7} />
              </div>
              <span className="text-[11px] tracking-[0.2em] uppercase font-body">Enter Room</span>
            </button>
          )}
        </div>

        {/* Intentions */}
        <div className="flex flex-col gap-2 card-appear" style={{ animationDelay: '140ms' }}>
          <div className="flex flex-wrap gap-1.5">
            {INTENTIONS.map(it => (
              <button
                key={it.id}
                onClick={() => setIntention(intention === it.id ? null : it.id)}
                className="px-3 py-1 rounded-full text-xs transition-all duration-400 font-body"
                style={{
                  border:     `1px solid ${intention === it.id ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.06)'}`,
                  background: intention === it.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                  color:      intention === it.id ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.28)',
                  boxShadow:  intention === it.id ? `0 0 16px ${mode.accentColor}14` : 'none',
                }}
              >
                {it.label}
              </button>
            ))}
          </div>
          <p className="text-[11px] pl-0.5 font-body" style={{ color: 'rgba(255,255,255,0.18)' }}>
            {intention && INTENTION_MICROCOPY[intention]
              ? <span><em className="not-italic" style={{ color: 'rgba(255,255,255,0.30)' }}>{INTENTION_MICROCOPY[intention]}</em><span style={{ color: 'rgba(255,255,255,0.12)' }}> · Intention shapes the room subtly.</span></span>
              : 'Set an intention for this session.'}
          </p>
        </div>

        {/* Collapsible mixer */}
        <div className="glass-card rounded-2xl overflow-hidden card-appear" style={{ animationDelay: '180ms' }}>
          <button
            onClick={() => setMixerOpen(o => !o)}
            className="w-full flex items-center justify-between px-5 py-3 transition-colors duration-300 font-body"
            style={{ color: 'rgba(255,255,255,0.28)' }}
          >
            <span className="text-[11px] tracking-[0.2em] uppercase">Customize Soundscape</span>
            {mixerOpen ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          </button>
          {mixerOpen && (
            <div className="px-5 pb-5 border-t border-white/[0.04]">
              <div className="pt-4">
                <AudioMixer mix={mix} onChange={(newMix) => {
                  setMix(newMix);
                  if (isActive) audioEngine.applyMix(applyNudge(newMix, intention));
                }} />
              </div>
            </div>
          )}
        </div>

        {/* Journal */}
        <div className="flex flex-col gap-1 card-appear" style={{ animationDelay: '220ms' }}>
          <textarea
            value={journal}
            onChange={e => setJournal(e.target.value)}
            placeholder={JOURNAL_PLACEHOLDERS[modeId] || 'Write freely.'}
            rows={5}
            className="w-full resize-none rounded-xl px-4 py-4 text-sm leading-relaxed focus:outline-none transition-all duration-300 font-body"
            style={{
              background: 'rgba(255,255,255,0.022)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderTopColor: 'rgba(255,255,255,0.10)',
              color: 'rgba(255,255,255,0.65)',
              caretColor: mode.accentColor,
            }}
            onFocus={e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.background = 'rgba(255,255,255,0.032)'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.06)'; e.target.style.background = 'rgba(255,255,255,0.022)'; }}
          />
          {journal.length > 0 && (
            <p className="text-[10px] text-right font-body" style={{ color: 'rgba(255,255,255,0.12)' }}>{journal.length}</p>
          )}
        </div>

        {/* End actions */}
        <div className="flex flex-col gap-1 pt-1 card-appear" style={{ animationDelay: '260ms' }}>
          <button
            onClick={handleEndSave}
            className="w-full py-3 rounded-2xl transition-all duration-300 text-[11px] tracking-[0.18em] uppercase font-body glass-card glass-card-hover"
            style={{ color: 'rgba(255,255,255,0.40)' }}
          >
            End &amp; Save
          </button>
          <button
            onClick={() => setConfirmDiscard(true)}
            className="w-full py-1.5 text-[11px] transition-colors duration-300 font-body"
            style={{ color: 'rgba(255,255,255,0.12)' }}
            onMouseEnter={e => { e.target.style.color = 'rgba(255,80,80,0.45)'; }}
            onMouseLeave={e => { e.target.style.color = 'rgba(255,255,255,0.12)'; }}
          >
            Discard Session
          </button>
        </div>
      </div>
    </div>
  );
}
