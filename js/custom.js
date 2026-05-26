(function ($) {

  "use strict";

  // Color mode: dark by default, while still respecting a saved light preference
  const savedMode = localStorage.getItem('patrones-lab-color-mode');
  const shouldUseDark = savedMode === null || savedMode === 'dark';

  $('body').toggleClass('dark-mode', shouldUseDark);
  $('.color-mode-icon').toggleClass('active', shouldUseDark);

  $('.color-mode').on('click', function(){
    const nextIsDark = !$('body').hasClass('dark-mode');
    $('body').toggleClass('dark-mode', nextIsDark);
    $('.color-mode-icon').toggleClass('active', nextIsDark);
    localStorage.setItem('patrones-lab-color-mode', nextIsDark ? 'dark' : 'light');
  });
  // Header behavior is handled by the custom compact navbar controller below.
// Smooth scroll
  $('.nav-link, .custom-btn-link, .custom-btn[href^="#"]').on('click', function(event) {
    const href = $(this).attr('href');
    if(href && href.startsWith('#') && $(href).length){
      $('html, body').stop().animate({
          scrollTop: $(href).offset().top - 64
      }, 800);
      event.preventDefault();
    }
  });

  // Contact form: mailto fallback for static hosting
  $('#contactForm').on('submit', function(event){
    event.preventDefault();
    const name = $('#name').val() || '';
    const email = $('#email').val() || '';
    const message = $('#message').val() || '';
    const subject = encodeURIComponent('Contacto desde Patrones Lab');
    const body = encodeURIComponent(
      'Nombre: ' + name + '\n' +
      'Email: ' + email + '\n\n' +
      'Mensaje:\n' + message
    );
    window.location.href = 'mailto:encontrandopatrones@gmail.com?subject=' + subject + '&body=' + body;
  });

})(jQuery);





// V48D: filtro estable de Proyectos por data-tags
(function(){
  const projectsSection = document.querySelector('#projects');
  if(!projectsSection) return;

  const buttons = Array.from(projectsSection.querySelectorAll('.repo-filter-btn[data-repo-filter]'));
  const cards = Array.from(projectsSection.querySelectorAll('.github-project-card[data-tags]'));
  const empty = projectsSection.querySelector('.repo-empty-message');

  if(!buttons.length || !cards.length) return;

  function tagsFor(card){
    return (card.dataset.tags || '')
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);
  }

  function shouldShow(card, filter){
    return filter === 'all' || tagsFor(card).includes(filter);
  }

  function setEmptyState(visibleCount){
    if(empty) empty.hidden = visibleCount > 0;
  }

  function applyFilter(filter){
    let visibleCount = 0;

    cards.forEach(card => {
      const show = shouldShow(card, filter);

      card.classList.toggle('is-filtered-out', !show);
      card.hidden = !show;
      card.style.display = show ? '' : 'none';
      card.style.opacity = '';
      card.style.transform = '';

      if(show) visibleCount += 1;
    });

    setEmptyState(visibleCount);
  }

  function setActiveButton(activeButton){
    const filter = (activeButton.dataset.repoFilter || 'all').toLowerCase();

    buttons.forEach(button => {
      const sameFilter = (button.dataset.repoFilter || 'all').toLowerCase() === filter;
      button.classList.toggle('active', sameFilter);
      button.setAttribute('aria-pressed', sameFilter ? 'true' : 'false');
    });

    applyFilter(filter);
  }

  buttons.forEach(button => {
    button.setAttribute('aria-pressed', button.classList.contains('active') ? 'true' : 'false');

    button.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      setActiveButton(button);
    });
  });

  const initial = buttons.find(button => button.classList.contains('active')) || buttons[0];
  setActiveButton(initial);
})();


// V12: fixed background lamps, no document-height side effects
(function(){
  const layer = document.querySelector('.floating-icon-layer');
  if(!layer) return;

  const iconFiles = [
    'bulb-01.png','bulb-02.png','bulb-03.png','bulb-04.png','bulb-05.png',
    'bulb-06.png','bulb-07.png','bulb-08.png','bulb-09.png','bulb-10.png',
    'bulb-11.png','bulb-12.png','bulb-13.png','bulb-14.png','bulb-15.png',
    'bulb-16.png','bulb-17.png','bulb-18.png','bulb-19.png','bulb-20.png'
  ];

  const basePath = 'images/patrones/floating-icons/';
  const maxIcons = 10;

  function rand(min, max){
    return Math.random() * (max - min) + min;
  }

  function createLamp(i){
    const img = document.createElement('img');
    img.className = 'bg-floating-icon';
    img.alt = '';
    img.decoding = 'async';
    img.loading = 'lazy';
    img.src = basePath + iconFiles[i % iconFiles.length];

    const size = rand(110, 170);
    const opacity = rand(0.045, 0.085);
    const duration = rand(52, 84);
    const delay = rand(-duration, 0);
    const y = rand(8, 92);
    const mode = i % 4;

    let fromX, toX, fromY, toY;

    if(mode === 0){
      fromX = '-18vw'; toX = '118vw'; fromY = y + 'vh'; toY = (y + rand(-8, 8)) + 'vh';
    } else if(mode === 1){
      fromX = '118vw'; toX = '-18vw'; fromY = y + 'vh'; toY = (y + rand(-8, 8)) + 'vh';
    } else if(mode === 2){
      fromX = rand(5, 95) + 'vw'; toX = rand(5, 95) + 'vw'; fromY = '-18vh'; toY = '118vh';
    } else {
      fromX = rand(5, 95) + 'vw'; toX = rand(5, 95) + 'vw'; fromY = '118vh'; toY = '-18vh';
    }

    img.style.setProperty('--size', size.toFixed(1) + 'px');
    img.style.setProperty('--size-mobile', Math.max(74, size * 0.64).toFixed(1) + 'px');
    img.style.setProperty('--opacity', opacity.toFixed(3));
    img.style.setProperty('--opacity-mobile', Math.max(0.035, opacity * 0.70).toFixed(3));
    img.style.setProperty('--duration', duration.toFixed(1) + 's');
    img.style.setProperty('--delay', delay.toFixed(1) + 's');
    img.style.setProperty('--from-x', fromX);
    img.style.setProperty('--to-x', toX);
    img.style.setProperty('--from-y', fromY);
    img.style.setProperty('--to-y', toY);
    img.style.setProperty('--rot', rand(-7, 7).toFixed(1) + 'deg');
    img.style.setProperty('--spin', rand(-8, 8).toFixed(1) + 'deg');

    layer.appendChild(img);
  }

  layer.innerHTML = '';
  for(let i = 0; i < maxIcons; i += 1){
    createLamp(i);
  }
})();




