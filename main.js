'use strict';

document.addEventListener('DOMContentLoaded', function () {

  // ── 1. STICKY HEADER ──
  const header = document.getElementById('site-header');
  const onScroll = () => {
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 60);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // ── 2. MOBILE DRAWER ──
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('drawer-overlay');
  const drawerClose = document.getElementById('drawer-close');

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add('open');
    if (overlay) overlay.classList.add('open');
    if (hamburger) { hamburger.classList.add('open'); hamburger.setAttribute('aria-expanded', 'true'); }
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    if (hamburger) { hamburger.classList.remove('open'); hamburger.setAttribute('aria-expanded', 'false'); }
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });

  // Close drawer when a link is clicked
  if (drawer) {
    drawer.querySelectorAll('.drawer-link').forEach(link => {
      link.addEventListener('click', closeDrawer);
    });
  }

  // ── 3. ACTIVE NAV LINK ──
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .drawer-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    const file = href.split('/').pop();
    if (file === currentFile || (currentFile === '' && file === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ── 4. SCROLL REVEAL ──
  if ('IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }

  // ── 5. STATS COUNTER ──
  const statsEl = document.querySelector('.stats-bar');
  if (statsEl) {
    const counterObs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        document.querySelectorAll('.stat-number[data-target]').forEach(el => {
          const target = parseInt(el.dataset.target) || 0;
          const suffix = el.dataset.suffix || '';
          let current = 0;
          const step = Math.max(1, Math.ceil(target / 60));
          const timer = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = current + suffix;
            if (current >= target) clearInterval(timer);
          }, 25);
        });
        counterObs.disconnect();
      }
    }, { threshold: 0.4 });
    counterObs.observe(statsEl);
  }

  // ── 6. PRODUCT FILTER ──
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');
  if (filterBtns.length && productCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        productCards.forEach(card => {
          const show = filter === 'all' || card.dataset.category === filter;
          card.style.display = show ? '' : 'none';
          if (show) setTimeout(() => { card.style.opacity = '1'; }, 10);
          else card.style.opacity = '0';
        });
      });
    });
  }

  // ── 7. TESTIMONIAL SLIDER ──
  const slides = document.querySelectorAll('.testi-slide');
  const prevBtn = document.getElementById('testi-prev');
  const nextBtn = document.getElementById('testi-next');
  const dotsContainer = document.getElementById('testi-dots');
  let current = 0, autoTimer;

  function showSlide(n) {
    if (!slides.length) return;
    slides[current].classList.remove('active');
    current = ((n % slides.length) + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (dotsContainer) {
      dotsContainer.querySelectorAll('.testi-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }
  }

  if (slides.length) {
    showSlide(0);
    if (prevBtn) prevBtn.addEventListener('click', () => { showSlide(current - 1); resetAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { showSlide(current + 1); resetAuto(); });
    if (dotsContainer) {
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => { showSlide(i); resetAuto(); });
        dotsContainer.appendChild(dot);
      });
    }
    function startAuto() { autoTimer = setInterval(() => showSlide(current + 1), 5000); }
    function resetAuto() { clearInterval(autoTimer); startAuto(); }
    startAuto();
  }

  // ── 7b. SUBTLE HERO PARALLAX (respects reduced motion) ──
  const heroImg = document.querySelector('.hero-img-wrapper');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (heroImg && !prefersReduced) {
    window.addEventListener('scroll', () => {
      const y = Math.min(window.scrollY, 600);
      heroImg.style.transform = 'translateY(' + (y * 0.05) + 'px)';
    }, { passive: true });
  }

  // ── 8. BACK TO TOP ──
  const btt = document.getElementById('back-to-top');
  if (btt) {
    window.addEventListener('scroll', () => {
      btt.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ── 9. FORM VALIDATION — CONTACT ──
  const contactForm = document.getElementById('contact-form');
  const contactSuccess = document.getElementById('contact-success');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;
      contactForm.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
          valid = false;
          field.classList.add('error');
          const err = field.parentElement.querySelector('.field-error');
          if (err) err.style.display = 'block';
        } else {
          field.classList.remove('error');
          const err = field.parentElement.querySelector('.field-error');
          if (err) err.style.display = 'none';
        }
      });
      if (valid && contactSuccess) {
        contactForm.style.display = 'none';
        contactSuccess.style.display = 'block';
        contactSuccess.scrollIntoView({ behavior: 'smooth' });
      }
    });
    contactForm.querySelectorAll('[required]').forEach(field => {
      field.addEventListener('input', () => {
        field.classList.remove('error');
        const err = field.parentElement.querySelector('.field-error');
        if (err) err.style.display = 'none';
      });
    });
  }

  // ── 10. FORM VALIDATION — ENQUIRY ──
  const enquiryForm = document.getElementById('enquiry-form');
  const enquirySuccess = document.getElementById('enquiry-success');
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;
      enquiryForm.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
          valid = false;
          field.classList.add('error');
        } else {
          field.classList.remove('error');
        }
      });
      if (valid && enquirySuccess) {
        enquiryForm.style.display = 'none';
        enquirySuccess.style.display = 'block';
        enquirySuccess.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

});
