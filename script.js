/* =========================================================
   GOOKIE ORDER V3.0 - CONFIG
   ========================================================= */
const WHATSAPP_NUMBER = "60102810487";
const SINGLE_PRICE = 7.90;
const COMBO_4_PRICE = 6.90;
const COMBO_6_TOTAL = 39.40;

const menuItems = [
  {
    id: "classic-choc-chip",
    name: "Classic Choc Chip",
    description: "The OG chunky cookie. Buttery dough, generous chocolate chips, no unnecessary drama."
  },
  {
    id: "dark-seasalt",
    name: "Dark Seasalt",
    description: "Deep dark chocolate with a tiny salty attitude. Rich, bold, and very not boring."
  },
  {
    id: "red-velvet",
    name: "Red Velvet",
    description: "Soft red velvet cookie with creamy chocolatey notes. Pretty outside, dangerous inside."
  },
  {
    id: "matchadamia",
    name: "Matchadamia",
    description: "Earthy matcha, crunchy macadamia, and milk chocolate for balance. A little classy, a little chunky."
  },
  {
    id: "og-smores",
    name: "OG S’mores",
    description: "Campfire vibes with marshmallow, chocolate, and cookie comfort in every bite."
  },
  {
    id: "dark-smores",
    name: "Dark S’mores",
    description: "A moodier s’mores. Dark chocolate, marshmallow pull, and main-character energy."
  },
  {
    id: "rocky-road",
    name: "Rocky Road",
    description: "Chocolate, marshmallow, and nutty crunch. Chaotic in the best possible way."
  },
  {
    id: "biscoff-lava",
    name: "Biscoff Lava",
    description: "Cookie butter lava center for the Biscoff obsessed. Sweet, spiced, melty."
  },
  {
    id: "choco-lava",
    name: "Choco Lava",
    description: "Soft chunky cookie with a chocolate lava heart. Because subtlety is overrated."
  },
  {
    id: "tiramisu-lava",
    name: "Tiramisu Lava",
    description: "Coffee-kissed cookie with creamy tiramisu lava. Dessert pretending to be a cookie."
  }
];

/* =========================================================
   DOM ELEMENTS
   ========================================================= */
const menuGrid = document.getElementById("menuGrid");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const qrModal = document.getElementById("qrModal");

