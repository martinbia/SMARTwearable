import { VERSION, GOAL, time, activityScenarios, deviceScenarios, weeksFor } from './data.js';
import { createSession, addDays, weekDates, dateLabel, shortDate, weekLabel } from './calendar.js';
import { initialState, reduce, selectDay, selectWeek, selectWeeks, bestWeek } from './model.js';
import { icon, n, bar, range, pulseLine } from './charts.js';
import { text } from './content.js';

let state = initialState(createSession());
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
function compareRow(label, value, max, type, extra = '') {
  return `<div class="comparison-row"><span class="comparison-label">${label}</span><div class="comparison-track ${type}">${value == null ? '' : `<span class="horizontal-bar" style="width:${value / max * 100}%"></span>`}${extra}</div><strong class="comparison-value">${n(value)}${value == null ? '' : ' min'}</strong></div>`;
}
function homeView() {
  const week = selectWeek(state, state.session.monday);
  const best = bestWeek(state);
  const max = Math.ceil(Math.max(120, week.movement || 0, best?.movement || 0, GOAL.upper) / 20) * 20;
  return `<section class="home-activity" aria-labelledby="activity-title"><div class="section-heading"><h1 id="activity-title" tabindex="-1">${icon('activity')} Aktivität diese Woche</h1><p class="week-caption">${weekLabel(state.session.monday)} · bisher</p></div><a class="comparison-link" href="#current-week" data-action="currentWeek" aria-label="Aktivität dieser Woche nach Tagen öffnen"><div class="comparison" data-testid="weekly-comparison">${compareRow('Diese Woche bisher', week.movement, max, 'current')}${compareRow('Mein Wochenziel', GOAL.target, max, 'goal', `<span class="tolerance" style="left:${GOAL.lower / max * 100}%;width:${(GOAL.upper - GOAL.lower) / max * 100}%"></span><span class="goal-marker" style="left:${GOAL.target / max * 100}%"></span>`)}${compareRow('Meine aktivste Woche', best?.movement ?? null, max, 'best')}<div class="comparison-axis" aria-hidden="true"><span></span><div>${Array.from({ length: 7 }, (_, i) => `<span style="left:${i / 6 * 100}%">${Math.round(max / 6 * i)}</span>`).join('')}</div><span></span></div></div></a><div class="home-summary"><p>Bewegungsminuten · Zielbereich ${GOAL.lower}–${GOAL.upper} min (fiktives Beispiel)</p><p>Woche noch nicht abgeschlossen${week.incomplete ? ' · Daten unvollständig' : ''}</p></div><span class="sr-only" data-testid="week-minutes">${n(week.movement)}</span></section><nav class="home-actions" aria-label="Aktivitätsdetails und Armband">${button('Woche nach Tagen →', 'currentWeek', 'primary')}${button('Wochen vergleichen →', 'weeks', 'primary')}${button('Mein Armband', 'device', 'secondary')}</nav>`;
}
function metricCell(day, kind, max) {
  let inner;
  if (day.future) inner = '<span class="empty-data">Noch nicht</span>';
  else if (!day.hasData) inner = '<span class="empty-data">Keine Daten</span>';
  else if (kind === 'activity') inner = bar(day.movement, max);
  else if (kind === 'steps') inner = bar(day.steps, max);
  else if (kind === 'pulse') inner = range(day);
  else inner = `<span class="category-value"><span aria-hidden="true">●</span> ${n(day.pulseSteps.mean)}</span><span class="category-value"><span aria-hidden="true">◆</span> ${n(day.pulseOther.mean)}</span>`;
  return button(inner + (day.incomplete ? '<span class="gap-tag">Daten unvollständig</span>' : '<span class="gap-tag" aria-hidden="true"></span>'), 'date', `matrix-cell ${day.today ? 'today-cell' : ''} ${day.incomplete ? 'has-gap' : ''}`, `${dayAttributes(day.date)} ${day.future ? 'disabled' : ''} aria-label="${dateLabel(day.date)}: ${kind === 'activity' ? `Aktivität ${n(day.movement)} Minuten` : kind === 'steps' ? `${n(day.steps)} Schritte` : kind === 'pulse' ? `Puls ${n(day.pulseMin)} bis ${n(day.pulseMax)}` : `Puls bei Schritten ${n(day.pulseSteps.mean)}, sonstiger Bewegung ${n(day.pulseOther.mean)}`} – Tagesdetails"`);
}
function labelBlock(title, kind, unit, legend = '') {
  return `<div class="matrix-label">${icon(kind)}<div><h2>${title}</h2><p>${unit}</p>${legend ? `<small>${legend}</small>` : ''}</div></div>`;
}
function compactDay(day) {
  return button(`<strong>${dateLabel(day.date, { weekday: 'short' })}${day.today ? ' · Heute bisher' : ''}</strong>${day.future ? '<span>Noch nicht</span>' : !day.hasData ? '<span>Keine Daten</span>' : `<span>Aktivität ${day.movement} min · ${n(day.steps)} Schritte</span><span>Puls ${day.pulseMin}–${day.pulseMax} · Ø ${day.pulseMean} Schläge/min</span><span>Bei Schritten Ø ${n(day.pulseSteps.mean)} · sonstiger Bewegung Ø ${n(day.pulseOther.mean)}</span>`}${day.incomplete ? '<span>Daten unvollständig</span>' : ''}`, 'date', 'day-card', `${dayAttributes(day.date)} ${day.future ? 'disabled' : ''}`);
}
function weekView() {
  const week = selectWeek(state);
  const dayMax = Math.max(30, ...week.days.map(d => d.movement || 0));
  const stepMax = Math.ceil(Math.max(1500, ...week.days.map(d => d.steps || 0)) / 500) * 500;
  const starts = weeksFor(state.session);
  return `<div class="context-nav">${button('← Wochenvergleich', 'weeks', 'secondary')}<div>${button('← Vorige Woche', 'previousWeek', 'secondary', state.week === starts[0] ? 'disabled' : '')}${button('Nächste Woche →', 'nextWeek', 'secondary', state.week === state.session.monday ? 'disabled' : '')}</div></div>${heading(`${weekLabel(state.week)} nach Tagen`, `${week.current ? 'Aktuelle Woche · bisher' : 'Abgeschlossene Woche'} · ${n(week.movement)} Bewegungsminuten${week.incomplete ? ' · Daten unvollständig' : ''}`)}<div class="matrix daily-matrix"><div class="matrix-row column-heads"><span></span>${week.days.map(d => button(`${dateLabel(d.date, { weekday: 'short', month: undefined })}${d.today ? '<small>Heute · bisher</small>' : ''}`, 'date', `column-head ${d.today ? 'today-cell' : ''}`, `${dayAttributes(d.date)} ${d.future ? 'disabled' : ''}`)).join('')}</div><section class="matrix-row">${labelBlock('Aktivität', 'activity', `Bewegungsminuten · Skala 0–${dayMax}`)}${week.days.map(d => metricCell(d, 'activity', dayMax)).join('')}</section><section class="matrix-row">${labelBlock('Schritte', 'steps', `Anzahl · Skala 0–${stepMax}`)}${week.days.map(d => metricCell(d, 'steps', stepMax)).join('')}</section><section class="matrix-row">${labelBlock('Puls · Tagesbereich', 'pulse', 'Schläge/min', 'Linie: Min–Max · Punkt: Tagesmittel; Skala 50–120')}${week.days.map(d => metricCell(d, 'pulse')).join('')}</section><section class="matrix-row">${labelBlock('Puls während Bewegung', 'pulse', 'Mittelwert · Schläge/min', '● Bei Schritten<br>◆ Bei sonstiger Bewegung')}${week.days.map(d => metricCell(d, 'category')).join('')}</section></div><div class="mobile-cards">${week.days.map(compactDay).join('')}</div><p class="muted">Einen Tag antippen, um den Tagesverlauf zu öffnen. Aktivität umfasst Schritte und sonstige Bewegung. Puls-Mittelwerte beziehen sich nur auf verfügbare Messungen der jeweiligen Bewegungsart.</p>${week.days.filter(d => d.gaps.length).map(d => `<p class="notice">${dateLabel(d.date, { weekday: 'short' })}: ${d.gaps.map(g => `${time(g.start)}–${time(g.end)} Uhr ${g.reason === 'not_worn_demo' ? 'nicht getragen (Demo)' : 'Messsignal fehlt (Demo)'}`).join(', ')}. Keine Aussage über Aktivität in der Datenlücke.</p>`).join('')}`;
}
function compactWeek(week) {
  return button(`<strong>${weekLabel(week.start)}${week.current ? ' · Aktuell bisher' : ''}</strong><span>${n(week.movement)} Bewegungsminuten · ${n(week.steps)} Schritte</span><span>Puls ${n(week.pulseMin)}–${n(week.pulseMax)} Schläge/min</span>${week.incomplete ? '<span>Daten unvollständig</span>' : ''}<span>Woche nach Tagen öffnen →</span>`, 'selectWeek', 'day-card', weekAttributes(week.start));
}
function weeksView() {
  const weeks = selectWeeks(state);
  const best = bestWeek(state);
  const max = Math.ceil(Math.max(GOAL.upper, ...weeks.map(w => w.movement || 0)) / 20) * 20;
  const stepMax = Math.ceil(Math.max(6000, ...weeks.map(w => w.steps || 0)) / 1000) * 1000;
  const cell = (w, kind) => button((kind === 'activity' ? bar(w.movement, max, { goal: true, best: best?.start === w.start }) : kind === 'steps' ? bar(w.steps, stepMax) : range(w)) + (w.incomplete ? '<span class="gap-tag">Daten unvollständig</span>' : '<span class="gap-tag" aria-hidden="true"></span>'), 'selectWeek', `matrix-cell ${w.current ? 'today-cell' : ''}`, `${weekAttributes(w.start)} aria-label="Woche ${weekLabel(w.start)}: ${kind === 'activity' ? `${n(w.movement)} Bewegungsminuten` : kind === 'steps' ? `${n(w.steps)} Schritte` : `Puls ${n(w.pulseMin)} bis ${n(w.pulseMax)}`} – nach Tagen öffnen"`);
  return heading('Meine Wochen im Vergleich', 'Eine Woche antippen – Tagesdetails öffnen. Die aktuelle Woche ist noch nicht abgeschlossen.') + `<div class="matrix weeks-matrix"><div class="matrix-row column-heads"><span></span>${weeks.map(w => button(`${weekLabel(w.start)}${w.current ? '<small>Aktuell · bisher</small>' : ''}`, 'selectWeek', `column-head ${w.current ? 'today-cell' : ''}`, weekAttributes(w.start))).join('')}</div><section class="matrix-row">${labelBlock('Aktivität', 'activity', `Bewegungsminuten · Skala 0–${max}`, `Ziel ${GOAL.target} · Bereich ${GOAL.lower}–${GOAL.upper} min (Demo)<br>◇ Aktivste vollständige Woche`)}${weeks.map(w => cell(w, 'activity')).join('')}</section><section class="matrix-row">${labelBlock('Schritte', 'steps', `Anzahl · Skala 0–${stepMax}`)}${weeks.map(w => cell(w, 'steps')).join('')}</section><section class="matrix-row">${labelBlock('Puls · Minimum–Maximum', 'pulse', 'Schläge/min', 'Punkt: Mittelwert aller gültigen Messungen · Skala 50–120')}${weeks.map(w => cell(w, 'pulse')).join('')}</section></div><div class="mobile-cards">${weeks.map(compactWeek).join('')}</div><p class="muted">Schraffur: beispielhafter Aktivitäts-Zielbereich ${GOAL.lower}–${GOAL.upper} Minuten. Keine Vorgabe für Puls oder Schritte. ${best ? `Aktivste vollständig erfasste abgeschlossene Woche: ${weekLabel(best.start)} mit ${best.movement} Minuten.` : 'Noch keine vollständige abgeschlossene Woche für den Bestwert verfügbar.'}</p>`;
}
function dayView() {
  const day = selectDay(state);
  const color = kind => kind === 'steps' ? 'step-segment' : 'other-segment';
  return `<div class="context-nav">${button('← Zur Woche', 'back', 'secondary')}</div>${heading(dateLabel(day.date), `${day.today ? 'Heute · bisher' : 'Tagesdetails'} · ${time(day.start)}–${time(day.availableEnd)} Uhr`)}${!day.hasData ? '<p class="notice">In diesem Zeitraum sind noch keine Messdaten verfügbar.</p>' : ''}<div class="detail-grid"><section class="panel"><h2>${icon('activity')} Allgemeine Aktivität</h2><p><strong data-testid="day-minutes">${n(day.movement)}</strong> Bewegungsminuten · ${n(day.count)} Abschnitte</p><div class="day-timeline" role="img" aria-label="Schrittbewegung und sonstige Bewegung über den Tag; Einzelabschnitte unten">${day.activity.map(a => `<span class="${color(a.kind)}" style="left:${(a.start - 480) / 720 * 100}%;width:${(a.end - a.start) / 720 * 100}%"></span>`).join('')}${day.gaps.map(g => `<span class="timeline-gap" style="left:${(g.start - 480) / 720 * 100}%;width:${(g.end - g.start) / 720 * 100}%"></span>`).join('')}</div><p class="muted">08–20 Uhr · ${day.today ? `Daten bis ${time(day.availableEnd)}` : 'Beobachtungsfenster'}<br>Gefüllt: Schritte · schraffiert: sonstige Bewegung</p><details><summary>Bewegungsabschnitte ansehen</summary>${day.activity.map(a => `<p>${time(a.start)}–${time(a.end)} Uhr · ${a.end - a.start} min · ${a.kind === 'steps' ? 'Schrittbewegung' : 'Sonstige Bewegung'} (geschätzt, Demo)</p>`).join('') || '<p>Keine erfassten Bewegungsabschnitte.</p>'}</details></section><section class="panel"><h2>${icon('steps')} Schritte</h2><p class="detail-value">${n(day.steps)}</p><p>Schätzung · geschätzte Strecke ${n(day.distance)}${day.distance == null ? '' : ' m'}</p><p class="muted">Strecke aus fiktiver Schrittlänge; keine individuell validierte Messung.</p></section><section class="panel wide"><h2>${icon('pulse')} Puls im Tagesverlauf</h2>${pulseLine(day)}<p>Minimum ${n(day.pulseMin)} · Maximum ${n(day.pulseMax)} · Mittelwert ${n(day.pulseMean)} Schläge/min</p><div class="pulse-categories"><p>${icon('steps')} Bei Schritten: Ø ${n(day.pulseSteps.mean)} Schläge/min</p><p>${icon('activity')} Bei sonstiger Bewegung: Ø ${n(day.pulseOther.mean)} Schläge/min</p></div><details><summary>Puls-Einzelwerte und Herkunft</summary><p>Simulierte Messwerte je Minute. Kategorie = hypothetisch erkannte Bewegungsart.</p><div class="sample-table"><table><thead><tr><th>Uhrzeit</th><th>Schläge/min</th><th>Bewegungsart</th></tr></thead><tbody>${day.pulse.map(p => `<tr><td>${time(p.t)}</td><td>${p.value}</td><td>${p.kind === 'steps' ? 'Schritte' : p.kind === 'other' ? 'Sonstige Bewegung' : 'Bewegungsarm'}</td></tr>`).join('')}</tbody></table></div></details></section><section class="panel wide"><h2>Hauttemperatur</h2><p>${day.temperature.length ? `${n(day.temperature.at(-1).value)} °C · letzter simulierter Wert ${time(day.temperature.at(-1).t)} Uhr` : 'Keine verfügbaren Messwerte'}</p><p>Hauttemperatur ist keine Körperkerntemperatur.</p></section></div>${day.gaps.map(g => `<p class="notice">Datenlücke ${time(g.start)}–${time(g.end)} Uhr. ${g.reason === 'not_worn_demo' ? 'Armband nicht getragen (Demo).' : 'Messsignal fehlt (Demo).'}</p>`).join('')}<p class="muted">Messabdeckung: ${day.covered} von ${day.coverageTotal} Minuten. Alle Angaben verwenden denselben verfügbaren Datenstand.</p>`;
}
function deviceView() {
  const d = state.device;
  return heading('Mein Armband', 'Gerätestatus · ausschliesslich simuliert') + `<div class="detail-grid"><section class="panel"><h2>Armband-Akku</h2><p class="detail-value">${d.battery} %</p><p>${d.charging ? 'Wird geladen (Demo)' : 'Nicht am Ladegerät (Demo)'}</p><p>Geschätzte Restlaufzeit: <strong>${d.runtime == null ? 'noch nicht abschätzbar' : `etwa ${d.runtime} Stunden`}</strong></p>${d.battery <= 15 ? '<p class="notice">Bitte heute laden.</p>' : ''}<p class="muted">Fiktiver Betriebsmodus, kein reales Akkumodell.</p></section><section class="panel"><h2>Verbindung</h2><p class="detail-value">${d.connected ? 'Verbunden' : 'Nicht verbunden'}</p><p>${d.connected ? 'Verbindung zum Tablet (Demo).' : 'Zeichnet auf dem Armband weiter auf (Demo).'}</p></section><section class="panel wide"><h2>Ihre Daten</h2><p class="notice">${text.transfer[d.transfer]}</p><dl><dt>Letzte erfolgreiche Übertragung</dt><dd>Heute ${time(d.lastTransfer)} Uhr</dd><dt>Daten verfügbar bis</dt><dd>Heute ${time(d.dataThrough)} Uhr</dd><dt>Nächste Übertragung geplant</dt><dd>Heute ${time(d.nextTransfer)} Uhr</dd><dt>Noch auf dem Armband</dt><dd>${d.pendingFrom != null ? `${time(d.pendingFrom)}–${time(d.pendingTo)} Uhr (Demo)` : 'Keine ausstehenden Daten (Demo)'}</dd></dl><details><summary>Speicher und Übertragungsbedarf</summary><p>Verbleibende Speicherzeit: ${d.storage == null ? 'noch nicht abschätzbar' : `geschätzt ${d.storage} Stunden`}.</p>${d.storage === 4 ? '<p>Bitte innerhalb von vier Stunden übertragen, damit der Speicher nicht voll wird (Demo).</p>' : ''}<p>Ladebedarf und Übertragungsbedarf sind unabhängig.</p></details></section></div>`;
}
function select(label, action, items, value) {
  return `<label>${label}<select data-change="${action}">${Object.entries(items).map(([id, name]) => `<option value="${id}" ${id === value ? 'selected' : ''}>${id}: ${name}</option>`).join('')}</select></label>`;
}
function controlsView() {
  return heading('Interviewsteuerung', 'Alle Aktionen ändern ausschliesslich die fiktiven Daten dieser Sitzung.') + `<section class="panel control-grid">${select('Aktivitätsszenario', 'scenario', activityScenarios, state.scenario)}${select('Gerätezustand', 'device', deviceScenarios, state.deviceScenario)}${select('Grund bei S03-Datenlücke', 'gapReason', { no_signal: 'Messsignal fehlt', not_worn_demo: 'Nicht getragen (Demo)' }, state.gapReason)}<p>Sitzungsdatum: ${dateLabel(state.session.today, { year: 'numeric' })} · Datenstand beim Appstart ${time(state.session.dataMinute)} Uhr. Daten sind erfunden.</p><div class="action-row">${button(text.actions.transfer, 'transfer', 'secondary', transferTimer ? 'disabled' : '')}${button(state.device.charging ? text.actions.chargeEnd : text.actions.charge, state.device.charging ? 'chargeEnd' : 'chargeStart', 'secondary')}</div><p role="status">${text.transfer[state.device.transfer]} · ${state.device.charging ? 'Wird geladen' : `Armband-Akku ${state.device.battery} %`}</p><hr><h2>Neues Interview</h2><p>Reset stellt C2, aktuelle Woche und S01/G01 wieder her. Der Zeitanker vom Appstart bleibt erhalten.</p>${button('Demo zurücksetzen', 'reset', 'secondary')}<p>Version ${VERSION} · C2 / D1 / W2 · Tablet-Abnahme noch offen.</p><h2>Installation und Offline-Nutzung</h2><p>${offlineReady ? 'Offline vorbereitet.' : 'Offline-Vorbereitung noch nicht bestätigt. Zuerst mit Internet vollständig öffnen.'}</p>${installPrompt ? button('PWA installieren', 'install', 'primary') : '<p>Installation über das Browsermenü, falls angeboten.</p>'}</section>`;
}
function infoView() {
  return heading('Über diese Demo') + `<section class="panel"><p>SMARTwearable zeigt ausschliesslich erfundene Beispieldaten. Das angelegte Armband ist nicht technisch verbunden.</p><p>Allgemeine Aktivität umfasst Schrittbewegung und sonstige Bewegung. Die Zuordnung ist eine hypothetische Auswertung, keine bestätigte Sensorfähigkeit.</p><p>Das lokale Datum des Tablets wird beim Appstart übernommen. Bewegungsdaten, Puls, Zielbereich und Gerätestatus bleiben simuliert. Es werden keine Interviewantworten gespeichert.</p><p>Der Zielbereich ist ein Beispiel, keine medizinische Belastungsvorgabe. Puls wird neutral angezeigt, ohne Leistungsziel.</p><p>Version ${VERSION}. Ein neuer Appstart liest Datum und Uhrzeit neu; die laufende Sitzung bleibt zeitlich unverändert.</p></section>`;
}
function render() {
  const views = { home: homeView, week: weekView, weeks: weeksView, day: dayView, device: deviceView, controls: controlsView, info: infoView };
  const status = button(icon('battery') + `<span>Armband-Akku ${state.device.battery} % · Daten bis ${time(state.device.dataThrough)}</span>`, 'device', 'status-button');
  const date = `<p class="date-label">${dateLabel(state.session.today, { year: 'numeric' })}</p>`;
  const update = pendingUpdate ? `<aside class="notice">Eine neue Version ist bereit. ${button('Neue Version laden', 'update', 'secondary')}</aside>` : '';
  if (state.view === 'home') {
    root.innerHTML = `<div class="compact-shell"><header class="compact-header">${button('<span class="brand-name">SMARTwearable</span><span> · Beispieldaten</span>' + icon('info'), 'info', 'info-button')}${status}</header>${date}${update}<main id="main" class="compact-main">${homeView()}</main><footer class="compact-footer"><p>Alle Werte fiktiv</p><div>${button('Info', 'info', 'text-button')}${button('Interviewsteuerung', 'controls', 'text-button')}</div></footer></div>`;
    return;
  }
  root.innerHTML = `<header class="site-header"><span class="brand-name">SMARTwearable</span>${button('Beispieldaten ' + icon('info'), 'info', 'info-button')}</header><div class="app-shell"><div class="date-status">${date}${status}</div><nav class="home-nav" aria-label="Zur Startseite">${button('← Startseite', 'home', 'home-button')}</nav>${update}<main id="main">${views[state.view]()}</main><footer><p>Alle Werte sind fiktiv · keine echte Armbandverbindung.</p><div>${button(icon('device') + ' Mein Armband', 'device', 'text-button')}${button('Interviewsteuerung', 'controls', 'text-button')}</div></footer></div>`;
}
root.addEventListener('click', async event => {
  const target = event.target.closest('[data-action]');
  if (!target || target.disabled) return;
  const action = target.dataset.action;
  if (target.tagName === 'A') event.preventDefault();
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
