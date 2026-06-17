(function(){
  const DEFAULT_VERSION = 'default-es-dark';
  const VERSION_KEY = 'patronesLabDefaultVersion';

  try{
    if(localStorage.getItem(VERSION_KEY) !== DEFAULT_VERSION){
      localStorage.setItem('patronesLabLanguage', 'es');
      localStorage.setItem(VERSION_KEY, DEFAULT_VERSION);
    }
  }catch(e){}

  document.documentElement.lang = 'es';

  if(document.body){
    document.body.classList.add('dark-mode');
  }else{
    document.addEventListener('DOMContentLoaded', function(){
      document.body.classList.add('dark-mode');
    }, {once:true});
  }
})();

(function ($) {

  "use strict";

  const savedMode = localStorage.getItem('patrones-lab-color-mode');
  const shouldUseDark = savedMode === null || savedMode === 'dark';

  $('body').toggleClass('dark-mode', shouldUseDark);
  $('.color-mode-icon').toggleClass('active', shouldUseDark);

  
// Sincroniza el icono de modo visual con el estado real del tema.
// En modo oscuro muestra sol; en modo claro muestra luna.
function syncColorModeIconWithTheme() {
  var isDarkMode = document.body.classList.contains('dark-mode');
  $('.color-mode-icon').toggleClass('active', isDarkMode);
}
syncColorModeIconWithTheme();

$(document).on('click', '.color-mode', function () {
  setTimeout(syncColorModeIconWithTheme, 0);
});

$('.color-mode').on('click', function(){
    const nextIsDark = !$('body').hasClass('dark-mode');
    $('body').toggleClass('dark-mode', nextIsDark);
    $('.color-mode-icon').toggleClass('active', nextIsDark);
    localStorage.setItem('patrones-lab-color-mode', nextIsDark ? 'dark' : 'light');
  });
  $('.color-mode').on('keydown', function(event){
    if(event.key === 'Enter' || event.key === ' '){
      event.preventDefault();
      $(this).trigger('click');
    }
  });
  $('.nav-link, .custom-btn-link, .custom-btn[href^="#"]').on('click', function(event) {
    const href = $(this).attr('href');
    if(href && href.startsWith('#') && $(href).length){
      $('html, body').stop().animate({
          scrollTop: $(href).offset().top - 64
      }, 800);
      event.preventDefault();
    }
  });

  $('#contactForm').on('submit', function(event){
    event.preventDefault();
    const name = $('#name').val() || '';
    const email = $('#email').val() || '';
    const message = $('#message').val() || '';
    const isEnglish = (window.plCurrentLanguageForContact && window.plCurrentLanguageForContact() === 'en');
    const subject = encodeURIComponent(isEnglish ? 'Contact from Patrones Lab' : 'Contacto desde Patrones Lab');
    const body = encodeURIComponent(
      (isEnglish ? 'Name: ' : 'Nombre: ') + name + '\n' +
      'Email: ' + email + '\n\n' +
      (isEnglish ? 'Message:\n' : 'Mensaje:\n') + message
    );
    window.location.href = 'mailto:encontrandopatrones@gmail.com?subject=' + subject + '&body=' + body;
  });

})(jQuery);


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
  const maxIcons = 0;

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

  const firstSectionId = sectionPairs[0].target.id;

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
    
    if(window.scrollY <= 96){
      return firstSectionId;
    }

    const offset = window.innerHeight * 0.38;
    let current = firstSectionId;

    sectionPairs.forEach(({target}) => {
      const rect = target.getBoundingClientRect();

      if(rect.top <= offset && rect.bottom > offset){
        current = target.id;
      }
    });

    const reachedRealBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
    if(window.scrollY > 96 && reachedRealBottom){
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

  function requestUpdate(){
    if(!ticking){
      requestAnimationFrame(updateActive);
      ticking = true;
    }
  }

  setActiveById(firstSectionId);

  window.addEventListener('scroll', requestUpdate, {passive:true});
  window.addEventListener('resize', updateActive);

  links.forEach(link => {
    link.addEventListener('click', function(){
      const href = this.getAttribute('href');
      if(href && href.length > 1){
        setActiveById(href.slice(1));
      }
    });
  });

  
  window.setTimeout(updateActive, 120);
  window.setTimeout(updateActive, 480);
  window.setTimeout(updateActive, 1100);
})();


(function(){
  function startHeroEntry(){
    document.body.classList.add('hero-entry-ready');
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){
      window.requestAnimationFrame(startHeroEntry);
    }, {once:true});
  }else{
    window.requestAnimationFrame(startHeroEntry);
  }
})();


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


