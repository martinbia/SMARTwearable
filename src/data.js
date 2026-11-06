export const VERSION = '0.1.0';
export const TODAY = '2026-11-09';
export const NOW = `${TODAY}T14:30:00+01:00`;
export const minute = text => Number(text.slice(0, 2)) * 60 + Number(text.slice(3, 5));
export const time = n => `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`;
const intervals = text => text.split(' ').map((pair, i) => {
  const [start, end] = pair.split('-').map(minute);
  return { id: `movement-${i}`, start, end, source: 'derived_demo' };
});
const rows = [
  ['03', '09:00-09:05 11:00-11:04 14:00-14:04 17:00-17:05', 800],
  ['04', '09:00-09:05 11:00-11:05 13:00-13:04 15:00-15:04 18:00-18:04', 1000],
  ['05', '09:00-09:04 12:00-12:04 17:00-17:04', 550],
  ['06', '09:00-09:05 11:00-11:05 13:00-13:04 16:00-16:05 18:00-18:05', 1100],
  ['07', '09:00-09:05 11:00-11:05 16:00-16:05 18:00-18:05', 900],
  ['08', '09:00-09:05 11:00-11:05 13:00-13:05 15:00-15:05 17:00-17:05 19:00-19:05', 1400],
  ['09', '08:40-08:46 10:15-10:20 11:35-11:42 13:50-13:56', 1100]
];
export const DATES = rows.map(([day]) => `2026-11-${day}`);
export const activityScenarios = { S01: 'Beispieltag', S02: 'Ruhigerer Tag', S03: 'Tag mit Datenlücke' };
export const deviceScenarios = {
  G01: 'Aktuell und verbunden', G02: 'Batterie niedrig', G03: 'Wird geladen',
  G04: 'Verbindung unterbrochen', G05: 'Übertragung ausstehend', G06: 'Übertragung läuft',
  G07: 'Übertragung fehlgeschlagen', G08: 'Speicher fast voll', G09: 'Restlaufzeit unbekannt'
};
export function getDay(date, scenario = 'S01', gapReason = 'no_signal') {
  const row = rows.find(([d]) => date === `2026-11-${d}`);
  if (!row) throw new Error('Unbekanntes Demo-Datum');
  const today = date === TODAY;
  const day = {
    date, start: 480, end: today ? 870 : 1200,
    activity: intervals(row[1]), steps: row[2], distance: row[2] * 0.4,
    gaps: row[0] === '07' ? [{ start: 780, end: 900, reason: 'no_signal' }] : []
  };
  if (today && scenario === 'S02') {
    day.activity = intervals('08:40-08:44 13:50-13:54'); day.steps = 400; day.distance = 160;
  }
  if (today && scenario === 'S03') {
    day.gaps = [{ start: 600, end: 720, reason: gapReason }];
    day.activity = day.activity.filter(x => x.end <= 600 || x.start >= 720);
    day.steps = 550; day.distance = 220;
  }
  // Samples are deterministic, equal-spaced and removed inside known gaps.
  day.pulse = today ? Array.from({ length: 79 }, (_, i) => {
    const t = 480 + i * 5;
    return { t, value: day.activity.some(x => t >= x.start && t < x.end)
      ? [86, 90, 94, 88][i % 4] : [72, 74, 73, 75][i % 4] };
  }).filter(x => !day.gaps.some(g => x.t >= g.start && x.t < g.end)) : [];
  day.temperature = today ? [32.4, 32.6, 32.5, 32.8, 32.7, 32.9, 32.6]
    .map((value, i) => ({ t: 480 + i * 60, value }))
    .filter(x => !day.gaps.some(g => x.t >= g.start && x.t < g.end)) : [];
  return day;
}
export function getDevice(id = 'G01') {
  const d = { id, battery: 62, charging: false, runtime: 48, connected: true,
    lastTransfer: '14:30', dataThrough: '14:30', nextTransfer: '18:00', storage: 72,
    transfer: 'current', pendingFrom: null, pendingTo: null,
    estimateBasis: 'Vorgegebener fiktiver Betriebsmodus, kein reales Akkumodell' };
  if (id === 'G02') Object.assign(d, { battery: 15, runtime: 8 });
  if (id === 'G03') Object.assign(d, { battery: 35, charging: true, runtime: null });
  if (['G04', 'G05', 'G06', 'G07'].includes(id)) Object.assign(d, {
    connected: id !== 'G04', lastTransfer: '10:20', dataThrough: '10:15',
    pendingFrom: '10:15', pendingTo: '14:30',
    transfer: id === 'G06' ? 'running' : id === 'G07' ? 'failed' : 'pending'
  });
  if (id === 'G08') d.storage = 4;
  if (id === 'G09') Object.assign(d, { runtime: null, storage: null });
  return d;
}
