/* ===============================
   GOOKIE ORDER PAGE
   script.js
================================ */

const cart = [];

const menuCards = document.querySelectorAll(".product-card");
const floatingQty = document.getElementById("floatingQty");
const floatingTotal = document.getElementById("floatingTotal");

const openCartBtn = document.getElementById("openCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cartItems");

const comboMessage = document.getElementById("comboMessage");
const subtotalEl = document.getElementById("subtotal");
const discountEl = document.getElementById("discount");
const deliveryChargeEl = document.getElementById("deliveryCharge");
const grandTotalEl = document.getElementById("grandTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

const pickupBtn = document.getElementById("pickupBtn");
const deliveryBtn = document.getElementById("deliveryBtn");
const pickupDate = document.getElementById("pickupDate");
const shippingMessage = document.getElementById("shippingMessage");
const deliveryAddress = document.getElementById("deliveryAddress");

let selectedMethod = "pickup";

function formatRM(amount) {
  return `RM${amount.toFixed(2).replace(".00", "")}`;
}

function openCart() {
  cartDrawer.classList.add("active");
  cartOverlay.classList.add("active");
  document.body.classList.add("cart-open");
}

function closeCart() {
  cartDrawer.classList.remove("active");
  cartOverlay.classList.remove("active");
  document.body.classList.remove("cart-open");
}

openCartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

menuCards.forEach((card) => {

  const plus = card.querySelector(".menu-plus");
  const minus = card.querySelector(".menu-minus");
  const count = card.querySelector(".menu-count");

  plus.addEventListener("click", () => {

    const product = {
      id: card.dataset.id,
      name: card.dataset.name,
      price: Number(card.dataset.price),
      quantity: 1
    };

    addToCart(product);

    const item = cart.find(p => p.id === product.id);

    count.textContent = item.quantity;

  });

  minus.addEventListener("click", () => {

    decreaseQty(card.dataset.id);

    const item = cart.find(p => p.id === card.dataset.id);

    count.textContent = item ? item.quantity : 0;

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

function increaseQty(id) {
  const item = cart.find((product) => product.id === id);

  if (item) {
    item.quantity += 1;
  }

  renderCart();
}

function decreaseQty(id) {
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

function getTotalQty() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function getSubtotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function getComboDiscount(totalQty) {
  if (totalQty >= 6) return 8;
  if (totalQty >= 4) return 5;
  return 0;
}

function getDeliveryCharge() {
  return selectedMethod === "delivery" ? 8 : 0;
}

function setOrderMethod(method) {
  selectedMethod = method;

  if (method === "pickup") {
    pickupBtn.classList.add("active");
    deliveryBtn.classList.remove("active");

    pickupDate.style.display = "block";
    deliveryAddress.style.display = "none";
    shippingMessage.style.display = "none";
  }

  if (method === "delivery") {
    deliveryBtn.classList.add("active");
    pickupBtn.classList.remove("active");

    pickupDate.style.display = "none";
    deliveryAddress.style.display = "block";
    shippingMessage.style.display = "block";
  }

  renderCart();
}

pickupBtn.addEventListener("click", () => setOrderMethod("pickup"));
deliveryBtn.addEventListener("click", () => setOrderMethod("delivery"));

function updateComboMessage(totalQty, discount) {
  if (totalQty >= 6) {
    comboMessage.textContent = "🎉 Combo 6 applied. You saved RM8!";
  } else if (totalQty >= 4) {
    comboMessage.textContent = "🎉 Combo 4 applied. You saved RM5!";
  } else {
    const remaining = 4 - totalQty;
    comboMessage.textContent = `Add ${remaining} more Gookie${remaining > 1 ? "s" : ""} to unlock RM5 savings.`;
  }
}

function renderCart() {
  const totalQty = getTotalQty();
  const subtotal = getSubtotal();
  const discount = getComboDiscount(totalQty);
  const deliveryCharge = getDeliveryCharge();
  const grandTotal = subtotal - discount + deliveryCharge;

  floatingQty.textContent = `${totalQty} ${totalQty === 1 ? "Gookie" : "Gookies"}`;
  floatingTotal.textContent = formatRM(grandTotal);

  subtotalEl.textContent = formatRM(subtotal);
  discountEl.textContent = `-${formatRM(discount)}`;
  deliveryChargeEl.textContent = formatRM(deliveryCharge);
  grandTotalEl.textContent = formatRM(grandTotal);

  updateComboMessage(totalQty, discount);

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <p class="empty-cart">Your cart is still empty.</p>
    `;
    return;

menuCards.forEach((card) => {

  const count = card.querySelector(".menu-count");

  const item = cart.find(p => p.id === card.dataset.id);

  count.textContent = item ? item.quantity : 0;

});
  }

  cartItems.innerHTML = cart
    .map((item) => {
      const itemTotal = item.price * item.quantity;

      return `
        <div class="cart-item">
          <div>
            <h4>${item.name}</h4>
            <p>${item.quantity} × ${formatRM(item.price)} = ${formatRM(itemTotal)}</p>
          </div>

          <div class="qty-control">
            <button onclick="decreaseQty('${item.id}')">−</button>
            <strong>${item.quantity}</strong>
            <button onclick="increaseQty('${item.id}')">+</button>
          </div>
        </div>
      `;
    })
    .join("");
}

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const date = document.getElementById("pickupDate").value.trim();
  const notes = document.getElementById("customerNotes").value.trim();
  const method = selectedMethod;
const deliveryAddressValue = deliveryAddress.value.trim();

  if (!name || !phone) {
    alert("Please fill in your name and phone number.");
    return;
  }

  const totalQty = getTotalQty();
  const subtotal = getSubtotal();
  const discount = getComboDiscount(totalQty);
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
    `Date/Time: ${date || "-"}%0A` +
    `Delivery Address: ${notes || "-"}%0A` +
`Delivery Address: ${deliveryAddressValue || "-"}%0A%0A` +
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

renderCart();

const pickupBtn=document.getElementById("pickupBtn");
const deliveryBtn=document.getElementById("deliveryBtn");
const pickupDate=document.getElementById("pickupDate");
const shippingMessage=document.getElementById("shippingMessage");

pickupBtn.onclick=()=>{
pickupBtn.classList.add("active");
deliveryBtn.classList.remove("active");
pickupDate.style.display="block";
pickupDate.readOnly=false;
shippingMessage.style.display="none";
renderCart();

}

deliveryBtn.onclick=()=>{
deliveryBtn.classList.add("active");
pickupBtn.classList.remove("active");
pickupDate.style.display="none";
pickupDate.readOnly=true;
shippingMessage.style.display="block";

renderCart();

}

pickupBtn.addEventListener("click", () => setOrderMethod("pickup"));
deliveryBtn.addEventListener("click", () => setOrderMethod("delivery"));

// Initial state bila page mula dibuka
setOrderMethod("pickup");
renderCart();