(function(){
  const loader = document.querySelector('.pl-scroll-loader');
  if(!loader) return;

  const body = document.body;
  const html = document.documentElement;
  const params = new URLSearchParams(window.location.search || '');
  const skipIntro = params.has('audit') ||
    params.has('lighthouse') ||
    /Lighthouse|PageSpeed|Chrome-Lighthouse/i.test(navigator.userAgent || '') ||
    (navigator.webdriver === true) ||
    (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  if(skipIntro){
    if(loader.parentNode) loader.parentNode.removeChild(loader);
    body.classList.remove('pl-scroll-loader-active');
    body.classList.remove('pl-scroll-loader-finishing');
    body.classList.remove('pl-scroll-landing-lock');
    body.classList.add('pl-scroll-loader-complete');
    html.classList.remove('pl-scroll-loader-lock');
    window.scrollTo(0, 0);
    return;
  }

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

  window.plGoToMethodologyFirstPanel = function(options){
    const opts = options || {};
    const smooth = opts.smooth !== false;

    if(window.ScrollTrigger && typeof window.ScrollTrigger.refresh === 'function'){
      window.ScrollTrigger.refresh();
    }

    let target = window.scrollY + horizontalSection.getBoundingClientRect().top;

    if(timeline && timeline.scrollTrigger){
      scrollDistance = Math.max(1, timeline.scrollTrigger.end - timeline.scrollTrigger.start);
      target = timeline.scrollTrigger.start;
    }

    target = Math.max(0, target);

    if(window.gsap){
      window.gsap.set(items, {xPercent:function(index){return index===0?0:100;}, opacity:1, scale:1});
    }

    setGuide(0);
    window.scrollTo({top:target, behavior:smooth ? 'smooth' : 'auto'});

    window.setTimeout(function(){
      setGuide(0);
      if(typeof window.plSmoothScrollSync === 'function'){
        window.plSmoothScrollSync();
      }
      if(window.ScrollTrigger && typeof window.ScrollTrigger.update === 'function'){
        window.ScrollTrigger.update();
      }
    }, smooth ? 720 : 40);
  };

  desktopQuery.addEventListener('change', function(){ initScroll(); if(window.ScrollTrigger&&typeof window.ScrollTrigger.refresh==='function'){window.ScrollTrigger.refresh();} });
  window.addEventListener('load', function(){ if(window.ScrollTrigger&&typeof window.ScrollTrigger.refresh==='function'){window.ScrollTrigger.refresh();} });
})();


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

    if(!isAnimating){
      current = window.scrollY || window.pageYOffset || 0;
    }

    isAnimating = true;
    requestAnimate();
  }

  function onScroll(){
    const y = window.scrollY || window.pageYOffset || 0;
    const now = performance.now();

    
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

(function(){
  document.addEventListener('click', function(event){
    const link = event.target && event.target.closest ? event.target.closest('.navbar a[href="#methodology"]') : null;
    if(!link) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    if(typeof window.plGoToMethodologyFirstPanel === 'function'){
      window.plGoToMethodologyFirstPanel({smooth:true});
      return;
    }

    const section = document.querySelector('#methodology');
    if(section){
      section.scrollIntoView({behavior:'smooth', block:'start'});
    }
  }, true);
})();


(function(){
  const projectsSection = document.querySelector('#projects');
  if(!projectsSection) return;

  const groups = Array.from(projectsSection.querySelectorAll('.repo-filter-group'));
  if(!groups.length) return;

  groups.forEach(group => {
    const trigger = group.querySelector('.repo-filter-group-trigger');
    const panel = group.querySelector('.repo-filter-category-panel');
    if(!trigger || !panel) return;

    let closeTimer = null;

    function open(){
      window.clearTimeout(closeTimer);
      trigger.setAttribute('aria-expanded', 'true');
      group.classList.add('is-filter-open');
    }

    function close(){
      window.clearTimeout(closeTimer);
      closeTimer = window.setTimeout(() => {
        trigger.setAttribute('aria-expanded', 'false');
        group.classList.remove('is-filter-open');
      }, 180);
    }

    group.addEventListener('pointerenter', open);
    group.addEventListener('pointerleave', close);
    panel.addEventListener('pointerenter', open);
    panel.addEventListener('pointerleave', close);
    group.addEventListener('focusin', open);
    group.addEventListener('focusout', event => {
      if(!group.contains(event.relatedTarget)) close();
    });
  });
})();

(function(){
  const coarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  const mobileWidth = window.matchMedia && window.matchMedia('(max-width: 767px)').matches;
  if(!coarsePointer && !mobileWidth) return;

  const body = document.body;
  const html = document.documentElement;
  if(!body || !html) return;

  function cleanMobileScrollLocks(){
    const loader = document.querySelector('.pl-scroll-loader');

    if(!loader){
      body.classList.remove('pl-scroll-landing-lock');
      body.classList.remove('pl-scroll-loader-active');
      body.classList.remove('pl-scroll-loader-finishing');
      body.classList.add('pl-scroll-loader-complete');
      html.classList.remove('pl-scroll-loader-lock');
    }

    body.style.removeProperty('overflow');
    body.style.removeProperty('height');
    html.style.removeProperty('overflow');
    html.style.removeProperty('height');
  }

  function refreshScrollSystems(){
    if(typeof window.plSmoothScrollSync === 'function'){
      window.plSmoothScrollSync();
    }

    if(window.ScrollTrigger && typeof window.ScrollTrigger.refresh === 'function'){
      window.ScrollTrigger.refresh(true);
    }
  }

  function killLoaderScrollTriggers(loader){
    if(window.ScrollTrigger && typeof window.ScrollTrigger.getAll === 'function'){
      window.ScrollTrigger.getAll().forEach(function(st){
        try{
          if(st && st.trigger && loader && loader.contains(st.trigger)){
            st.kill(false);
          }
        }catch(error){}
      });
    }
  }

  function finishMobileLoader(){
    const loader = document.querySelector('.pl-scroll-loader');
    if(!loader) {
      cleanMobileScrollLocks();
      return;
    }

    if(loader.dataset.mobileFinished === 'true') return;
    loader.dataset.mobileFinished = 'true';

    const dot = loader.querySelector('.dot');
    const next = loader.querySelector('.pl-scroll-loader__next');

    body.classList.add('pl-scroll-loader-finishing');
    loader.classList.add('pl-mobile-loader-finishing');

    if(dot) dot.style.transform = 'scale(1200)';
    if(next){
      next.style.visibility = 'visible';
      next.style.opacity = '1';
    }

    killLoaderScrollTriggers(loader);

    window.setTimeout(function(){
      if(loader.parentNode){
        loader.parentNode.removeChild(loader);
      }

      body.classList.remove('pl-scroll-loader-active');
      body.classList.remove('pl-scroll-loader-finishing');
      body.classList.remove('pl-scroll-landing-lock');
      body.classList.add('pl-scroll-loader-complete');
      html.classList.remove('pl-scroll-loader-lock');

      window.scrollTo(0, 0);
      cleanMobileScrollLocks();
      refreshScrollSystems();
    }, 520);
  }

  function bindMobileLoader(){
    const loader = document.querySelector('.pl-scroll-loader');
    if(!loader) {
      cleanMobileScrollLocks();
      return;
    }

    loader.setAttribute('role', 'button');
    loader.setAttribute('tabindex', '0');
    loader.setAttribute('aria-label', 'Patrones Lab Data & Analytics. Tocar para entrar al sitio');

    loader.addEventListener('pointerdown', finishMobileLoader, {passive:true, once:true});
    loader.addEventListener('touchstart', finishMobileLoader, {passive:true, once:true});
    loader.addEventListener('click', finishMobileLoader, {passive:true, once:true});
    loader.addEventListener('keydown', function(event){
      if(event.code === 'Enter' || event.code === 'Space'){
        finishMobileLoader();
      }
    }, {once:true});

    window.setTimeout(function(){
      if(document.querySelector('.pl-scroll-loader')){
        cleanMobileScrollLocks();
      }
    }, 6500);
  }

  bindMobileLoader();

  window.addEventListener('pageshow', cleanMobileScrollLocks, {passive:true});
  window.addEventListener('load', function(){
    window.setTimeout(cleanMobileScrollLocks, 900);
  }, {passive:true});
})();


(function(){
  const coarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  const mobileWidth = window.matchMedia && window.matchMedia('(max-width: 767px)').matches;
  if(!coarsePointer && !mobileWidth) return;

  const html = document.documentElement;
  const body = document.body;

  function cleanMobileState(){
    if(!html || !body) return;

    html.classList.remove('pl-section-snap-enabled');
    html.classList.remove('pl-locomotive-style-active');
    body.classList.remove('pl-locomotive-style-active');
    body.classList.remove('pl-mobile-method-pinned');
    body.classList.remove('pl-mobile-method-exit');
    body.classList.remove('is-mobile-process-dragging');

    html.style.scrollBehavior = 'auto';
    body.style.scrollBehavior = 'auto';

    body.style.removeProperty('overflow');
    body.style.removeProperty('height');
    html.style.removeProperty('overflow');
    html.style.removeProperty('height');
  }

  document.addEventListener('click', function(event){
    const link = event.target && event.target.closest ? event.target.closest('a[href^="#"]') : null;
    if(!link) return;

    const href = link.getAttribute('href');
    if(!href || href === '#') return;

    const target = document.querySelector(href);
    if(!target) return;

    event.preventDefault();
    target.scrollIntoView({behavior:'auto', block:'start'});
  }, true);

  window.addEventListener('pageshow', cleanMobileState, {passive:true});
  window.addEventListener('load', cleanMobileState, {passive:true});
  window.addEventListener('resize', cleanMobileState, {passive:true});
  window.setTimeout(cleanMobileState, 0);
  window.setTimeout(cleanMobileState, 500);
  window.setTimeout(cleanMobileState, 1200);
})();


(function(){
  const coarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  const mobileWidth = window.matchMedia && window.matchMedia('(max-width: 767px)').matches;
  if(!coarsePointer && !mobileWidth) return;

  const section = document.querySelector('#methodology[data-horizontal-process-section]');
  if(!section) return;

  const track = section.querySelector('.process-horizontal-track');
  const panels = Array.from(section.querySelectorAll('.process-horizontal-panel'));
  if(!track || panels.length < 2) return;

  let startX = 0;
  let startY = 0;
  let moved = false;
  let ticking = false;

  function clamp(value, min, max){
    return Math.min(Math.max(value, min), max);
  }

  function getIndex(){
    const width = Math.max(1, window.innerWidth);
    return clamp(Math.round(track.scrollLeft / width), 0, panels.length - 1);
  }

  function updateTitleContrast(index){
    const active = panels[clamp(index, 0, panels.length - 1)];
    const needsLightTitle = active && active.classList.contains('is-light-text');

    section.classList.toggle('is-light-stage', !!needsLightTitle);
    section.classList.toggle('is-dark-stage', !needsLightTitle);
  }

  function goTo(index){
    const nextIndex = clamp(index, 0, panels.length - 1);
    track.scrollTo({
      left: nextIndex * window.innerWidth,
      behavior: 'smooth'
    });
    updateTitleContrast(nextIndex);
  }

  function requestContrastUpdate(){
    if(ticking) return;
    ticking = true;
    window.requestAnimationFrame(function(){
      ticking = false;
      updateTitleContrast(getIndex());
    });
  }

  track.addEventListener('scroll', requestContrastUpdate, {passive:true});

  section.addEventListener('touchstart', function(event){
    const touch = event.touches && event.touches[0];
    if(!touch) return;
    startX = touch.clientX;
    startY = touch.clientY;
    moved = false;
  }, {passive:true});

  section.addEventListener('touchmove', function(event){
    const touch = event.touches && event.touches[0];
    if(!touch) return;

    if(Math.abs(touch.clientX - startX) > 8 || Math.abs(touch.clientY - startY) > 8){
      moved = true;
    }
  }, {passive:true});

  section.addEventListener('click', function(event){
    if(moved) return;

    if(event.target && event.target.closest && event.target.closest('a, button')){
      return;
    }

    const rect = section.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const width = Math.max(1, rect.width);
    const current = getIndex();

    if(x >= width * 0.80){
      event.preventDefault();
      goTo(current + 1);
    }else if(x <= width * 0.20){
      event.preventDefault();
      goTo(current - 1);
    }
  }, false);

  window.addEventListener('resize', function(){
    goTo(getIndex());
  }, {passive:true});

  updateTitleContrast(0);
})();


(function(){
  const coarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  const mobileWidth = window.matchMedia && window.matchMedia('(max-width: 767px)').matches;
  if(!coarsePointer && !mobileWidth) return;

  const projects = document.querySelector('#projects');
  if(!projects) return;

  const groups = Array.from(projects.querySelectorAll('.repo-filter-group'));
  if(!groups.length) return;

  let active = null;

  function restorePanel(){
    if(!active) return;

    const { group, panel, next } = active;

    panel.classList.remove('pl-mobile-filter-portal');
    panel.classList.remove('pl-mobile-filter-floating');
    panel.style.removeProperty('--pl-filter-top');
    panel.style.removeProperty('--pl-filter-left');

    if(next && next.parentNode === group){
      group.insertBefore(panel, next);
    }else{
      group.appendChild(panel);
    }

    const trigger = group.querySelector('.repo-filter-group-trigger');
    if(trigger) trigger.setAttribute('aria-expanded', 'false');
    group.classList.remove('is-filter-open');

    active = null;
  }

  function positionPanel(trigger, panel){
    panel.classList.add('pl-mobile-filter-portal');
    panel.classList.remove('pl-mobile-filter-floating');

    const rect = trigger.getBoundingClientRect();

    const panelWidth = Math.min(panel.scrollWidth || panel.offsetWidth || 220, window.innerWidth - 24);
    let left = rect.left;
    const maxLeft = window.innerWidth - panelWidth - 12;

    if(left > maxLeft) left = maxLeft;
    if(left < 12) left = 12;

    const top = Math.min(rect.bottom + 8, window.innerHeight - 80);

    panel.style.setProperty('--pl-filter-top', top + 'px');
    panel.style.setProperty('--pl-filter-left', left + 'px');
  }

  function openGroup(group){
    const trigger = group.querySelector('.repo-filter-group-trigger');
    const panel = group.querySelector('.repo-filter-category-panel') || (active && active.group === group ? active.panel : null);
    if(!trigger || !panel) return;

    if(active && active.group === group){
      restorePanel();
      return;
    }

    restorePanel();

    const next = panel.nextSibling;
    active = { group, panel, next };

    group.classList.add('is-filter-open');
    trigger.setAttribute('aria-expanded', 'true');

    document.body.appendChild(panel);
    positionPanel(trigger, panel);
  }

  groups.forEach(function(group){
    const trigger = group.querySelector('.repo-filter-group-trigger');
    if(!trigger) return;

    trigger.addEventListener('click', function(event){
      event.preventDefault();
      openGroup(group);
    });

    trigger.addEventListener('touchend', function(event){
      event.preventDefault();
      openGroup(group);
    }, {passive:false});
  });

  document.addEventListener('click', function(event){
    if(!active) return;

    const target = event.target;
    const clickedTrigger = active.group && active.group.contains(target);
    const clickedPanel = active.panel && active.panel.contains(target);

    if(clickedPanel && target.closest && target.closest('.repo-filter-btn')){
      window.setTimeout(restorePanel, 120);
      return;
    }

    if(clickedTrigger || clickedPanel) return;

    restorePanel();
  });

  window.addEventListener('scroll', restorePanel, {passive:true});
  window.addEventListener('resize', restorePanel, {passive:true});
})();


(function(){
  const STORAGE_KEY = 'patronesLabLanguage';
  const DEFAULT_LANG = 'es';
  const FLAG_US = 'images/patrones/language-flags/flag-us.svg';
  const FLAG_ES = 'images/patrones/language-flags/flag-es.svg';

  const dictionary = {
    en: {
      title: 'Patrones Lab — Data, BI & Machine Learning Portfolio',
      metaDescription: 'Patrones Lab: a portfolio of reproducible data projects across BI, machine learning, Python, SQL, Power BI, Qlik and Looker Studio.',
      htmlLang: 'en',
      toggleFlag: FLAG_ES,
      toggleLabel: 'Switch to Spanish',

      text: {
        '.tech-logo-card-power-bi small': 'Business Intelligence',
        '.tech-logo-card-qlik small': 'Visual analytics',
        '.tech-logo-card-looker small': 'Dashboards',
        '.tech-logo-card-python small': 'Analysis and modeling',
        '.tech-logo-card-pandas small': 'Data manipulation',
        '.tech-logo-card-scikit small': 'Machine Learning',
        '.tech-logo-card-plotly small': 'Interactive visualization',
        '.tech-logo-card-spss small': 'Visual modeling',
        '.tech-logo-card-snowflake small': 'Data warehouse',
        '.tech-logo-card-databricks small': 'Lakehouse',
        '.floating-cta__text': 'View repository',

        '.navbar-nav .nav-link[href="#about"]': 'Home',
        '.navbar-nav .nav-link[href="#methodology"]': 'Methodology',
        '.navbar-nav .nav-link[href="#projects"]': 'Projects',
        '.navbar-nav .nav-link[href="#networks"]': 'Channels',
        '.navbar-nav .nav-link[href="#contact"]': 'Contact',
        '.color-mode': '<i class="color-mode-icon"></i>',

        '#about .hero-entry-kicker': 'Project portfolio BI · ML · Python · Dashboards',
        '#about .hero-line': 'I turn<br>data into',
        '#about .hero-rotator span:nth-child(1)': 'evidence',
        '#about .hero-rotator span:nth-child(2)': 'models',
        '#about .hero-rotator span:nth-child(3)': 'dashboards',
        '#about .hero-rotator span:nth-child(4)': 'decisions',
        '#about .hero-rotator span:nth-child(5)': 'patterns',
        '#about .hero-entry-copy': 'Patrones Lab is a data analytics lab focused on real-world, everyday phenomena.<br><br>It brings together independent projects built with public data, with an emphasis on finding patterns, explaining behavior and communicating insights with context.<br><br>The goal is to ask better questions, prepare reliable data, build reproducible analyses and turn results into clear visual outputs.',

        '.tech-logo-card-airflow small': 'Orchestration',
        '.tech-logo-card-sql-server small': 'Database',
        '.tech-logo-card-numpy small': 'Numerical Computing',
        '.tech-logo-card-matplotlib small': 'Data Visualization',
        '.tech-logo-card-dbt small': 'Transformation',

        '#methodology .process-horizontal-static-head h2': 'Data Lifecycle',
        '#methodology .process-horizontal-panel:nth-child(1) h3': 'Esplorazione',
        '#methodology .process-horizontal-panel:nth-child(1) small': 'Context & Objective',
        '#methodology .process-horizontal-panel:nth-child(1) p': 'Clarifying the problem, the decision to improve, the users involved and the expected outcome.',
        '#methodology .process-horizontal-panel:nth-child(2) h3': 'Sources',
        '#methodology .process-horizontal-panel:nth-child(2) small': 'Sources & Diagnostics',
        '#methodology .process-horizontal-panel:nth-child(2) p': 'Mapping available data sources, including their origin, refresh cadence, reliability and main limitations.',
        '#methodology .process-horizontal-panel:nth-child(3) h3': 'Preparation',
        '#methodology .process-horizontal-panel:nth-child(3) small': 'Analytical Dataset',
        '#methodology .process-horizontal-panel:nth-child(3) p': 'Structuring, cleaning and combining data into a consistent analytical dataset ready for analysis.',
        '#methodology .process-horizontal-panel:nth-child(4) h3': 'Development',
        '#methodology .process-horizontal-panel:nth-child(4) small': 'Solution',
        '#methodology .process-horizontal-panel:nth-child(4) p': 'Building the analysis, model or dashboard required to address the defined objective.',
        '#methodology .process-horizontal-panel:nth-child(5) h3': 'Validation',
        '#methodology .process-horizontal-panel:nth-child(5) small': 'Quality & Confidence',
        '#methodology .process-horizontal-panel:nth-child(5) p': 'Reviewing the coherence, stability and business relevance of the results before delivery.',
        '#methodology .process-horizontal-panel:nth-child(6) h3': 'Pubblicazione',
        '#methodology .process-horizontal-panel:nth-child(6) small': 'Publishing, Automation & Iteration',
        '#methodology .process-horizontal-panel:nth-child(6) p': 'Documenting the final output, automating recurring workflows and using feedback to guide future improvements.',

        '#projects .section-kicker': 'Patrones Lab Repository',
        '#projects .projects-title-display': 'Projects',
        '#projects .projects-intro': 'A selection of applied projects built with public data, documented methodology and visual outputs. Use the filters to explore by discipline, tool or deliverable type.',
        '#projects .repo-filter-btn[data-repo-filter="all"]': '◎ All',
        '#projects .repo-filter-group:nth-of-type(1) .repo-filter-group-trigger': 'Discipline',
        '#projects .repo-filter-group:nth-of-type(2) .repo-filter-group-trigger': 'Tools',
        '#projects .repo-filter-group:nth-of-type(3) .repo-filter-group-trigger': 'Model',
        '#projects .repo-filter-group:nth-of-type(4) .repo-filter-group-trigger': 'Domain',
        '#projects .repo-filter-btn[data-repo-filter="modelo-supervisado"]': '✓ Supervised Model',
        '#projects .repo-filter-btn[data-repo-filter="modelo-no-supervisado"]': '◎ Unsupervised Model',
        '#projects .repo-filter-btn[data-repo-filter="clasificacion"]': '≡ Classification',
        '#projects .repo-filter-btn[data-repo-filter="regresion-logistica"]': '⌁ Logistic Regression',
        '#projects .repo-filter-btn[data-repo-filter="geoespacial"]': '⌖ Geospatial',
        '#projects .repo-filter-btn[data-repo-filter="futbol"]': '● Soccer',
        '#projects .repo-filter-btn[data-repo-filter="aviacion"]': '✈ Aviation',
        '#projects .repo-filter-btn[data-repo-filter="fraude"]': '! Fraud',

        '#projects .github-project-card:nth-of-type(1) h3': 'Balearic Islands Flight Analysis',
        '#projects .github-project-card:nth-of-type(1) p:not(.project-status)': 'Analysis of air traffic in Spain using public AENA data, focused on volume, airport-level patterns and differences across traffic categories.',
        '#projects .github-project-card:nth-of-type(2) h3': 'Airbnb Lodging Analysis in London',
        '#projects .github-project-card:nth-of-type(2) p:not(.project-status)': 'Exploratory analysis of Airbnb listings in London, focused on pricing, property categories, reviews and spatial patterns.',
        '#projects .github-project-card:nth-of-type(3) h3': 'Chicago Taxi Trip Analysis',
        '#projects .github-project-card:nth-of-type(3) p:not(.project-status)': 'Analysis of reported Chicago taxi trips to study duration, demand, geospatial distribution and operational patterns.',
        '#projects .github-project-card:nth-of-type(4) h3': 'ML Model · Airbnb London',
        '#projects .github-project-card:nth-of-type(4) p:not(.project-status)': 'Supervised classification of listings as relatively expensive or inexpensive within each accommodation type.',
        '#projects .github-project-card:nth-of-type(5) h3': 'Looker Dashboard · Chicago Taxi Trips',
        '#projects .github-project-card:nth-of-type(5) p:not(.project-status)': 'Interactive Looker Studio dashboard for exploring Chicago taxi trips, operational indicators, hourly patterns and pickup-dropoff routes.',
        '#projects .github-project-card:nth-of-type(6) h3': 'ML Model · Expected Goals (xG)',
        '#projects .github-project-card:nth-of-type(6) p:not(.project-status)': 'Coming soon.',
        '#projects .github-project-card:nth-of-type(7) h3': 'Soccer Probabilities · Expected Threat (xT)',
        '#projects .github-project-card:nth-of-type(7) p:not(.project-status)': 'Probabilistic Expected Threat model in soccer using public StatsBomb data. It estimates the probability of a goal in the next 5 actions.',
        '#projects .github-project-card:nth-of-type(8) h3': 'ML Model · Fraud Detection',
        '#projects .github-project-card:nth-of-type(8) p:not(.project-status)': 'Unsupervised K-means clustering applied to credit card fraud detection.',
        '#projects .github-project-card:nth-of-type(9) h3': 'ML Model · Fraud Detection',
        '#projects .github-project-card:nth-of-type(9) p:not(.project-status)': 'Supervised logistic regression model for credit card fraud detection.',
        '#projects .github-project-card:nth-of-type(10) h3': 'ML Model · Fraud Detection',
        '#projects .github-project-card:nth-of-type(10) p:not(.project-status)': 'Unsupervised DBSCAN clustering to detect potential credit card fraud patterns.',
        '#projects .github-project-card:nth-of-type(11) h3': 'Qatar 2022 World Cup Statistics',
        '#projects .github-project-card:nth-of-type(11) p:not(.project-status)': 'Coming soon.',
        '#projects .github-project-card:nth-of-type(12) h3': 'Geospatial Taxi Trip Analysis',
        '#projects .github-project-card:nth-of-type(12) p:not(.project-status)': 'Coming soon.',

        '#projects .repo-empty-message': 'There are no projects in this category yet.',

        '#networks .section-kicker': 'Patrones Lab Online Presence',
        '#networks .projects-title-display': 'Channels',
        '#networks .social-intro': 'The full project ecosystem in one place: visuals, technical notes, articles, dashboards, useful links and professional contact channels.',
        '#networks .social-card.instagram small': 'Visuals and posts',
        '#networks .social-card.linkedin small': 'Professional profile',
        '#networks .social-card.medium small': 'Articles and notes',
        '#networks .social-card.linktree small': 'All links',
        '#networks .social-card.github small': 'Technical profile',
        '#networks .social-card.mail small': 'Direct contact',

        '#contact .contact-panel h3': 'Contact',
        '#contact .contact-panel p:not(.contact-email-line)': 'For professional opportunities, analytics collaboration or BI, machine learning and dashboard projects.',
        '#contact .contact-email-line strong': 'email:',
        '#contact .contact-form h2': 'Leave me a message',
        '#contact .form-note': 'Send me a message and I’ll get back to you shortly.',

        'footer': 'Patrones Lab® · Generating knowledge from data · by Malcolm Di Pietro Cagliari'
      },

      all: [
        ['.project-status.published', '✅ published'],
        ['.project-status.development', '⚠️ in progress'],
        ['#projects .project-link', {
          'Entrar al proyecto': 'Open project',
          'Leer en LinkedIn': 'Read on LinkedIn',
          'Ver dashboard': 'View dashboard',
          'Ver documentación': 'View documentation',
          'Ver en SPSS': 'View in SPSS',
          'Ver en Python': 'View in Python'
        }]
      ],

      attrs: {
        '#name': {placeholder: 'Name'},
        '#message': {placeholder: 'Message'},
        '#contactForm .submit-btn': {value: 'Prepare email'},
        '.floating-cta': {'aria-label': 'View Patrones Lab repository'},
        '.navbar-toggler': {'aria-label': 'Open navigation'},
        '#about .hero-rotator': {'aria-label': 'evidence, models, dashboards, decisions and patterns'},
        '#about .hero-tech-marquee': {'aria-label': 'Technologies used'},
        '#projects .repo-filter-toolbar': {'aria-label': 'Filter projects'}
      }
    }
  };

  const original = new Map();

  function rememberElement(el){
    if(!original.has(el)){
      original.set(el, {
        html: el.innerHTML,
        text: el.textContent,
        attrs: {}
      });
    }
  }

  function setHtml(selector, html){
    document.querySelectorAll(selector).forEach(function(el){
      rememberElement(el);
      el.innerHTML = html;
    });
  }

  function setText(selector, text){
    document.querySelectorAll(selector).forEach(function(el){
      rememberElement(el);
      el.textContent = text;
    });
  }

  function setAttr(selector, attrs){
    document.querySelectorAll(selector).forEach(function(el){
      rememberElement(el);
      Object.keys(attrs).forEach(function(name){
        if(!original.get(el).attrs[name]){
          original.get(el).attrs[name] = el.getAttribute(name);
        }
        el.setAttribute(name, attrs[name]);
      });
    });
  }

  function restoreOriginals(){
    original.forEach(function(value, el){
      if(value.html !== undefined){
        el.innerHTML = value.html;
      }
      Object.keys(value.attrs || {}).forEach(function(name){
        const previous = value.attrs[name];
        if(previous === null || previous === undefined){
          el.removeAttribute(name);
        }else{
          el.setAttribute(name, previous);
        }
      });
    });
  }

  function applyLanguage(lang){
    const isEnglish = lang === 'en';

    if(!isEnglish){
      restoreOriginals();
      document.documentElement.lang = 'es';
      const meta = document.querySelector('meta[name="description"]');
      if(meta){
        meta.setAttribute('content', 'Patrones Lab reúne proyectos de analítica de datos, Business Intelligence y Machine Learning para explorar datos, detectar patrones, generar conocimiento y representar visualmente los descubrimientos.');
      }
      document.title = 'Patrones Lab · Analítica de Datos · Portfolio de proyectos ML y BI';

      document.querySelectorAll('.language-toggle').forEach(function(btn){
        const flag = btn.querySelector('.language-toggle__flag-img');
        if(flag) flag.setAttribute('src', FLAG_US);
        btn.setAttribute('aria-label', 'Cambiar a inglés');
        btn.setAttribute('title', 'English');
      });

      localStorage.setItem(STORAGE_KEY, 'es');
      document.dispatchEvent(new CustomEvent('pl-language-changed', {detail:{language:'es'}}));
      return;
    }

    const dict = dictionary.en;
    document.documentElement.lang = dict.htmlLang;
    document.title = dict.title;

    const meta = document.querySelector('meta[name="description"]');
    if(meta) meta.setAttribute('content', dict.metaDescription);

    Object.keys(dict.text).forEach(function(selector){
      setHtml(selector, dict.text[selector]);
    });

    (dict.all || []).forEach(function(entry){
      const selector = entry[0];
      const value = entry[1];

      document.querySelectorAll(selector).forEach(function(el){
        rememberElement(el);

        if(typeof value === 'string'){
          el.innerHTML = value;
          return;
        }

        const current = el.textContent.trim();
        Object.keys(value).forEach(function(source){
          if(current.indexOf(source) !== -1){
            el.innerHTML = el.innerHTML.replace(source, value[source]);
          }
        });
      });
    });

    Object.keys(dict.attrs).forEach(function(selector){
      setAttr(selector, dict.attrs[selector]);
    });

    document.querySelectorAll('.language-toggle').forEach(function(btn){
      const flag = btn.querySelector('.language-toggle__flag-img');
      if(flag) flag.setAttribute('src', FLAG_ES);
      btn.setAttribute('aria-label', dict.toggleLabel);
      btn.setAttribute('title', 'Español');
    });

    localStorage.setItem(STORAGE_KEY, 'en');
    document.dispatchEvent(new CustomEvent('pl-language-changed', {detail:{language:'en'}}));
  }

  function currentLang(){
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  }

  document.addEventListener('click', function(event){
    const btn = event.target.closest && event.target.closest('.language-toggle');
    if(!btn) return;

    event.preventDefault();
    const next = currentLang() === 'en' ? 'es' : 'en';
    applyLanguage(next);
  });

  window.plGetLanguage = currentLang;
  window.plSetLanguage = applyLanguage;

  applyLanguage(currentLang());

  window.plCurrentLanguageForContact = currentLang;
})();


(function(){
  function ensureInitialDarkMode(){
    const versionKey = 'patronesLabThemeDefaultVersion';
    const defaultVersion = 'default-dark';

    try{
      if(localStorage.getItem(versionKey) !== defaultVersion){
        document.body.classList.add('dark-mode');
        localStorage.setItem(versionKey, defaultVersion);
      }
    }catch(e){
      document.body.classList.add('dark-mode');
    }
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', ensureInitialDarkMode, {once:true});
  }else{
    ensureInitialDarkMode();
  }
})();


(function(){
  const projectsSection = document.querySelector('#projects');
  if(!projectsSection) return;

  function getCards(){
    return Array.from(projectsSection.querySelectorAll('.github-project-card[data-tags]'));
  }

  function getButtons(){
    return Array.from(document.querySelectorAll('.repo-filter-btn[data-repo-filter]'));
  }

  function normalizeTags(card){
    return (card.dataset.tags || '')
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);
  }

  function shouldShow(card, filter){
    return filter === 'all' || normalizeTags(card).includes(filter);
  }

  function setActiveFilter(filter){
    getButtons().forEach(function(button){
      const isActive = button.dataset.repoFilter === filter;
      button.classList.toggle('active', isActive);
      if(isActive){
        button.setAttribute('aria-pressed', 'true');
      }else{
        button.removeAttribute('aria-pressed');
      }
    });
  }

  function applyRepoFilter(filter){
    const cards = getCards();
    const empty = projectsSection.querySelector('.repo-empty-message');
    let visibleCount = 0;

    cards.forEach(function(card){
      const show = shouldShow(card, filter);
      card.classList.toggle('is-filtered-out', !show);
      card.hidden = !show;
      if(show) visibleCount += 1;
    });

    if(empty) empty.hidden = visibleCount > 0;

    projectsSection.dataset.activeRepoFilter = filter;
    setActiveFilter(filter);
  }

  document.addEventListener('click', function(event){
    const button = event.target.closest && event.target.closest('.repo-filter-btn[data-repo-filter]');
    if(!button) return;

    const filter = button.dataset.repoFilter;
    if(!filter) return;

    event.preventDefault();
    applyRepoFilter(filter);
  }, true);

  window.plApplyRepoFilter = applyRepoFilter;
  window.plGetActiveRepoFilter = function(){
    return projectsSection.dataset.activeRepoFilter || 'all';
  };

  applyRepoFilter(projectsSection.dataset.activeRepoFilter || 'all');

  document.addEventListener('pl-language-changed', function(){
    applyRepoFilter(projectsSection.dataset.activeRepoFilter || 'all');
  });
})();