// V19B: stable cinematic wheel-controlled timeline
(function(){
  const section = document.querySelector('[data-pinned-timeline]');
  const timeline = document.querySelector('[data-process-timeline]');
  if(!section || !timeline) return;

  const steps = Array.from(timeline.querySelectorAll('[data-step]'));
  if(!steps.length) return;

  let targetProgress = 0;
  let currentProgress = 0;
  let rafId = null;
  let lastWheelAt = 0;
  let hasEntered = false;

  function isDesktop(){
    return window.matchMedia('(min-width: 992px)').matches;
  }

  function clamp(v, min, max){
    return Math.min(Math.max(v, min), max);
  }

  function easeOutCubic(x){
    x = clamp(x, 0, 1);
    return 1 - Math.pow(1 - x, 3);
  }

  function sectionInLockZone(){
    const rect = section.getBoundingClientRect();
    return rect.top <= window.innerHeight * 0.22 && rect.bottom >= window.innerHeight * 0.50;
  }

  function render(){
    const count = steps.length;
    const maxIndex = Math.max(count - 1, 1);
    const scaled = currentProgress * maxIndex;
    const activeIndex = clamp(Math.round(scaled), 0, count - 1);
    const floorIndex = Math.floor(scaled);

    section.classList.add('timeline-cinema-ready');

    steps.forEach((step, index) => {
      const rawSegment = clamp(scaled - index, 0, 1);
      const segmentProgress = Math.round(easeOutCubic(rawSegment) * 100);

      step.style.setProperty('--segment-progress', segmentProgress + '%');

      step.classList.toggle('is-active', index === activeIndex);
      step.classList.toggle('is-complete', index <= floorIndex || currentProgress >= 0.995);
    });
  }

  function animate(){
    const diff = targetProgress - currentProgress;
    currentProgress += diff * 0.062;

    if(Math.abs(diff) < 0.0018){
      currentProgress = targetProgress;
    }

    render();

    if(currentProgress !== targetProgress){
      rafId = requestAnimationFrame(animate);
    } else {
      rafId = null;
    }
  }

  function requestAnimation(){
    if(rafId === null){
      rafId = requestAnimationFrame(animate);
    }
  }

  function setProgress(value, immediate){
    targetProgress = clamp(value, 0, 1);

    if(immediate){
      currentProgress = targetProgress;
      render();
      return;
    }

    requestAnimation();
  }

  function canControl(deltaY){
    if(!isDesktop()) return false;
    if(!sectionInLockZone()) return false;

    if(deltaY > 0 && targetProgress < 0.995) return true;
    if(deltaY < 0 && targetProgress > 0.005) return true;

    return false;
  }

  function syncOutsideSection(){
    if(!isDesktop()){
      section.classList.add('timeline-cinema-ready', 'timeline-cinema-settled');
      steps.forEach((step) => {
        step.classList.add('is-complete');
        step.classList.remove('is-active');
        step.style.setProperty('--segment-progress', '100%');
      });
      return;
    }

    const rect = section.getBoundingClientRect();

    if(rect.top > window.innerHeight * 0.60){
      setProgress(0, true);
    }

    if(rect.bottom < window.innerHeight * 0.42){
      setProgress(1, true);
    }
  }

  window.addEventListener('wheel', function(event){
    if(!canControl(event.deltaY)) return;

    event.preventDefault();

    if(!hasEntered){
      hasEntered = true;
      section.classList.add('timeline-cinema-ready');
      window.setTimeout(() => section.classList.add('timeline-cinema-settled'), 850);
    }

    const now = Date.now();
    if(now - lastWheelAt < 16) return;
    lastWheelAt = now;

    const direction = Math.sign(event.deltaY);
    const amount = Math.min(Math.abs(event.deltaY), 110);
    const delta = direction * amount / 1850;

    setProgress(targetProgress + delta, false);
  }, {passive:false});

  window.addEventListener('scroll', function(){
    syncOutsideSection();
  }, {passive:true});

  window.addEventListener('resize', function(){
    syncOutsideSection();
    render();
  });

  section.classList.add('timeline-cinema-ready');
  window.setTimeout(() => section.classList.add('timeline-cinema-settled'), 900);

  setProgress(0, true);
  syncOutsideSection();
})();

