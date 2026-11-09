import test from 'node:test';
import assert from 'node:assert/strict';
import { clearPreferences, completePreferences, emptyPreferences, readPreferences, writePreferences } from '../src/settings.js';

function storage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: key => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, value),
    removeItem: key => values.delete(key),
    values
  };
}

test('preferences require exactly the three boolean choices and persist locally', () => {
  const store = storage();
  const value = { pulseAlerts: true, activityReminder: false, shareWithCareTeam: true };
  assert.equal(completePreferences(emptyPreferences()), false);
  assert.equal(writePreferences(store, { ...value, activityReminder: null }), false);
  assert.equal(writePreferences(store, value), true);
  assert.deepEqual(readPreferences(store), value);
  assert.equal(clearPreferences(store), true);
  assert.equal(readPreferences(store), null);
});

test('missing, malformed, incomplete, or unknown preference schemas require setup', () => {
  assert.equal(readPreferences(storage()), null);
  const store = storage({ 'smartwearable-preferences-v1': '{broken' });
  assert.equal(readPreferences(store), null);
  store.setItem('smartwearable-preferences-v1', JSON.stringify({ schema: 1, pulseAlerts: true }));
  assert.equal(readPreferences(store), null);
  store.setItem('smartwearable-preferences-v1', JSON.stringify({ schema: 2, pulseAlerts: true, activityReminder: false, shareWithCareTeam: false }));
  assert.equal(readPreferences(store), null);
});

test('storage exceptions fail closed without throwing', () => {
  const blocked = { getItem() { throw Error('blocked'); }, setItem() { throw Error('blocked'); }, removeItem() { throw Error('blocked'); } };
  assert.equal(readPreferences(blocked), null);
  assert.equal(writePreferences(blocked, { pulseAlerts: false, activityReminder: true, shareWithCareTeam: false }), false);
  assert.equal(clearPreferences(blocked), false);
});
