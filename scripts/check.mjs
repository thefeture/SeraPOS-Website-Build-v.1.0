import {readFile,access,readdir,stat} from 'node:fs/promises';
import {resolve} from 'node:path';
import {media} from '../media.js';
const pages=['index.html','about/index.html','services/index.html','pricing/index.html','contact/index.html','404.html'];
const documents=new Map();
for(const page of pages){
 const html=await readFile(page,'utf8');documents.set('/'+page.replace(/index\.html$/,''),html);
 if(/Laptop Gallery|Fazlur|Delowar|premotio|Morgane56|fazlurrahman370/i.test(html))throw Error('Non-public source identity in '+page);
 if(!html.includes('noindex'))throw Error('Review indexing missing');
 if([...html.matchAll(/<h1\b/g)].length!==1)throw Error('Expected one h1 in '+page);
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);if(new Set(ids).size!==ids.length)throw Error('Duplicate ID in '+page);
}
for(const [page,html] of documents){
 for(const match of html.matchAll(/(?:href|src)="([^"?]+)(?:\?[^"]*)?"/g)){
  const target=match[1];if(/^(https?:|mailto:|data:)/.test(target))continue;
  const [pathname,anchor]=target.split('#');const path=pathname||page;
  const file=path.endsWith('/')?path+'index.html':path;await access(resolve('.','.'+file));
  if(anchor){const text=documents.get(path)||await readFile('.'+file,'utf8');if(!text.includes(`id="${anchor}"`))throw Error(`Broken anchor ${target} on ${page}`);}
 }
}
const home=documents.get('/');if([...home.matchAll(/<section\b/g)].length!==6)throw Error('Home must have exactly six content sections');
for(const asset of Object.values(media)){const b=await readFile('.'+asset.src);if(b.toString('ascii',0,4)!=='RIFF'||b.toString('ascii',8,12)!=='WEBP')throw Error('Invalid WebP: '+asset.src);if(!asset.alt||asset.width<1||asset.height<1)throw Error('Missing media metadata');}
await access('node_modules/three/build/three.module.js');
console.log('Passed: five page routes + 404, links/anchors/assets, unique headings and IDs, six home sections, approved identity boundary, image metadata and preview indexing.');