// V14: clean navbar show/hide controller
(function(){
  const nav = document.querySelector('.pl-smart-navbar');
  if(!nav) return;

  let lastY = window.scrollY;
  let ticking = false;

  function show(){
    nav.classList.add('nav-visible');
    nav.classList.remove('nav-hidden');
  }

  function hide(){
    nav.classList.add('nav-hidden');
    nav.classList.remove('nav-visible');
  }

  function update(){
    const y = window.scrollY;
    const delta = y - lastY;

    nav.classList.toggle('nav-at-top', y < 20);

    if(y < 20){
      show();
    } else if(delta > 10){
      hide();
    } else if(delta < -10){
      show();
    }

    lastY = y;
    ticking = false;
  }

  window.addEventListener('scroll', function(){
    if(!ticking){
      requestAnimationFrame(update);
      ticking = true;
    }
  }, {passive:true});

  window.addEventListener('mousemove', function(event){
    if(event.clientY <= 72){
      show();
    }
  }, {passive:true});

  nav.addEventListener('mouseenter', show);
  nav.addEventListener('focusin', show);

  show();
  update();
})();


// V20: show floating CTA after hero
(function(){
  const cta = document.querySelector('.floating-cta');
  const hero = document.querySelector('#about');

  if(!cta || !hero) return;

  function updateFloatingCta(){
    const heroBottom = hero.getBoundingClientRect().bottom;
    const shouldShow = heroBottom < window.innerHeight * 0.35;

    cta.classList.toggle('is-visible', shouldShow);
  }

  window.addEventListener('scroll', updateFloatingCta, {passive:true});
  window.addEventListener('resize', updateFloatingCta);
  updateFloatingCta();
})();


// V21: hero scroll indicator
(function(){
  const indicator = document.querySelector('.hero-scroll-indicator');
  if(!indicator) return;

  indicator.addEventListener('click', function(event){
    const href = this.getAttribute('href');
    const target = document.querySelector(href);
    if(!target) return;

    event.preventDefault();
    const offset = 66;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top: top,
      behavior: 'smooth'
    });
  });
})();


// V24: navbar active section state
(function(){
  const nav = document.querySelector('.pl-active-navbar');
  if(!nav) return;

  const links = Array.from(nav.querySelectorAll('.nav-link[href^="#"]'));
  const sectionPairs = links
    .map(link => {
      const target = document.querySelector(link.getAttribute('href'));
      return target ? {link, target} : null;
    })
    .filter(Boolean);

  if(!sectionPairs.length) return;

  function setActiveById(id){
    sectionPairs.forEach(({link, target}) => {
      const isActive = target.id === id;
      link.classList.toggle('is-active', isActive);
      if(isActive){
        link.setAttribute('aria-current', 'page');
      }else{
        link.removeAttribute('aria-current');
      }
    });
  }

  function getCurrentSection(){
    const offset = window.innerHeight * 0.38;
    let current = sectionPairs[0].target.id;

    sectionPairs.forEach(({target}) => {
      const rect = target.getBoundingClientRect();
      if(rect.top <= offset && rect.bottom > offset){
        current = target.id;
      }
    });

    // Refuerzo para el final de página: marcar contacto.
    if(window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8){
      const contact = sectionPairs.find(pair => pair.target.id === 'contact');
      if(contact) current = contact.target.id;
    }

    return current;
  }

  let ticking = false;

  function updateActive(){
    setActiveById(getCurrentSection());
    ticking = false;
  }

  window.addEventListener('scroll', function(){
    if(!ticking){
      requestAnimationFrame(updateActive);
      ticking = true;
    }
  }, {passive:true});

  window.addEventListener('resize', updateActive);

  links.forEach(link => {
    link.addEventListener('click', function(){
      const href = this.getAttribute('href');
      if(href && href.length > 1){
        setActiveById(href.slice(1));
      }
    });
  });

  updateActive();
})();


// V25B: hero microanimation trigger, strictly preserving v24
(function(){
  function startHeroEntry(){
    document.body.classList.add('hero-entry-v25b-ready');
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){
      window.requestAnimationFrame(startHeroEntry);
    }, {once:true});
  }else{
    window.requestAnimationFrame(startHeroEntry);
  }
})();



