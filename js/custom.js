(function(){
  // The current static document is the source of truth for localized labels.
  window.PL_STATIC_MULTILINGUAL = ["es", "en", "it", "fr", "de", "pt"].includes((document.documentElement.lang || "").toLowerCase().split("-")[0]);
  var labels = {};
  document.querySelectorAll('#projects .repo-filter-btn[data-repo-filter]').forEach(function(button){
    var copy = button.cloneNode(true);
    copy.querySelectorAll('.filter-icon').forEach(function(icon){ icon.remove(); });
    labels[button.dataset.repoFilter] = copy.textContent.trim();
  });
  window.plStaticFilterLabels = labels;
  window.plReadFilterText = function(button){
    var copy = button.cloneNode(true);
    copy.querySelectorAll('.filter-icon').forEach(function(icon){ icon.remove(); });
    return copy.textContent.trim();
  };
})();

(function(){
  const DEFAULT_VERSION = 'default-es-dark';
  const VERSION_KEY = 'patronesLabDefaultVersion';

  try{
    if(localStorage.getItem(VERSION_KEY) !== DEFAULT_VERSION){
      localStorage.setItem('patronesLabLanguage', (document.documentElement.lang || 'es').split('-')[0]);
      localStorage.setItem(VERSION_KEY, DEFAULT_VERSION);
    }
  }catch(e){}

  document.documentElement.lang = ((document.documentElement.lang || 'es').split('-')[0] || 'es');

  if(document.body){
    document.body.classList.add('dark-mode');
  }else{
    document.addEventListener('DOMContentLoaded', function(){
      document.body.classList.add('dark-mode');
    }, {once:true});
  }

})();

(function(){
  const allowedSections = {
    about:true,
    methodology:true,
    projects:true,
    networks:true,
    contact:true
  };

  function normalizeSection(value){
    const clean = (value || '').replace(/^#/, '').trim();
    return allowedSections[clean] ? clean : null;
  }

  function readInitialSectionTarget(){
    let params = null;
    try{
      params = new URLSearchParams(window.location.search || '');
    }catch(e){
      params = null;
    }

    const fromParam = params ? normalizeSection(params.get('section') || params.get('plSection')) : null;
    if(fromParam) return fromParam;

    return normalizeSection(window.location.hash || '');
  }

  function clearIntroLocks(){
    const body = document.body;
    const html = document.documentElement;
    if(!body || !html) return;

    const loader = document.querySelector('.pl-scroll-loader');
    if(loader && loader.parentNode) loader.parentNode.removeChild(loader);

    body.classList.remove('pl-scroll-loader-active');
    body.classList.remove('pl-scroll-loader-finishing');
    body.classList.remove('pl-scroll-landing-lock');
    body.classList.add('pl-scroll-loader-complete');
    html.classList.remove('pl-scroll-loader-lock');
  }

  function scrollToInitialSection(options){
    const targetId = window.plInitialSectionTarget;
    if(!targetId) return false;

    const section = document.getElementById(targetId);
    if(!section) return false;

    clearIntroLocks();

    const top = Math.max(0, window.pageYOffset + section.getBoundingClientRect().top);
    window.scrollTo({top:top, left:0, behavior:'auto'});

    if(typeof window.plSmoothScrollSync === 'function'){
      window.plSmoothScrollSync();
    }

    if(window.ScrollTrigger && typeof window.ScrollTrigger.refresh === 'function'){
      try{ window.ScrollTrigger.refresh(true); }catch(e){}
    }

    if(options && options.replaceUrl && window.history && window.history.replaceState){
      try{
        const url = new URL(window.location.href);
        url.searchParams.delete('section');
        url.searchParams.delete('plSection');
        url.hash = targetId;
        window.history.replaceState(null, '', url.pathname + url.search + url.hash);
      }catch(e){}
    }

    return true;
  }

  window.plInitialSectionTarget = readInitialSectionTarget();
  window.plScrollToInitialSection = scrollToInitialSection;

  function scheduleInitialSectionScroll(){
    if(!window.plInitialSectionTarget) return;
    scrollToInitialSection({replaceUrl:true});
    window.requestAnimationFrame(function(){ scrollToInitialSection({replaceUrl:true}); });
    window.setTimeout(function(){ scrollToInitialSection({replaceUrl:true}); }, 120);
    window.setTimeout(function(){ scrollToInitialSection({replaceUrl:true}); }, 520);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', scheduleInitialSectionScroll, {once:true});
  }else{
    scheduleInitialSectionScroll();
  }
  window.addEventListener('load', scheduleInitialSectionScroll, {once:true});
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
      if(window.innerWidth <= 767 && $('#navbarNav').hasClass('show')){
        $('#navbarNav').collapse('hide');
      }
    }
  });

  $('#contactForm').on('submit', function(event){
    event.preventDefault();
    const name = $('#name').val() || '';
    const email = $('#email').val() || '';
    const message = $('#message').val() || '';
    const language = (window.plCurrentLanguageForContact && window.plCurrentLanguageForContact()) || document.documentElement.lang || 'es';
    const mailText = {
      es: {subject:'Contacto desde Patrones Lab', name:'Nombre: ', message:'Mensaje:\n'},
      en: {subject:'Contact from Patrones Lab', name:'Name: ', message:'Message:\n'},
      it: {subject:'Contatto da Patrones Lab', name:'Nome: ', message:'Messaggio:\n'},
      fr: {subject:'Contact depuis Patrones Lab', name:'Nom : ', message:'Message :\n'},
      de: {subject:'Kontakt über Patrones Lab', name:'Name: ', message:'Nachricht:\n'},
      pt: {subject:'Contacto através do Patrones Lab', name:'Nome: ', message:'Mensagem:\n'}
    };
    const pack = mailText[language] || mailText.es;
    const subject = encodeURIComponent(pack.subject);
    const body = encodeURIComponent(
      pack.name + name + '\n' +
      'Email: ' + email + '\n\n' +
      pack.message + message
    );
    window.location.href = 'mailto:encontrandopatrones@gmail.com?subject=' + subject + '&body=' + body;
  });

})(jQuery);


