const STORAGE_KEY = 'smartwearable-preferences-v1';
const FIELDS = ['pulseAlerts', 'activityReminder', 'shareWithCareTeam'];

export function emptyPreferences() {
  return { pulseAlerts: null, activityReminder: null, shareWithCareTeam: null };
}

export function completePreferences(value) {
  return !!value && FIELDS.every(field => typeof value[field] === 'boolean');
}

export function readPreferences(storage) {
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (saved?.schema !== 1 || !completePreferences(saved)) return null;
    return Object.fromEntries(FIELDS.map(field => [field, saved[field]]));
  } catch {
    return null;
  }
}

export function writePreferences(storage, value) {
  if (!completePreferences(value)) return false;
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify({ schema: 1, ...Object.fromEntries(FIELDS.map(field => [field, value[field]])) }));
    return !!storage;
  } catch {
    return false;
  }
}

export function clearPreferences(storage) {
  try {
    storage?.removeItem(STORAGE_KEY);
    return !!storage;
  } catch {
    return false;
  }
}