// V27B: safe section reveal without changing layout
(function(){
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const sectionConfigs = [
    {
      section: '#networks',
      items: [
        'h2',
        '.social-card'
      ]
    },
    {
      section: '#methodology',
      items: [
        'h2',
        '.timeline-scroll-note',
        '.process-timeline .timeline-wrapper',
        '.stack-timeline .timeline-wrapper',
        '.stack-pills'
      ]
    },
    {
      section: '#networkss',
      items: [
        'h2',
        '.networkss-intro',
        '.repo-filter-toolbar',
        '.github-networks-card'
      ]
    },
    {
      section: '#contact',
      items: [
        'h2',
        '.contact-panel',
        '.boxed-mail-form'
      ]
    }
  ];

  const sections = sectionConfigs
    .map(config => {
      const section = document.querySelector(config.section);
      if(!section) return null;

      const seen = new Set();
      const items = [];

      config.items.forEach(selector => {
        section.querySelectorAll(selector).forEach(item => {
          if(seen.has(item)) return;
          seen.add(item);
          items.push(item);
        });
      });

      return {section, items};
    })
    .filter(group => group && group.items.length);

  if(!sections.length) return;

  if(reduceMotion){
    return;
  }

  function prepareItems(group){
    group.items.forEach((item, index) => {
      item.style.setProperty('--pl-reveal-order', String(Math.min(index, 12)));
      item.classList.add('pl-section-reveal-pending');

      if(item.matches('h2')){
        item.classList.add('pl-section-reveal-title');
      }

      if(item.matches('.social-card, .github-networks-card, .contact-panel, .boxed-mail-form')){
        item.classList.add('pl-section-reveal-card');
      }

      if(item.matches('.stack-timeline .timeline-wrapper, .stack-pills')){
        item.classList.add('pl-section-reveal-side');
      }
    });
  }

  function revealGroup(group){
    group.section.classList.add('pl-section-revealed');

    group.items.forEach(item => {
      item.classList.add('pl-section-reveal-visible');
      item.classList.remove('pl-section-reveal-pending');

      // Limpieza posterior para evitar interferencias con filtros FLIP y hover.
      window.setTimeout(() => {
        item.classList.remove(
          'pl-section-reveal-visible',
          'pl-section-reveal-title',
          'pl-section-reveal-card',
          'pl-section-reveal-side'
        );
        item.style.removeProperty('--pl-reveal-order');
      }, 1150);
    });
  }

  sections.forEach(prepareItems);

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if(!entry.isIntersecting) return;

      const group = sections.find(item => item.section === entry.target);
      if(!group || group.section.classList.contains('pl-section-revealed')) return;

      revealGroup(group);
      obs.unobserve(group.section);
    });
  }, {
    threshold:0.16,
    rootMargin:'0px 0px -12% 0px'
  });

  sections.forEach(group => observer.observe(group.section));

  // Fallback para secciones que ya estén visibles al cargar o al volver con historial.
  window.setTimeout(() => {
    sections.forEach(group => {
      if(group.section.classList.contains('pl-section-revealed')) return;

      const rect = group.section.getBoundingClientRect();
      const visible = rect.top < window.innerHeight * .84 && rect.bottom > window.innerHeight * .18;

      if(visible){
        revealGroup(group);
        observer.unobserve(group.section);
      }
    });
  }, 180);
})();



// V29D: pointer-aware card glow for social section only
(function(){
  const cards = Array.from(document.querySelectorAll('.social-section .social-card'));
  if(!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('pointermove', function(event){
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;

      card.style.setProperty('--mx', x.toFixed(1) + '%');
      card.style.setProperty('--my', y.toFixed(1) + '%');
    }, {passive:true});

    card.addEventListener('pointerleave', function(){
      card.style.removeProperty('--mx');
      card.style.removeProperty('--my');
    }, {passive:true});
  });
})();


// V44G: estado accesible para grupos de filtros desplegables por hover/focus
(function(){
  const groups = Array.from(document.querySelectorAll('.repo-filter-group'));
  if(!groups.length) return;

  groups.forEach(group => {
    const trigger = group.querySelector('.repo-filter-group-trigger');
    if(!trigger) return;

    function open(){
      trigger.setAttribute('aria-expanded', 'true');
    }

    function close(){
      trigger.setAttribute('aria-expanded', 'false');
    }

    group.addEventListener('mouseenter', open);
    group.addEventListener('mouseleave', close);
    group.addEventListener('focusin', open);
    group.addEventListener('focusout', event => {
      if(!group.contains(event.relatedTarget)) close();
    });
  });
})();


// V44H: estado accesible para grupos de filtros desplegables por hover/focus
(function(){
  const groups = Array.from(document.querySelectorAll('.repo-filter-group'));
  if(!groups.length) return;

  groups.forEach(group => {
    const trigger = group.querySelector('.repo-filter-group-trigger');
    if(!trigger) return;

    function open(){
      trigger.setAttribute('aria-expanded', 'true');
    }

    function close(){
      trigger.setAttribute('aria-expanded', 'false');
    }

    group.addEventListener('mouseenter', open);
    group.addEventListener('mouseleave', close);
    group.addEventListener('focusin', open);
    group.addEventListener('focusout', event => {
      if(!group.contains(event.relatedTarget)) close();
    });
  });
})();



// === PRELOADER SYSTEM PRO ===
(function(){
  const preloader = document.querySelector('.pl-preloader');
  if(!preloader) return;

  const duration = Math.min(parseInt(preloader.dataset.preloaderDuration || '4200', 10), 7000);
  const body = document.body;
  const startAt = Date.now();
  let removed = false;

  body.classList.add('preloader-active');

  function removePreloader(){
    if(removed) return;
    removed = true;
    preloader.classList.add('is-hidden');
    body.classList.remove('preloader-active');
    body.classList.add('preloader-complete');
    window.setTimeout(() => {
      if(preloader.parentNode) preloader.parentNode.removeChild(preloader);
    }, 900);
  }

  function scheduleRemoval(){
    const elapsed = Date.now() - startAt;
    const remaining = Math.max(0, duration - elapsed);
    window.setTimeout(removePreloader, remaining);
  }

  if(document.readyState === 'complete'){
    scheduleRemoval();
  } else {
    window.addEventListener('load', scheduleRemoval, { once:true });
    window.setTimeout(scheduleRemoval, Math.min(1200, duration));
  }

  window.setTimeout(removePreloader, 7000);
})();


