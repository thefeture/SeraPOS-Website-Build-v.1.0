import * as THREE from 'three';
import {media,heroTiles} from './media.js';

export async function startHeroScene(host,motion){
 let renderer;
 try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}
 catch{host.dataset.renderer='fallback';return;}
 renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
 renderer.setClearColor(0x000000,0);renderer.outputColorSpace=THREE.SRGBColorSpace;
 host.appendChild(renderer.domElement);renderer.domElement.setAttribute('aria-hidden','true');
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,1,6000),cards=[];
 const labels=['Sales overview','Product catalogue','Customer invoices','Stock alerts','Customer wallet','Business insights','Revenue overview','Product status'];
 let w=0,h=0,elapsed=0,last=0,raf=0,inView=true,frames=0,pointerX=0,pointerY=0,mouseX=0,mouseY=0,scroll=0,origin=0;
 const desktop=[
  [.055,.34,315,-4,-.09,.10,20],[.955,.41,238,4,.08,-.11,-10],
  [.09,.65,360,3,.07,.09,0],[.915,.70,375,-3,-.05,-.09,12],
  [.24,.91,430,-3,.04,.08,15],[.59,.86,470,2,-.06,-.07,35],
  [.585,1.035,460,-2,.06,.05,-10],[.035,.935,155,4,-.05,.1,-15]
 ];
 const mobile=[
  [.18,.69,270,-4,-.08,.08,10],[.96,.80,178,4,.08,-.1,-20],
  [.07,.9,225,3,.07,.09,0],[.81,.59,235,3,-.05,-.08,0],
  [.2,1.1,200,0,0,0,0],[.56,.89,280,-3,-.04,-.07,20],
  [.5,1.2,280,0,0,0,0],[.5,1.2,100,0,0,0,0]
 ];
 async function makeTexture(key,index){
  const img=new Image();img.decoding='async';img.src=media[key].src;await img.decode();
  const scale=Math.min(1,1400/img.width),iw=Math.round(img.width*scale),ih=Math.round(img.height*scale),pad=68,bar=Math.round(iw*.036),radius=Math.min(22,iw*.026);
  const canvas=document.createElement('canvas');canvas.width=iw+pad*2;canvas.height=ih+bar+pad*2;
  const ctx=canvas.getContext('2d');if(!ctx)throw Error('No texture canvas');
  ctx.shadowColor='rgba(25,57,88,.14)';ctx.shadowBlur=42;ctx.shadowOffsetY=18;
  ctx.fillStyle='#fff';ctx.beginPath();ctx.roundRect(pad,pad,iw,ih+bar,radius);ctx.fill();
  ctx.shadowColor='transparent';ctx.save();ctx.beginPath();ctx.roundRect(pad,pad,iw,ih+bar,radius);ctx.clip();
  ctx.fillStyle='#fcfdff';ctx.fillRect(pad,pad,iw,bar);
  ctx.fillStyle='#0084ff';ctx.beginPath();ctx.arc(pad+iw*.022,pad+bar/2,iw*.0026,0,Math.PI*2);ctx.fill();
  ctx.font=`500 ${Math.round(iw*.0115)}px Inter, sans-serif`;ctx.fillStyle='#7b8da2';ctx.textBaseline='middle';ctx.fillText(`SeraPOS / ${labels[index]}`,pad+iw*.037,pad+bar/2);
  ctx.strokeStyle='#e7edf4';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(pad,pad+bar);ctx.lineTo(pad+iw,pad+bar);ctx.stroke();
  ctx.drawImage(img,pad,pad+bar,iw,ih);ctx.restore();
  ctx.strokeStyle='rgba(132,159,188,.32)';ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(pad+.5,pad+.5,iw-1,ih+bar-1,radius);ctx.stroke();
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
  return{texture,ratio:canvas.height/canvas.width,expand:canvas.width/iw};
 }
 try{
  await document.fonts.ready;
  const textures=await Promise.all(heroTiles.map(makeTexture));
  textures.forEach((t,index)=>{const mesh=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:t.texture,transparent:true,depthWrite:false,side:THREE.DoubleSide}));scene.add(mesh);cards.push({mesh,...t,index});});
 }catch{renderer.dispose();renderer.domElement.remove();host.dataset.renderer='fallback';return;}
 function size(){const box=host.getBoundingClientRect();w=box.width;h=box.height;origin=box.top+window.scrollY;renderer.setSize(w,h,false);camera.aspect=w/h;camera.position.z=h/(2*Math.tan(THREE.MathUtils.degToRad(17.5)));camera.updateProjectionMatrix();draw();}
 function draw(){
  const small=w<=700,specs=small?mobile:desktop,field=Math.min(w,1980),widthScale=small?Math.min(1,w/420):Math.min(1.25,Math.max(.76,w/1512));
  cards.forEach(({mesh,ratio,expand},i)=>{
   const s=specs[i];mesh.visible=!(small&&[4,6,7].includes(i));
   const entrance=motion.enabled?THREE.MathUtils.smoothstep(elapsed-i*.055,0,1.25):1;
   const drift=Math.sin(elapsed*.30+i*1.25)*3.5;
   let x=(s[0]-.5)*field*(1+scroll*.13),y=(.5-s[1])*h+drift+scroll*(95+(i%3)*45)-(1-entrance)*28;
   mesh.position.set(x+pointerX*(i%2?10:-8),y+pointerY*6,s[6]+Math.sin(elapsed*.22+i)*4-scroll*20);
   mesh.rotation.set(s[4]+Math.sin(elapsed*.2+i)*.012+scroll*.035,s[5]+scroll*(i%2?.13:-.13),THREE.MathUtils.degToRad(s[3])+Math.sin(elapsed*.16+i)*.006);
   const width=s[2]*widthScale*expand;mesh.scale.set(width,width*ratio,1);mesh.material.opacity=entrance;
  });
  renderer.render(scene,camera);frames++;if(frames%30===0||frames===1)host.dataset.frames=String(frames);
 }
 function tick(now){
  raf=0;const delta=last?Math.min((now-last)/1000,.05):1/60;last=now;
  if(motion.enabled){elapsed+=delta;const ease=1-Math.exp(-delta/0.18);pointerX+=(mouseX-pointerX)*ease;pointerY+=(mouseY-pointerY)*ease;scroll+=(Math.min(1,Math.max(0,(window.scrollY-origin)/h))-scroll)*ease;}
  draw();if(inView&&!document.hidden&&motion.enabled)raf=requestAnimationFrame(tick);
 }
 function wake(){if(!raf&&inView&&!document.hidden)raf=requestAnimationFrame(tick);}
 const ro=new ResizeObserver(size);ro.observe(host);
 const io=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;last=0;if(inView)wake();else if(raf){cancelAnimationFrame(raf);raf=0;}},{threshold:0});io.observe(host);
 window.addEventListener('scroll',wake,{passive:true});document.addEventListener('visibilitychange',()=>{last=0;if(!document.hidden)wake();});
 window.addEventListener('pointermove',event=>{if(event.pointerType==='mouse'){mouseX=event.clientX/window.innerWidth-.5;mouseY=event.clientY/window.innerHeight-.5;}},{passive:true});
 host.addEventListener('motionchange',()=>{last=0;draw();wake();});
 renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();host.dataset.renderer='fallback';if(raf)cancelAnimationFrame(raf);});
 size();host.dataset.renderer='webgl';wake();
 window.addEventListener('pageshow',event=>{if(event.persisted){last=0;size();wake();}});
 window.addEventListener('pagehide',event=>{if(event.persisted)return;cancelAnimationFrame(raf);ro.disconnect();io.disconnect();cards.forEach(({mesh,texture})=>{texture.dispose();mesh.geometry.dispose();mesh.material.dispose();});renderer.dispose();});
}
