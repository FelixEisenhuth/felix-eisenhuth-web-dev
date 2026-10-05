(() => {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let target = window.scrollY, running = false, lastTime = 0, frame = 0;
  const maximum = () => Math.max(0, document.documentElement.scrollHeight - innerHeight);
  const bound = value => Math.max(0, Math.min(maximum(), value));
  function cancel() {
    cancelAnimationFrame(frame);
    running = false;
    lastTime = 0;
    target = window.scrollY;
  }
  function tick(time) {
    const elapsed = lastTime ? Math.min(time - lastTime, 64) : 16.67;
    lastTime = time;
    target = bound(target);
    const distance = target - window.scrollY;
    if (Math.abs(distance) < 1) {
      window.scrollTo({top: target, behavior: 'instant'});
      running = false;
      lastTime = 0;
      return;
    }
    window.scrollTo({top: window.scrollY + distance * (1 - Math.exp(-elapsed / 115)), behavior: 'instant'});
    frame = requestAnimationFrame(tick);
  }
  function moveTo(value) {
    target = bound(value);
    if (motion.matches) { cancel(); window.scrollTo({top: bound(value), behavior: 'instant'}); return; }
    if (!running) { running = true; lastTime = 0; frame = requestAnimationFrame(tick); }
  }
  window.portfolioScrollTo = moveTo;
  addEventListener('wheel', event => {
    if (document.documentElement.classList.contains("is-loading")) {event.preventDefault();return;}
    if (motion.matches || event.ctrlKey || event.metaKey || !event.cancelable || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    // Leave scrollable controls and nested panels to the browser.
    for (let node = event.target instanceof Element ? event.target : null; node && node !== document.body; node = node.parentElement) {
      if (node.matches('input,textarea,select,[contenteditable="true"]')) return;
      const overflow = getComputedStyle(node).overflowY;
      if (/(auto|scroll)/.test(overflow) && node.scrollHeight > node.clientHeight) return;
    }
    event.preventDefault();
    const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
    moveTo((running ? target : window.scrollY) + delta);
  }, {passive: false});
  addEventListener('scroll', () => { if (!running) target = window.scrollY; }, {passive: true});
  addEventListener('touchstart', cancel, {passive: true});
  addEventListener('pointerdown', cancel, {passive: true});
  addEventListener('keydown', cancel);
  addEventListener('resize', () => { target = bound(target); });
  motion.addEventListener('change', cancel);
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const destination = document.querySelector(link.getAttribute('href'));
      if (!destination) return;
      event.preventDefault();
      moveTo(destination.getBoundingClientRect().top + window.scrollY);
      history.pushState(null, '', link.getAttribute('href'));
      const hadTabindex = destination.hasAttribute('tabindex');
      if (!hadTabindex) destination.setAttribute('tabindex', '-1');
      destination.focus({preventScroll: true});
      if (!hadTabindex) destination.addEventListener('blur', () => destination.removeAttribute('tabindex'), {once: true});
    });
  });
})();