(function(){
  const STORAGE_KEY = 'patronesLabLanguage';
  const FLAG_US = 'images/patrones/language-flags/flag-us.svg';
  const FLAG_ES = 'images/patrones/language-flags/flag-es.svg';

  const dict = {
    es: {
      title: 'Patrones Lab · Analítica de Datos · Portfolio de proyectos ML y BI',
      metaDescription: 'Patrones Lab reúne proyectos de analítica de datos, Business Intelligence y Machine Learning para explorar datos, detectar patrones, generar conocimiento y representar visualmente los descubrimientos.',
      htmlLang: 'es',
      toggleFlag: FLAG_US,
      toggleLabel: 'Cambiar a inglés',
      toggleTitle: 'English',
      text: {
        '.tech-logo-card-power-bi small': 'Inteligencia de negocio',
        '.tech-logo-card-qlik small': 'Analítica visual',
        '.tech-logo-card-looker small': 'Dashboards',
        '.tech-logo-card-python small': 'Análisis y modelado',
        '.tech-logo-card-pandas small': 'Manipulación de datos',
        '.tech-logo-card-scikit small': 'Machine Learning',
        '.tech-logo-card-plotly small': 'Visualización interactiva',
        '.tech-logo-card-spss small': 'Modelado visual',
        '.tech-logo-card-snowflake small': 'Data warehouse',
        '.tech-logo-card-databricks small': 'Lakehouse',
        '.floating-cta__text': 'Ver repo',

        '.navbar-nav .nav-link[href="#about"]': 'Inicio',
        '.navbar-nav .nav-link[href="#methodology"]': 'Metodología',
        '.navbar-nav .nav-link[href="#projects"]': 'Proyectos',
        '.navbar-nav .nav-link[href="#networks"]': 'Redes',
        '.navbar-nav .nav-link[href="#contact"]': 'Contacto',
        '.color-mode': '<i class="color-mode-icon"></i>',

        '#about .hero-entry-kicker': 'Portfolio de proyectos <span class="mobile-block">BI · ML · Python · Dashboards</span>',
        '#about .hero-line': 'Transformo datos en',
        '#about .hero-rotator span:nth-child(1)': 'evidencia',
        '#about .hero-rotator span:nth-child(2)': 'modelos',
        '#about .hero-rotator span:nth-child(3)': 'dashboards',
        '#about .hero-rotator span:nth-child(4)': 'decisiones',
        '#about .hero-rotator span:nth-child(5)': 'patrones',
        '#about .hero-entry-copy': 'Patrones Lab es un laboratorio de análisis de datos aplicado a fenómenos cotidianos y reales.<br><br>Aquí se trabajan proyectos independientes construidos a partir de datos públicos, con foco en detectar patrones, describir comportamientos y comunicar los hallazgos con su contexto.<br><br>El objetivo es plantear preguntas, preparar datos, construir análisis claros y generar resultados visuales.',

        '.tech-logo-card-airflow small': 'Orquestación',
        '.tech-logo-card-sql-server small': 'Base de datos',
        '.tech-logo-card-numpy small': 'Cálculo numérico',
        '.tech-logo-card-matplotlib small': 'Visualización',
        '.tech-logo-card-dbt small': 'Transformación',

        '#methodology .process-horizontal-static-head h2': 'Ciclo de vida del dato',
        '#methodology .process-horizontal-panel:nth-child(1) h3': 'Descubrimiento',
        '#methodology .process-horizontal-panel:nth-child(1) small': 'Contexto y objetivo',
        '#methodology .process-horizontal-panel:nth-child(1) p': 'Entendimiento del problema, la decisión a mejorar, los usuarios involucrados y el resultado esperado.',
        '#methodology .process-horizontal-panel:nth-child(2) h3': 'Fuentes',
        '#methodology .process-horizontal-panel:nth-child(2) small': 'Datos y diagnóstico',
        '#methodology .process-horizontal-panel:nth-child(2) p': 'Identificación de las fuentes disponibles, su origen, actualización, confiabilidad y principales limitaciones.',
        '#methodology .process-horizontal-panel:nth-child(3) h3': 'Preparación',
        '#methodology .process-horizontal-panel:nth-child(3) small': 'Base analítica',
        '#methodology .process-horizontal-panel:nth-child(3) p': 'Organización, limpieza y combinación de datos para construir una base consistente y usable.',
        '#methodology .process-horizontal-panel:nth-child(4) h3': 'Construcción',
        '#methodology .process-horizontal-panel:nth-child(4) small': 'Solución',
        '#methodology .process-horizontal-panel:nth-child(4) p': 'Desarrollo del análisis, modelo o dashboard necesario según el objetivo definido.',
        '#methodology .process-horizontal-panel:nth-child(5) h3': 'Validación',
        '#methodology .process-horizontal-panel:nth-child(5) small': 'Control y confianza',
        '#methodology .process-horizontal-panel:nth-child(5) p': 'Revisión de la coherencia, estabilidad y alineación de los resultados con la realidad del negocio.',
        '#methodology .process-horizontal-panel:nth-child(6) h3': 'Entrega',
        '#methodology .process-horizontal-panel:nth-child(6) small': 'Publicación, automatización y evolución',
        '#methodology .process-horizontal-panel:nth-child(6) p': 'Documentación del trabajo final, automatización de procesos recurrentes y consideración del feedback para mejoras futuras.',

        '#projects .section-kicker': 'Repositorio Patrones Lab',
        '#projects .projects-title-display': 'Proyectos',
        '#projects .projects-intro': 'Selección de proyectos aplicados con datos públicos, metodología y resultados visuales. Usá los filtros para navegar por disciplina, herramienta o tipo de entrega.',
        '#projects .repo-filter-btn[data-repo-filter="all"]': '<span class="filter-icon">◎</span> Todos',
        '#projects .repo-filter-group:nth-of-type(1) .repo-filter-group-trigger': 'Disciplina',
        '#projects .repo-filter-group:nth-of-type(2) .repo-filter-group-trigger': 'Herramientas',
        '#projects .repo-filter-group:nth-of-type(3) .repo-filter-group-trigger': 'Modelo',
        '#projects .repo-filter-group:nth-of-type(4) .repo-filter-group-trigger': 'Tema',

        '#projects .repo-filter-btn[data-repo-filter="bi"]': '<span class="filter-icon">▦</span> BI',
        '#projects .repo-filter-btn[data-repo-filter="data-analysis"]': '<span class="filter-icon">▥</span> Data Analysis',
        '#projects .repo-filter-btn[data-repo-filter="data-science"]': '<span class="filter-icon">⚗</span> Data Science',
        '#projects .repo-filter-btn[data-repo-filter="machine-learning"]': '<span class="filter-icon">✦</span> Machine Learning',
        '#projects .repo-filter-btn[data-repo-filter="data-storytelling"]': '<span class="filter-icon">✎</span> Data Storytelling',
        '#projects .repo-filter-btn[data-repo-filter="python"]': '<span class="filter-icon">◇</span> Python',
        '#projects .repo-filter-btn[data-repo-filter="spss"]': '<span class="filter-icon">◧</span> SPSS',
        '#projects .repo-filter-btn[data-repo-filter="looker-studio"]': '<span class="filter-icon">◉</span> Looker Studio',
        '#projects .repo-filter-btn[data-repo-filter="dashboard"]': '<span class="filter-icon">▣</span> Dashboard',
        '#projects .repo-filter-btn[data-repo-filter="modelo-supervisado"]': '<span class="filter-icon">✓</span> Modelo supervisado',
        '#projects .repo-filter-btn[data-repo-filter="modelo-no-supervisado"]': '<span class="filter-icon">◎</span> Modelo no supervisado',
        '#projects .repo-filter-btn[data-repo-filter="clasificacion"]': '<span class="filter-icon">≡</span> Clasificación',
        '#projects .repo-filter-btn[data-repo-filter="clustering"]': '<span class="filter-icon">✣</span> Clustering',
        '#projects .repo-filter-btn[data-repo-filter="knn"]': '<span class="filter-icon">↗</span> KNN',
        '#projects .repo-filter-btn[data-repo-filter="k-means"]': '<span class="filter-icon">⌖</span> K-means',
        '#projects .repo-filter-btn[data-repo-filter="regresion-logistica"]': '<span class="filter-icon">⌁</span> Regresión logística',
        '#projects .repo-filter-btn[data-repo-filter="dbscan"]': '<span class="filter-icon">⊙</span> DBSCAN',
        '#projects .repo-filter-btn[data-repo-filter="geoespacial"]': '<span class="filter-icon">⌖</span> Geoespacial',
        '#projects .repo-filter-btn[data-repo-filter="airbnb"]': '<span class="filter-icon">⌂</span> Airbnb',
        '#projects .repo-filter-btn[data-repo-filter="taxi"]': '<span class="filter-icon">◆</span> Taxi',
        '#projects .repo-filter-btn[data-repo-filter="futbol"]': '<span class="filter-icon">●</span> Fútbol',
        '#projects .repo-filter-btn[data-repo-filter="aviacion"]': '<span class="filter-icon">✈</span> Aviación',
        '#projects .repo-filter-btn[data-repo-filter="fraude"]': '<span class="filter-icon">!</span> Fraude',

        '#projects .github-project-card:nth-of-type(1) h3': 'Análisis de Vuelos en las Islas Baleares',
        '#projects .github-project-card:nth-of-type(1) p:not(.project-status)': 'Análisis de tráfico aéreo en España con datos públicos de AENA, con foco en volúmenes, patrones por aeropuerto y diferencias entre categorías.',
        '#projects .github-project-card:nth-of-type(2) h3': 'Análisis del Alojamiento Airbnb en Londres',
        '#projects .github-project-card:nth-of-type(2) p:not(.project-status)': 'Análisis exploratorio del alojamiento Airbnb en Londres con foco en precio, categorías, reseñas y patrones territoriales.',
        '#projects .github-project-card:nth-of-type(3) h3': 'Análisis de Viajes en Taxi en Chicago',
        '#projects .github-project-card:nth-of-type(3) p:not(.project-status)': 'Análisis de viajes de taxi en Chicago para estudiar duración, demanda, distribución geoespacial y patrones operativos.',
        '#projects .github-project-card:nth-of-type(4) h3': 'Modelo ML · Airbnb London',
        '#projects .github-project-card:nth-of-type(4) p:not(.project-status)': 'Clasificación supervisada de anuncios relativamente caros o baratos dentro de cada tipo de alojamiento.',
        '#projects .github-project-card:nth-of-type(5) h3': 'Dashboard Looker · Taxi Trips Chicago',
        '#projects .github-project-card:nth-of-type(5) p:not(.project-status)': 'Dashboard interactivo en Looker Studio para explorar viajes de taxi en Chicago, indicadores operativos, patrones horarios y recorridos pickup-dropoff.',
        '#projects .github-project-card:nth-of-type(6) h3': 'Modelo ML · Goles Esperados (xG)',
        '#projects .github-project-card:nth-of-type(6) p:not(.project-status)': 'Próximamente.',
        '#projects .github-project-card:nth-of-type(7) h3': 'Probabilidades en el Fútbol · Peligro Esperado (xT)',
        '#projects .github-project-card:nth-of-type(7) p:not(.project-status)': 'Modelo probabilístico de Peligro Esperado en el fútbol con datos públicos de StatsBomb. Se estima la probabilidad de gol en las próximas 5 jugadas.',
        '#projects .github-project-card:nth-of-type(8) h3': 'Modelo ML · Detección de Fraude',
        '#projects .github-project-card:nth-of-type(8) p:not(.project-status)': 'Clustering no supervisado con K-means para la detección de fraudes con tarjetas de crédito.',
        '#projects .github-project-card:nth-of-type(9) h3': 'Modelo ML · Detección de Fraude',
        '#projects .github-project-card:nth-of-type(9) p:not(.project-status)': 'Clasificación supervisada mediante regresión logística para la detección de fraude con tarjeta de crédito.',
        '#projects .github-project-card:nth-of-type(10) h3': 'Modelo ML · Detección de Fraude',
        '#projects .github-project-card:nth-of-type(10) p:not(.project-status)': 'Clustering no supervisado con DBSCAN para identificar posibles fraudes con tarjeta de crédito.',
        '#projects .github-project-card:nth-of-type(11) h3': 'Estadísticas del Mundial de Fútbol Qatar 2022',
        '#projects .github-project-card:nth-of-type(11) p:not(.project-status)': 'Próximamente.',
        '#projects .github-project-card:nth-of-type(12) h3': 'Análisis Geoespacial de los Viajes en Taxi',
        '#projects .github-project-card:nth-of-type(12) p:not(.project-status)': 'Próximamente.',

        '#projects .repo-empty-message': 'No hay proyectos para esa categoría todavía.',

        '#networks .section-kicker': 'Canales de Patrones Lab',
        '#networks .projects-title-display': 'Redes y canales',
        '#networks .social-intro': 'Todo el ecosistema del proyecto en un solo lugar: visuales, notas técnicas, publicaciones, dashboards, enlaces útiles y contacto profesional.',
        '#networks .social-card.instagram small': 'Visuales y posts',
        '#networks .social-card.linkedin small': 'Perfil profesional',
        '#networks .social-card.medium small': 'Artículos y notas',
        '#networks .social-card.linktree small': 'Todos los enlaces',
        '#networks .social-card.github small': 'Perfil técnico',
        '#networks .social-card.mail small': 'Contacto directo',

        '#contact .contact-panel h3': 'Contacto',
        '#contact .contact-panel p:not(.contact-email-line)': 'Para oportunidades profesionales, colaboración analítica o proyectos de BI · ML · Dashboards.',
        '#contact .contact-email-line strong': 'correo:',
        '#contact .contact-form h2': 'Dejame un mensaje',
        '#contact .form-note': 'Escribime y te responderé a la brevedad.',
        'footer': 'Patrones Lab® · Generando conocimiento a partir de los datos · por Malcolm Di Pietro Cagliari'
      },
      all: [
        ['.project-status.published', '✅ publicado'],
        ['.project-status.development', '⚠️ en desarrollo'],
        ['#projects .project-link', {
          'Open project': 'Entrar al proyecto',
          'Read on LinkedIn': 'Leer en LinkedIn',
          'View dashboard': 'Ver dashboard',
          'View documentation': 'Ver documentación',
          'View docs': 'Ver documentación',
          'View in SPSS': 'Ver en SPSS',
          'View in Python': 'Ver en Python'
        }]
      ],
      attrs: {
        '#name': {placeholder: 'Nombre'},
        '#message': {placeholder: 'Mensaje'},
        '#contactForm .submit-btn': {value: 'Preparar email'},
        '.floating-cta': {'aria-label': 'Ver repositorio de Patrones Lab'},
        '.navbar-toggler': {'aria-label': 'Abrir navegación'},
        '#about .hero-rotator': {'aria-label': 'evidencia, modelos, dashboards, decisiones y patrones'},
        '#about .hero-tech-marquee': {'aria-label': 'Tecnologías utilizadas'},
        '#projects .repo-filter-toolbar': {'aria-label': 'Filtrar proyectos'}
      }
    },

    en: {
      title: 'Patrones Lab — Data, BI & Machine Learning Portfolio',
      metaDescription: 'Patrones Lab: a portfolio of reproducible data projects across BI, machine learning, Python, SQL, Power BI, Qlik and Looker Studio.',
      htmlLang: 'en',
      toggleFlag: FLAG_ES,
      toggleLabel: 'Switch to Spanish',
      toggleTitle: 'Español',
      text: {
        '.floating-cta__text': 'View repository',

        '.navbar-nav .nav-link[href="#about"]': 'Home',
        '.navbar-nav .nav-link[href="#methodology"]': 'Methodology',
        '.navbar-nav .nav-link[href="#projects"]': 'Projects',
        '.navbar-nav .nav-link[href="#networks"]': 'Channels',
        '.navbar-nav .nav-link[href="#contact"]': 'Contact',
        '.color-mode': '<i class="color-mode-icon"></i>',

        '#about .hero-entry-kicker': 'Project portfolio BI · ML · Python · Dashboards',
        '#about .hero-line': 'I turn<br>data into',
        '#about .hero-rotator span:nth-child(1)': 'evidence',
        '#about .hero-rotator span:nth-child(2)': 'models',
        '#about .hero-rotator span:nth-child(3)': 'dashboards',
        '#about .hero-rotator span:nth-child(4)': 'decisions',
        '#about .hero-rotator span:nth-child(5)': 'patterns',
        '#about .hero-entry-copy': 'Patrones Lab is a data analytics lab focused on real-world, everyday phenomena.<br><br>It brings together independent projects built with public data, with an emphasis on finding patterns, explaining behavior and communicating insights with context.<br><br>The goal is to ask better questions, prepare reliable data, build reproducible analyses and turn results into clear visual outputs.',

        '.tech-logo-card-airflow small': 'Orchestration',
        '.tech-logo-card-sql-server small': 'Database',
        '.tech-logo-card-numpy small': 'Numerical Computing',
        '.tech-logo-card-matplotlib small': 'Data Visualization',
        '.tech-logo-card-dbt small': 'Transformation',

        '#methodology .process-horizontal-static-head h2': 'Data Lifecycle',
        '#methodology .process-horizontal-panel:nth-child(1) h3': 'Esplorazione',
        '#methodology .process-horizontal-panel:nth-child(1) small': 'Context & Objective',
        '#methodology .process-horizontal-panel:nth-child(1) p': 'Clarifying the problem, the decision to improve, the users involved and the expected outcome.',
        '#methodology .process-horizontal-panel:nth-child(2) h3': 'Sources',
        '#methodology .process-horizontal-panel:nth-child(2) small': 'Sources & Diagnostics',
        '#methodology .process-horizontal-panel:nth-child(2) p': 'Mapping available data sources, including their origin, refresh cadence, reliability and main limitations.',
        '#methodology .process-horizontal-panel:nth-child(3) h3': 'Preparation',
        '#methodology .process-horizontal-panel:nth-child(3) small': 'Analytical Dataset',
        '#methodology .process-horizontal-panel:nth-child(3) p': 'Structuring, cleaning and combining data into a consistent analytical dataset ready for analysis.',
        '#methodology .process-horizontal-panel:nth-child(4) h3': 'Development',
        '#methodology .process-horizontal-panel:nth-child(4) small': 'Solution',
        '#methodology .process-horizontal-panel:nth-child(4) p': 'Building the analysis, model or dashboard required to address the defined objective.',
        '#methodology .process-horizontal-panel:nth-child(5) h3': 'Validation',
        '#methodology .process-horizontal-panel:nth-child(5) small': 'Quality & Confidence',
        '#methodology .process-horizontal-panel:nth-child(5) p': 'Reviewing the coherence, stability and business relevance of the results before delivery.',
        '#methodology .process-horizontal-panel:nth-child(6) h3': 'Pubblicazione',
        '#methodology .process-horizontal-panel:nth-child(6) small': 'Publishing, Automation & Iteration',
        '#methodology .process-horizontal-panel:nth-child(6) p': 'Documenting the final output, automating recurring workflows and using feedback to guide future improvements.',

        '#projects .section-kicker': 'Patrones Lab Repository',
        '#projects .projects-title-display': 'Projects',
        '#projects .projects-intro': 'A selection of applied projects built with public data, documented methodology and visual outputs. Use the filters to explore by discipline, tool or deliverable type.',
        '#projects .repo-filter-btn[data-repo-filter="all"]': '<span class="filter-icon">◎</span> All',
        '#projects .repo-filter-group:nth-of-type(1) .repo-filter-group-trigger': 'Discipline',
        '#projects .repo-filter-group:nth-of-type(2) .repo-filter-group-trigger': 'Tools',
        '#projects .repo-filter-group:nth-of-type(3) .repo-filter-group-trigger': 'Model',
        '#projects .repo-filter-group:nth-of-type(4) .repo-filter-group-trigger': 'Domain',

        '#projects .repo-filter-btn[data-repo-filter="bi"]': '<span class="filter-icon">▦</span> BI',
        '#projects .repo-filter-btn[data-repo-filter="data-analysis"]': '<span class="filter-icon">▥</span> Data Analysis',
        '#projects .repo-filter-btn[data-repo-filter="data-science"]': '<span class="filter-icon">⚗</span> Data Science',
        '#projects .repo-filter-btn[data-repo-filter="machine-learning"]': '<span class="filter-icon">✦</span> Machine Learning',
        '#projects .repo-filter-btn[data-repo-filter="data-storytelling"]': '<span class="filter-icon">✎</span> Data Storytelling',
        '#projects .repo-filter-btn[data-repo-filter="python"]': '<span class="filter-icon">◇</span> Python',
        '#projects .repo-filter-btn[data-repo-filter="spss"]': '<span class="filter-icon">◧</span> SPSS',
        '#projects .repo-filter-btn[data-repo-filter="looker-studio"]': '<span class="filter-icon">◉</span> Looker Studio',
        '#projects .repo-filter-btn[data-repo-filter="dashboard"]': '<span class="filter-icon">▣</span> Dashboard',
        '#projects .repo-filter-btn[data-repo-filter="modelo-supervisado"]': '<span class="filter-icon">✓</span> Supervised model',
        '#projects .repo-filter-btn[data-repo-filter="modelo-no-supervisado"]': '<span class="filter-icon">◎</span> Unsupervised model',
        '#projects .repo-filter-btn[data-repo-filter="clasificacion"]': '<span class="filter-icon">≡</span> Classification',
        '#projects .repo-filter-btn[data-repo-filter="clustering"]': '<span class="filter-icon">✣</span> Clustering',
        '#projects .repo-filter-btn[data-repo-filter="knn"]': '<span class="filter-icon">↗</span> KNN',
        '#projects .repo-filter-btn[data-repo-filter="k-means"]': '<span class="filter-icon">⌖</span> K-means',
        '#projects .repo-filter-btn[data-repo-filter="regresion-logistica"]': '<span class="filter-icon">⌁</span> Logistic regression',
        '#projects .repo-filter-btn[data-repo-filter="dbscan"]': '<span class="filter-icon">⊙</span> DBSCAN',
        '#projects .repo-filter-btn[data-repo-filter="geoespacial"]': '<span class="filter-icon">⌖</span> Geospatial',
        '#projects .repo-filter-btn[data-repo-filter="airbnb"]': '<span class="filter-icon">⌂</span> Airbnb',
        '#projects .repo-filter-btn[data-repo-filter="taxi"]': '<span class="filter-icon">◆</span> Taxi',
        '#projects .repo-filter-btn[data-repo-filter="futbol"]': '<span class="filter-icon">●</span> Soccer',
        '#projects .repo-filter-btn[data-repo-filter="aviacion"]': '<span class="filter-icon">✈</span> Aviation',
        '#projects .repo-filter-btn[data-repo-filter="fraude"]': '<span class="filter-icon">!</span> Fraud',

        '#projects .github-project-card:nth-of-type(1) h3': 'Balearic Islands Flight Analysis',
        '#projects .github-project-card:nth-of-type(1) p:not(.project-status)': 'Analysis of air traffic in Spain using public AENA data, focused on volume, airport-level patterns and differences across traffic categories.',
        '#projects .github-project-card:nth-of-type(2) h3': 'Airbnb Lodging Analysis in London',
        '#projects .github-project-card:nth-of-type(2) p:not(.project-status)': 'Exploratory analysis of Airbnb listings in London, focused on pricing, property categories, reviews and spatial patterns.',
        '#projects .github-project-card:nth-of-type(3) h3': 'Chicago Taxi Trip Analysis',
        '#projects .github-project-card:nth-of-type(3) p:not(.project-status)': 'Analysis of reported Chicago taxi trips to study duration, demand, geospatial distribution and operational patterns.',
        '#projects .github-project-card:nth-of-type(4) h3': 'ML Model · Airbnb London',
        '#projects .github-project-card:nth-of-type(4) p:not(.project-status)': 'Supervised classification of listings as relatively expensive or inexpensive within each accommodation type.',
        '#projects .github-project-card:nth-of-type(5) h3': 'Looker Dashboard · Chicago Taxi Trips',
        '#projects .github-project-card:nth-of-type(5) p:not(.project-status)': 'Interactive Looker Studio dashboard for exploring Chicago taxi trips, operational indicators, hourly patterns and pickup-dropoff routes.',
        '#projects .github-project-card:nth-of-type(6) h3': 'ML Model · Expected Goals (xG)',
        '#projects .github-project-card:nth-of-type(6) p:not(.project-status)': 'Coming soon.',
        '#projects .github-project-card:nth-of-type(7) h3': 'Soccer Probabilities · Expected Threat (xT)',
        '#projects .github-project-card:nth-of-type(7) p:not(.project-status)': 'Probabilistic Expected Threat model in soccer using public StatsBomb data. It estimates the probability of a goal in the next 5 actions.',
        '#projects .github-project-card:nth-of-type(8) h3': 'ML Model · Fraud Detection',
        '#projects .github-project-card:nth-of-type(8) p:not(.project-status)': 'Unsupervised K-means clustering applied to credit card fraud detection.',
        '#projects .github-project-card:nth-of-type(9) h3': 'ML Model · Fraud Detection',
        '#projects .github-project-card:nth-of-type(9) p:not(.project-status)': 'Supervised logistic regression model for credit card fraud detection.',
        '#projects .github-project-card:nth-of-type(10) h3': 'ML Model · Fraud Detection',
        '#projects .github-project-card:nth-of-type(10) p:not(.project-status)': 'Unsupervised DBSCAN clustering to detect potential credit card fraud patterns.',
        '#projects .github-project-card:nth-of-type(11) h3': 'Qatar 2022 World Cup Statistics',
        '#projects .github-project-card:nth-of-type(11) p:not(.project-status)': 'Coming soon.',
        '#projects .github-project-card:nth-of-type(12) h3': 'Geospatial Taxi Trip Analysis',
        '#projects .github-project-card:nth-of-type(12) p:not(.project-status)': 'Coming soon.',

        '#projects .repo-empty-message': 'There are no projects in this category yet.',

        '#networks .section-kicker': 'Patrones Lab Online Presence',
        '#networks .projects-title-display': 'Channels',
        '#networks .social-intro': 'The full project ecosystem in one place: visuals, technical notes, articles, dashboards, useful links and professional contact channels.',
        '#networks .social-card.instagram small': 'Visuals and posts',
        '#networks .social-card.linkedin small': 'Professional profile',
        '#networks .social-card.medium small': 'Articles and notes',
        '#networks .social-card.linktree small': 'All links',
        '#networks .social-card.github small': 'Technical profile',
        '#networks .social-card.mail small': 'Direct contact',

        '#contact .contact-panel h3': 'Contact',
        '#contact .contact-panel p:not(.contact-email-line)': 'For professional opportunities, analytics collaboration or BI, machine learning and dashboard projects.',
        '#contact .contact-email-line strong': 'email:',
        '#contact .contact-form h2': 'Leave me a message',
        '#contact .form-note': 'Send me a message and I’ll get back to you shortly.',
        'footer': 'Patrones Lab® · Generating knowledge from data · by Malcolm Di Pietro Cagliari'
      },
      all: [
        ['.project-status.published', '✅ published'],
        ['.project-status.development', '⚠️ in progress'],
        ['#projects .project-link', {
          'Entrar al proyecto': 'Open project',
          'Leer en LinkedIn': 'Read on LinkedIn',
          'Ver dashboard': 'View dashboard',
          'Ver documentación': 'View documentation',
          'Ver en SPSS': 'View in SPSS',
          'Ver en Python': 'View in Python'
        }]
      ],
      attrs: {
        '#name': {placeholder: 'Name'},
        '#message': {placeholder: 'Message'},
        '#contactForm .submit-btn': {value: 'Prepare email'},
        '.floating-cta': {'aria-label': 'View Patrones Lab repository'},
        '.navbar-toggler': {'aria-label': 'Open navigation'},
        '#about .hero-rotator': {'aria-label': 'evidence, models, dashboards, decisions and patterns'},
        '#about .hero-tech-marquee': {'aria-label': 'Technologies used'},
        '#projects .repo-filter-toolbar': {'aria-label': 'Filter projects'}
      }
    }
  };

  function setHtml(selector, html){
    document.querySelectorAll(selector).forEach(function(el){
      el.innerHTML = html;
    });
  }

  function setAttr(selector, attrs){
    document.querySelectorAll(selector).forEach(function(el){
      Object.keys(attrs).forEach(function(name){
        el.setAttribute(name, attrs[name]);
      });
    });
  }

  function applyExplicitLanguage(lang){
    const language = lang === 'en' ? 'en' : 'es';
    const data = dict[language];

    document.documentElement.lang = data.htmlLang;
    document.title = data.title;

    const meta = document.querySelector('meta[name="description"]');
    if(meta) meta.setAttribute('content', data.metaDescription);

    Object.keys(data.text).forEach(function(selector){
      setHtml(selector, data.text[selector]);
    });

    (data.all || []).forEach(function(entry){
      const selector = entry[0];
      const value = entry[1];

      document.querySelectorAll(selector).forEach(function(el){
        if(typeof value === 'string'){
          el.innerHTML = value;
          return;
        }

        const current = el.textContent.trim();
        Object.keys(value).forEach(function(source){
          if(current.indexOf(source) !== -1){
            el.innerHTML = el.innerHTML.replace(source, value[source]);
          }
        });
      });
    });

    Object.keys(data.attrs).forEach(function(selector){
      setAttr(selector, data.attrs[selector]);
    });

    document.querySelectorAll('.language-toggle').forEach(function(btn){
      const flag = btn.querySelector('.language-toggle__flag-img');
      if(flag) flag.setAttribute('src', data.toggleFlag);
      btn.setAttribute('aria-label', data.toggleLabel);
      btn.setAttribute('title', data.toggleTitle);
    });

    localStorage.setItem(STORAGE_KEY, language);

    document.dispatchEvent(new CustomEvent('pl-language-changed', {detail:{language:language}}));

    if(window.plApplyRepoFilter && window.plGetActiveRepoFilter){
      window.plApplyRepoFilter(window.plGetActiveRepoFilter());
    }
  }

  document.addEventListener('click', function(event){
    const btn = event.target.closest && event.target.closest('.language-toggle');
    if(!btn) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    const current = localStorage.getItem(STORAGE_KEY) || 'es';
    applyExplicitLanguage(current === 'en' ? 'es' : 'en');
  }, true);

  window.plSetLanguage = applyExplicitLanguage;
  window.plGetLanguage = function(){
    return localStorage.getItem(STORAGE_KEY) || 'es';
  };
  window.plCurrentLanguageForContact = window.plGetLanguage;

  applyExplicitLanguage(localStorage.getItem(STORAGE_KEY) || 'es');
})();


