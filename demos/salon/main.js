'use strict';

/* ── モバイルナビゲーション ──────────────────────────── */
(function () {
  const toggle = document.getElementById('nav-toggle');
  const links  = document.getElementById('nav-links');
  if (!toggle || !links) return;

  function openNav() {
    toggle.classList.add('active');
    links.classList.add('active');
    toggle.setAttribute('aria-label', 'メニューを閉じる');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    toggle.classList.remove('active');
    links.classList.remove('active');
    toggle.setAttribute('aria-label', 'メニューを開く');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    if (links.classList.contains('active')) {
      closeNav();
    } else {
      openNav();
    }
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeNav);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && links.classList.contains('active')) {
      closeNav();
      toggle.focus();
    }
  });
}());

/* ── ヘッダースクロール ───────────────────────────────── */
(function () {
  const header = document.getElementById('site-header');
  if (!header) return;

  function updateHeader() {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
}());

/* ── スムーススクロール ───────────────────────────────── */
(function () {
  const NAV_H = 64;

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - NAV_H;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}());

/* ── 背景シェイプ パララックス ────────────────────────── */
(function () {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const shapes = document.querySelectorAll('.hero-bg-shape');
  if (!shapes.length) return;

  const factors = [0.04, 0.06, 0.03];
  let ticking = false;

  function applyParallax() {
    const scrollY = window.scrollY;
    shapes.forEach((shape, i) => {
      const offset = scrollY * factors[i];
      shape.style.transform = `translateY(${offset}px)`;
    });
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(applyParallax);
      ticking = true;
    }
  }, { passive: true });
}());

/* ── スクロール フェードイン（IntersectionObserver） ───── */
(function () {
  if (!('IntersectionObserver' in window)) return;

  const targets = document.querySelectorAll(
    '.about-grid, .section-header, .access-grid, .reserve-inner'
  );

  targets.forEach(el => el.classList.add('fade-up'));

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -48px 0px' }
  );

  targets.forEach(el => observer.observe(el));
}());

/* ── メニューカード スタガー ──────────────────────────── */
(function () {
  if (!('IntersectionObserver' in window)) return;

  const cards = document.querySelectorAll('.menu-card');
  cards.forEach((el, i) => {
    el.style.transitionDelay = `${i * 80}ms`;
    el.classList.add('fade-up');
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: '0px 0px -32px 0px' }
  );

  cards.forEach(el => observer.observe(el));
}());

/* ── ギャラリーアイテム フェードイン ─────────────────── */
(function () {
  if (!('IntersectionObserver' in window)) return;

  const items = document.querySelectorAll('.gallery-item');
  items.forEach((el, i) => {
    el.style.transitionDelay = `${i * 60}ms`;
    el.classList.add('fade-up');
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05 }
  );

  items.forEach(el => observer.observe(el));
}());

/* ── 予約フォーム ─────────────────────────────────────── */
(function () {
  const form    = document.getElementById('reserve-form');
  const success = document.getElementById('form-success');
  if (!form) return;

  function validate(id, msg) {
    const el = document.getElementById(id);
    if (!el) return true;
    if (!el.value.trim()) {
      markError(el, msg);
      return false;
    }
    clearError(el);
    return true;
  }

  function markError(el, msg) {
    clearError(el);
    el.style.borderColor = '#c44a2a';
    const err = document.createElement('span');
    err.className = 'field-error';
    err.style.cssText = 'display:block;font-size:0.75rem;color:#c44a2a;margin-top:4px;';
    err.textContent = msg;
    el.parentNode.appendChild(err);
  }

  function clearError(el) {
    el.style.borderColor = '';
    const prev = el.parentNode.querySelector('.field-error');
    if (prev) prev.remove();
  }

  // 入力時にエラーをクリア
  form.querySelectorAll('.form-input').forEach(el => {
    el.addEventListener('input', () => clearError(el));
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    valid = validate('f-name',    'お名前を入力してください') && valid;
    valid = validate('f-phone',   '電話番号を入力してください') && valid;
    valid = validate('f-date',    'ご希望日を選択してください') && valid;
    valid = validate('f-time',    '時間帯を選択してください') && valid;
    valid = validate('f-service', 'メニューを選択してください') && valid;

    if (!valid) return;

    const btn = form.querySelector('.btn--primary');
    if (btn) {
      btn.textContent = '送信中…';
      btn.disabled = true;
    }

    setTimeout(() => {
      if (success) {
        form.querySelectorAll('.form-group, .form-row').forEach(el => {
          el.style.display = 'none';
        });
        success.classList.add('visible');
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 800);
  });
}());
