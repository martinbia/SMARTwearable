import test from 'node:test';
import assert from 'node:assert/strict';
import { createSession, dateKey, localDate, addDays, monday, weekDates } from '../src/calendar.js';
import { GOAL, allocate, rawDay, getDevice, weeksFor, deviceScenarios } from '../src/data.js';
import { initialState, reduce, selectDay, selectWeek, selectWeeks, bestWeek, pulseStats } from '../src/model.js';
const session = () => createSession(new Date(2026,10,12,14,30));
const state = () => initialState(session());

test('F16: local date, Monday/Sunday, month/year and DST boundaries', () => {
  assert.equal(session().today,'2026-11-12'); assert.equal(session().monday,'2026-11-09');
  for(const key of ['2027-01-01','2026-03-29','2026-10-25','2028-02-29','2026-11-08']) {
    const week = weekDates(monday(key));
    assert.equal(localDate(week[0]).getDay(),1); assert.equal(localDate(week[6]).getDay(),0);
    assert.ok(week.includes(key)); assert.equal(new Set(week).size,7);
    for(let i=1;i<7;i++) assert.equal(week[i],addDays(week[i-1],1));
  }
  assert.equal(addDays('2026-12-31',1),'2027-01-01');
  assert.equal(dateKey(new Date(2026,0,1,0,1)),'2026-01-01');
});
test('F17/F18: historical week totals, shared daily sums and valid personal best', () => {
  const weeks=selectWeeks(state());
  assert.deepEqual(weeks.map(w=>w.movement),[90,100,85,110,95,80]);
  assert.deepEqual(weeks.map(w=>w.steps),[4000,4500,3900,5000,4300,3500]);
  assert.deepEqual(weeks.at(-2).days.map(d=>d.movement),[12,15,10,18,8,20,12]);
  assert.deepEqual(weeks.at(-2).days.map(d=>d.steps),[500,650,450,800,350,950,600]);
  for(const w of weeks) assert.equal(w.movement,w.days.filter(d=>d.hasData).reduce((s,d)=>s+d.movement,0));
  assert.equal(bestWeek(state()).movement,110); assert.ok(bestWeek(state()).complete);
  assert.equal(weeks.at(-1).complete,false); assert.deepEqual(GOAL,{target:100,lower:90,upper:110});
  assert.equal(allocate(95,[12,15,10,18,8,20,12]).reduce((s,x)=>s+x,0),95);
});
test('F16/F15: all weekdays work; future days never contain false zeros or pulse', () => {
  for(let i=0;i<7;i++) {
    const date=addDays('2026-11-09',i);
    const s=initialState(createSession(new Date(...[...date.split('-').map(Number).map((x,j)=>j===1?x-1:x),14,30])));
    for(const d of selectWeek(s).days) if(d.date>s.session.today) {
      assert.ok(d.future); assert.equal(d.steps,null);assert.equal(d.movement,null);assert.equal(d.pulseMin,null);assert.deepEqual(d.pulse,[]);
    }
  }
  const early=initialState(createSession(new Date(2026,10,9,5,30)));
  const day=selectDay(early);assert.equal(day.movement,null);assert.equal(day.pulseMean,null);assert.equal(day.steps,null);
});
test('F20: extrema and category means derive from valid equal-interval raw samples', () => {
  const s=state();
  for(const w of selectWeeks(s)) for(const d of w.days.filter(d=>d.hasData)) {
    assert.deepEqual({min:d.pulseMin,max:d.pulseMax,mean:d.pulseMean},pulseStats(d.pulse));
    assert.deepEqual(d.pulseSteps,pulseStats(d.pulse.filter(p=>p.kind==='steps')));
    assert.deepEqual(d.pulseOther,pulseStats(d.pulse.filter(p=>p.kind==='other')));
    assert.equal(d.movement,d.activity.reduce((sum,a)=>sum+a.end-a.start,0));
    assert.ok(d.pulseSteps.mean>=d.pulseMin && d.pulseSteps.mean<=d.pulseMax);
  }
  const w=selectWeek(s);assert.deepEqual(pulseStats(w.days.flatMap(d=>d.pulse)),{min:w.pulseMin,max:w.pulseMax,mean:w.pulseMean});
  assert.deepEqual(pulseStats([]),{min:null,max:null,mean:null});
});
test('F09/F20: gaps remove movement, steps and pulse; no interpolation or false quiet', () => {
  const s={...state(),scenario:'S03'};const d=selectDay(s);
  assert.equal(d.covered,270);
  for(const g of d.gaps) {
    assert.ok(d.activity.every(a=>a.end<=g.start||a.start>=g.end));
    assert.ok([...d.pulse,...d.temperature].every(p=>p.t<g.start||p.t>=g.end));
  }
  assert.equal(d.movement+d.quiet,d.covered);
  assert.ok(d.movement<selectDay(state()).movement);
  const raw=rawDay(s.session,s.session.today,'S03');
  const expected=raw.stepSamples.filter(p=>p.t<600||p.t>=720).filter(p=>p.t<870).reduce((sum,p)=>sum+p.value,0);
  assert.equal(d.steps,expected);
});
test('F05/F11: stale data applies to home, week, day and category pulse, then transfer fills it', () => {
  for(const id of Object.keys(deviceScenarios)) {
    let s=reduce(state(),{type:'device',value:id});const d=selectDay(s);
    assert.ok(d.pulse.every(p=>p.t<s.device.dataThrough));
    assert.ok(d.activity.every(a=>a.end<=Math.max(480,s.device.dataThrough)));
    assert.ok(s.device.dataThrough<=s.device.lastTransfer && s.device.lastTransfer<=s.session.clock);
    assert.equal(selectWeek(s).movement,selectWeek(s).days.filter(d=>d.hasData).reduce((sum,d)=>sum+d.movement,0));
    if(['G04','G05','G06','G07'].includes(id)) {
      assert.ok(d.movement<15);assert.equal(d.pulseOther.mean,pulseStats(d.pulse.filter(p=>p.kind==='other')).mean);
      const before=selectWeek(s).movement;
      s=reduce(reduce(s,{type:'transferStart'}),{type:'transferEnd'});
      if(id==='G07') {assert.equal(selectWeek(s).movement,before);assert.equal(s.device.transfer,'failed');}
      else {assert.equal(selectWeek(s).movement,80);assert.equal(selectDay(s).steps,650);}
    }
  }
});
test('F19/F21: selected week/day navigation is direct, guarded and reset preserves session', () => {
  const s=state();const past=addDays(s.week,-7);
  let a=reduce(s,{type:'week',week:past}); assert.equal(a.view,'week');assert.equal(a.week,past);
  a=reduce(a,{type:'date',date:addDays(past,3)});assert.equal(a.view,'day');assert.equal(a.week,past);
  a=reduce(a,{type:'back'});assert.equal(a.view,'week');assert.equal(a.week,past);
  assert.equal(reduce(a,{type:'date',date:'2099-01-01'}),a);
  assert.equal(reduce(a,{type:'week',week:'1900-01-01'}),a);
  const reset=reduce(a,{type:'reset'});assert.deepEqual(reset,s);assert.equal(reset.session,s.session);
});
test('F11: loading is independent from data and storage; unknown runtime remains null', () => {
  let s=reduce(state(),{type:'device',value:'G08'});
  s=reduce(reduce(s,{type:'chargeStart'}),{type:'chargeEnd'});
  assert.equal(s.device.battery,100);assert.equal(s.device.storage,4);
  assert.equal(getDevice(session(),'G09').runtime,null);
});

test('F16: local day differs correctly from UTC in device timezones', async () => {
  const {execFileSync}=await import('node:child_process');
  const code="import {createSession} from './src/calendar.js'; console.log(createSession(new Date('2027-01-01T00:30:00Z')).today)";
  for(const [tz,expected] of [['America/Los_Angeles','2026-12-31'],['Pacific/Kiritimati','2027-01-01']]) {
    assert.equal(execFileSync(process.execPath,['--input-type=module','-e',code],{encoding:'utf8',env:{...process.env,TZ:tz}}).trim(),expected);
  }
});
