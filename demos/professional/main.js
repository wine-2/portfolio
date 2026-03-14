'use strict';

/* ── ハンバーガーメニュー ────────────────────────────── */
(function () {
  const hamburger = document.getElementById('hamburger');
  const mainNav   = document.getElementById('main-nav');
  if (!hamburger || !mainNav) return;

  function openNav() {
    hamburger.classList.add('active');
    mainNav.classList.add('active');
    hamburger.setAttribute('aria-label', 'メニューを閉じる');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    hamburger.classList.remove('active');
    mainNav.classList.remove('active');
    hamburger.setAttribute('aria-label', 'メニューを開く');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    if (mainNav.classList.contains('active')) {
      closeNav();
    } else {
      openNav();
    }
  });

  mainNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeNav);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mainNav.classList.contains('active')) {
      closeNav();
      hamburger.focus();
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
  const NAV_H = 72;

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

/* ── Back to Top ──────────────────────────────────────── */
(function () {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  function update() {
    btn.classList.toggle('visible', window.scrollY > 600);
  }

  window.addEventListener('scroll', update, { passive: true });
  update();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}());

/* ── スクロール フェードイン（IntersectionObserver） ───── */
(function () {
  if (!('IntersectionObserver' in window)) return;

  const targets = document.querySelectorAll(
    '.section-header, .trust-bar, .about-grid, .fee-note-box,' +
    '.fee-footer, .problems-answer, .services-note, .testimonials-grid'
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
    { threshold: 0.08, rootMargin: '0px 0px -48px 0px' }
  );

  targets.forEach(el => observer.observe(el));
}());

/* ── サービスカード スタガー ──────────────────────────── */
(function () {
  if (!('IntersectionObserver' in window)) return;

  const cards = document.querySelectorAll('.service-card, .testimonial-card');
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

/* ── 流れステップ スタガー ────────────────────────────── */
(function () {
  if (!('IntersectionObserver' in window)) return;

  const steps = document.querySelectorAll('.flow-step');
  steps.forEach((el, i) => {
    el.style.transitionDelay = `${i * 120}ms`;
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

  steps.forEach(el => observer.observe(el));
}());

/* ── お悩みバブル スタガー ────────────────────────────── */
(function () {
  if (!('IntersectionObserver' in window)) return;

  const bubbles = document.querySelectorAll('.problem-bubble');
  bubbles.forEach((el, i) => {
    el.style.transitionDelay = `${i * 100}ms`;
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

  bubbles.forEach(el => observer.observe(el));
}());

/* ── 料金テーブル フェードイン ────────────────────────── */
(function () {
  if (!('IntersectionObserver' in window)) return;

  const blocks = document.querySelectorAll('.fee-table-block');
  blocks.forEach((el, i) => {
    el.style.transitionDelay = `${i * 100}ms`;
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

  blocks.forEach(el => observer.observe(el));
}());

/* ── お問い合わせフォーム ─────────────────────────────── */
(function () {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  const submitBtn = document.getElementById('submit-btn');
  if (!form) return;

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showError(el, errorId, msg) {
    if (el) el.style.borderColor = 'var(--color-error)';
    const errorEl = document.getElementById(errorId);
    if (errorEl) errorEl.textContent = msg;
    return false;
  }

  function clearError(el, errorId) {
    if (el) el.style.borderColor = '';
    const errorEl = document.getElementById(errorId);
    if (errorEl) errorEl.textContent = '';
  }

  // 入力時にエラーをクリア
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const inquiryType = document.getElementById('inquiry-type');
  const privacy = document.getElementById('privacy');

  if (name) name.addEventListener('input', () => clearError(name, 'name-error'));
  if (email) email.addEventListener('input', () => clearError(email, 'email-error'));
  if (inquiryType) inquiryType.addEventListener('change', () => clearError(inquiryType, 'type-error'));
  if (privacy) privacy.addEventListener('change', () => clearError(null, 'privacy-error'));

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    // お名前
    if (!name || !name.value.trim()) {
      showError(name, 'name-error', 'お名前を入力してください');
      valid = false;
    } else {
      clearError(name, 'name-error');
    }

    // メール
    if (!email || !email.value.trim()) {
      showError(email, 'email-error', 'メールアドレスを入力してください');
      valid = false;
    } else if (!isValidEmail(email.value.trim())) {
      showError(email, 'email-error', '正しいメールアドレスを入力してください');
      valid = false;
    } else {
      clearError(email, 'email-error');
    }

    // ご相談の種類
    if (!inquiryType || !inquiryType.value) {
      showError(inquiryType, 'type-error', 'ご相談の種類を選択してください');
      valid = false;
    } else {
      clearError(inquiryType, 'type-error');
    }

    // プライバシーポリシー
    if (!privacy || !privacy.checked) {
      showError(null, 'privacy-error', 'プライバシーポリシーへの同意が必要です');
      valid = false;
    } else {
      clearError(null, 'privacy-error');
    }

    if (!valid) return;

    // 送信中
    if (submitBtn) {
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
    }

    setTimeout(() => {
      form.style.display = 'none';
      if (success) {
        success.classList.add('visible');
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 900);
  });
}());
