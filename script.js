const WHATSAPP_NUMBER = "60102810487";

const products = [
  { id:"classic", name:"Classic Choc Chip", price:8, image:"classic choc chip.png", desc:"Golden vanilla cookie loaded with chocolate chips.", badge:"BEST SELLER" },
  { id:"dark", name:"Dark Seasalt", price:8, image:"dark seasalt.png", desc:"Rich cocoa cookie with sea salt flakes.", badge:"BEST SELLER" },
  { id:"red", name:"Red Velvet", price:9, image:"red velvet.png", desc:"Velvety cocoa cookie with creamy chocolate notes.", badge:"BEST SELLER" },
  { id:"matcha", name:"Matchadamia", price:10, image:"matchadamia.png", desc:"Matcha cookie with macadamia and chocolate.", badge:"" },
  { id:"smores", name:"Smores", price:10, image:"smores.png", desc:"Classic cookie with toasted marshmallow.", badge:"" },
  { id:"berry", name:"White Berry", price:10, image:"white berry.png", desc:"Berry chocolate cookie with a tangy twist.", badge:"NEW" },
  { id:"biscoff", name:"Biscoff Lava", price:11, image:"biscoff lava.png", desc:"Biscoff cookie butter lava centre.", badge:"LAVA" },
  { id:"choco", name:"Choco Lava", price:11, image:"choco lava.png", desc:"Molten chocolate lava centre.", badge:"LAVA" },
  { id:"tiramisu", name:"Tiramisu Lava", price:11, image:"tiramisu lava.png", desc:"Coffee-kissed tiramisu inspired cookie.", badge:"LAVA" }
];

const cart = {};
const grid = document.getElementById("productGrid");
const openCartBtn = document.getElementById("openCart");
const closeCartBtn = document.getElementById("closeCart");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const checkoutBtn = document.getElementById("checkoutBtn");
const toast = document.getElementById("toast");

function money(n){ return "RM" + n; }

function renderProducts(){
  grid.innerHTML = products.map(p => `
    <article class="product-card">
      ${p.badge ? `<div class="badge">${p.badge}</div>` : ""}
      <div class="image-wrap">
        <img src="${p.image}" alt="${p.name}" onerror="this.src='logo.png'">
      </div>
      <div class="product-body">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="card-bottom">
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

function changeQty(id, amount){
  cart[id] = Math.max(0, (cart[id] || 0) + amount);
  if(cart[id] === 0) delete cart[id];
  updateCart();
  if(amount > 0) showToast("Added to cart 🍪");
}

function getCartData(){
  let count = 0;
  let subtotal = 0;
  const items = [];

  products.forEach(p => {
    const qty = cart[p.id] || 0;
    if(qty > 0){
      count += qty;
      subtotal += qty * p.price;
      items.push({ ...p, qty, lineTotal: qty * p.price });
    }
    const qtyEl = document.getElementById("qty-" + p.id);
    if(qtyEl) qtyEl.innerText = qty;
  });

  let discount = 0;
  if(count >= 6) discount = 8;
  else if(count >= 4) discount = 5;

  return { items, count, subtotal, discount, total: Math.max(0, subtotal - discount) };
}

function getComboMessage(count){
  if(count >= 6) return "🎉 Combo 6 applied. You saved RM8!";
  if(count === 5) return "🍪 Add 1 more Gookie to upgrade your saving to RM8.";
  if(count >= 4) return "🎉 Combo 4 applied. You saved RM5!";
  const needed = 4 - count;
  return `Add ${needed} more Gookie${needed > 1 ? "s" : ""} to save RM5.`;
}

function updateCart(){
  const data = getCartData();

  document.getElementById("cartCount").innerText = data.count + (data.count === 1 ? " Gookie" : " Gookies");
  document.getElementById("cartTotal").innerText = money(data.total);
  document.getElementById("subtotal").innerText = money(data.subtotal);
  document.getElementById("discount").innerText = "-" + money(data.discount);
  document.getElementById("grandTotal").innerText = money(data.total);
  document.getElementById("comboMessage").innerText = getComboMessage(data.count);
  document.getElementById("comboProgressFill").style.width = Math.min(100, (data.count / 6) * 100) + "%";

  const cartItems = document.getElementById("cartItems");
  if(data.items.length === 0){
    cartItems.innerHTML = `<div class="empty-cart">Your cart is still empty.<br>Add your first Gookie 🍪</div>`;
  } else {
    cartItems.innerHTML = data.items.map(item => `
      <div class="cart-row">
        <div>
          <strong>${item.name}</strong><br>
          <small>${item.qty} × ${money(item.price)} = ${money(item.lineTotal)}</small>
        </div>
        <div class="mini-controls">
          <button onclick="changeQty('${item.id}', -1)">−</button>
          <strong>${item.qty}</strong>
          <button onclick="changeQty('${item.id}', 1)">+</button>
        </div>
      </div>
    `).join("");
  }
}

function openCart(){ cartDrawer.classList.add("open"); overlay.classList.add("show"); }
function closeCart(){ cartDrawer.classList.remove("open"); overlay.classList.remove("show"); }

function showToast(message){
  toast.innerText = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1200);
}

function checkout(){
  const data = getCartData();
  if(data.count === 0){ alert("Please add at least 1 Gookie first."); return; }

  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const type = document.getElementById("orderType").value;
  const date = document.getElementById("orderDate").value.trim();
  const note = document.getElementById("orderNote").value.trim();

  let message = "Hi Gookie! 🍪%0A%0AI want to order:%0A";
  data.items.forEach(item => { message += `%0A${item.qty}x ${item.name} - ${money(item.lineTotal)}`; });
  message += `%0A%0ASubtotal: ${money(data.subtotal)}`;
  message += `%0ACombo Discount: -${money(data.discount)}`;
  message += `%0ATotal: ${money(data.total)}`;
  message += `%0A%0AName: ${encodeURIComponent(name)}`;
  message += `%0APhone: ${encodeURIComponent(phone)}`;
  message += `%0AOrder Type: ${encodeURIComponent(type)}`;
  message += `%0APreferred Date/Time: ${encodeURIComponent(date)}`;
  message += `%0ANotes/Address: ${encodeURIComponent(note)}`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
}

openCartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
checkoutBtn.addEventListener("click", checkout);

renderProducts();
updateCart();
