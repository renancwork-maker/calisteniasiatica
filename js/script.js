/* Interações locais; rastreamento UTMify carregado no HEAD do HTML. */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* Perguntas frequentes, com estado acessível e atualização no redimensionamento. */
  const faqItems = [...document.querySelectorAll('.faq-item')];
  faqItems.forEach((item, idx) => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    if (!trigger || !content) return;
    content.id ||= `faq-panel-${idx + 1}`;
    trigger.setAttribute('type', 'button');
    trigger.setAttribute('aria-controls', content.id);
    trigger.setAttribute('aria-expanded', 'false');
    trigger.addEventListener('click', () => {
      const wasExpanded = item.classList.contains('active');
      faqItems.forEach(other => {
        other.classList.remove('active');
        const otherTrigger = other.querySelector('.faq-trigger');
        const otherContent = other.querySelector('.faq-content');
        if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        if (otherContent) otherContent.style.maxHeight = '';
      });
      if (!wasExpanded) {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = `${content.scrollHeight}px`;
      }
    });
  });
  window.addEventListener('resize', () => {
    const activeContent = document.querySelector('.faq-item.active .faq-content');
    if (activeContent) activeContent.style.maxHeight = `${activeContent.scrollHeight}px`;
  }, { passive: true });

  /* Níveis A1–C2: clique para abrir, segundo clique para recolher. */
  const curriculumTabs = [...document.querySelectorAll('.curriculum-tab-btn')];
  const curriculumPanes = [...document.querySelectorAll('.curriculum-pane')];
  const placeholder = document.getElementById('curriculum-placeholder');
  curriculumTabs.forEach(button => {
    const level = button.getAttribute('data-level');
    const pane = level ? document.getElementById(`pane-${level}`) : null;
    button.setAttribute('type', 'button');
    button.setAttribute('aria-expanded', 'false');
    if (pane) button.setAttribute('aria-controls', pane.id);
    button.addEventListener('click', () => {
      const wasActive = button.classList.contains('active');
      curriculumTabs.forEach(tab => {
        tab.classList.remove('active');
        tab.setAttribute('aria-expanded', 'false');
      });
      curriculumPanes.forEach(p => p.classList.remove('active'));
      if (!wasActive && pane) {
        button.classList.add('active');
        button.setAttribute('aria-expanded', 'true');
        pane.classList.add('active');
      }
      if (placeholder) placeholder.classList.toggle('hidden', !wasActive && Boolean(pane));
    });
  });

  /* Carrosséis contínuos, arrastáveis com mouse, touch ou caneta. */
  function setupMarquee(carouselSelector, trackSelector, durationSeconds) {
    const carousel = document.querySelector(carouselSelector);
    const track = carousel?.querySelector(trackSelector);
    if (!track) return;
    track.style.animation = 'none';
    const firstGroup = track.querySelector('.carousel-group, .testimonials-group');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = firstGroup?.offsetWidth || track.offsetWidth / 2;
    let offset = 0;
    let pointerId = null;
    let originX = 0;
    let originOffset = 0;
    let dragged = false;
    let lastFrame = performance.now();

    // Keep horizontal offset within one repeated group, including large drags.
    const wrap = v => width > 0 ? -((((-v % width) + width) % width)) : v;
    const render = () => { track.style.transform = `translate3d(${offset}px, 0, 0)`; };
    const resize = () => {
      width = firstGroup?.offsetWidth || track.offsetWidth / 2;
      offset = wrap(offset);
      render();
    };
    window.addEventListener('resize', resize, { passive: true });
    track.querySelectorAll('img').forEach(img => img.addEventListener('dragstart', e => e.preventDefault()));

    track.addEventListener('pointerdown', e => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (pointerId !== null) return;
      pointerId = e.pointerId;
      originX = e.clientX;
      originOffset = offset;
      dragged = false;
      carousel.classList.add('grabbing');
      try { track.setPointerCapture(e.pointerId); } catch (_) { /* optional */ }
    });
    track.addEventListener('pointermove', e => {
      if (e.pointerId !== pointerId) return;
      const dx = e.clientX - originX;
      if (Math.abs(dx) > 7) dragged = true;
      offset = wrap(originOffset + dx);
      render();
    });
    function endDrag(e) {
      if (e.pointerId !== pointerId) return;
      pointerId = null;
      carousel.classList.remove('grabbing');
      if (dragged) {
        track.setAttribute('data-dragged', 'true');
        window.setTimeout(() => track.removeAttribute('data-dragged'), 350);
      }
      lastFrame = performance.now();
    }
    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);
    // Avoid opening lightbox when interaction was a drag.
    track.addEventListener('click', e => {
      if (track.hasAttribute('data-dragged')) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);

    let rafId = null;
    let visible = false;
    function animate(now) {
      if (!visible || reduceMotion || document.hidden) { rafId = null; return; }
      const dt = Math.min(Math.max(0, now - lastFrame), 80);
      if (dt >= 28) { // cap animation work to about 30 FPS for mobile battery life
        lastFrame = now;
        if (pointerId === null && width > 0) {
          offset = wrap(offset - width * dt / (durationSeconds * 1000));
          render();
        }
      }
      rafId = requestAnimationFrame(animate);
    }
    function resumeIfVisible() {
      if (!visible || document.hidden || reduceMotion || rafId !== null) return;
      lastFrame = performance.now();
      rafId = requestAnimationFrame(animate);
    }
    const intersection = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (!visible && rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
      resumeIfVisible();
    }, { rootMargin: '150px 0px', threshold: 0 });
    intersection.observe(carousel);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
      else resumeIfVisible();
    });
  }
  setupMarquee('.preview-carousel', '.carousel-track', 68);
  setupMarquee('.testimonials-carousel', '.testimonials-track', 55);

  /* Abrir preview em tela cheia, navegar, deslizar e fechar. */
  const modal = document.getElementById('lightbox-modal');
  const previewSlides = [...document.querySelectorAll('.preview-carousel .carousel-slide')];
  const firstGroupImages = [...document.querySelectorAll('.preview-carousel .carousel-group:first-child img')];
  if (modal && firstGroupImages.length) {
    const images = firstGroupImages.map(img => ({ src: img.dataset.fullsrc || img.getAttribute('src'), alt: img.alt }));
    const image = document.getElementById('lightbox-img');
    const caption = document.getElementById('lightbox-caption');
    const close = document.getElementById('lightbox-close');
    const previous = document.getElementById('lightbox-prev');
    const next = document.getElementById('lightbox-next');
    const backdrop = document.getElementById('lightbox-backdrop');
    let current = 0;
    let priorFocus = null;
    let previousOverflow = '';
    let touchX = null;
    const isOpen = () => modal.classList.contains('show');

    function update(index) {
      current = (index + images.length) % images.length;
      image.src = images[current].src;
      image.alt = images[current].alt;
      caption.textContent = `${images[current].alt} (${current + 1}/${images.length})`;
    }
    function open(index) {
      priorFocus = document.activeElement;
      previousOverflow = document.body.style.overflow;
      update(index);
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      close.focus();
    }
    function dismiss() {
      if (!isOpen()) return;
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = previousOverflow;
      if (priorFocus && typeof priorFocus.focus === 'function') priorFocus.focus();
    }
    previewSlides.forEach((slide, index) => {
      const openThis = () => {
        if (!slide.closest('.carousel-track')?.hasAttribute('data-dragged')) open(index % images.length);
      };
      slide.setAttribute('tabindex', '0');
      slide.setAttribute('role', 'button');
      slide.setAttribute('aria-label', `Ampliar ${images[index % images.length].alt}`);
      slide.addEventListener('click', openThis);
      slide.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openThis();
        }
      });
    });
    close.addEventListener('click', dismiss);
    backdrop.addEventListener('click', dismiss);
    previous.addEventListener('click', () => update(current - 1));
    next.addEventListener('click', () => update(current + 1));
    document.addEventListener('keydown', e => {
      if (!isOpen()) return;
      if (e.key === 'Escape') { e.preventDefault(); dismiss(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); update(current - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); update(current + 1); }
      if (e.key === 'Tab') {
        // Keep keyboard focus inside the open dialog.
        const controls = [close, previous, next];
        const i = controls.indexOf(document.activeElement);
        if (i === -1) { e.preventDefault(); close.focus(); }
        else if (e.shiftKey && i === 0) { e.preventDefault(); next.focus(); }
        else if (!e.shiftKey && i === controls.length - 1) { e.preventDefault(); close.focus(); }
      }
    });
    modal.addEventListener('touchstart', e => {
      if (e.touches.length === 1) touchX = e.touches[0].clientX;
    }, { passive: true });
    modal.addEventListener('touchend', e => {
      if (touchX === null || !isOpen()) return;
      const dx = e.changedTouches[0].clientX - touchX;
      touchX = null;
      if (Math.abs(dx) > 50) update(current + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }

  /* Âncoras de compra, com espaço para a faixa fixa, sem modificar links externos. */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    const hash = link.getAttribute('href');
    if (hash === '#') return;
    const dest = document.getElementById(hash.slice(1));
    if (!dest) return;
    link.addEventListener('click', e => {
      e.preventDefault();
      const bannerHeight = document.querySelector('.promo-banner')?.offsetHeight || 0;
      const top = dest.getBoundingClientRect().top + window.scrollY - bannerHeight - 16;
      const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
      window.scrollTo({ top: Math.max(0, top), behavior });
    });
  });


});
