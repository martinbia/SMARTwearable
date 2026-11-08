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
  const y = v => 100 - (v - low) / (high - low) * 80;
  return `<span class="range-values">${n(day.pulseMin)}–${n(day.pulseMax)}</span><svg class="range-plot" viewBox="0 0 90 120" role="img" aria-label="Minimum ${day.pulseMin}, Maximum ${day.pulseMax}, Mittelwert ${day.pulseMean} Schläge pro Minute"><path d="M45 ${y(day.pulseMin)}V${y(day.pulseMax)}M33 ${y(day.pulseMin)}h24M33 ${y(day.pulseMax)}h24"/><circle cx="45" cy="${y(day.pulseMean)}" r="6"/></svg><span class="mean-label">Ø ${n(day.pulseMean)}</span>`;
}
export function pulseLine(day) {
  if (!day.pulse.length) return '<p>Keine verfügbaren Pulswerte in diesem Zeitraum.</p>';
  const groups = [];
  for (const p of day.pulse) {
    const previous = groups.at(-1);
    if (!previous || p.t - previous.at(-1).t > 1) groups.push([p]); else previous.push(p);
  }
  const min = Math.floor(day.pulseMin / 10) * 10 - 10;
  const max = Math.ceil(day.pulseMax / 10) * 10 + 10;
  const x = t => 60 + (t - day.start) / Math.max(1, day.end - day.start) * 630;
  const y = v => 160 - (v - min) / (max - min) * 130;
  return `<svg class="pulse-line" viewBox="0 0 740 210" role="img" aria-label="Pulsverlauf von ${time(day.start)} bis ${time(day.availableEnd)} Uhr, Minimum ${day.pulseMin}, Maximum ${day.pulseMax} Schläge pro Minute. Datenlücken nicht verbunden."><path class="axis-line" d="M60 20V165H690"/><text x="5" y="35">${max}</text><text x="5" y="165">${min}</text>${groups.map(g => `<polyline points="${g.map(p => `${x(p.t)},${y(p.value)}`).join(' ')}"/>`).join('')}<text x="60" y="200">${time(day.start)}</text><text x="620" y="200">${time(day.end)}</text></svg>`;
}
