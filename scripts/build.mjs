import './generate.mjs';
import {mkdir,cp,rm} from 'node:fs/promises';
import {build} from 'esbuild';
await rm('dist',{recursive:true,force:true});await mkdir('dist',{recursive:true});
for(const file of ['index.html','404.html','style.css','app.js','media.js','site-config.js','robots.txt','services','about','pricing','contact'])await cp(file,`dist/${file}`,{recursive:true});
await cp('assets','dist/assets',{recursive:true});
// Keep legacy illustrative previews out of the new public site.
await rm('dist/assets/product',{recursive:true,force:true});
await build({entryPoints:['hero-scene.js'],outfile:'dist/hero-scene.js',bundle:true,minify:true,format:'esm',target:'es2022',legalComments:'linked'});
console.log('Five-page SeraPOS site built in dist/ with local media, fonts and a minified WebGL bundle.');
