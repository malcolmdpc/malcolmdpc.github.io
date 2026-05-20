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




// V26B: smooth FLIP repository project filters
(function(){
  const buttons = Array.from(document.querySelectorAll('.repo-filter-btn'));
  const cards = Array.from(document.querySelectorAll('.github-project-card[data-tags]'));
  const grid = document.querySelector('.github-project-grid');
  const empty = document.querySelector('.repo-empty-message');

  if(!buttons.length || !cards.length || !grid) return;

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let activeFilter = 'all';
  let isFiltering = false;

  function tagsFor(card){
    return (card.dataset.tags || '').trim().toLowerCase().split(/\s+/).filter(Boolean);
  }

  function shouldShow(card, filter){
    return filter === 'all' || tagsFor(card).includes(filter);
  }

  function visibleCards(){
    return cards.filter(card => !card.classList.contains('is-filtered-out'));
  }

  function rectMap(items){
    const map = new Map();
    items.forEach(card => map.set(card, card.getBoundingClientRect()));
    return map;
  }

  function animateCard(card, keyframes, options){
    if(!card.animate || reduceMotion){
      return Promise.resolve();
    }
    const animation = card.animate(keyframes, options);
    return animation.finished.catch(() => {});
  }

  function setEmptyState(count){
    if(empty) empty.hidden = count > 0;
  }

  function applyImmediate(filter){
    const shown = cards.filter(card => shouldShow(card, filter));

    cards.forEach(card => {
      const show = shouldShow(card, filter);
      card.classList.toggle('is-filtered-out', !show);
      card.classList.remove('is-filtering-out', 'is-filtering-in');
      card.style.opacity = '';
      card.style.transform = '';
    });

    setEmptyState(shown.length);
  }

  async function applyFilter(filter){
    if(filter === activeFilter || isFiltering) return;

    isFiltering = true;
    activeFilter = filter;
    grid.classList.add('is-filtering');
    if(empty) empty.hidden = true;

    const beforeVisible = visibleCards();
    const beforeRects = rectMap(beforeVisible);

    const toShow = cards.filter(card => shouldShow(card, filter));
    const toShowSet = new Set(toShow);
    const toHide = beforeVisible.filter(card => !toShowSet.has(card));
    const toReveal = cards.filter(card => toShowSet.has(card) && card.classList.contains('is-filtered-out'));
    const staying = beforeVisible.filter(card => toShowSet.has(card));

    toHide.forEach(card => card.classList.add('is-filtering-out'));

    await Promise.all(toHide.map(card => animateCard(card, [
      {opacity:1, transform:'scale(1) translateY(0)'},
      {opacity:0, transform:'scale(.975) translateY(8px)'}
    ], {
      duration:150,
      easing:'cubic-bezier(.4,0,.2,1)',
      fill:'forwards'
    })));

    toHide.forEach(card => {
      card.classList.add('is-filtered-out');
      card.classList.remove('is-filtering-out');
      card.style.opacity = '';
      card.style.transform = '';
    });

    toReveal.forEach(card => {
      card.classList.remove('is-filtered-out');
      card.classList.add('is-filtering-in');
      card.style.opacity = '0';
      card.style.transform = 'scale(.985) translateY(10px)';
    });

    // Forzar layout después de ocultar/mostrar.
    grid.getBoundingClientRect();

    const afterVisible = visibleCards();
    const afterRects = rectMap(afterVisible);

    const moveAnimations = staying.map(card => {
      const first = beforeRects.get(card);
      const last = afterRects.get(card);
      if(!first || !last) return Promise.resolve();

      const dx = first.left - last.left;
      const dy = first.top - last.top;

      if(Math.abs(dx) < 1 && Math.abs(dy) < 1) return Promise.resolve();

      return animateCard(card, [
        {transform:`translate(${dx}px, ${dy}px)`},
        {transform:'translate(0, 0)'}
      ], {
        duration:380,
        easing:'cubic-bezier(.16,1,.3,1)',
        fill:'both'
      });
    });

    const revealAnimations = toReveal.map((card, index) => {
      card.style.opacity = '';
      card.style.transform = '';

      return animateCard(card, [
        {opacity:0, transform:'scale(.985) translateY(12px)'},
        {opacity:1, transform:'scale(1) translateY(0)'}
      ], {
        duration:300,
        delay:index * 24,
        easing:'cubic-bezier(.16,1,.3,1)',
        fill:'both'
      });
    });

    await Promise.all([...moveAnimations, ...revealAnimations]);

    cards.forEach(card => {
      card.classList.remove('is-filtering-in', 'is-filtering-out');
      card.style.opacity = '';
      card.style.transform = '';
    });

    setEmptyState(toShow.length);
    grid.classList.remove('is-filtering');
    isFiltering = false;
  }

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = (button.dataset.repoFilter || 'all').toLowerCase();

      if(isFiltering || filter === activeFilter) return;

      buttons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      if(reduceMotion){
        activeFilter = filter;
        applyImmediate(filter);
      }else{
        applyFilter(filter);
      }
    });
  });

  applyImmediate('all');
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
      section: '#project',
      items: [
        'h2',
        '.social-card'
      ]
    },
    {
      section: '#resume',
      items: [
        'h2',
        '.timeline-scroll-note',
        '.process-timeline .timeline-wrapper',
        '.stack-timeline .timeline-wrapper',
        '.stack-pills'
      ]
    },
    {
      section: '#repository',
      items: [
        'h2',
        '.projects-intro',
        '.repo-filter-toolbar',
        '.github-project-card'
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

      if(item.matches('.social-card, .github-project-card, .contact-panel, .boxed-mail-form')){
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