(function(){
  const STORAGE_KEY = 'patronesLabLanguage';
  const FLAGS = {
    es: 'images/patrones/language-flags/flag-es.svg',
    en: 'images/patrones/language-flags/flag-us.svg',
    it: 'images/patrones/language-flags/flag-it.svg'
  };

  const langData = {
    es: {
      title: 'Patrones Lab · Analítica de Datos · Portfolio de proyectos ML y BI',
      metaDescription: 'Patrones Lab reúne proyectos de analítica de datos, Business Intelligence y Machine Learning para explorar datos, detectar patrones, generar conocimiento y representar visualmente los descubrimientos.',
      htmlLang: 'es',
      currentLabel: 'Español',
      text: {
        '.floating-cta__text': 'Ver repo',
        '.navbar-nav .nav-link[href="#about"]': 'Inicio',
        '.navbar-nav .nav-link[href="#methodology"]': 'Metodología',
        '.navbar-nav .nav-link[href="#projects"]': 'Proyectos',
        '.navbar-nav .nav-link[href="#networks"]': 'Redes',
        '.navbar-nav .nav-link[href="#contact"]': 'Contacto',
        '.color-mode': '<i class="color-mode-icon"></i>',

        '#about .hero-entry-kicker': 'Portfolio de proyectos <span class="mobile-block">BI · ML · Python · Dashboards</span>',
        '#about .hero-line': 'Transformo datos en',
        '#about .hero-rotator span:nth-child(1)': 'evidencia',
        '#about .hero-rotator span:nth-child(2)': 'modelos',
        '#about .hero-rotator span:nth-child(3)': 'dashboards',
        '#about .hero-rotator span:nth-child(4)': 'decisiones',
        '#about .hero-rotator span:nth-child(5)': 'patrones',
        '#about .hero-entry-copy': 'Patrones Lab es un laboratorio de análisis de datos aplicado a fenómenos cotidianos y reales.<br><br>Aquí se trabajan proyectos independientes construidos a partir de datos públicos, con foco en detectar patrones, describir comportamientos y comunicar los hallazgos con su contexto.<br><br>El objetivo es plantear preguntas, preparar datos, construir análisis claros y generar resultados visuales.',

        '.tech-logo-card-airflow small': 'Orquestación',
        '.tech-logo-card-sql-server small': 'Base de datos',
        '.tech-logo-card-numpy small': 'Cálculo numérico',
        '.tech-logo-card-matplotlib small': 'Visualización',
        '.tech-logo-card-dbt small': 'Transformación',

        '#methodology .process-horizontal-static-head h2': 'Ciclo de vida del dato',
        '#methodology .process-horizontal-panel:nth-child(1) h3': 'Descubrimiento',
        '#methodology .process-horizontal-panel:nth-child(1) small': 'Contexto y objetivo',
        '#methodology .process-horizontal-panel:nth-child(1) p': 'Entendimiento del problema, la decisión a mejorar, los usuarios involucrados y el resultado esperado.',
        '#methodology .process-horizontal-panel:nth-child(2) h3': 'Fuentes',
        '#methodology .process-horizontal-panel:nth-child(2) small': 'Datos y diagnóstico',
        '#methodology .process-horizontal-panel:nth-child(2) p': 'Identificación de las fuentes disponibles, su origen, actualización, confiabilidad y principales limitaciones.',
        '#methodology .process-horizontal-panel:nth-child(3) h3': 'Preparación',
        '#methodology .process-horizontal-panel:nth-child(3) small': 'Base analítica',
        '#methodology .process-horizontal-panel:nth-child(3) p': 'Organización, limpieza y combinación de datos para construir una base consistente y usable.',
        '#methodology .process-horizontal-panel:nth-child(4) h3': 'Construcción',
        '#methodology .process-horizontal-panel:nth-child(4) small': 'Solución',
        '#methodology .process-horizontal-panel:nth-child(4) p': 'Desarrollo del análisis, modelo o dashboard necesario según el objetivo definido.',
        '#methodology .process-horizontal-panel:nth-child(5) h3': 'Validación',
        '#methodology .process-horizontal-panel:nth-child(5) small': 'Control y confianza',
        '#methodology .process-horizontal-panel:nth-child(5) p': 'Revisión de la coherencia, estabilidad y alineación de los resultados con la realidad del negocio.',
        '#methodology .process-horizontal-panel:nth-child(6) h3': 'Entrega',
        '#methodology .process-horizontal-panel:nth-child(6) small': 'Publicación, automatización y evolución',
        '#methodology .process-horizontal-panel:nth-child(6) p': 'Documentación del trabajo final, automatización de procesos recurrentes y consideración del feedback para mejoras futuras.',

        '#projects .section-kicker': 'Repositorio Patrones Lab',
        '#projects .projects-title-display': 'Proyectos',
        '#projects .projects-intro': 'Selección de proyectos aplicados con datos públicos, metodología y resultados visuales. Usá los filtros para navegar por disciplina, herramienta o tipo de entrega.',
        '#projects .repo-filter-btn[data-repo-filter="all"]': '<span class="filter-icon">◎</span> Todos',
        '#projects .repo-filter-group:nth-of-type(1) .repo-filter-group-trigger': 'Disciplina',
        '#projects .repo-filter-group:nth-of-type(2) .repo-filter-group-trigger': 'Herramientas',
        '#projects .repo-filter-group:nth-of-type(3) .repo-filter-group-trigger': 'Modelo',
        '#projects .repo-filter-group:nth-of-type(4) .repo-filter-group-trigger': 'Tema',

        '#projects .repo-filter-btn[data-repo-filter="bi"]': '<span class="filter-icon">▦</span> BI',
        '#projects .repo-filter-btn[data-repo-filter="data-analysis"]': '<span class="filter-icon">▥</span> Data Analysis',
        '#projects .repo-filter-btn[data-repo-filter="data-science"]': '<span class="filter-icon">⚗</span> Data Science',
        '#projects .repo-filter-btn[data-repo-filter="machine-learning"]': '<span class="filter-icon">✦</span> Machine Learning',
        '#projects .repo-filter-btn[data-repo-filter="data-storytelling"]': '<span class="filter-icon">✎</span> Data Storytelling',
        '#projects .repo-filter-btn[data-repo-filter="python"]': '<span class="filter-icon">◇</span> Python',
        '#projects .repo-filter-btn[data-repo-filter="spss"]': '<span class="filter-icon">◧</span> SPSS',
        '#projects .repo-filter-btn[data-repo-filter="looker-studio"]': '<span class="filter-icon">◉</span> Looker Studio',
        '#projects .repo-filter-btn[data-repo-filter="dashboard"]': '<span class="filter-icon">▣</span> Dashboard',
        '#projects .repo-filter-btn[data-repo-filter="power-bi"]': '<span class="filter-icon">▥</span> Power BI',
        '#projects .repo-filter-btn[data-repo-filter="modelo-supervisado"]': '<span class="filter-icon">✓</span> Modelo supervisado',
        '#projects .repo-filter-btn[data-repo-filter="modelo-no-supervisado"]': '<span class="filter-icon">◎</span> Modelo no supervisado',
        '#projects .repo-filter-btn[data-repo-filter="clasificacion"]': '<span class="filter-icon">≡</span> Clasificación',
        '#projects .repo-filter-btn[data-repo-filter="clustering"]': '<span class="filter-icon">✣</span> Clustering',
        '#projects .repo-filter-btn[data-repo-filter="knn"]': '<span class="filter-icon">↗</span> KNN',
        '#projects .repo-filter-btn[data-repo-filter="k-means"]': '<span class="filter-icon">⌖</span> K-means',
        '#projects .repo-filter-btn[data-repo-filter="regresion-logistica"]': '<span class="filter-icon">⌁</span> Regresión logística',
        '#projects .repo-filter-btn[data-repo-filter="dbscan"]': '<span class="filter-icon">⊙</span> DBSCAN',
        '#projects .repo-filter-btn[data-repo-filter="geoespacial"]': '<span class="filter-icon">⌖</span> Geoespacial',
        '#projects .repo-filter-btn[data-repo-filter="airbnb"]': '<span class="filter-icon">⌂</span> Airbnb',
        '#projects .repo-filter-btn[data-repo-filter="taxi"]': '<span class="filter-icon">◆</span> Taxi',
        '#projects .repo-filter-btn[data-repo-filter="futbol"]': '<span class="filter-icon">●</span> Fútbol',
        '#projects .repo-filter-btn[data-repo-filter="aviacion"]': '<span class="filter-icon">✈</span> Aviación',
        '#projects .repo-filter-btn[data-repo-filter="fraude"]': '<span class="filter-icon">!</span> Fraude',
        '#projects .repo-filter-btn[data-repo-filter="spotify"]': '<span class="filter-icon">♪</span> Spotify',

        '#projects .github-project-card:nth-of-type(1) h3': 'Análisis de Vuelos en las Islas Baleares',
        '#projects .github-project-card:nth-of-type(1) p:not(.project-status)': 'Análisis de tráfico aéreo en España con datos públicos de AENA, con foco en volúmenes, patrones por aeropuerto y diferencias entre categorías.',
        '#projects .github-project-card:nth-of-type(2) h3': 'Análisis del Alojamiento Airbnb en Londres',
        '#projects .github-project-card:nth-of-type(2) p:not(.project-status)': 'Análisis exploratorio del alojamiento Airbnb en Londres con foco en precio, categorías, reseñas y patrones territoriales.',
        '#projects .github-project-card:nth-of-type(3) h3': 'Análisis de Viajes en Taxi en Chicago',
        '#projects .github-project-card:nth-of-type(3) p:not(.project-status)': 'Análisis de viajes de taxi en Chicago para estudiar duración, demanda, distribución geoespacial y patrones operativos.',
        '#projects .github-project-card:nth-of-type(4) h3': 'Modelo ML · Airbnb London',
        '#projects .github-project-card:nth-of-type(4) p:not(.project-status)': 'Clasificación supervisada de anuncios relativamente caros o baratos dentro de cada tipo de alojamiento.',
        '#projects .github-project-card:nth-of-type(5) h3': 'Dashboard Looker · Taxi Trips Chicago',
        '#projects .github-project-card:nth-of-type(5) p:not(.project-status)': 'Dashboard interactivo en Looker Studio para explorar viajes de taxi en Chicago, indicadores operativos, patrones horarios y recorridos pickup-dropoff.',
        '#projects .github-project-card:nth-of-type(6) h3': 'Modelo ML · Goles Esperados (xG)',
        '#projects .github-project-card:nth-of-type(6) p:not(.project-status)': 'Próximamente.',
        '#projects .github-project-card:nth-of-type(7) h3': 'Probabilidades en el Fútbol · Peligro Esperado (xT)',
        '#projects .github-project-card:nth-of-type(7) p:not(.project-status)': 'Modelo probabilístico de Peligro Esperado en el fútbol con datos públicos de StatsBomb. Se estima la probabilidad de gol en las próximas 5 jugadas.',
        '#projects .github-project-card:nth-of-type(8) h3': 'Modelo ML · Detección de Fraude',
        '#projects .github-project-card:nth-of-type(8) p:not(.project-status)': 'Clustering no supervisado con K-means para la detección de fraudes con tarjetas de crédito.',
        '#projects .github-project-card:nth-of-type(9) h3': 'Modelo ML · Detección de Fraude',
        '#projects .github-project-card:nth-of-type(9) p:not(.project-status)': 'Clasificación supervisada mediante regresión logística para la detección de fraude con tarjeta de crédito.',
        '#projects .github-project-card:nth-of-type(10) h3': 'Modelo ML · Detección de Fraude',
        '#projects .github-project-card:nth-of-type(10) p:not(.project-status)': 'Clustering no supervisado con DBSCAN para identificar posibles fraudes con tarjeta de crédito.',
        '#projects .github-project-card:nth-of-type(11) h3': 'Estadísticas del Mundial de Fútbol Qatar 2022',
        '#projects .github-project-card:nth-of-type(11) p:not(.project-status)': 'Próximamente.',
        '#projects .github-project-card:nth-of-type(12) h3': 'Análisis Geoespacial de los Viajes en Taxi',
        '#projects .github-project-card:nth-of-type(12) p:not(.project-status)': 'Próximamente.',
        '#projects .github-project-card:nth-of-type(13) h3': 'Dashboard en Power BI · Spotify Charts',
        '#projects .github-project-card:nth-of-type(13) p:not(.project-status)': 'Dashboard interactivo en Power BI para explorar reproducciones en Spotify y analizar canciones, artistas y álbumes que se encuentran en el Top 250 en cada país.',
        '#projects .repo-empty-message': 'No hay proyectos para esa categoría todavía.',

        '#networks .section-kicker': 'Canales de Patrones Lab',
        '#networks .projects-title-display': 'Redes y canales',
        '#networks .social-intro': 'Todo el ecosistema del proyecto en un solo lugar: visuales, notas técnicas, publicaciones, dashboards, enlaces útiles y contacto profesional.',
        '#networks .social-card.instagram small': 'Visuales y posts',
        '#networks .social-card.linkedin small': 'Perfil profesional',
        '#networks .social-card.medium small': 'Artículos y notas',
        '#networks .social-card.linktree small': 'Todos los enlaces',
        '#networks .social-card.github small': 'Perfil técnico',
        '#networks .social-card.mail small': 'Contacto directo',

        '#contact .contact-panel h3': 'Contacto',
        '#contact .contact-panel p:not(.contact-email-line)': 'Para oportunidades profesionales, colaboración analítica o proyectos de BI · ML · Dashboards.',
        '#contact .contact-email-line strong': 'correo:',
        '#contact .contact-form h2': 'Dejame un mensaje',
        '#contact .form-note': 'Escribime y te responderé a la brevedad.',
        'footer': 'Patrones Lab® · Generando conocimiento a partir de los datos · por Malcolm Di Pietro Cagliari'
      },
      links: {
        'Open project': 'Entrar al proyecto',
        'Apri progetto': 'Entrar al proyecto',
        'Read on LinkedIn': 'Leer en LinkedIn',
        'Leggi su LinkedIn': 'Leer en LinkedIn',
        'View dashboard': 'Ver dashboard',
        'Visualizza dashboard': 'Ver dashboard',
        'View documentation': 'Ver documentación',
        'View docs': 'Ver documentación',
        'Documentazione': 'Ver documentación',
        'View in SPSS': 'Ver en SPSS',
        'Visualizza in SPSS': 'Ver en SPSS',
        'View in Python': 'Ver en Python',
        'Visualizza in Python': 'Ver en Python'
      },
      attrs: {
        '#name': {placeholder: 'Nombre'},
        '#message': {placeholder: 'Mensaje'},
        '#contactForm .submit-btn': {value: 'Preparar email'},
        '.floating-cta': {'aria-label': 'Ver repositorio de Patrones Lab'},
        '.navbar-toggler': {'aria-label': 'Abrir navegación'},
        '#about .hero-rotator': {'aria-label': 'evidencia, modelos, dashboards, decisiones y patrones'},
        '#about .hero-tech-marquee': {'aria-label': 'Tecnologías utilizadas'},
        '#projects .repo-filter-toolbar': {'aria-label': 'Filtrar proyectos'}
      }
    },

    en: {
      title: 'Patrones Lab — Data, BI & Machine Learning Portfolio',
      metaDescription: 'Patrones Lab: a portfolio of reproducible data projects across BI, machine learning, Python, SQL, Power BI, Qlik and Looker Studio.',
      htmlLang: 'en',
      currentLabel: 'English',
      text: {
        '.floating-cta__text': 'View repository',
        '.navbar-nav .nav-link[href="#about"]': 'Home',
        '.navbar-nav .nav-link[href="#methodology"]': 'Methodology',
        '.navbar-nav .nav-link[href="#projects"]': 'Projects',
        '.navbar-nav .nav-link[href="#networks"]': 'Channels',
        '.navbar-nav .nav-link[href="#contact"]': 'Contact',
        '.color-mode': '<i class="color-mode-icon"></i>',

        '#about .hero-entry-kicker': 'Project portfolio BI · ML · Python · Dashboards',
        '#about .hero-line': 'I turn<br>data into',
        '#about .hero-rotator span:nth-child(1)': 'evidence',
        '#about .hero-rotator span:nth-child(2)': 'models',
        '#about .hero-rotator span:nth-child(3)': 'dashboards',
        '#about .hero-rotator span:nth-child(4)': 'decisions',
        '#about .hero-rotator span:nth-child(5)': 'patterns',
        '#about .hero-entry-copy': 'Patrones Lab is a data analytics lab focused on real-world, everyday phenomena.<br><br>It brings together independent projects built with public data, with an emphasis on finding patterns, explaining behavior and communicating insights with context.<br><br>The goal is to ask better questions, prepare reliable data, build reproducible analyses and turn results into clear visual outputs.',

        '.tech-logo-card-airflow small': 'Orchestration',
        '.tech-logo-card-sql-server small': 'Database',
        '.tech-logo-card-numpy small': 'Numerical Computing',
        '.tech-logo-card-matplotlib small': 'Data Visualization',
        '.tech-logo-card-dbt small': 'Transformation',

        '#methodology .process-horizontal-static-head h2': 'Data Lifecycle',
        '#methodology .process-horizontal-panel:nth-child(1) h3': 'Esplorazione',
        '#methodology .process-horizontal-panel:nth-child(1) small': 'Context & Objective',
        '#methodology .process-horizontal-panel:nth-child(1) p': 'Clarifying the problem, the decision to improve, the users involved and the expected outcome.',
        '#methodology .process-horizontal-panel:nth-child(2) h3': 'Sources',
        '#methodology .process-horizontal-panel:nth-child(2) small': 'Sources & Diagnostics',
        '#methodology .process-horizontal-panel:nth-child(2) p': 'Mapping available data sources, including their origin, refresh cadence, reliability and main limitations.',
        '#methodology .process-horizontal-panel:nth-child(3) h3': 'Preparation',
        '#methodology .process-horizontal-panel:nth-child(3) small': 'Analytical Dataset',
        '#methodology .process-horizontal-panel:nth-child(3) p': 'Structuring, cleaning and combining data into a consistent analytical dataset ready for analysis.',
        '#methodology .process-horizontal-panel:nth-child(4) h3': 'Development',
        '#methodology .process-horizontal-panel:nth-child(4) small': 'Solution',
        '#methodology .process-horizontal-panel:nth-child(4) p': 'Building the analysis, model or dashboard required to address the defined objective.',
        '#methodology .process-horizontal-panel:nth-child(5) h3': 'Validation',
        '#methodology .process-horizontal-panel:nth-child(5) small': 'Quality & Confidence',
        '#methodology .process-horizontal-panel:nth-child(5) p': 'Reviewing the coherence, stability and business relevance of the results before delivery.',
        '#methodology .process-horizontal-panel:nth-child(6) h3': 'Pubblicazione',
        '#methodology .process-horizontal-panel:nth-child(6) small': 'Publishing, Automation & Iteration',
        '#methodology .process-horizontal-panel:nth-child(6) p': 'Documenting the final output, automating recurring workflows and using feedback to guide future improvements.',

        '#projects .section-kicker': 'Patrones Lab Repository',
        '#projects .projects-title-display': 'Projects',
        '#projects .projects-intro': 'A selection of applied projects built with public data, documented methodology and visual outputs. Use the filters to explore by discipline, tool or deliverable type.',
        '#projects .repo-filter-btn[data-repo-filter="all"]': '<span class="filter-icon">◎</span> All',
        '#projects .repo-filter-group:nth-of-type(1) .repo-filter-group-trigger': 'Discipline',
        '#projects .repo-filter-group:nth-of-type(2) .repo-filter-group-trigger': 'Tools',
        '#projects .repo-filter-group:nth-of-type(3) .repo-filter-group-trigger': 'Model',
        '#projects .repo-filter-group:nth-of-type(4) .repo-filter-group-trigger': 'Domain',

        '#projects .repo-filter-btn[data-repo-filter="bi"]': '<span class="filter-icon">▦</span> BI',
        '#projects .repo-filter-btn[data-repo-filter="data-analysis"]': '<span class="filter-icon">▥</span> Data Analysis',
        '#projects .repo-filter-btn[data-repo-filter="data-science"]': '<span class="filter-icon">⚗</span> Data Science',
        '#projects .repo-filter-btn[data-repo-filter="machine-learning"]': '<span class="filter-icon">✦</span> Machine Learning',
        '#projects .repo-filter-btn[data-repo-filter="data-storytelling"]': '<span class="filter-icon">✎</span> Data Storytelling',
        '#projects .repo-filter-btn[data-repo-filter="python"]': '<span class="filter-icon">◇</span> Python',
        '#projects .repo-filter-btn[data-repo-filter="spss"]': '<span class="filter-icon">◧</span> SPSS',
        '#projects .repo-filter-btn[data-repo-filter="looker-studio"]': '<span class="filter-icon">◉</span> Looker Studio',
        '#projects .repo-filter-btn[data-repo-filter="dashboard"]': '<span class="filter-icon">▣</span> Dashboard',
        '#projects .repo-filter-btn[data-repo-filter="power-bi"]': '<span class="filter-icon">▥</span> Power BI',
        '#projects .repo-filter-btn[data-repo-filter="modelo-supervisado"]': '<span class="filter-icon">✓</span> Supervised model',
        '#projects .repo-filter-btn[data-repo-filter="modelo-no-supervisado"]': '<span class="filter-icon">◎</span> Unsupervised model',
        '#projects .repo-filter-btn[data-repo-filter="clasificacion"]': '<span class="filter-icon">≡</span> Classification',
        '#projects .repo-filter-btn[data-repo-filter="clustering"]': '<span class="filter-icon">✣</span> Clustering',
        '#projects .repo-filter-btn[data-repo-filter="knn"]': '<span class="filter-icon">↗</span> KNN',
        '#projects .repo-filter-btn[data-repo-filter="k-means"]': '<span class="filter-icon">⌖</span> K-means',
        '#projects .repo-filter-btn[data-repo-filter="regresion-logistica"]': '<span class="filter-icon">⌁</span> Logistic regression',
        '#projects .repo-filter-btn[data-repo-filter="dbscan"]': '<span class="filter-icon">⊙</span> DBSCAN',
        '#projects .repo-filter-btn[data-repo-filter="geoespacial"]': '<span class="filter-icon">⌖</span> Geospatial',
        '#projects .repo-filter-btn[data-repo-filter="airbnb"]': '<span class="filter-icon">⌂</span> Airbnb',
        '#projects .repo-filter-btn[data-repo-filter="taxi"]': '<span class="filter-icon">◆</span> Taxi',
        '#projects .repo-filter-btn[data-repo-filter="futbol"]': '<span class="filter-icon">●</span> Soccer',
        '#projects .repo-filter-btn[data-repo-filter="aviacion"]': '<span class="filter-icon">✈</span> Aviation',
        '#projects .repo-filter-btn[data-repo-filter="fraude"]': '<span class="filter-icon">!</span> Fraud',
        '#projects .repo-filter-btn[data-repo-filter="spotify"]': '<span class="filter-icon">♪</span> Spotify',

        '#projects .github-project-card:nth-of-type(1) h3': 'Balearic Islands Flight Analysis',
        '#projects .github-project-card:nth-of-type(1) p:not(.project-status)': 'Analysis of air traffic in Spain using public AENA data, focused on volume, airport-level patterns and differences across traffic categories.',
        '#projects .github-project-card:nth-of-type(2) h3': 'Airbnb Lodging Analysis in London',
        '#projects .github-project-card:nth-of-type(2) p:not(.project-status)': 'Exploratory analysis of Airbnb listings in London, focused on pricing, property categories, reviews and spatial patterns.',
        '#projects .github-project-card:nth-of-type(3) h3': 'Chicago Taxi Trip Analysis',
        '#projects .github-project-card:nth-of-type(3) p:not(.project-status)': 'Analysis of reported Chicago taxi trips to study duration, demand, geospatial distribution and operational patterns.',
        '#projects .github-project-card:nth-of-type(4) h3': 'ML Model · Airbnb London',
        '#projects .github-project-card:nth-of-type(4) p:not(.project-status)': 'Supervised classification of listings as relatively expensive or inexpensive within each accommodation type.',
        '#projects .github-project-card:nth-of-type(5) h3': 'Looker Dashboard · Chicago Taxi Trips',
        '#projects .github-project-card:nth-of-type(5) p:not(.project-status)': 'Interactive Looker Studio dashboard for exploring Chicago taxi trips, operational indicators, hourly patterns and pickup-dropoff routes.',
        '#projects .github-project-card:nth-of-type(6) h3': 'ML Model · Expected Goals (xG)',
        '#projects .github-project-card:nth-of-type(6) p:not(.project-status)': 'Coming soon.',
        '#projects .github-project-card:nth-of-type(7) h3': 'Soccer Probabilities · Expected Threat (xT)',
        '#projects .github-project-card:nth-of-type(7) p:not(.project-status)': 'Probabilistic Expected Threat model in soccer using public StatsBomb data. It estimates the probability of a goal in the next 5 actions.',
        '#projects .github-project-card:nth-of-type(8) h3': 'ML Model · Fraud Detection',
        '#projects .github-project-card:nth-of-type(8) p:not(.project-status)': 'Unsupervised K-means clustering applied to credit card fraud detection.',
        '#projects .github-project-card:nth-of-type(9) h3': 'ML Model · Fraud Detection',
        '#projects .github-project-card:nth-of-type(9) p:not(.project-status)': 'Supervised logistic regression model for credit card fraud detection.',
        '#projects .github-project-card:nth-of-type(10) h3': 'ML Model · Fraud Detection',
        '#projects .github-project-card:nth-of-type(10) p:not(.project-status)': 'Unsupervised DBSCAN clustering to detect potential credit card fraud patterns.',
        '#projects .github-project-card:nth-of-type(11) h3': 'Qatar 2022 World Cup Statistics',
        '#projects .github-project-card:nth-of-type(11) p:not(.project-status)': 'Coming soon.',
        '#projects .github-project-card:nth-of-type(12) h3': 'Geospatial Taxi Trip Analysis',
        '#projects .github-project-card:nth-of-type(12) p:not(.project-status)': 'Coming soon.',
        '#projects .github-project-card:nth-of-type(13) h3': 'Power BI Dashboard · Spotify Charts',
        '#projects .github-project-card:nth-of-type(13) p:not(.project-status)': 'Interactive Power BI dashboard to explore Spotify streams and analyze songs, artists and albums ranked in the Top 250 in each country.',
        '#projects .repo-empty-message': 'There are no projects in this category yet.',

        '#networks .section-kicker': 'Patrones Lab Online Presence',
        '#networks .projects-title-display': 'Channels',
        '#networks .social-intro': 'The full project ecosystem in one place: visuals, technical notes, articles, dashboards, useful links and professional contact channels.',
        '#networks .social-card.instagram small': 'Visuals and posts',
        '#networks .social-card.linkedin small': 'Professional profile',
        '#networks .social-card.medium small': 'Articles and notes',
        '#networks .social-card.linktree small': 'All links',
        '#networks .social-card.github small': 'Technical profile',
        '#networks .social-card.mail small': 'Direct contact',

        '#contact .contact-panel h3': 'Contact',
        '#contact .contact-panel p:not(.contact-email-line)': 'For professional opportunities, analytics collaboration or BI, machine learning and dashboard projects.',
        '#contact .contact-email-line strong': 'email:',
        '#contact .contact-form h2': 'Leave me a message',
        '#contact .form-note': 'Send me a message and I’ll get back to you shortly.',
        'footer': 'Patrones Lab® · Generating knowledge from data · by Malcolm Di Pietro Cagliari'
      },
      links: {
        'Entrar al proyecto': 'Open project',
        'Apri progetto': 'Open project',
        'Leer en LinkedIn': 'Read on LinkedIn',
        'Leggi su LinkedIn': 'Read on LinkedIn',
        'Ver dashboard': 'View dashboard',
        'Visualizza dashboard': 'View dashboard',
        'Ver documentación': 'View documentation',
        'Documentazione': 'View documentation',
        'Ver en SPSS': 'View in SPSS',
        'Visualizza in SPSS': 'View in SPSS',
        'Ver en Python': 'View in Python',
        'Visualizza in Python': 'View in Python'
      },
      attrs: {
        '#name': {placeholder: 'Name'},
        '#message': {placeholder: 'Message'},
        '#contactForm .submit-btn': {value: 'Prepare email'},
        '.floating-cta': {'aria-label': 'View Patrones Lab repository'},
        '.navbar-toggler': {'aria-label': 'Open navigation'},
        '#about .hero-rotator': {'aria-label': 'evidence, models, dashboards, decisions and patterns'},
        '#about .hero-tech-marquee': {'aria-label': 'Technologies used'},
        '#projects .repo-filter-toolbar': {'aria-label': 'Filter projects'}
      }
    },

    it: {
      title: 'Patrones Lab — Portfolio Dati, BI e Machine Learning',
      metaDescription: 'Patrones Lab: portfolio di progetti basati sui dati e riproducibili in BI, machine learning, Python, SQL, Power BI, Qlik e Looker Studio.',
      htmlLang: 'it',
      currentLabel: 'Italiano',
      text: {
        '.tech-logo-card-power-bi small': 'Business Intelligence',
        '.tech-logo-card-qlik small': 'Analisi visuale',
        '.tech-logo-card-looker small': 'Dashboard',
        '.tech-logo-card-python small': 'Analisi e modellazione',
        '.tech-logo-card-pandas small': 'Manipolazione dati',
        '.tech-logo-card-scikit small': 'Machine Learning',
        '.tech-logo-card-plotly small': 'Visualizzazione interattiva',
        '.tech-logo-card-spss small': 'Modellazione visuale',
        '.tech-logo-card-snowflake small': 'Data warehouse',
        '.tech-logo-card-databricks small': 'Lakehouse',
        '.floating-cta__text': 'Vedi repo',
        '.navbar-nav .nav-link[href="#about"]': 'Home',
        '.navbar-nav .nav-link[href="#methodology"]': 'Metodologia',
        '.navbar-nav .nav-link[href="#projects"]': 'Progetti',
        '.navbar-nav .nav-link[href="#networks"]': 'Canali',
        '.navbar-nav .nav-link[href="#contact"]': 'Contatti',
        '.color-mode': '<i class="color-mode-icon"></i>',

        '#about .hero-entry-kicker': 'Portfolio progetti Dati · BI · ML · Python',
        '#about .hero-line': 'Trasformo<br class="pl-it-mobile-break"><span class="pl-it-desktop-space"> </span>i dati in',
        '#about .hero-rotator span:nth-child(1)': 'evidenze',
        '#about .hero-rotator span:nth-child(2)': 'modelli',
        '#about .hero-rotator span:nth-child(3)': 'dashboard',
        '#about .hero-rotator span:nth-child(4)': 'decisioni',
        '#about .hero-rotator span:nth-child(5)': 'pattern',
        '#about .hero-entry-copy': 'Patrones Lab è un laboratorio di analisi dei dati applicata a fenomeni reali e quotidiani.<br><br>Raccoglie progetti indipendenti basati su dati pubblici, con attenzione all’individuazione di pattern, alla spiegazione dei comportamenti e alla comunicazione di evidenze contestualizzate.<br><br>L’obiettivo è formulare domande migliori, costruire dataset affidabili, sviluppare analisi riproducibili e trasformare i risultati in output visuali chiari.',

        '.tech-logo-card-airflow small': 'Orchestrazione',
        '.tech-logo-card-sql-server small': 'Database',
        '.tech-logo-card-numpy small': 'Calcolo numerico',
        '.tech-logo-card-matplotlib small': 'Visualizzazione dati',
        '.tech-logo-card-dbt small': 'Trasformazione dati',

        '#methodology .process-horizontal-static-head h2': 'Ciclo di vita dei dati',
        '#methodology .process-horizontal-panel:nth-child(1) h3': 'Esplorazione',
        '#methodology .process-horizontal-panel:nth-child(1) small': 'Contesto e obiettivo',
        '#methodology .process-horizontal-panel:nth-child(1) p': 'Definizione del problema, della decisione da supportare, degli utenti coinvolti e dell’output atteso.',
        '#methodology .process-horizontal-panel:nth-child(2) h3': 'Sorgenti dati',
        '#methodology .process-horizontal-panel:nth-child(2) small': 'Sorgenti e qualità dei dati',
        '#methodology .process-horizontal-panel:nth-child(2) p': 'Mappatura delle sorgenti disponibili, della loro origine, frequenza di aggiornamento, affidabilità e principali limiti di qualità.',
        '#methodology .process-horizontal-panel:nth-child(3) h3': 'Preparazione',
        '#methodology .process-horizontal-panel:nth-child(3) small': 'Dataset analitico',
        '#methodology .process-horizontal-panel:nth-child(3) p': 'Pulizia, normalizzazione e integrazione dei dati per costruire un dataset coerente, tracciabile e pronto per l’analisi.',
        '#methodology .process-horizontal-panel:nth-child(4) h3': 'Sviluppo',
        '#methodology .process-horizontal-panel:nth-child(4) small': 'Soluzione',
        '#methodology .process-horizontal-panel:nth-child(4) p': 'Sviluppo dell’analisi, del modello o della dashboard più adatta all’obiettivo definito.',
        '#methodology .process-horizontal-panel:nth-child(5) h3': 'Validazione',
        '#methodology .process-horizontal-panel:nth-child(5) small': 'Qualità e affidabilità',
        '#methodology .process-horizontal-panel:nth-child(5) p': 'Controllo della coerenza, stabilità e rilevanza operativa dei risultati prima della pubblicazione.',
        '#methodology .process-horizontal-panel:nth-child(6) h3': 'Pubblicazione',
        '#methodology .process-horizontal-panel:nth-child(6) small': 'Pubblicazione, automazione e miglioramento',
        '#methodology .process-horizontal-panel:nth-child(6) p': 'Documentazione dell’output finale, automazione dei flussi di lavoro ricorrenti e uso del feedback per miglioramenti successivi.',

        '#projects .section-kicker': 'Repository Patrones Lab',
        '#projects .projects-title-display': 'Progetti',
        '#projects .projects-intro': 'Selezione di progetti basati sui dati pubblici, con metodologia documentata e output visuali. Usa i filtri per esplorare per disciplina, strumento o tipo di risultato.',
        '#projects .repo-filter-btn[data-repo-filter="all"]': '<span class="filter-icon">◎</span> Tutti',
        '#projects .repo-filter-group:nth-of-type(1) .repo-filter-group-trigger': 'Disciplina',
        '#projects .repo-filter-group:nth-of-type(2) .repo-filter-group-trigger': 'Strumenti',
        '#projects .repo-filter-group:nth-of-type(3) .repo-filter-group-trigger': 'Modello',
        '#projects .repo-filter-group:nth-of-type(4) .repo-filter-group-trigger': 'Dominio',

        '#projects .repo-filter-btn[data-repo-filter="bi"]': '<span class="filter-icon">▦</span> BI',
        '#projects .repo-filter-btn[data-repo-filter="data-analysis"]': '<span class="filter-icon">▥</span> Analisi dati',
        '#projects .repo-filter-btn[data-repo-filter="data-science"]': '<span class="filter-icon">⚗</span> Scienza dei dati',
        '#projects .repo-filter-btn[data-repo-filter="machine-learning"]': '<span class="filter-icon">✦</span> Machine Learning',
        '#projects .repo-filter-btn[data-repo-filter="data-storytelling"]': '<span class="filter-icon">✎</span> Data storytelling',
        '#projects .repo-filter-btn[data-repo-filter="python"]': '<span class="filter-icon">◇</span> Python',
        '#projects .repo-filter-btn[data-repo-filter="spss"]': '<span class="filter-icon">◧</span> SPSS',
        '#projects .repo-filter-btn[data-repo-filter="looker-studio"]': '<span class="filter-icon">◉</span> Looker Studio',
        '#projects .repo-filter-btn[data-repo-filter="dashboard"]': '<span class="filter-icon">▣</span> Dashboard',
        '#projects .repo-filter-btn[data-repo-filter="power-bi"]': '<span class="filter-icon">▥</span> Power BI',
        '#projects .repo-filter-btn[data-repo-filter="modelo-supervisado"]': '<span class="filter-icon">✓</span> Modello supervisionato',
        '#projects .repo-filter-btn[data-repo-filter="modelo-no-supervisado"]': '<span class="filter-icon">◎</span> Modello non supervisionato',
        '#projects .repo-filter-btn[data-repo-filter="clasificacion"]': '<span class="filter-icon">≡</span> Classificazione',
        '#projects .repo-filter-btn[data-repo-filter="clustering"]': '<span class="filter-icon">✣</span> Clustering',
        '#projects .repo-filter-btn[data-repo-filter="knn"]': '<span class="filter-icon">↗</span> KNN',
        '#projects .repo-filter-btn[data-repo-filter="k-means"]': '<span class="filter-icon">⌖</span> K-means',
        '#projects .repo-filter-btn[data-repo-filter="regresion-logistica"]': '<span class="filter-icon">⌁</span> Regressione logistica',
        '#projects .repo-filter-btn[data-repo-filter="dbscan"]': '<span class="filter-icon">⊙</span> DBSCAN',
        '#projects .repo-filter-btn[data-repo-filter="geoespacial"]': '<span class="filter-icon">⌖</span> Geospaziale',
        '#projects .repo-filter-btn[data-repo-filter="airbnb"]': '<span class="filter-icon">⌂</span> Airbnb',
        '#projects .repo-filter-btn[data-repo-filter="taxi"]': '<span class="filter-icon">◆</span> Taxi',
        '#projects .repo-filter-btn[data-repo-filter="futbol"]': '<span class="filter-icon">●</span> Calcio',
        '#projects .repo-filter-btn[data-repo-filter="aviacion"]': '<span class="filter-icon">✈</span> Aviazione',
        '#projects .repo-filter-btn[data-repo-filter="fraude"]': '<span class="filter-icon">!</span> Frode',
        '#projects .repo-filter-btn[data-repo-filter="spotify"]': '<span class="filter-icon">♪</span> Spotify',

        '#projects .github-project-card:nth-of-type(1) h3': 'Analisi del traffico aereo nelle Isole Baleari',
        '#projects .github-project-card:nth-of-type(1) p:not(.project-status)': 'Analisi del traffico aereo in Spagna con dati pubblici AENA, con focus su volumi, pattern per aeroporto e differenze tra categorie di traffico.',
        '#projects .github-project-card:nth-of-type(2) h3': 'Analisi degli annunci Airbnb a Londra',
        '#projects .github-project-card:nth-of-type(2) p:not(.project-status)': 'Analisi esplorativa degli annunci Airbnb a Londra, con focus su pricing, categorie di alloggio, recensioni e pattern territoriali.',
        '#projects .github-project-card:nth-of-type(3) h3': 'Analisi delle corse taxi a Chicago',
        '#projects .github-project-card:nth-of-type(3) p:not(.project-status)': 'Analisi delle corse taxi registrate a Chicago per studiare durata, domanda, distribuzione geospaziale e pattern operativi.',
        '#projects .github-project-card:nth-of-type(4) h3': 'Modello ML · Airbnb London',
        '#projects .github-project-card:nth-of-type(4) p:not(.project-status)': 'Classificazione supervisionata degli annunci relativamente costosi o economici all’interno di ciascuna tipologia di alloggio.',
        '#projects .github-project-card:nth-of-type(5) h3': 'Dashboard Looker · Taxi Trips Chicago',
        '#projects .github-project-card:nth-of-type(5) p:not(.project-status)': 'Dashboard interattiva in Looker Studio per esplorare corse taxi a Chicago, indicatori operativi, pattern orari e percorsi pickup-dropoff.',
        '#projects .github-project-card:nth-of-type(6) h3': 'Modello ML · Expected Goals (xG)',
        '#projects .github-project-card:nth-of-type(6) p:not(.project-status)': 'Prossimamente.',
        '#projects .github-project-card:nth-of-type(7) h3': 'Probabilità nel calcio · Expected Threat (xT)',
        '#projects .github-project-card:nth-of-type(7) p:not(.project-status)': 'Modello probabilistico di Expected Threat nel calcio basato su dati pubblici StatsBomb. Stima la probabilità di gol nelle successive 5 azioni.',
        '#projects .github-project-card:nth-of-type(8) h3': 'Modello ML · Rilevamento frodi',
        '#projects .github-project-card:nth-of-type(8) p:not(.project-status)': 'Clustering non supervisionato con K-means applicato al rilevamento di frodi su transazioni con carta di credito.',
        '#projects .github-project-card:nth-of-type(9) h3': 'Modello ML · Rilevamento frodi',
        '#projects .github-project-card:nth-of-type(9) p:not(.project-status)': 'Modello supervisionato di regressione logistica per il rilevamento di frodi su transazioni con carta di credito.',
        '#projects .github-project-card:nth-of-type(10) h3': 'Modello ML · Rilevamento frodi',
        '#projects .github-project-card:nth-of-type(10) p:not(.project-status)': 'Clustering non supervisionato con DBSCAN per individuare possibili pattern anomali nelle transazioni con carta di credito.',
        '#projects .github-project-card:nth-of-type(11) h3': 'Statistiche Mondiali Qatar 2022',
        '#projects .github-project-card:nth-of-type(11) p:not(.project-status)': 'Prossimamente.',
        '#projects .github-project-card:nth-of-type(12) h3': 'Analisi geospaziale delle corse taxi',
        '#projects .github-project-card:nth-of-type(12) p:not(.project-status)': 'Prossimamente.',
        '#projects .github-project-card:nth-of-type(13) h3': 'Dashboard Power BI · Spotify Charts',
        '#projects .github-project-card:nth-of-type(13) p:not(.project-status)': 'Dashboard interattiva in Power BI per esplorare gli stream su Spotify e analizzare brani, artisti e album presenti nella Top 250 di ogni Paese.',
        '#projects .repo-empty-message': 'Non ci sono ancora progetti per questa categoria.',

        '#networks .section-kicker': 'Presenza digitale di Patrones Lab',
        '#networks .projects-title-display': 'Canali',
        '#networks .social-intro': 'L’intero ecosistema del progetto in un unico punto: visual, note tecniche, articoli, dashboard, link utili e canali di contatto professionale.',
        '#networks .social-card.instagram small': 'Visual e post',
        '#networks .social-card.linkedin small': 'Profilo professionale',
        '#networks .social-card.medium small': 'Articoli e note',
        '#networks .social-card.linktree small': 'Tutti i link',
        '#networks .social-card.github small': 'Profilo tecnico',
        '#networks .social-card.mail small': 'Contatto diretto',

        '#contact .contact-panel h3': 'Contatti',
        '#contact .contact-panel p:not(.contact-email-line)': 'Per opportunità professionali, collaborazioni in ambito analitico o progetti di BI, machine learning e dashboard.',
        '#contact .contact-email-line strong': 'email:',
        '#contact .contact-form h2': 'Lasciami un messaggio',
        '#contact .form-note': 'Scrivimi e ti risponderò appena possibile.',
        'footer': 'Patrones Lab® · Generando conoscenza a partire dai dati · di Malcolm Di Pietro Cagliari'
      },
      links: {
        'Entrar al proyecto': 'Apri progetto',
        'Open project': 'Apri progetto',
        'Leer en LinkedIn': 'Leggi su LinkedIn',
        'Read on LinkedIn': 'Leggi su LinkedIn',
        'Ver dashboard': 'Visualizza dashboard',
        'View dashboard': 'Visualizza dashboard',
        'Ver documentación': 'Documentazione',
        'View documentation': 'Documentazione',
        'View docs': 'Documentazione',
        'Ver en SPSS': 'Visualizza in SPSS',
        'View in SPSS': 'Visualizza in SPSS',
        'Ver en Python': 'Visualizza in Python',
        'View in Python': 'Visualizza in Python'
      },
      attrs: {
        '#name': {placeholder: 'Nome'},
        '#message': {placeholder: 'Messaggio'},
        '#contactForm .submit-btn': {value: 'Prepara email'},
        '.floating-cta': {'aria-label': 'Vedi repository Patrones Lab'},
        '.navbar-toggler': {'aria-label': 'Apri navigazione'},
        '#about .hero-rotator': {'aria-label': 'evidenze, modelli, dashboard, decisioni e pattern'},
        '#about .hero-tech-marquee': {'aria-label': 'Tecnologie utilizzate'},
        '#projects .repo-filter-toolbar': {'aria-label': 'Filtra progetti'}
      }
    }
  };

  const statusLabels = {
    es: {published:'✅ publicado', development:'⚠️ en desarrollo'},
    en: {published:'✅ published', development:'⚠️ in progress'},
    it: {published:'✅ pubblicato', development:'⚠️ in sviluppo'}
  };

  function setHtml(selector, html){
    const el = document.querySelector(selector);
    if(el) el.innerHTML = html;
  }

  function setAttr(selector, attrs){
    const el = document.querySelector(selector);
    if(!el) return;
    Object.keys(attrs).forEach(function(name){
      el.setAttribute(name, attrs[name]);
    });
  }

  function replaceLinkLabels(lang){
    const mapping = langData[lang].links || {};
    document.querySelectorAll('#projects .project-link').forEach(function(link){
      Object.keys(mapping).forEach(function(source){
        if(link.innerHTML.indexOf(source) !== -1){
          link.innerHTML = link.innerHTML.replace(source, mapping[source]);
        }
      });
    });
  }

  function updateStatusLabels(lang){
    const labels = statusLabels[lang] || statusLabels.es;
    document.querySelectorAll('.project-status.published').forEach(function(el){
      el.innerHTML = labels.published;
    });
    document.querySelectorAll('.project-status.development').forEach(function(el){
      el.innerHTML = labels.development;
    });
  }

  function updateLanguageSelector(lang){
    document.querySelectorAll('.language-selector').forEach(function(selector){
      const toggle = selector.querySelector('.language-select-toggle');
      const current = selector.querySelector('.language-select-current-img');
      if(toggle){
        toggle.setAttribute('aria-label', 'Idioma: ' + langData[lang].currentLabel);
        toggle.setAttribute('title', langData[lang].currentLabel);
        toggle.setAttribute('aria-expanded', selector.classList.contains('is-open') ? 'true' : 'false');
      }
      if(current){
        current.setAttribute('src', FLAGS[lang]);
      }
    });

    document.querySelectorAll('.language-option').forEach(function(option){
      const active = option.dataset.lang === lang;
      option.classList.toggle('is-active', active);
      option.setAttribute('aria-current', active ? 'true' : 'false');
    });
  }

  function closeLanguageMenus(){
    document.querySelectorAll('.language-selector.is-open').forEach(function(selector){
      selector.classList.remove('is-open');
      const toggle = selector.querySelector('.language-select-toggle');
      if(toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  }

  function applyLanguage(lang){
    const language = langData[lang] ? lang : 'es';
    const data = langData[language];

    document.documentElement.lang = data.htmlLang;
    document.title = data.title;

    const meta = document.querySelector('meta[name="description"]');
    if(meta) meta.setAttribute('content', data.metaDescription);

    Object.keys(data.text).forEach(function(selector){
      setHtml(selector, data.text[selector]);
    });

    Object.keys(data.attrs).forEach(function(selector){
      setAttr(selector, data.attrs[selector]);
    });

    replaceLinkLabels(language);
    updateStatusLabels(language);
    updateLanguageSelector(language);

    try{
      localStorage.setItem(STORAGE_KEY, language);
    }catch(e){}

    document.dispatchEvent(new CustomEvent('pl-language-changed', {detail:{language:language}}));

    if(window.plApplyRepoFilter && window.plGetActiveRepoFilter){
      window.plApplyRepoFilter(window.plGetActiveRepoFilter());
    }
  }

  document.addEventListener('click', function(event){
    const toggle = event.target.closest && event.target.closest('.language-select-toggle');
    const option = event.target.closest && event.target.closest('.language-option');

    if(toggle){
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      const selector = toggle.closest('.language-selector');
      const willOpen = !selector.classList.contains('is-open');
      closeLanguageMenus();
      selector.classList.toggle('is-open', willOpen);
      toggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      return;
    }

    if(option){
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      const lang = option.dataset.lang || 'es';
      applyLanguage(lang);
      closeLanguageMenus();
      return;
    }

    if(!event.target.closest || !event.target.closest('.language-selector')){
      closeLanguageMenus();
    }
  }, true);

  document.addEventListener('keydown', function(event){
    if(event.key === 'Escape'){
      closeLanguageMenus();
    }
  });

  window.plSetLanguage = applyLanguage;
  window.plGetLanguage = function(){
    try{
      return localStorage.getItem(STORAGE_KEY) || 'es';
    }catch(e){
      return 'es';
    }
  };
  window.plCurrentLanguageForContact = window.plGetLanguage;

  applyLanguage(window.plGetLanguage());
})();


(function(){
  const form = document.querySelector('#contactForm');
  if(!form) return;

  form.addEventListener('submit', function(event){
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    const lang = (window.plGetLanguage && window.plGetLanguage()) || 'es';
    const name = (document.querySelector('#name') || {}).value || '';
    const email = (document.querySelector('#email') || {}).value || '';
    const message = (document.querySelector('#message') || {}).value || '';

    const labels = {
      es: {subject:'Contacto desde Patrones Lab', name:'Nombre: ', message:'Mensaje:\n'},
      en: {subject:'Contact from Patrones Lab', name:'Name: ', message:'Message:\n'},
      it: {subject:'Contatto da Patrones Lab', name:'Nome: ', message:'Messaggio:\n'}
    };

    const data = labels[lang] || labels.es;
    const subject = encodeURIComponent(data.subject);
    const body = encodeURIComponent(
      data.name + name + '\n' +
      'Email: ' + email + '\n\n' +
      data.message + message
    );

    window.location.href = 'mailto:encontrandopatrones@gmail.com?subject=' + subject + '&body=' + body;
  }, true);
})();


(function(){
  const translations = {
    es: {
      scroll: 'Explorar',
      scrollLabel: 'Explorar, ir a la sección Metodología',
      networkRepoStrong: 'Repo',
      networkRepoSmall: 'Patrones Lab',
      networkDashboardStrong: 'Dashboard',
      networkDashboardSmall: 'Looker Studio',
      tags: {
        'Supervised Model': 'Modelo Supervisado',
        'Modello supervisionato': 'Modelo Supervisado',
        'Unsupervised Model': 'Modelo No Supervisado',
        'Modello non supervisionato': 'Modelo No Supervisado',
        'Classification': 'Clasificación',
        'Classificazione': 'Clasificación',
        'Logistic Regression': 'Regresión Logística',
        'Regressione logistica': 'Regresión Logística',
        'Geospatial': 'Geoespacial',
        'Geospaziale': 'Geoespacial',
        'Soccer': 'Fútbol',
        'Calcio': 'Fútbol',
        'Aviation': 'Aviación',
        'Aviazione': 'Aviación',
        'Fraud': 'Fraude',
        'Frode': 'Fraude'
      }
    },
    en: {
      scroll: 'Explore',
      scrollLabel: 'Explore, go to Methodology section',
      networkRepoStrong: 'Repository',
      networkRepoSmall: 'Patrones Lab',
      networkDashboardStrong: 'Dashboard',
      networkDashboardSmall: 'Looker Studio',
      tags: {
        'Modelo Supervisado': 'Supervised Model',
        'Modello supervisionato': 'Supervised Model',
        'Modelo No Supervisado': 'Unsupervised Model',
        'Modello non supervisionato': 'Unsupervised Model',
        'Clasificación': 'Classification',
        'Classificazione': 'Classification',
        'Regresión Logística': 'Logistic Regression',
        'Regressione logistica': 'Logistic Regression',
        'Geoespacial': 'Geospatial',
        'Geospaziale': 'Geospatial',
        'Fútbol': 'Soccer',
        'Calcio': 'Soccer',
        'Aviación': 'Aviation',
        'Aviazione': 'Aviation',
        'Fraude': 'Fraud',
        'Frode': 'Fraud'
      }
    },
    it: {
      scroll: 'Esplora',
      scrollLabel: 'Esplora, vai alla sezione Metodologia',
      networkRepoStrong: 'Repository',
      networkRepoSmall: 'Patrones Lab',
      networkDashboardStrong: 'Dashboard',
      networkDashboardSmall: 'Looker Studio',
      tags: {
        'Modelo Supervisado': 'Modello supervisionato',
        'Supervised Model': 'Modello supervisionato',
        'Modelo No Supervisado': 'Modello non supervisionato',
        'Unsupervised Model': 'Modello non supervisionato',
        'Clasificación': 'Classificazione',
        'Classification': 'Classificazione',
        'Regresión Logística': 'Regressione logistica',
        'Logistic Regression': 'Regressione logistica',
        'Geoespacial': 'Geospaziale',
        'Geospatial': 'Geospaziale',
        'Fútbol': 'Calcio',
        'Soccer': 'Calcio',
        'Aviación': 'Aviazione',
        'Aviation': 'Aviazione',
        'Fraude': 'Frode',
        'Fraud': 'Frode'
      }
    }
  };

  function currentLang(){
    if(window.plGetLanguage){
      return window.plGetLanguage();
    }
    try{
      return localStorage.getItem('patronesLabLanguage') || 'es';
    }catch(e){
      return 'es';
    }
  }

  function setText(selector, text){
    document.querySelectorAll(selector).forEach(function(el){
      el.textContent = text;
    });
  }

  function patchProjectTags(lang){
    const data = translations[lang] || translations.es;
    const map = data.tags || {};

    document.querySelectorAll('#projects .project-tags span').forEach(function(tag){
      const current = tag.textContent.trim();
      if(map[current]){
        tag.textContent = map[current];
      }
    });
  }

  function patchNetworkCards(lang){
    const data = translations[lang] || translations.es;

    setText('#networks .social-card.repo strong', data.networkRepoStrong);
    setText('#networks .social-card.repo small', data.networkRepoSmall);
    setText('#networks .social-card.dashboard strong', data.networkDashboardStrong);
    setText('#networks .social-card.dashboard small', data.networkDashboardSmall);
  }

  function patchVisibleTexts(lang){
    const data = translations[lang] || translations.es;

    setText('#about .hero-scroll-indicator__text', data.scroll);
    document.querySelectorAll('#about .hero-scroll-indicator').forEach(function(link){
      link.setAttribute('aria-label', data.scrollLabel || data.scroll);
    });
    patchProjectTags(lang);
    patchNetworkCards(lang);
  }

  document.addEventListener('pl-language-changed', function(event){
    const lang = event.detail && event.detail.language ? event.detail.language : currentLang();
    patchVisibleTexts(lang);
  });

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){
      patchVisibleTexts(currentLang());
    }, {once:true});
  }else{
    patchVisibleTexts(currentLang());
  }

  window.plPatchVisibleTranslations = patchVisibleTexts;
})();


