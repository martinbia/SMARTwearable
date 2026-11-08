import test from 'node:test';
import assert from 'node:assert/strict';

test('C2 → W2 → selected D1 → day; all subpages return home and reset works', async () => {
  const events={};const app={innerHTML:'',addEventListener:(type,fn)=>{(events[type]??=[]).push(fn);}};
  const status={textContent:''};
  globalThis.document={querySelector:s=>s==='#app'?app:s==='#announcement'?status:{focus(){}}};
  globalThis.window={addEventListener(){},confirm:()=>true,scrollTo(){}};
  const RealDate=Date;const fixed=new RealDate(2026,10,12,14,30).getTime();
  globalThis.Date=class extends RealDate {constructor(...args){super(...(args.length?args:[fixed]));}static now(){return fixed;}};
  const click=async(action,data={})=>{for(const fn of events.click)await fn({target:{closest:()=>({dataset:{action,...data}})}});};
  const change=(action,value)=>events.change.forEach(fn=>fn({target:{dataset:{change:action},value}}));
  try {
    await import('../src/app.js');
    assert.match(app.innerHTML,/data-testid="week-minutes">80</);
    assert.doesNotMatch(app.innerHTML,/Schritte|Puls|metric-link|home-cards/);
    assert.match(app.innerHTML,/compact-shell/);
    assert.match(app.innerHTML,/Woche nach Tagen →/);
    assert.match(app.innerHTML,/Mein Armband/);
    assert.match(app.innerHTML,/Armband-Akku 62 %/);assert.ok(!app.innerHTML.includes('data-action="home"'));
    for(let i=0;i<10;i++) {
      await click('weeks');assert.match(app.innerHTML,/Meine Wochen im Vergleich/);assert.ok(!app.innerHTML.includes('role="tab"'));
      await click('selectWeek',{week:'2026-11-02'});assert.match(app.innerHTML,/95 Bewegungsminuten/);
      assert.match(app.innerHTML,/class="home-button"/);
      await click('date',{date:'2026-11-05'});assert.match(app.innerHTML,/Puls im Tagesverlauf/);
      await click('back');assert.match(app.innerHTML,/95 Bewegungsminuten/);
      await click('home');await click('currentWeek');assert.match(app.innerHTML,/Bei sonstiger Bewegung/);
      await click('controls');change('scenario','S03');change('device','G05');
      await click('home');assert.ok(!app.innerHTML.includes('data-testid="week-minutes">80<'));
      await click('controls');await click('reset');assert.match(app.innerHTML,/data-testid="week-minutes">80</);
    }
    for(const action of ['info','device','controls','weeks','currentWeek','today']) {
      await click(action);assert.match(app.innerHTML,/class="home-button"/);await click('home');
    }
    await click('controls');change('device','G05');await click('transfer');
    await new Promise(r=>setTimeout(r,1250));await click('home');assert.match(app.innerHTML,/data-testid="week-minutes">80</);
    await click('controls');change('device','G07');await click('transfer');await new Promise(r=>setTimeout(r,1250));
    assert.match(app.innerHTML,/fehlgeschlagen/);
    await click('transfer');await click('reset');await click('controls');
    assert.ok(!app.innerHTML.includes('data-action="transfer" disabled'));
  } finally {globalThis.Date=RealDate;delete globalThis.document;delete globalThis.window;}
});
