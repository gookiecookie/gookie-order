const WHATSAPP_NUMBER = "60102810487";

const products = [
  { id:"classic", name:"Classic Choc Chip", price:8, image:"classic choc chip.png", desc:"Golden vanilla cookie loaded with chocolate chips." },
  { id:"dark", name:"Dark Seasalt", price:8, image:"dark seasalt.png", desc:"Rich cocoa cookie with sea salt flakes." },
  { id:"red", name:"Red Velvet", price:9, image:"red velvet.png", desc:"Velvety cocoa cookie with creamy chocolate notes." },
  { id:"matcha", name:"Matchadamia", price:10, image:"matchadamia.png", desc:"Matcha cookie with macadamia and chocolate." },
  { id:"smores", name:"Smores", price:10, image:"smores.png", desc:"Classic cookie with toasted marshmallow." },
  { id:"berry", name:"White Berry", price:10, image:"white berry.png", desc:"Berry chocolate cookie with a tangy twist." },
  { id:"biscoff", name:"Biscoff Lava", price:11, image:"biscoff lava.png", desc:"Biscoff cookie butter lava centre." },
  { id:"choco", name:"Choco Lava", price:11, image:"choco lava.png", desc:"Molten chocolate lava centre." },
  { id:"tiramisu", name:"Tiramisu Lava", price:11, image:"tiramisu lava.png", desc:"Coffee-kissed tiramisu inspired cookie." }
];

const cart = {};

const grid = document.getElementById("productGrid");

function money(n) {
  return "RM" + n;
}

function renderProducts() {
  grid.innerHTML = products.map(p => `
    <article class="card">
      <div class="card-img-wrap">
        <img src="${p.image}" alt="${p.name}">
      </div>

      <div class="card-body">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>

        <div class="card-footer">
          <div class="price">${money(p.price)}</div>

          <div class="qty">
            <button onclick="changeQty('${p.id}', -1)">−</button>
            <span id="qty-${p.id}">0</span>
            <button onclick="changeQty('${p.id}', 1)">+</button>
          </div>
        </div>
      </div>
    </article>
  `).join("");
}

function changeQty(id, amount) {
  cart[id] = (cart[id] || 0) + amount;

  if (cart[id] < 0) cart[id] = 0;

  updateCart();
}

function updateCart() {
  let count = 0;
  let subtotal = 0;
  let cartHTML = "";

  products.forEach(p => {
    const qty = cart[p.id] || 0;
    count += qty;
    subtotal += qty * p.price;

    const qtyEl = document.getElementById("qty-" + p.id);
    if (qtyEl) qtyEl.innerText = qty;

    if (qty > 0) {
      cartHTML += `
        <div class="cart-row">
          <div>
            <strong>${p.name}</strong><br>
            <small>${qty} × ${money(p.price)}</small>
          </div>
          <div class="mini-controls">
            <button onclick="changeQty('${p.id}', -1)">−</button>
            <strong>${qty}</strong>
            <button onclick="changeQty('${p.id}', 1)">+</button>
          </div>
        </div>
      `;
    }
  });

  let discount = 0;
  if (count >= 6) discount = 8;
  else if (count >= 4) discount = 5;

  const total = subtotal - discount;

  document.getElementById("cartCount").innerText = count + " cookies";
  document.getElementById("cartTotal").innerText = money(total);

  document.getElementById("cartItems").innerHTML =
    cartHTML || `<p style="text-align:center;color:#74665E;">Your cart is empty.</p>`;

  document.getElementById("subtotal").innerText = money(subtotal);
  document.getElementById("discount").innerText = "-" + money(discount);
  document.getElementById("grandTotal").innerText = money(total);

  let comboText = "Add 4 cookies to save RM5.";
  if (count >= 6) comboText = "🎉 Combo 6 applied. You saved RM8!";
  else if (count >= 4) comboText = "🎉 Combo 4 applied. You saved RM5!";
  else if (count > 0) comboText = `Add ${4 - count} more cookie(s) to save RM5.`;

  document.getElementById("comboMessage").innerText = comboText;
}

renderProducts();
updateCart();

const openCartBtn = document.getElementById("openCart");
const closeCartBtn = document.getElementById("closeCart");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");

openCartBtn.addEventListener("click", () => {
  cartDrawer.classList.add("open");
  overlay.classList.add("show");
});

closeCartBtn.addEventListener("click", () => {
  cartDrawer.classList.remove("open");
  overlay.classList.remove("show");
});

overlay.addEventListener("click", () => {
  cartDrawer.classList.remove("open");
  overlay.classList.remove("show");
});

const checkoutBtn = document.getElementById("checkoutBtn");

checkoutBtn.addEventListener("click", () => {
  let count = 0;
  let subtotal = 0;
  let message = "Hi Gookie! 🍪%0A%0AI want to order:%0A";

  products.forEach(p => {
    const qty = cart[p.id] || 0;

    if (qty > 0) {
      count += qty;
      subtotal += qty * p.price;
      message += `%0A${qty}x ${p.name} - ${money(qty * p.price)}`;
    }
  });

  if (count === 0) {
    alert("Please add at least 1 cookie first.");
    return;
  }

  let discount = 0;
  if (count >= 6) discount = 8;
  else if (count >= 4) discount = 5;

  const total = subtotal - discount;

  const name = document.getElementById("customerName").value;
  const type = document.getElementById("orderType").value;
  const date = document.getElementById("orderDate").value;
  const note = document.getElementById("orderNote").value;

  message += `%0A%0ASubtotal: ${money(subtotal)}`;
  message += `%0ACombo Discount: -${money(discount)}`;
  message += `%0ATotal: ${money(total)}`;

  message += `%0A%0AName: ${encodeURIComponent(name)}`;
  message += `%0AOrder Type: ${encodeURIComponent(type)}`;
  message += `%0APreferred Date/Time: ${encodeURIComponent(date)}`;
  message += `%0ANotes/Address: ${encodeURIComponent(note)}`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
});
