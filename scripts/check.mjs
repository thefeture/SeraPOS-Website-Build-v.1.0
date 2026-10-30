import {readFile,access} from 'node:fs/promises';
const html=await readFile('index.html','utf8');const css=await readFile('style.css','utf8');
if(/Laptop Gallery|Fazlur|Delowar|premotio/i.test(html))throw Error('Unrelated identity in public content');
if(!html.includes('noindex'))throw Error('Review build must stay noindex');
for(const path of [...html.matchAll(/(?:href|src)="(\/[^"#?]+)"/g),...css.matchAll(/url\('(\/[^']+)'\)/g)].map(x=>x[1]))await access('.'+path);
for(const id of ['top','product','experience','next','main'])if(!html.includes(`id="${id}"`))throw Error(`Missing anchor: ${id}`);
console.log('Public identity, review indexing, anchors and initial file references checked.');
