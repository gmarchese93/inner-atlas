// Active session draft persistence
const KEY = 'inner_atlas_active_session';

export function saveActiveDraft(draft) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...draft, updatedAt: Date.now() }));
  } catch (_) {}
}

export function loadActiveDraft() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) { return null; }
}

export function clearActiveDraft() {
  try { localStorage.removeItem(KEY); } catch (_) {}
}