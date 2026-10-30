import {media} from './media.js';
import {initMotion} from './motion.js';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const header=document.querySelector('.site-header');
const menuButton=document.querySelector('.menu-toggle');
const menu=document.querySelector('#mobile-menu');
function closeMenu(){menu.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open menu');}
menuButton.addEventListener('click',()=>{const open=menu.hidden;menu.hidden=!open;menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Close menu':'Open menu');});
menu.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
document.addEventListener('click',event=>{if(!header.contains(event.target))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!menu.hidden){closeMenu();menuButton.focus();}});
window.addEventListener('resize',()=>{if(window.innerWidth>700)closeMenu();},{passive:true});
const updateHeader=()=>header.classList.toggle('is-scrolled',window.scrollY>20);window.addEventListener('scroll',updateHeader,{passive:true});updateHeader();

const hero=document.querySelector('#hero-scene');
if(hero){
 let manualPause=false;const motion={enabled:!reduced.matches};const motionButton=document.querySelector('.motion-toggle');
 function updateMotion(){motion.enabled=!manualPause&&!reduced.matches;motionButton.setAttribute('aria-pressed',String(!motion.enabled));motionButton.innerHTML=motion.enabled?'Pause motion <span aria-hidden="true">Ⅱ</span>':'Motion paused <span aria-hidden="true">▷</span>';motionButton.disabled=reduced.matches;motionButton.title=reduced.matches?'Motion follows your reduced-motion preference':'';hero.dispatchEvent(new Event('motionchange'));}
 motionButton.addEventListener('click',()=>{manualPause=!manualPause;updateMotion();});reduced.addEventListener('change',updateMotion);updateMotion();
 import('./hero-scene.js').then(({startHeroScene})=>startHeroScene(hero,motion)).catch(()=>{hero.dataset.renderer='fallback';});
}
initMotion(reduced);

const dialog=document.createElement('dialog');dialog.className='media-dialog';dialog.setAttribute('aria-label','Product interface preview');dialog.innerHTML='<div class="dialog-top"><span>Actual SeraPOS interface design</span><button aria-label="Close preview"><img class="icon" src="/assets/icons/x.svg" alt="" width="20" height="20"></button></div><img alt="">';document.body.append(dialog);
const dialogImage=dialog.querySelector(':scope > img');
document.querySelectorAll('[data-lightbox]').forEach(button=>button.addEventListener('click',()=>{const a=media[button.dataset.lightbox];dialogImage.src=a.src;dialogImage.alt=a.alt;dialogImage.width=a.width;dialogImage.height=a.height;dialog.showModal();document.body.classList.add('modal-open');}));
dialog.querySelector('button').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});dialog.addEventListener('close',()=>document.body.classList.remove('modal-open'));

const form=document.querySelector('#inquiry-form');
if(form){
 const chosen=new URLSearchParams(location.search).get('plan');if(['Starter','Growth','Business'].includes(chosen))form.elements.plan.value=chosen;
 const result=document.querySelector('#inquiry-result'),preview=document.querySelector('#inquiry-preview');let inquiry='';
 form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const f=new FormData(form);inquiry=['SeraPOS inquiry','',`Name: ${String(f.get('name')).trim()}`,`Business: ${String(f.get('business')).trim()}`,`Email: ${String(f.get('email')).trim()}`,`Country / region: ${String(f.get('country')).trim()}`,`Business type: ${f.get('businessType')}`,`Package: ${f.get('plan')}`,'','Message:',String(f.get('message')).trim(),'','Prepared locally. This inquiry has not been sent.'].join('\n');preview.textContent=inquiry;form.hidden=true;result.hidden=false;document.querySelector('#download-inquiry').focus();});
 document.querySelector('#edit-inquiry').addEventListener('click',()=>{result.hidden=true;form.hidden=false;form.elements.name.focus();});
 document.querySelector('#download-inquiry').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([inquiry],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='SeraPOS-inquiry.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
}