(function(){
  const techLabels = {
    es: {
      'power-bi':'Inteligencia de negocio',
      'qlik':'Analítica visual',
      'looker':'Dashboards',
      'sql-server':'Base de datos',
      'python':'Análisis y modelado',
      'pandas':'Manipulación de datos',
      'numpy':'Cálculo numérico',
      'scikit':'Machine Learning',
      'matplotlib':'Visualización',
      'plotly':'Visualización interactiva',
      'spss':'Modelado visual',
      'airflow':'Orquestación',
      'snowflake':'Data warehouse',
      'databricks':'Lakehouse',
      'dbt':'Transformación'
    },
    en: {
      'power-bi':'Business Intelligence',
      'qlik':'Visual analytics',
      'looker':'Dashboards',
      'sql-server':'Database',
      'python':'Analysis and modeling',
      'pandas':'Data manipulation',
      'numpy':'Numerical computing',
      'scikit':'Machine Learning',
      'matplotlib':'Data visualization',
      'plotly':'Interactive visualization',
      'spss':'Visual modeling',
      'airflow':'Orchestration',
      'snowflake':'Data warehouse',
      'databricks':'Lakehouse',
      'dbt':'Transformation'
    },
    it: {
      'power-bi':'Business Intelligence',
      'qlik':'Analisi visuale',
      'looker':'Dashboard',
      'sql-server':'Database',
      'python':'Analisi e modellazione',
      'pandas':'Manipolazione dati',
      'numpy':'Calcolo numerico',
      'scikit':'Machine Learning',
      'matplotlib':'Visualizzazione dati',
      'plotly':'Visualizzazione interattiva',
      'spss':'Modellazione visuale',
      'airflow':'Orchestrazione',
      'snowflake':'Data warehouse',
      'databricks':'Lakehouse',
      'dbt':'Trasformazione dati'
    }
  };

  function currentLang(){
    if(window.plGetLanguage){
      return window.plGetLanguage();
    }
    try{
      return localStorage.getItem('patronesLabLanguage') || 'es';
    }catch(e){
      return 'es';
    }
  }

  function patchTechLabels(lang){
    const labels = techLabels[lang] || techLabels.es;

    Object.keys(labels).forEach(function(key){
      document.querySelectorAll('.tech-logo-card-' + key + ' small').forEach(function(el){
        el.textContent = labels[key];
      });
    });
  }

  function patchAllVisibleTranslations(lang){
    patchTechLabels(lang);

    if(window.plPatchVisibleTranslations){
      window.plPatchVisibleTranslations(lang);
    }

    if(window.plApplyRepoFilter && window.plGetActiveRepoFilter){
      window.plApplyRepoFilter(window.plGetActiveRepoFilter());
    }
  }

  document.addEventListener('pl-language-changed', function(event){
    const lang = event.detail && event.detail.language ? event.detail.language : currentLang();
    patchAllVisibleTranslations(lang);
  });

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){
      patchAllVisibleTranslations(currentLang());
    }, {once:true});
  }else{
    patchAllVisibleTranslations(currentLang());
  }

  window.plPatchAllVisibleTranslations = patchAllVisibleTranslations;
})();


