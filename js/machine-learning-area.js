(function(){
  'use strict';

  const root = document.documentElement;
  const body = document.body;
  const mainNav = document.querySelector('.pl-smart-navbar');
  const areaHeader = document.querySelector('.ml-area-header');
  const subPin = document.querySelector('.ml-subarea-pin');
  const subPinTitle = document.getElementById('ml-current-subarea');
  const sections = Array.from(document.querySelectorAll('.ml-subarea'));
  const projects = Array.from(document.querySelectorAll('.ml-project'));

  function syncHeights(){
    const navH = mainNav ? mainNav.offsetHeight : 58;
    const areaHeaderH = areaHeader ? areaHeader.offsetHeight : 96;
    const subPinH = subPin ? subPin.offsetHeight : 88;
    root.style.setProperty('--ml-main-nav-h', navH + 'px');
    root.style.setProperty('--ml-area-header-h', areaHeaderH + 'px');
    root.style.setProperty('--ml-sub-pin-h', subPinH + 'px');
    root.style.setProperty('--ml-stack-h', (navH + areaHeaderH + subPinH) + 'px');
  }

  let currentSection = null;
  let subareaTimer = null;
  function updateSubarea(){
    const stack = parseFloat(getComputedStyle(root).getPropertyValue('--ml-stack-h')) || 240;
    let next = sections[0] || null;
    sections.forEach((section)=>{
      const rect = section.getBoundingClientRect();
      if(rect.top <= stack + 8 && rect.bottom > stack + 8) next = section;
    });
    if(!next || next === currentSection) return;
    currentSection = next;
    const title = next.dataset.title || '';
    if(subareaTimer) window.clearTimeout(subareaTimer);
    subPin.classList.add('is-changing');
    subareaTimer = window.setTimeout(()=>{
      if(subPinTitle) subPinTitle.textContent = title;
      syncHeights();
      fitDesktopHeadings();
      subPin.classList.remove('is-changing');
      subareaTimer = null;
    }, 130);
  }

  const projectVisibility = new Map(projects.map((project)=>[project,0]));

  function updateActiveProject(){
    const viewportCenter = window.innerHeight / 2;
    let bestProject = null;
    let bestScore = -Infinity;

    projects.forEach((project)=>{
      const rect = project.getBoundingClientRect();
      if(rect.bottom <= 0 || rect.top >= window.innerHeight) return;
      const ratio = projectVisibility.get(project) || 0;
      const center = (rect.top + rect.bottom) / 2;
      const distance = Math.abs(center - viewportCenter) / Math.max(1,window.innerHeight);
      const score = ratio * 2 - distance;
      if(score > bestScore){
        bestScore = score;
        bestProject = project;
      }
    });

    projects.forEach((project)=>project.classList.toggle('is-active', project === bestProject));
  }

  const projectObserver = new IntersectionObserver((entries)=>{
    entries.forEach((entry)=>projectVisibility.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0));
    updateActiveProject();
  }, {threshold:[0,.12,.24,.36,.5,.64,.78,.9,1], rootMargin:'-3% 0px -5% 0px'});
  projects.forEach((project)=>projectObserver.observe(project));

  let ticking = false;
  function onScroll(){
    if(ticking) return;
    ticking = true;
    requestAnimationFrame(()=>{
      updateSubarea();
      updateActiveProject();
      ticking = false;
    });
  }



  function fitDesktopHeadings(){
    if(window.innerWidth <= 900){
      const areaTitle = document.querySelector('.ml-area-pin__title strong');
      const subTitle = document.querySelector('.ml-subarea-pin__title');
      if(areaTitle) areaTitle.style.fontSize = '';
      if(subTitle) subTitle.style.fontSize = '';
      return;
    }

    const areaTitle = document.querySelector('.ml-area-pin__title strong');
    const areaBox = document.querySelector('.ml-area-pin__title');
    if(areaTitle && areaBox){
      areaTitle.style.fontSize = '5.25rem';
      const available = Math.max(1, areaBox.clientWidth);
      const required = areaTitle.scrollWidth;
      if(required > available){
        const basePx = parseFloat(getComputedStyle(areaTitle).fontSize) || 84;
        areaTitle.style.fontSize = Math.max(52, basePx * (available / required) * .985) + 'px';
      }
    }

    const subTitle = document.querySelector('.ml-subarea-pin__title');
    const subInner = document.querySelector('.ml-subarea-pin__inner');
    const bullet = document.querySelector('.ml-subarea-pin__bullet');
    if(subTitle && subInner){
      subTitle.style.fontSize = '4.55rem';
      const styles = getComputedStyle(subInner);
      const gap = parseFloat(styles.columnGap || styles.gap) || 0;
      const available = Math.max(1, subInner.clientWidth - (bullet ? bullet.offsetWidth : 0) - gap);
      const required = subTitle.scrollWidth;
      if(required > available){
        const basePx = parseFloat(getComputedStyle(subTitle).fontSize) || 72.8;
        subTitle.style.fontSize = Math.max(34, basePx * (available / required) * .985) + 'px';
      }
    }
  }

  function applySavedTheme(){
    let saved = null;
    try{ saved = localStorage.getItem('patrones-lab-color-mode'); }catch(e){}
    const dark = saved === null || saved === 'dark';
    body.classList.toggle('dark-mode', dark);
    document.querySelectorAll('.color-mode-icon').forEach((icon)=>icon.classList.toggle('active', dark));
  }

  document.querySelectorAll('.color-mode').forEach((toggle)=>{
    function changeTheme(){
      const dark = !body.classList.contains('dark-mode');
      body.classList.toggle('dark-mode', dark);
      document.querySelectorAll('.color-mode-icon').forEach((icon)=>icon.classList.toggle('active', dark));
      try{ localStorage.setItem('patrones-lab-color-mode', dark ? 'dark' : 'light'); }catch(e){}
    }
    toggle.addEventListener('click', changeTheme);
    toggle.addEventListener('keydown', (event)=>{
      if(event.key === 'Enter' || event.key === ' '){event.preventDefault();changeTheme();}
    });
  });

  const navbarCollapse = document.getElementById('navbarNav');
  if(navbarCollapse){
    navbarCollapse.querySelectorAll('a').forEach((link)=>{
      link.addEventListener('click', ()=>{
        if(window.innerWidth <= 767 && navbarCollapse.classList.contains('show') && window.jQuery){
          window.jQuery(navbarCollapse).collapse('hide');
        }
      });
    });
  }

  applySavedTheme();
  syncHeights();
  fitDesktopHeadings();
  updateSubarea();
  updateActiveProject();
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', ()=>{syncHeights();fitDesktopHeadings();updateSubarea();}, {passive:true});
  window.addEventListener('load', ()=>{syncHeights();fitDesktopHeadings();updateSubarea();}, {once:true});
  if(document.fonts && document.fonts.ready){document.fonts.ready.then(()=>{syncHeights();fitDesktopHeadings();updateSubarea();});}
})();
