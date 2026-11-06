import { mkdir, cp, readdir, writeFile, readFile, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
await cp('public', 'dist', { recursive: true });
await cp('src', 'dist/src', { recursive: true });
const files = [];
async function walk(dir) {
  for (const f of await readdir(dir, { withFileTypes: true })) {
    const path = `${dir}/${f.name}`;
    if (f.isDirectory()) await walk(path);
    else if (f.name !== 'sw.js') files.push(path.slice(5));
  }
}
await walk('dist');
files.sort();
const hash = createHash('sha256');
for (const f of files) hash.update(await readFile(`dist/${f}`));
const sw = (await readFile('public/sw.js', 'utf8')).replace('__BUILD_ID__', hash.digest('hex').slice(0, 12)).replace("'__PRECACHE__'", JSON.stringify(files));
await writeFile('dist/sw.js', sw);
await writeFile('dist/.nojekyll', '');
console.log(`Built ${files.length} local assets; content-versioned offline cache.`);