// === V45D: ajuste final del loader sin rebote de zoom ===
(function(){
  const loader = document.querySelector('.pl-scroll-loader');
  if(!loader) return;

  const body = document.body;
  const html = document.documentElement;
  let finished = false;
  let tl = null;
  let fallbackHandler = null;

  html.classList.add('pl-scroll-loader-lock');

  function forceTopFor(ms){
    const started = performance.now();

    function block(e){
      if(e && typeof e.preventDefault === 'function') e.preventDefault();
      if(e && typeof e.stopPropagation === 'function') e.stopPropagation();
      return false;
    }

    function blockKeys(e){
      const keys = ['Space','PageDown','PageUp','ArrowDown','ArrowUp','Home','End'];
      if(keys.includes(e.code)){
        block(e);
      }
    }

    window.addEventListener('wheel', block, { passive:false, capture:true });
    window.addEventListener('touchmove', block, { passive:false, capture:true });
    window.addEventListener('keydown', blockKeys, { passive:false, capture:true });

    body.classList.add('pl-scroll-landing-lock');

    function hold(){
      window.scrollTo(0, 0);
      if(performance.now() - started < ms){
        requestAnimationFrame(hold);
      }else{
        window.removeEventListener('wheel', block, { capture:true });
        window.removeEventListener('touchmove', block, { capture:true });
        window.removeEventListener('keydown', blockKeys, { capture:true });
        body.classList.remove('pl-scroll-landing-lock');
        window.scrollTo(0, 0);
      }
    }

    hold();
  }

  function cleanupScrollTrigger(){
    if(tl){
      try{
        if(tl.scrollTrigger) tl.scrollTrigger.kill(false);
        tl.kill();
      }catch(e){}
    }

    if(window.ScrollTrigger && typeof window.ScrollTrigger.getAll === 'function'){
      window.ScrollTrigger.getAll().forEach(function(st){
        if(st && st.trigger && loader.contains(st.trigger)){
          try{ st.kill(false); }catch(e){}
        }
      });
    }

    if(fallbackHandler){
      window.removeEventListener('scroll', fallbackHandler);
      window.removeEventListener('resize', fallbackHandler);
    }
  }

  function finishScrollLoader(){
    if(finished) return;
    finished = true;

    body.classList.add('pl-scroll-loader-finishing');

    const dot = loader.querySelector('.dot');
    const next = loader.querySelector('.pl-scroll-loader__next');

    if(dot) dot.style.transform = 'scale(1200)';
    if(next){
      next.style.visibility = 'visible';
      next.style.opacity = '1';
    }

    /*
      V45D: primero congelamos el timeline/ScrollTrigger en el estado final.
      Si se fuerza el scroll a 0 antes de matar el ScrollTrigger, el scrub intenta
      volver hacia atrás y genera un pequeño rebote visual justo antes de mostrar la web.
    */
    cleanupScrollTrigger();

    forceTopFor(850);

    window.setTimeout(function(){
      if(loader.parentNode) loader.parentNode.removeChild(loader);

      body.classList.remove('pl-scroll-loader-active');
      body.classList.remove('pl-scroll-loader-finishing');
      body.classList.add('pl-scroll-loader-complete');
      html.classList.remove('pl-scroll-loader-lock');

      window.scrollTo(0, 0);

      if(window.ScrollTrigger && typeof window.ScrollTrigger.refresh === 'function'){
        window.ScrollTrigger.refresh(true);
      }
    }, 220);
  }

  if(window.gsap && window.ScrollTrigger){
    window.gsap.registerPlugin(window.ScrollTrigger);

    tl = window.gsap.timeline({
      scrollTrigger:{
        trigger:'.pl-scroll-loader__first',
        start:'top top',
        end:'+=135%',
        pin:true,
        scrub:.45,
        onUpdate:function(self){
          if(self.progress >= .992) finishScrollLoader();
        },
        onLeave:finishScrollLoader
      }
    });

    tl.to('.pl-scroll-loader .dot', {
      scale:1200,
      duration:2,
      ease:'power2.in'
    })
    .to('.pl-scroll-loader__next', {
      autoAlpha:1,
      duration:.08
    }, '-=.22');
  } else {
    const dot = loader.querySelector('.dot');
    const next = loader.querySelector('.pl-scroll-loader__next');
    const maxScroll = Math.max(window.innerHeight * 1.35, 1);

    fallbackHandler = function(){
      if(finished) return;
      const progress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
      if(dot) dot.style.transform = 'scale(' + (1 + progress * 1199).toFixed(3) + ')';
      if(next && progress > .62){
        next.style.visibility = 'visible';
        next.style.opacity = '1';
      }
      if(progress >= .985) finishScrollLoader();
    };

    window.addEventListener('scroll', fallbackHandler, { passive:true });
    window.addEventListener('resize', fallbackHandler, { passive:true });
    fallbackHandler();
  }
})();


