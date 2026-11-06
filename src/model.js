import { TODAY, getDay, getDevice, minute } from './data.js';
export const initialState = () => ({ view: 'day', date: TODAY, variant: 'A', scenario: 'S01',
  deviceScenario: 'G01', device: getDevice(), gapReason: 'no_signal', previousView: 'day' });
export function reduce(state, action) {
  switch (action.type) {
    case 'reset': return initialState();
    case 'navigate': return { ...state, view: action.view, ...(action.view === 'day' ? { date: TODAY } : {}) };
    case 'date': return { ...state, date: action.date, view: 'day' };
    case 'variant': return { ...state, variant: action.value };
    case 'scenario': return { ...state, scenario: action.value, date: TODAY };
    case 'device': return { ...state, deviceScenario: action.value, device: getDevice(action.value) };
    case 'gapReason': return { ...state, gapReason: action.value };
    case 'details': return { ...state, previousView: state.view, view: 'details' };
    case 'back': return { ...state, view: state.previousView };
    case 'transferStart': return { ...state, device: { ...state.device, transfer: 'running' } };
    case 'transferEnd': return { ...state, device: state.deviceScenario === 'G07'
      ? { ...state.device, transfer: 'failed' }
      : { ...state.device, connected: true, transfer: 'current', dataThrough: '14:30', lastTransfer: '14:30', pendingFrom: null, pendingTo: null, storage: 72 } };
    case 'chargeStart': return { ...state, device: { ...state.device, charging: true, runtime: null } };
    case 'chargeEnd': return { ...state, device: { ...state.device, charging: false, battery: 100, runtime: 77 } };
    default: return state;
  }
}
const overlap = (a, b, start, end) => Math.max(0, Math.min(b, end) - Math.max(a, start));
export function selectDay(state, date = state.date) {
  const day = getDay(date, state.scenario, state.gapReason);
  const end = Math.min(day.end, date === TODAY ? minute(state.device.dataThrough) : day.end);
  const gaps = day.gaps.map(g => ({ ...g, start: Math.max(day.start, g.start), end: Math.min(end, g.end) })).filter(g => g.end > g.start);
  const activity = day.activity.flatMap(x => {
    let segments = [{ ...x, start: Math.max(x.start, day.start), end: Math.min(x.end, end) }].filter(x => x.end > x.start);
    for (const g of gaps) segments = segments.flatMap(s => g.end <= s.start || g.start >= s.end ? [s] : [
      { ...s, end: Math.min(s.end, g.start) }, { ...s, start: Math.max(s.start, g.end) }
    ].filter(s => s.end > s.start));
    return segments;
  });
  const covered = end - day.start - gaps.reduce((sum, g) => sum + g.end - g.start, 0);
  const totalMovement = activity.reduce((sum, x) => sum + x.end - x.start, 0);
  // Aggregate-only step/distance values cannot be accurately prorated after a partial transfer.
  const complete = end === day.end;
  const pulse = day.pulse.filter(x => x.t <= end && !gaps.some(g => x.t >= g.start && x.t < g.end));
  const temperature = day.temperature.filter(x => x.t <= end && !gaps.some(g => x.t >= g.start && x.t < g.end));
  return { ...day, availableEnd: end, gaps, activity, covered, movement: Math.round(totalMovement),
    count: activity.length, quiet: covered - totalMovement,
    coverageTotal: day.end - day.start, steps: complete ? day.steps : null,
    distance: complete ? day.distance : null, pulse, temperature,
    pulseMean: pulse.length ? Math.round(pulse.reduce((s, x) => s + x.value, 0) / pulse.length) : null,
    pulseMin: pulse.length ? Math.min(...pulse.map(x => x.value)) : null,
    pulseMax: pulse.length ? Math.max(...pulse.map(x => x.value)) : null };
}
export function segments(day) {
  const points = [...new Set([day.start, day.availableEnd, day.end, 1200,
    ...day.activity.flatMap(x => [x.start, x.end]), ...day.gaps.flatMap(x => [x.start, x.end])])].sort((a, b) => a - b);
  return points.slice(0, -1).map((start, i) => {
    const end = points[i + 1];
    return { start, end, kind: start >= day.availableEnd ? 'unknown' : day.gaps.some(x => overlap(start, end, x.start, x.end)) ? 'gap'
      : day.activity.some(x => overlap(start, end, x.start, x.end)) ? 'movement' : 'quiet' };
  }).filter(x => x.end > x.start);
}
