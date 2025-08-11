  /* =========================
   script.js — PA360 (Updated)
   - resilient (no errors if elements are missing)
   - smooth scrolling for internal anchors
   - mobile navbar toggle (aria-friendly)
   - disabled CTA handling (aria-live feedback)
   - scroll animations via IntersectionObserver (with fallback)
   - hero video fallback handling
   - heading reposition fix for desktop
   ========================= */

(function () {
  'use strict';

  /* ---------------------------
     Utility: safe query
     --------------------------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) =>
    Array.prototype.slice.call(ctx.querySelectorAll(sel || ''));

  /* ---------------------------
     Smooth scroll for internal anchors (only #hash links)
     --------------------------- */
  $$('.anchor, a[href^="#"]').forEach((anchor) => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#' || !href.startsWith('#')) return;

    anchor.addEventListener('click', (e) => {
      if (anchor.getAttribute('href').startsWith('mailto:')) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        try {
          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
        } catch (err) {}
      }
    });
  });

  /* ---------------------------
     Mobile / small-screen navbar toggle
     --------------------------- */
  const toggleButton = $('.navbar__toggle');
  const navbarMenu = $('.navbar__menu');

  if (toggleButton && navbarMenu) {
    toggleButton.addEventListener('click', () => {
      const expanded =
        toggleButton.getAttribute('aria-expanded') === 'true' ? 'false' : 'true';
      toggleButton.setAttribute('aria-expanded', expanded);
      navbarMenu.classList.toggle('active');
    });

    navbarMenu.addEventListener('click', (ev) => {
      const t = ev.target;
      if (t && t.tagName === 'A') {
        navbarMenu.classList.remove('active');
        toggleButton.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------------------------
     Disabled CTA handling
     --------------------------- */
  let liveRegion = $('#pa360-live-region');
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'pa360-live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.position = 'absolute';
    liveRegion.style.left = '-9999px';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.overflow = 'hidden';
    document.body.appendChild(liveRegion);
  }

  $$('.btn--disabled').forEach((btn) => {
    btn.setAttribute('aria-disabled', 'true');

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      liveRegion.textContent =
        'This feature is launching soon. Please express interest via email for priority updates.';

      try {
        btn.classList.add('btn--pulse-temp');
        window.setTimeout(() => btn.classList.remove('btn--pulse-temp'), 800);
      } catch (err) {}
    });
  });

  /* ---------------------------
     Scroll-triggered animations
     --------------------------- */
  const animateEls = $$('.animate-on-scroll');

  if (animateEls.length) {
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('show');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          root: null,
          rootMargin: '0px',
          threshold: 0.12,
        }
      );

      animateEls.forEach((el) => io.observe(el));
    } else {
      const onScroll = () => {
        const triggerBottom = window.innerHeight * 0.85;
        animateEls.forEach((el) => {
          const boxTop = el.getBoundingClientRect().top;
          if (boxTop < triggerBottom) el.classList.add('show');
        });
      };
      window.addEventListener('scroll', throttle(onScroll, 150));
      window.addEventListener('load', onScroll);
      window.addEventListener('resize', throttle(onScroll, 250));
      onScroll();
    }
  }

  /* ---------------------------
     Hero video fallback handling
     --------------------------- */
  const heroVideo = $('#heroVideo');
  if (heroVideo) {
    heroVideo.addEventListener('error', () => {
      heroVideo.style.display = 'none';
      const hero = $('.hero');
      if (hero && !$('.hero .fallback-hero')) {
        const fallback = document.createElement('div');
        fallback.className = 'fallback-hero';
        fallback.style.width = '100%';
        fallback.style.height = '100%';
        fallback.style.background = 'linear-gradient(180deg,#0b3f2b,#063423)';
        fallback.style.opacity = '0.3';
        fallback.style.position = 'absolute';
        fallback.style.inset = '0';
        fallback.style.zIndex = '1';
        hero.appendChild(fallback);
      }
    });
  }

  /* ---------------------------
     Heading reposition fix (desktop)
     --------------------------- */
  function repositionHeading() {
    const section = document.querySelector('.your-section-class'); // replace with real selector
    let heading = section ? section.querySelector('h2, h1, .your-heading-class') : null;

    if (heading && section && window.innerWidth >= 1024) {
      if (section.firstElementChild !== heading) {
        section.insertBefore(heading, section.firstChild);
      }
    }
  }

  document.addEventListener('DOMContentLoaded', repositionHeading);
  window.addEventListener('resize', throttle(repositionHeading, 250));

  /* ---------------------------
     Helpers
     --------------------------- */
  function throttle(fn, wait) {
    let last = 0;
    return function (...args) {
      const now = Date.now();
      if (now - last >= wait) {
        last = now;
        fn.apply(this, args);
      }
    };
  }

  window.PA360 = window.PA360 || {};
  window.PA360.utils = window.PA360.utils || {
    smoothScrollTo: (selector) => {
      const el = document.querySelector(selector);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    },
  };
})();
