/* ================================
   GOOKIE ORDER V3.0 - SCRIPT
   ================================ */

const WHATSAPP_NUMBER = '60102810487';

const menuItems = [
  {
    id: 'classic-choc-chip',
    name: 'Classic Choc Chip',
    price: 10.90,
    description: 'Our signature chunky cookie loaded with chocolate chips and classic Gookie comfort.',
  },
  {
    id: 'dark-seasalt',
    name: 'Dark Seasalt',
    price: 10.90,
    description: 'Deep dark chocolate with a touch of sea salt for a bold, balanced bite.',
  },
  {
    id: 'red-velvet',
    name: 'Red Velvet',
    price: 10.90,
    description: 'A rich red velvet cookie with chocolatey notes and soft-baked charm.',
  },
  {
    id: 'matchadamia',
    name: 'Matchadamia',
    price: 11.90,
    description: 'Earthy matcha, creamy milk chocolate, and buttery macadamia in one chunky cookie.',
  },
  {
    id: 'og-smores',
    name: 'OG S’mores',
    price: 11.90,
    description: 'Campfire-inspired cookie with marshmallow, chocolate, and cosy s’mores energy.',
  },
  {
    id: 'dark-smores',
    name: 'Dark S’mores',
    price: 11.90,
    description: 'A darker, richer take on s’mores with chocolate intensity and toasted sweetness.',
  },
  {
    id: 'rocky-road',
    name: 'Rocky Road',
    price: 11.90,
    description: 'Chocolate, nuts, and marshmallow bits for a fun chunky cookie adventure.',
  },
  {
    id: 'biscoff-lava',
    name: 'Biscoff Lava',
    price: 12.90,
    description: 'Soft cookie filled with warm, spiced Biscoff lava for cookie lovers with standards.',
  },
  {
    id: 'choco-lava',
    name: 'Choco Lava',
    price: 12.90,
    description: 'A chocolate-loaded cookie with a rich melty centre made for serious cravings.',
  },
  {
    id: 'tiramisu-lava',
    name: 'Tiramisu Lava',
    price: 12.90,
    description: 'Coffee-kissed cookie with creamy tiramisu-style lava and a little grown-up drama.',
  },
];

let cart = JSON.parse(localStorage.getItem('gookieCartV3')) || [];

const menuGrid = document.getElementById('menuGrid');
const cartDrawer = document.getElementById('cartDrawer');
const overlay = document.getElementById('overlay');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const floatingTotal = document.getElementById('floatingTotal');
const floatingCartBtn = document.getElementById('floatingCartBtn');
const paymentModal = document.getElementById('paymentModal');

function formatMoney(amount) {
  return `RM${amount.toFixed(2)}`;
}

function saveCart() {
  localStorage.setItem('gookieCartV3', JSON.stringify(cart));
}

function renderMenu() {
  menuGrid.innerHTML = menuItems.map(item => `
    <article class="menu-card">
      <div class="cookie-image">🍪</div>
      <div class="menu-card-content">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <div class="card-footer">
          <span class="price">${formatMoney(item.price)}</span>
          <button class="add-button" type="button" onclick="addToCart('${item.id}')">Add to Cart</button>
        </div>
      </div>
    </article>
  `).join('');
}

function addToCart(id) {
  const item = menuItems.find(menu => menu.id === id);
  const existing = cart.find(cartItem => cartItem.id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  saveCart();
  updateCart();
  openCart();
}

function changeQuantity(id, amount) {
  const item = cart.find(cartItem => cartItem.id === id);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(cartItem => cartItem.id !== id);
  }

  saveCart();
  updateCart();
}

function clearCart() {
  cart = [];
  saveCart();
  updateCart();
}

function getCartTotals() {
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let discount = 0;
  let comboNote = 'Add 4 cookies to unlock combo discount.';

  if (itemCount >= 6) {
    discount = 8;
    comboNote = 'Combo Discount Applied: Buy 6 Save RM8 🎉';
  } else if (itemCount >= 4) {
    discount = 5;
    comboNote = 'Combo Discount Applied: Buy 4 Save RM5 🎉';
  }

  const total = Math.max(subtotal - discount, 0);

  return { itemCount, subtotal, discount, total, comboNote };
}