// === V45P: Horizontal pinned panels con drag en toda la sección y barra mejorada ===
(function(){
  const horizontalSection=document.querySelector('[data-horizontal-process-section]');
  if(!horizontalSection||!window.gsap||!window.ScrollTrigger)return;
  const wrapper=horizontalSection.querySelector('.wrapper');
  const items=wrapper?Array.from(wrapper.querySelectorAll('.item')):[];
  const guide=horizontalSection.querySelector('.process-horizontal-guide');
  const bullets=guide?Array.from(guide.querySelectorAll('[data-process-guide]')):[];
  const progressBar=guide?guide.querySelector('.process-horizontal-guide__progress'):null;
  const desktopQuery=window.matchMedia('(min-width: 992px)');
  if(!wrapper||items.length<2)return;
  window.gsap.registerPlugin(window.ScrollTrigger);
  let timeline=null;
  let isDragging=false;
  let dragStartX=0;
  let dragStartProgress=0;
  let scrollDistance=1;
  let currentProgress=0;
  function clamp(v,min,max){return Math.min(Math.max(v,min),max);}
  function activeIndexFromProgress(progress){return Math.min(items.length-1,Math.max(0,Math.round(progress*(items.length-1))));}
  function getContrastIndex(progress){
    const segmentCount = Math.max(items.length - 1, 1);
    const scaled = clamp(progress, 0, 1) * segmentCount;
    const baseIndex = Math.min(items.length - 1, Math.floor(scaled));
    const phase = scaled - baseIndex;
    const title = horizontalSection.querySelector('.process-horizontal-static-head');
    let threshold = .72;

    if(title && window.innerWidth){
      const rect = title.getBoundingClientRect();
      /*
        El panel siguiente entra desde el borde derecho.
        Cambiamos el color recién cuando ese borde alcanza el área real del título.
      */
      threshold = clamp(1 - ((rect.right + 8) / window.innerWidth), .58, .88);
    }

    if(phase >= threshold){
      return Math.min(items.length - 1, baseIndex + 1);
    }

    return baseIndex;
  }

  function setGuide(progress){
    currentProgress=clamp(progress,0,1);
    const activeIndex=activeIndexFromProgress(currentProgress);
    const contrastIndex=getContrastIndex(currentProgress);

    bullets.forEach(function(bullet,index){
      bullet.classList.toggle('is-active',index===activeIndex);
    });

    if(guide){
      guide.style.setProperty('--process-guide-progress', currentProgress.toFixed(4));
    }

    const contrastItem=items[contrastIndex];

    if(contrastItem&&contrastItem.classList.contains('is-light-text')){
      horizontalSection.classList.add('is-light-stage');
    }else{
      horizontalSection.classList.remove('is-light-stage');
    }
  }

  function scrollToProgress(progress){
    if(!timeline||!timeline.scrollTrigger) return;
    const p=clamp(progress,0,1);
    const target=timeline.scrollTrigger.start+scrollDistance*p;
    window.scrollTo({top:target,behavior:'auto'});
    setGuide(p);
  }
  function reset(){
    if(timeline){ if(timeline.scrollTrigger) timeline.scrollTrigger.kill(); timeline.kill(); timeline=null; }
    window.gsap.set(items,{clearProps:'transform,opacity,scale,zIndex'});
    setGuide(0);
  }
  function initScroll(){
    reset();
    if(!desktopQuery.matches) return;
    items.forEach(function(item,index){
      window.gsap.set(item,{xPercent:index===0?0:100,zIndex:items.length+index,opacity:1,scale:1});
    });
    timeline=window.gsap.timeline({
      scrollTrigger:{
        trigger:horizontalSection,
        pin:true,
        start:'top top',
        end:function(){ return '+='+((items.length-1)*100)+'%'; },
        scrub:1,
        anticipatePin:1,
        invalidateOnRefresh:true,
        onRefresh:function(self){ scrollDistance=Math.max(1,self.end-self.start); },
        onUpdate:function(self){ setGuide(self.progress); }
      },
      defaults:{ease:'none'}
    });
    items.forEach(function(item,index){
      if(index!==items.length-1){
        timeline.to(item,{xPercent:-100,duration:1}).to(items[index+1],{xPercent:0,duration:1},'<');
      }
    });
    setGuide(0);
  }
  if(guide){
    bullets.forEach(function(bullet){
      bullet.addEventListener('click',function(e){
        e.stopPropagation();
        const index=Number(this.getAttribute('data-process-guide'))||0;
        scrollToProgress(index/Math.max(items.length-1,1));
      });
    });
  }
  function beginDrag(event){
    if(!desktopQuery.matches||!timeline||!timeline.scrollTrigger) return;
    if(event.target.closest('a, button') && !event.target.closest('.process-horizontal-guide')) return;
    isDragging=true;
    dragStartX=event.clientX;
    dragStartProgress=currentProgress;
    horizontalSection.classList.add('is-dragging');
    try{ horizontalSection.setPointerCapture(event.pointerId); }catch(e){}
    event.preventDefault();
  }
  function moveDrag(event){
    if(!isDragging) return;
    const rect=horizontalSection.getBoundingClientRect();
    const delta=(event.clientX-dragStartX)/Math.max(rect.width,1);
    scrollToProgress(dragStartProgress - delta);
    event.preventDefault();
  }
  function endDrag(event){
    if(!isDragging) return;
    isDragging=false;
    horizontalSection.classList.remove('is-dragging');
    try{ horizontalSection.releasePointerCapture(event.pointerId); }catch(e){}
  }
  horizontalSection.addEventListener('pointerdown', beginDrag);
  horizontalSection.addEventListener('pointermove', moveDrag);
  horizontalSection.addEventListener('pointerup', endDrag);
  horizontalSection.addEventListener('pointercancel', endDrag);
  horizontalSection.addEventListener('pointerleave', function(event){ if(isDragging && event.buttons===0) endDrag(event); });
  initScroll();
  desktopQuery.addEventListener('change', function(){ initScroll(); if(window.ScrollTrigger&&typeof window.ScrollTrigger.refresh==='function'){window.ScrollTrigger.refresh();} });
  window.addEventListener('load', function(){ if(window.ScrollTrigger&&typeof window.ScrollTrigger.refresh==='function'){window.ScrollTrigger.refresh();} });
})();


