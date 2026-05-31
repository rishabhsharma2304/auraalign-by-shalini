/**
 * AuraAlign by Shalini — main.js
 * Vanilla JS only. No dependencies, no build step.
 * Handles: config wiring, WhatsApp links, mobile nav, testimonial carousel,
 * smooth scroll, scroll-reveal, active-nav highlight, floating WhatsApp button.
 */
(function () {
  'use strict';

  var CFG = window.SITE_CONFIG || {};
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===================================================================
     1. WhatsApp link builder
     =================================================================== */
  function whatsappUrl(message) {
    var num = String(CFG.whatsappNumber || '').replace(/\D/g, '');
    var text = encodeURIComponent(message || CFG.whatsappDefaultMessage || '');
    return 'https://wa.me/' + num + (text ? '?text=' + text : '');
  }

  function applyWhatsappLinks() {
    document.querySelectorAll('[data-whatsapp]').forEach(function (el) {
      var custom = el.getAttribute('data-whatsapp-message');
      el.setAttribute('href', whatsappUrl(custom));
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
    });
  }

  /* ===================================================================
     2. Config-driven text & attributes
     [data-config="key"]            -> textContent from SITE_CONFIG[key]
     [data-config-attr="key:attr"]  -> sets an attribute
     [data-config-href="phone|email|instagram|facebook|google"]
     [data-config-show="key"]       -> element removed if config value empty
     =================================================================== */
  function applyConfigText() {
    document.querySelectorAll('[data-config]').forEach(function (el) {
      var key = el.getAttribute('data-config');
      var val = CFG[key];
      if (val !== undefined && val !== null && val !== '') {
        el.textContent = val;
      }
    });

    document.querySelectorAll('[data-config-tmpl]').forEach(function (el) {
      // template uses {{key}} tokens, e.g. "{{experienceYears}}+ Years"
      el.textContent = el.getAttribute('data-config-tmpl').replace(/\{\{(\w+)\}\}/g, function (_, k) {
        return (CFG[k] !== undefined && CFG[k] !== null) ? CFG[k] : '';
      });
    });

    document.querySelectorAll('[data-config-href]').forEach(function (el) {
      var key = el.getAttribute('data-config-href');
      if (key === 'phone' && CFG.phone) {
        el.setAttribute('href', 'tel:' + String(CFG.phone).replace(/[\s\-()]/g, ''));
      } else if (key === 'email' && CFG.email) {
        el.setAttribute('href', 'mailto:' + CFG.email);
      } else if (key === 'instagram' && CFG.instagramUrl) {
        el.setAttribute('href', CFG.instagramUrl);
      } else if (key === 'facebook' && CFG.facebookUrl) {
        el.setAttribute('href', CFG.facebookUrl);
      } else if (key === 'google' && CFG.googleBusinessUrl) {
        el.setAttribute('href', CFG.googleBusinessUrl);
      }
    });
  }

  // Remove elements whose backing config value is empty (no dangling links).
  function applyConditionalElements() {
    document.querySelectorAll('[data-config-show]').forEach(function (el) {
      var key = el.getAttribute('data-config-show');
      var val = CFG[key];
      if (val === undefined || val === null || val === '') {
        el.parentNode && el.parentNode.removeChild(el);
      }
    });
  }

  /* ===================================================================
     3. Google Map embed (contact page)
     =================================================================== */
  function applyMapEmbed() {
    var holder = document.querySelector('[data-map-embed]');
    if (!holder) return;
    if (CFG.googleMapsEmbed) {
      var iframe = document.createElement('iframe');
      iframe.src = CFG.googleMapsEmbed;
      iframe.loading = 'lazy';
      iframe.title = 'Map showing ' + (CFG.brandName || 'our practice') + ' in ' + (CFG.location || '');
      iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
      iframe.setAttribute('allowfullscreen', '');
      holder.innerHTML = '';
      holder.appendChild(iframe);
    }
    // else: leave the styled placeholder already in the HTML.
  }

  /* ===================================================================
     4. Mobile navigation (overlay + focus trap + ESC)
     =================================================================== */
  function initMobileNav() {
    var toggle = document.querySelector('[data-nav-toggle]');
    var menu = document.querySelector('[data-mobile-menu]');
    var closeBtn = document.querySelector('[data-nav-close]');
    if (!toggle || !menu) return;

    var lastFocused = null;

    function focusables() {
      return menu.querySelectorAll('a[href], button:not([disabled])');
    }

    function open() {
      lastFocused = document.activeElement;
      menu.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      var f = focusables();
      if (f.length) f[0].focus();
      document.addEventListener('keydown', onKeydown);
    }

    function close() {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeydown);
      if (lastFocused) lastFocused.focus();
    }

    function onKeydown(e) {
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'Tab') {
        var f = focusables();
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }

    toggle.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    menu.querySelectorAll('a[href]').forEach(function (a) {
      a.addEventListener('click', close);
    });
  }

  /* ===================================================================
     5. Testimonial carousel
     =================================================================== */
  function initCarousel() {
    var root = document.querySelector('[data-carousel]');
    if (!root) return;
    var track = root.querySelector('.carousel__track');
    var slides = Array.prototype.slice.call(root.querySelectorAll('.carousel__slide'));
    var prevBtn = root.querySelector('[data-carousel-prev]');
    var nextBtn = root.querySelector('[data-carousel-next]');
    var dotsWrap = root.querySelector('[data-carousel-dots]');
    if (!track || slides.length === 0) return;

    var index = 0;
    var timer = null;
    var INTERVAL = 8000;

    function perView() {
      var w = window.innerWidth;
      if (w >= 1040) return 3;
      if (w >= 760) return 2;
      return 1;
    }

    function maxIndex() { return Math.max(0, slides.length - perView()); }

    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      var pages = maxIndex() + 1;
      for (var i = 0; i < pages; i++) {
        (function (i) {
          var dot = document.createElement('button');
          dot.className = 'carousel__dot';
          dot.type = 'button';
          dot.setAttribute('aria-label', 'Go to testimonial group ' + (i + 1));
          dot.addEventListener('click', function () { goTo(i, true); });
          dotsWrap.appendChild(dot);
        })(i);
      }
    }

    function update() {
      var pct = -(index * (100 / perView()));
      track.style.transform = 'translateX(' + pct + '%)';
      if (dotsWrap) {
        Array.prototype.forEach.call(dotsWrap.children, function (d, i) {
          d.classList.toggle('is-active', i === index);
          if (i === index) d.setAttribute('aria-current', 'true');
          else d.removeAttribute('aria-current');
        });
      }
    }

    function goTo(i, userInitiated) {
      var mx = maxIndex();
      if (i < 0) i = mx;
      if (i > mx) i = 0;
      index = i;
      update();
      if (userInitiated) restart();
    }

    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    function start() {
      if (reduceMotion) return;
      stop();
      timer = window.setInterval(next, INTERVAL);
    }
    function stop() { if (timer) { window.clearInterval(timer); timer = null; } }
    function restart() { stop(); start(); }

    if (nextBtn) nextBtn.addEventListener('click', function () { next(); restart(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); restart(); });

    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', start);

    // Touch swipe
    var startX = 0, startY = 0, swiping = false;
    track.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX; startY = e.touches[0].clientY; swiping = true; stop();
    }, { passive: true });
    track.addEventListener('touchend', function (e) {
      if (!swiping) return;
      swiping = false;
      var dx = e.changedTouches[0].clientX - startX;
      var dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) next(); else prev();
      }
      start();
    }, { passive: true });

    var resizeRAF;
    window.addEventListener('resize', function () {
      window.cancelAnimationFrame(resizeRAF);
      resizeRAF = window.requestAnimationFrame(function () {
        buildDots();
        if (index > maxIndex()) index = maxIndex();
        update();
      });
    });

    buildDots();
    update();
    start();
  }

  /* ===================================================================
     6. Smooth scroll for in-page anchors
     =================================================================== */
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      var target = document.getElementById(id.slice(1));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  }

  /* ===================================================================
     7. Scroll reveal
     =================================================================== */
  function initScrollReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ===================================================================
     8. Active-nav highlight
     =================================================================== */
  function initActiveNav() {
    var path = window.location.pathname.split('/').pop() || 'index.html';
    if (path === '') path = 'index.html';
    document.querySelectorAll('[data-nav] a[href]').forEach(function (a) {
      var href = a.getAttribute('href').split('/').pop();
      if (href === path || (path === 'index.html' && (href === '' || href === 'index.html'))) {
        a.setAttribute('aria-current', 'page');
      }
    });
  }

  /* ===================================================================
     9. Floating WhatsApp button bounce-in
     =================================================================== */
  function initFab() {
    var fab = document.querySelector('.fab-whatsapp');
    if (!fab) return;
    window.setTimeout(function () { fab.classList.add('is-ready'); }, 1500);
  }

  /* ===================================================================
     Init
     =================================================================== */
  function init() {
    applyConfigText();
    applyConditionalElements();
    applyWhatsappLinks();
    applyMapEmbed();
    initMobileNav();
    initCarousel();
    initSmoothScroll();
    initScrollReveal();
    initActiveNav();
    initFab();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
