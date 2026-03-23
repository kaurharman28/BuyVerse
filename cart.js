// cart.js - Shared cart management with localStorage persistence (INR / ₹)

function parsePriceRupee(text) {
  if (!text) return 0;
  let s = String(text).trim();
  if (s.startsWith('$')) {
    return parseFloat(s.replace(/[^0-9.]/g, '')) || 0;
  }
  s = s.replace(/[₹Rs,INR\s]/gi, '').replace(/[^\d.]/g, '');
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
}

function formatRupee(amount) {
  const n = Math.round(Number(amount) || 0);
  return '₹' + n.toLocaleString('en-IN');
}

function getCart() {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function getCartCount() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function getCartTotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
}

function addToCart(proElement) {
  const img = proElement.querySelector('img').src;
  const name = proElement.querySelector('h5').textContent;
  const brand = proElement.querySelector('span').textContent;
  const priceText = proElement.querySelector('h4').textContent;
  const price = parsePriceRupee(priceText);
  let id = proElement.getAttribute('data-pid');
  if (!id) {
    const cleanSrc = img.split('?')[0];
    id = cleanSrc.split('/').pop().replace(/\.(jpg|jpeg|png|webp)$/i, '');
  }

  let cart = getCart();
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, brand, price, img, qty: 1 });
  }

  saveCart(cart);
  updateCartBadge();
  showToast(`${name} added to cart!`);
}

function updateQty(id, qty) {
  let cart = getCart();
  const item = cart.find(item => item.id === id);
  if (item) {
    item.qty = parseInt(qty, 10) || 0;
    if (item.qty <= 0) {
      cart = cart.filter(i => i.id !== id);
    }
    saveCart(cart);
    updateCartBadge();
    updateCartTable();
  }
}

function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== id);
  saveCart(cart);
  updateCartBadge();
  updateCartTable();
}

function updateCartBadge() {
  const badges = document.querySelectorAll('.cart-count');
  const count = getCartCount();
  badges.forEach(badge => {
    badge.textContent = count > 0 ? String(count) : '';
    badge.style.display = count > 0 ? 'flex' : 'none';
  });
}

function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.setAttribute('role', 'status');
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('toast-visible');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => {
    toast.classList.remove('toast-visible');
  }, 2200);
}

function attachCartListeners() {
  document.querySelectorAll('.cart').forEach(cartIcon => {
    cartIcon.style.cursor = 'pointer';
    cartIcon.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const pro = cartIcon.closest('.pro');
      if (pro) addToCart(pro);
    };
  });
}

function generateCartTable() {
  const tbody = document.querySelector('#cart table tbody');
  if (!tbody) return;

  const cart = getCart();
  if (cart.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:50px;">Your cart is empty</td></tr>';
    updateSubtotal();
    return;
  }

  tbody.innerHTML = cart.map(item => `
    <tr>
      <td><a href="#" onclick="removeFromCart('${item.id}'); return false;"><i class="far fa-times-circle"></i></a></td>
      <td><img src="${item.img}" alt=""></td>
      <td>${item.brand} ${item.name}</td>
      <td>${formatRupee(item.price)}</td>
      <td><input type="number" value="${item.qty}" min="0" onchange="updateQty('${item.id}', this.value)" style="width:60px;"></td>
      <td>${formatRupee(item.price * item.qty)}</td>
    </tr>
  `).join('');

  updateSubtotal();
}

function updateSubtotal() {
  const subtotal = getCartTotal();
  const shipping = 0;
  const total = subtotal + shipping;

  const subtotalEl = document.querySelector('#subtotal table tr:nth-child(1) td:nth-child(2)');
  const shippingEl = document.querySelector('#subtotal table tr:nth-child(2) td:nth-child(2)');
  const totalEl = document.querySelector('#subtotal table tr:nth-child(3) td:nth-child(2)');

  if (subtotalEl) subtotalEl.textContent = formatRupee(subtotal);
  if (shippingEl) shippingEl.textContent = subtotal > 0 ? 'Free' : '—';
  if (totalEl) totalEl.textContent = formatRupee(total);
}

function initCheckoutPanel() {
  const btn = document.getElementById('btn-checkout');
  const panel = document.getElementById('checkout-payment');
  const completeBtn = document.getElementById('btn-complete-order');
  if (!btn || !panel) return;

  btn.addEventListener('click', () => {
    const cart = getCart();
    if (!cart.length) {
      showToast('Your cart is empty — add items to checkout.');
      return;
    }
    panel.hidden = false;
    panel.classList.add('checkout-payment--open');
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  if (completeBtn) {
    completeBtn.addEventListener('click', () => {
      const cart = getCart();
      if (!cart.length) {
        showToast('Nothing to pay for.');
        return;
      }
      saveCart([]);
      updateCartBadge();
      generateCartTable();
      panel.hidden = true;
      panel.classList.remove('checkout-payment--open');
      showToast('Order placed! Thank you for shopping with BuyVerse.');
    });
  }
}

function initCart() {
  attachCartListeners();
  updateCartBadge();

  if (document.querySelector('#cart table')) {
    generateCartTable();
    initCheckoutPanel();
  }
}

document.addEventListener('DOMContentLoaded', initCart);

window.addEventListener('storage', (e) => {
  if (e.key === 'cart') {
    updateCartBadge();
    if (document.querySelector('#cart table')) generateCartTable();
  }
});
