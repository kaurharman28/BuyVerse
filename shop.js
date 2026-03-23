(function () {
  document.querySelectorAll('.shop-filter-chips').forEach((toolbar) => {
    toolbar.querySelectorAll('.shop-chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter') || 'all';
        toolbar.querySelectorAll('.shop-chip').forEach((b) => {
          b.classList.toggle('shop-chip--active', b === btn);
        });
        const section = toolbar.closest('.shop-products-section');
        if (!section) return;
        section.querySelectorAll('.pro[data-category]').forEach((pro) => {
          const cat = pro.getAttribute('data-category');
          const show = filter === 'all' || cat === filter;
          pro.classList.toggle('pro--filtered-out', !show);
        });
      });
    });
  });
})();
