(() => {
  const figure = document.querySelector('[data-ai-figure]');
  const toggle = document.querySelector('[data-figure-toggle]');
  if (!figure || !toggle) return;

  const scenes = Array.from(figure.querySelectorAll('[data-figure-scene]'));
  const selectors = Array.from(figure.querySelectorAll('[data-figure-select]'));
  const navigation = figure.querySelector('[data-figure-nav]');
  const controls = figure.querySelector('[data-figure-controls]');
  const motionPreference = typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;
  const canObserve = typeof window.IntersectionObserver === 'function';
  let inViewport = !canObserve;
  let userPaused = false;
  let hovered = figure.matches(':hover');
  let focusedWithin = figure.contains(document.activeElement);
  let activeScene = 0;
  let autoplayTimer = null;

  function selectScene(index) {
    activeScene = index;
    figure.dataset.activeScene = String(index);
    scenes.forEach((scene, sceneIndex) => {
      const hidden = sceneIndex !== index;
      scene.toggleAttribute('hidden', hidden);
      scene.setAttribute('aria-hidden', String(hidden));
    });
    selectors.forEach(button => {
      button.setAttribute('aria-pressed', String(Number(button.dataset.figureSelect) === index));
    });
  }

  function motionAllowed() {
    return !userPaused && !document.hidden && inViewport
      && !(motionPreference && motionPreference.matches);
  }

  function autoplayAllowed() {
    return scenes.length > 1 && motionAllowed() && !hovered && !focusedWithin;
  }

  function clearAutoplay() {
    if (autoplayTimer !== null) window.clearTimeout(autoplayTimer);
    autoplayTimer = null;
  }

  function syncAutoplay() {
    if (!autoplayAllowed()) {
      clearAutoplay();
    } else if (autoplayTimer === null) {
      // Each return to the figure starts a full interval; missed slides never catch up.
      autoplayTimer = window.setTimeout(() => {
        autoplayTimer = null;
        if (!autoplayAllowed()) return;
        selectScene((activeScene + 1) % scenes.length);
        syncAutoplay();
      }, 10000);
    }
  }

  function syncMotion() {
    const reducedMotion = Boolean(motionPreference && motionPreference.matches);
    figure.dataset.motion = motionAllowed() ? 'running' : 'paused';
    toggle.hidden = reducedMotion;
    // System pauses must not erase the visitor's explicit pause choice.
    toggle.setAttribute('aria-pressed', String(userPaused));
    syncAutoplay();
  }

  toggle.addEventListener('click', () => {
    userPaused = !userPaused;
    syncMotion();
  });
  selectors.forEach(button => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.figureSelect);
      if (!Number.isInteger(index) || index < 0 || index >= scenes.length) return;
      selectScene(index);
      // Inspecting a new scene preserves the visitor's animation preference.
      clearAutoplay();
      syncMotion();
    });
  });
  figure.addEventListener('mouseenter', () => { hovered = true; syncAutoplay(); });
  figure.addEventListener('mouseleave', () => { hovered = false; syncAutoplay(); });
  figure.addEventListener('focusin', () => { focusedWithin = true; syncAutoplay(); });
  figure.addEventListener('focusout', event => {
    focusedWithin = figure.contains(event.relatedTarget);
    syncAutoplay();
  });
  document.addEventListener('visibilitychange', syncMotion);

  if (motionPreference) {
    if (typeof motionPreference.addEventListener === 'function') {
      motionPreference.addEventListener('change', syncMotion);
    } else if (typeof motionPreference.addListener === 'function') {
      motionPreference.addListener(syncMotion);
    }
  }

  if (canObserve) {
    const observer = new window.IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.target === figure) inViewport = entry.isIntersecting;
      }
      syncMotion();
    });
    observer.observe(figure);
  }

  if (scenes.length) selectScene(0);
  if (navigation) navigation.hidden = scenes.length < 2;
  if (controls) controls.hidden = false;
  syncMotion();
})();
