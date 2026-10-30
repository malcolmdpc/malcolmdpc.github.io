/* Ajuste responsive: títulos completos siempre que entren en dos líneas. */
(() => {
  const records = [...document.querySelectorAll('.news-item')].map(item => {
    const title = item.querySelector('.headline h2');
    return {item,title,full:title.textContent.trim(),compact:title.dataset.compactTitle||''};
  });
  let pending = 0;
  function fits(el){
    const s=getComputedStyle(el);
    return el.scrollHeight <= (parseFloat(s.lineHeight)*2)+2;
  }
  function setTextSize(el,text,nominal,min){
    el.textContent=text;
    el.style.fontSize=nominal+'px';
    if (fits(el)) return true;
    el.style.fontSize=min+'px';
    if (!fits(el)) return false;
    let lo=min,hi=nominal;
    for(let k=0;k<9;k++){
      const middle=(lo+hi)/2;
      el.style.fontSize=middle+'px';
      if (fits(el)) lo=middle; else hi=middle;
    }
    el.style.fontSize=Math.max(min,lo-.1)+'px';
    return true;
  }
  function update(){
    pending=0;
    const isMobile=matchMedia('(max-width:760px)').matches;
    for (const r of records){
      const el=r.title;
      el.style.display='block';
      el.style.webkitLineClamp='unset';
      el.style.fontSize='';
      const nominal=parseFloat(getComputedStyle(el).fontSize);
      const min=isMobile?14:16;
      if(!setTextSize(el,r.full,nominal,min) && r.compact){
        setTextSize(el,r.compact,nominal,min);
      }
      el.style.display='-webkit-box';
      el.style.webkitBoxOrient='vertical';
      el.style.webkitLineClamp='2';
      el.setAttribute('aria-label',r.full);
      if(isMobile){r.item.style.removeProperty('--focus-y');}
      else{
        const itemPos=r.item.getBoundingClientRect();
        const titlePos=el.getBoundingClientRect();
        r.item.style.setProperty('--focus-y',Math.round(titlePos.top-itemPos.top+titlePos.height/2)+'px');
      }
    }
  }
  function schedule(){if(pending)cancelAnimationFrame(pending);pending=requestAnimationFrame(update)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});
  else schedule();
  addEventListener('resize',schedule,{passive:true});
  if(document.fonts?.ready)document.fonts.ready.then(schedule);
})();

/* Keep the section title below the shared fixed navbar at every viewport/zoom. */
(() => {
  const nav=document.querySelector('body.pl-news-page > .pl-smart-navbar');
  if(!nav)return;
  let pending=0;
  function measure(){
    pending=0;
    // Expanding the mobile menu must not shift the page content.
    if(nav.querySelector('.navbar-collapse.show, .navbar-collapse.collapsing'))return;
    const height=Math.ceil(nav.getBoundingClientRect().height);
    if(height>0)document.documentElement.style.setProperty('--news-nav-height',height+'px');
  }
  function schedule(){if(!pending)pending=requestAnimationFrame(measure)}
  measure();
  if(window.ResizeObserver)new ResizeObserver(schedule).observe(nav);
  addEventListener('resize',schedule,{passive:true});
  addEventListener('orientationchange',schedule,{passive:true});
  if(document.fonts?.ready)document.fonts.ready.then(schedule);
})();
