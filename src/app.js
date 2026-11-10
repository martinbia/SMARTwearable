import { VERSION, GOAL, time, activityScenarios, deviceScenarios, weeksFor } from './data.js';
import { createSession, addDays, weekDates, dateLabel, shortDate, weekLabel } from './calendar.js';
import { initialState, reduce, selectDay, selectWeek, selectWeeks, bestWeek } from './model.js';
import { icon, n, bar, range, pulseLine, activityTimeline } from './charts.js';
import { text } from './content.js';
import { emptyPreferences, completePreferences, readPreferences, writePreferences, clearPreferences } from './settings.js';

let state = initialState(createSession());
const settingsStorage = (() => { try { return window.localStorage; } catch { return null; } })();
let preferences = readPreferences(settingsStorage);
// Every fresh document load begins with the short introduction, then the required preferences.
let settingsMode = 'setup';
let settingsDraft = preferences ? { ...preferences } : emptyPreferences();
let settingsFocus = null;
let entryPage = true;
let entryCountdownTimer = null;
let entryDeadline = 0;
let stopMotionTimer = null;
let transferTimer;
let pendingUpdate;
let installPrompt;
let offlineReady = false;
const root = document.querySelector('#app');
const button = (label, action, cls = '', extra = '') => `<button type="button" class="${cls}" data-action="${action}" ${extra}>${label}</button>`;
const heading = (title, intro = '') => `<div class="page-heading"><h1 tabindex="-1">${title}</h1>${intro ? `<p class="intro">${intro}</p>` : ''}</div>`;
function dispatch(action, focusHeading = false) {
  if (['reset', 'device'].includes(action.type)) { clearTimeout(transferTimer); transferTimer = null; }
  state = reduce(state, action); render();
  if (focusHeading) { document.querySelector('h1')?.focus({ preventScroll: true }); window.scrollTo?.(0, 0); }
}
const weekAttributes = start => `data-week="${start}"`;
const dayAttributes = date => `data-date="${date}"`;
const years = (start, end = start) => start.slice(0, 4) === end.slice(0, 4) ? start.slice(0, 4) : `${start.slice(0, 4)}–${end.slice(0, 4)}`;
function compareRow(label, value, max, type, extra = '') {
  return `<div class="comparison-row"><span class="comparison-label">${label}</span><div class="comparison-track ${type}">${value == null ? '' : `<span class="horizontal-bar" style="width:${value / max * 100}%"></span>`}${extra}</div><strong class="comparison-value">${n(value)}${value == null ? '' : ' min'}</strong></div>`;
}
function homeView() {
  const week = selectWeek(state, state.session.monday);
  const best = bestWeek(state);
  const max = Math.ceil(Math.max(120, week.movement || 0, best?.movement || 0, GOAL.upper) / 20) * 20;
  return `<section class="home-activity" aria-labelledby="activity-title"><div class="section-heading"><h1 id="activity-title" tabindex="-1">${icon('activity')} Aktivität diese Woche</h1><p class="week-caption">${weekLabel(state.session.monday)} · bisher</p></div><a class="comparison-link" href="#current-week" data-action="currentWeek" aria-label="Aktivität dieser Woche nach Tagen öffnen"><div class="comparison" data-testid="weekly-comparison">${compareRow('Diese Woche bisher', week.movement, max, 'current')}${compareRow('Mein Wochenziel', GOAL.target, max, 'goal', `<span class="tolerance" style="left:${GOAL.lower / max * 100}%;width:${(GOAL.upper - GOAL.lower) / max * 100}%"></span><span class="goal-marker" style="left:${GOAL.target / max * 100}%"></span>`)}${compareRow('Meine aktivste Woche', best?.movement ?? null, max, 'best')}<div class="comparison-axis" aria-hidden="true"><span></span><div>${Array.from({ length: 7 }, (_, i) => `<span style="left:${i / 6 * 100}%">${Math.round(max / 6 * i)}</span>`).join('')}</div><span></span></div></div></a><div class="home-summary"><p>Bewegungsminuten · Zielbereich ${GOAL.lower}–${GOAL.upper} min (fiktives Beispiel)</p><p>Woche noch nicht abgeschlossen${week.incomplete ? ' · Daten unvollständig' : ''}</p></div><span class="sr-only" data-testid="week-minutes">${n(week.movement)}</span></section><nav class="home-actions" aria-label="Aktivitätsdetails und Armband">${button('Woche nach Tagen →', 'currentWeek', 'primary')}${button('Wochen vergleichen →', 'weeks', 'primary')}${button('Mein Armband', 'device', 'secondary')}</nav>`;
}
const preferenceDetails = {
  pulseAlerts: { title: 'Pulshinweise', question: 'Möchten Sie einen Hinweis erhalten, wenn Ihr Puls ungewöhnlich hoch oder niedrig ist?', yes: 'Ja, Pulshinweise erhalten', no: 'Nein, keine Pulshinweise erhalten', status: value => value ? 'Ein' : 'Aus' },
  activityReminder: { title: 'Aktivitätserinnerung', question: 'Möchten Sie, dass das Armband vibriert, wenn Sie sich längere Zeit wenig bewegt haben?', yes: 'Ja, durch Vibration erinnern', no: 'Nein, keine Vibration', status: value => value ? 'Ein' : 'Aus' },
  shareWithCareTeam: { title: 'Datenfreigabe', question: 'Möchten Sie Ihre Informationen nur selbst sehen oder auch Gesundheitsfachpersonen zugänglich machen?', yes: 'Auch meine Gesundheitsfachpersonen', no: 'Nur ich', status: value => value ? 'Auch Fachpersonen' : 'Nur ich' }
};
function preferenceShortcut(key) {
  const item = preferenceDetails[key];
  return button(`<span>${item.title}</span><strong>${item.status(preferences[key])}</strong>`, 'openPreference', 'preference-shortcut', `data-preference-key="${key}" aria-label="${item.title}: ${item.status(preferences[key])}. Einstellung ändern"`);
}
function preferenceGroup(key) {
  const item = preferenceDetails[key];
  const selected = settingsDraft[key];
  const option = (value, label) => `<label class="preference-option"><input type="radio" name="${key}" value="${value}" data-preference="${key}" ${selected === value ? 'checked' : ''}><span>${label}</span></label>`;
  return `<fieldset class="preference-group" data-setting-group="${key}" tabindex="-1"><legend>${item.title}</legend><p>${item.question}</p><div class="preference-options">${option(true, item.yes)}${option(false, item.no)}</div></fieldset>`;
}
function stopMotionIntro({ animate = false, label = 'Armband anlegen' } = {}) {
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const playing = animate && !reducedMotion;
  const steps = [
    ['frame-01.png', 'Geöffnetes Armband in den Händen', 212],
    ['frame-02.png', 'Sensorgehäuse auf dem Handgelenk positionieren', 192],
    ['frame-03.png', 'Band um das Handgelenk führen', 179],
    ['frame-04.png', 'Verschluss schliessen', 187],
    ['frame-05.png', 'Sitz des angelegten Armbands kontrollieren', 186],
    ['frame-06.png', 'Fertig angelegtes Armband und Daumen hoch', 196]
  ];
  const frames = steps.map(([src, label, width], index) => `<figure class="stop-motion-frame ${playing && index === 0 ? 'is-active' : ''}" data-frame-index="${index}" role="group" aria-label="Schritt ${index + 1} von 6: ${label}"><img src="./images/initial-setup/${src}" alt="" loading="eager" decoding="async" width="${width}" height="150" ${playing && index === 0 ? 'aria-current="step"' : ''}></figure>`).join('');
  return `<div class="setup-visual stop-motion" data-animation-state="${playing ? 'playing' : 'complete'}" data-active-frame="${playing ? '0' : ''}" role="group" aria-label="${label} – sechs Bildschritte. Die Illustration zeigt nur das Mock-up, keine echte Verbindung."><div class="stop-motion-strip">${frames}</div></div>`;
}
function stopSetupAnimation() {
  window.clearTimeout(stopMotionTimer);
  stopMotionTimer = null;
}
function startSetupAnimation(container) {
  stopSetupAnimation();
  const frames = [...(container?.querySelectorAll('.stop-motion-frame') ?? [])];
  if (!frames.length || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  container.dataset.animationState = 'playing';
  let activeIndex = 0;
  const activate = index => {
    frames.forEach((frame, frameIndex) => {
      const active = frameIndex === index;
      frame.classList.toggle('is-active', active);
      if (active) frame.querySelector('img')?.setAttribute('aria-current', 'step');
      else frame.querySelector('img')?.removeAttribute('aria-current');
    });
    container.dataset.activeFrame = String(index);
  };
  activate(activeIndex);
  const advance = () => {
    activeIndex += 1;
    if (activeIndex < frames.length) {
      activate(activeIndex);
      stopMotionTimer = window.setTimeout(advance, 700);
    } else {
      container.dataset.animationState = 'complete';
      stopMotionTimer = null;
    }
  };
  stopMotionTimer = window.setTimeout(advance, 700);
}
function clearEntryCountdown() {
  window.clearTimeout(entryCountdownTimer);
  entryCountdownTimer = null;
}
function startEntryCountdown() {
  if (entryCountdownTimer !== null || !entryPage) return;
  entryDeadline = performance.now() + 20000;
  const tick = () => {
    if (!entryPage) return;
    const remaining = Math.max(0, Math.ceil((entryDeadline - performance.now()) / 1000));
    const status = root.querySelector('[data-testid="entry-countdown"]');
    if (status) status.textContent = remaining ? `Automatischer Wechsel in ${remaining} s` : 'Einstellungen werden geöffnet …';
    if (remaining === 0) { openEntrySettings(); return; }
    entryCountdownTimer = window.setTimeout(tick, 1000);
  };
  tick();
}
function openEntrySettings() {
  if (!entryPage) return;
  entryPage = false;
  clearEntryCountdown();
  stopSetupAnimation();
  render();
}
function braceletGallery() {
  return `<details class="bracelet-gallery"><summary>Armband in sechs Bildern ansehen</summary>${stopMotionIntro({ label: 'Anlegefolge' })}</details>`;
}
function entryView() {
  return `<div class="entry-shell"><header class="entry-brand"><span class="entry-wordmark">${icon('pulse')}<strong>SMARTwearable</strong></span><span class="entry-demo-tag">Beispieldaten</span></header><main id="main" class="entry-main"><h1 tabindex="-1">Gut vorbereitet mit Ihrem Armband</h1>${stopMotionIntro({ animate: true, label: 'Armband anlegen' })}<section class="entry-features" aria-label="Informationen zum Armband"><article class="entry-feature"><span class="entry-feature-icon" aria-hidden="true"><svg viewBox="0 0 48 48"><path d="M24 5C20 13 11 22 11 30a13 13 0 0 0 26 0c0-8-9-17-13-25Z"/><path d="M7 39c4-3 8-3 12 0s8 3 12 0 8-3 12 0"/></svg></span><div><h2>Wasserdicht</h2><p>Sie können das Armband auch beim Duschen tragen.</p></div></article><article class="entry-feature"><span class="entry-feature-icon" aria-hidden="true"><svg viewBox="0 0 48 48"><rect x="8" y="12" width="32" height="29" rx="4"/><path d="M16 7v10m16-10v10M8 21h32M17 30l5 5 10-11"/></svg></span><div><h2>Möglichst den ganzen Tag tragen</h2><p>So erhalten Sie ein vollständigeres Bild Ihrer Aktivitäten im Alltag.</p></div></article></section><p class="entry-disclaimer">Die Angaben sind nicht als Produkteigenschaften oder medizinische Empfehlung bestätigt.</p><button type="button" class="primary entry-cta" data-action="openSetup">Einstellungen öffnen <span aria-hidden="true">→</span></button><p class="entry-countdown" data-testid="entry-countdown" role="timer" aria-live="off">Automatischer Wechsel in 20 s</p></main></div>`;
}
function preferencesView() {
  const setup = settingsMode === 'setup';
  const selectedCount = Object.values(settingsDraft).filter(value => typeof value === 'boolean').length;
  const status = selectedCount === 3 ? 'Alle drei Einstellungen ausgewählt.' : `Bitte wählen Sie noch ${3 - selectedCount} ${3 - selectedCount === 1 ? 'Einstellung' : 'Einstellungen'} aus.`;
  const back = setup ? '<span class="setup-step">Ersteinrichtung</span>' : button('← Startseite', 'cancelSettings', 'home-button');
  const braceletImage = `<img class="settings-bracelet-image" src="./images/initial-setup/frame-05.png" alt="Illustration eines angelegten Armbands" width="186" height="150">`;
  return `<div class="settings-shell"><main id="main" class="settings-main"><header class="settings-top"><div class="settings-heading">${braceletImage}<div class="settings-heading-copy"><div class="settings-title-row">${back}<h1 tabindex="-1">Ihr Armband – Ihre Einstellungen</h1></div><p class="settings-intro">Wählen Sie Ihre Hinweise und wer die Informationen sehen darf. Sie können die Auswahl später ändern.</p>${braceletGallery()}</div></div></header><form id="preferences-form" class="settings-form" novalidate>${preferenceGroup('pulseAlerts')}${preferenceGroup('activityReminder')}${preferenceGroup('shareWithCareTeam')}<div class="settings-submit"><p class="settings-demo">Demo mit Beispieldaten – keine echten Warnungen, Vibrationen oder Datenübertragungen.</p><p id="settings-status" role="status">${status}</p>${button(setup ? 'Einstellungen übernehmen und weiter' : 'Änderungen übernehmen', 'savePreferences', 'primary', `id="preferences-submit" ${selectedCount < 3 ? 'disabled' : ''}`)}</div></form></main></div>`;
}
function metricCell(day, kind, max) {
  let inner;
  if (day.future) inner = '<span class="empty-data">Noch nicht</span>';
  else if (!day.hasData) inner = '<span class="empty-data">Keine Daten</span>';
  else if (kind === 'activity') inner = bar(day.movement, max);
  else if (kind === 'steps') inner = bar(day.steps, max);
  else if (kind === 'pulse') inner = range(day);
  else inner = `<span class="category-value">● ${n(day.pulseSteps.mean)}</span><span class="category-value">◆ ${n(day.pulseOther.mean)}</span>`;
  const measurement = day.future ? 'Noch nicht' : !day.hasData ? 'Keine Daten' : kind === 'activity' ? `Aktivität ${n(day.movement)} Minuten` : kind === 'steps' ? `${n(day.steps)} Schritte` : kind === 'pulse' ? `Puls ${n(day.pulseMin)} bis ${n(day.pulseMax)}, Mittel ${n(day.pulseMean)}` : `Puls bei Schritten ${n(day.pulseSteps.mean)}, sonstiger Bewegung ${n(day.pulseOther.mean)}`;
  return button(inner, 'date', `matrix-cell ${day.today ? 'today-cell' : ''} ${day.incomplete ? 'has-gap' : ''}`, `${dayAttributes(day.date)} ${day.future ? 'disabled' : ''} aria-label="${dateLabel(day.date)}: ${measurement}${day.incomplete ? ', Daten unvollständig' : ''} – Tagesdetails"`);
}
function labelBlock(title, kind, unit, legend = '', limits = null) {
  return `<div class="matrix-label"><div class="metric-label-text"><h2>${icon(kind)} ${title}</h2><p>${unit}</p>${legend ? `<small>${legend}</small>` : ''}</div>${limits ? `<div class="scale-axis" aria-hidden="true">${[limits[1], (limits[0] + limits[1]) / 2, limits[0]].map((value, i) => `<span style="top:${i * 50}%">${n(value)}</span>`).join('')}</div>` : ''}</div>`;
}
function gapNotes(days) {
  const gaps = days.flatMap(d => d.gaps.map(g => `${dateLabel(d.date, { weekday: 'short', month: undefined })} ${time(g.start)}–${time(g.end)} Uhr: ${g.reason === 'not_worn_demo' ? 'nicht getragen (Demo)' : 'Messsignal fehlt (Demo)'}`));
  return gaps.length ? `<details class="gap-notes"><summary>Datenlücke: ${gaps.length} Zeitraum${gaps.length === 1 ? '' : 'e'} – Hinweise</summary><p>${gaps.join('; ')}. Keine Aussage über Bewegung während der Datenlücke.</p></details>` : '';
}
function compactDay(day) {
  return button(`<strong>${dateLabel(day.date, { weekday: 'short' })}${day.today ? ' · Heute bisher' : ''}</strong>${day.future ? '<span>Noch nicht</span>' : !day.hasData ? '<span>Keine Daten</span>' : `<span>Aktivität ${day.movement} min · ${n(day.steps)} Schritte</span><span>Puls ${day.pulseMin}–${day.pulseMax} · Ø ${day.pulseMean} Schläge/min</span><span>Bei Schritten Ø ${n(day.pulseSteps.mean)} · sonstiger Bewegung Ø ${n(day.pulseOther.mean)}</span>`}${day.incomplete ? '<span>Daten unvollständig</span>' : ''}`, 'date', 'day-card', `${dayAttributes(day.date)} ${day.future ? 'disabled' : ''}`);
}
function weekView() {
  const week = selectWeek(state);
  const dayMax = Math.max(30, ...week.days.map(d => d.movement || 0));
  const stepMax = Math.ceil(Math.max(1500, ...week.days.map(d => d.steps || 0)) / 500) * 500;
  return `<div class="detail-meta"><p>${years(week.start, addDays(week.start, 6))} · ${week.current ? 'Aktuelle Woche · bisher' : 'Abgeschlossene Woche'} · ${n(week.movement)} Bewegungsminuten${week.incomplete ? ' · Daten unvollständig' : ''}</p><p>Tag antippen: Tagesverlauf</p></div><div class="matrix daily-matrix"><div class="matrix-row column-heads"><span></span>${week.days.map(d => button(`${dateLabel(d.date, { weekday: 'short', month: undefined })}${d.today ? '<small>Heute bisher</small>' : ''}`, 'date', `column-head ${d.today ? 'today-cell' : ''}`, `${dayAttributes(d.date)} ${d.future ? 'disabled' : ''}`)).join('')}</div><section class="matrix-row bar-row">${labelBlock('Aktivität', 'activity', 'Minuten', '', [0, dayMax])}${week.days.map(d => metricCell(d, 'activity', dayMax)).join('')}</section><section class="matrix-row bar-row">${labelBlock('Schritte', 'steps', 'Anzahl', '', [0, stepMax])}${week.days.map(d => metricCell(d, 'steps', stepMax)).join('')}</section><section class="matrix-row pulse-row">${labelBlock('Puls', 'pulse', 'Min–Max · Ø', 'Schläge/min', [50, 120])}${week.days.map(d => metricCell(d, 'pulse')).join('')}</section><section class="matrix-row category-row">${labelBlock('Puls bei Bewegung', 'pulse', 'Ø Schläge/min', '● Schritte<br>◆ Sonstige')}${week.days.map(d => metricCell(d, 'category')).join('')}</section></div><div class="mobile-cards">${week.days.map(compactDay).join('')}</div>${gapNotes(week.days)}`;
}
function compactWeek(week) {
  return button(`<strong>${weekLabel(week.start)}${week.current ? ' · Aktuell bisher' : ''}</strong><span>${n(week.movement)} Bewegungsminuten · ${n(week.steps)} Schritte</span><span>Puls ${n(week.pulseMin)}–${n(week.pulseMax)} Schläge/min</span>${week.incomplete ? '<span>Daten unvollständig</span>' : ''}<span>Woche nach Tagen öffnen →</span>`, 'selectWeek', 'day-card', weekAttributes(week.start));
}
function weeksView() {
  const weeks = selectWeeks(state);
  const best = bestWeek(state);
  const max = Math.ceil(Math.max(GOAL.upper, ...weeks.map(w => w.movement || 0)) / 20) * 20;
  const stepMax = Math.ceil(Math.max(6000, ...weeks.map(w => w.steps || 0)) / 1000) * 1000;
  const cell = (w, kind) => button((kind === 'activity' ? bar(w.movement, max, { goal: true, best: best?.start === w.start }) : kind === 'steps' ? bar(w.steps, stepMax) : range(w)), 'selectWeek', `matrix-cell ${w.current ? 'today-cell' : ''} ${w.incomplete ? 'has-gap' : ''}`, `${weekAttributes(w.start)} aria-label="Woche ${weekLabel(w.start)}: ${kind === 'activity' ? `${n(w.movement)} Bewegungsminuten` : kind === 'steps' ? `${n(w.steps)} Schritte` : `Puls ${n(w.pulseMin)} bis ${n(w.pulseMax)}`}${w.incomplete ? ', Daten unvollständig' : ''} – nach Tagen öffnen"`);
  return `<div class="detail-meta"><p>${shortDate(weeks[0].start)}–${shortDate(addDays(state.session.monday, 6))} · ${years(weeks[0].start, addDays(state.session.monday, 6))} · Beispieldaten</p><p class="goal-key">Ziel ${GOAL.target} · Bereich ${GOAL.lower}–${GOAL.upper} min (Demo)</p></div><div class="matrix weeks-matrix"><div class="matrix-row column-heads"><span></span>${weeks.map(w => button(`${weekLabel(w.start)}${w.current ? '<small>Aktuell · bisher</small>' : ''}`, 'selectWeek', `column-head ${w.current ? 'today-cell' : ''}`, weekAttributes(w.start))).join('')}</div><section class="matrix-row bar-row">${labelBlock('Aktivität', 'activity', 'Minuten', '', [0, max])}${weeks.map(w => cell(w, 'activity')).join('')}</section><section class="matrix-row bar-row">${labelBlock('Schritte', 'steps', 'Anzahl', '', [0, stepMax])}${weeks.map(w => cell(w, 'steps')).join('')}</section><section class="matrix-row pulse-row">${labelBlock('Puls', 'pulse', 'Min–Max · Ø', 'Schläge/min', [50, 120])}${weeks.map(w => cell(w, 'pulse')).join('')}</section></div><div class="mobile-cards">${weeks.map(compactWeek).join('')}</div>`;
}
function dayView() {
  const day = selectDay(state);
  return `<div class="detail-meta"><p>${years(day.date)} · ${day.today ? 'Heute · bisher' : 'Tagesdetails'} · Daten bis ${time(day.availableEnd)} · Beispieldaten</p><p>Aktivität <strong data-testid="day-minutes">${n(day.movement)}</strong> min · Schritte ${n(day.steps)}</p></div><section class="day-chart activity-chart"><h2>${icon('activity')} Aktivität im Tagesverlauf</h2>${activityTimeline(day)}<p class="chart-caption">Gefüllt: Schrittbewegung · schraffiert: sonstige Bewegung · Bewegungsart geschätzt (Demo)</p></section><section class="day-chart pulse-chart"><h2>${icon('pulse')} Puls im Tagesverlauf</h2>${pulseLine(day)}<p class="pulse-summary">Minimum ${n(day.pulseMin)} · Maximum ${n(day.pulseMax)} · Tagesmittel ${n(day.pulseMean)} Schläge/min</p><div class="pulse-categories"><p>● Bei Schritten: Ø ${n(day.pulseSteps.mean)}</p><p>◆ Bei sonstiger Bewegung: Ø ${n(day.pulseOther.mean)} Schläge/min</p></div></section>${gapNotes([day])}<details class="more-details"><summary>Weitere Angaben: Hauttemperatur, Strecke, Messwerte</summary><div class="extra-data"><h2>Hauttemperatur</h2><p>${day.temperature.length ? `${n(day.temperature.at(-1).value)} °C · letzter simulierter Wert ${time(day.temperature.at(-1).t)} Uhr` : 'Keine verfügbaren Messwerte'}</p><p>Hauttemperatur ist keine Körperkerntemperatur.</p><h2>Schritte und Strecke</h2><p>${n(day.steps)} Schritte · geschätzte Strecke ${n(day.distance)}${day.distance == null ? '' : ' m'}. Fiktive Schrittlänge, keine individuell validierte Messung.</p><h2>Bewegungsabschnitte</h2>${day.activity.map(a => `<p>${time(a.start)}–${time(a.end)} Uhr · ${a.end - a.start} min · ${a.kind === 'steps' ? 'Schrittbewegung' : 'Sonstige Bewegung'} (geschätzt, Demo)</p>`).join('') || '<p>Keine erfassten Bewegungsabschnitte.</p>'}<p>Messabdeckung: ${day.covered} von ${day.coverageTotal} Minuten. Datenlücken sind keine Ruhephasen.</p><h2>Puls-Einzelwerte und Herkunft</h2><p>Simulierte Messwerte je Minute. Kategorie = hypothetisch erkannte Bewegungsart.</p><div class="sample-table"><table><thead><tr><th>Uhrzeit</th><th>Schläge/min</th><th>Bewegungsart</th></tr></thead><tbody>${day.pulse.map(p => `<tr><td>${time(p.t)}</td><td>${p.value}</td><td>${p.kind === 'steps' ? 'Schritte' : p.kind === 'other' ? 'Sonstige Bewegung' : 'Bewegungsarm'}</td></tr>`).join('')}</tbody></table></div></div></details>`;
}
function detailToolbar() {
  const starts = weeksFor(state.session);
  const title = state.view === 'weeks' ? 'Meine Wochen im Vergleich' : state.view === 'week' ? `${weekLabel(state.week)} nach Tagen` : `${dateLabel(state.date, { month: 'short' })}${state.date === state.session.today ? ' · bisher' : ''}`;
  const back = state.view === 'week' ? button('← Vergleich', 'weeks', 'secondary') : state.view === 'day' ? button('← Zur Woche', 'back', 'secondary') : '';
  const arrows = state.view === 'week' ? `<nav class="week-arrows" aria-label="Woche wechseln">${button('‹', 'previousWeek', 'secondary', `aria-label="Vorige Woche" title="Vorige Woche" ${state.week === starts[0] ? 'disabled' : ''}`)}${button('›', 'nextWeek', 'secondary', `aria-label="Nächste Woche" title="Nächste Woche" ${state.week === state.session.monday ? 'disabled' : ''}`)}</nav>` : '';
  return `<header class="detail-toolbar"><nav class="detail-back" aria-label="Zurück">${button('← Startseite', 'home', 'home-button')}${back}</nav><h1 tabindex="-1">${title}</h1>${arrows}${button(`Armband-Akku ${state.device.battery} %`, 'device', 'status-button')}${button(icon('info'), 'info', 'info-button', 'aria-label="Info zu den Beispieldaten" title="Info"')}</header>`;
}
function deviceView() {
  const d = state.device;
  return heading('Mein Armband', 'Gerätestatus · ausschliesslich simuliert') + `<div class="detail-grid"><section class="panel"><h2>Armband-Akku</h2><p class="detail-value">${d.battery} %</p><p>${d.charging ? 'Wird geladen (Demo)' : 'Nicht am Ladegerät (Demo)'}</p><p>Geschätzte Restlaufzeit: <strong>${d.runtime == null ? 'noch nicht abschätzbar' : `etwa ${d.runtime} Stunden`}</strong></p>${d.battery <= 15 ? '<p class="notice">Bitte heute laden.</p>' : ''}<p class="muted">Fiktiver Betriebsmodus, kein reales Akkumodell.</p></section><section class="panel"><h2>Verbindung</h2><p class="detail-value">${d.connected ? 'Verbunden' : 'Nicht verbunden'}</p><p>${d.connected ? 'Verbindung zum Tablet (Demo).' : 'Zeichnet auf dem Armband weiter auf (Demo).'}</p></section><section class="panel wide"><h2>Ihre Daten</h2><p class="notice">${text.transfer[d.transfer]}</p><dl><dt>Letzte erfolgreiche Übertragung</dt><dd>Heute ${time(d.lastTransfer)} Uhr</dd><dt>Daten verfügbar bis</dt><dd>Heute ${time(d.dataThrough)} Uhr</dd><dt>Nächste Übertragung geplant</dt><dd>Heute ${time(d.nextTransfer)} Uhr</dd><dt>Noch auf dem Armband</dt><dd>${d.pendingFrom != null ? `${time(d.pendingFrom)}–${time(d.pendingTo)} Uhr (Demo)` : 'Keine ausstehenden Daten (Demo)'}</dd></dl><details><summary>Speicher und Übertragungsbedarf</summary><p>Verbleibende Speicherzeit: ${d.storage == null ? 'noch nicht abschätzbar' : `geschätzt ${d.storage} Stunden`}.</p>${d.storage === 4 ? '<p>Bitte innerhalb von vier Stunden übertragen, damit der Speicher nicht voll wird (Demo).</p>' : ''}<p>Ladebedarf und Übertragungsbedarf sind unabhängig.</p></details></section></div>`;
}
function select(label, action, items, value) {
  return `<label>${label}<select data-change="${action}">${Object.entries(items).map(([id, name]) => `<option value="${id}" ${id === value ? 'selected' : ''}>${id}: ${name}</option>`).join('')}</select></label>`;
}
function controlsView() {
  return heading('Interviewsteuerung', 'Alle Aktionen ändern ausschliesslich die fiktiven Daten dieser Sitzung.') + `<section class="panel control-grid">${select('Aktivitätsszenario', 'scenario', activityScenarios, state.scenario)}${select('Gerätezustand', 'device', deviceScenarios, state.deviceScenario)}${select('Grund bei S03-Datenlücke', 'gapReason', { no_signal: 'Messsignal fehlt', not_worn_demo: 'Nicht getragen (Demo)' }, state.gapReason)}<p>Sitzungsdatum: ${dateLabel(state.session.today, { year: 'numeric' })} · Datenstand beim Appstart ${time(state.session.dataMinute)} Uhr. Daten sind erfunden.</p><div class="action-row">${button(text.actions.transfer, 'transfer', 'secondary', transferTimer ? 'disabled' : '')}${button(state.device.charging ? text.actions.chargeEnd : text.actions.charge, state.device.charging ? 'chargeEnd' : 'chargeStart', 'secondary')}</div><p role="status">${text.transfer[state.device.transfer]} · ${state.device.charging ? 'Wird geladen' : `Armband-Akku ${state.device.battery} %`}</p><hr><h2>Neues Interview</h2><p>Demo-Reset stellt C2, aktuelle Woche und S01/G01 wieder her. Der Zeitanker vom Appstart bleibt erhalten.</p>${button('Demo zurücksetzen', 'reset', 'secondary')}<p>Version ${VERSION} · C2 / D1 / W2 · Tablet-Abnahme noch offen.</p><h2>Ersteinrichtung</h2><p>Startet den verpflichtenden Einstellungsablauf erneut. Die fiktiven Aktivitäts- und Geräteszenarien bleiben unverändert.</p>${button('Ersteinrichtung zurücksetzen', 'resetPreferences', 'secondary')}<h2>Installation und Offline-Nutzung</h2><p>${offlineReady ? 'Offline vorbereitet.' : 'Offline-Vorbereitung noch nicht bestätigt. Zuerst mit Internet vollständig öffnen.'}</p>${installPrompt ? button('PWA installieren', 'install', 'primary') : '<p>Installation über das Browsermenü, falls angeboten.</p>'}</section>`;
}
function infoView() {
  return heading('Über diese Demo') + `<section class="panel"><p>SMARTwearable zeigt ausschliesslich erfundene Beispieldaten. Das angelegte Armband ist nicht technisch verbunden.</p><p>Allgemeine Aktivität umfasst Schrittbewegung und sonstige Bewegung. Die Zuordnung ist eine hypothetische Auswertung, keine bestätigte Sensorfähigkeit.</p><p>Das lokale Datum des Tablets wird beim Appstart übernommen. Bewegungsdaten, Puls, Zielbereich und Gerätestatus bleiben simuliert. Es werden keine Interviewantworten gespeichert.</p><p>Die drei Einstellungen sind nur Präferenzen für das Mock-up und werden lokal in diesem Browser gespeichert. Es erfolgen keine echten Warnungen, Vibrationen oder Datenfreigaben.</p><p>Der Zielbereich ist ein Beispiel, keine medizinische Belastungsvorgabe. Puls wird neutral angezeigt, ohne Leistungsziel.</p><p>Version ${VERSION}. Ein neuer Appstart liest Datum und Uhrzeit neu; die laufende Sitzung bleibt zeitlich unverändert.</p></section>`;
}
function render() {
  stopSetupAnimation();
  if (entryPage) {
    if (root.querySelector('.entry-shell')) return;
    root.innerHTML = entryView();
    startSetupAnimation(root.querySelector('.stop-motion'));
    startEntryCountdown();
    return;
  }
  if (settingsMode) {
    root.innerHTML = preferencesView();
    const focusTarget = settingsFocus ? root.querySelector(`[data-setting-group="${settingsFocus}"]`) : root.querySelector('h1');
    settingsFocus = null;
    focusTarget?.focus({ preventScroll: false });
    return;
  }
  const views = { home: homeView, week: weekView, weeks: weeksView, day: dayView, device: deviceView, controls: controlsView, info: infoView };
  const status = button(icon('battery') + `<span>Armband-Akku ${state.device.battery} % · Daten bis ${time(state.device.dataThrough)}</span>`, 'device', 'status-button');
  const date = `<p class="date-label">${dateLabel(state.session.today, { year: 'numeric' })}</p>`;
  const update = pendingUpdate ? `<aside class="notice">Eine neue Version ist bereit. ${button('Neue Version laden', 'update', 'secondary')}</aside>` : '';
  if (state.view === 'home') {
    root.innerHTML = `<div class="compact-shell"><header class="compact-header">${button('<span class="brand-name">SMARTwearable</span><span> · Beispieldaten</span>' + icon('info'), 'info', 'info-button')}${status}</header>${date}${update}<main id="main" class="compact-main">${homeView()}</main><footer class="compact-footer"><p>Alle Werte fiktiv</p><nav class="preference-shortcuts" aria-label="Meine Einstellungen">${preferenceShortcut('pulseAlerts')}${preferenceShortcut('activityReminder')}${preferenceShortcut('shareWithCareTeam')}</nav><div class="compact-footer-links">${button('Info', 'info', 'text-button')}${button('Interviewsteuerung', 'controls', 'text-button')}</div></footer></div>`;
    return;
  }
  if (['week', 'weeks', 'day'].includes(state.view)) {
    const caption = state.view === 'weeks' ? 'Woche antippen: Tagesdetails · ◇ aktivste vollständige Woche · Aktuelle Woche läuft noch' : state.view === 'week' ? 'Puls: Linie Min–Max · Punkt Tagesmittel · ● Schritte / ◆ sonstige Bewegung' : 'Alle Messwerte und Bewegungsarten sind simuliert';
    root.innerHTML = `<div class="detail-shell detail-${state.view}">${detailToolbar()}${update}<main id="main" class="detail-main">${views[state.view]()}</main><footer class="detail-footer"><p>${caption}</p><p>Alle Werte fiktiv</p></footer></div>`;
    return;
  }
  root.innerHTML = `<header class="site-header"><span class="brand-name">SMARTwearable</span>${button('Beispieldaten ' + icon('info'), 'info', 'info-button')}</header><div class="app-shell"><div class="date-status">${date}${status}</div><nav class="home-nav" aria-label="Zur Startseite">${button('← Startseite', 'home', 'home-button')}</nav>${update}<main id="main">${views[state.view]()}</main><footer><p>Alle Werte sind fiktiv · keine echte Armbandverbindung.</p><div>${button(icon('device') + ' Mein Armband', 'device', 'text-button')}${button('Interviewsteuerung', 'controls', 'text-button')}</div></footer></div>`;
}
root.addEventListener('click', async event => {
  const target = event.target.closest('[data-action]');
  if (!target || target.disabled) return;
  const action = target.dataset.action;
  if (target.tagName === 'A') event.preventDefault();
  if (action === 'openSetup') { openEntrySettings(); return; }
  if (action === 'openPreference') {
    settingsMode = 'edit'; settingsDraft = { ...preferences }; settingsFocus = target.dataset.preferenceKey; render(); return;
  }
  if (action === 'cancelSettings') {
    settingsMode = null; settingsDraft = { ...preferences }; dispatch({ type: 'navigate', view: 'home' }, true); return;
  }
  if (action === 'savePreferences') {
    if (!completePreferences(settingsDraft)) { announce('Bitte beantworten Sie alle drei Einstellungen.'); return; }
    if (!writePreferences(settingsStorage, settingsDraft)) { const node = document.querySelector('#settings-status'); if (node) node.textContent = 'Die Einstellungen konnten auf diesem Gerät nicht dauerhaft gespeichert werden. Bitte erneut versuchen.'; announce('Einstellungen konnten nicht gespeichert werden.'); return; }
    preferences = { ...settingsDraft }; settingsMode = null; settingsDraft = { ...preferences }; dispatch({ type: 'navigate', view: 'home' }, true); announce('Einstellungen gespeichert.'); return;
  }
  if (action === 'resetPreferences') {
    if (window.confirm('Gespeicherte Präferenzen löschen und die Ersteinrichtung erneut starten?')) {
      if (!clearPreferences(settingsStorage)) { announce('Einstellungen konnten nicht zurückgesetzt werden.'); return; }
      preferences = null; settingsDraft = emptyPreferences(); settingsMode = 'setup'; render(); announce('Ersteinrichtung zurückgesetzt.');
    }
    return;
  }
  if (['home', 'weeks', 'device', 'controls', 'info'].includes(action)) dispatch({ type: 'navigate', view: action }, true);
  else if (action === 'currentWeek') dispatch({ type: 'week', week: state.session.monday }, true);
  else if (action === 'selectWeek') dispatch({ type: 'week', week: target.dataset.week }, true);
  else if (action === 'date') dispatch({ type: 'date', date: target.dataset.date }, true);
  else if (action === 'today') dispatch({ type: 'date', date: state.session.today }, true);
  else if (action === 'previousWeek' || action === 'nextWeek') dispatch({ type: 'weekShift', amount: action === 'previousWeek' ? -1 : 1 }, true);
  else if (action === 'back') dispatch({ type: 'back' }, true);
  else if (action === 'reset' && window.confirm('Demo auf Anfang zurücksetzen?')) { dispatch({ type: 'reset' }, true); announce('Demo zurückgesetzt.'); }
  else if (action === 'transfer') {
    clearTimeout(transferTimer);
    transferTimer = setTimeout(() => { transferTimer = null; dispatch({ type: 'transferEnd' }); announce(text.transfer[state.device.transfer]); }, 1200);
    dispatch({ type: 'transferStart' }); announce('Datenübertragung wird simuliert.');
  } else if (action === 'chargeStart' || action === 'chargeEnd') { dispatch({ type: action }); announce('Ladezustand simuliert.'); }
  else if (action === 'install' && installPrompt) { await installPrompt.prompt(); installPrompt = null; render(); }
  else if (action === 'update') pendingUpdate?.postMessage('ACTIVATE_UPDATE');
});
root.addEventListener('change', event => {
  const preference = event.target.dataset.preference;
  if (preference && Object.hasOwn(settingsDraft, preference)) {
    settingsDraft[preference] = event.target.value === 'true';
    const selectedCount = Object.values(settingsDraft).filter(value => typeof value === 'boolean').length;
    const submit = document.querySelector('#preferences-submit');
    const status = document.querySelector('#settings-status');
    if (submit) submit.disabled = selectedCount < 3;
    if (status) status.textContent = selectedCount === 3 ? 'Alle drei Einstellungen ausgewählt.' : `Bitte wählen Sie noch ${3 - selectedCount} ${3 - selectedCount === 1 ? 'Einstellung' : 'Einstellungen'} aus.`;
    return;
  }
  const action = event.target.dataset.change;
  if (!action) return;
  dispatch({ type: action, value: event.target.value });
  document.querySelector(`[data-change="${action}"]`)?.focus(); announce('Demo-Einstellung geändert.');
});
function announce(message) { document.querySelector('#announcement').textContent = message; }
window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); installPrompt = event; if (state.view === 'controls') render(); });
render();
if ('serviceWorker' in navigator) {
  let reloading = false;
  let acceptedUpdate = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (acceptedUpdate && !reloading) { reloading = true; location.reload(); }
  });
  root.addEventListener('click', event => { if (event.target.closest('[data-action="update"]')) acceptedUpdate = true; });
  navigator.serviceWorker.register('./sw.js', { scope: './' }).then(async registration => {
    const showWaiting = () => {
      if (registration.waiting && navigator.serviceWorker.controller) { pendingUpdate = registration.waiting; render(); }
    };
    showWaiting();
    registration.addEventListener('updatefound', () => registration.installing?.addEventListener('statechange', showWaiting));
    await navigator.serviceWorker.ready; offlineReady = true;
    if (state.view === 'controls') render();
  }).catch(() => { offlineReady = false; announce('Offline-Vorbereitung nicht verfügbar. Bitte mit Internet verwenden.'); });
}
