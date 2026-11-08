import { createSession, addDays, monday, weekDates } from './calendar.js';
import { rawDay, getDevice, weeksFor, activityScenarios, deviceScenarios } from './data.js';
export const initialState = (session = createSession()) => ({ session, view: 'home', date: session.today,
  week: session.monday, scenario: 'S01', deviceScenario: 'G01', device: getDevice(session), gapReason: 'no_signal', previousView: 'week' });
export function reduce(state, action) {
  switch (action.type) {
    case 'reset': return initialState(state.session);
    case 'navigate': return { ...state, view: action.view, ...(action.view === 'week' ? { week: state.session.monday } : {}) };
    case 'week': return weeksFor(state.session).includes(action.week) ? { ...state, week: action.week, view: 'week' } : state;
    case 'date': return action.date <= state.session.today && weeksFor(state.session).some(w => weekDates(w).includes(action.date))
      ? { ...state, date: action.date, week: monday(action.date), previousView: 'week', view: 'day' } : state;
    case 'weekShift': { const week = addDays(state.week, action.amount * 7); return weeksFor(state.session).includes(week) ? { ...state, week } : state; }
    case 'scenario': return activityScenarios[action.value] ? { ...state, scenario: action.value, date: state.session.today, week: state.session.monday } : state;
    case 'device': return deviceScenarios[action.value] ? { ...state, deviceScenario: action.value, device: getDevice(state.session, action.value) } : state;
    case 'gapReason': return ['no_signal', 'not_worn_demo'].includes(action.value) ? { ...state, gapReason: action.value } : state;
    case 'back': return { ...state, view: 'week' };
    case 'transferStart': return { ...state, device: { ...state.device, transfer: 'running' } };
    case 'transferEnd': return { ...state, device: state.deviceScenario === 'G07' ? { ...state.device, transfer: 'failed' }
      : { ...state.device, connected: true, transfer: 'current', dataThrough: state.session.dataMinute, lastTransfer: state.session.dataMinute, pendingFrom: null, pendingTo: null, storage: 72 } };
    case 'chargeStart': return { ...state, device: { ...state.device, charging: true, runtime: null } };
    case 'chargeEnd': return { ...state, device: { ...state.device, charging: false, battery: 100, runtime: 77 } };
    default: return state;
  }
}
export function pulseStats(samples) {
  if (!samples.length) return { min: null, max: null, mean: null };
  return { min: Math.min(...samples.map(p => p.value)), max: Math.max(...samples.map(p => p.value)), mean: Math.round(samples.reduce((sum, p) => sum + p.value, 0) / samples.length) };
}
export function selectDay(state, date = state.date) {
  const raw = rawDay(state.session, date, state.scenario, state.gapReason);
  const end = Math.max(raw.start, Math.min(raw.end, raw.today ? state.device.dataThrough : raw.end));
  const gaps = raw.gaps.map(g => ({ ...g, start: Math.max(raw.start, g.start), end: Math.min(end, g.end) })).filter(g => g.end > g.start);
  const valid = t => !raw.future && t >= raw.start && t < end && !gaps.some(g => t >= g.start && t < g.end);
  const activity = raw.activity.flatMap(a => {
    let parts = [{ ...a, start: Math.max(raw.start, a.start), end: Math.min(end, a.end) }].filter(a => a.end > a.start);
    for (const g of gaps) parts = parts.flatMap(a => g.end <= a.start || g.start >= a.end ? [a] : [
      { ...a, end: Math.min(g.start, a.end) }, { ...a, start: Math.max(g.end, a.start) }
    ].filter(a => a.end > a.start));
    return raw.future ? [] : parts;
  });
  const pulse = raw.pulse.filter(p => valid(p.t));
  const temperature = raw.temperature.filter(p => valid(p.t));
  const covered = raw.future ? 0 : end - raw.start - gaps.reduce((s, g) => s + g.end - g.start, 0);
  const hasData = covered > 0;
  const movement = hasData ? activity.reduce((s, a) => s + a.end - a.start, 0) : null;
  const steps = hasData ? raw.stepSamples.filter(p => valid(p.t)).reduce((s, p) => s + p.value, 0) : null;
  const stats = pulseStats(pulse);
  return { ...raw, activity, gaps, pulse, temperature, availableEnd: end, covered,
    hasData, movement, steps, distance: steps == null ? null : steps * 0.4,
    pulseMin: stats.min, pulseMax: stats.max, pulseMean: stats.mean,
    pulseSteps: pulseStats(pulse.filter(p => p.kind === 'steps')),
    pulseOther: pulseStats(pulse.filter(p => p.kind === 'other')),
    coverageTotal: raw.future ? 0 : raw.end - raw.start,
    count: hasData ? activity.length : null,
    quiet: hasData ? covered - movement : null,
    incomplete: !raw.future && (gaps.length > 0 || (raw.today && end < raw.end)) };
}
export function selectWeek(state, start = state.week) {
  const days = weekDates(start).map(date => selectDay(state, date));
  const available = days.filter(d => d.hasData);
  const pulse = available.flatMap(d => d.pulse);
  const stats = pulseStats(pulse);
  return { start, days, current: start === state.session.monday,
    movement: available.length ? available.reduce((sum, d) => sum + d.movement, 0) : null,
    steps: available.length ? available.reduce((sum, d) => sum + d.steps, 0) : null,
    pulseMin: stats.min, pulseMax: stats.max, pulseMean: stats.mean,
    pulseSteps: pulseStats(pulse.filter(p => p.kind === 'steps')),
    pulseOther: pulseStats(pulse.filter(p => p.kind === 'other')),
    incomplete: days.some(d => d.incomplete), complete: days.every(d => !d.future && d.hasData && !d.incomplete) && start < state.session.monday };
}
export const selectWeeks = state => weeksFor(state.session).map(start => selectWeek(state, start));
export function bestWeek(state) {
  return selectWeeks(state).filter(w => w.complete && w.movement != null).sort((a, b) => b.movement - a.movement)[0] ?? null;
}
