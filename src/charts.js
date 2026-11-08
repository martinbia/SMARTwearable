import { GOAL, time } from './data.js';
export const n = value => value == null ? '—' : new Intl.NumberFormat('de-CH', { maximumFractionDigits: 1 }).format(value);
export function icon(kind, cls = '') {
  const paths = {
    activity: '<circle cx="12" cy="12" r="3"/><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4.2 4.2l2.1 2.1m11.4 11.4 2.1 2.1M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
    steps: '<path d="M5 14c-3-1-3-6-1-9s5-1 5 2l-1 7zM4 17h4v4H4zM15 16c-3-1-3-6-1-9s5-1 5 2l-1 7zM14 19h4v3h-4z"/>',
    pulse: '<path d="M12 21S1 14 1 7a6 6 0 0 1 11-3A6 6 0 0 1 23 7c0 7-11 14-11 14zM4 12h4l2-4 3 8 2-4h5"/>',
    device: '<rect x="6" y="5" width="12" height="14" rx="3"/><path d="M9 1h6v4H9zM9 19h6v4H9z"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 10v7m0-11v1"/>',
    battery: '<rect x="1" y="5" width="19" height="14" rx="2"/><path d="M23 9v6M4 8h9v8H4z"/>'
  };
  return `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[kind] || paths.activity}</svg>`;
}
export const empty = label => `<span class="empty-data">${label}</span>`;
export function bar(value, max, { goal = false, best = false } = {}) {
  if (value == null) return empty('Keine Daten');
  return `<div class="bar-plot" aria-hidden="true">${goal ? `<span class="goal-band" style="bottom:${GOAL.lower / max * 100}%;height:${(GOAL.upper - GOAL.lower) / max * 100}%"></span><span class="goal-line" style="bottom:${GOAL.target / max * 100}%"></span>` : ''}<span class="vertical-bar" style="height:${Math.max(0, value / max * 100)}%"></span>${best ? '<span class="best-mark">◇</span>' : ''}</div><strong>${n(value)}</strong>`;
}
export function range(day, low = 50, high = 120) {
  if (day.pulseMin == null) return empty('Keine Daten');
  const y = v => (high - v) / (high - low) * 100;
  return `<span class="range-values">${n(day.pulseMin)}–${n(day.pulseMax)}</span><svg class="range-plot" viewBox="0 0 90 100" preserveAspectRatio="none" role="img" aria-label="Minimum ${day.pulseMin}, Maximum ${day.pulseMax}, Mittelwert ${day.pulseMean} Schläge pro Minute"><path d="M45 ${y(day.pulseMin)}V${y(day.pulseMax)}M33 ${y(day.pulseMin)}h24M33 ${y(day.pulseMax)}h24"/><circle cx="45" cy="${y(day.pulseMean)}" r="4"/></svg><span class="mean-label">Ø ${n(day.pulseMean)}</span>`;
}
// Both daily plots use exactly the same domain, including the device data cutoff.
export function timeScale(day) {
  const start = day.start;
  const end = day.availableEnd;
  const duration = Math.max(1, end - start);
  const step = duration > 480 ? 120 : 60;
  const ticks = [start];
  for (let t = start + step; t < end; t += step) if (end - t >= step) ticks.push(t);
  if (end > start) ticks.push(end);
  return { start, end, ticks, percent: t => (t - start) / duration * 100 };
}
const timeAxis = scale => `<div class="time-axis" aria-hidden="true">${scale.ticks.map(t => `<span style="left:${scale.percent(t)}%">${time(t)}</span>`).join('')}</div>`;
const gapShading = (day, scale) => day.gaps.map(g => `<span class="time-gap" style="left:${scale.percent(g.start)}%;width:${scale.percent(g.end) - scale.percent(g.start)}%" title="Datenlücke ${time(g.start)}–${time(g.end)}"></span>`).join('');
export function activityTimeline(day) {
  if (!day.hasData) return '<p class="empty-day">Noch keine verfügbaren Messdaten in diesem Zeitraum.</p>';
  const scale = timeScale(day);
  return `<div class="activity-timechart" data-time-start="${scale.start}" data-time-end="${scale.end}"><div class="time-grid"><div class="lane-labels"><span>Schrittbewegung<small>${day.activity.filter(a => a.kind === 'steps').reduce((sum, a) => sum + a.end - a.start, 0)} min</small></span><span>Sonstige Bewegung<small>${day.activity.filter(a => a.kind === 'other').reduce((sum, a) => sum + a.end - a.start, 0)} min</small></span></div><div class="time-lanes">${['steps', 'other'].map(kind => `<div class="time-lane" role="img" aria-label="${kind === 'steps' ? 'Schrittbewegung' : 'Sonstige Bewegung'}: ${day.activity.filter(a => a.kind === kind).reduce((total, a) => total + a.end - a.start, 0)} Minuten, Einzelabschnitte unter Weitere Angaben">${gapShading(day, scale)}${day.activity.filter(a => a.kind === kind).map(a => `<span class="movement-segment ${kind === 'steps' ? 'step-segment' : 'other-segment'}" data-duration="${a.end - a.start}" style="left:${scale.percent(a.start)}%;width:${scale.percent(a.end) - scale.percent(a.start)}%" title="${time(a.start)}–${time(a.end)} Uhr · ${a.end - a.start} min"></span>`).join('')}</div>`).join('')}</div></div>${timeAxis(scale)}</div>`;
}
export function pulseLine(day) {
  if (!day.pulse.length) return '<p class="empty-day">Keine verfügbaren Pulswerte in diesem Zeitraum.</p>';
  const scale = timeScale(day);
  const groups = [];
  for (const p of day.pulse) {
    const previous = groups.at(-1);
    if (!previous || p.t - previous.at(-1).t > 1) groups.push([p]); else previous.push(p);
  }
  return `<div class="pulse-timechart" data-time-start="${scale.start}" data-time-end="${scale.end}"><div class="time-grid"><div class="time-y-axis"><span class="unit-label">Schläge/min</span>${[120, 85, 50].map((value, i) => `<span class="y-tick" style="top:${i * 50}%">${value}</span>`).join('')}</div><div class="pulse-plot">${gapShading(day, scale)}<svg class="pulse-line" viewBox="0 0 1000 200" preserveAspectRatio="none" role="img" aria-label="Pulsverlauf von ${time(scale.start)} bis ${time(scale.end)} Uhr, Minimum ${day.pulseMin}, Maximum ${day.pulseMax} Schläge pro Minute. Datenlücken nicht verbunden.">${groups.map(g => `<polyline points="${g.map(p => `${scale.percent(p.t) * 10},${(120 - p.value) / 70 * 200}`).join(' ')}"/>`).join('')}</svg></div></div>${timeAxis(scale)}</div>`;
}
