import './generate.mjs';
import {mkdir,cp,rm} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});await mkdir('dist/vendor',{recursive:true});
for(const file of ['index.html','404.html','style.css','app.js','hero-scene.js','media.js','site-config.js','robots.txt','services','about','pricing','contact'])await cp(file,`dist/${file}`,{recursive:true});
await cp('assets','dist/assets',{recursive:true});
// Keep legacy illustrative previews out of the new public site.
await rm('dist/assets/product',{recursive:true,force:true});
for(const file of ['three.module.js','three.core.js'])await cp(`node_modules/three/build/${file}`,`dist/vendor/${file}`);
await cp('node_modules/three/LICENSE','dist/vendor/THREE-LICENSE.txt');
console.log('Five-page SeraPOS site built in dist/ with local media, fonts and WebGL dependencies.');
