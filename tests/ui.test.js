import test from 'node:test';
import assert from 'node:assert/strict';

// Event/HTML integration harness: checks actual app rendering and events without
// claiming browser layout, accessibility-tree, installation or device coverage.
test('F01–F12: actual UI handlers render navigation, variants, scenarios, transfer and reset', async () => {
  const events = {};
  const app = { innerHTML: '', addEventListener: (type, callback) => { events[type] = callback; } };
  const status = { textContent: '' };
  globalThis.document = { querySelector: selector => selector === '#app' ? app : selector === '#announcement' ? status : { focus() {} } };
  globalThis.window = { addEventListener() {}, confirm: () => true };
  const click = (action, data = {}) => events.click({ target: { closest: () => ({ dataset: { action, ...data } }) } });
  const change = (action, value) => events.change({ target: { dataset: { change: action }, value } });
  await import('../src/app.js');
  assert.match(app.innerHTML, /data-testid="minutes">24</);
  assert.match(app.innerHTML, /Demo – Beispieldaten/);
  for (let round = 0; round < 10; round++) {
    await click('controls');
    change('variant', 'B');
    await click('today');
    assert.match(app.innerHTML, /data-variant="B"/);
    assert.match(app.innerHTML, /data-testid="minutes">24</);
    await click('details');
    assert.match(app.innerHTML, /Hauttemperatur/);
    await click('back');
    await click('week');
    assert.equal((app.innerHTML.match(/data-action="date"/g) || []).length, 7);
    await click('date', { date: '2026-11-07' });
    assert.match(app.innerHTML, /Messsignal fehlt/);
    await click('details');
    assert.match(app.innerHTML, /nicht als Demo hinterlegt/);
    await click('back');
    await click('controls'); change('scenario', 'S03');
    await click('today');
    assert.match(app.innerHTML, /data-testid="minutes">12</);
    assert.match(app.innerHTML, /270 von 390/);
    await click('controls'); change('scenario', 'S01'); change('device', 'G05');
    await click('today');
    assert.match(app.innerHTML, /data-testid="minutes">6</);
    await click('details');
    assert.match(app.innerHTML, /Nicht verfügbar/);
    await click('controls');
    // Model tests cover actual timer completion; integration uses one real timer below.
    change('device', 'G02'); await click('device');
    assert.match(app.innerHTML, /Bitte heute laden/);
    await click('controls'); await click('reset');
    assert.match(app.innerHTML, /data-variant="A"/);
    assert.match(app.innerHTML, /data-testid="minutes">24</);
  }
  await click('controls'); change('device','G05');
  await click('transfer');
  assert.match(app.innerHTML, /data-action="transfer" disabled/);
  await new Promise(resolve => setTimeout(resolve, 1250));
  await click('today');
  assert.match(app.innerHTML, /data-testid="minutes">24</);
  await click('controls'); change('device','G07');
  await click('transfer');
  await new Promise(resolve => setTimeout(resolve, 1250));
  assert.match(app.innerHTML, /fehlgeschlagen/);
  await click('chargeStart');
  assert.match(app.innerHTML, /Laden abschliessen/);
  await click('chargeEnd');
  assert.match(app.innerHTML, /Batterie 100 %/);
  await click('reset');
  assert.match(app.innerHTML, /Armband: 62 %/);
  delete globalThis.document;
  delete globalThis.window;
});
