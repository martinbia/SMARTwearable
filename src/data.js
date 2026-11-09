import { addDays, weekDates } from './calendar.js';
export const VERSION = '0.7.0';
export const GOAL = { target: 100, lower: 90, upper: 110 };
export const time = n => `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`;
export const activityScenarios = { S01: 'Beispieltag', S02: 'Ruhigerer Tag', S03: 'Tag mit Datenlücke' };
export const deviceScenarios = {
  G01: 'Aktuell und verbunden', G02: 'Batterie niedrig', G03: 'Wird geladen',
  G04: 'Verbindung unterbrochen', G05: 'Übertragung ausstehend', G06: 'Übertragung läuft',
  G07: 'Übertragung fehlgeschlagen', G08: 'Speicher fast voll', G09: 'Restlaufzeit unbekannt'
};
export function allocate(total, weights) {
  const sum = weights.reduce((a, b) => a + b, 0);
  const raw = weights.map(w => total * w / sum);
  const result = raw.map(Math.floor);
  const order = raw.map((v, i) => ({ i, rest: v - result[i] })).sort((a, b) => b.rest - a.rest || a.i - b.i);
  const remainder = total - result.reduce((a, b) => a + b, 0);
  for (let i = 0; i < remainder; i++) result[order[i].i]++;
  return result;
}
export const weeksFor = session => Array.from({ length: 6 }, (_, i) => addDays(session.monday, (i - 5) * 7));
export function rawDay(session, date, scenario = 'S01', gapReason = 'no_signal') {
  const weeks = weeksFor(session);
  const wi = weeks.findIndex(start => weekDates(start).includes(date));
  if (wi < 0) throw Error('Datum liegt ausserhalb der sechs Demo-Wochen');
  const di = weekDates(weeks[wi]).indexOf(date);
  const future = date > session.today;
  const today = date === session.today;
  let minutes = wi === 5 ? [20, 25, 20, 15, 10, 12, 8][di] : allocate([90, 100, 85, 110, 95][wi], [12, 15, 10, 18, 8, 20, 12])[di];
  let steps = wi === 5 ? [900, 1100, 850, 650, 450, 600, 400][di] : allocate([4000, 4500, 3900, 5000, 4300][wi], [500, 650, 450, 800, 350, 950, 600])[di];
  if (today && scenario === 'S02') { minutes = 8; steps = 400; }
  const day = { date, start: 480, end: today ? Math.max(480, session.dataMinute) : 1200, future, today,
    activity: [], stepSamples: [], pulse: [], temperature: [], gaps: [] };
  if (future) return day;
  if (wi === 5 && di === 2) day.gaps.push({ start: 780, end: 840, reason: 'no_signal' });
  if (today && scenario === 'S03') day.gaps.push({ start: 600, end: 720, reason: gapReason });
  const starts = [520, 615, 695, 850];
  day.activity = allocate(minutes, [1, 1, 1, 1]).map((duration, i) => ({
    id: `${date}-${i}`, start: starts[i], end: starts[i] + duration,
    kind: i % 2 === 0 ? 'steps' : 'other', source: 'derived_demo'
  })).filter(x => x.end > x.start);
  const stepTimes = day.activity.filter(a => a.kind === 'steps').flatMap(a => Array.from({ length: a.end - a.start }, (_, i) => a.start + i));
  const counts = allocate(steps, stepTimes.map(() => 1));
  day.stepSamples = stepTimes.map((t, i) => ({ t, value: counts[i] }));
  day.pulse = Array.from({ length: 720 }, (_, i) => {
    const t = day.start + i;
    const kind = day.activity.find(a => t >= a.start && t < a.end)?.kind ?? 'quiet';
    const pattern = kind === 'steps' ? [88, 94, 100, 92, 104] : kind === 'other' ? [80, 84, 90, 86, 88] : [62, 74, 76, 75, 78, 72, 73];
    return { t, value: pattern[(i + di) % pattern.length] + di % 3, kind };
  });
  day.temperature = Array.from({ length: 12 }, (_, i) => ({ t: 480 + i * 60, value: [32.4, 32.6, 32.5, 32.8, 32.7, 32.9][(i + di) % 6] }));
  return day;
}
export function getDevice(session, id = 'G01') {
  const at = session.dataMinute;
  const stale = Math.max(0, at - 240);
  const d = { id, battery: 62, charging: false, runtime: 48, connected: true,
    lastTransfer: at, dataThrough: at, nextTransfer: Math.min(1439, session.clock + 180), storage: 72,
    transfer: 'current', pendingFrom: null, pendingTo: null };
  if (id === 'G02') Object.assign(d, { battery: 15, runtime: 8 });
  if (id === 'G03') Object.assign(d, { battery: 35, charging: true, runtime: null });
  if (['G04', 'G05', 'G06', 'G07'].includes(id)) Object.assign(d, {
    connected: id !== 'G04', lastTransfer: Math.min(at, stale + 5), dataThrough: stale,
    pendingFrom: stale, pendingTo: at, transfer: id === 'G06' ? 'running' : id === 'G07' ? 'failed' : 'pending'
  });
  if (id === 'G08') d.storage = 4;
  if (id === 'G09') Object.assign(d, { runtime: null, storage: null });
  return d;
}
