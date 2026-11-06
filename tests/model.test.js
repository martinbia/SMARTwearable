import test from 'node:test';
import assert from 'node:assert/strict';
import { DATES, getDay, getDevice, deviceScenarios, TODAY, minute } from '../src/data.js';
import { initialState, reduce, selectDay, segments } from '../src/model.js';

test('F01/F04: seven-day interval sums and counts match agreed demo', () => {
  const days = DATES.map(date => selectDay(initialState(), date));
  assert.deepEqual(days.map(d => d.movement), [18,22,12,24,20,30,24]);
  assert.deepEqual(days.map(d => d.count), [4,5,3,5,4,6,4]);
  assert.deepEqual(days.map(d => d.covered), [720,720,720,720,600,720,390]);
});
test('F09: gaps contain no activity or samples, quiet excludes gaps', () => {
  for (const scenario of ['S01','S02','S03']) for (const date of DATES) {
    const d = selectDay({ ...initialState(), scenario }, date);
    for (const g of d.gaps) {
      assert.ok(d.activity.every(a => a.end <= g.start || a.start >= g.end));
      assert.ok([...d.pulse,...d.temperature].every(p => p.t < g.start || p.t >= g.end));
    }
    assert.equal(d.quiet + d.movement, d.covered);
    assert.ok(d.activity.every(x => x.start >= d.start && x.end <= d.availableEnd));
    assert.equal(segments(d).reduce((sum,x) => sum + x.end-x.start, 0), 720);
  }
});
test('F02: A/B share data and selection exactly', () => {
  const state = { ...initialState(), date: DATES[4], scenario: 'S03' };
  assert.deepEqual(selectDay(state), selectDay(reduce(state,{type:'variant',value:'B'})));
});
test('S02/S03 are neutral deterministic scenarios', () => {
  const s2 = selectDay({ ...initialState(), scenario:'S02' });
  assert.deepEqual([s2.movement,s2.count,s2.steps], [8,2,400]);
  const s3 = selectDay({ ...initialState(), scenario:'S03' });
  assert.deepEqual([s3.movement,s3.count,s3.covered], [12,2,270]);
  assert.deepEqual(getDay(TODAY), getDay(TODAY));
});
test('F05/F15: data-through limits every current-day value', () => {
  for (const id of Object.keys(deviceScenarios)) {
    const s = reduce(initialState(), {type:'device',value:id});
    const d = selectDay(s);
    const cutoff = minute(s.device.dataThrough);
    assert.ok(d.activity.every(a => a.end <= cutoff));
    assert.ok([...d.pulse,...d.temperature].every(p => p.t <= cutoff));
    assert.ok(minute(s.device.dataThrough) <= minute(s.device.lastTransfer));
    assert.ok(minute(s.device.lastTransfer) <= 870);
    if (cutoff < 870) {
      assert.equal(d.movement,6); assert.equal(d.count,1);
      assert.equal(d.steps,null); assert.equal(d.distance,null);
    }
  }
});
test('F11: success advances data, failure stays failed; reset restores all', () => {
  let s = reduce(initialState(), {type:'device',value:'G05'});
  assert.equal(selectDay(s).movement,6);
  s = reduce(reduce(s,{type:'transferStart'}),{type:'transferEnd'});
  assert.equal(selectDay(s).movement,24);
  assert.equal(s.device.pendingFrom,null);
  let failure = reduce(initialState(),{type:'device',value:'G07'});
  failure = reduce(reduce(failure,{type:'transferStart'}),{type:'transferEnd'});
  assert.equal(failure.device.transfer,'failed');
  assert.equal(selectDay(failure).movement,6);
  assert.deepEqual(reduce(failure,{type:'reset'}),initialState());
});
test('F11: loading is independent from storage and transfer state', () => {
  const s = reduce(initialState(),{type:'device',value:'G08'});
  const loaded = reduce(reduce(s,{type:'chargeStart'}),{type:'chargeEnd'});
  assert.equal(loaded.device.battery,100);
  assert.equal(loaded.device.storage,4);
  assert.equal(getDevice('G09').runtime,null);
});
test('F03/F12: navigation and scenario changes preserve appropriate context', () => {
  let s = reduce(initialState(),{type:'date',date:DATES[0]});
  s = reduce(s,{type:'details'});
  s = reduce(s,{type:'back'});
  assert.equal(s.date,DATES[0]); assert.equal(s.view,'day');
  s = reduce(s,{type:'variant',value:'B'});
  s = reduce(s,{type:'scenario',value:'S02'});
  assert.equal(s.date,TODAY); assert.equal(s.variant,'B');
  assert.deepEqual(reduce(s,{type:'reset'}),initialState());
});
