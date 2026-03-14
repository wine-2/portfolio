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
  const header = document.getElementById('nav-header');
  if (!header) return;

  function updateHeader() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
}());

/* ── スムーススクロール ───────────────────────────────── */
(function () {
  const NAV_H = 68;

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

/* ── スクロール フェードイン（IntersectionObserver） ───── */
(function () {
  if (!('IntersectionObserver' in window)) return;

  const targets = document.querySelectorAll(
    '.concept-inner, .menu-category, .section-header, .info-inner, .reserve-inner'
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

/* ── メニューアイテム スタガー表示 ───────────────────── */
(function () {
  if (!('IntersectionObserver' in window)) return;

  const items = document.querySelectorAll('.menu-item');
  items.forEach((el, i) => {
    el.style.transitionDelay = `${i % 4 * 60}ms`;
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

  items.forEach(el => observer.observe(el));
}());

/* ── 予約フォーム ─────────────────────────────────────── */
(function () {
  const form = document.getElementById('reserve-form');
  if (!form) return;

  function validateField(id, errorMsg) {
    const el = document.getElementById(id);
    if (!el) return true;
    const value = el.value.trim();
    if (!value) {
      showError(el, errorMsg);
      return false;
    }
    clearError(el);
    return true;
  }

  function showError(el, msg) {
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

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    valid = validateField('reserve-name', 'お名前を入力してください') && valid;
    valid = validateField('reserve-phone', '電話番号を入力してください') && valid;
    valid = validateField('reserve-date', 'ご来店日を選択してください') && valid;
    valid = validateField('reserve-time', '時間を選択してください') && valid;
    valid = validateField('reserve-count', '人数を選択してください') && valid;

    if (!valid) return;

    const btn = form.querySelector('.form-btn');
    if (btn) {
      btn.textContent = '送信中…';
      btn.disabled = true;
    }

    setTimeout(() => {
      form.innerHTML =
        '<p style="text-align:center;padding:40px 0;color:#c4872a;font-size:1rem;line-height:1.85;">' +
        '予約リクエストを受け付けました。<br>1〜2営業日以内にお電話でご確認の連絡を差し上げます。</p>';
    }, 800);
  });
}());