function updateCart() {
  const totals = getCartTotals();

  cartCount.textContent = totals.itemCount;
  floatingTotal.textContent = formatMoney(totals.total);
  document.getElementById('subtotalText').textContent = formatMoney(totals.subtotal);
  document.getElementById('discountText').textContent = `-${formatMoney(totals.discount)}`;
  document.getElementById('totalText').textContent = formatMoney(totals.total);
  document.getElementById('comboNote').textContent = totals.comboNote;

  floatingCartBtn.classList.toggle('show', totals.itemCount > 0);

  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="empty-cart">Your cart is feeling lonely... 🍪</div>';
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div>
        <h4>${item.name}</h4>
        <p>${formatMoney(item.price)} each</p>
      </div>
      <div class="qty-controls">
        <button type="button" onclick="changeQuantity('${item.id}', -1)">−</button>
        <strong>${item.quantity}</strong>
        <button type="button" onclick="changeQuantity('${item.id}', 1)">+</button>
      </div>
    </div>
  `).join('');
}

function openCart() {
  cartDrawer.classList.add('open');
  overlay.classList.add('show');
  cartDrawer.setAttribute('aria-hidden', 'false');
}

function closeCart() {
  cartDrawer.classList.remove('open');
  overlay.classList.remove('show');
  cartDrawer.setAttribute('aria-hidden', 'true');
}

function openPayment() {
  const totals = getCartTotals();

  if (totals.itemCount === 0) {
    alert('Your cart is empty. Please add cookies first.');
    return;
  }

  const name = document.getElementById('customerName').value.trim();
  const phone = document.getElementById('customerPhone').value.trim();
  const method = document.getElementById('deliveryMethod').value;
  const address = document.getElementById('customerAddress').value.trim();

  if (!name || !phone) {
    alert('Please fill in your full name and phone number.');
    document.getElementById('details').scrollIntoView({ behavior: 'smooth' });
    return;
  }

  if (method === 'Delivery' && !address) {
    alert('Please fill in your delivery address.');
    document.getElementById('details').scrollIntoView({ behavior: 'smooth' });
    return;
  }

  paymentModal.classList.add('show');
  paymentModal.setAttribute('aria-hidden', 'false');
}

function closePayment() {
  paymentModal.classList.remove('show');
  paymentModal.setAttribute('aria-hidden', 'true');
}

function generateWhatsAppMessage() {
  const totals = getCartTotals();
  const name = document.getElementById('customerName').value.trim();
  const phone = document.getElementById('customerPhone').value.trim();
  const method = document.getElementById('deliveryMethod').value;
  const address = document.getElementById('customerAddress').value.trim() || '-';
  const date = document.getElementById('orderDate').value || 'Not selected';
  const time = document.getElementById('orderTime').value || 'Not selected';
  const notes = document.getElementById('orderNotes').value.trim() || '-';

  const orderLines = cart.map(item => `${item.quantity} × ${item.name} — ${formatMoney(item.price * item.quantity)}`).join('\n');

  return `Hi Gookie! 👋\n\nI'd like to place an order.\n\n━━━━━━━━━━━━━━\nCustomer Details\n\nName: ${name}\nPhone: ${phone}\nDelivery Method: ${method}\nAddress: ${address}\nPreferred Date: ${date}\nPreferred Time: ${time}\nOrder Notes: ${notes}\n\n━━━━━━━━━━━━━━\nOrder\n\n${orderLines}\n\n━━━━━━━━━━━━━━\nSubtotal: ${formatMoney(totals.subtotal)}\nDiscount: -${formatMoney(totals.discount)}\nTotal: ${formatMoney(totals.total)}\n\n━━━━━━━━━━━━━━\nPayment Completed ✅\n\nThank you!`;
}

function sendOrderToWhatsApp() {
  const message = encodeURIComponent(generateWhatsAppMessage());
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  window.open(url, '_blank');
}

// EVENT LISTENERS
document.getElementById('openCartBtn').addEventListener('click', openCart);
document.getElementById('floatingCartBtn').addEventListener('click', openCart);
document.getElementById('closeCartBtn').addEventListener('click', closeCart);
document.getElementById('clearCartBtn').addEventListener('click', clearCart);
document.getElementById('payNowBtn').addEventListener('click', openPayment);
document.getElementById('closePaymentBtn').addEventListener('click', closePayment);
document.getElementById('paidBtn').addEventListener('click', sendOrderToWhatsApp);
overlay.addEventListener('click', closeCart);

// INIT
renderMenu();
updateCart();
