import {mkdir,cp,rm} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});await mkdir('dist',{recursive:true});
for(const file of ['index.html','style.css','app.js','product-preview.css','product-preview.js','media.js','preview.html','robots.txt'])await cp(file,`dist/${file}`);
await cp('assets','dist/assets',{recursive:true});console.log('Static site built in dist/');
