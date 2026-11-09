import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile, access } from 'node:fs/promises';
import vm from 'node:vm';

test('F13/F14: built subpath assets, manifest and cache support offline navigation', async () => {
  execFileSync(process.execPath, ['scripts/build.js']);
  const sw = await readFile('dist/sw.js','utf8');
  assert.ok(!sw.includes('__BUILD_ID__'));
  assert.ok(!sw.includes('__PRECACHE__'));
  const manifest = JSON.parse(await readFile('dist/manifest.webmanifest','utf8'));
  assert.equal(manifest.scope,'./'); assert.equal(manifest.start_url,'./');
  const handlers = {};
  const stored = new Map();
  let deleted = false, claimed = false;
  const cache = {
    addAll: async urls => {
      for (const url of urls) {
        const relative = new URL(url).pathname.replace('/SMARTwearable/','');
        await access(`dist/${relative}`);
        stored.set(url, `cached:${relative}`);
      }
    },
    match: async request => stored.get(typeof request === 'string' ? request : request.url)
  };
  const context = vm.createContext({ URL,
    self: { location: { href:'https://example.test/SMARTwearable/sw.js' },
      addEventListener: (name, handler) => handlers[name] = handler,
      clients: { claim: async () => { claimed = true; } }, skipWaiting() {} },
    caches: { open: async () => cache, keys: async () => ['smartwearable-old','unrelated-cache'], delete: async key => { assert.equal(key,'smartwearable-old'); deleted = true; } },
    fetch: async () => { throw Error('offline'); }
  });
  vm.runInContext(sw, context);
  let promise;
  handlers.install({ waitUntil: p => promise = p }); await promise;
  assert.ok(stored.has('https://example.test/SMARTwearable/index.html'));
  assert.ok(stored.has('https://example.test/SMARTwearable/src/app.js'));
  assert.ok(stored.has('https://example.test/SMARTwearable/src/calendar.js'));
  assert.ok(stored.has('https://example.test/SMARTwearable/src/charts.js'));
  assert.ok(stored.has('https://example.test/SMARTwearable/src/settings.js'));
  handlers.activate({ waitUntil: p => promise = p }); await promise;
  assert.ok(claimed && deleted);
  handlers.fetch({ request: { method:'GET', url:'https://example.test/SMARTwearable/', mode:'navigate' }, respondWith: p => promise = p });
  assert.equal(await promise,'cached:index.html');
  handlers.fetch({ request: { method:'GET', url:'https://example.test/SMARTwearable/src/app.js', mode:'cors' }, respondWith: p => promise = p });
  assert.equal(await promise,'cached:src/app.js');
  let intercepted = false;
  handlers.fetch({ request: { method:'GET',url:'https://example.test/other/',mode:'navigate' }, respondWith: () => intercepted = true });
  assert.equal(intercepted,false);
});
