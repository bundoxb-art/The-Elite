/* ============================================================
   ELITE MEDIA CREATION — script.js
   ============================================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ─── PRELOADER ─── */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('gone'), 1800);
  });

  /* ─── NAVBAR SCROLL ─── */
  const navbar = document.getElementById('navbar');
  function updateNav() {
    navbar.classList.toggle('solid', window.scrollY > 30);
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ─── HAMBURGER ─── */
  const burger = document.getElementById('burger');
  const menu   = document.getElementById('nav-menu');
  burger.addEventListener('click', () => {
    const open = burger.classList.toggle('open');
    menu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      burger.classList.remove('open');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* Mobile dropdown toggle */
  document.querySelectorAll('.nl.has-drop').forEach(item => {
    item.addEventListener('click', e => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        item.classList.toggle('expanded');
      }
    });
  });

  /* ─── HERO SLIDER ─── */
  const slides = document.querySelectorAll('.hs');
  const dots   = document.querySelectorAll('.hd');
  let cur = 0, interval;

  function goSlide(n) {
    slides[cur].classList.remove('active');
    dots[cur].classList.remove('active');
    cur = (n + slides.length) % slides.length;
    slides[cur].classList.add('active');
    dots[cur].classList.add('active');
  }
  function startSlider() { interval = setInterval(() => goSlide(cur + 1), 5500); }
  dots.forEach(d => d.addEventListener('click', () => {
    clearInterval(interval);
    goSlide(parseInt(d.dataset.i));
    startSlider();
  }));
  startSlider();

  /* ─── SMOOTH SCROLL ─── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (!t) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '70');
      window.scrollTo({ top: t.offsetTop - offset, behavior: 'smooth' });
    });
  });

  /* ─── LIGHTBOX ─── */
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lb-img');
  const lbClose  = document.getElementById('lb-close');
  const lbPrev   = document.getElementById('lb-prev');
  const lbNext   = document.getElementById('lb-next');
  let lbItems = [], lbIdx = 0;

  document.querySelectorAll('.mg-item').forEach(item => {
    item.addEventListener('click', () => {
      const section = item.closest('.gallery-sec');
      lbItems = [...section.querySelectorAll('.mg-item img')];
      const img = item.querySelector('img');
      lbIdx = lbItems.indexOf(img);
      showLb(lbIdx);
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function showLb(i) {
    lbIdx = (i + lbItems.length) % lbItems.length;
    lbImg.src = lbItems[lbIdx].src;
  }
  lbClose.addEventListener('click', closeLb);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLb(); });
  lbPrev.addEventListener('click', e => { e.stopPropagation(); showLb(lbIdx - 1); });
  lbNext.addEventListener('click', e => { e.stopPropagation(); showLb(lbIdx + 1); });
  function closeLb() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') showLb(lbIdx - 1);
    if (e.key === 'ArrowRight') showLb(lbIdx + 1);
  });

  /* ─── SCROLL REVEAL ─── */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
      const delay = siblings.indexOf(entry.target) * 90;
      setTimeout(() => entry.target.classList.add('in'), delay);
      revealObs.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  ['.sec-hd', '.wcard', '.mg-item', '.blog-card', '.about-img-wrap', '.about-txt', '.ci-block', '.contact-form-box', '.footer-brand', '.footer-col'].forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.classList.add('reveal');
      revealObs.observe(el);
    });
  });

  /* ─── CONTACT FORM ─── */
  const form = document.getElementById('contact-form');
  const fSuccess = document.getElementById('form-success');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name    = document.getElementById('c-name').value.trim();
      const phone   = document.getElementById('c-phone').value.trim();
      const service = document.getElementById('c-service').value;
      if (!name || !phone || !service) {
        shakeBtn(form.querySelector('.btn-dark'));
        return;
      }
      form.style.display = 'none';
      fSuccess.classList.add('show');
    });
  }
  function shakeBtn(el) {
    el.style.animation = 'none';
    el.offsetHeight;
    el.style.animation = 'shake .4s ease';
    el.addEventListener('animationend', () => el.style.animation = '', { once: true });
  }
  const shakeStyle = document.createElement('style');
  shakeStyle.textContent = `@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-5px)}40%{transform:translateX(5px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}`;
  document.head.appendChild(shakeStyle);

  /* ─── BACK TO TOP ─── */
  const topBtn = document.getElementById('float-top');
  window.addEventListener('scroll', () => {
    topBtn.classList.toggle('show', window.scrollY > 500);
  }, { passive: true });
  topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ─── WORK CARD CURSOR EFFECT ─── */
  document.querySelectorAll('.wcard').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 12;
      card.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${-y}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateY(0) rotateX(0)';
    });
  });

  /* ─── ACTIVE NAV LINK ─── */
  const navLinks = document.querySelectorAll('.nl');
  const allSecs = document.querySelectorAll('section[id]');
  function setActiveLink() {
    const sp = window.scrollY + 150;
    allSecs.forEach(sec => {
      const id = sec.id;
      const link = document.querySelector(`.nl[href="#${id}"]`);
      if (link && sp >= sec.offsetTop && sp < sec.offsetTop + sec.offsetHeight) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', setActiveLink, { passive: true });

});
