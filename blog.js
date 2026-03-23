(function () {
  document.querySelectorAll('#blog .blog-box').forEach((box) => {
    const btn = box.querySelector('.blog-toggle');
    const extra = box.querySelector('.blog-expand');
    if (!btn || !extra) return;

    btn.addEventListener('click', () => {
      const open = extra.classList.toggle('blog-expand--open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.textContent = open ? 'Show less' : 'Read more';
    });
  });
})();
