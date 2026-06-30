const WHATSAPP_NUMBER = "60102810487";

const products = [
  { id:"og", name:"The OG", price:8, image:"assets/images/classic choc chip.png", desc:"Golden vanilla dough loaded with chocolate chips." },
  { id:"dark-seasalt", name:"Dark Seasalt", price:8, image:"assets/images/dark seasalt.png", desc:"Rich dark cocoa cookie finished with sea salt." },
  { id:"red-velvet", name:"Red Velvet", price:9, image:"assets/images/red velvet.png", desc:"Velvety cocoa cookie with creamy white chocolate notes." },
  { id:"matchadamia", name:"Matchadamia", price:10, image:"assets/images/matchadamia.png", desc:"Matcha cookie with macadamia and chocolate." },
  { id:"og-smores", name:"OG S’mores", price:10, image:"assets/images/og smores.png", desc:"Classic cookie with toasted marshmallow and chocolate." },
  { id:"dark-smores", name:"Dark S’mores", price:10, image:"assets/images/dark smores.png", desc:"Dark cocoa cookie with gooey s’mores centre." },
  { id:"rocky-road", name:"Rocky Road", price:10, image:"assets/images/rocky road.png", desc:"Chocolate, marshmallow and nutty crunch." },
  { id:"biscoff-lava", name:"Biscoff Lava", price:11, image:"assets/images/biscoff lava.png", desc:"Biscoff cookie butter lava centre." },
  { id:"choco-lava", name:"Choco Lava", price:11, image:"assets/images/choco lava.png", desc:"Chocolate cookie with molten chocolate centre." },
  { id:"tiramisu-lava", name:"Tiramisu Lava", price:11, image:"assets/images/tiramisu lava.png", desc:"Coffee-kissed cookie with tiramisu-inspired lava." }
];

const cart = {};

const grid = document.getElementById("productGrid");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const toast = document.getElementById("toast");

function money(n){ return `RM${n}`; }

function renderProducts(){
  grid.innerHTML = products.map(p => `
    <article class="card">
      <div class="card-img-wrap">
        <img src="${p.image}" alt="${p.name}" onerror="this.src='assets/images/logo.png'">
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

function changeQty(id, delta){
  cart[id] = Math.max(0, (cart[id] || 0) + delta);
  if(cart[id] === 0) delete cart[id];
  updateUI();
  if(delta > 0) showToast("Added to cart 🍪");
}

function getCartData(){
  const items = Object.entries(cart).map(([id, qty]) => {
    const product = products.find(p => p.id === id);
    return { ...product, qty, line: product.price * qty };
  });
  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + i.line, 0);

  let discount = 0;
  if(count >= 6) discount = 8;
  else if(count >= 4) discount = 5;

  return { items, count, subtotal, discount, total: Math.max(0, subtotal - discount) };
}

function comboText(count){
  if(count >= 6) return "🎉 Combo 6 applied. You saved RM8!";
  if(count === 5) return "🍪 Add 1 more cookie to upgrade your saving to RM8.";
  if(count >= 4) return "🎉 Combo 4 applied. You saved RM5!";
  const needed = 4 - count;
  return `🍪 Add ${needed} more cookie${needed > 1 ? "s" : ""} to save RM5.`;
}

function updateUI(){
  const data = getCartData();

  products.forEach(p => {
    const el = document.getElementById(`qty-${p.id}`);
    if(el) el.textContent = cart[p.id] || 0;
  });

  document.getElementById("cartCount").textContent = `${data.count} cookie${data.count !== 1 ? "s" : ""}`;
  document.getElementById("cartTotal").textContent = money(data.total);
  document.getElementById("subtotal").textContent = money(data.subtotal);
  document.getElementById("discount").textContent = `-${money(data.discount)}`;
  document.getElementById("grandTotal").textContent = money(data.total);
  document.getElementById("comboMessage").textContent = comboText(data.count);

  const cartItems = document.getElementById("cartItems");
  if(data.items.length === 0){
    cartItems.innerHTML = `<p style="color:#74665E;text-align:center;margin-top:30px;">Your cart is still empty.</p>`;
  } else {
    cartItems.innerHTML = data.items.map(item => `
      <div class="cart-row">
        <div>
          <strong>${item.name}</strong><br>
          <small>${item.qty} × ${money(item.price)}</small>
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

function openCart(){
  cartDrawer.classList.add("open");
  overlay.classList.add("show");
}
function closeCart(){
  cartDrawer.classList.remove("open");
  overlay.classList.remove("show");
}
function showToast(msg){
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1100);
}

function checkout(){
  const data = getCartData();
  if(data.count === 0){
    showToast("Add at least 1 cookie first");
    return;
  }

  const name = document.getElementById("customerName").value.trim();
  const type = document.getElementById("orderType").value;
  const date = document.getElementById("orderDate").value.trim();
  const note = document.getElementById("orderNote").value.trim();

  let message = `Hi Gookie! 🍪%0A%0AI'd like to order:%0A`;
  data.items.forEach(i => {
    message += `%0A${i.qty}x ${i.name} - ${money(i.line)}`;
  });

  message += `%0A%0ASubtotal: ${money(data.subtotal)}`;
  message += `%0ACombo Discount: -${money(data.discount)}`;
  message += `%0ATotal: ${money(data.total)}`;
  message += `%0A%0AName: ${encodeURIComponent(name || "")}`;
  message += `%0AOrder Type: ${encodeURIComponent(type)}`;
  message += `%0APreferred Date & Time: ${encodeURIComponent(date || "")}`;
  message += `%0ANotes / Address: ${encodeURIComponent(note || "")}`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
}

document.getElementById("openCart").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
document.getElementById("overlay").addEventListener("click", closeCart);
document.getElementById("checkoutBtn").addEventListener("click", checkout);

renderProducts();
updateUI();
