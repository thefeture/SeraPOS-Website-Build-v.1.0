import * as THREE from '/vendor/three.module.js';
import {media,heroTiles} from './media.js';

export async function startHeroScene(host, motion) {
  let renderer;
  try { renderer = new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'}); }
  catch { host.dataset.renderer='fallback'; return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.5));
  renderer.setClearColor(0x000000,0);
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  host.appendChild(renderer.domElement);
  renderer.domElement.setAttribute('aria-hidden','true');
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(35,1,1,6000);
  const cards=[];
  let w=0,h=0,elapsed=0,last=0,raf=0,inView=true,frames=0,pointerX=0,pointerY=0;
  const desktop=[
    [.065,.34,300,-9,-.18,.16,40], [.965,.40,220,10,.2,-.22,-45],
    [.10,.65,360,5,.12,.15,25], [.91,.69,350,-7,-.15,-.18,0],
    [.22,.89,430,-5,.08,.15,10], [.58,.85,480,5,-.12,-.10,35],
    [.57,1.03,480,-4,.1,.08,-30], [.035,.93,155,10,-.1,.2,-25]
  ];
  const mobile=[
    [.20,.68,265,-7,-.12,.14,10], [.93,.79,175,8,.16,-.20,-25],
    [.07,.88,230,5,.13,.18,5], [.80,.59,235,6,-.12,-.16,0],
    [.20,1.1,200,0,0,0,0], [.56,.89,280,-5,-.08,-.12,20],
    [.5,1.15,280,0,0,0,0], [.5,1.2,100,0,0,0,0]
  ];
  // Texture padding includes a soft shadow and a rounded mask. The UI pixels are
  // taken directly from the approved screenshot crops, not redrawn interfaces.
  async function makeTexture(key){
    const img=new Image();img.decoding='async';img.src=media[key].src;await img.decode();
    const maxWidth=1100,scale=Math.min(1,maxWidth/img.width),iw=Math.round(img.width*scale),ih=Math.round(img.height*scale),pad=46;
    const canvas=document.createElement('canvas');canvas.width=iw+pad*2;canvas.height=ih+pad*2;
    const ctx=canvas.getContext('2d');if(!ctx)throw Error('No texture canvas');
    const radius=Math.min(22,iw*.03);
    ctx.shadowColor='rgba(39,68,104,.19)';ctx.shadowBlur=30;ctx.shadowOffsetY=10;
    ctx.fillStyle='#fff';ctx.beginPath();ctx.roundRect(pad,pad,iw,ih,radius);ctx.fill();
    ctx.shadowColor='transparent';ctx.save();ctx.beginPath();ctx.roundRect(pad,pad,iw,ih,radius);ctx.clip();ctx.drawImage(img,pad,pad,iw,ih);ctx.restore();
    ctx.strokeStyle='rgba(169,186,207,.36)';ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(pad+.5,pad+.5,iw-1,ih-1,radius);ctx.stroke();
    const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());
    return {texture,ratio:canvas.height/canvas.width,expand:canvas.width/iw};
  }
  try {
    const textures=await Promise.all(heroTiles.map(makeTexture));
    textures.forEach((t,i)=>{
      const mesh=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:t.texture,transparent:true,depthWrite:false,side:THREE.DoubleSide}));
      scene.add(mesh);cards.push({mesh,...t,index:i});
    });
  } catch(error) {renderer.dispose();renderer.domElement.remove();host.dataset.renderer='fallback';return;}
  function size(){
    const box=host.getBoundingClientRect();w=box.width;h=box.height;
    renderer.setSize(w,h,false);camera.aspect=w/h;camera.position.z=h/(2*Math.tan(THREE.MathUtils.degToRad(35/2)));camera.updateProjectionMatrix();draw();
  }
  function draw(){
    const small=w<=700;const specs=small?mobile:desktop;const widthScale=small?Math.min(1,w/420):Math.min(1.23,Math.max(.76,w/1512));
    const enabled=motion.enabled;
    const scroll=enabled?Math.min(1,Math.max(0,-host.getBoundingClientRect().top/h)):0;
    cards.forEach(({mesh,ratio,expand,index},i)=>{
      const s=specs[i];mesh.visible=!(small&&[4,6,7].includes(i));
      const drift=enabled?Math.sin(elapsed*.42+i*1.7)*9:0;
      let x=(s[0]-.5)*w;let y=(.5-s[1])*h;
      x*=1+scroll*.16;
      y+=drift+scroll*(100+(i%3)*65);
      mesh.position.set(x+(enabled?pointerX*(i%2?9:-7):0),y+(enabled?pointerY*5:0),s[6]+(enabled?Math.sin(elapsed*.3+i)*9:0));
      mesh.rotation.set(s[4]+(enabled?Math.sin(elapsed*.25+i)*.025:0)+scroll*.07,s[5]+scroll*(i%2?.3:-.3),THREE.MathUtils.degToRad(s[3])+(enabled?Math.sin(elapsed*.2+i)*.012:0));
      const width=s[2]*widthScale*expand;mesh.scale.set(width,width*ratio,1);
    });
    renderer.render(scene,camera);frames++;if(frames%30===0||frames===1)host.dataset.frames=String(frames);
  }
  function tick(now){raf=0;const delta=last?Math.min((now-last)/1000,.05):0;last=now;if(motion.enabled)elapsed+=delta;draw();if(inView&&!document.hidden&&motion.enabled)raf=requestAnimationFrame(tick);}
  function wake(){if(!raf&&inView&&!document.hidden)raf=requestAnimationFrame(tick);}
  const ro=new ResizeObserver(size);ro.observe(host);
  const io=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;last=0;if(inView)wake();else if(raf){cancelAnimationFrame(raf);raf=0;}},{threshold:0});io.observe(host);
  window.addEventListener('scroll',wake,{passive:true});document.addEventListener('visibilitychange',()=>{last=0;if(!document.hidden)wake();});
  window.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'){pointerX=(e.clientX/window.innerWidth-.5);pointerY=(e.clientY/window.innerHeight-.5);}},{passive:true});
  host.addEventListener('motionchange',()=>{last=0;draw();wake();});
  renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();host.dataset.renderer='fallback';if(raf)cancelAnimationFrame(raf);});
  size();host.dataset.renderer='webgl';wake();
  window.addEventListener('pagehide',()=>{cancelAnimationFrame(raf);ro.disconnect();io.disconnect();cards.forEach(({mesh,texture})=>{texture.dispose();mesh.geometry.dispose();mesh.material.dispose();});renderer.dispose();},{once:true});
}
