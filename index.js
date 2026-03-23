const bar = document.getElementById('bar');
const nav = document.getElementById('navbar');
const close = document.getElementById('close');

if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active');
    });
}

if (close) {
    close.addEventListener('click', (e) => {
        e.preventDefault();
        if (nav) nav.classList.remove('active');
    });
}

const heroShop = document.getElementById('hero-shop-btn');
if (heroShop) {
    heroShop.addEventListener('click', () => {
        window.location.href = 'shop.html';
    });
}

const backTop = document.getElementById('back-top');
if (backTop) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 420) {
            backTop.classList.add('visible');
        } else {
            backTop.classList.remove('visible');
        }
    }, { passive: true });
    backTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

document.querySelectorAll('#newsletter .form').forEach(formWrap => {
    const btn = formWrap.querySelector('button.newsletter-submit');
    const input = formWrap.querySelector('input');
    if (btn && input) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const v = (input.value || '').trim();
            if (typeof showToast === 'function') {
                showToast(v ? 'Thanks — you are on the list!' : 'Please enter your email.');
            }
            if (v) input.value = '';
        });
    }
});

function initNavWelcome() {
    const wrap = document.getElementById('nav-welcome');
    const nameEl = document.getElementById('nav-welcome-name');
    if (!wrap || !nameEl) return;
    try {
        const raw = localStorage.getItem('buyverse_signup');
        if (!raw) return;
        const data = JSON.parse(raw);
        const full = (data.name || '').trim();
        if (!full) return;
        const first = full.split(/\s+/)[0];
        nameEl.textContent = first;
        wrap.removeAttribute('hidden');
    } catch (e) {}
}

document.addEventListener('DOMContentLoaded', initNavWelcome);

if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(en => {
            if (en.isIntersecting) {
                en.target.classList.add('is-visible');
                obs.unobserve(en.target);
            }
        });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    document.querySelectorAll('.reveal-up').forEach(el => obs.observe(el));
}