(function(){
  const tagLabels = {
    es: {
      'bi': 'BI',
      'data-analysis': 'Data Analysis',
      'data-science': 'Data Science',
      'data-storytelling': 'Data Storytelling',
      'machine-learning': 'Machine Learning',
      'python': 'Python',
      'spss': 'SPSS',
      'looker-studio': 'Looker Studio',
      'dashboard': 'Dashboard',
      'power-bi': 'Power BI',
      'spotify': 'Spotify',
      'modelo-supervisado': 'Modelo Supervisado',
      'modelo-no-supervisado': 'Modelo No Supervisado',
      'clasificacion': 'Clasificación',
      'clustering': 'Clustering',
      'knn': 'KNN',
      'k-means': 'K-means',
      'regresion-logistica': 'Regresión Logística',
      'dbscan': 'DBSCAN',
      'geoespacial': 'Geoespacial',
      'airbnb': 'Airbnb',
      'taxi': 'Taxi',
      'futbol': 'Fútbol',
      'aviacion': 'Aviación',
      'fraude': 'Fraude'
    },
    en: {
      'bi': 'BI',
      'data-analysis': 'Data Analysis',
      'data-science': 'Data Science',
      'data-storytelling': 'Data Storytelling',
      'machine-learning': 'Machine Learning',
      'python': 'Python',
      'spss': 'SPSS',
      'looker-studio': 'Looker Studio',
      'dashboard': 'Dashboard',
      'power-bi': 'Power BI',
      'spotify': 'Spotify',
      'modelo-supervisado': 'Supervised Model',
      'modelo-no-supervisado': 'Unsupervised Model',
      'clasificacion': 'Classification',
      'clustering': 'Clustering',
      'knn': 'KNN',
      'k-means': 'K-means',
      'regresion-logistica': 'Logistic Regression',
      'dbscan': 'DBSCAN',
      'geoespacial': 'Geospatial',
      'airbnb': 'Airbnb',
      'taxi': 'Taxi',
      'futbol': 'Soccer',
      'aviacion': 'Aviation',
      'fraude': 'Fraud'
    },
    it: {
      'bi': 'BI',
      'data-analysis': 'Analisi dati',
      'data-science': 'Scienza dei dati',
      'data-storytelling': 'Data storytelling',
      'machine-learning': 'Machine Learning',
      'python': 'Python',
      'spss': 'SPSS',
      'looker-studio': 'Looker Studio',
      'dashboard': 'Dashboard',
      'power-bi': 'Power BI',
      'spotify': 'Spotify',
      'modelo-supervisado': 'Modello supervisionato',
      'modelo-no-supervisado': 'Modello non supervisionato',
      'clasificacion': 'Classificazione',
      'clustering': 'Clustering',
      'knn': 'KNN',
      'k-means': 'K-means',
      'regresion-logistica': 'Regressione logistica',
      'dbscan': 'DBSCAN',
      'geoespacial': 'Geospaziale',
      'airbnb': 'Airbnb',
      'taxi': 'Taxi',
      'futbol': 'Calcio',
      'aviacion': 'Aviazione',
      'fraude': 'Frode'
    }
  };

  function currentLang(){
    if(window.plGetLanguage){
      return window.plGetLanguage();
    }
    try{
      return localStorage.getItem('patronesLabLanguage') || 'es';
    }catch(e){
      return 'es';
    }
  }

  function renderProjectTags(lang){
    const labels = tagLabels[lang] || tagLabels.es;

    document.querySelectorAll('#projects .github-project-card[data-tags]').forEach(function(card){
      const holder = card.querySelector('.project-tags');
      if(!holder) return;

      const tokens = (card.dataset.tags || '').trim().split(/\s+/).filter(Boolean);
      const existing = Array.from(holder.querySelectorAll('span'));

      tokens.forEach(function(token, index){
        const label = labels[token] || token;
        let span = existing[index];

        if(!span){
          span = document.createElement('span');
          holder.appendChild(span);
        }

        span.textContent = label;
        span.setAttribute('data-tag-token', token);
        span.setAttribute('data-lang', lang);
      });

      existing.slice(tokens.length).forEach(function(span){
        span.remove();
      });
    });
  }

  function validateVisibleTags(lang){
    const labels = tagLabels[lang] || tagLabels.es;
    const mismatches = [];

    document.querySelectorAll('#projects .github-project-card[data-tags]').forEach(function(card, cardIndex){
      const tokens = (card.dataset.tags || '').trim().split(/\s+/).filter(Boolean);
      const spans = Array.from(card.querySelectorAll('.project-tags span'));

      tokens.forEach(function(token, index){
        const expected = labels[token] || token;
        const actual = spans[index] ? spans[index].textContent.trim() : '';
        if(actual !== expected){
          mismatches.push({
            card: cardIndex + 1,
            token: token,
            expected: expected,
            actual: actual
          });
        }
      });
    });

    window.plProjectTagTranslationAudit = {
      language: lang,
      mismatches: mismatches,
      ok: mismatches.length === 0
    };

    return window.plProjectTagTranslationAudit;
  }

  function applyProjectTagTranslations(lang){
    const language = tagLabels[lang] ? lang : currentLang();
    renderProjectTags(language);
    validateVisibleTags(language);
  }

  document.addEventListener('pl-language-changed', function(event){
    const lang = event.detail && event.detail.language ? event.detail.language : currentLang();
    applyProjectTagTranslations(lang);
  });

  document.addEventListener('click', function(event){
    if(event.target.closest && event.target.closest('.repo-filter-btn[data-repo-filter]')){
      window.requestAnimationFrame(function(){
        applyProjectTagTranslations(currentLang());
      });
    }
  }, true);

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){
      applyProjectTagTranslations(currentLang());
    }, {once:true});
  }else{
    applyProjectTagTranslations(currentLang());
  }

  window.plApplyProjectTagTranslations = applyProjectTagTranslations;
  window.plValidateProjectTagTranslations = validateVisibleTags;
  window.plProjectTagLabels = tagLabels;
})();


