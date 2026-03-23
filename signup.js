(function () {
  const form = document.getElementById('signup-form');
  const success = document.getElementById('signup-success');
  const logoutBtn = document.getElementById('signup-logout');
  if (!form) return;

  const PROMO = 'WELCOME10';

  function setSignedInUI(isSignedIn) {
    form.hidden = !!isSignedIn;
    if (success) success.hidden = !isSignedIn;
    if (logoutBtn) logoutBtn.hidden = !isSignedIn;
  }

  try {
    const existing = localStorage.getItem('buyverse_signup');
    setSignedInUI(!!existing);
  } catch (err) {
    setSignedInUI(false);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = (fd.get('name') || '').toString().trim();
    const email = (fd.get('email') || '').toString().trim();
    const password = (fd.get('password') || '').toString();

    if (!name || !email || password.length < 6) {
      if (typeof showToast === 'function') {
        showToast('Please fill name, email, and a 6+ character password.');
      }
      return;
    }

    try {
      localStorage.setItem('buyverse_signup', JSON.stringify({
        name,
        email,
        promo: PROMO,
        at: new Date().toISOString()
      }));
      localStorage.setItem('buyverse_promo_code', PROMO);
    } catch (err) {}

    setSignedInUI(true);
    if (typeof showToast === 'function') {
      showToast('Welcome to BuyVerse — 10% off unlocked!');
    }
  });

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      try {
        localStorage.removeItem('buyverse_signup');
        localStorage.removeItem('buyverse_promo_code');
      } catch (err) {}
      setSignedInUI(false);
      form.reset();
      if (typeof showToast === 'function') {
        showToast('You are logged out.');
      }
    });
  }
})();
