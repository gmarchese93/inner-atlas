const KEY = 'inner_atlas_sessions';

export function loadSessions() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSession(session) {
  const sessions = loadSessions();
  sessions.unshift(session); // prepend — reverse chronological
  localStorage.setItem(KEY, JSON.stringify(sessions));
}

export function deleteSession(id) {
  const sessions = loadSessions().filter(s => s.id !== id);
  localStorage.setItem(KEY, JSON.stringify(sessions));
}

export function clearAllSessions() {
  localStorage.removeItem(KEY);
}

export function exportSessions() {
  const sessions = loadSessions();
  const blob = new Blob([JSON.stringify(sessions, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `inner_atlas_sessions_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}