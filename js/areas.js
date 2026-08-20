(function(){
  'use strict';

  const root = document.documentElement;
  const body = document.body;
  const mainNav = document.querySelector('.pl-smart-navbar');
  const areaHeader = document.querySelector('.pl-area-header');
  const subPin = document.querySelector('.pl-area-subarea-pin');
  const subPinTitle = document.getElementById('area-current-subarea');
  const sections = Array.from(document.querySelectorAll('.pl-area-subarea'));
  const projects = Array.from(document.querySelectorAll('.pl-area-project'));

  function syncHeights(){
    const navH = mainNav ? mainNav.offsetHeight : 58;
    const headerH = areaHeader ? areaHeader.offsetHeight : 138;
    const subH = subPin ? subPin.offsetHeight : 82;
    root.style.setProperty('--area-main-nav-h', navH + 'px');
    root.style.setProperty('--area-header-h', headerH + 'px');
    root.style.setProperty('--area-sub-pin-h', subH + 'px');
    root.style.setProperty('--area-stack-h', (navH + headerH + subH) + 'px');
  }

  function fitElement(element, container, baseRem, minPx, reservedPx){
    if(!element || !container) return;
    element.style.fontSize = baseRem + 'rem';
    const available = Math.max(1, container.clientWidth - (reservedPx || 0));
    const required = element.scrollWidth;
    if(required > available){
      const basePx = parseFloat(getComputedStyle(element).fontSize) || baseRem * 16;
      element.style.fontSize = Math.max(minPx, basePx * (available / required) * .985) + 'px';
    }
  }

  function fitHeadings(){
    const areaTitle = document.querySelector('.pl-area-pin__title strong');
    const areaBox = document.querySelector('.pl-area-pin__title');
    const subTitle = document.querySelector('.pl-area-subarea-pin__title');
    const subInner = document.querySelector('.pl-area-subarea-pin__inner');
    const bullet = document.querySelector('.pl-area-subarea-pin__bullet');
    const width = window.innerWidth;

    let areaBase = 5.25;
    let areaMin = 52;
    let subBase = 4.55;
    let subMin = 34;

    if(width <= 575){
      areaBase = 3.4;
      areaMin = 27;
      subBase = 1.85;
      subMin = 15;
    }else if(width <= 900){
      areaBase = 4.3;
      areaMin = 36;
      subBase = 2.45;
      subMin = 20;
    }

    fitElement(areaTitle, areaBox, areaBase, areaMin, 0);
    if(subTitle && subInner){
      const gap = parseFloat(getComputedStyle(subInner).gap) || 0;
      fitElement(subTitle, subInner, subBase, subMin, (bullet ? bullet.offsetWidth : 0) + gap);
    }
  }

  function refreshLayout(){
    fitHeadings();
    syncHeights();
  }

  let currentSection = null;
  let subareaTimer = null;
  function updateSubarea(){
    if(!sections.length) return;
    const stack = parseFloat(getComputedStyle(root).getPropertyValue('--area-stack-h')) || 240;
    let next = sections[0];
    for(const section of sections){
      const rect = section.getBoundingClientRect();
      if(rect.top <= stack + 8 && rect.bottom > stack + 8) next = section;
    }
    if(!next || next === currentSection) return;
    currentSection = next;
    const title = next.dataset.title || '';
    if(subareaTimer) window.clearTimeout(subareaTimer);
    if(subPin) subPin.classList.add('is-changing');
    subareaTimer = window.setTimeout(function(){
      if(subPinTitle) subPinTitle.textContent = title;
      fitHeadings();
      syncHeights();
      if(subPin) subPin.classList.remove('is-changing');
      subareaTimer = null;
    },130);
  }

  const visibility = new Map(projects.map(function(project){return [project,0];}));
  function updateActiveProject(){
    if(!projects.length) return;
    const center = window.innerHeight / 2;
    let best = null;
    let bestScore = -Infinity;
    projects.forEach(function(project){
      const rect = project.getBoundingClientRect();
      if(rect.bottom <= 0 || rect.top >= window.innerHeight) return;
      const ratio = visibility.get(project) || 0;
      const distance = Math.abs(((rect.top + rect.bottom)/2) - center) / Math.max(1,window.innerHeight);
      const score = ratio * 2 - distance;
      if(score > bestScore){bestScore = score;best = project;}
    });
    projects.forEach(function(project){project.classList.toggle('is-active',project === best);});
  }

  const observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){visibility.set(entry.target,entry.isIntersecting ? entry.intersectionRatio : 0);});
    updateActiveProject();
  },{threshold:[0,.12,.24,.36,.5,.64,.78,.9,1],rootMargin:'-3% 0px -5% 0px'});
  projects.forEach(function(project){observer.observe(project);});

  let ticking = false;
  function onScroll(){
    if(ticking) return;
    ticking = true;
    requestAnimationFrame(function(){
      updateSubarea();
      updateActiveProject();
      ticking = false;
    });
  }

  function applySavedTheme(){
    let saved = null;
    try{saved = localStorage.getItem('patrones-lab-color-mode');}catch(e){}
    const dark = saved === null || saved === 'dark';
    body.classList.toggle('dark-mode',dark);
    document.querySelectorAll('.color-mode-icon').forEach(function(icon){icon.classList.toggle('active',dark);});
  }

  document.querySelectorAll('.color-mode').forEach(function(toggle){
    function changeTheme(){
      const dark = !body.classList.contains('dark-mode');
      body.classList.toggle('dark-mode',dark);
      document.querySelectorAll('.color-mode-icon').forEach(function(icon){icon.classList.toggle('active',dark);});
      try{localStorage.setItem('patrones-lab-color-mode',dark ? 'dark' : 'light');}catch(e){}
    }
    toggle.addEventListener('click',changeTheme);
    toggle.addEventListener('keydown',function(event){if(event.key==='Enter'||event.key===' '){event.preventDefault();changeTheme();}});
  });

  function ensureActiveAreaVisible(){
    const strip = document.querySelector('.pl-area-nav__items');
    const active = strip ? strip.querySelector('.pl-area-chip.is-active,[aria-current="page"]') : null;
    if(!strip || !active || window.innerWidth > 900) return;
    const target = active.offsetLeft - Math.max(0,(strip.clientWidth - active.offsetWidth)/2);
    strip.scrollLeft = Math.max(0,target);
  }

  const navbarCollapse = document.getElementById('navbarNav');
  if(navbarCollapse){
    navbarCollapse.querySelectorAll('a').forEach(function(link){
      link.addEventListener('click',function(){
        if(window.innerWidth <= 767 && navbarCollapse.classList.contains('show') && window.jQuery){window.jQuery(navbarCollapse).collapse('hide');}
      });
    });
  }

  if(window.jQuery && navbarCollapse){
    window.jQuery(navbarCollapse).on('shown.bs.collapse hidden.bs.collapse',function(){
      window.requestAnimationFrame(function(){refreshLayout();updateSubarea();});
    });
  }

  applySavedTheme();
  refreshLayout();
  ensureActiveAreaVisible();
  updateSubarea();
  updateActiveProject();
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',function(){refreshLayout();ensureActiveAreaVisible();updateSubarea();updateActiveProject();},{passive:true});
  window.addEventListener('load',function(){refreshLayout();ensureActiveAreaVisible();updateSubarea();updateActiveProject();},{once:true});
  if(document.fonts && document.fonts.ready){document.fonts.ready.then(function(){refreshLayout();updateSubarea();updateActiveProject();});}
})();
