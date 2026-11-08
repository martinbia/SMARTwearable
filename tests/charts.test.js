import test from 'node:test';
import assert from 'node:assert/strict';
import { createSession } from '../src/calendar.js';
import { initialState, reduce, selectDay } from '../src/model.js';
import { activityTimeline, pulseLine, timeScale } from '../src/charts.js';
const state = () => initialState(createSession(new Date(2026,10,12,14,30)));

test('F24: both daily charts end at the available data time and preserve activity durations', () => {
  for (const device of ['G01','G05']) for (const scenario of ['S01','S03']) {
    const s=reduce(reduce(state(),{type:'device',value:device}),{type:'scenario',value:scenario});
    for (const date of [s.session.today,'2026-11-05']) {
      const d=selectDay(s,date), scale=timeScale(d);
      assert.equal(scale.start,480);assert.equal(scale.end,d.availableEnd);
      assert.equal(scale.percent(scale.start),0);assert.equal(scale.percent(scale.end),100);
      assert.equal(scale.ticks.at(-1),d.availableEnd);
      for (const chart of [activityTimeline(d),pulseLine(d)]) {
        assert.ok(chart.includes(`data-time-start="${d.start}" data-time-end="${d.availableEnd}"`));
      }
      const durations=[...activityTimeline(d).matchAll(/data-duration="(\d+)"/g)].map(m=>Number(m[1]));
      assert.equal(durations.reduce((a,b)=>a+b,0),d.movement);
    }
  }
});
test('F09/F24: pulse paths stop at gaps and empty early days never show a fabricated trace', () => {
  const d=selectDay({...state(),scenario:'S03'}), scale=timeScale(d);
  const lines=[...pulseLine(d).matchAll(/<polyline points="([^"]+)"/g)].map(m=>m[1].split(' ').map(point=>Number(point.split(',')[0])));
  assert.equal(lines.length,2);
  for (const xs of lines) for (const g of d.gaps) {
    assert.ok(xs.at(-1)<scale.percent(g.start)*10 || xs[0]>=scale.percent(g.end)*10);
  }
  const early=selectDay(initialState(createSession(new Date(2026,10,12,5,30))));
  assert.ok(!pulseLine(early).includes('<polyline'));
  assert.ok(!activityTimeline(early).includes('movement-segment'));
});
