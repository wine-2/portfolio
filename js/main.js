/**
 * main.js - ポートフォリオサイトのインタラクション
 * 外部ライブラリ不使用・Vanilla JS
 */

'use strict';

// ===== スクロールアニメーション（IntersectionObserver） ====

const animationObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // 一度アニメーションしたら監視を解除（パフォーマンス最適化）
        animationObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: '0px 0px -48px 0px'
  }
);

// アニメーション対象要素を監視
const animatedElements = document.querySelectorAll(
  '.fade-up, .fade-in, .fade-right, .fade-left, .stagger, .stat-card'
);
animatedElements.forEach(el => animationObserver.observe(el));


// ===== ナビゲーション: スクロール時の背景変更 =====

const nav = document.querySelector('.nav');

if (nav) {
  const handleNavScroll = () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // 初期状態チェック
}


// ===== モバイルメニュー =====

const navToggle = document.querySelector('.nav__toggle');
const navMobile = document.querySelector('.nav__mobile');

if (navToggle && navMobile) {
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    navMobile.classList.toggle('open', !isOpen);
    document.body.style.overflow = isOpen ? '' : 'hidden';
  });

  // モバイルメニューのリンクをクリックで閉じる
  navMobile.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      navMobile.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ESCキーで閉じる
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMobile.classList.contains('open')) {
      navToggle.setAttribute('aria-expanded', 'false');
      navMobile.classList.remove('open');
      document.body.style.overflow = '';
      navToggle.focus();
    }
  });
}


// ===== スムーススクロール（アンカーリンク） =====

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const navHeight = nav ? nav.offsetHeight : 0;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
});


// ===== コンタクトフォーム =====

const contactForm = document.querySelector('.contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('[type="submit"]');
    const originalText = submitBtn.textContent;

    // バリデーション
    const formData = new FormData(contactForm);
    const name = formData.get('name')?.trim();
    const email = formData.get('email')?.trim();
    const message = formData.get('message')?.trim();

    if (!name || !email || !message) {
      showFormFeedback(contactForm, 'error', '必須項目を入力してください。');
      return;
    }

    if (!isValidEmail(email)) {
      showFormFeedback(contactForm, 'error', 'メールアドレスの形式が正しくありません。');
      return;
    }

    // 送信中の状態
    submitBtn.textContent = '送信中...';
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // Formspree 経由で実際にメールを送信する
    // 設定方法: https://formspree.io/ で無料アカウント作成 → 新規フォーム作成 → エンドポイントURLを取得
    // 取得したURLを HTML の data-form-endpoint に設定してください
    const formEndpoint = contactForm.dataset.formEndpoint;

    if (!formEndpoint) {
      showFormFeedback(contactForm, 'error', '送信先の設定が見つかりません。時間をおいて再度お試しください。');
      submitBtn.textContent = originalText;
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      return;
    }

    try {
      const res = await fetch(formEndpoint, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' }
      });

      if (res.ok) {
        showFormFeedback(contactForm, 'success', 'ありがとうございます。24時間以内にご連絡します。');
        contactForm.reset();
        submitBtn.textContent = '送信完了';
      } else {
        const data = await res.json();
        const msg = data?.errors?.map(e => e.message).join(' ') || '送信に失敗しました。直接メールでご連絡ください。';
        showFormFeedback(contactForm, 'error', msg);
        submitBtn.textContent = originalText;
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        return;
      }
    } catch {
      showFormFeedback(contactForm, 'error', '送信に失敗しました。ネットワークを確認してください。');
      submitBtn.textContent = originalText;
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      return;
    }

    // ボタンを元に戻す
    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }, 3000);
  });
}

/**
 * フォームのフィードバックメッセージを表示
 */
function showFormFeedback(form, type, message) {
  // 既存のフィードバックを削除
  form.querySelector('.form-feedback')?.remove();

  const feedback = document.createElement('p');
  feedback.className = `form-feedback form-feedback--${type}`;
  feedback.textContent = message;
  feedback.style.cssText = `
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 500;
    ${type === 'success'
      ? 'background: rgba(45, 106, 79, 0.15); color: #2d6a4f; border: 1px solid rgba(45, 106, 79, 0.3);'
      : 'background: rgba(193, 18, 31, 0.1); color: #c1121f; border: 1px solid rgba(193, 18, 31, 0.25);'
    }
  `;

  form.appendChild(feedback);

  // 5秒後に自動削除（成功時のみ）
  if (type === 'success') {
    setTimeout(() => feedback.remove(), 5000);
  }
}

/**
 * メールアドレスのバリデーション
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