// === V46I: Locomotive-style scroll más perceptible ===
// Scroll suave global con inercia visible. No usa wrapper transformado para no romper ScrollTrigger/pin.
(function(){
  const root = document.documentElement;
  const body = document.body;

  if(!root || !body) return;

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduceMotion) return;

  let target = window.scrollY || window.pageYOffset || 0;
  let current = target;
  let rafId = null;
  let isAnimating = false;
  let lastY = target;
  let lastInputAt = 0;

  const config = {
    lerp: 0.065,              // menor = más resago visible
    wheelMultiplier: 1.18,    // más avance objetivo por rueda
    maxDelta: 980,
    stopThreshold: 0.08,
    minDesktopWidth: 768
  };

  function isEnabledViewport(){
    return window.innerWidth >= config.minDesktopWidth;
  }

  function maxScroll(){
    return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  }

  function clamp(value, min, max){
    return Math.min(Math.max(value, min), max);
  }

  function shouldBypass(){
    return (
      !isEnabledViewport() ||
      body.classList.contains('pl-scroll-loader-active') ||
      body.classList.contains('pl-scroll-loader-finishing') ||
      body.classList.contains('pl-scroll-landing-lock') ||
      root.classList.contains('pl-scroll-loader-lock')
    );
  }

  function updateScrollTriggers(){
    if(window.ScrollTrigger && typeof window.ScrollTrigger.update === 'function'){
      window.ScrollTrigger.update();
    }
  }

  function syncToNative(){
    current = window.scrollY || window.pageYOffset || 0;
    target = current;
    lastY = current;
  }

  function animate(){
    rafId = null;

    if(shouldBypass()){
      isAnimating = false;
      syncToNative();
      return;
    }

    current += (target - current) * config.lerp;

    if(Math.abs(target - current) <= config.stopThreshold){
      current = target;
      isAnimating = false;
    }else{
      isAnimating = true;
    }

    window.scrollTo(0, current);
    updateScrollTriggers();
    lastY = current;

    if(isAnimating){
      rafId = window.requestAnimationFrame(animate);
    }
  }

  function requestAnimate(){
    if(rafId === null){
      rafId = window.requestAnimationFrame(animate);
    }
  }

  function normalizeWheelDelta(event){
    let delta = event.deltaY;

    if(event.deltaMode === 1){
      delta *= 18;
    }else if(event.deltaMode === 2){
      delta *= window.innerHeight;
    }

    return clamp(delta, -config.maxDelta, config.maxDelta) * config.wheelMultiplier;
  }

  function onWheel(event){
    if(shouldBypass()) return;
    if(event.ctrlKey || event.metaKey || event.shiftKey) return;

    const nativeScrollTarget = event.target && event.target.closest
      ? event.target.closest('[data-native-scroll], textarea, select, .modal, .dropdown-menu')
      : null;

    if(nativeScrollTarget) return;

    const delta = normalizeWheelDelta(event);
    if(delta === 0) return;

    event.preventDefault();

    lastInputAt = performance.now();
    target = clamp(target + delta, 0, maxScroll());

    // Si el usuario vuelve a scrollear mientras hay inercia, mantiene continuidad.
    if(!isAnimating){
      current = window.scrollY || window.pageYOffset || 0;
    }

    isAnimating = true;
    requestAnimate();
  }

  function onScroll(){
    const y = window.scrollY || window.pageYOffset || 0;
    const now = performance.now();

    /*
      Si el scroll lo cambia un ancla, un drag interno, una navegación programática
      o ScrollTrigger, sincronizamos. Si viene de nuestra animación, no pisamos target.
    */
    const isRecentWheel = now - lastInputAt < 180;
    const isOurAnimation = isAnimating || isRecentWheel;

    if(!isOurAnimation && Math.abs(y - lastY) > 2){
      current = y;
      target = y;
    }

    lastY = y;
  }

  function onResize(){
    target = clamp(target, 0, maxScroll());
    current = clamp(current, 0, maxScroll());

    if(window.ScrollTrigger && typeof window.ScrollTrigger.refresh === 'function'){
      window.ScrollTrigger.refresh();
    }
  }

  function enable(){
    root.classList.add('pl-locomotive-style-active');
    body.classList.add('pl-locomotive-style-active');

    syncToNative();

    window.addEventListener('wheel', onWheel, { passive:false });
    window.addEventListener('scroll', onScroll, { passive:true });
    window.addEventListener('resize', onResize, { passive:true });

    if(window.ScrollTrigger && typeof window.ScrollTrigger.refresh === 'function'){
      window.ScrollTrigger.refresh();
    }
  }

  function waitForLoader(){
    if(!body.classList.contains('pl-scroll-loader-active') && !root.classList.contains('pl-scroll-loader-lock')){
      enable();
      return;
    }

    window.setTimeout(waitForLoader, 120);
  }

  waitForLoader();

  window.plSmoothScrollSync = function(){
    syncToNative();
  };
})();


