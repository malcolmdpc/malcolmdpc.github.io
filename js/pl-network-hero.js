(() => {
  const root = document.querySelector('#home .pl-network-hero');
  const canvas = root?.querySelector('.pl-network-hero__canvas');
  const home = root?.closest('#home');
  const visual = root?.closest('.pl-home-network-visual');
  const kicker = home?.querySelector('.hero-entry-kicker');
  const technologyBar = home?.querySelector('.hero-tech-marquee');
  const heroContent = home?.querySelector('.about-text');

  if (!root || !canvas || !home || !visual || !kicker || !technologyBar) return;

  const context = canvas.getContext('2d');
  if (!context) return;

  const NEAREST_NEIGHBORS = 5;
  const PARTICLE_INCREASE = 1.8;
  const MAX_POINTER_CONNECTORS = 5;
  const TIMESTEP = 1000 / 60;
  const DRAG_HIT_PADDING = 13;
  const DRAG_MIN_HIT_AREA = 18;
  const MAX_RELEASE_SPEED = 4.8;
  const RELEASE_INERTIA = 0.9;
  const TABLET_MIN_WIDTH = 768;

  const colorThemes = [
    { circle: '#ffd21d', line: '#4cc9f0' },
    { circle: '#ff4d8d', line: '#2ee6a6' },
    { circle: '#8cff66', line: '#ff9f1c' },
    { circle: '#ff6b35', line: '#6ea8fe' },
    { circle: '#c77dff', line: '#00f5d4' }
  ];

  let selectedTheme = 4;
  let particleObjects = [];
  let pointerInside = false;
  let pointerX = 0;
  let pointerY = 0;
  let activePointerId = null;
  let draggingParticle = null;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragLastX = 0;
  let dragLastY = 0;
  let dragLastTime = 0;
  let dragVelocityX = 0;
  let dragVelocityY = 0;
  let dragMoved = false;
  let suppressNextClick = false;
  let lastTimestamp = 0;
  let animationFrame = 0;
  let sceneWidth = 1;
  let sceneHeight = 1;
  let sceneVisible = true;
  let verticalBoundsFrame = 0;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const currentTheme = () => colorThemes[selectedTheme];
  const randomNumber = (min, max) => Math.random() * (max - min) + min;
  const randomInteger = (min, max) => Math.floor(randomNumber(Math.ceil(min), Math.floor(max)));
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  const updateVerticalBounds = () => {
    verticalBoundsFrame = 0;

    if (window.innerWidth < TABLET_MIN_WIDTH) {
      visual.style.removeProperty('--pl-network-bound-top');
      visual.style.removeProperty('--pl-network-bound-bottom');
      return;
    }

    const homeBounds = home.getBoundingClientRect();
    const kickerBounds = kicker.getBoundingClientRect();
    const technologyBounds = technologyBar.getBoundingClientRect();
    const top = clamp(kickerBounds.top - homeBounds.top, 0, homeBounds.height);
    const bottom = clamp(homeBounds.bottom - technologyBounds.bottom, 0, homeBounds.height);

    visual.style.setProperty('--pl-network-bound-top', `${top.toFixed(2)}px`);
    visual.style.setProperty('--pl-network-bound-bottom', `${bottom.toFixed(2)}px`);
  };

  const scheduleVerticalBounds = () => {
    window.cancelAnimationFrame(verticalBoundsFrame);
    verticalBoundsFrame = window.requestAnimationFrame(updateVerticalBounds);
  };

  const createParticleRadius = (depth) => {
    const baseRadius = Math.random() < 0.22
      ? randomNumber(6.1, 9.2)
      : randomNumber(2.3, 5.5);
    return baseRadius * depth;
  };

  class Particle {
    constructor() {
      this.x = randomNumber(0, sceneWidth);
      this.y = randomNumber(0, sceneHeight);
      this.z = randomNumber(0.58, 1.08);
      this.r = createParticleRadius(this.z);
      this.isDragged = false;
      this.setRandomVelocity();
    }

    setVelocity(angle, speed) {
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
    }

    setRandomVelocity() {
      this.setVelocity(randomNumber(1, 360) * 0.01745, randomNumber(0.24, 0.75));
    }

    draw() {
      const theme = currentTheme();
      context.save();
      context.beginPath();
      context.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      context.fillStyle = theme.circle;
      context.shadowColor = theme.circle;
      context.shadowBlur = this.r > 5.5 ? 8 : 3;
      context.fill();
      context.restore();
    }

    update() {
      if (this.isDragged) return;

      this.x += this.vx;
      this.y += this.vy;

      const speed = Math.hypot(this.vx, this.vy);
      if (speed > 1.1) {
        this.vx *= 0.992;
        this.vy *= 0.992;
      }

      if (speed < 0.18) {
        const angle = Math.atan2(this.vy, this.vx) || randomNumber(1, 360) * 0.01745;
        this.setVelocity(angle, 0.24);
      }
    }

    reconfigure() {
      const side = randomInteger(1, 5);
      let angle;

      if (side === 1) {
        this.x = randomNumber(0, sceneWidth);
        this.y = -10;
        angle = randomNumber(10, 170) * 0.01745;
      } else if (side === 2) {
        this.x = sceneWidth + 10;
        this.y = randomNumber(0, sceneHeight);
        angle = randomNumber(100, 260) * 0.01745;
      } else if (side === 3) {
        this.x = randomNumber(0, sceneWidth);
        this.y = sceneHeight + 10;
        angle = randomNumber(190, 350) * 0.01745;
      } else {
        this.x = -10;
        this.y = randomNumber(0, sceneHeight);
        angle = randomNumber(10, 350) * 0.01745;
      }

      this.z = randomNumber(0.58, 1.08);
      this.r = createParticleRadius(this.z);
      this.setVelocity(angle, randomNumber(0.24, 0.75));
    }
  }

  const drawConnector = (x1, y1, x2, y2, options = {}) => {
    const theme = currentTheme();
    context.save();
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.strokeStyle = theme.line;
    context.globalAlpha = options.alpha ?? 0.6;
    context.lineWidth = options.lineWidth ?? 0.6;
    context.lineCap = 'round';
    context.shadowColor = theme.line;
    context.shadowBlur = options.glow ?? 0;
    context.stroke();
    context.restore();
  };

  const resizeCanvas = () => {
    const bounds = root.getBoundingClientRect();
    const ratioLimit = bounds.width <= 991 ? 1.5 : 2;
    const ratio = Math.min(window.devicePixelRatio || 1, ratioLimit);

    sceneWidth = Math.max(1, bounds.width);
    sceneHeight = Math.max(1, bounds.height);
    canvas.width = Math.max(1, Math.round(sceneWidth * ratio));
    canvas.height = Math.max(1, Math.round(sceneHeight * ratio));
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    const baseParticleCount = Math.max(
      14,
      Math.min(34, Math.round(Math.max(sceneWidth, sceneHeight) / 24))
    );
    const particleCount = Math.round(baseParticleCount * PARTICLE_INCREASE);

    particleObjects = Array.from({ length: particleCount }, () => new Particle());
    draggingParticle = null;
    activePointerId = null;
    root.classList.remove('pl-network-hero--dragging');
  };

  const drawPointerConnectors = () => {
    particleObjects
      .filter((particle) => particle !== draggingParticle)
      .map((particle) => ({
        particle,
        distance: Math.hypot(particle.x - pointerX, particle.y - pointerY)
      }))
      .sort((first, second) => first.distance - second.distance)
      .slice(0, MAX_POINTER_CONNECTORS)
      .forEach(({ particle, distance }) => {
        drawConnector(particle.x, particle.y, pointerX, pointerY, {
          lineWidth: Math.max(0.78, 1.45 - distance / 300),
          alpha: 0.92,
          glow: 5
        });
      });
  };

  const drawAmbientConnectors = () => {
    const uniquePairs = new Map();

    particleObjects.forEach((particle, particleIndex) => {
      particleObjects
        .map((candidate, candidateIndex) => ({
          candidateIndex,
          distance: candidateIndex === particleIndex
            ? Infinity
            : Math.hypot(particle.x - candidate.x, particle.y - candidate.y)
        }))
        .sort((first, second) => first.distance - second.distance)
        .slice(0, NEAREST_NEIGHBORS)
        .forEach(({ candidateIndex, distance }) => {
          const firstIndex = Math.min(particleIndex, candidateIndex);
          const secondIndex = Math.max(particleIndex, candidateIndex);
          const key = `${firstIndex}-${secondIndex}`;

          if (!uniquePairs.has(key)) {
            uniquePairs.set(key, { firstIndex, secondIndex, distance });
          }
        });
    });

    const alpha = Math.max(0.28, 0.54 - Math.max(0, NEAREST_NEIGHBORS - 2) * 0.045);
    uniquePairs.forEach(({ firstIndex, secondIndex, distance }) => {
      const first = particleObjects[firstIndex];
      const second = particleObjects[secondIndex];
      drawConnector(first.x, first.y, second.x, second.y, {
        lineWidth: Math.max(0.24, 0.72 - distance / 560),
        alpha,
        glow: 1.2
      });
    });
  };

  const renderFrame = (updateParticles) => {
    context.clearRect(0, 0, sceneWidth, sceneHeight);

    if (updateParticles) {
      particleObjects.forEach((particle) => {
        particle.update();
        if (
          !particle.isDragged &&
          (particle.x <= -11 || particle.x >= sceneWidth + 11 ||
            particle.y <= -11 || particle.y >= sceneHeight + 11)
        ) {
          particle.reconfigure();
        }
      });
    }

    drawAmbientConnectors();
    if (pointerInside) drawPointerConnectors();
    particleObjects.forEach((particle) => particle.draw());
  };

  const mainLoop = (timestamp) => {
    if (!sceneVisible || reducedMotion.matches || document.hidden) {
      animationFrame = 0;
      return;
    }

    animationFrame = window.requestAnimationFrame(mainLoop);
    if (timestamp - lastTimestamp < TIMESTEP) return;

    lastTimestamp = timestamp;
    renderFrame(true);
  };

  const startAnimation = () => {
    window.cancelAnimationFrame(animationFrame);
    animationFrame = 0;

    if (reducedMotion.matches || !sceneVisible || document.hidden) {
      renderFrame(false);
      return;
    }

    lastTimestamp = 0;
    animationFrame = window.requestAnimationFrame(mainLoop);
  };

  const setPointerPosition = (event) => {
    const bounds = root.getBoundingClientRect();
    pointerX = event.clientX - bounds.left;
    pointerY = event.clientY - bounds.top;
  };

  const getDraggableParticle = (x, y) => {
    let nearest = null;
    let nearestDistance = Infinity;

    particleObjects.forEach((particle) => {
      const distance = Math.hypot(particle.x - x, particle.y - y);
      const hitRadius = Math.max(DRAG_MIN_HIT_AREA, particle.r + DRAG_HIT_PADDING);
      if (distance <= hitRadius && distance < nearestDistance) {
        nearest = particle;
        nearestDistance = distance;
      }
    });

    return nearest;
  };

  const releaseDraggedParticle = (event) => {
    if (!draggingParticle || event.pointerId !== activePointerId) return;

    const particle = draggingParticle;
    const speed = Math.hypot(dragVelocityX, dragVelocityY);
    const previousSpeed = Math.hypot(particle.vx, particle.vy);

    if (dragMoved && speed > 0.02) {
      const velocityX = dragVelocityX * TIMESTEP * RELEASE_INERTIA;
      const velocityY = dragVelocityY * TIMESTEP * RELEASE_INERTIA;
      const frameSpeed = Math.hypot(velocityX, velocityY);
      const scale = frameSpeed > MAX_RELEASE_SPEED ? MAX_RELEASE_SPEED / frameSpeed : 1;
      particle.vx = velocityX * scale;
      particle.vy = velocityY * scale;
    } else if (previousSpeed < 0.18) {
      particle.setRandomVelocity();
    }

    particle.isDragged = false;
    draggingParticle = null;
    suppressNextClick = dragMoved;
    activePointerId = null;
    root.classList.remove('pl-network-hero--dragging');

    if (root.hasPointerCapture?.(event.pointerId)) {
      root.releasePointerCapture(event.pointerId);
    }
  };

  root.addEventListener('click', () => {
    if (suppressNextClick) {
      suppressNextClick = false;
      return;
    }
    selectedTheme = (selectedTheme + 1) % colorThemes.length;
    if (reducedMotion.matches) renderFrame(false);
  });

  root.addEventListener('pointerdown', (event) => {
    setPointerPosition(event);
    pointerInside = true;

    const particle = getDraggableParticle(pointerX, pointerY);
    if (!particle) return;

    activePointerId = event.pointerId;
    draggingParticle = particle;
    draggingParticle.isDragged = true;
    dragStartX = pointerX;
    dragStartY = pointerY;
    dragLastX = pointerX;
    dragLastY = pointerY;
    dragLastTime = performance.now();
    dragVelocityX = 0;
    dragVelocityY = 0;
    dragMoved = false;
    root.classList.add('pl-network-hero--dragging');
    root.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  });

  root.addEventListener('pointermove', (event) => {
    setPointerPosition(event);
    pointerInside = true;
    if (!draggingParticle || event.pointerId !== activePointerId) return;

    const now = performance.now();
    const elapsed = Math.max(8, now - dragLastTime);
    const rawVelocityX = (pointerX - dragLastX) / elapsed;
    const rawVelocityY = (pointerY - dragLastY) / elapsed;
    dragVelocityX = dragVelocityX * 0.58 + rawVelocityX * 0.42;
    dragVelocityY = dragVelocityY * 0.58 + rawVelocityY * 0.42;
    draggingParticle.x = clamp(pointerX, draggingParticle.r, sceneWidth - draggingParticle.r);
    draggingParticle.y = clamp(pointerY, draggingParticle.r, sceneHeight - draggingParticle.r);
    dragLastX = pointerX;
    dragLastY = pointerY;
    dragLastTime = now;
    if (Math.hypot(pointerX - dragStartX, pointerY - dragStartY) > 3) dragMoved = true;
    event.preventDefault();
  });

  root.addEventListener('pointerup', releaseDraggedParticle);
  root.addEventListener('pointercancel', releaseDraggedParticle);
  root.addEventListener('pointerleave', () => {
    if (!draggingParticle) pointerInside = false;
  });

  const handleResize = () => {
    resizeCanvas();
    if (reducedMotion.matches || !sceneVisible) renderFrame(false);
  };

  if ('ResizeObserver' in window) {
    new ResizeObserver(handleResize).observe(root);

    const layoutObserver = new ResizeObserver(scheduleVerticalBounds);
    layoutObserver.observe(home);
    layoutObserver.observe(kicker);
    layoutObserver.observe(technologyBar);
    if (heroContent) layoutObserver.observe(heroContent);
  } else {
    window.addEventListener('resize', handleResize, { passive: true });
  }

  window.addEventListener('resize', scheduleVerticalBounds, { passive: true });
  home.addEventListener('animationend', (event) => {
    if (event.target === kicker || event.target === technologyBar) {
      scheduleVerticalBounds();
    }
  });

  window.addEventListener('load', scheduleVerticalBounds, { once: true });
  document.fonts?.ready.then(scheduleVerticalBounds);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      sceneVisible = entries[0]?.isIntersecting ?? true;
      startAnimation();
    }, { rootMargin: '120px 0px' }).observe(root);
  }

  reducedMotion.addEventListener?.('change', startAnimation);
  document.addEventListener('visibilitychange', startAnimation);

  updateVerticalBounds();
  resizeCanvas();
  startAnimation();
})();
