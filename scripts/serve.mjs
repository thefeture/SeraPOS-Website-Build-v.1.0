import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {extname,resolve,sep} from 'node:path';
const root=resolve(process.cwd());
const args=process.argv.slice(2);const value=(key,fallback)=>args.includes(key)?args[args.indexOf(key)+1]:fallback;
const port=Number(value('--port',process.env.PORT||4173));const host=value('--host','0.0.0.0');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.woff2':'font/woff2','.png':'image/png','.webp':'image/webp','.json':'application/json','.txt':'text/plain'};
http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://local');let pathname=decodeURIComponent(url.pathname);if(pathname==='/')pathname='/index.html';const file=resolve(root,'.'+pathname);if(!file.startsWith(root+sep)||pathname.includes('/.')){res.writeHead(403);res.end('Forbidden');return;}const info=await stat(file);if(!info.isFile())throw Error('missing');const content=await readFile(file);res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(content);}catch{res.writeHead(404,{'Content-Type':'text/plain'});res.end('Page not found');}}).listen(port,host,()=>console.log(`SeraPOS preview listening on ${host}:${port}`));