(function(){
  const TAG_LABELS_BY_TOKEN = {
    "all": {
        "icon": "◎",
        "es": "Todos",
        "en": "All",
        "it": "Tutti"
    },
    "bi": {
        "icon": "▦",
        "es": "BI",
        "en": "BI",
        "it": "BI"
    },
    "data-analysis": {
        "icon": "▥",
        "es": "Data Analysis",
        "en": "Data analysis",
        "it": "Analisi dati"
    },
    "data-science": {
        "icon": "⚗",
        "es": "Data Science",
        "en": "Data science",
        "it": "Scienza dei dati"
    },
    "data-storytelling": {
        "icon": "✎",
        "es": "Data Storytelling",
        "en": "Data Storytelling",
        "it": "Data storytelling"
    },
    "machine-learning": {
        "icon": "✦",
        "es": "Machine Learning",
        "en": "Machine Learning",
        "it": "Machine Learning"
    },
    "python": {
        "icon": "◇",
        "es": "Python",
        "en": "Python",
        "it": "Python"
    },
    "spss": {
        "icon": "◧",
        "es": "SPSS",
        "en": "SPSS",
        "it": "SPSS"
    },
    "looker-studio": {
        "icon": "◉",
        "es": "Looker Studio",
        "en": "Looker Studio",
        "it": "Looker Studio"
    },
    "dashboard": {
        "icon": "▣",
        "es": "Dashboard",
        "en": "Dashboard",
        "it": "Dashboard"
    },
    "power-bi": {
        "icon": "▥",
        "es": "Power BI",
        "en": "Power BI",
        "it": "Power BI"
    },
    "spotify": {
        "icon": "♪",
        "es": "Spotify",
        "en": "Spotify",
        "it": "Spotify"
    },
    "modelo-supervisado": {
        "icon": "✓",
        "es": "Modelo supervisado",
        "en": "Supervised model",
        "it": "Modello supervisionato"
    },
    "modelo-no-supervisado": {
        "icon": "◎",
        "es": "Modelo no supervisado",
        "en": "Unsupervised model",
        "it": "Modello non supervisionato"
    },
    "clasificacion": {
        "icon": "≡",
        "es": "Clasificación",
        "en": "Classification",
        "it": "Classificazione"
    },
    "clustering": {
        "icon": "✣",
        "es": "Clustering",
        "en": "Clustering",
        "it": "Clustering"
    },
    "knn": {
        "icon": "↗",
        "es": "KNN",
        "en": "KNN",
        "it": "KNN"
    },
    "k-means": {
        "icon": "⌖",
        "es": "K-means",
        "en": "K-means",
        "it": "K-means"
    },
    "regresion-logistica": {
        "icon": "⌁",
        "es": "Regresión logística",
        "en": "Logistic regression",
        "it": "Regressione logistica"
    },
    "dbscan": {
        "icon": "⊙",
        "es": "DBSCAN",
        "en": "DBSCAN",
        "it": "DBSCAN"
    },
    "geoespacial": {
        "icon": "⌖",
        "es": "Geoespacial",
        "en": "Geospatial",
        "it": "Geospaziale"
    },
    "airbnb": {
        "icon": "⌂",
        "es": "Airbnb",
        "en": "Airbnb",
        "it": "Airbnb"
    },
    "taxi": {
        "icon": "◆",
        "es": "Taxi",
        "en": "Taxi",
        "it": "Taxi"
    },
    "futbol": {
        "icon": "●",
        "es": "Fútbol",
        "en": "Soccer",
        "it": "Calcio"
    },
    "aviacion": {
        "icon": "✈",
        "es": "Aviación",
        "en": "Aviation",
        "it": "Aviazione"
    },
    "fraude": {
        "icon": "!",
        "es": "Fraude",
        "en": "Fraud",
        "it": "Frode"
    }
};

  function currentLang(){
    if(window.plGetLanguage){
      const lang = window.plGetLanguage();
      if(['es','en','it'].includes(lang)) return lang;
    }
    try{
      const stored = localStorage.getItem('patronesLabLanguage');
      if(['es','en','it'].includes(stored)) return stored;
    }catch(e){}
    return 'es';
  }

  function labelFor(token, lang){
    const data = TAG_LABELS_BY_TOKEN[token];
    if(!data) return token;
    return data[lang] || data.es || token;
  }

  function iconFor(token){
    const data = TAG_LABELS_BY_TOKEN[token];
    return data && data.icon ? data.icon : '';
  }

  function renderFilterButton(button, lang){
    const token = button.dataset.repoFilter;
    if(!token) return;

    const icon = iconFor(token);
    const label = labelFor(token, lang);

    button.innerHTML = icon
      ? '<span class="filter-icon">' + icon + '</span> ' + label
      : label;

    button.setAttribute('data-label-token', token);
    button.setAttribute('data-label-lang', lang);
  }

  function renderAllFilterButtons(lang){
    document.querySelectorAll('#projects .repo-filter-btn[data-repo-filter]').forEach(function(button){
      renderFilterButton(button, lang);
    });
  }

  function renderCardTags(card, lang){
    const holder = card.querySelector('.project-tags');
    if(!holder) return;

    const tokens = (card.dataset.tags || '').trim().split(/\s+/).filter(Boolean);
    holder.innerHTML = '';

    tokens.forEach(function(token){
      const span = document.createElement('span');
      span.textContent = labelFor(token, lang);
      span.setAttribute('data-tag-token', token);
      span.setAttribute('data-label-lang', lang);
      holder.appendChild(span);
    });
  }

  function renderAllCardTags(lang){
    document.querySelectorAll('#projects .github-project-card[data-tags]').forEach(function(card){
      renderCardTags(card, lang);
    });
  }

  function auditTagsAndFilters(lang){
    const problems = [];
    const filterLabels = {};

    document.querySelectorAll('#projects .repo-filter-btn[data-repo-filter]').forEach(function(button){
      const token = button.dataset.repoFilter;
      const text = button.textContent.replace(/^\s*[◎▦▥⚗✦✎◇◧◉▣✓≡✣↗⌖⌁⊙●✈!]+\s*/, '').trim();
      const expected = labelFor(token, lang);

      filterLabels[token] = text;

      if(text !== expected){
        problems.push({
          type: 'filter-label-mismatch',
          token: token,
          expected: expected,
          actual: text
        });
      }
    });

    document.querySelectorAll('#projects .github-project-card[data-tags]').forEach(function(card, cardIndex){
      const tokens = (card.dataset.tags || '').trim().split(/\s+/).filter(Boolean);
      const spans = Array.from(card.querySelectorAll('.project-tags span'));

      tokens.forEach(function(token, index){
        const expected = labelFor(token, lang);
        const actual = spans[index] ? spans[index].textContent.trim() : '';
        const filterText = filterLabels[token];

        if(actual !== expected){
          problems.push({
            type: 'card-tag-mismatch',
            card: cardIndex + 1,
            token: token,
            expected: expected,
            actual: actual
          });
        }

        if(filterText && actual !== filterText){
          problems.push({
            type: 'filter-card-label-different',
            card: cardIndex + 1,
            token: token,
            filter: filterText,
            cardTag: actual
          });
        }
      });

      if(spans.length !== tokens.length){
        problems.push({
          type: 'card-tag-count-mismatch',
          card: cardIndex + 1,
          expected: tokens.length,
          actual: spans.length
        });
      }
    });

    window.plTagsFiltersAudit = {
      language: lang,
      ok: problems.length === 0,
      problems: problems
    };

    return window.plTagsFiltersAudit;
  }

  function syncProjectFiltersAndTags(lang){
    const language = ['es','en','it'].includes(lang) ? lang : currentLang();

    renderAllFilterButtons(language);
    renderAllCardTags(language);

    if(window.plApplyRepoFilter && window.plGetActiveRepoFilter){
      window.plApplyRepoFilter(window.plGetActiveRepoFilter());
    }

    renderAllFilterButtons(language);
    renderAllCardTags(language);

    auditTagsAndFilters(language);
  }

  document.addEventListener('pl-language-changed', function(event){
    const lang = event.detail && event.detail.language ? event.detail.language : currentLang();

    window.requestAnimationFrame(function(){
      syncProjectFiltersAndTags(lang);
    });

    setTimeout(function(){
      syncProjectFiltersAndTags(lang);
    }, 0);
  });

  document.addEventListener('click', function(event){
    if(event.target.closest && event.target.closest('.repo-filter-btn[data-repo-filter]')){
      const lang = currentLang();

      window.requestAnimationFrame(function(){
        syncProjectFiltersAndTags(lang);
      });

      setTimeout(function(){
        syncProjectFiltersAndTags(lang);
      }, 0);
    }
  }, true);

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){
      syncProjectFiltersAndTags(currentLang());
    }, {once:true});
  }else{
    syncProjectFiltersAndTags(currentLang());
  }

  window.plSyncProjectFiltersAndTags = syncProjectFiltersAndTags;
  window.plAuditTagsAndFilters = auditTagsAndFilters;
  window.plProjectFilterTagLabels = TAG_LABELS_BY_TOKEN;
})();


(function(){
  const FINAL_TAG_LABELS = {
    "all": {
        "icon": "◎",
        "es": "Todos",
        "en": "All",
        "it": "Tutti"
    },
    "bi": {
        "icon": "▦",
        "es": "BI",
        "en": "BI",
        "it": "BI"
    },
    "data-analysis": {
        "icon": "▥",
        "es": "Análisis de datos",
        "en": "Data analysis",
        "it": "Analisi dati"
    },
    "data-science": {
        "icon": "⚗",
        "es": "Ciencia de datos",
        "en": "Data science",
        "it": "Scienza dei dati"
    },
    "data-storytelling": {
        "icon": "✎",
        "es": "Data Storytelling",
        "en": "Data Storytelling",
        "it": "Data Storytelling"
    },
    "machine-learning": {
        "icon": "✦",
        "es": "Machine Learning",
        "en": "Machine Learning",
        "it": "Machine Learning"
    },
    "python": {
        "icon": "◇",
        "es": "Python",
        "en": "Python",
        "it": "Python"
    },
    "spss": {
        "icon": "◧",
        "es": "SPSS",
        "en": "SPSS",
        "it": "SPSS"
    },
    "looker-studio": {
        "icon": "◉",
        "es": "Looker Studio",
        "en": "Looker Studio",
        "it": "Looker Studio"
    },
    "dashboard": {
        "icon": "▣",
        "es": "Dashboard",
        "en": "Dashboard",
        "it": "Dashboard"
    },
    "power-bi": {
        "icon": "▥",
        "es": "Power BI",
        "en": "Power BI",
        "it": "Power BI"
    },
    "spotify": {
        "icon": "♪",
        "es": "Spotify",
        "en": "Spotify",
        "it": "Spotify"
    },
    "modelo-supervisado": {
        "icon": "✓",
        "es": "Modelo supervisado",
        "en": "Supervised model",
        "it": "Modello supervisionato"
    },
    "modelo-no-supervisado": {
        "icon": "◎",
        "es": "Modelo no supervisado",
        "en": "Unsupervised model",
        "it": "Modello non supervisionato"
    },
    "clasificacion": {
        "icon": "≡",
        "es": "Clasificación",
        "en": "Classification",
        "it": "Classificazione"
    },
    "clustering": {
        "icon": "✣",
        "es": "Clustering",
        "en": "Clustering",
        "it": "Clustering"
    },
    "knn": {
        "icon": "↗",
        "es": "KNN",
        "en": "KNN",
        "it": "KNN"
    },
    "k-means": {
        "icon": "⌖",
        "es": "K-means",
        "en": "K-means",
        "it": "K-means"
    },
    "regresion-logistica": {
        "icon": "⌁",
        "es": "Regresión logística",
        "en": "Logistic regression",
        "it": "Regressione logistica"
    },
    "dbscan": {
        "icon": "⊙",
        "es": "DBSCAN",
        "en": "DBSCAN",
        "it": "DBSCAN"
    },
    "geoespacial": {
        "icon": "⌖",
        "es": "Geoespacial",
        "en": "Geospatial",
        "it": "Geospaziale"
    },
    "airbnb": {
        "icon": "⌂",
        "es": "Airbnb",
        "en": "Airbnb",
        "it": "Airbnb"
    },
    "taxi": {
        "icon": "◆",
        "es": "Taxi",
        "en": "Taxi",
        "it": "Taxi"
    },
    "futbol": {
        "icon": "●",
        "es": "Fútbol",
        "en": "Soccer",
        "it": "Calcio"
    },
    "aviacion": {
        "icon": "✈",
        "es": "Aviación",
        "en": "Aviation",
        "it": "Aviazione"
    },
    "fraude": {
        "icon": "!",
        "es": "Fraude",
        "en": "Fraud",
        "it": "Frode"
    }
};
  let isSyncing = false;

  function getLang(){
    if(window.plGetLanguage){
      const lang = window.plGetLanguage();
      if(['es','en','it'].includes(lang)) return lang;
    }

    try{
      const stored = localStorage.getItem('patronesLabLanguage');
      if(['es','en','it'].includes(stored)) return stored;
    }catch(e){}

    return document.documentElement.lang || 'es';
  }

  function getLabel(token, lang){
    const item = FINAL_TAG_LABELS[token];
    if(!item) return token;
    return item[lang] || item.es || token;
  }

  function getIcon(token){
    const item = FINAL_TAG_LABELS[token];
    return item && item.icon ? item.icon : '';
  }

  function cleanFilterText(text){
    return (text || '').replace(/^\s*[◎▦▥⚗✦✎◇◧◉▣✓≡✣↗⌖⌁⊙●✈!]+\s*/, '').trim();
  }

  function renderOneFilter(button, lang){
    const token = button.dataset.repoFilter;
    if(!token) return;

    const icon = getIcon(token);
    const label = getLabel(token, lang);

    const nextHtml = icon
      ? '<span class="filter-icon">' + icon + '</span> ' + label
      : label;

    if(button.innerHTML !== nextHtml){
      button.innerHTML = nextHtml;
    }

    if(button.dataset.labelToken !== token){
      button.dataset.labelToken = token;
    }

    if(button.dataset.labelLang !== lang){
      button.dataset.labelLang = lang;
    }
  }

  function renderFilters(lang){
    document.querySelectorAll('#projects .repo-filter-btn[data-repo-filter]').forEach(function(button){
      renderOneFilter(button, lang);
    });
  }

  function renderOneCardTags(card, lang){
    
    return;
  }

  function renderCardTags(lang){
    document.querySelectorAll('#projects .github-project-card[data-tags]').forEach(function(card){
      renderOneCardTags(card, lang);
    });
  }

  function audit(lang){
    const problems = [];
    const filterMap = {};

    document.querySelectorAll('#projects .repo-filter-btn[data-repo-filter]').forEach(function(button){
      const token = button.dataset.repoFilter;
      const expected = getLabel(token, lang);
      const actual = cleanFilterText(button.textContent);

      filterMap[token] = actual;

      if(actual !== expected){
        problems.push({
          type: 'filter-not-translated',
          token: token,
          expected: expected,
          actual: actual
        });
      }
    });

    window.plFinalTagsFiltersAudit = {
      language: lang,
      ok: problems.length === 0,
      problems: problems,
      note: 'TagsCleanup: se auditan filtros; no se inyectan project-tags para evitar texto crudo.'
    };

    return window.plFinalTagsFiltersAudit;
  }

  function sync(lang){
    if(isSyncing) return;

    isSyncing = true;

    const language = ['es','en','it'].includes(lang) ? lang : getLang();

    renderFilters(language);
    renderCardTags(language);
    audit(language);

    isSyncing = false;
  }

  function syncSoon(lang){
    const language = ['es','en','it'].includes(lang) ? lang : getLang();

    sync(language);

    window.requestAnimationFrame(function(){
      sync(language);
    });

    setTimeout(function(){
      sync(language);
    }, 0);

    setTimeout(function(){
      sync(language);
    }, 150);
  }

  document.addEventListener('pl-language-changed', function(event){
    const lang = event.detail && event.detail.language ? event.detail.language : getLang();
    syncSoon(lang);
  });

  document.addEventListener('click', function(event){
    if(event.target.closest && (
      event.target.closest('.language-option') ||
      event.target.closest('.repo-filter-btn[data-repo-filter]')
    )){
      syncSoon(getLang());
    }
  }, true);

  

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){
      syncSoon(getLang());
    }, {once:true});
  }else{
    syncSoon(getLang());
  }

  window.plSyncFinalTagsFilters = syncSoon;
  window.plAuditFinalTagsFilters = audit;
  window.plFinalTagLabels = FINAL_TAG_LABELS;
})();