// === V47A: auto-snap suave entre secciones, compatible con GitHub Pages ===
// No usa backend ni librerías nuevas. Ajusta solo cuando el usuario ya terminó de scrollear.
(function(){
  const root = document.documentElement;
  const body = document.body;

  if(!root || !body) return;

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduceMotion) return;

  const sectionSelectors = ['#about', '#methodology', '#projects', '#networks', '#contact'];
  const sections = sectionSelectors
    .map(function(selector){ return document.querySelector(selector); })
    .filter(Boolean);

  if(sections.length < 2) return;

  const config = {
    threshold: 94,       // distancia máxima al borde superior para corregir
    debounce: 180,       // espera tras el último scroll
    duration: 520,       // duración del ajuste
    easingPower: 3,
    minDesktopWidth: 768
  };

  let timer = null;
  let isSnapping = false;
  let lastUserInputAt = 0;

  function isEnabledViewport(){
    return window.innerWidth >= config.minDesktopWidth;
  }

  function shouldBypass(){
    return (
      !isEnabledViewport() ||
      isSnapping ||
      body.classList.contains('pl-scroll-loader-active') ||
      body.classList.contains('pl-scroll-loader-finishing') ||
      body.classList.contains('pl-scroll-landing-lock') ||
      root.classList.contains('pl-scroll-loader-lock') ||
      body.classList.contains('is-dragging') ||
      document.querySelector('[data-horizontal-process-section].is-dragging')
    );
  }

  function easeOutCubic(t){
    return 1 - Math.pow(1 - t, config.easingPower);
  }

  function maxScroll(){
    return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  }

  function clamp(value, min, max){
    return Math.min(Math.max(value, min), max);
  }

  function sectionTop(section){
    return window.scrollY + section.getBoundingClientRect().top;
  }

  function findNearestCandidate(){
    const viewportTop = 0;
    let best = null;

    sections.forEach(function(section){
      const rect = section.getBoundingClientRect();

      /*
        Regla: solo snap cuando el borde superior de la nueva sección está cerca
        del borde superior del viewport. Esto evita que salte dentro de Metodología
        mientras corre la parte pinned/horizontal.
      */
      const distance = Math.abs(rect.top - viewportTop);

      const isNearTop = distance <= config.threshold;
      const isVisibleEnough = rect.bottom > 120 && rect.top < window.innerHeight - 120;

      if(!isNearTop || !isVisibleEnough) return;

      if(!best || distance < best.distance){
        best = { section: section, distance: distance };
      }
    });

    return best;
  }

  function animateTo(targetY){
    const startY = window.scrollY || window.pageYOffset || 0;
    const delta = targetY - startY;

    if(Math.abs(delta) < 3) return;

    isSnapping = true;

    const startedAt = performance.now();

    function frame(now){
      const elapsed = now - startedAt;
      const t = clamp(elapsed / config.duration, 0, 1);
      const eased = easeOutCubic(t);
      const y = startY + delta * eased;

      window.scrollTo(0, y);

      if(window.ScrollTrigger && typeof window.ScrollTrigger.update === 'function'){
        window.ScrollTrigger.update();
      }

      if(t < 1){
        window.requestAnimationFrame(frame);
      }else{
        window.scrollTo(0, targetY);

        if(typeof window.plSmoothScrollSync === 'function'){
          window.plSmoothScrollSync();
        }

        if(window.ScrollTrigger && typeof window.ScrollTrigger.update === 'function'){
          window.ScrollTrigger.update();
        }

        isSnapping = false;
      }
    }

    window.requestAnimationFrame(frame);
  }

  function maybeSnap(){
    if(shouldBypass()) return;

    const now = performance.now();
    if(now - lastUserInputAt < config.debounce) return;

    const candidate = findNearestCandidate();
    if(!candidate) return;

    const target = clamp(sectionTop(candidate.section), 0, maxScroll());

    /*
      Si ya está prácticamente alineada, no hacemos nada.
      Esto evita microcorrecciones molestas.
    */
    if(Math.abs(window.scrollY - target) < 4) return;

    animateTo(target);
  }

  function scheduleSnap(){
    if(shouldBypass()) return;

    window.clearTimeout(timer);
    timer = window.setTimeout(maybeSnap, config.debounce);
  }

  function markUserInput(){
    lastUserInputAt = performance.now();
    scheduleSnap();
  }

  function enable(){
    root.classList.add('pl-section-snap-enabled');

    window.addEventListener('wheel', markUserInput, { passive:true });
    window.addEventListener('touchend', markUserInput, { passive:true });
    window.addEventListener('keyup', function(event){
      const keys = ['Space','PageDown','PageUp','ArrowDown','ArrowUp','Home','End'];
      if(keys.includes(event.code)) markUserInput();
    }, { passive:true });

    /*
      También escuchamos scroll para capturar trackpads, barra lateral del navegador
      y navegación interna por anclas.
    */
    window.addEventListener('scroll', scheduleSnap, { passive:true });
    window.addEventListener('resize', function(){
      window.clearTimeout(timer);
    }, { passive:true });
  }

  function waitForLoader(){
    if(!body.classList.contains('pl-scroll-loader-active') && !root.classList.contains('pl-scroll-loader-lock')){
      enable();
      return;
    }

    window.setTimeout(waitForLoader, 160);
  }

  waitForLoader();
})();