const openCartBtn = document.getElementById("openCartBtn");
const floatingCartBtn = document.getElementById("floatingCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const closeQrBtn = document.getElementById("closeQrBtn");
const payNowBtn = document.getElementById("payNowBtn");
const whatsappBtn = document.getElementById("whatsappBtn");
const clearCartBtn = document.getElementById("clearCartBtn");

const cartItemsEl = document.getElementById("cartItems");
const cartCountEl = document.getElementById("cartCount");
const floatingCartCountEl = document.getElementById("floatingCartCount");
const subtotalText = document.getElementById("subtotalText");
const discountText = document.getElementById("discountText");
const totalText = document.getElementById("totalText");
const comboNote = document.getElementById("comboNote");

let cart = [];

/* =========================================================
   MENU RENDERING
   ========================================================= */
function renderMenu() {
  menuGrid.innerHTML = menuItems.map(item => `
    <article class="menu-card">
      <div class="cookie-visual" aria-hidden="true"></div>
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <div class="menu-card__bottom">
        <span class="price">RM${SINGLE_PRICE.toFixed(2)}</span>
        <button class="add-button" type="button" onclick="addToCart('${item.id}')">Add</button>
      </div>
    </article>
  `).join("");
}

/* =========================================================
   CART FUNCTIONS
   ========================================================= */
function addToCart(id) {
  const item = menuItems.find(menu => menu.id === id);
  const existingItem = cart.find(cartItem => cartItem.id === id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  renderCart();
  openCart();
}

function increaseQty(id) {
  const item = cart.find(cartItem => cartItem.id === id);
  if (!item) return;
  item.quantity += 1;
  renderCart();
}

function decreaseQty(id) {
  const item = cart.find(cartItem => cartItem.id === id);
  if (!item) return;

  item.quantity -= 1;
  if (item.quantity <= 0) {
    cart = cart.filter(cartItem => cartItem.id !== id);
  }

  renderCart();
}

function clearCart() {
  cart = [];
  renderCart();
}

function getCartQuantity() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function getSubtotal() {
  return getCartQuantity() * SINGLE_PRICE;
}

function getTotal() {
  const qty = getCartQuantity();

  if (qty >= 6) {
    const setsOfSix = Math.floor(qty / 6);
    const remainder = qty % 6;
    return (setsOfSix * COMBO_6_TOTAL) + calculateRemainderTotal(remainder);
  }

  if (qty >= 4) {
    return qty * COMBO_4_PRICE;
  }

  return qty * SINGLE_PRICE;
}

function calculateRemainderTotal(remainder) {
  if (remainder >= 4) return remainder * COMBO_4_PRICE;
  return remainder * SINGLE_PRICE;
}

function getComboMessage() {
  const qty = getCartQuantity();

  if (qty >= 6) return "Combo 6 applied: RM39.40 per 6 cookies.";
  if (qty >= 4) return "Combo 4 applied: RM6.90 each.";
  return `Add ${4 - qty} more cookie(s) to unlock combo pricing.`;
}

function renderCart() {
  const qty = getCartQuantity();
  const subtotal = getSubtotal();
  const total = getTotal();
  const discount = subtotal - total;

  cartCountEl.textContent = qty;
  floatingCartCountEl.textContent = qty;
  subtotalText.textContent = formatRM(subtotal);
  discountText.textContent = `- ${formatRM(discount)}`;
  totalText.textContent = formatRM(total);
  comboNote.textContent = getComboMessage();

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `<p class="empty-cart">Cart kosong lagi. Your cookies are waiting dramatically.</p>`;
    return;
  }

  cartItemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div>
        <h4>${item.name}</h4>
        <p>${item.quantity} × RM${SINGLE_PRICE.toFixed(2)}</p>
      </div>
      <div class="qty-controls">
        <button type="button" onclick="decreaseQty('${item.id}')">−</button>
        <strong>${item.quantity}</strong>
        <button type="button" onclick="increaseQty('${item.id}')">+</button>
      </div>
    </div>
  `).join("");
}

/* =========================================================
   DRAWER & MODAL FUNCTIONS
   ========================================================= */
function openCart() {
  cartDrawer.classList.add("is-open");
  overlay.classList.add("is-open");
  cartDrawer.setAttribute("aria-hidden", "false");
}

function closeCart() {
  cartDrawer.classList.remove("is-open");
  overlay.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
}

function openQrModal() {
  qrModal.classList.add("is-open");
  qrModal.setAttribute("aria-hidden", "false");
}

function closeQrModal() {
  qrModal.classList.remove("is-open");
  qrModal.setAttribute("aria-hidden", "true");
}

/* =========================================================
   WHATSAPP ORDER GENERATOR
   ========================================================= */
function generateWhatsAppMessage() {
  if (cart.length === 0) {
    alert("Cart kosong lagi. Add cookies dulu bestie 🍪");
    return;
  }

  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const method = document.getElementById("orderMethod").value;
  const address = document.getElementById("customerAddress").value.trim();
  const orderDate = document.getElementById("orderDate").value;
  const orderTime = document.getElementById("orderTime").value;
  const notes = document.getElementById("customerNotes").value.trim();

  if (!name || !phone) {
    alert("Isi nama dan nombor telefon dulu ya.");
    closeCart();
    document.getElementById("customerDetails").scrollIntoView({ behavior: "smooth" });
    return;
  }

  const orderLines = cart.map(item => `- ${item.name} x ${item.quantity}`).join("\n");
  const qty = getCartQuantity();
  const subtotal = getSubtotal();
  const total = getTotal();
  const discount = subtotal - total;

  const message = `Hi Gookie! I want to order cookies 🍪\n\n` +
    `CUSTOMER DETAILS\n` +
    `Name: ${name}\n` +
    `Phone: ${phone}\n` +
    `Method: ${method}\n` +
    `Address/Pickup Note: ${address || "-"}\n` +
    `Date: ${orderDate || "-"}\n` +
    `Time: ${orderTime || "-"}\n\n` +
    `ORDER DETAILS\n` +
    `${orderLines}\n\n` +
    `Total cookies: ${qty}\n` +
    `Subtotal: ${formatRM(subtotal)}\n` +
    `Combo discount: -${formatRM(discount)}\n` +
    `TOTAL: ${formatRM(total)}\n\n` +
    `Notes: ${notes || "-"}\n\n` +
    `I will send payment receipt after payment. Thank you!`;

  const encodedMessage = encodeURIComponent(message);
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, "_blank");
}

/* =========================================================
   HELPERS
   ========================================================= */
function formatRM(amount) {
  return `RM${amount.toFixed(2)}`;
}

/* =========================================================
   EVENT LISTENERS
   ========================================================= */
openCartBtn.addEventListener("click", openCart);
floatingCartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
payNowBtn.addEventListener("click", openQrModal);
closeQrBtn.addEventListener("click", closeQrModal);
whatsappBtn.addEventListener("click", generateWhatsAppMessage);
clearCartBtn.addEventListener("click", clearCart);

window.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeCart();
    closeQrModal();
  }
});

/* =========================================================
   INIT
   ========================================================= */
renderMenu();
renderCart();