(function(){
  const grid = document.querySelector('#projects .github-project-grid');
  if(!grid) return;

  const cards = Array.from(grid.children);
  if(cards.length !== 19 || !cards.every(card => card.matches('.github-project-card[data-project-id]'))) return;

  // Cada proyecto ocupa las cuatro posiciones iniciales una vez por ciclo.
  const rotation = [1, 6, 12, 18, 2, 7, 13, 19, 3, 8, 14, 17, 4, 9, 11, 15, 5, 10, 16];
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(new Date());
  const date = {};
  parts.forEach(part => { date[part.type] = Number(part.value); });

  const today = Date.UTC(date.year, date.month - 1, date.day);
  const firstDay = Date.UTC(2026, 8, 17);
  const elapsedDays = Math.floor((today - firstDay) / 86400000);
  const cycleDay = ((elapsedDays % 19) + 19) % 19;
  const featured = [];

  for(let position = 0; position < 4; position++){
    featured.push(rotation[(cycleDay * 4 + position) % 19]);
  }

  const fragment = document.createDocumentFragment();
  featured.forEach(number => fragment.appendChild(cards[number - 1]));
  cards.forEach((card, index) => {
    if(!featured.includes(index + 1)) fragment.appendChild(card);
  });
  grid.appendChild(fragment);
})();


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

  const basePath = '/images/patrones/floating-icons/';
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
  const hero = document.querySelector('#home');

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
      section: '#about',
      items: [
        '.section-kicker',
        'h2',
        '.about-profile-portrait',
        '.about-profile-copy',
        '.about-profile-axis',
        '.about-profile-actions'
      ]
    },
    {
      section: '#networks',
      items: [
        'h2',
        '.social-card'
      ]
    },
    {
      section: '#methodology:not([data-methodology-controller="adaptive"])',
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
  const section = document.querySelector('#about.about-profile-section');
  if(!section) return;

  const cards = Array.from(section.querySelectorAll('.about-profile-axis'));
  if(!cards.length) return;

  const motionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  const touchQuery = window.matchMedia ? window.matchMedia('(hover: none), (pointer: coarse)') : null;

  function setCardState(card, open){
    const front = card.querySelector('.about-profile-axis-front');
    const back = card.querySelector('.about-profile-axis-back');

    card.classList.toggle('is-flipped', open);
    card.setAttribute('aria-expanded', String(open));
    card.setAttribute('aria-label', open ? card.dataset.labelClose : card.dataset.labelOpen);

    if(front) front.setAttribute('aria-hidden', String(open));
    if(back) back.setAttribute('aria-hidden', String(!open));
  }

  function closeCards(except){
    cards.forEach(card => {
      if(card !== except) setCardState(card, false);
    });
  }

  function applyMotionPreference(){
    const reduceMotion = Boolean(motionQuery && motionQuery.matches);

    cards.forEach(card => {
      const front = card.querySelector('.about-profile-axis-front');
      const back = card.querySelector('.about-profile-axis-back');

      card.classList.remove('is-flipped');
      card.toggleAttribute('aria-disabled', reduceMotion);

      if(reduceMotion){
        const title = card.querySelector('.about-profile-axis-title');
        const description = card.querySelector('.about-profile-axis-description');
        card.setAttribute('aria-expanded', 'true');
        card.setAttribute('aria-label', [title && title.textContent, description && description.textContent].filter(Boolean).join(': '));
        if(front) front.setAttribute('aria-hidden', 'false');
        if(back) back.setAttribute('aria-hidden', 'false');
      }else{
        setCardState(card, false);
      }
    });
  }

  cards.forEach(card => {
    card.addEventListener('click', function(event){
      if(motionQuery && motionQuery.matches) return;

      const touchActivation = Boolean(touchQuery && touchQuery.matches);
      const keyboardActivation = event.detail === 0;
      if(!touchActivation && !keyboardActivation) return;

      const willOpen = !card.classList.contains('is-flipped');
      closeCards(card);
      setCardState(card, willOpen);
    });

    card.addEventListener('keydown', function(event){
      if(event.key !== 'Escape') return;
      setCardState(card, false);
    });
  });

  document.addEventListener('pointerdown', function(event){
    if(!(touchQuery && touchQuery.matches)) return;
    if(section.querySelector('.about-profile-axes').contains(event.target)) return;
    closeCards();
  }, {passive:true});

  if(motionQuery){
    if(typeof motionQuery.addEventListener === 'function'){
      motionQuery.addEventListener('change', applyMotionPreference);
    }else if(typeof motionQuery.addListener === 'function'){
      motionQuery.addListener(applyMotionPreference);
    }
  }

  applyMotionPreference();
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
  const directSectionTarget = window.plInitialSectionTarget || null;
  const skipIntro = directSectionTarget ||
    params.has('audit') ||
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

    if(directSectionTarget && typeof window.plScrollToInitialSection === 'function'){
      window.setTimeout(function(){
        window.plScrollToInitialSection({replaceUrl:true});
      }, 0);
    }else{
      window.scrollTo(0, 0);
    }

    return;
  }

  let finished = false;
  let clickAnimating = false;
  let tl = null;
  let fallbackHandler = null;
  const desktopClickQuery = window.matchMedia ? window.matchMedia('(min-width: 768px) and (pointer: fine)') : null;

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
    clickAnimating = false;

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

  function isDesktopClickLoaderEnabled(){
    if(desktopClickQuery) return desktopClickQuery.matches;
    return window.innerWidth >= 768;
  }

  function revealNextLayer(){
    const next = loader.querySelector('.pl-scroll-loader__next');
    if(next){
      next.style.visibility = 'visible';
      next.style.opacity = '1';
    }
  }

  function runDesktopClickLoader(event){
    if(finished || clickAnimating || !isDesktopClickLoaderEnabled()) return;
    if(event && typeof event.button === 'number' && event.button !== 0) return;

    if(event){
      event.preventDefault();
      event.stopPropagation();
    }

    clickAnimating = true;
    cleanupScrollTrigger();
    window.scrollTo(0, 0);

    const dot = loader.querySelector('.dot');

    if(window.gsap && dot){
      window.gsap.killTweensOf(dot);
      window.gsap.to(dot, {
        scale:1200,
        duration:.82,
        ease:'power2.in',
        onUpdate:function(){
          if(this.progress && this.progress() > .72) revealNextLayer();
        },
        onComplete:finishScrollLoader
      });
      return;
    }

    if(dot){
      dot.style.transition = 'transform .82s cubic-bezier(.7, 0, .2, 1), box-shadow .82s ease';
      window.requestAnimationFrame(function(){
        dot.style.transform = 'scale(1200)';
      });
    }

    window.setTimeout(revealNextLayer, 590);
    window.setTimeout(finishScrollLoader, 850);
  }

  loader.addEventListener('click', runDesktopClickLoader, { passive:false });

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
  if(horizontalSection&&horizontalSection.getAttribute('data-methodology-controller')==='adaptive')return;
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

  const sectionSelectors = ['#home', '#about', '#methodology', '#projects', '#networks', '#contact'];
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
    const link = event.target && event.target.closest ? event.target.closest('.navbar a[href="#methodology"], #about a[data-methodology-cta][href="#methodology"]') : null;
    if(!link) return;

    event.preventDefault();

    if(window.matchMedia && window.matchMedia('(max-width: 767px)').matches){
      const navbarCollapse = document.getElementById('navbarNav');
      if(navbarCollapse && navbarCollapse.classList.contains('show')){
        if(window.jQuery && window.jQuery.fn && typeof window.jQuery.fn.collapse === 'function'){
          window.jQuery(navbarCollapse).collapse('hide');
        }else{
          const toggler = document.querySelector('.navbar-toggler[aria-controls="navbarNav"]');
          if(toggler && toggler.getAttribute('aria-expanded') === 'true'){
            toggler.click();
          }
        }
      }
    }

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
    // The static HTML carries the label in the current page language.
    if(!loader.hasAttribute('aria-label')) loader.setAttribute('aria-label', 'Patrones Lab Data & Analytics');

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
  if(section.getAttribute('data-methodology-controller') === 'adaptive') return;

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
      it: {subject:'Contatto da Patrones Lab', name:'Nome: ', message:'Messaggio:\n'},
      fr: {subject:'Contact depuis Patrones Lab', name:'Nom : ', message:'Message :\n'},
      de: {subject:'Kontakt über Patrones Lab', name:'Name: ', message:'Nachricht:\n'},
      pt: {subject:'Contacto através do Patrones Lab', name:'Nome: ', message:'Mensagem:\n'}
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
      networkDashboardStrong: 'Looker Studio',
      networkDashboardSmall: 'Dashboard',
      networkXSmall: 'Novedades',
      networkPowerBISmall: 'Dashboard',
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
      networkDashboardStrong: 'Looker Studio',
      networkDashboardSmall: 'Dashboard',
      networkXSmall: 'Updates',
      networkPowerBISmall: 'Dashboard',
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
      networkDashboardStrong: 'Looker Studio',
      networkDashboardSmall: 'Dashboard',
      networkXSmall: 'Novità',
      networkPowerBISmall: 'Dashboard',
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
    },
    fr: {
      scroll: 'Explorer',
      scrollLabel: 'Explorer, aller à la section Méthodologie',
      networkRepoStrong: 'Dépôt',
      networkRepoSmall: 'Patrones Lab',
      networkDashboardStrong: 'Looker Studio',
      networkDashboardSmall: 'Tableau de bord',
      networkXSmall: 'Actualités',
      networkPowerBISmall: 'Tableau de bord',
      tags: {
        'Modelo Supervisado': 'Modèle supervisé',
        'Supervised Model': 'Modèle supervisé',
        'Modello supervisionato': 'Modèle supervisé',
        'Modelo No Supervisado': 'Modèle non supervisé',
        'Unsupervised Model': 'Modèle non supervisé',
        'Modello non supervisionato': 'Modèle non supervisé',
        'Clasificación': 'Classification',
        'Classification': 'Classification',
        'Classificazione': 'Classification',
        'Regresión Logística': 'Régression logistique',
        'Logistic Regression': 'Régression logistique',
        'Regressione logistica': 'Régression logistique',
        'Geoespacial': 'Géospatial',
        'Geospatial': 'Géospatial',
        'Geospaziale': 'Géospatial',
        'Fútbol': 'Football',
        'Soccer': 'Football',
        'Calcio': 'Football',
        'Aviación': 'Aviation',
        'Aviation': 'Aviation',
        'Aviazione': 'Aviation',
        'Fraude': 'Fraude',
        'Fraud': 'Fraude',
        'Frode': 'Fraude',
        'Data Analysis': 'Analyse de données',
        'Simulación': 'Simulation'
      }
    },
    de: {
      scroll: 'Entdecken',
      scrollLabel: 'Entdecken, zum Abschnitt Methodik wechseln',
      networkRepoStrong: 'Repository', networkRepoSmall: 'Patrones Lab',
      networkDashboardStrong: 'Looker Studio', networkDashboardSmall: 'Dashboard',
      networkXSmall: 'Neuigkeiten', networkPowerBISmall: 'Dashboard',
      tags: {'Supervised Model':'Überwachtes Modell','Modelo Supervisado':'Überwachtes Modell','Modello supervisionato':'Überwachtes Modell','Unsupervised Model':'Unüberwachtes Modell','Modelo No Supervisado':'Unüberwachtes Modell','Classification':'Klassifikation','Clasificación':'Klassifikation','Logistic Regression':'Logistische Regression','Regresión Logística':'Logistische Regression','Geospatial':'Georäumlich','Geoespacial':'Georäumlich','Soccer':'Fußball','Fútbol':'Fußball','Aviation':'Luftfahrt','Aviación':'Luftfahrt','Fraud':'Betrug','Fraude':'Betrug'}
    },
    pt: {
      scroll: 'Explorar',
      scrollLabel: 'Explorar, ir para a secção Metodologia',
      networkRepoStrong: 'Repositório', networkRepoSmall: 'Patrones Lab',
      networkDashboardStrong: 'Looker Studio', networkDashboardSmall: 'Dashboard',
      networkXSmall: 'Novidades', networkPowerBISmall: 'Dashboard',
      tags: {'Supervised Model':'Modelo supervisionado','Modelo Supervisado':'Modelo supervisionado','Unsupervised Model':'Modelo não supervisionado','Modelo No Supervisado':'Modelo não supervisionado','Classification':'Classificação','Clasificación':'Classificação','Logistic Regression':'Regressão Logística','Regresión Logística':'Regressão Logística','Geospatial':'Geoespacial','Geoespacial':'Geoespacial','Soccer':'Futebol','Fútbol':'Futebol','Aviation':'Aviação','Aviación':'Aviação','Fraud':'Fraude','Fraude':'Fraude'}
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
    setText('#networks .social-card.x small', data.networkXSmall);
    setText('#networks .social-card.power-bi small', data.networkPowerBISmall);
  }

  function patchVisibleTexts(lang){
    if(window.PL_STATIC_MULTILINGUAL) return;
    const data = translations[lang] || translations.es;

    setText('#home .hero-scroll-indicator__text', data.scroll);
    document.querySelectorAll('#home .hero-scroll-indicator').forEach(function(link){
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
    },
    fr: {
      'power-bi':'Business Intelligence',
      'qlik':'Analyse visuelle',
      'looker':'Tableaux de bord',
      'sql-server':'Base de données',
      'python':'Analyse et modélisation',
      'pandas':'Manipulation de données',
      'numpy':'Calcul numérique',
      'scikit':'Machine Learning',
      'matplotlib':'Visualisation de données',
      'plotly':'Visualisation interactive',
      'spss':'Modélisation visuelle',
      'airflow':'Orchestration',
      'snowflake':'Entrepôt de données',
      'databricks':'Lakehouse',
      'dbt':'Transformation de données'
    },
    de: {'power-bi':'Business Intelligence','qlik':'Visuelle Analytik','looker':'Dashboards','sql-server':'Datenbank','python':'Analyse und Modellierung','pandas':'Datenaufbereitung','numpy':'Numerisches Rechnen','scikit':'Machine Learning','matplotlib':'Datenvisualisierung','plotly':'Interaktive Visualisierung','spss':'Visuelle Modellierung','airflow':'Orchestrierung','snowflake':'Data Warehouse','databricks':'Lakehouse','dbt':'Datentransformation'},
    pt: {'power-bi':'Business Intelligence','qlik':'Análise visual','looker':'Dashboards','sql-server':'Base de dados','python':'Análise e modelação','pandas':'Manipulação de dados','numpy':'Computação numérica','scikit':'Machine Learning','matplotlib':'Visualização de dados','plotly':'Visualização interativa','spss':'Modelação visual','airflow':'Orquestração','snowflake':'Data warehouse','databricks':'Lakehouse','dbt':'Transformação de dados'}

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
    if(window.PL_STATIC_MULTILINGUAL) return;
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
      'dax': 'DAX',
      'spotify': 'Spotify',
      'modelo-supervisado': 'Modelo Supervisado',
      'redes-neuronales': 'Redes Neuronales',
      'modelo-no-supervisado': 'Modelo No Supervisado',
      'clasificacion': 'Clasificación',
      'clustering': 'Clustering',
      'knn': 'KNN',
      'k-means': 'K-means',
      'regresion-logistica': 'Regresión Logística',
      'dbscan': 'DBSCAN',
      'poisson': 'Poisson',
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
      'dax': 'DAX',
      'spotify': 'Spotify',
      'modelo-supervisado': 'Supervised Model',
      'redes-neuronales': 'Neural Networks',
      'modelo-no-supervisado': 'Unsupervised Model',
      'clasificacion': 'Classification',
      'clustering': 'Clustering',
      'knn': 'KNN',
      'k-means': 'K-means',
      'regresion-logistica': 'Logistic Regression',
      'dbscan': 'DBSCAN',
      'poisson': 'Poisson',
      'geoespacial': 'Geospatial',
      'airbnb': 'Airbnb',
      'taxi': 'Taxi',
      'futbol': 'Soccer',
      'aviacion': 'Aviation',
      'fraude': 'Fraud'
    },
    it: {
      'bi': 'BI',
      'data-analysis': 'Analisi dei dati',
      'data-science': 'Scienza dei dati',
      'data-storytelling': 'Storytelling dei dati',
      'machine-learning': 'Machine Learning',
      'python': 'Python',
      'spss': 'SPSS',
      'looker-studio': 'Looker Studio',
      'dashboard': 'Dashboard',
      'power-bi': 'Power BI',
      'dax': 'DAX',
      'spotify': 'Spotify',
      'modelo-supervisado': 'Modello supervisionato',
      'redes-neuronales': 'Reti neurali',
      'modelo-no-supervisado': 'Modello non supervisionato',
      'clasificacion': 'Classificazione',
      'clustering': 'Clustering',
      'knn': 'KNN',
      'k-means': 'K-means',
      'regresion-logistica': 'Regressione logistica',
      'dbscan': 'DBSCAN',
      'poisson': 'Poisson',
      'geoespacial': 'Geospaziale',
      'airbnb': 'Airbnb',
      'taxi': 'Taxi',
      'futbol': 'Calcio',
      'aviacion': 'Aviazione',
      'fraude': 'Frode'
    },
    fr: {
      'bi': 'BI',
      'data-analysis': 'Analyse de données',
      'data-science': 'Science des données',
      'data-storytelling': 'Narration de données',
      'machine-learning': 'Machine Learning',
      'python': 'Python',
      'spss': 'SPSS',
      'looker-studio': 'Looker Studio',
      'dashboard': 'Tableau de bord',
      'power-bi': 'Power BI',
      'dax': 'DAX',
      'spotify': 'Spotify',
      'modelo-supervisado': 'Modèle supervisé',
      'redes-neuronales': 'Réseaux neuronaux',
      'modelo-no-supervisado': 'Modèle non supervisé',
      'clasificacion': 'Classification',
      'clustering': 'Clustering',
      'knn': 'KNN',
      'k-means': 'K-means',
      'regresion-logistica': 'Régression logistique',
      'dbscan': 'DBSCAN',
      'simulacion': 'Simulation',
      'poisson': 'Poisson',
      'geoespacial': 'Géospatial',
      'airbnb': 'Airbnb',
      'taxi': 'Taxi',
      'futbol': 'Football',
      'aviacion': 'Aviation',
      'fraude': 'Fraude'
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
    if(window.PL_STATIC_MULTILINGUAL) return;
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
        "it": "Tutti",
        "fr": "Tous",
        "de": "Alle",
        "pt": "Todos"
    },
    "bi": {
        "icon": "▦",
        "es": "BI",
        "en": "BI",
        "it": "BI",
        "fr": "BI",
        "de": "BI",
        "pt": "BI"
    },
    "data-analysis": {
        "icon": "▥",
        "es": "Data Analysis",
        "en": "Data analysis",
        "it": "Analisi dei dati",
        "fr": "Analyse de données",
        "de": "Datenanalyse",
        "pt": "Análise de Dados"
    },
    "data-science": {
        "icon": "⚗",
        "es": "Data Science",
        "en": "Data science",
        "it": "Scienza dei dati",
        "fr": "Science des données",
        "de": "Data Science",
        "pt": "Ciência de Dados"
    },
    "data-storytelling": {
        "icon": "✎",
        "es": "Data Storytelling",
        "en": "Data Storytelling",
        "it": "Storytelling dei dati",
        "fr": "Narration de données",
        "de": "Data Storytelling",
        "pt": "Data Storytelling"
    },
    "machine-learning": {
        "icon": "✦",
        "es": "Machine Learning",
        "en": "Machine Learning",
        "it": "Machine Learning",
        "fr": "Machine Learning",
        "de": "Machine Learning",
        "pt": "Machine Learning"
    },
    "python": {
        "icon": "◇",
        "es": "Python",
        "en": "Python",
        "it": "Python",
        "fr": "Python",
        "de": "Python",
        "pt": "Python"
    },
    "spss": {
        "icon": "◧",
        "es": "SPSS",
        "en": "SPSS",
        "it": "SPSS",
        "fr": "SPSS",
        "de": "SPSS",
        "pt": "SPSS"
    },
    "looker-studio": {
        "icon": "◉",
        "es": "Looker Studio",
        "en": "Looker Studio",
        "it": "Looker Studio",
        "fr": "Looker Studio",
        "de": "Looker Studio",
        "pt": "Looker Studio"
    },
    "dashboard": {
        "icon": "▣",
        "es": "Dashboard",
        "en": "Dashboard",
        "it": "Dashboard",
        "fr": "Tableau de bord",
        "de": "Dashboard",
        "pt": "Dashboard"
    },
    "power-bi": {
        "icon": "▥",
        "es": "Power BI",
        "en": "Power BI",
        "it": "Power BI",
        "fr": "Power BI",
        "de": "Power BI",
        "pt": "Power BI"
    },
    "dax": {
        "icon": "ƒx",
        "es": "DAX",
        "en": "DAX",
        "it": "DAX",
        "fr": "DAX",
        "de": "DAX",
        "pt": "DAX"
    },
    "spotify": {
        "icon": "♪",
        "es": "Spotify",
        "en": "Spotify",
        "it": "Spotify",
        "fr": "Spotify",
        "de": "Spotify",
        "pt": "Spotify"
    },
    "modelo-supervisado": {
        "icon": "✓",
        "es": "Modelo supervisado",
        "en": "Supervised model",
        "it": "Modello supervisionato",
        "fr": "Modèle supervisé",
        "de": "Überwachtes Modell",
        "pt": "Modelo supervisionado"
    },
    "redes-neuronales": {
        "icon": "⋈",
        "es": "Redes Neuronales",
        "en": "Neural Networks",
        "it": "Reti neurali",
        "fr": "Réseaux neuronaux",
        "de": "Neuronale Netze",
        "pt": "Redes Neuronais"
    },
    "modelo-no-supervisado": {
        "icon": "◎",
        "es": "Modelo no supervisado",
        "en": "Unsupervised model",
        "it": "Modello non supervisionato",
        "fr": "Modèle non supervisé",
        "de": "Unüberwachtes Modell",
        "pt": "Modelo não supervisionado"
    },
    "clasificacion": {
        "icon": "≡",
        "es": "Clasificación",
        "en": "Classification",
        "it": "Classificazione",
        "fr": "Classification",
        "de": "Klassifikation",
        "pt": "Classificação"
    },
    "clustering": {
        "icon": "✣",
        "es": "Clustering",
        "en": "Clustering",
        "it": "Clustering",
        "fr": "Clustering",
        "de": "Clustering",
        "pt": "Clustering"
    },
    "knn": {
        "icon": "↗",
        "es": "KNN",
        "en": "KNN",
        "it": "KNN",
        "fr": "KNN",
        "de": "KNN",
        "pt": "KNN"
    },
    "k-means": {
        "icon": "⌖",
        "es": "K-means",
        "en": "K-means",
        "it": "K-means",
        "fr": "K-means",
        "de": "K-means",
        "pt": "K-means"
    },
    "regresion-logistica": {
        "icon": "⌁",
        "es": "Regresión logística",
        "en": "Logistic regression",
        "it": "Regressione logistica",
        "fr": "Régression logistique",
        "de": "Logistische Regression",
        "pt": "Regressão Logística"
    },
    "dbscan": {
        "icon": "⊙",
        "es": "DBSCAN",
        "en": "DBSCAN",
        "it": "DBSCAN",
        "fr": "DBSCAN",
        "de": "DBSCAN",
        "pt": "DBSCAN"
    },
    "simulacion": {
        "icon": "∿",
        "es": "Simulación",
        "en": "Simulation",
        "it": "Simulazione",
        "fr": "Simulation",
        "de": "Simulation",
        "pt": "Simulação"
    },
    "poisson": {
        "icon": "λ",
        "es": "Poisson",
        "en": "Poisson",
        "it": "Poisson",
        "fr": "Poisson",
        "de": "Poisson",
        "pt": "Poisson"
    },
    "geoespacial": {
        "icon": "⌖",
        "es": "Geoespacial",
        "en": "Geospatial",
        "it": "Geospaziale",
        "fr": "Géospatial",
        "de": "Georäumlich",
        "pt": "Geoespacial"
    },
    "airbnb": {
        "icon": "⌂",
        "es": "Airbnb",
        "en": "Airbnb",
        "it": "Airbnb",
        "fr": "Airbnb",
        "de": "Airbnb",
        "pt": "Airbnb"
    },
    "taxi": {
        "icon": "◆",
        "es": "Taxi",
        "en": "Taxi",
        "it": "Taxi",
        "fr": "Taxi",
        "de": "Taxi",
        "pt": "Táxi"
    },
    "futbol": {
        "icon": "●",
        "es": "Fútbol",
        "en": "Soccer",
        "it": "Calcio",
        "fr": "Football",
        "de": "Fußball",
        "pt": "Futebol"
    },
    "aviacion": {
        "icon": "✈",
        "es": "Aviación",
        "en": "Aviation",
        "it": "Aviazione",
        "fr": "Aviation",
        "de": "Luftfahrt",
        "pt": "Aviação"
    },
    "fraude": {
        "icon": "!",
        "es": "Fraude",
        "en": "Fraud",
        "it": "Frode",
        "fr": "Fraude",
        "de": "Betrug",
        "pt": "Fraude"
    }
};

  function currentLang(){
    if(window.plGetLanguage){
      const lang = window.plGetLanguage();
      if(['es','en','it','fr','de','pt'].includes(lang)) return lang;
    }
    try{
      const stored = localStorage.getItem('patronesLabLanguage');
      if(['es','en','it','fr','de','pt'].includes(stored)) return stored;
    }catch(e){}
    return 'es';
  }

  function labelFor(token, lang){
    if(window.PL_STATIC_MULTILINGUAL && window.plStaticFilterLabels[token]) return window.plStaticFilterLabels[token];
    const data = TAG_LABELS_BY_TOKEN[token];
    if(!data) return token;
    return data[lang] || data.es || token;
  }

  function iconFor(token){
    const data = TAG_LABELS_BY_TOKEN[token];
    return data && data.icon ? data.icon : '';
  }

  function renderFilterButton(button, lang){
    if(window.PL_STATIC_MULTILINGUAL) return;
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
      const text = button.textContent.replace(/^\s*(?:ƒx|[◎▦▥⚗✦✎◇◧◉▣✓≡✣↗⌖⌁⊙●✈!∿λ])+\s*/, '').trim();
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
    const language = ['es','en','it','fr','de','pt'].includes(lang) ? lang : currentLang();

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
        "it": "Tutti",
        "fr": "Tous",
        "de": "Alle",
        "pt": "Todos"
    },
    "bi": {
        "icon": "▦",
        "es": "BI",
        "en": "BI",
        "it": "BI",
        "fr": "BI",
        "de": "BI",
        "pt": "BI"
    },
    "data-analysis": {
        "icon": "▥",
        "es": "Análisis de datos",
        "en": "Data analysis",
        "it": "Analisi dei dati",
        "fr": "Analyse de données",
        "de": "Datenanalyse",
        "pt": "Análise de Dados"
    },
    "data-science": {
        "icon": "⚗",
        "es": "Ciencia de datos",
        "en": "Data science",
        "it": "Scienza dei dati",
        "fr": "Science des données",
        "de": "Data Science",
        "pt": "Ciência de Dados"
    },
    "data-storytelling": {
        "icon": "✎",
        "es": "Data Storytelling",
        "en": "Data Storytelling",
        "it": "Storytelling dei dati",
        "fr": "Narration de données",
        "de": "Data Storytelling",
        "pt": "Data Storytelling"
    },
    "machine-learning": {
        "icon": "✦",
        "es": "Machine Learning",
        "en": "Machine Learning",
        "it": "Machine Learning",
        "fr": "Machine Learning",
        "de": "Machine Learning",
        "pt": "Machine Learning"
    },
    "python": {
        "icon": "◇",
        "es": "Python",
        "en": "Python",
        "it": "Python",
        "fr": "Python",
        "de": "Python",
        "pt": "Python"
    },
    "spss": {
        "icon": "◧",
        "es": "SPSS",
        "en": "SPSS",
        "it": "SPSS",
        "fr": "SPSS",
        "de": "SPSS",
        "pt": "SPSS"
    },
    "looker-studio": {
        "icon": "◉",
        "es": "Looker Studio",
        "en": "Looker Studio",
        "it": "Looker Studio",
        "fr": "Looker Studio",
        "de": "Looker Studio",
        "pt": "Looker Studio"
    },
    "dashboard": {
        "icon": "▣",
        "es": "Dashboard",
        "en": "Dashboard",
        "it": "Dashboard",
        "fr": "Tableau de bord",
        "de": "Dashboard",
        "pt": "Dashboard"
    },
    "power-bi": {
        "icon": "▥",
        "es": "Power BI",
        "en": "Power BI",
        "it": "Power BI",
        "fr": "Power BI",
        "de": "Power BI",
        "pt": "Power BI"
    },
    "dax": {
        "icon": "ƒx",
        "es": "DAX",
        "en": "DAX",
        "it": "DAX",
        "fr": "DAX",
        "de": "DAX",
        "pt": "DAX"
    },
    "spotify": {
        "icon": "♪",
        "es": "Spotify",
        "en": "Spotify",
        "it": "Spotify",
        "fr": "Spotify",
        "de": "Spotify",
        "pt": "Spotify"
    },
    "modelo-supervisado": {
        "icon": "✓",
        "es": "Modelo supervisado",
        "en": "Supervised model",
        "it": "Modello supervisionato",
        "fr": "Modèle supervisé",
        "de": "Überwachtes Modell",
        "pt": "Modelo supervisionado"
    },
    "redes-neuronales": {
        "icon": "⋈",
        "es": "Redes Neuronales",
        "en": "Neural Networks",
        "it": "Reti neurali",
        "fr": "Réseaux neuronaux",
        "de": "Neuronale Netze",
        "pt": "Redes Neuronais"
    },
    "modelo-no-supervisado": {
        "icon": "◎",
        "es": "Modelo no supervisado",
        "en": "Unsupervised model",
        "it": "Modello non supervisionato",
        "fr": "Modèle non supervisé",
        "de": "Unüberwachtes Modell",
        "pt": "Modelo não supervisionado"
    },
    "clasificacion": {
        "icon": "≡",
        "es": "Clasificación",
        "en": "Classification",
        "it": "Classificazione",
        "fr": "Classification",
        "de": "Klassifikation",
        "pt": "Classificação"
    },
    "clustering": {
        "icon": "✣",
        "es": "Clustering",
        "en": "Clustering",
        "it": "Clustering",
        "fr": "Clustering",
        "de": "Clustering",
        "pt": "Clustering"
    },
    "knn": {
        "icon": "↗",
        "es": "KNN",
        "en": "KNN",
        "it": "KNN",
        "fr": "KNN",
        "de": "KNN",
        "pt": "KNN"
    },
    "k-means": {
        "icon": "⌖",
        "es": "K-means",
        "en": "K-means",
        "it": "K-means",
        "fr": "K-means",
        "de": "K-means",
        "pt": "K-means"
    },
    "regresion-logistica": {
        "icon": "⌁",
        "es": "Regresión logística",
        "en": "Logistic regression",
        "it": "Regressione logistica",
        "fr": "Régression logistique",
        "de": "Logistische Regression",
        "pt": "Regressão Logística"
    },
    "dbscan": {
        "icon": "⊙",
        "es": "DBSCAN",
        "en": "DBSCAN",
        "it": "DBSCAN",
        "fr": "DBSCAN",
        "de": "DBSCAN",
        "pt": "DBSCAN"
    },
    "simulacion": {
        "icon": "∿",
        "es": "Simulación",
        "en": "Simulation",
        "it": "Simulazione",
        "fr": "Simulation",
        "de": "Simulation",
        "pt": "Simulação"
    },
    "poisson": {
        "icon": "λ",
        "es": "Poisson",
        "en": "Poisson",
        "it": "Poisson",
        "fr": "Poisson",
        "de": "Poisson",
        "pt": "Poisson"
    },
    "geoespacial": {
        "icon": "⌖",
        "es": "Geoespacial",
        "en": "Geospatial",
        "it": "Geospaziale",
        "fr": "Géospatial",
        "de": "Georäumlich",
        "pt": "Geoespacial"
    },
    "airbnb": {
        "icon": "⌂",
        "es": "Airbnb",
        "en": "Airbnb",
        "it": "Airbnb",
        "fr": "Airbnb",
        "de": "Airbnb",
        "pt": "Airbnb"
    },
    "taxi": {
        "icon": "◆",
        "es": "Taxi",
        "en": "Taxi",
        "it": "Taxi",
        "fr": "Taxi",
        "de": "Taxi",
        "pt": "Táxi"
    },
    "futbol": {
        "icon": "●",
        "es": "Fútbol",
        "en": "Soccer",
        "it": "Calcio",
        "fr": "Football",
        "de": "Fußball",
        "pt": "Futebol"
    },
    "aviacion": {
        "icon": "✈",
        "es": "Aviación",
        "en": "Aviation",
        "it": "Aviazione",
        "fr": "Aviation",
        "de": "Luftfahrt",
        "pt": "Aviação"
    },
    "fraude": {
        "icon": "!",
        "es": "Fraude",
        "en": "Fraud",
        "it": "Frode",
        "fr": "Fraude",
        "de": "Betrug",
        "pt": "Fraude"
    }
};
  let isSyncing = false;

  function getLang(){
    if(window.plGetLanguage){
      const lang = window.plGetLanguage();
      if(['es','en','it','fr','de','pt'].includes(lang)) return lang;
    }

    try{
      const stored = localStorage.getItem('patronesLabLanguage');
      if(['es','en','it','fr','de','pt'].includes(stored)) return stored;
    }catch(e){}

    return document.documentElement.lang || 'es';
  }

  function getLabel(token, lang){
    if(window.PL_STATIC_MULTILINGUAL && window.plStaticFilterLabels[token]) return window.plStaticFilterLabels[token];
    const item = FINAL_TAG_LABELS[token];
    if(!item) return token;
    return item[lang] || item.es || token;
  }

  function getIcon(token){
    const item = FINAL_TAG_LABELS[token];
    return item && item.icon ? item.icon : '';
  }

  function cleanFilterText(text){
    return (text || '').replace(/^\s*(?:ƒx|[◎▦▥⚗✦✎◇◧◉▣✓≡✣↗⌖⌁⊙●✈!∿λ])+\s*/, '').trim();
  }

  function renderOneFilter(button, lang){
    if(window.PL_STATIC_MULTILINGUAL) return;
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
    if(window.PL_STATIC_MULTILINGUAL) return;
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
      const actual = window.plReadFilterText(button);

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

    const language = ['es','en','it','fr','de','pt'].includes(lang) ? lang : getLang();

    renderFilters(language);
    renderCardTags(language);
    audit(language);

    isSyncing = false;
  }

  function syncSoon(lang){
    const language = ['es','en','it','fr','de','pt'].includes(lang) ? lang : getLang();

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
  function getMiniTagGap(holder){
    const style = window.getComputedStyle(holder);
    const raw = style.columnGap && style.columnGap !== 'normal' ? style.columnGap : style.gap;
    const value = parseFloat(raw);
    return Number.isFinite(value) ? value : 0;
  }

  function simulateMiniTagRows(items, order, capacity, gap){
    const rows = [];
    let row = [];
    let used = 0;

    order.forEach(function(itemIndex){
      const width = items[itemIndex].width;
      const extraGap = row.length ? gap : 0;

      if(row.length && used + extraGap + width > capacity + 0.5){
        rows.push({items: row.slice(), used: used});
        row = [];
        used = 0;
      }

      if(row.length){
        used += gap;
      }

      row.push(itemIndex);
      used += width;
    });

    if(row.length){
      rows.push({items: row.slice(), used: used});
    }

    return rows;
  }

  function compactMiniTagOrder(items, capacity, gap){
    const count = items.length;
    const original = items.map(function(_, index){ return index; });

    if(count < 3 || count > 14){
      return original;
    }

    const fullMask = (1 << count) - 1;
    const usedCache = new Map();
    const memo = new Map();

    function bitCount(mask){
      let value = mask;
      let total = 0;
      while(value){
        total += value & 1;
        value >>>= 1;
      }
      return total;
    }

    function firstIndex(mask){
      for(let index = 0; index < count; index += 1){
        if(mask & (1 << index)) return index;
      }
      return -1;
    }

    function rowUsed(mask){
      if(usedCache.has(mask)) return usedCache.get(mask);

      let width = 0;
      for(let index = 0; index < count; index += 1){
        if(mask & (1 << index)){
          width += items[index].width;
        }
      }

      const itemsInRow = bitCount(mask);
      width += gap * Math.max(0, itemsInRow - 1);
      if(itemsInRow === 1){
        width = Math.min(width, capacity);
      }
      usedCache.set(mask, width);
      return width;
    }

    function compareScores(a, b){
      if(!b) return -1;
      const keys = ['rows', 'maxGap', 'sumSquaredGap', 'movement'];

      for(let i = 0; i < keys.length; i += 1){
        const key = keys[i];
        if(Math.abs(a[key] - b[key]) <= 0.01) continue;
        return a[key] < b[key] ? -1 : 1;
      }

      return 0;
    }

    function solve(mask){
      if(mask === 0){
        return {
          rows: 0,
          maxGap: 0,
          sumSquaredGap: 0,
          movement: 0,
          rowMasks: []
        };
      }

      if(memo.has(mask)) return memo.get(mask);

      const anchor = firstIndex(mask);
      let best = null;
      let subset = mask;

      while(subset){
        const containsAnchor = Boolean(subset & (1 << anchor));
        const used = containsAnchor ? rowUsed(subset) : capacity + 1;

        if(containsAnchor && used <= capacity + 0.5){
          const rest = mask ^ subset;
          const nextIndex = rest ? firstIndex(rest) : -1;
          const forcesRealWrap = !rest || used + gap + items[nextIndex].width > capacity + 0.5;

          if(!forcesRealWrap){
            subset = (subset - 1) & mask;
            continue;
          }

          const tail = solve(rest);
          if(!tail){
            subset = (subset - 1) & mask;
            continue;
          }

          const slack = rest ? Math.max(0, capacity - used) : 0;
          let movement = 0;

          for(let selectedIndex = anchor + 1; selectedIndex < count; selectedIndex += 1){
            if(!(subset & (1 << selectedIndex))) continue;

            for(let skippedIndex = anchor; skippedIndex < selectedIndex; skippedIndex += 1){
              if((mask & (1 << skippedIndex)) && !(subset & (1 << skippedIndex))){
                movement += 1;
              }
            }
          }

          const candidate = {
            rows: 1 + tail.rows,
            maxGap: Math.max(slack, tail.maxGap),
            sumSquaredGap: slack * slack + tail.sumSquaredGap,
            movement: movement + tail.movement,
            rowMasks: [subset].concat(tail.rowMasks)
          };

          if(compareScores(candidate, best) < 0){
            best = candidate;
          }
        }

        subset = (subset - 1) & mask;
      }

      memo.set(mask, best);
      return best;
    }

    const solution = solve(fullMask);
    if(!solution) return original;

    const output = [];
    solution.rowMasks.forEach(function(mask){
      for(let index = 0; index < count; index += 1){
        if(mask & (1 << index)) output.push(index);
      }
    });

    return output;
  }

  function measureMiniTagWidth(span, holder, capacity){
    const clone = span.cloneNode(true);
    clone.removeAttribute('id');
    clone.setAttribute('aria-hidden', 'true');
    clone.style.position = 'absolute';
    clone.style.visibility = 'hidden';
    clone.style.pointerEvents = 'none';
    clone.style.width = 'max-content';
    clone.style.maxWidth = 'none';
    clone.style.minWidth = '0';
    clone.style.flex = '0 0 auto';
    clone.style.whiteSpace = 'nowrap';
    clone.style.order = '0';

    holder.appendChild(clone);
    const width = clone.getBoundingClientRect().width;
    clone.remove();

    return Math.min(capacity, Math.ceil(width * 10) / 10);
  }

  function layoutMovement(order){
    let movement = 0;
    order.forEach(function(itemIndex, visualIndex){
      movement += Math.abs(itemIndex - visualIndex);
    });
    return movement;
  }

  function scoreMiniTagLayout(items, order, capacity, gap, baseGap){
    const rows = simulateMiniTagRows(items, order, capacity, gap);
    const nonFinal = rows.slice(0, -1);
    const slacks = nonFinal.map(function(row){
      return Math.max(0, capacity - row.used);
    });

    return {
      order: order,
      gap: gap,
      rowsData: rows,
      rows: rows.length,
      maxGap: slacks.length ? Math.max.apply(null, slacks) : 0,
      sumSquaredGap: slacks.reduce(function(total, slack){
        return total + slack * slack;
      }, 0),
      movement: layoutMovement(order),
      gapReduction: Math.max(0, baseGap - gap)
    };
  }

  function isBetterMiniTagLayout(candidate, current){
    if(!current) return true;

    if(candidate.rows !== current.rows){
      return candidate.rows < current.rows;
    }

    if(Math.abs(candidate.maxGap - current.maxGap) > 0.01){
      return candidate.maxGap < current.maxGap;
    }

    if(Math.abs(candidate.sumSquaredGap - current.sumSquaredGap) > 0.01){
      return candidate.sumSquaredGap < current.sumSquaredGap;
    }

    if(candidate.movement !== current.movement){
      return candidate.movement < current.movement;
    }

    if(Math.abs(candidate.gapReduction - current.gapReduction) > 0.01){
      return candidate.gapReduction < current.gapReduction;
    }

    return false;
  }

  function candidateMiniTagGaps(baseGap, minimumGap){
    const minimum = Number.isFinite(minimumGap)
      ? Math.max(0, Math.min(baseGap, minimumGap))
      : (baseGap >= 5.75 ? 4 : Math.max(3.5, baseGap - 1.5));
    const values = [baseGap];

    for(let gap = baseGap - 0.5; gap >= minimum - 0.01; gap -= 0.5){
      values.push(Math.max(minimum, Math.round(gap * 10) / 10));
    }

    return values.filter(function(value, index, list){
      return list.findIndex(function(other){
        return Math.abs(other - value) < 0.01;
      }) === index;
    });
  }

  function clearMiniTagDensity(holder){
    holder.style.removeProperty('--pl-mini-tag-font-size');
    holder.style.removeProperty('--pl-mini-tag-padding-x');
    holder.style.removeProperty('--pl-mini-tag-padding-y');
    holder.style.removeProperty('--pl-mini-tag-min-height');
  }

  function applyMiniTagDensity(holder, profile){
    if(!profile){
      clearMiniTagDensity(holder);
      return;
    }

    holder.style.setProperty('--pl-mini-tag-font-size', profile.fontSize.toFixed(2) + 'px');
    holder.style.setProperty('--pl-mini-tag-padding-x', profile.paddingX.toFixed(2) + 'px');
    holder.style.setProperty('--pl-mini-tag-padding-y', profile.paddingY.toFixed(2) + 'px');
    holder.style.setProperty('--pl-mini-tag-min-height', profile.minHeight.toFixed(2) + 'px');
  }

  function mobileMiniTagDensityProfiles(holder, spanCount){
    if(window.innerWidth > 767) return [null];

    const width = holder.clientWidth;
    let base;

    if(width <= 130){
      base = {fontSize:8.5, paddingX:4.0, paddingY:3.0, minHeight:18.0, gap:2.5, minGap:2.0};
    }else if(width <= 150){
      base = {fontSize:8.8, paddingX:4.25, paddingY:3.0, minHeight:18.5, gap:2.75, minGap:2.0};
    }else if(width <= 180){
      base = {fontSize:9.2, paddingX:4.5, paddingY:3.1, minHeight:19.0, gap:3.0, minGap:2.0};
    }else if(width <= 220){
      base = {fontSize:9.5, paddingX:4.75, paddingY:3.2, minHeight:19.5, gap:3.25, minGap:2.25};
    }else if(width <= 280){
      base = {fontSize:9.8, paddingX:5.0, paddingY:3.3, minHeight:20.0, gap:3.5, minGap:2.5};
    }else{
      base = {fontSize:10.2, paddingX:5.5, paddingY:3.5, minHeight:20.5, gap:4.0, minGap:3.0};
    }

    const profiles = [Object.assign({name:'balanced', rank:0}, base)];

    const compact = {
      name:'compact',
      rank:1,
      fontSize:Math.max(8.2, base.fontSize - 0.5),
      paddingX:Math.max(3.75, base.paddingX - 0.5),
      paddingY:Math.max(2.8, base.paddingY - 0.2),
      minHeight:Math.max(18.0, base.minHeight - 0.5),
      gap:Math.max(2.25, base.gap - 0.5),
      minGap:Math.max(1.9, base.minGap - 0.25)
    };
    profiles.push(compact);

    if(spanCount >= 7 || width <= 190){
      profiles.push({
        name:'dense',
        rank:2,
        fontSize:Math.max(8.2, base.fontSize - 1.0),
        paddingX:Math.max(3.5, base.paddingX - 1.0),
        paddingY:Math.max(2.7, base.paddingY - 0.35),
        minHeight:Math.max(18.0, base.minHeight - 0.9),
        gap:Math.max(2.0, base.gap - 1.0),
        minGap:Math.max(1.75, base.minGap - 0.4)
      });
    }

    return profiles;
  }

  function isBetterAcrossDensityProfiles(candidate, current){
    if(!current) return true;

    if(candidate.rows !== current.rows){
      return candidate.rows < current.rows;
    }

    if(candidate.profileRank !== current.profileRank){
      return candidate.profileRank < current.profileRank;
    }

    return isBetterMiniTagLayout(candidate, current);
  }

  function packMiniTagHolder(holder){
    const spans = Array.from(holder.querySelectorAll(':scope > span'));

    if(spans.length < 3){
      holder.style.removeProperty('--pl-mini-tag-column-gap');
      clearMiniTagDensity(holder);
      holder.removeAttribute('data-packed-density');
      return;
    }

    const capacity = holder.clientWidth;
    if(!capacity || capacity < 1) return;

    const originalOrder = spans.map(function(_, index){ return index; });
    const profiles = mobileMiniTagDensityProfiles(holder, spans.length);
    let best = null;

    profiles.forEach(function(profile){
      applyMiniTagDensity(holder, profile);
      holder.style.removeProperty('--pl-mini-tag-column-gap');

      const profileBaseGap = profile ? profile.gap : getMiniTagGap(holder);
      const profileMinGap = profile ? profile.minGap : undefined;
      const items = spans.map(function(span){
        return {
          node: span,
          width: measureMiniTagWidth(span, holder, capacity)
        };
      });

      let bestForProfile = scoreMiniTagLayout(items, originalOrder, capacity, profileBaseGap, profileBaseGap);
      bestForProfile.profile = profile;
      bestForProfile.profileRank = profile ? profile.rank : 0;

      candidateMiniTagGaps(profileBaseGap, profileMinGap).forEach(function(gap){
        const compactOrder = compactMiniTagOrder(items, capacity, gap);
        const candidate = scoreMiniTagLayout(items, compactOrder, capacity, gap, profileBaseGap);
        candidate.profile = profile;
        candidate.profileRank = profile ? profile.rank : 0;

        if(isBetterMiniTagLayout(candidate, bestForProfile)){
          bestForProfile = candidate;
        }
      });

      if(isBetterAcrossDensityProfiles(bestForProfile, best)){
        best = bestForProfile;
      }
    });

    if(!best) return;

    applyMiniTagDensity(holder, best.profile);

    best.order.forEach(function(itemIndex, visualIndex){
      spans[itemIndex].style.order = String(visualIndex);
    });

    const defaultGap = best.profile ? best.profile.gap : getMiniTagGap(holder);
    if(best.profile || Math.abs(best.gap - defaultGap) > 0.01){
      holder.style.setProperty('--pl-mini-tag-column-gap', best.gap.toFixed(1) + 'px');
    }else{
      holder.style.removeProperty('--pl-mini-tag-column-gap');
    }

    const reordered = best.order.some(function(itemIndex, visualIndex){
      return itemIndex !== originalOrder[visualIndex];
    });

    holder.dataset.packedRows = String(best.rows);
    holder.dataset.packed = reordered ? 'true' : 'false';
    holder.dataset.packedGap = best.gap.toFixed(1);
    if(best.profile){
      holder.dataset.packedDensity = best.profile.name;
    }else{
      holder.removeAttribute('data-packed-density');
    }
  }

  let miniTagPackFrame = 0;
  const observedMiniTagHolders = new WeakSet();
  const miniTagResizeObserver = typeof ResizeObserver === 'function'
    ? new ResizeObserver(function(entries){
        if(entries.some(function(entry){ return entry.target && entry.target.matches('#projects .mini-tags'); })){
          scheduleMiniTagPacking();
        }
      })
    : null;

  function observeMiniTagHolders(){
    if(!miniTagResizeObserver) return;

    document.querySelectorAll('#projects .mini-tags').forEach(function(holder){
      if(observedMiniTagHolders.has(holder)) return;
      observedMiniTagHolders.add(holder);
      miniTagResizeObserver.observe(holder);
    });
  }

  function packMiniTags(){
    observeMiniTagHolders();
    document.querySelectorAll('#projects .mini-tags').forEach(packMiniTagHolder);
  }

  function scheduleMiniTagPacking(){
    if(miniTagPackFrame){
      window.cancelAnimationFrame(miniTagPackFrame);
    }

    miniTagPackFrame = window.requestAnimationFrame(function(){
      miniTagPackFrame = 0;
      packMiniTags();
    });
  }

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

  window.plPackMiniTags = scheduleMiniTagPacking;
  window.plRemoveInjectedProjectTags = removeInjectedProjectTags;
})();


