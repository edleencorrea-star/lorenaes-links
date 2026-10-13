// One source of truth. Add/remove one entry to update the dial and the list.
const LINKS = [
  { label: 'Instagram', url: 'https://www.instagram.com/lorenaes__/', icon: 'assets/instagram.svg' },
  { label: 'TikTok', url: 'https://www.tiktok.com/@lorenaes__', icon: 'assets/tiktok.svg' },
  { label: 'Pinterest', url: 'https://www.pinterest.com/lorenaEslifestyle/', icon: 'assets/pinterest.svg' },
  { label: 'ELLAS Brands', url: 'https://linktr.ee/Ellas.brands', icon: 'assets/ellas.svg' },
  { label: 'Support my journey', url: 'https://www.gofundme.com/f/support-lorenaes-cancer-treatment-living-costs', icon: 'assets/gofundme.svg' },
  { label: 'Work with me', url: 'mailto:lorenaeslifestyle@gmail.com', icon: 'assets/mail.svg' },
  { label: 'YouTube', url: 'https://www.youtube.com/@Lorenaeslifestyle', icon: 'assets/youtube.svg' },
];
const rotor = document.querySelector('#rotor');
const holes = document.querySelector('#holes');
const list = document.querySelector('#links');
const pause = document.querySelector('#pause');
const status = document.querySelector('#status');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const STOP_ANGLE = 35; // Contact edge of the stationary arm, measured from the right.
const START_ANGLE = -90;
let angle = 0, elapsed = 0, last = 0, paused = motion.matches;
let hovering = false, focused = false, touching = false, selection = null;
const anchors = [];
const baseAngles = LINKS.map((_, i) => START_ANGLE + i * 360 / LINKS.length);
const allowedSchemes = ['https:', 'http:', 'mailto:'];
LINKS.forEach((link, i) => {
  const url = new URL(link.url);
  if (!allowedSchemes.includes(url.protocol)) throw new Error('Unsupported destination: ' + link.label);
  const radians = baseAngles[i] * Math.PI / 180;
  const circle = document.createElement('a');
  circle.className = 'hole'; circle.href = link.url;
  circle.dataset.index = i; circle.setAttribute('aria-label', link.label);
  circle.style.setProperty('--x', `${50 + 35.5 * Math.cos(radians)}%`);
  circle.style.setProperty('--y', `${50 + 35.5 * Math.sin(radians)}%`);
  const img = document.createElement('img'); img.src = link.icon; img.alt = '';
  img.addEventListener('error', () => {img.remove(); const fallback = document.createElement('span'); fallback.textContent=link.label.split(' ').map(x=>x[0]).join('').slice(0,2); fallback.style.position='relative';circle.append(fallback);});
  circle.append(img); holes.append(circle);
  const row = document.createElement('a'); row.className = 'link-row'; row.href = link.url; row.dataset.index = i;
  const label = document.createElement('span');label.className='label';label.textContent=link.label;
  const arrow = document.createElementNS('http://www.w3.org/2000/svg','svg');arrow.classList.add('arrow');arrow.setAttribute('viewBox','0 0 16 16');arrow.setAttribute('aria-hidden','true');const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d','M4 12 12 4M4 4h8v8');path.setAttribute('fill','none');path.setAttribute('stroke','currentColor');path.setAttribute('stroke-width','1.2');arrow.append(path);
  row.append(label,arrow);list.append(row);
  [circle,row].forEach(a=>{a.addEventListener('click',e=>select(e,i));anchors.push(a);});
});
function render(){rotor.style.transform=`rotate(${angle}deg)`;}
function updatePause(){pause.setAttribute('aria-pressed',String(paused));document.querySelector('#pause-label').textContent=paused?'Resume dial':'Pause dial';document.querySelector('.pause-icon').textContent=paused?'▷':'Ⅱ';}
function clearSelection(){selection=null;document.querySelectorAll('.is-selected').forEach(a=>a.classList.remove('is-selected'));}
function select(event,index){
  if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||event.defaultPrevented)return;
  event.preventDefault();clearSelection();
  const turn=((STOP_ANGLE-baseAngles[index]-angle)%360+360)%360;
  document.querySelector(`.hole[data-index="${index}"]`).classList.add('is-selected');
  selection={index,from:angle,to:angle+turn,time:0,duration:motion.matches?0:Math.max(450,turn*4),done:false};
  status.textContent=`Dialing ${LINKS[index].label}`;
  if(motion.matches){angle=selection.to;render();navigate();}
}
function navigate(){
  if(!selection||selection.done)return;
  selection.done=true;
  const url=LINKS[selection.index].url;
  status.textContent=`Opening ${LINKS[selection.index].label}`;
  if(url.startsWith('mailto:')){location.href=url;clearSelection();elapsed=0;returning={from:angle,time:0};}
  else location.assign(url);
}
let returning=null;
const ease=t=>1-Math.pow(1-t,3);
function frame(now){
  const dt=last?Math.min(now-last,40):0;last=now;
  if(!document.hidden){
    if(selection&&!selection.done){selection.time+=dt;const t=Math.min(selection.time/Math.max(1,selection.duration),1);angle=selection.from+(selection.to-selection.from)*ease(t);render();if(t===1)navigate();}
    else if(returning){returning.time+=dt;const t=Math.min(returning.time/(motion.matches?1:1000),1);angle=returning.from*(1-ease(t));render();if(t===1)returning=null;}
    else if(!paused&&!hovering&&!focused&&!touching&&!selection){
      elapsed=(elapsed+dt)%8200;
      if(elapsed<1500)angle=0;
      else if(elapsed<3800)angle=125*ease((elapsed-1500)/2300);
      else if(elapsed<4300)angle=125;
      else if(elapsed<6700)angle=125*(1-ease((elapsed-4300)/2400));
      else angle=0;
      render();
    }
  }
  requestAnimationFrame(frame);
}
pause.addEventListener('click',()=>{paused=!paused;updatePause();});
motion.addEventListener('change',()=>{paused=motion.matches;clearSelection();returning=null;angle=0;elapsed=0;render();updatePause();});
[document.querySelector('.dial'),list].forEach(area=>{
  area.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')hovering=true;});
  area.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse')hovering=false;});
  area.addEventListener('focusin',()=>focused=true);
  area.addEventListener('focusout',()=>{queueMicrotask(()=>focused=anchors.includes(document.activeElement));});
  area.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')touching=true;});
});
window.addEventListener('pointerup',()=>touching=false);window.addEventListener('pointercancel',()=>touching=false);
document.addEventListener('visibilitychange',()=>{last=0;if(document.hidden){clearSelection();returning=null;}});
window.addEventListener('pageshow',()=>{clearSelection();returning=null;angle=0;elapsed=0;last=0;render();});
updatePause();requestAnimationFrame(frame);