(function(){
  function removeInjectedProjectTags(){
    document.querySelectorAll('#projects .github-project-card .project-tags').forEach(function(holder){
      holder.remove();
    });
  }

  document.addEventListener('pl-language-changed', function(){
    window.requestAnimationFrame(removeInjectedProjectTags);
    setTimeout(removeInjectedProjectTags, 0);
  });

  document.addEventListener('click', function(event){
    if(event.target.closest && event.target.closest('.repo-filter-btn[data-repo-filter]')){
      window.requestAnimationFrame(removeInjectedProjectTags);
      setTimeout(removeInjectedProjectTags, 0);
    }
  }, true);

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', removeInjectedProjectTags, {once:true});
  }else{
    removeInjectedProjectTags();
  }

  window.plRemoveInjectedProjectTags = removeInjectedProjectTags;
})();


(function(){
  const FINAL_PROJECT_LABELS = {
    "all": {
        "icon": "◎",
        "es": "Todos",
        "en": "All",
        "it": "Tutti"
    },
    "bi": {
        "icon": "▦",
        "es": "BI",
        "en": "BI",
        "it": "BI"
    },
    "data-analysis": {
        "icon": "▥",
        "es": "Análisis de datos",
        "en": "Data analysis",
        "it": "Analisi dati"
    },
    "data-science": {
        "icon": "⚗",
        "es": "Ciencia de datos",
        "en": "Data science",
        "it": "Scienza dei dati"
    },
    "data-storytelling": {
        "icon": "✎",
        "es": "Data Storytelling",
        "en": "Data Storytelling",
        "it": "Data Storytelling"
    },
    "machine-learning": {
        "icon": "✦",
        "es": "Machine Learning",
        "en": "Machine Learning",
        "it": "Machine Learning"
    },
    "python": {
        "icon": "◇",
        "es": "Python",
        "en": "Python",
        "it": "Python"
    },
    "spss": {
        "icon": "◧",
        "es": "SPSS",
        "en": "SPSS",
        "it": "SPSS"
    },
    "looker-studio": {
        "icon": "◉",
        "es": "Looker Studio",
        "en": "Looker Studio",
        "it": "Looker Studio"
    },
    "dashboard": {
        "icon": "▣",
        "es": "Dashboard",
        "en": "Dashboard",
        "it": "Dashboard"
    },
    "power-bi": {
        "icon": "▥",
        "es": "Power BI",
        "en": "Power BI",
        "it": "Power BI"
    },
    "spotify": {
        "icon": "♪",
        "es": "Spotify",
        "en": "Spotify",
        "it": "Spotify"
    },
    "modelo-supervisado": {
        "icon": "✓",
        "es": "Modelo supervisado",
        "en": "Supervised model",
        "it": "Modello supervisionato"
    },
    "modelo-no-supervisado": {
        "icon": "◎",
        "es": "Modelo no supervisado",
        "en": "Unsupervised model",
        "it": "Modello non supervisionato"
    },
    "clasificacion": {
        "icon": "≡",
        "es": "Clasificación",
        "en": "Classification",
        "it": "Classificazione"
    },
    "clustering": {
        "icon": "✣",
        "es": "Clustering",
        "en": "Clustering",
        "it": "Clustering"
    },
    "knn": {
        "icon": "↗",
        "es": "KNN",
        "en": "KNN",
        "it": "KNN"
    },
    "k-means": {
        "icon": "⌖",
        "es": "K-means",
        "en": "K-means",
        "it": "K-means"
    },
    "regresion-logistica": {
        "icon": "⌁",
        "es": "Regresión logística",
        "en": "Logistic regression",
        "it": "Regressione logistica"
    },
    "dbscan": {
        "icon": "⊙",
        "es": "DBSCAN",
        "en": "DBSCAN",
        "it": "DBSCAN"
    },
    "geoespacial": {
        "icon": "⌖",
        "es": "Geoespacial",
        "en": "Geospatial",
        "it": "Geospaziale"
    },
    "airbnb": {
        "icon": "⌂",
        "es": "Airbnb",
        "en": "Airbnb",
        "it": "Airbnb"
    },
    "taxi": {
        "icon": "◆",
        "es": "Taxi",
        "en": "Taxi",
        "it": "Taxi"
    },
    "futbol": {
        "icon": "●",
        "es": "Fútbol",
        "en": "Soccer",
        "it": "Calcio"
    },
    "aviacion": {
        "icon": "✈",
        "es": "Aviación",
        "en": "Aviation",
        "it": "Aviazione"
    },
    "fraude": {
        "icon": "!",
        "es": "Fraude",
        "en": "Fraud",
        "it": "Frode"
    }
};

  function getLang(){
    if(window.plGetLanguage){
      const lang = window.plGetLanguage();
      if(['es','en','it'].includes(lang)) return lang;
    }

    try{
      const stored = localStorage.getItem('patronesLabLanguage');
      if(['es','en','it'].includes(stored)) return stored;
    }catch(e){}

    const htmlLang = document.documentElement.lang;
    return ['es','en','it'].includes(htmlLang) ? htmlLang : 'es';
  }

  function labelFor(token, lang){
    const data = FINAL_PROJECT_LABELS[token];
    if(!data) return token;
    return data[lang] || data.es || token;
  }

  function iconFor(token){
    const data = FINAL_PROJECT_LABELS[token];
    return data && data.icon ? data.icon : '';
  }

  function stripIcon(text){
    return (text || '').replace(/^\s*[◎▦▥⚗✦✎◇◧◉▣✓≡✣↗⌖⌁⊙●✈!]+\s*/, '').trim();
  }

  function renderFilters(lang){
    document.querySelectorAll('#projects .repo-filter-btn[data-repo-filter]').forEach(function(button){
      const token = button.dataset.repoFilter;
      if(!token) return;

      const icon = iconFor(token);
      const label = labelFor(token, lang);
      const html = icon
        ? '<span class="filter-icon">' + icon + '</span>' + label
        : label;

      if(button.innerHTML !== html){
        button.innerHTML = html;
      }

      button.dataset.labelToken = token;
      button.dataset.labelLang = lang;
    });
  }

  function renderMiniTags(lang){
    document.querySelectorAll('#projects .github-project-card[data-tags]').forEach(function(card){
      const tokens = (card.dataset.tags || '').trim().split(/\s+/).filter(Boolean);
      const holder = card.querySelector('.mini-tags');

      if(!holder) return;

      const existing = Array.from(holder.querySelectorAll('span'));

      tokens.forEach(function(token, index){
        let span = existing[index];

        if(!span){
          span = document.createElement('span');
          holder.appendChild(span);
        }

        const label = labelFor(token, lang);

        if(span.textContent.trim() !== label){
          span.textContent = label;
        }

        span.dataset.tagToken = token;
        span.dataset.labelLang = lang;
      });

      existing.slice(tokens.length).forEach(function(extra){
        extra.remove();
      });

      holder.dataset.labelLang = lang;
    });
  }

  function removeInjectedProjectTags(){
    document.querySelectorAll('#projects .github-project-card .project-tags').forEach(function(holder){
      holder.remove();
    });
  }

  function audit(lang){
    const problems = [];
    const filters = {};

    document.querySelectorAll('#projects .repo-filter-btn[data-repo-filter]').forEach(function(button){
      const token = button.dataset.repoFilter;
      const expected = labelFor(token, lang);
      const actual = stripIcon(button.textContent);

      filters[token] = actual;

      if(actual !== expected){
        problems.push({
          type: 'filter-label-mismatch',
          token: token,
          expected: expected,
          actual: actual
        });
      }
    });

    document.querySelectorAll('#projects .github-project-card[data-tags]').forEach(function(card, cardIndex){
      const tokens = (card.dataset.tags || '').trim().split(/\s+/).filter(Boolean);
      const spans = Array.from(card.querySelectorAll('.mini-tags span'));

      if(tokens.length !== spans.length){
        problems.push({
          type: 'mini-tag-count-mismatch',
          card: cardIndex + 1,
          expected: tokens.length,
          actual: spans.length
        });
      }

      tokens.forEach(function(token, index){
        const expected = labelFor(token, lang);
        const actual = spans[index] ? spans[index].textContent.trim() : '';
        const filter = filters[token];

        if(actual !== expected){
          problems.push({
            type: 'mini-tag-label-mismatch',
            card: cardIndex + 1,
            token: token,
            expected: expected,
            actual: actual
          });
        }

        if(filter && filter !== actual){
          problems.push({
            type: 'filter-mini-tag-different',
            card: cardIndex + 1,
            token: token,
            filter: filter,
            miniTag: actual
          });
        }
      });
    });

    window.plMiniTagsFiltersAudit = {
      language: lang,
      ok: problems.length === 0,
      problems: problems
    };

    return window.plMiniTagsFiltersAudit;
  }

  function sync(lang){
    const language = ['es','en','it'].includes(lang) ? lang : getLang();

    removeInjectedProjectTags();
    renderFilters(language);
    renderMiniTags(language);

    if(window.plApplyRepoFilter && window.plGetActiveRepoFilter){
      window.plApplyRepoFilter(window.plGetActiveRepoFilter());
    }

    renderFilters(language);
    renderMiniTags(language);
    removeInjectedProjectTags();

    audit(language);
  }

  function syncSoon(lang){
    const language = ['es','en','it'].includes(lang) ? lang : getLang();

    sync(language);

    window.requestAnimationFrame(function(){
      sync(language);
    });

    setTimeout(function(){
      sync(language);
    }, 0);
  }

  document.addEventListener('pl-language-changed', function(event){
    const lang = event.detail && event.detail.language ? event.detail.language : getLang();
    syncSoon(lang);
  });

  document.addEventListener('click', function(event){
    if(event.target.closest && (
      event.target.closest('.language-option') ||
      event.target.closest('.repo-filter-btn[data-repo-filter]')
    )){
      syncSoon(getLang());
    }
  }, true);

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){
      syncSoon(getLang());
    }, {once:true});
  }else{
    syncSoon(getLang());
  }

  window.plSyncMiniTagsAndFilters = syncSoon;
  window.plAuditMiniTagsAndFilters = audit;
  window.plProjectLabelSource = FINAL_PROJECT_LABELS;
})();


(function(){
  function currentLang(){
    if(window.plGetLanguage){
      return window.plGetLanguage();
    }

    try{
      return localStorage.getItem('patronesLabLanguage') || 'es';
    }catch(e){
      return document.documentElement.lang || 'es';
    }
  }

  function rerender(){
    if(window.plSyncMiniTagsAndFilters){
      window.plSyncMiniTagsAndFilters(currentLang());
    }
  }

  document.addEventListener('pl-language-changed', function(){
    window.requestAnimationFrame(rerender);
    setTimeout(rerender, 0);
  });

  document.addEventListener('click', function(event){
    if(event.target.closest && event.target.closest('.repo-filter-btn[data-repo-filter]')){
      window.requestAnimationFrame(rerender);
      setTimeout(rerender, 0);
    }
  }, true);

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', rerender, {once:true});
  }else{
    rerender();
  }
})();


(function(){
  const footerTexts = {
    es: "Patrones Lab® · Generando conocimiento a partir de los datos · por Malcolm Di Pietro Cagliari",
    en: "Patrones Lab® · Generating knowledge from data · by Malcolm Di Pietro Cagliari",
    it: "Patrones Lab® · Generando conoscenza a partire dai dati · di Malcolm Di Pietro Cagliari"
  };

  function currentLang(){
    if(window.plGetLanguage){
      const lang = window.plGetLanguage();
      if(footerTexts[lang]) return lang;
    }

    try{
      const stored = localStorage.getItem('patronesLabLanguage');
      if(footerTexts[stored]) return stored;
    }catch(e){}

    const htmlLang = document.documentElement.lang;
    return footerTexts[htmlLang] ? htmlLang : 'es';
  }

  function applyFooterText(lang){
    const language = footerTexts[lang] ? lang : currentLang();
    const footer = document.querySelector('footer.footer');
    const text = document.querySelector('footer.footer .copyright-text');

    if(!footer || !text) return;

    footer.querySelectorAll('.pl-footer-author-note').forEach(function(note){
      note.remove();
    });

    text.textContent = footerTexts[language];
    text.setAttribute('data-footer-lang', language);
  }

  document.addEventListener('pl-language-changed', function(event){
    const lang = event.detail && event.detail.language ? event.detail.language : currentLang();
    applyFooterText(lang);
  });

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){
      applyFooterText(currentLang());
    }, {once:true});
  }else{
    applyFooterText(currentLang());
  }

  window.plApplyFooterText = applyFooterText;
})();


(function(){
  const methodologyTexts = {
  "es": {
    "title": "Ciclo de vida del dato",
    "steps": [
      [
        "Descubrimiento",
        "Contexto y objetivo"
      ],
      [
        "Fuentes",
        "Datos y diagnóstico"
      ],
      [
        "Preparación",
        "Base analítica"
      ],
      [
        "Modelado",
        "Patrones y señales"
      ],
      [
        "Validación",
        "Control y confianza"
      ],
      [
        "Publicación",
        "Entrega y aprendizaje"
      ]
    ]
  },
  "en": {
    "title": "Data lifecycle",
    "steps": [
      [
        "Discovery",
        "Context and objective"
      ],
      [
        "Sources",
        "Data and diagnosis"
      ],
      [
        "Preparation",
        "Analytical base"
      ],
      [
        "Modeling",
        "Patterns and signals"
      ],
      [
        "Validation",
        "Control and confidence"
      ],
      [
        "Publication",
        "Delivery and learning"
      ]
    ]
  },
  "it": {
    "title": "Ciclo di vita dei dati",
    "steps": [
      [
        "Esplorazione",
        "Contesto e obiettivo"
      ],
      [
        "Fonti dati",
        "Dati e diagnosi"
      ],
      [
        "Preparazione",
        "Base analitica"
      ],
      [
        "Modellazione",
        "Pattern e segnali"
      ],
      [
        "Validazione",
        "Controllo e affidabilità"
      ],
      [
        "Pubblicazione",
        "Consegna e apprendimento"
      ]
    ]
  }
};

  function currentLang(){
    if(window.plGetLanguage){
      const lang = window.plGetLanguage();
      if(methodologyTexts[lang]) return lang;
    }

    try{
      const stored = localStorage.getItem('patronesLabLanguage');
      if(methodologyTexts[stored]) return stored;
    }catch(e){}

    const htmlLang = document.documentElement.lang;
    return methodologyTexts[htmlLang] ? htmlLang : 'es';
  }

  function setText(selector, value){
    const el = document.querySelector(selector);
    if(el && el.textContent !== value){
      el.textContent = value;
    }
  }

  function applyMethodologyTexts(lang){
    const language = methodologyTexts[lang] ? lang : currentLang();
    const pack = methodologyTexts[language];

    setText('#methodology .process-horizontal-static-head h2', pack.title);

    pack.steps.forEach(function(step, index){
      const n = index + 1;
      setText('#methodology .process-horizontal-panel:nth-child(' + n + ') h3', step[0]);
      setText('#methodology .process-horizontal-panel:nth-child(' + n + ') small', step[1]);
    });
  }

  document.addEventListener('pl-language-changed', function(event){
    const lang = event.detail && event.detail.language ? event.detail.language : currentLang();
    applyMethodologyTexts(lang);
    window.requestAnimationFrame(function(){ applyMethodologyTexts(lang); });
    setTimeout(function(){ applyMethodologyTexts(lang); }, 0);
  });

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){
      applyMethodologyTexts(currentLang());
    }, {once:true});
  }else{
    applyMethodologyTexts(currentLang());
  }

  window.plApplyMethodologyTranslations = applyMethodologyTexts;
})();

(function(){
  const texts = {
    es: "Análisis de viajes de taxi en Chicago con foco en ubicación geográfica, movimientos entre puntos, predominios de zonas y rutas.",
    en: "Geospatial analysis of Chicago taxi trips, focused on location, point-to-point movements, dominant zones, and routes.",
    it: "Analisi geospaziale dei viaggi in taxi a Chicago, con focus sulla posizione geografica, sugli spostamenti tra punti, sulle zone prevalenti e sui percorsi."
  };

  function getLanguage(){
    if(window.plGetLanguage){
      const lang = window.plGetLanguage();
      if(texts[lang]) return lang;
    }
    try{
      const stored = localStorage.getItem('patronesLabLanguage');
      if(texts[stored]) return stored;
    }catch(e){}
    const htmlLang = document.documentElement.lang;
    return texts[htmlLang] ? htmlLang : 'es';
  }

  function applyProject12Text(lang){
    const language = texts[lang] ? lang : getLanguage();
    const card = document.querySelectorAll('#projects .github-project-card')[11];
    if(!card) return;

    const description = Array.from(card.querySelectorAll('.github-project-body p')).find(function(p){
      return !p.classList.contains('project-status');
    });
    if(description) description.textContent = texts[language];

    const projectLink = Array.from(card.querySelectorAll('a.project-link')).find(function(a){
      return a.textContent.indexOf('Entrar al proyecto') !== -1 ||
             a.textContent.indexOf('Open project') !== -1 ||
             a.textContent.indexOf('Apri il progetto') !== -1;
    });
    if(projectLink) projectLink.setAttribute('href', "https://github.com/malcolmdpc/patrones-lab/tree/main/2026-03_taxi-trip-chicago");

    const linkedinLink = Array.from(card.querySelectorAll('a.project-link')).find(function(a){
      return a.textContent.indexOf('LinkedIn') !== -1;
    });
    if(linkedinLink){
      linkedinLink.setAttribute('href', "https://www.linkedin.com/pulse/taxi-trips-chicago-an%C3%A1lisis-geoespacial-qu%C3%A9-muestran-malcolm-cjjae");
      linkedinLink.setAttribute('target', '_blank');
      linkedinLink.setAttribute('rel', 'noopener');
      linkedinLink.removeAttribute('aria-disabled');
      linkedinLink.removeAttribute('role');
      linkedinLink.classList.remove('linkedin-placeholder-link');
    }
  }

  document.addEventListener('pl-language-changed', function(event){
    const lang = event.detail && event.detail.language ? event.detail.language : getLanguage();
    applyProject12Text(lang);
    window.requestAnimationFrame(function(){ applyProject12Text(lang); });
    setTimeout(function(){ applyProject12Text(lang); }, 0);
  });

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){
      applyProject12Text(getLanguage());
    }, {once:true});
  }else{
    applyProject12Text(getLanguage());
  }

  window.plApplyProject12Translations = applyProject12Text;
})();