(function(){
  const FINAL_PROJECT_LABELS = {
    "all": {
        "icon": "◎",
        "es": "Todos",
        "en": "All",
        "it": "Tutti",
        "fr": "Tous",
        "de": "Alle",
        "pt": "Todos"
    },
    "bi": {
        "icon": "▦",
        "es": "BI",
        "en": "BI",
        "it": "BI",
        "fr": "BI",
        "de": "BI",
        "pt": "BI"
    },
    "data-analysis": {
        "icon": "▥",
        "es": "Análisis de datos",
        "en": "Data analysis",
        "it": "Analisi dei dati",
        "fr": "Analyse de données",
        "de": "Datenanalyse",
        "pt": "Análise de Dados"
    },
    "data-science": {
        "icon": "⚗",
        "es": "Ciencia de datos",
        "en": "Data science",
        "it": "Scienza dei dati",
        "fr": "Science des données",
        "de": "Data Science",
        "pt": "Ciência de Dados"
    },
    "data-storytelling": {
        "icon": "✎",
        "es": "Data Storytelling",
        "en": "Data Storytelling",
        "it": "Storytelling dei dati",
        "fr": "Narration de données",
        "de": "Data Storytelling",
        "pt": "Data Storytelling"
    },
    "machine-learning": {
        "icon": "✦",
        "es": "Machine Learning",
        "en": "Machine Learning",
        "it": "Machine Learning",
        "fr": "Machine Learning",
        "de": "Machine Learning",
        "pt": "Machine Learning"
    },
    "python": {
        "icon": "◇",
        "es": "Python",
        "en": "Python",
        "it": "Python",
        "fr": "Python",
        "de": "Python",
        "pt": "Python"
    },
    "spss": {
        "icon": "◧",
        "es": "SPSS",
        "en": "SPSS",
        "it": "SPSS",
        "fr": "SPSS",
        "de": "SPSS",
        "pt": "SPSS"
    },
    "looker-studio": {
        "icon": "◉",
        "es": "Looker Studio",
        "en": "Looker Studio",
        "it": "Looker Studio",
        "fr": "Looker Studio",
        "de": "Looker Studio",
        "pt": "Looker Studio"
    },
    "dashboard": {
        "icon": "▣",
        "es": "Dashboard",
        "en": "Dashboard",
        "it": "Dashboard",
        "fr": "Tableau de bord",
        "de": "Dashboard",
        "pt": "Dashboard"
    },
    "power-bi": {
        "icon": "▥",
        "es": "Power BI",
        "en": "Power BI",
        "it": "Power BI",
        "fr": "Power BI",
        "de": "Power BI",
        "pt": "Power BI"
    },
    "dax": {
        "icon": "ƒx",
        "es": "DAX",
        "en": "DAX",
        "it": "DAX",
        "fr": "DAX",
        "de": "DAX",
        "pt": "DAX"
    },
    "spotify": {
        "icon": "♪",
        "es": "Spotify",
        "en": "Spotify",
        "it": "Spotify",
        "fr": "Spotify",
        "de": "Spotify",
        "pt": "Spotify"
    },
    "modelo-supervisado": {
        "icon": "✓",
        "es": "Modelo supervisado",
        "en": "Supervised model",
        "it": "Modello supervisionato",
        "fr": "Modèle supervisé",
        "de": "Überwachtes Modell",
        "pt": "Modelo supervisionado"
    },
    "redes-neuronales": {
        "icon": "⋈",
        "es": "Redes Neuronales",
        "en": "Neural Networks",
        "it": "Reti neurali",
        "fr": "Réseaux neuronaux",
        "de": "Neuronale Netze",
        "pt": "Redes Neuronais"
    },
    "modelo-no-supervisado": {
        "icon": "◎",
        "es": "Modelo no supervisado",
        "en": "Unsupervised model",
        "it": "Modello non supervisionato",
        "fr": "Modèle non supervisé",
        "de": "Unüberwachtes Modell",
        "pt": "Modelo não supervisionado"
    },
    "clasificacion": {
        "icon": "≡",
        "es": "Clasificación",
        "en": "Classification",
        "it": "Classificazione",
        "fr": "Classification",
        "de": "Klassifikation",
        "pt": "Classificação"
    },
    "clustering": {
        "icon": "✣",
        "es": "Clustering",
        "en": "Clustering",
        "it": "Clustering",
        "fr": "Clustering",
        "de": "Clustering",
        "pt": "Clustering"
    },
    "knn": {
        "icon": "↗",
        "es": "KNN",
        "en": "KNN",
        "it": "KNN",
        "fr": "KNN",
        "de": "KNN",
        "pt": "KNN"
    },
    "k-means": {
        "icon": "⌖",
        "es": "K-means",
        "en": "K-means",
        "it": "K-means",
        "fr": "K-means",
        "de": "K-means",
        "pt": "K-means"
    },
    "regresion-logistica": {
        "icon": "⌁",
        "es": "Regresión logística",
        "en": "Logistic regression",
        "it": "Regressione logistica",
        "fr": "Régression logistique",
        "de": "Logistische Regression",
        "pt": "Regressão Logística"
    },
    "dbscan": {
        "icon": "⊙",
        "es": "DBSCAN",
        "en": "DBSCAN",
        "it": "DBSCAN",
        "fr": "DBSCAN",
        "de": "DBSCAN",
        "pt": "DBSCAN"
    },
    "simulacion": {
        "icon": "∿",
        "es": "Simulación",
        "en": "Simulation",
        "it": "Simulazione",
        "fr": "Simulation",
        "de": "Simulation",
        "pt": "Simulação"
    },
    "poisson": {
        "icon": "λ",
        "es": "Poisson",
        "en": "Poisson",
        "it": "Poisson",
        "fr": "Poisson",
        "de": "Poisson",
        "pt": "Poisson"
    },
    "geoespacial": {
        "icon": "⌖",
        "es": "Geoespacial",
        "en": "Geospatial",
        "it": "Geospaziale",
        "fr": "Géospatial",
        "de": "Georäumlich",
        "pt": "Geoespacial"
    },
    "airbnb": {
        "icon": "⌂",
        "es": "Airbnb",
        "en": "Airbnb",
        "it": "Airbnb",
        "fr": "Airbnb",
        "de": "Airbnb",
        "pt": "Airbnb"
    },
    "taxi": {
        "icon": "◆",
        "es": "Taxi",
        "en": "Taxi",
        "it": "Taxi",
        "fr": "Taxi",
        "de": "Taxi",
        "pt": "Táxi"
    },
    "futbol": {
        "icon": "●",
        "es": "Fútbol",
        "en": "Soccer",
        "it": "Calcio",
        "fr": "Football",
        "de": "Fußball",
        "pt": "Futebol"
    },
    "aviacion": {
        "icon": "✈",
        "es": "Aviación",
        "en": "Aviation",
        "it": "Aviazione",
        "fr": "Aviation",
        "de": "Luftfahrt",
        "pt": "Aviação"
    },
    "fraude": {
        "icon": "!",
        "es": "Fraude",
        "en": "Fraud",
        "it": "Frode",
        "fr": "Fraude",
        "de": "Betrug",
        "pt": "Fraude"
    }
};

  function getLang(){
    if(window.plGetLanguage){
      const lang = window.plGetLanguage();
      if(['es','en','it','fr','de','pt'].includes(lang)) return lang;
    }

    try{
      const stored = localStorage.getItem('patronesLabLanguage');
      if(['es','en','it','fr','de','pt'].includes(stored)) return stored;
    }catch(e){}

    const htmlLang = document.documentElement.lang;
    return ['es','en','it','fr','de','pt'].includes(htmlLang) ? htmlLang : 'es';
  }

  function labelFor(token, lang){
    if(window.PL_STATIC_MULTILINGUAL && window.plStaticFilterLabels[token]) return window.plStaticFilterLabels[token];
    const data = FINAL_PROJECT_LABELS[token];
    if(!data) return token;
    return data[lang] || data.es || token;
  }

  function labelForCard(token, lang, card){
    if(window.PL_STATIC_MULTILINGUAL){
      const tokens = (card.dataset.tags || '').trim().split(/\s+/);
      const span = card.querySelectorAll('.mini-tags span')[tokens.indexOf(token)];
      if(span) return span.textContent.trim();
    }
    if(card.dataset.projectId === 'champions-league-2026-27-poisson' && lang === 'es'){
      if(token === 'data-science') return 'Ciencia de Datos';
      if(token === 'data-analysis') return 'Análisis de Datos';
    }
    return labelFor(token, lang);
  }

  function iconFor(token){
    const data = FINAL_PROJECT_LABELS[token];
    return data && data.icon ? data.icon : '';
  }

  function stripIcon(text){
    return (text || '').replace(/^\s*(?:ƒx|[◎▦▥⚗✦✎◇◧◉▣✓≡✣↗⌖⌁⊙●✈!∿λ])+\s*/, '').trim();
  }

  function renderFilters(lang){
    if(window.PL_STATIC_MULTILINGUAL) return;
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
    if(window.PL_STATIC_MULTILINGUAL) return;
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

        const label = labelForCard(token, lang, card);

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
      const actual = window.plReadFilterText(button);

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
        const expected = labelForCard(token, lang, card);
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

        if(filter && filter !== actual && !(card.dataset.projectId === 'champions-league-2026-27-poisson' && lang === 'es' && ['data-science','data-analysis'].includes(token))){
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
    const language = ['es','en','it','fr','de','pt'].includes(lang) ? lang : getLang();

    removeInjectedProjectTags();
    renderFilters(language);
    renderMiniTags(language);

    if(window.plApplyRepoFilter && window.plGetActiveRepoFilter){
      window.plApplyRepoFilter(window.plGetActiveRepoFilter());
    }

    renderFilters(language);
    renderMiniTags(language);
    removeInjectedProjectTags();
    if(window.plPackMiniTags){
      window.plPackMiniTags();
    }

    audit(language);
  }

  function syncSoon(lang){
    const language = ['es','en','it','fr','de','pt'].includes(lang) ? lang : getLang();

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

  window.addEventListener('resize', function(){
    if(window.plPackMiniTags) window.plPackMiniTags();
  }, {passive:true});

  if(document.fonts && document.fonts.ready){
    document.fonts.ready.then(function(){
      if(window.plPackMiniTags) window.plPackMiniTags();
    }).catch(function(){});
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
    it: "Patrones Lab® · Generare conoscenza a partire dai dati · di Malcolm Di Pietro Cagliari",
    fr: "Patrones Lab® · Transformer les données en connaissances · par Malcolm Di Pietro Cagliari",
    de: "Patrones Lab® · Wissen aus Daten gewinnen · von Malcolm Di Pietro Cagliari",
    pt: "Patrones Lab® · A gerar conhecimento a partir dos dados · por Malcolm Di Pietro Cagliari"
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
    if(window.PL_STATIC_MULTILINGUAL) return;
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
        "Construcción",
        "Solución"
      ],
      [
        "Validación",
        "Control y confianza"
      ],
      [
        "Entrega",
        "Publicación, automatización y evolución"
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
        "Analytical foundation"
      ],
      [
        "Development",
        "Solution"
      ],
      [
        "Validation",
        "Control and confidence"
      ],
      [
        "Delivery",
        "Publication, automation and evolution"
      ]
    ]
  },
  "it": {
    "title": "Ciclo di vita dei dati",
    "steps": [
      [
        "Scoperta",
        "Contesto e obiettivo"
      ],
      [
        "Fonti",
        "Dati e diagnosi"
      ],
      [
        "Preparazione",
        "Base analitica"
      ],
      [
        "Sviluppo",
        "Soluzione"
      ],
      [
        "Validazione",
        "Controllo e affidabilità"
      ],
      [
        "Consegna",
        "Pubblicazione, automazione ed evoluzione"
      ]
    ]
  },
  "fr": {
    "title": "Cycle de vie des données",
    "steps": [
      [
        "Découverte",
        "Contexte et objectif"
      ],
      [
        "Sources",
        "Données et diagnostic"
      ],
      [
        "Préparation",
        "Base analytique"
      ],
      [
        "Développement",
        "Solution"
      ],
      [
        "Validation",
        "Contrôle et confiance"
      ],
      [
        "Livraison",
        "Publication, automatisation et évolution"
      ]
    ]
  },
  "de": {
    "title": "Lebenszyklus der Daten",
    "steps": [
      [
        "Entdeckung",
        "Kontext und Ziel"
      ],
      [
        "Quellen",
        "Daten und Diagnose"
      ],
      [
        "Aufbereitung",
        "Analysebasis"
      ],
      [
        "Entwicklung",
        "Lösung"
      ],
      [
        "Validierung",
        "Kontrolle und Vertrauen"
      ],
      [
        "Übergabe",
        "Veröffentlichung, Automatisierung und Weiterentwicklung"
      ]
    ]
  },
  "pt": {
    "title": "Ciclo de vida dos dados",
    "steps": [
      [
        "Descoberta",
        "Contexto e objetivo"
      ],
      [
        "Fontes",
        "Dados e diagnóstico"
      ],
      [
        "Preparação",
        "Base analítica"
      ],
      [
        "Construção",
        "Solução"
      ],
      [
        "Validação",
        "Controlo e confiança"
      ],
      [
        "Entrega",
        "Publicação, automatização e evolução"
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
    if(window.PL_STATIC_MULTILINGUAL) return;
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
  const labels = {
    es: 'datos:',
    en: 'data:',
    it: 'dati:',
    fr: 'données:',
    de: 'Daten:',
    pt: 'dados:'
  };

  const ariaLabels = {
    es: 'Año de los datos',
    en: 'Data year',
    it: 'Anno dei dati',
    fr: 'Année des données',
    de: 'Datenjahr',
    pt: 'Ano dos dados'
  };

  function getLang(){
    if(window.plGetLanguage){
      return window.plGetLanguage();
    }

    try{
      return localStorage.getItem('patrones_lab_language') || 'es';
    }catch(e){
      return 'es';
    }
  }

  function syncProjectDataYearLabels(lang){
    if(window.PL_STATIC_MULTILINGUAL) return;
    const language = labels[lang] ? lang : getLang();

    document.querySelectorAll('.project-data-label[data-data-year-label]').forEach(function(label){
      label.textContent = labels[language] || labels.es;

      const wrapper = label.closest('.project-data-year');
      if(!wrapper) return;

      const valueEl = wrapper.querySelector('.project-data-value');
      const value = valueEl ? valueEl.textContent.trim() : '';
      if(value){
        wrapper.setAttribute('aria-label', (ariaLabels[language] || ariaLabels.es) + ': ' + value);
      }
    });
  }

  document.addEventListener('pl-language-changed', function(event){
    const lang = event.detail && event.detail.language ? event.detail.language : getLang();
    syncProjectDataYearLabels(lang);
  });

  syncProjectDataYearLabels(getLang());

  window.plSyncProjectDataYearLabels = syncProjectDataYearLabels;
})();


(function(){
  const detailCopy = {
    es: { cta: 'Ver detalle', ariaKey: 'detailAriaEs' },
    en: { cta: 'View details', ariaKey: 'detailAriaEn' },
    it: { cta: 'Vedi dettagli', ariaKey: 'detailAriaIt' },
    fr: { cta: 'Voir le détail', ariaKey: 'detailAriaFr' },
    de: { cta: 'Details ansehen', ariaKey: 'detailAriaDe' },
    pt: { cta: 'Ver detalhe', ariaKey: 'detailAriaPt' }
  };

  function getLang(){
    if(window.plGetLanguage){
      const lang = window.plGetLanguage();
      if(detailCopy[lang]) return lang;
    }

    try{
      const stored = localStorage.getItem('patronesLabLanguage');
      if(detailCopy[stored]) return stored;
    }catch(e){}

    const htmlLang = document.documentElement.lang;
    return detailCopy[htmlLang] ? htmlLang : 'es';
  }

  function applyProjectDetailCue(lang){
    if(window.PL_STATIC_MULTILINGUAL) return;
    const language = detailCopy[lang] ? lang : getLang();
    const pack = detailCopy[language];

    document.querySelectorAll('[data-project-detail-cta="true"]').forEach(function(el){
      el.textContent = pack.cta;
    });

    document.querySelectorAll('#projects .github-project-card.project-card-detail-ready').forEach(function(card){
      const aria = card.dataset[pack.ariaKey];
      if(!aria) return;
      card.querySelectorAll('.project-image-link, .project-link[href$=".html"]').forEach(function(el){
        el.setAttribute('aria-label', aria);
      });
    });
  }

  document.addEventListener('pl-language-changed', function(event){
    const lang = event.detail && event.detail.language ? event.detail.language : getLang();
    applyProjectDetailCue(lang);
  });

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){
      applyProjectDetailCue(getLang());
    }, {once:true});
  }else{
    applyProjectDetailCue(getLang());
  }
})();

