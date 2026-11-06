import { VERSION, TODAY, DATES, time, activityScenarios, deviceScenarios } from './data.js';
import { initialState, reduce, selectDay, segments } from './model.js';
import { text } from './content.js';

let state = initialState();
let transferTimer;
let pendingUpdate;
let installPrompt;
let offlineReady = false;
const root = document.querySelector('#app');
const dateLabel = date => new Intl.DateTimeFormat('de-CH', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Zurich' }).format(new Date(`${date}T12:00:00+01:00`));
const number = n => n == null ? 'Nicht verfügbar' : new Intl.NumberFormat('de-CH', { maximumFractionDigits: 1 }).format(n);
const button = (label, action, cls = '', extra = '') => `<button type="button" class="${cls}" data-action="${action}" ${extra}>${label}</button>`;
const title = (eyebrow, heading, description = '') => `<div class="page-heading"><p class="eyebrow">${eyebrow}</p><h1 tabindex="-1">${heading}</h1>${description ? `<p class="intro">${description}</p>` : ''}</div>`;
function dispatch(action, focusHeading = false) {
  if (['reset', 'device'].includes(action.type)) clearTimeout(transferTimer);
  state = reduce(state, action);
  render();
  if (focusHeading) document.querySelector('h1')?.focus({ preventScroll: true });
}
function summary(day) {
  return `<div class="metrics" data-testid="summary"><section class="metric"><span class="metric-label">In Bewegung</span><p><strong data-testid="minutes">${day.movement}</strong> <span>Minuten</span></p><span class="source-label">Geschätzte Bewegungszeit</span></section><section class="metric"><span class="metric-label">Über den Tag verteilt</span><p><strong data-testid="count">${day.count}</strong> <span>Abschnitte</span></p><span class="source-label">Zusammenhängende Bewegung</span></section></div>`;
}
function timeline(day) {
  const labels = { movement: 'Bewegung geschätzt', quiet: 'Wenig Bewegung gemessen', gap: 'Datenlücke', unknown: 'Noch keine Daten' };
  return `<section class="panel timeline-panel"><div class="section-heading"><div><p class="eyebrow">${day.date === TODAY ? 'Bisher heute' : 'Ausgewählter Tag'}</p><h2>Ihr Tagesverlauf</h2></div><span class="pill">08–20 Uhr</span></div><div class="timeline" role="img" aria-label="Tagesverlauf: ${day.movement} Minuten Bewegung in ${day.count} Abschnitten. ${day.gaps.length ? 'Datenlücke vorhanden.' : ''} Textliche Einzelheiten folgen darunter.">${segments(day).map(x => `<span class="segment ${x.kind}" style="flex-grow:${x.end - x.start}" title="${time(x.start)}–${time(x.end)}: ${labels[x.kind]}"></span>`).join('')}</div><div class="axis" aria-hidden="true"><span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span></div><div class="legend">${Object.entries(labels).map(([kind, label]) => `<span><i class="swatch ${kind}"></i>${label}</span>`).join('')}</div><p class="muted">${text.explanation}</p><details><summary>Bewegungsabschnitte ansehen (${day.count})</summary><div class="activity-list">${day.activity.map(x => `<details class="activity"><summary>${time(x.start)}–${time(x.end)} Uhr · ${x.end - x.start} Minuten</summary><p>Beginn: ${time(x.start)} Uhr · Ende: ${time(x.end)} Uhr<br>Dauer: ${x.end - x.start} Minuten<br>Herkunft: Bewegung geschätzt (Demo).</p></details>`).join('') || '<p>Keine Bewegungsabschnitte in den verfügbaren Daten.</p>'}</div></details>${day.gaps.map(g => `<p class="notice">${time(g.start)}–${time(g.end)} Uhr: ${g.reason === 'not_worn_demo' ? 'Armband nicht getragen (Demo).' : 'Messsignal fehlt (Demo).'} ${text.gap}</p>`).join('')}<p class="coverage">Messabdeckung: ${day.covered} von ${day.coverageTotal} Minuten im Beobachtungsfenster ${time(day.start)}–${time(day.end)} Uhr. Daten verfügbar bis ${time(day.availableEnd)} Uhr.</p></section>`;
}
function dayView() {
  const day = selectDay(state);
  return title(day.date === TODAY ? 'Bisher heute · Demo-Zeit 14:30 Uhr' : 'Ihr Rückblick', dateLabel(day.date)) +
    `<div class="day-layout variant-${state.variant}" data-variant="${state.variant}">${summary(day)}${timeline(day)}</div><div class="action-row">${button('Details ansehen <span aria-hidden="true">↗</span>', 'details', 'primary')}${day.date !== TODAY ? button('Zurück zu heute', 'today', 'secondary') : ''}</div>`;
}
function pulseChart(day) {
  if (!day.pulse.length) return `<p>${text.historicalVitals}</p>`;
  const groups = [];
  for (const p of day.pulse) {
    const group = groups.at(-1);
    if (!group || p.t - group.at(-1).t > 5) groups.push([p]); else group.push(p);
  }
  const x = t => 50 + (t - day.start) / (day.end - day.start) * 570;
  const y = value => 155 - (value - 60) / 50 * 120;
  return `<svg class="pulse-chart" viewBox="0 0 650 210" role="img" aria-label="Pulsverlauf. Durchschnitt ${day.pulseMean}, niedrigster Wert ${day.pulseMin}, höchster Wert ${day.pulseMax} Schläge pro Minute. Datenlücken werden nicht verbunden."><text x="5" y="32">110</text><text x="5" y="160">60</text><path d="M50 20V160H620" fill="none" stroke="currentColor"/>${groups.map(g => `<polyline points="${g.map(p => `${x(p.t)},${y(p.value)}`).join(' ')}" fill="none" stroke="#185d64" stroke-width="3"/>`).join('')}<text x="50" y="196">${time(day.start)}</text><text x="560" y="196">${time(day.end)}</text></svg>`;
}
function detailsView() {
  const day = selectDay(state);
  return `${button('← Zurück', 'back', 'text-button')}${title('Einzelheiten · ' + dateLabel(day.date), 'Ihre Aktivitätsdaten', `Verfügbare Daten: ${time(day.start)}–${time(day.availableEnd)} Uhr.`)}<div class="detail-grid"><section class="panel"><h2>Schritte</h2><p class="detail-value">${number(day.steps)}</p><p>Geschätzt · Demo</p>${day.steps == null ? '<p>Für den unvollständig übertragenen Zeitraum liegen keine separaten Schrittwerte vor.</p>' : '<p>Vorgegebene Beispieldaten, keine Messung Ihres Armbands.</p>'}</section><section class="panel"><h2>Geschätzte Strecke</h2><p class="detail-value">${number(day.distance)}${day.distance == null ? '' : ' m'}</p><p>Schätzung · Demo</p><p>Keine individuell validierte Schrittlänge.</p></section><section class="panel wide"><h2>Puls im Verlauf</h2>${pulseChart(day)}${day.pulse.length ? `<p><strong>${day.pulseMean}</strong> Schläge pro Minute im Durchschnitt · Spannweite ${day.pulseMin}–${day.pulseMax}.</p><details><summary>Einzelwerte und Herkunft</summary><p>Simulierte Messwerte, alle fünf Minuten. Keine Bewertung oder Trainingsvorgabe.</p><div class="sample-table"><table><thead><tr><th>Uhrzeit</th><th>Puls / Minute</th></tr></thead><tbody>${day.pulse.map(p => `<tr><td>${time(p.t)}</td><td>${p.value}</td></tr>`).join('')}</tbody></table></div></details>` : ''}</section><section class="panel wide"><h2>Hauttemperatur</h2>${day.temperature.length ? `<p class="detail-value">${number(day.temperature.at(-1).value)} °C</p><p>Letzter verfügbarer Wert um ${time(day.temperature.at(-1).t)} Uhr · simulierter Messwert.</p><p>Die Hauttemperatur ist keine Körperkerntemperatur.</p><details><summary>Temperaturverlauf ansehen</summary><ul>${day.temperature.map(p => `<li>${time(p.t)} Uhr: ${number(p.value)} °C</li>`).join('')}</ul></details>` : `<p>${text.historicalVitals}</p>`}</section></div>`;
}
function weekView() {
  return title('03.–09. November 2026', 'Ihre letzten 7 Tage', 'Ein Überblick über die aufgezeichnete Bewegung. Heute ist noch nicht abgeschlossen.') +
    `<section class="panel"><p class="muted">Bewegungsminuten · gleiche Skala für alle Tage</p><div class="week-list">${DATES.map(date => {
      const d = selectDay(state, date);
      return `<button class="week-day" data-action="date" data-date="${date}"><span class="week-label">${dateLabel(date)}${date === TODAY ? ' · bisher' : ''}</span><span class="week-bar" aria-hidden="true"><span style="width:${d.movement / 40 * 100}%"></span></span><strong>${d.movement} min <span aria-hidden="true">→</span></strong><span class="week-coverage">${d.covered}/${d.coverageTotal} min Messabdeckung${d.gaps.length ? ' · Datenlücke' : ''}${d.availableEnd < d.end ? ' · noch nicht vollständig übertragen' : ''}</span></button>`;
    }).join('')}</div><p class="muted">Weniger aufgezeichnete Bewegung ist keine medizinische Bewertung. Bei Datenlücken ist der Tag nicht vollständig erfasst.</p></section>`;
}
function deviceView() {
  const d = state.device;
  return title('Gerätestatus · ausschliesslich simuliert', 'Mein Armband') + `<div class="detail-grid"><section class="panel"><h2>Batterie</h2><p class="detail-value">${d.battery} %</p><p>${d.charging ? 'Wird geladen (Demo)' : 'Nicht am Ladegerät (Demo)'}</p><p>Geschätzte Restlaufzeit: <strong>${d.runtime == null ? 'noch nicht abschätzbar' : `etwa ${d.runtime} Stunden`}</strong></p>${d.battery <= 15 ? '<p class="notice">Bitte heute laden.</p>' : ''}<p class="muted">Schätzung für einen fiktiven Betriebsmodus. Kein reales Akkumodell.</p></section><section class="panel"><h2>Verbindung</h2><p class="detail-value status-word">${d.connected ? 'Verbunden' : 'Nicht verbunden'}</p><p>${d.connected ? 'Verbindung zum Tablet (Demo).' : 'Zeichnet auf dem Armband weiter auf (Demo).'}</p><p>Eine Verbindung bedeutet nicht automatisch, dass alle Daten übertragen wurden.</p></section><section class="panel wide"><h2>Ihre Daten</h2><p class="notice">${text.transfer[d.transfer]}</p><dl><dt>Letzte erfolgreiche Übertragung</dt><dd>Heute, ${d.lastTransfer} Uhr</dd><dt>Aktivitätsdaten verfügbar bis</dt><dd>Heute, ${d.dataThrough} Uhr</dd><dt>Nächste Übertragung geplant</dt><dd>Heute, ${d.nextTransfer} Uhr</dd><dt>Noch auf dem Armband</dt><dd>${d.pendingFrom ? `Heute, ${d.pendingFrom}–${d.pendingTo} Uhr (Demo)` : 'Keine ausstehenden Daten (Demo)'}</dd></dl><details><summary>Speicher und Übertragungsbedarf</summary><p>Verbleibende Aufzeichnungszeit im Speicher: ${d.storage == null ? 'noch nicht abschätzbar' : `geschätzt ${d.storage} Stunden`}.</p>${d.storage === 4 ? '<p class="notice">Bitte bis heute 18:30 Uhr übertragen, damit der Speicher nicht voll wird.</p>' : '<p>Ladebedarf und Datenübertragung sind unabhängig voneinander.</p>'}</details></section></div>`;
}
function select(label, action, items, value) {
  return `<label>${label}<select data-change="${action}">${Object.entries(items).map(([id, name]) => `<option value="${id}" ${id === value ? 'selected' : ''}>${id}: ${name}</option>`).join('')}</select></label>`;
}
function controlsView() {
  return title('Für Interviewende', 'Interviewsteuerung', 'Alle Aktionen ändern ausschliesslich die Demo auf diesem Tablet.') +
    `<section class="panel control-grid">${select('Heute-Darstellung', 'variant', { A: 'Ansicht A', B: 'Ansicht B' }, state.variant)}${select('Aktivitätsszenario', 'scenario', activityScenarios, state.scenario)}${select('Gerätezustand', 'device', deviceScenarios, state.deviceScenario)}${select('Grund bei S03-Datenlücke', 'gapReason', { no_signal: 'Messsignal fehlt', not_worn_demo: 'Nicht getragen (Demo)' }, state.gapReason)}<p>Aktuell: Ansicht ${state.variant} · ${state.scenario} · ${state.deviceScenario}. Demo-Zeit: 09.11.2026, 14:30 Uhr (Europe/Zurich).</p><div class="action-row">${button('Heute ansehen', 'today', 'primary')}${button(text.actions.transfer, 'transfer', 'secondary', state.device.transfer === 'running' && transferTimer ? 'disabled' : '')}${button(state.device.charging ? text.actions.chargeEnd : text.actions.charge, state.device.charging ? 'chargeEnd' : 'chargeStart', 'secondary')}</div><p role="status">${text.transfer[state.device.transfer]} · ${state.device.charging ? 'Wird geladen (Demo)' : `Batterie ${state.device.battery} %`}</p><hr><h2>Neues Interview</h2><p>Zurücksetzen stellt Ansicht A, Beispieltag S01, Gerätezustand G01 und Heute wieder her.</p>${button('Demo zurücksetzen', 'reset', 'secondary')}<p>Version ${VERSION} · Entwurf für Tablet-Test. Vorschläge sind vorläufig umgesetzt.</p><h2>Installation und Offline-Nutzung</h2><p>${offlineReady ? 'Offline vorbereitet. Nach vollständigem Laden ohne Internet erneut öffnen.' : 'Offline-Vorbereitung noch nicht bestätigt. Anwendung zuerst mit Internet vollständig öffnen.'}</p>${installPrompt ? button('PWA installieren', 'install', 'primary') : '<p>Zum Installieren im Browsermenü „App installieren“ oder „Zum Startbildschirm hinzufügen“ wählen, sofern angeboten.</p>'}<p>Interviewantworten werden hier nicht gespeichert. Das angelegte Armband wird nicht tatsächlich ausgelesen.</p></section>`;
}
function render() {
  const views = { day: dayView, details: detailsView, week: weekView, device: deviceView, controls: controlsView };
  const nav = [['day', 'Heute'], ['week', '7 Tage'], ['device', 'Mein Armband']];
  root.innerHTML = `<header class="site-header"><div class="brand"><span class="brand-symbol" aria-hidden="true">s</span><div><span class="brand-name">SMARTwearable</span><span class="brand-subtitle">${text.subtitle}</span></div></div><span class="demo-label">${text.demo}</span></header><div class="app-shell"><nav class="main-nav" aria-label="Hauptnavigation">${nav.map(([id, label]) => button(label, id, state.view === id ? 'nav-button active' : 'nav-button', state.view === id ? 'aria-current="page"' : '')).join('')}</nav><aside class="status-strip" aria-label="Armband-Kurzstatus">${button(`<span aria-hidden="true">▰</span> Armband: ${state.device.battery} % <span class="status-dot" aria-hidden="true">·</span> Daten bis ${state.device.dataThrough} Uhr <span aria-hidden="true">→</span>`, 'device', 'status-button')}</aside>${pendingUpdate ? `<aside class="notice">Eine neue Version ist bereit. ${button('Neue Version laden', 'update', 'secondary')}</aside>` : ''}<main id="main">${views[state.view]()}</main><footer><p>${text.source}</p>${button('Interviewsteuerung', 'controls', 'text-button')}</footer></div>`;
}
root.addEventListener('click', async event => {
  const target = event.target.closest('[data-action]');
  if (!target) return;
  const action = target.dataset.action;
  if (['day', 'today', 'week', 'device', 'controls'].includes(action)) dispatch({ type: 'navigate', view: action === 'today' ? 'day' : action }, true);
  else if (action === 'date') dispatch({ type: 'date', date: target.dataset.date }, true);
  else if (action === 'details' || action === 'back') dispatch({ type: action }, true);
  else if (action === 'reset') {
    if (window.confirm('Demo auf Anfang zurücksetzen?')) { dispatch({ type: 'reset' }, true); announce('Demo zurückgesetzt.'); }
  } else if (action === 'transfer') {
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
  document.querySelector(`[data-change="${action}"]`)?.focus();
  announce('Demo-Einstellung geändert.');
});
function announce(message) { document.querySelector('#announcement').textContent = message; }
window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); installPrompt = event; if (state.view === 'controls') render(); });
render();
if ('serviceWorker' in navigator) {
  let reloading = false;
  const hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (hadController && !reloading) { reloading = true; location.reload(); }
  });
  navigator.serviceWorker.register('./sw.js', { scope: './' }).then(async registration => {
    const showWaiting = () => { if (registration.waiting) { pendingUpdate = registration.waiting; render(); } };
    showWaiting();
    registration.addEventListener('updatefound', () => registration.installing?.addEventListener('statechange', showWaiting));
    await navigator.serviceWorker.ready;
    offlineReady = true;
    if (state.view === 'controls') render();
  }).catch(() => { offlineReady = false; announce('Offline-Vorbereitung nicht verfügbar. Bitte mit Internet verwenden.'); });
}
