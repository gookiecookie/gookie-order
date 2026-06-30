/* ================================
   GOOKIE ORDER PAGE SCRIPT
================================ */

const cart = [];

const addButtons = document.querySelectorAll(".add-to-cart");
const cartCount = document.getElementById("cartCount");
const floatingCartCount = document.getElementById("floatingCartCount");
const cartItems = document.getElementById("cartItems");

const openCartBtn = document.getElementById("openCartBtn");
const floatingCartBtn = document.getElementById("floatingCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");

const subtotalEl = document.getElementById("subtotal");
const discountEl = document.getElementById("discount");
const deliveryChargeEl = document.getElementById("deliveryCharge");
const grandTotalEl = document.getElementById("grandTotal");

const orderMethod = document.getElementById("orderMethod");
const checkoutBtn = document.getElementById("checkoutBtn");
const addressLabel = document.getElementById("addressLabel");

const qrPopup = document.getElementById("qrPopup");
const qrPopupOverlay = document.getElementById("qrPopupOverlay");
const closeQrBtn = document.getElementById("closeQrBtn");

/* ================================
   CART DRAWER
================================ */

function openCart() {
  cartDrawer.classList.add("active");
  cartOverlay.classList.add("active");
}

function closeCart() {
  cartDrawer.classList.remove("active");
  cartOverlay.classList.remove("active");
}

openCartBtn.addEventListener("click", openCart);
floatingCartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

function openQrPopup() {
  qrPopup.classList.add("active");
  qrPopupOverlay.classList.add("active");
}

function closeQrPopup() {
  qrPopup.classList.remove("active");
  qrPopupOverlay.classList.remove("active");
}

closeQrBtn.addEventListener("click", closeQrPopup);
qrPopupOverlay.addEventListener("click", closeQrPopup);

/* ================================
   ADD TO CART
================================ */

addButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".product-card");

    const product = {
      id: card.dataset.id,
      name: card.dataset.name,
      price: Number(card.dataset.price),
      quantity: 1,
    };

    addToCart(product);
    openCart();
  });
});

function addToCart(product) {
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push(product);
  }

  renderCart();
}

/* ================================
   CART ACTIONS
================================ */

function increaseQuantity(id) {
  const item = cart.find((product) => product.id === id);
  if (item) item.quantity += 1;

  renderCart();
}

function decreaseQuantity(id) {
  const item = cart.find((product) => product.id === id);

  if (!item) return;

  item.quantity -= 1;

  if (item.quantity <= 0) {
    removeItem(id);
    return;
  }

  renderCart();
}

function removeItem(id) {
  const index = cart.findIndex((product) => product.id === id);

  if (index !== -1) {
    cart.splice(index, 1);
  }

  renderCart();
}

/* ================================
   CALCULATION
================================ */

function getTotalQuantity() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function getSubtotal() {
  return cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
}

function getComboDiscount(totalQuantity) {
  if (totalQuantity >= 6) return 8;
  if (totalQuantity >= 4) return 5;
  return 0;
}

function getDeliveryCharge() {
  return orderMethod.value === "delivery" ? 8 : 0;
}

function formatRM(amount) {
  return `RM${amount.toFixed(2)}`;
}

/* ================================
   RENDER CART
================================ */

function renderCart() {
  const totalQuantity = getTotalQuantity();
  const subtotal = getSubtotal();
  const discount = getComboDiscount(totalQuantity);
  const deliveryCharge = getDeliveryCharge();
  const grandTotal = subtotal - discount + deliveryCharge;

  cartCount.textContent = totalQuantity;
  floatingCartCount.textContent = totalQuantity;

  subtotalEl.textContent = formatRM(subtotal);
  discountEl.textContent = `- ${formatRM(discount)}`;
  deliveryChargeEl.textContent = formatRM(deliveryCharge);
  grandTotalEl.textContent = formatRM(grandTotal);

  if (cart.length === 0) {
    cartItems.innerHTML = `<p class="empty-cart">Your cart is still empty.</p>`;
    return;
  }

  cartItems.innerHTML = cart
    .map((item) => {
      return `
        <div class="cart-item">
          <div>
            <h4>${item.name}</h4>
            <p>${formatRM(item.price)} each</p>
          </div>

          <div class="cart-qty">
            <button class="qty-btn" onclick="decreaseQuantity('${item.id}')">−</button>
            <strong>${item.quantity}</strong>
            <button class="qty-btn" onclick="increaseQuantity('${item.id}')">+</button>
          </div>

          <button class="remove-btn" onclick="removeItem('${item.id}')">
            Remove
          </button>
        </div>
      `;
    })
    .join("");
}

function updateOrderMethodUI() {
  if (orderMethod.value === "delivery") {
    addressLabel.innerHTML = `
      Delivery Address
      <textarea id="customerAddress" placeholder="Enter your full delivery address"></textarea>
    `;
  } else {
    addressLabel.innerHTML = `
      Pickup Notes
      <textarea id="customerAddress" placeholder="Preferred pickup time or notes"></textarea>
    `;
  }

  renderCart();
}

orderMethod.addEventListener("change", updateOrderMethodUI);

/* ================================
   WHATSAPP CHECKOUT
================================ */

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const address = document.getElementById("customerAddress").value.trim();
  const method = orderMethod.value;

  if (!name || !phone) {
    alert("Please fill in your name and phone number.");
    return;
  }

  if (method === "delivery" && !address) {
    alert("Please fill in your delivery address.");
    return;
  }

  const totalQuantity = getTotalQuantity();
  const subtotal = getSubtotal();
  const discount = getComboDiscount(totalQuantity);
  const deliveryCharge = getDeliveryCharge();
  const grandTotal = subtotal - discount + deliveryCharge;

  const orderList = cart
    .map((item) => {
      return `- ${item.name} x ${item.quantity} = ${formatRM(item.price * item.quantity)}`;
    })
    .join("%0A");

  const message =
    `Hi Gookie! I would like to place an order.%0A%0A` +
    `*Customer Details*%0A` +
    `Name: ${name}%0A` +
    `Phone: ${phone}%0A` +
    `Method: ${method}%0A` +
    `Address / Notes: ${address || "-"}%0A%0A` +
    `*Order*%0A` +
    `${orderList}%0A%0A` +
    `Subtotal: ${formatRM(subtotal)}%0A` +
    `Combo Discount: -${formatRM(discount)}%0A` +
    `Delivery Charge: ${formatRM(deliveryCharge)}%0A` +
    `*Total: ${formatRM(grandTotal)}*`;

  const whatsappNumber = "60102810487";
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${message}`;

  window.open(whatsappURL, "_blank");
});

/* Initial render */
updateOrderMethodUI();
