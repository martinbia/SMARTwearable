export function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function localDate(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d, 12);
}
export function addDays(key, amount) {
  const date = localDate(key); date.setDate(date.getDate() + amount); return dateKey(date);
}
export function monday(key) {
  return addDays(key, -((localDate(key).getDay() + 6) % 7));
}
export const weekDates = start => Array.from({ length: 7 }, (_, i) => addDays(start, i));
export const dateLabel = (key, options = {}) => new Intl.DateTimeFormat('de-CH', { weekday: 'long', day: 'numeric', month: 'long', ...options }).format(localDate(key));
export const shortDate = key => new Intl.DateTimeFormat('de-CH', { day: 'numeric', month: 'numeric' }).format(localDate(key));
export const weekLabel = start => `${shortDate(start)}–${shortDate(addDays(start, 6))}`;
export function createSession(now = new Date()) {
  const today = dateKey(now);
  const clock = now.getHours() * 60 + now.getMinutes();
  return { today, clock, dataMinute: Math.min(clock, 1200), monday: monday(today) };
}
