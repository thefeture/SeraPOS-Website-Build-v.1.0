import {mountPreviews} from './product-preview.js';
mountPreviews();
document.querySelectorAll('[data-icon]').forEach(el=>{const img=document.createElement('img');img.src=`/assets/icons/${el.dataset.icon}.svg`;img.alt='';img.width=20;img.height=20;el.replaceChildren(img);});
document.querySelector('#year').textContent=new Date().getFullYear();
const menuButton=document.querySelector('.menu-toggle');
const mobileNav=document.querySelector('#mobile-nav');
function closeMenu(){menuButton.setAttribute('aria-expanded','false');mobileNav.hidden=true;menuButton.setAttribute('aria-label','Open navigation');}
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!open));menuButton.setAttribute('aria-label',open?'Open navigation':'Close navigation');mobileNav.hidden=open;});
mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!mobileNav.hidden){closeMenu();menuButton.focus();}});
document.addEventListener('click',e=>{if(!document.querySelector('.site-header').contains(e.target))closeMenu();});
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const narrow=matchMedia('(max-width: 800px)');
const experience=document.querySelector('.experience');
const tabs=Array.from(document.querySelectorAll('[data-scene]'));
const scenes=Array.from(document.querySelectorAll('[data-scene-panel]'));
const texts=Array.from(document.querySelectorAll('[data-story]'));
const captions=['A simpler counter experience.','The details, in their place.','Your day, brought into focus.'];
let active=0, raf=0, manualScene=false;
function setScene(index){
 index=Math.max(0,Math.min(2,index));
 if(index===active)return;active=index;
 scenes.forEach((el,i)=>{const on=i===index;el.classList.toggle('is-active',on);el.inert=!on;el.setAttribute('aria-hidden',String(!on));});
 texts.forEach((el,i)=>{const on=i===index;el.classList.toggle('is-active',on);el.inert=!on;el.setAttribute('aria-hidden',String(!on));});
 tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;});
 document.querySelector('#scene-caption').textContent=captions[index];
 document.querySelector('.experience').dataset.active=String(index);
}
function selectTab(index){
 if(narrow.matches||reducedMotion.matches){manualScene=true;setScene(index);return;}
 const top=experience.getBoundingClientRect().top+scrollY;
 const range=experience.offsetHeight-innerHeight;
 const target=top+range*(index/3+0.11);
 window.scrollTo({top:target,behavior:reducedMotion.matches?'instant':'smooth'});
}
tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>selectTab(index));tab.addEventListener('keydown',e=>{let next=index;if(e.key==='ArrowRight')next=(index+1)%3;else if(e.key==='ArrowLeft')next=(index+2)%3;else if(e.key==='Home')next=0;else if(e.key==='End')next=2;else return;e.preventDefault();tabs[next].focus();selectTab(next);});});
const heroProduct=document.querySelector('#hero-product');
const heroStage=document.querySelector('.hero-stage');
const header=document.querySelector('.site-header');
function paint(){
 raf=0;
 header.classList.toggle('is-scrolled',scrollY>24);
 if(!reducedMotion.matches&&!narrow.matches){
  const rect=heroStage.getBoundingClientRect();const t=Math.max(0,Math.min(1,(innerHeight-rect.top)/(innerHeight+rect.height)));
  heroProduct.style.transform=`perspective(1600px) rotateX(${7-t*7}deg) translateY(${(1-t)*12}px)`;
  heroStage.style.setProperty('--float-shift',`${Math.round(t*-32)}px`);
  const bounds=experience.getBoundingClientRect();const progress=Math.max(0,Math.min(.999,-bounds.top/(experience.offsetHeight-innerHeight)));
  if(bounds.top<=0&&bounds.bottom>=innerHeight)setScene(Math.floor(progress*3));
  experience.style.setProperty('--story-progress',progress.toFixed(4));
 }else{heroProduct.style.transform='none';heroStage.style.setProperty('--float-shift','0px');}
}
function schedule(){if(!raf)raf=requestAnimationFrame(paint);}
window.addEventListener('scroll',schedule,{passive:true});
window.addEventListener('resize',schedule,{passive:true});
reducedMotion.addEventListener('change',schedule);narrow.addEventListener('change',()=>{manualScene=false;schedule();});
paint();
