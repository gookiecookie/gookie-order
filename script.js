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

  products.forEach(p => {
    const qty = cart[p.id] || 0;
    count += qty;
    subtotal += qty * p.price;

    const qtyEl = document.getElementById("qty-" + p.id);
    if (qtyEl) qtyEl.innerText = qty;
  });

  let discount = 0;
  if (count >= 6) discount = 8;
  else if (count >= 4) discount = 5;

  const total = subtotal - discount;

  document.getElementById("cartCount").innerText = count + " cookies";
  document.getElementById("cartTotal").innerText = money(total);
}

renderProducts();
updateCart();
