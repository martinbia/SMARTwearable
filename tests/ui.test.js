import test from 'node:test';
import assert from 'node:assert/strict';

test('C2 → W2 → selected D1 → day; all subpages return home and reset works', async () => {
  const events={};const app={innerHTML:'',addEventListener:(type,fn)=>{(events[type]??=[]).push(fn);},querySelector:selector=>selector==='.stop-motion'?null:selector==='.entry-shell'?(app.innerHTML.includes('class="entry-shell"')?{}:null):({focus(){},scrollIntoView(){}})};
  const status={textContent:''};
  const saved = new Map([['smartwearable-preferences-v1',JSON.stringify({schema:1,pulseAlerts:true,activityReminder:false,shareWithCareTeam:false})]]);
  globalThis.localStorage={getItem:key=>saved.get(key)??null,setItem:(key,value)=>saved.set(key,value),removeItem:key=>saved.delete(key)};
  globalThis.document={querySelector:s=>s==='#app'?app:s==='#announcement'?status:{focus(){}}};
  let timerId=0;const scheduled=[];globalThis.window={addEventListener(){},confirm:()=>true,scrollTo(){},setTimeout:fn=>{scheduled.push(fn);return ++timerId;},clearTimeout(){},matchMedia:()=>({matches:false}),localStorage:globalThis.localStorage};
  const RealDate=Date;const fixed=new RealDate(2026,10,12,14,30).getTime();
  globalThis.Date=class extends RealDate {constructor(...args){super(...(args.length?args:[fixed]));}static now(){return fixed;}};
  const click=async(action,data={})=>{for(const fn of events.click)await fn({target:{closest:()=>({dataset:{action,...data}})}});};
  const change=(action,value)=>events.change.forEach(fn=>fn({target:{dataset:{change:action},value}}));
  try {
    await import('../src/app.js');
    assert.match(app.innerHTML,/class="entry-shell"/);
    assert.match(app.innerHTML,/Gut vorbereitet mit Ihrem Armband/);
    assert.match(app.innerHTML,/Automatischer Wechsel in 20 s/);
    assert.match(app.innerHTML,/<h2>Wasserdicht<\/h2><p>Sie können das Armband auch beim Duschen tragen\.<\/p>/);
    assert.match(app.innerHTML,/<h2>Möglichst den ganzen Tag tragen<\/h2><p>So erhalten Sie ein vollständigeres Bild Ihrer Aktivitäten im Alltag\.<\/p>/);
    assert.doesNotMatch(app.innerHTML,/Beispielangabe im Mock-up|Beispielhinweis im Mock-up/);
    assert.equal((app.innerHTML.match(/class="entry-disclaimer"/g)??[]).length,1);
    await click('openSetup');
    assert.match(app.innerHTML,/class="settings-shell"/);
    scheduled[0]?.();
    assert.match(app.innerHTML,/class="settings-shell"/,'a stale countdown callback must not navigate twice');
    assert.match(app.innerHTML,/class="bracelet-gallery"/);
    assert.match(app.innerHTML,/frame-01\.png/);assert.match(app.innerHTML,/frame-06\.png/);
    assert.equal((app.innerHTML.match(/class="stop-motion-frame/g)||[]).length,6);
    assert.match(app.innerHTML,/frame-05\.png/);
    assert.match(app.innerHTML,/name="pulseAlerts" value="true"[^>]*checked/);
    assert.match(app.innerHTML,/name="activityReminder" value="false"[^>]*checked/);
    assert.match(app.innerHTML,/name="shareWithCareTeam" value="false"[^>]*checked/);
    await click('savePreferences');
    assert.match(app.innerHTML,/data-testid="week-minutes">80</);
    assert.doesNotMatch(app.innerHTML.slice(app.innerHTML.indexOf('<main'),app.innerHTML.indexOf('</main>')),/Schritte|Puls|metric-link|home-cards/);
    assert.match(app.innerHTML,/compact-shell/);
    assert.match(app.innerHTML,/Woche nach Tagen →/);
    assert.match(app.innerHTML,/Mein Armband/);
    assert.match(app.innerHTML,/Armband-Akku 62 %/);assert.ok(!app.innerHTML.includes('data-action="home"'));
    const homeMarkup = app.innerHTML;
    for(let i=0;i<10;i++) {
      await click('weeks');assert.match(app.innerHTML,/Meine Wochen im Vergleich/);assert.ok(!app.innerHTML.includes('role="tab"'));
      await click('selectWeek',{week:'2026-11-02'});assert.match(app.innerHTML,/95 Bewegungsminuten/);
      assert.match(app.innerHTML,/class="home-button"/);
      assert.doesNotMatch(app.innerHTML,/brand-name|site-header|date-status/);
      assert.match(app.innerHTML,/detail-toolbar/);
      await click('date',{date:'2026-11-05'});assert.match(app.innerHTML,/Puls im Tagesverlauf/);
      assert.match(app.innerHTML,/class="more-details"/);
      assert.ok(!app.innerHTML.includes('class="more-details" open'));
      assert.doesNotMatch(app.innerHTML,/brand-name|site-header|date-status/);
      await click('back');assert.match(app.innerHTML,/95 Bewegungsminuten/);
      await click('home');assert.equal(app.innerHTML,homeMarkup);await click('currentWeek');assert.match(app.innerHTML,/Puls bei Bewegung/);
      await click('controls');change('scenario','S03');change('device','G05');
      await click('home');assert.ok(!app.innerHTML.includes('data-testid="week-minutes">80<'));
      await click('controls');await click('reset');assert.match(app.innerHTML,/data-testid="week-minutes">80</);
    }
    for(const action of ['info','device','controls','weeks','currentWeek','today']) {
      await click(action);assert.match(app.innerHTML,/class="home-button"/);await click('home');
    }
    await click('home');assert.match(app.innerHTML,/aria-label="Meine Einstellungen"/);
    assert.match(app.innerHTML,/Pulshinweise.*Ein/);assert.match(app.innerHTML,/Aktivitätserinnerung.*Aus/);assert.match(app.innerHTML,/Datenfreigabe.*Nur ich/);
    await click('openPreference',{preferenceKey:'pulseAlerts'});assert.match(app.innerHTML,/Ihr Armband – Ihre Einstellungen/);
    assert.match(app.innerHTML,/name="pulseAlerts" value="true"[^>]*checked/);
    events.change.forEach(fn=>fn({target:{dataset:{preference:'pulseAlerts'},value:'false'}}));
    await click('cancelSettings');assert.match(app.innerHTML,/Pulshinweise.*Ein/);
    await click('openPreference',{preferenceKey:'pulseAlerts'});
    events.change.forEach(fn=>fn({target:{dataset:{preference:'pulseAlerts'},value:'false'}}));
    await click('savePreferences');assert.match(app.innerHTML,/Pulshinweise.*Aus/);
    const written=JSON.parse(saved.get('smartwearable-preferences-v1'));assert.equal(written.pulseAlerts,false);
    await click('controls');await click('resetPreferences');assert.match(app.innerHTML,/Ihr Armband – Ihre Einstellungen/);
    assert.equal(saved.has('smartwearable-preferences-v1'),false);
    for(const [key,value] of [['pulseAlerts','true'],['activityReminder','false'],['shareWithCareTeam','false']])
      events.change.forEach(fn=>fn({target:{dataset:{preference:key},value}}));
    await click('savePreferences');assert.match(app.innerHTML,/data-testid="week-minutes">80</);
    await click('controls');change('device','G05');await click('transfer');
    await new Promise(r=>setTimeout(r,1250));await click('home');assert.match(app.innerHTML,/data-testid="week-minutes">80</);
    await click('controls');change('device','G07');await click('transfer');await new Promise(r=>setTimeout(r,1250));
    assert.match(app.innerHTML,/fehlgeschlagen/);
    await click('transfer');await click('reset');await click('controls');
    assert.ok(!app.innerHTML.includes('data-action="transfer" disabled'));
  } finally {globalThis.Date=RealDate;delete globalThis.document;delete globalThis.window;delete globalThis.localStorage;}
});