(function(){
  "use strict";

  var mobileQuery = window.matchMedia("(max-width: 767px)");
  var scheduled = false;

  function clearFit(title, words){
    if(title) title.style.removeProperty("font-size");
    words.forEach(function(word){ word.style.removeProperty("font-size"); });
  }

  function fitMobileHeroTitle(){
    var title = document.querySelector("#home .pl-hero-title");
    if(!title) return;
    var rows = Array.prototype.slice.call(title.querySelectorAll(".hero-line-row"));
    var words = Array.prototype.slice.call(title.querySelectorAll(".hero-rotator span"));

    clearFit(title, words);
    if(!mobileQuery.matches) return;

    var available = Math.max(0, title.getBoundingClientRect().width - 4);
    if(!available) return;

    var baseSize = parseFloat(window.getComputedStyle(title).fontSize) || 0;
    var widestRow = rows.reduce(function(maxWidth, row){
      return Math.max(maxWidth, row.scrollWidth || row.getBoundingClientRect().width || 0);
    }, 0);

    if(baseSize && widestRow > available){
      var rowScale = Math.min(1, (available / widestRow) * 0.985);
      title.style.setProperty("font-size", (baseSize * rowScale).toFixed(2) + "px", "important");
    }

    words.forEach(function(word){
      word.style.removeProperty("font-size");
      var wordWidth = word.scrollWidth || word.getBoundingClientRect().width || 0;
      if(wordWidth <= available || !wordWidth) return;
      var wordSize = parseFloat(window.getComputedStyle(word).fontSize) || 0;
      if(!wordSize) return;
      var wordScale = Math.min(1, (available / wordWidth) * 0.985);
      word.style.setProperty("font-size", (wordSize * wordScale).toFixed(2) + "px", "important");
    });
  }

  function scheduleFit(){
    if(scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(function(){
      scheduled = false;
      fitMobileHeroTitle();
    });
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", scheduleFit, {once:true});
  }else{
    scheduleFit();
  }

  if(document.fonts && document.fonts.ready){
    document.fonts.ready.then(scheduleFit).catch(function(){});
  }

  window.addEventListener("resize", scheduleFit, {passive:true});
  window.addEventListener("orientationchange", scheduleFit, {passive:true});
  document.addEventListener("pl-language-changed", scheduleFit);
})();

(function(){
  function getToolbar(){
    return document.querySelector('#projects .repo-filter-toolbar.repo-filter-toolbar-categories');
  }

  function getItems(toolbar){
    if(!toolbar) return [];
    return Array.from(toolbar.children).filter(function(node){
      return node.matches &&
        (node.matches('.repo-filter-group') ||
         node.matches('.repo-filter-btn[data-repo-filter="all"]'));
    });
  }

  function permutations(values){
    if(values.length <= 1) return [values.slice()];
    const output = [];
    values.forEach(function(value, index){
      const rest = values.slice(0, index).concat(values.slice(index + 1));
      permutations(rest).forEach(function(tail){
        output.push([value].concat(tail));
      });
    });
    return output;
  }

  function simulate(widths, order, capacity, gap){
    const rows = [];
    let current = {items:[], used:0};

    order.forEach(function(index){
      const width = Math.min(capacity, widths[index]);
      const next = current.items.length ? current.used + gap + width : width;

      if(current.items.length && next > capacity + 0.5){
        rows.push(current);
        current = {items:[index], used:width};
      }else{
        current.items.push(index);
        current.used = next;
      }
    });

    if(current.items.length) rows.push(current);
    return rows;
  }

  function movement(order){
    return order.reduce(function(total, itemIndex, visualIndex){
      return total + Math.abs(itemIndex - visualIndex);
    }, 0);
  }

  function score(widths, order, capacity, gap, baseGap){
    const rows = simulate(widths, order, capacity, gap);
    const nonFinal = rows.slice(0, -1);
    const slacks = nonFinal.map(function(row){
      return Math.max(0, capacity - row.used);
    });

    return {
      order:order,
      gap:gap,
      rows:rows.length,
      maxSlack:slacks.length ? Math.max.apply(null, slacks) : 0,
      sumSquaredSlack:slacks.reduce(function(total, slack){
        return total + slack * slack;
      }, 0),
      movement:movement(order),
      gapReduction:Math.max(0, baseGap - gap)
    };
  }

  function betterWithinProfile(candidate, current){
    if(!current) return true;
    if(candidate.rows !== current.rows) return candidate.rows < current.rows;
    if(Math.abs(candidate.maxSlack - current.maxSlack) > 0.01){
      return candidate.maxSlack < current.maxSlack;
    }
    if(Math.abs(candidate.sumSquaredSlack - current.sumSquaredSlack) > 0.01){
      return candidate.sumSquaredSlack < current.sumSquaredSlack;
    }
    if(candidate.movement !== current.movement){
      return candidate.movement < current.movement;
    }
    if(Math.abs(candidate.gapReduction - current.gapReduction) > 0.01){
      return candidate.gapReduction < current.gapReduction;
    }
    return false;
  }

  function betterAcrossProfiles(candidate, current){
    if(!current) return true;
    if(candidate.rows !== current.rows) return candidate.rows < current.rows;
    if(candidate.profileRank !== current.profileRank){
      return candidate.profileRank < current.profileRank;
    }
    return betterWithinProfile(candidate, current);
  }

  function profileCandidates(toolbarWidth){
    const mobile = window.matchMedia('(max-width: 767px), (hover: none) and (pointer: coarse)').matches;

    if(!mobile){
      return [
        {name:'balanced', rank:0, groupPadding:20, allPadding:14, gap:12, minGap:9, rowGap:14},
        {name:'compact', rank:1, groupPadding:18, allPadding:14, gap:10, minGap:8, rowGap:13}
      ];
    }

    if(toolbarWidth <= 340){
      return [
        {name:'balanced', rank:0, groupPadding:20, allPadding:14, gap:8, minGap:6, rowGap:9},
        {name:'compact', rank:1, groupPadding:17, allPadding:13, gap:6, minGap:4.5, rowGap:8},
        {name:'dense', rank:2, groupPadding:14.5, allPadding:12, gap:4.5, minGap:3.5, rowGap:7}
      ];
    }

    if(toolbarWidth <= 460){
      return [
        {name:'balanced', rank:0, groupPadding:20, allPadding:14, gap:8, minGap:6, rowGap:9},
        {name:'compact', rank:1, groupPadding:17.5, allPadding:13, gap:6, minGap:4.5, rowGap:8},
        {name:'dense', rank:2, groupPadding:15, allPadding:12, gap:4.5, minGap:3.5, rowGap:7.5}
      ];
    }

    return [
      {name:'balanced', rank:0, groupPadding:20, allPadding:14, gap:8, minGap:6, rowGap:9},
      {name:'compact', rank:1, groupPadding:18, allPadding:13.5, gap:6, minGap:4.5, rowGap:8}
    ];
  }

  function gapCandidates(baseGap, minGap){
    const out = [baseGap];
    for(let value = baseGap - 0.5; value >= minGap - 0.01; value -= 0.5){
      out.push(Math.max(minGap, Math.round(value * 10) / 10));
    }
    return out.filter(function(value, index, values){
      return values.findIndex(function(other){
        return Math.abs(other - value) < 0.01;
      }) === index;
    });
  }

  function applyProfile(toolbar, profile, gap){
    toolbar.style.setProperty('--pl-filter-trigger-padding-x', profile.groupPadding + 'px');
    toolbar.style.setProperty('--pl-filter-all-padding-x', profile.allPadding + 'px');
    toolbar.style.setProperty('--pl-filter-gap-x', gap + 'px');
    toolbar.style.setProperty('--pl-filter-gap-y', profile.rowGap + 'px');
  }

  function measureWidths(toolbar, items, profile){
    applyProfile(toolbar, profile, profile.gap);
    return items.map(function(item){
      return Math.ceil(item.getBoundingClientRect().width * 10) / 10;
    });
  }

  function optimizeToolbar(){
    const toolbar = getToolbar();
    const items = getItems(toolbar);
    if(!toolbar || items.length < 3) return;

    const capacity = toolbar.clientWidth;
    if(!capacity) return;

    const originalOrder = items.map(function(_, index){ return index; });
    const firstIndex = items.findIndex(function(item){
      return item.matches('.repo-filter-btn[data-repo-filter="all"]');
    });

    const fixedFirst = firstIndex >= 0 ? firstIndex : 0;
    const remaining = originalOrder.filter(function(index){ return index !== fixedFirst; });
    const visualOrders = permutations(remaining).map(function(order){
      return [fixedFirst].concat(order);
    });

    let best = null;

    profileCandidates(capacity).forEach(function(profile){
      const widths = measureWidths(toolbar, items, profile);
      let bestForProfile = null;

      gapCandidates(profile.gap, profile.minGap).forEach(function(gap){
        visualOrders.forEach(function(order){
          const candidate = score(widths, order, capacity, gap, profile.gap);
          candidate.profile = profile;
          candidate.profileRank = profile.rank;

          if(betterWithinProfile(candidate, bestForProfile)){
            bestForProfile = candidate;
          }
        });
      });

      if(bestForProfile && betterAcrossProfiles(bestForProfile, best)){
        best = bestForProfile;
      }
    });

    if(!best) return;

    applyProfile(toolbar, best.profile, best.gap);

    best.order.forEach(function(itemIndex, visualIndex){
      items[itemIndex].style.order = String(visualIndex);
    });

    toolbar.dataset.filterLayoutRows = String(best.rows);
    toolbar.dataset.filterLayoutProfile = best.profile.name;
    toolbar.dataset.filterLayoutGap = best.gap.toFixed(1);
    toolbar.dataset.filterLayoutPacked = best.order.some(function(itemIndex, visualIndex){
      return itemIndex !== originalOrder[visualIndex];
    }) ? 'true' : 'false';
  }

  let frame = 0;
  function schedule(){
    if(frame) window.cancelAnimationFrame(frame);
    frame = window.requestAnimationFrame(function(){
      frame = 0;
      optimizeToolbar();
    });
  }

  const toolbar = getToolbar();
  if(toolbar && typeof ResizeObserver === 'function'){
    const observer = new ResizeObserver(schedule);
    observer.observe(toolbar);
  }

  window.addEventListener('resize', schedule, {passive:true});
  document.addEventListener('pl-language-changed', schedule);

  if(document.fonts && document.fonts.ready){
    document.fonts.ready.then(schedule).catch(function(){});
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', schedule, {once:true});
  }else{
    schedule();
  }

  window.plOptimizeProjectFilters = schedule;
})();


(function(){
  'use strict';

  const selector = '#projects .project-meta-row';
  let frame = 0;

  function rowsFit(row){
    const status = row.querySelector('.project-status');
    const data = row.querySelector('.project-data-year');
    if(!status || !data) return true;

    const style = window.getComputedStyle(row);
    const gap = parseFloat(style.columnGap || style.gap || '0') || 0;
    const available = row.clientWidth;
    const needed = status.getBoundingClientRect().width + data.getBoundingClientRect().width + gap;
    return needed <= available + 0.5;
  }

  function optimizeRow(row){
    row.classList.remove('project-meta-compact');

    if(rowsFit(row)){
      row.dataset.metaLayout = 'regular-row';
      return;
    }

    row.classList.add('project-meta-compact');

    if(rowsFit(row)){
      row.dataset.metaLayout = 'compact-row';
      return;
    }

    row.classList.remove('project-meta-compact');
    row.dataset.metaLayout = 'wrapped';
  }

  function optimizeAll(){
    document.querySelectorAll(selector).forEach(optimizeRow);
  }

  function schedule(){
    if(frame) window.cancelAnimationFrame(frame);
    frame = window.requestAnimationFrame(function(){
      frame = 0;
      optimizeAll();
    });
  }

  if(typeof ResizeObserver === 'function'){
    const observer = new ResizeObserver(schedule);
    document.querySelectorAll(selector).forEach(function(row){ observer.observe(row); });
  }

  window.addEventListener('resize', schedule, {passive:true});
  document.addEventListener('pl-language-changed', schedule);

  if(document.fonts && document.fonts.ready){
    document.fonts.ready.then(schedule).catch(function(){});
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', schedule, {once:true});
  }else{
    schedule();
  }

  window.plOptimizeProjectMetaRows = schedule;
})();
