const clamp=(value,min=0,max=1)=>Math.min(max,Math.max(min,value));
const smoothstep=t=>t*t*(3-2*t);
// Each chapter has a reading hold followed by a reversible transition.
export function chapterPosition(progress,count=4){
 const phase=clamp(progress*count-.35,0,count-1);
 const chapter=Math.floor(phase),fraction=phase-chapter;
 return chapter+smoothstep(clamp((fraction-.46)/.54));
}
export function initMotion(reduced){
 const roomy=matchMedia('(min-width:1000px) and (min-height:680px)');
 const stories=[...document.querySelectorAll('[data-story]')].map(section=>({
  section,copies:[...section.querySelectorAll('[data-story-copy]')],panels:[...section.querySelectorAll('[data-story-panel]')],tabs:[...section.querySelectorAll('[data-story-tab]')],
  bar:section.querySelector('.story-progress-track>span'),counter:section.querySelector('.story-progress-count'),top:0,travel:1,current:0,target:0,selected:-1,manual:0,pinned:false
 }));
 const overview=document.querySelector('.overview-stage');
 let raf=0,last=0,overviewTop=0;
 function measure(){
  stories.forEach(s=>{
   s.pinned=roomy.matches&&!reduced.matches;
   s.section.dataset.storyMode=s.pinned?'scroll':'tabs';
  });
  stories.forEach(s=>{s.top=s.section.getBoundingClientRect().top+window.scrollY;s.travel=Math.max(1,s.section.offsetHeight-window.innerHeight);});
  if(overview)overviewTop=overview.getBoundingClientRect().top+window.scrollY;
  wake();
 }
 function select(s,index){
  if(s.selected===index)return;
  s.selected=index;s.section.dataset.storyIndex=String(index);
  s.tabs.forEach((tab,i)=>{const active=i===index;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;});
  [...s.copies,...s.panels].forEach((el,i)=>{const active=i%s.copies.length===index;el.classList.toggle('is-active',active);el.setAttribute('aria-hidden',String(!active));el.inert=!active;});
  s.counter.innerHTML=`0${index+1} <i>/ 0${s.copies.length}</i>`;
 }
 function render(s){
  const index=Math.round(s.current);select(s,index);
  s.section.dataset.storyProgress=s.current.toFixed(3);
  s.copies.forEach((copy,i)=>{
   const delta=i-s.current,distance=Math.abs(delta),opacity=clamp(1-distance*1.7);
   copy.style.opacity=opacity.toFixed(3);
   copy.style.transform=reduced.matches?'none':`translate3d(0,${(delta*48).toFixed(2)}px,0)`;
  });
  s.panels.forEach((panel,i)=>{
   const delta=i-s.current,distance=Math.abs(delta),opacity=clamp(1-distance);
   panel.style.opacity=opacity.toFixed(3);panel.style.zIndex=String(10-Math.round(distance*3));
   panel.style.transform=reduced.matches?'none':`translate3d(${(delta*32).toFixed(2)}px,${(delta*62).toFixed(2)}px,${(-distance*90).toFixed(2)}px) rotateY(${(-delta*5).toFixed(2)}deg) scale(${(1-distance*.045).toFixed(4)})`;
   panel.style.setProperty('--secondary-y',`${(delta*-34).toFixed(2)}px`);
  });
  s.bar.style.transform=`scaleX(${(.08+s.current/(s.copies.length-1)*.92).toFixed(4)})`;
 }
 function frame(now){
  raf=0;const delta=last?Math.min(now-last,50):16.67;last=now;
  const ease=1-Math.exp(-delta/95);let moving=false;
  stories.forEach(s=>{
   s.target=s.pinned?chapterPosition(clamp((window.scrollY-s.top)/s.travel),s.copies.length):s.manual;
   if(reduced.matches||Math.abs(s.target-s.current)<.001)s.current=s.target;
   else{s.current+=(s.target-s.current)*ease;moving=true;}
   render(s);
  });
  if(overview){const p=reduced.matches?1:clamp((window.scrollY+window.innerHeight-overviewTop)/(window.innerHeight*.82));overview.style.setProperty('--overview-tilt',`${((1-p)*7).toFixed(2)}deg`);overview.style.setProperty('--overview-scale',(0.95+p*.05).toFixed(4));}
  if(moving&&!document.hidden)raf=requestAnimationFrame(frame);else last=0;
 }
 function wake(){if(!raf&&!document.hidden)raf=requestAnimationFrame(frame);}
 function go(s,index,focus=false){
  s.manual=index;
  if(focus)s.tabs[index].focus({preventScroll:true});
  if(s.pinned){
   // Landing at the middle of a reading hold avoids boundary ambiguity.
   const progress=(index+.52)/s.copies.length;
   window.scrollTo({top:s.top+progress*s.travel,behavior:reduced.matches?'instant':'smooth'});
  } else wake();
 }
 stories.forEach(s=>s.tabs.forEach((tab,index)=>{
  tab.addEventListener('click',()=>go(s,index));
  tab.addEventListener('keydown',event=>{
   let next=index;
   if(event.key==='ArrowRight'||event.key==='ArrowDown')next=(index+1)%s.tabs.length;
   else if(event.key==='ArrowLeft'||event.key==='ArrowUp')next=(index-1+s.tabs.length)%s.tabs.length;
   else if(event.key==='Home')next=0;else if(event.key==='End')next=s.tabs.length-1;else return;
   event.preventDefault();go(s,next,true);
  });
 }));
 window.addEventListener('scroll',wake,{passive:true});
 window.addEventListener('resize',measure,{passive:true});
 window.addEventListener('pageshow',measure);document.fonts.ready.then(measure);
 document.addEventListener('visibilitychange',wake);roomy.addEventListener('change',measure);
 reduced.addEventListener('change',()=>{document.documentElement.classList.toggle('js-motion',!reduced.matches);measure();});
 document.documentElement.classList.toggle('js-motion',!reduced.matches);
 measure();
 const revealTargets=document.querySelectorAll('.section-heading,.extension-card,.price-card,.principle-grid article,.feature-notes article,.page-cta,.prose,.about-banner,.questions-layout,.closing-callout,.page-hero');
 const reveals=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');reveals.unobserve(entry.target);}}),{threshold:.12,rootMargin:'0px 0px -24px 0px'});
 revealTargets.forEach(el=>{el.classList.add('motion-reveal');const peers=[...el.parentElement.children];if(el.matches('.price-card,.extension-card,.principle-grid article,.feature-notes article'))el.style.setProperty('--reveal-delay',`${Math.min(peers.indexOf(el)*100,200)}ms`);reveals.observe(el);});
 // Animate measured height in both directions, including interrupted clicks.
 document.querySelectorAll('.faq-list details').forEach(details=>{
  const summary=details.querySelector('summary'),answer=details.querySelector('.faq-answer');
  if(!summary||!answer)return;
  let animation=null,targetOpen=details.open;
  summary.addEventListener('click',event=>{
   event.preventDefault();targetOpen=!targetOpen;
   const start=details.getBoundingClientRect().height;
   if(animation){animation.onfinish=null;animation.cancel();animation=null;}
   details.style.height='';
   if(reduced.matches){details.open=targetOpen;delete details.dataset.closing;return;}
   details.open=true;
   details.toggleAttribute('data-closing',!targetOpen);
   const end=targetOpen?details.getBoundingClientRect().height:summary.getBoundingClientRect().height+1;
   animation=details.animate([{height:`${start}px`},{height:`${end}px`}],{duration:420,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'});
   animation.onfinish=()=>{details.open=targetOpen;delete details.dataset.closing;animation.cancel();animation=null;};
  });
 });
}
