#!/usr/bin/env node
/* Precache тізімін жасайды: precache-manifest.js (файл тізімі + нұсқа хэші).
   Әр деплой алдында іске қосыңыз:  node scripts/build-sw.js
   Кез келген файл өзгерсе — нұсқа хэші өзгереді → sw.js жаңа кэш жасап, ескісін өшіреді. */
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const root = path.join(__dirname, '..');
const SKIP_DIR = new Set(['.git', 'node_modules', 'scripts']);
const SKIP_FILE = new Set(['sw.js', 'precache-manifest.js', 'README.md', '.gitignore', '.DS_Store', '_failed.txt', 'vercel.json']);
const core = [], photos = [];
(function walk(dir){
  for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name < b.name ? -1 : 1)){
    if (e.isDirectory()){ if (!SKIP_DIR.has(e.name)) walk(path.join(dir, e.name)); continue; }
    if (SKIP_FILE.has(e.name) || e.name.startsWith('.')) continue;
    const rel = path.relative(root, path.join(dir, e.name)).split(path.sep).join('/');
    (rel.startsWith('assets/mosques/') ? photos : core).push(rel);
  }
})(root);
const h = crypto.createHash('sha1');
for (const f of core){ h.update(f); h.update(fs.readFileSync(path.join(root, f))); }
const version = h.digest('hex').slice(0, 10);
const urls = f => f === 'index.html' ? ['./', './index.html'] : ['./' + f];
const out = `/* Автоматты жасалған (scripts/build-sw.js) — қолмен өзгертпеңіз */
self.PRECACHE_VERSION = ${JSON.stringify(version)};
self.PRECACHE_CORE = ${JSON.stringify(core.flatMap(urls))};
self.PRECACHE_PHOTOS = ${JSON.stringify(photos.map(f => './' + f))};
`;
fs.writeFileSync(path.join(root, 'precache-manifest.js'), out);
console.log(`core: ${core.length} файл, photos: ${photos.length}, version: ${version}`);
