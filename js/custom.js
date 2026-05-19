(function ($) {

  "use strict";

  // Color mode
  const savedMode = localStorage.getItem('patrones-lab-color-mode');
  if(savedMode === 'dark'){
    $('body').addClass('dark-mode');
    $('.color-mode-icon').addClass('active');
  }

  $('.color-mode').on('click', function(){
    $('.color-mode-icon').toggleClass('active');
    $('body').toggleClass('dark-mode');
    localStorage.setItem('patrones-lab-color-mode', $('body').hasClass('dark-mode') ? 'dark' : 'light');
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


// Repository project filters
(function(){
  const buttons = Array.from(document.querySelectorAll('.repo-filter-btn'));
  const cards = Array.from(document.querySelectorAll('.github-project-card[data-tags]'));
  const empty = document.querySelector('.repo-empty-message');

  if(!buttons.length || !cards.length) return;

  function applyFilter(filter){
    let visible = 0;
    cards.forEach(card => {
      const tags = (card.dataset.tags || '').trim().toLowerCase().split(/\s+/);
      const show = filter === 'all' || tags.includes(filter);
      card.classList.toggle('is-filtered-out', !show);
      if(show) visible += 1;
    });
    if(empty) empty.hidden = visible > 0;
  }

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      buttons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      applyFilter((button.dataset.repoFilter || 'all').toLowerCase());
    });
  });

  applyFilter('all');
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


// Smooth wheel-controlled timeline
(function(){
  const section = document.querySelector('[data-pinned-timeline]');
  const timeline = document.querySelector('[data-process-timeline]');
  if(!section || !timeline) return;

  const steps = Array.from(timeline.querySelectorAll('[data-step]'));
  if(!steps.length) return;

  let targetProgress = 0;
  let currentProgress = 0;
  let animating = false;
  let lastWheelAt = 0;

  function isDesktop(){
    return window.matchMedia('(min-width: 992px)').matches;
  }

  function clamp(v, min, max){
    return Math.min(Math.max(v, min), max);
  }

  function sectionInLockZone(){
    const rect = section.getBoundingClientRect();
    return rect.top <= 92 && rect.bottom >= window.innerHeight * 0.56;
  }

  function alignSectionSoft(){
    const target = section.getBoundingClientRect().top + window.scrollY - 76;
    if(Math.abs(window.scrollY - target) > 3){
      window.scrollTo({ top: target, behavior: 'smooth' });
    }
  }

  function render(){
    const displayProgress = currentProgress;
    const activeIndex = clamp(Math.round(displayProgress * (steps.length - 1)), 0, steps.length - 1);

    steps.forEach((step, index) => {
      step.classList.toggle('is-active', index === activeIndex);
      step.classList.toggle('is-complete', index <= activeIndex);
    });
  }

  function animateProgress(){
    if(animating) return;
    animating = true;

    function frame(){
      const diff = targetProgress - currentProgress;
      currentProgress += diff * 0.075;

      if(Math.abs(diff) < 0.002){
        currentProgress = targetProgress;
      }

      render();

      if(currentProgress !== targetProgress){
        requestAnimationFrame(frame);
      } else {
        animating = false;
      }
    }

    requestAnimationFrame(frame);
  }

  function canLock(deltaY){
    if(!isDesktop()) return false;
    if(!sectionInLockZone()) return false;

    if(deltaY > 0 && targetProgress < 1) return true;
    if(deltaY < 0 && targetProgress > 0) return true;

    return false;
  }

  window.addEventListener('wheel', function(event){
    if(!canLock(event.deltaY)) return;

    event.preventDefault();
    alignSectionSoft();

    const now = Date.now();
    const delta = Math.sign(event.deltaY) * Math.min(Math.abs(event.deltaY), 120) / 760;
    // Avoid hyper-sensitive trackpads, but keep it responsive.
    if(now - lastWheelAt < 20) return;
    lastWheelAt = now;

    targetProgress = clamp(targetProgress + delta, 0, 1);
    animateProgress();
  }, { passive:false });

  window.addEventListener('scroll', function(){
    if(!isDesktop()) return;

    const rect = section.getBoundingClientRect();

    if(rect.top > window.innerHeight * 0.55){
      targetProgress = 0;
      currentProgress = 0;
      render();
    }

    if(rect.bottom < window.innerHeight * 0.45){
      targetProgress = 1;
      currentProgress = 1;
      render();
    }
  }, { passive:true });

  window.addEventListener('resize', function(){
    if(!isDesktop()){
      steps.forEach(step => {
        step.classList.add('is-complete');
        step.classList.remove('is-active');
      });
    } else {
      render();
    }
  });

  render();
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
