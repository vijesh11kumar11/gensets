// ============================================================
// GENSETS — main.js
// ============================================================
document.addEventListener('DOMContentLoaded', function () {

  // 1. STICKY HEADER
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 80);
    });
  }

  // 2. MOBILE HAMBURGER MENU
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileClose = document.getElementById('mobile-menu-close');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
    if (mobileClose) mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });
  }

  // 3. ACTIVE NAV LINK
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // 4. SCROLL REVEAL
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    revealElements.forEach(el => revealObserver.observe(el));
  }

  // 5. STATS COUNTER ANIMATION
  function animateCounter(el, target, duration) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { start = target; clearInterval(timer); }
      el.textContent = Math.floor(start) + (el.dataset.suffix || '');
    }, 16);
  }
  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        document.querySelectorAll('.stat-number').forEach(el => {
          const target = parseInt(el.dataset.target);
          if (!isNaN(target)) animateCounter(el, target, 1500);
        });
        statsObserver.disconnect();
      }
    }, { threshold: 0.3 });
    statsObserver.observe(statsSection);
  }

  // 6. PRODUCT CATEGORY FILTER
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');
  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        productCards.forEach(card => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = 'block';
            setTimeout(() => card.style.opacity = '1', 10);
          } else {
            card.style.opacity = '0';
            setTimeout(() => card.style.display = 'none', 200);
          }
        });
      });
    });
  }

  // 7. TESTIMONIALS SLIDER
  let currentSlide = 0;
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('testi-prev');
  const nextBtn = document.getElementById('testi-next');
  function showSlide(n) {
    if (!slides.length) return;
    slides.forEach(s => s.classList.remove('active'));
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
  }
  if (slides.length > 0) {
    showSlide(0);
    if (prevBtn) prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
    setInterval(() => showSlide(currentSlide + 1), 5000);
  }

  // 8. BACK TO TOP
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // 9. ENQUIRY FORM VALIDATION
  const enquiryForm = document.getElementById('enquiry-form');
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;
      enquiryForm.querySelectorAll('[required]').forEach(field => {
        const err = field.nextElementSibling;
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = '#ef4444';
          if (err && err.classList.contains('field-error')) err.style.display = 'block';
        } else {
          field.style.borderColor = '';
          if (err && err.classList.contains('field-error')) err.style.display = 'none';
        }
      });
      if (valid) {
        enquiryForm.style.display = 'none';
        const s = document.getElementById('form-success');
        if (s) s.style.display = 'block';
      }
    });
  }

  // 10. CONTACT FORM VALIDATION
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      contactForm.style.display = 'none';
      const s = document.getElementById('contact-success');
      if (s) s.style.display = 'block';
    });
  }

});
