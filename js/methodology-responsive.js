(function () {
  'use strict';

  const section = document.querySelector('#methodology[data-methodology-controller="adaptive"]');
  if (!section) return;

  const stage = section.querySelector('.methodology-stage');
  const viewport = section.querySelector('.methodology-viewport');
  const track = section.querySelector('.process-horizontal-track');
  const staticHead = section.querySelector('.process-horizontal-static-head');
  const panels = Array.from(section.querySelectorAll('.process-horizontal-panel'));
  const guide = section.querySelector('.process-horizontal-guide');
  const bullets = guide ? Array.from(guide.querySelectorAll('[data-process-guide]')) : [];

  if (!stage || !viewport || !track || panels.length < 2) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hoverCapability = window.matchMedia('(hover: hover)');
  const finePointer = window.matchMedia('(pointer: fine)');
  const mobileViewport = window.matchMedia('(max-width: 767px)');

  const state = {
    mode: null,
    activeIndex: 0,
    progress: 0,
    maxDistance: 0,
    exitHold: 0,
    pinDistance: 0,
    panelOffsets: [],
    panelCenters: [],
    scrollTrigger: null,
    resizeFrame: 0,
    nativeScrollFrame: 0,
    lastSignature: '',
    dragging: false,
    dragTarget: null,
    dragStartX: 0,
    dragStartProgress: 0,
    nativePointerId: null,
    nativeGesture: null,
    nativeStartX: 0,
    nativeStartY: 0,
    nativeStartScrollLeft: 0,
    nativeStartIndex: 0,
    nativeStartTime: 0
  };

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function visibleHeight() {
    const visualHeight = window.visualViewport && window.visualViewport.height;
    return Math.max(1, Math.round(visualHeight || window.innerHeight || document.documentElement.clientHeight || 1));
  }

  function visibleWidth() {
    const visualWidth = window.visualViewport && window.visualViewport.width;
    return Math.max(1, Math.round(visualWidth || window.innerWidth || document.documentElement.clientWidth || 1));
  }

  function navbarHeight() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return 0;
    return Math.max(0, Math.round(navbar.getBoundingClientRect().height));
  }

  function chooseMode() {
    const usableHeight = visibleHeight() - navbarHeight();
    const animationReady = Boolean(window.gsap && window.ScrollTrigger);
    const hasSpace = visibleWidth() >= 992 && usableHeight >= 610;
    const hasDesktopInput = hoverCapability.matches && finePointer.matches;

    return animationReady && hasSpace && hasDesktopInput && !reducedMotion.matches
      ? 'pinned'
      : 'native';
  }

  function measure() {
    const navHeight = navbarHeight();
    const stageHeight = visibleHeight();

    section.style.setProperty('--methodology-navbar-height', navHeight + 'px');
    section.style.setProperty('--methodology-stage-height', stageHeight + 'px');

    state.maxDistance = Math.max(0, track.scrollWidth - viewport.clientWidth);
    state.exitHold = Math.max(
      180,
      Math.min(viewport.clientWidth * 0.38, visibleHeight() * 0.48)
    );
    state.pinDistance = state.maxDistance + state.exitHold;
    state.panelOffsets = panels.map(function (panel) { return panel.offsetLeft; });
    state.panelCenters = panels.map(function (panel) {
      return panel.offsetLeft + panel.offsetWidth / 2;
    });
  }

  function indexForPosition(position) {
    const center = position + viewport.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;

    state.panelCenters.forEach(function (panelCenter, index) {
      const distance = Math.abs(panelCenter - center);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  }

  function progressForIndex(index) {
    if (state.maxDistance <= 0) return 0;
    return clamp((state.panelOffsets[index] || 0) / state.maxDistance, 0, 1);
  }

  function contrastIndexForPosition(position) {
    if (!staticHead) return indexForPosition(position);

    const viewportRect = viewport.getBoundingClientRect();
    const headRect = staticHead.getBoundingClientRect();
    const sampleX = clamp(
      headRect.left - viewportRect.left + headRect.width * 0.55,
      0,
      Math.max(0, viewport.clientWidth - 1)
    );
    const contentX = position + sampleX;

    for (let index = panels.length - 1; index >= 0; index -= 1) {
      if (contentX >= state.panelOffsets[index]) return index;
    }

    return 0;
  }

  function updateActive(index, progress) {
    const nextIndex = clamp(index, 0, panels.length - 1);
    const nextProgress = clamp(
      Number.isFinite(progress) ? progress : progressForIndex(nextIndex),
      0,
      1
    );
    const activePanel = panels[nextIndex];
    const contrastPanel = panels[contrastIndexForPosition(nextProgress * state.maxDistance)] || activePanel;
    const activeColor = activePanel.style.getPropertyValue('--panel-color').trim() || '#ffc200';
    const lightText = contrastPanel.classList.contains('is-light-text');

    state.activeIndex = nextIndex;
    state.progress = nextProgress;
    section.style.setProperty('--methodology-active-color', activeColor);
    section.classList.toggle('is-light-stage', lightText);
    section.classList.toggle('is-dark-stage', !lightText);

    panels.forEach(function (panel, panelIndex) {
      const active = panelIndex === nextIndex;
      panel.classList.toggle('is-active', active);
      if (active) panel.setAttribute('aria-current', 'step');
      else panel.removeAttribute('aria-current');
    });

    bullets.forEach(function (bullet, bulletIndex) {
      const active = bulletIndex === nextIndex;
      bullet.classList.toggle('is-active', active);
      if (active) bullet.setAttribute('aria-current', 'step');
      else bullet.removeAttribute('aria-current');
    });

    if (guide) {
      guide.style.setProperty('--process-guide-progress', nextProgress.toFixed(5));
    }
  }

  function destroyPinned() {
    if (state.scrollTrigger) {
      state.scrollTrigger.kill(true);
      state.scrollTrigger = null;
    }

    section.classList.remove('is-dragging', 'is-methodology-pinned-active');
    state.dragging = false;
    state.dragTarget = null;

    if (window.gsap) {
      window.gsap.set(track, { clearProps: 'transform,willChange' });
    } else {
      track.style.removeProperty('transform');
      track.style.removeProperty('will-change');
    }
  }

  function setNativePosition(index, behavior) {
    measure();
    const left = state.panelOffsets[clamp(index, 0, panels.length - 1)] || 0;
    viewport.scrollTo({ left: left, behavior: behavior || 'auto' });
  }

  function setupNative(index) {
    destroyPinned();
    state.mode = 'native';
    section.setAttribute('data-methodology-mode', 'native');
    viewport.removeAttribute('aria-roledescription');
    measure();
    setNativePosition(index, 'auto');
    updateActive(index, progressForIndex(index));
  }

  function scrollToPinnedProgress(progress, behavior) {
    if (!state.scrollTrigger) return;

    const nextProgress = clamp(progress, 0, 1);
    const start = state.scrollTrigger.start;
    const distance = Math.max(1, state.maxDistance);

    window.scrollTo({
      top: start + distance * nextProgress,
      behavior: behavior || 'auto'
    });

    if (typeof window.plSmoothScrollSync === 'function') {
      window.plSmoothScrollSync();
    }

    updateActive(indexForPosition(nextProgress * state.maxDistance), nextProgress);
  }

  function motionProgressForTrigger(trigger) {
    const scrollPosition = typeof trigger.scroll === 'function'
      ? trigger.scroll()
      : (window.scrollY || window.pageYOffset || 0);

    return clamp(
      (scrollPosition - trigger.start) / Math.max(1, state.maxDistance),
      0,
      1
    );
  }

  function setupPinned(index, restorePosition) {
    destroyPinned();
    state.mode = 'pinned';
    section.setAttribute('data-methodology-mode', 'pinned');
    viewport.setAttribute('aria-roledescription', 'carousel');
    viewport.scrollLeft = 0;
    measure();

    window.gsap.registerPlugin(window.ScrollTrigger);
    window.gsap.set(track, { x: 0, willChange: 'transform' });

    function renderPinned(trigger) {
      const motionProgress = motionProgressForTrigger(trigger);
      const position = motionProgress * state.maxDistance;

      window.gsap.set(track, { x: -position });
      updateActive(indexForPosition(position), motionProgress);
    }

    state.scrollTrigger = window.ScrollTrigger.create({
      trigger: section,
      pin: stage,
      pinSpacing: true,
      start: 'top top',
      end: function () { return '+=' + Math.max(1, state.pinDistance); },
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onRefreshInit: measure,
      onRefresh: function (self) {
        renderPinned(self);
      },
      onUpdate: function (self) {
        renderPinned(self);
      },
      onToggle: function (self) {
        section.classList.toggle('is-methodology-pinned-active', self.isActive);
        renderPinned(self);
        window.dispatchEvent(new Event('scroll'));
      }
    });

    updateActive(index, progressForIndex(index));

    if (restorePosition) {
      window.requestAnimationFrame(function () {
        scrollToPinnedProgress(progressForIndex(index), 'auto');
      });
    }
  }

  function goTo(index, behavior) {
    const nextIndex = clamp(index, 0, panels.length - 1);

    if (state.mode === 'pinned') {
      scrollToPinnedProgress(progressForIndex(nextIndex), behavior);
    } else {
      setNativePosition(nextIndex, behavior);
      updateActive(nextIndex, progressForIndex(nextIndex));
    }
  }

  function rebuild(force) {
    state.resizeFrame = 0;

    const targetMode = chooseMode();
    const signature = [
      targetMode,
      visibleWidth(),
      visibleHeight(),
      navbarHeight(),
      Math.round(viewport.clientWidth),
      Math.round(track.scrollWidth)
    ].join(':');

    if (!force && signature === state.lastSignature) return;

    const index = state.activeIndex;
    const sectionRect = section.getBoundingClientRect();
    const wasActive = Boolean(state.scrollTrigger && state.scrollTrigger.isActive);
    const wasVisible = sectionRect.top < visibleHeight() && sectionRect.bottom > 0;

    state.lastSignature = signature;

    if (targetMode === 'pinned') {
      setupPinned(index, wasActive || (state.mode === 'native' && wasVisible));
    } else {
      setupNative(index);
      if (wasActive) {
        window.requestAnimationFrame(function () {
          section.scrollIntoView({ behavior: 'auto', block: 'start' });
          setNativePosition(index, 'auto');
          if (typeof window.plSmoothScrollSync === 'function') window.plSmoothScrollSync();
        });
      }
    }
  }

  function scheduleRebuild(force) {
    if (state.resizeFrame) window.cancelAnimationFrame(state.resizeFrame);
    state.resizeFrame = window.requestAnimationFrame(function () {
      rebuild(Boolean(force));
    });
  }

  function handleNativeScroll() {
    if (state.mode !== 'native' || state.nativeScrollFrame) return;

    state.nativeScrollFrame = window.requestAnimationFrame(function () {
      state.nativeScrollFrame = 0;
      const position = viewport.scrollLeft;
      const progress = state.maxDistance > 0 ? position / state.maxDistance : 0;
      updateActive(indexForPosition(position), progress);
    });
  }

  function handleKeyboard(event) {
    const targets = {
      ArrowRight: state.activeIndex + 1,
      PageDown: state.activeIndex + 1,
      ArrowLeft: state.activeIndex - 1,
      PageUp: state.activeIndex - 1,
      Home: 0,
      End: panels.length - 1
    };

    if (!Object.prototype.hasOwnProperty.call(targets, event.key)) return;

    event.preventDefault();
    goTo(targets[event.key], reducedMotion.matches ? 'auto' : 'smooth');
  }

  function beginDrag(event) {
    if (state.mode !== 'pinned' || !finePointer.matches || event.button !== 0) return;
    if (event.target.closest('a, button')) return;

    state.dragging = true;
    state.dragStartX = event.clientX;
    state.dragStartProgress = state.progress;
    state.dragTarget = event.currentTarget;
    section.classList.add('is-dragging');

    try { state.dragTarget.setPointerCapture(event.pointerId); } catch (error) {}
    event.preventDefault();
  }

  function moveDrag(event) {
    if (!state.dragging) return;

    const delta = (event.clientX - state.dragStartX) / Math.max(1, viewport.clientWidth);
    const sensitivity = event.pointerType === 'mouse' ? 0.5 : 1;
    scrollToPinnedProgress(state.dragStartProgress - delta * sensitivity, 'auto');
    event.preventDefault();
  }

  function endDrag(event) {
    if (!state.dragging) return;

    state.dragging = false;
    section.classList.remove('is-dragging');

    try {
      if (state.dragTarget) state.dragTarget.releasePointerCapture(event.pointerId);
    } catch (error) {}

    state.dragTarget = null;
  }

  function resetNativeGesture(event) {
    if (event && state.nativePointerId !== null) {
      try { viewport.releasePointerCapture(state.nativePointerId); } catch (error) {}
    }

    section.classList.remove('is-native-dragging');
    state.nativePointerId = null;
    state.nativeGesture = null;
  }

  function beginNativeGesture(event) {
    if (state.mode !== 'native' || !mobileViewport.matches || event.pointerType !== 'touch') return;
    if (event.target.closest && event.target.closest('a, button, input, textarea, select, label')) return;

    state.nativePointerId = event.pointerId;
    state.nativeGesture = 'pending';
    state.nativeStartX = event.clientX;
    state.nativeStartY = event.clientY;
    state.nativeStartScrollLeft = viewport.scrollLeft;
    state.nativeStartIndex = indexForPosition(viewport.scrollLeft);
    state.nativeStartTime = Date.now();
  }

  function moveNativeGesture(event) {
    if (state.nativePointerId !== event.pointerId || state.nativeGesture === null) return;

    const deltaX = event.clientX - state.nativeStartX;
    const deltaY = event.clientY - state.nativeStartY;
    const horizontalDistance = Math.abs(deltaX);
    const verticalDistance = Math.abs(deltaY);

    if (state.nativeGesture === 'pending') {
      if (verticalDistance > 8 && verticalDistance > horizontalDistance + 4) {
        state.nativeGesture = 'vertical';
        return;
      }

      if (horizontalDistance > 8 && horizontalDistance > verticalDistance + 5) {
        state.nativeGesture = 'horizontal';
        section.classList.add('is-native-dragging');
        try { viewport.setPointerCapture(event.pointerId); } catch (error) {}
      }
    }

    if (state.nativeGesture !== 'horizontal') return;

    viewport.scrollLeft = state.nativeStartScrollLeft - deltaX;
    if (event.cancelable) event.preventDefault();
  }

  function endNativeGesture(event) {
    if (state.nativePointerId !== event.pointerId || state.nativeGesture === null) return;

    const gesture = state.nativeGesture;
    const deltaX = event.clientX - state.nativeStartX;
    const deltaY = event.clientY - state.nativeStartY;
    const elapsed = Date.now() - state.nativeStartTime;
    const horizontalDistance = Math.abs(deltaX);
    const verticalDistance = Math.abs(deltaY);
    const reducedBehavior = reducedMotion.matches ? 'auto' : 'smooth';

    if (gesture === 'horizontal') {
      let targetIndex = indexForPosition(viewport.scrollLeft);

      if (horizontalDistance >= 42 && targetIndex === state.nativeStartIndex) {
        targetIndex = state.nativeStartIndex + (deltaX < 0 ? 1 : -1);
      }

      resetNativeGesture(event);
      goTo(targetIndex, reducedBehavior);
      return;
    }

    if (gesture === 'pending' && elapsed <= 500 && horizontalDistance <= 10 && verticalDistance <= 10) {
      const rect = viewport.getBoundingClientRect();
      const relativeX = event.clientX - rect.left;
      const currentIndex = indexForPosition(viewport.scrollLeft);

      resetNativeGesture(event);

      if (relativeX <= rect.width * 0.25) {
        goTo(currentIndex - 1, reducedBehavior);
      } else if (relativeX >= rect.width * 0.75) {
        goTo(currentIndex + 1, reducedBehavior);
      }
      return;
    }

    resetNativeGesture(event);
  }

  function cancelNativeGesture(event) {
    if (state.nativePointerId !== event.pointerId) return;
    resetNativeGesture(event);
  }

  bullets.forEach(function (bullet) {
    bullet.addEventListener('click', function (event) {
      event.stopPropagation();
      const index = Number(bullet.getAttribute('data-process-guide')) || 0;
      goTo(index, reducedMotion.matches ? 'auto' : 'smooth');
    });
  });

  viewport.addEventListener('scroll', handleNativeScroll, { passive: true });
  viewport.addEventListener('keydown', handleKeyboard);
  viewport.addEventListener('pointerdown', beginDrag);
  viewport.addEventListener('pointermove', moveDrag);
  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);
  viewport.addEventListener('pointerdown', beginNativeGesture);
  viewport.addEventListener('pointermove', moveNativeGesture, { passive: false });
  viewport.addEventListener('pointerup', endNativeGesture);
  viewport.addEventListener('pointercancel', cancelNativeGesture);
  viewport.addEventListener('pointerleave', function (event) {
    if (state.dragging && event.buttons === 0) endDrag(event);
  });

  function bindMediaQuery(query) {
    if (typeof query.addEventListener === 'function') {
      query.addEventListener('change', function () { scheduleRebuild(true); });
    } else if (typeof query.addListener === 'function') {
      query.addListener(function () { scheduleRebuild(true); });
    }
  }

  bindMediaQuery(reducedMotion);
  bindMediaQuery(hoverCapability);
  bindMediaQuery(finePointer);
  bindMediaQuery(mobileViewport);

  window.addEventListener('resize', function () { scheduleRebuild(false); }, { passive: true });
  window.addEventListener('orientationchange', function () { scheduleRebuild(true); }, { passive: true });
  window.addEventListener('load', function () { scheduleRebuild(true); }, { passive: true });

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', function () { scheduleRebuild(false); }, { passive: true });
  }

  if (typeof ResizeObserver === 'function') {
    const resizeObserver = new ResizeObserver(function () { scheduleRebuild(false); });
    resizeObserver.observe(stage);
    resizeObserver.observe(viewport);
    panels.forEach(function (panel) { resizeObserver.observe(panel); });
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { scheduleRebuild(true); });
  }

  section.querySelectorAll('img').forEach(function (image) {
    if (!image.complete) {
      image.addEventListener('load', function () { scheduleRebuild(false); }, { once: true });
      image.addEventListener('error', function () { scheduleRebuild(false); }, { once: true });
    }
  });

  window.plGoToMethodologyFirstPanel = function (options) {
    const opts = options || {};
    const behavior = opts.smooth === false || reducedMotion.matches ? 'auto' : 'smooth';

    state.activeIndex = 0;
    updateActive(0, 0);

    if (state.mode === 'pinned' && state.scrollTrigger) {
      if (window.ScrollTrigger && typeof window.ScrollTrigger.refresh === 'function') {
        window.ScrollTrigger.refresh();
      }
      window.scrollTo({ top: state.scrollTrigger.start, behavior: behavior });
    } else {
      viewport.scrollLeft = 0;
      section.scrollIntoView({ behavior: behavior, block: 'start' });
    }

    window.setTimeout(function () {
      updateActive(0, 0);
      if (typeof window.plSmoothScrollSync === 'function') window.plSmoothScrollSync();
      if (window.ScrollTrigger && typeof window.ScrollTrigger.update === 'function') {
        window.ScrollTrigger.update();
      }
    }, behavior === 'smooth' ? 720 : 40);
  };

  section.setAttribute('data-methodology-ready', 'true');
  updateActive(0, 0);
  scheduleRebuild(true);
})();
