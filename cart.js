/* GOOKIE CART — front-end drawer.
   The Shop page can add items by calling GookieCart.add(item).
   Checkout/payment is not connected yet.
*/
(() => {
  const KEY = "gookieCartV1";
  const overlay = document.getElementById("cart-overlay");
  const body = document.getElementById("cart-body");
  const footer = document.getElementById("cart-footer");
  const badge = document.querySelector(".cart-count");
  if (!overlay || !body || !footer || !badge) return;

  function load() {
    try {
      const value = JSON.parse(localStorage.getItem(KEY) || "[]");
      return Array.isArray(value) ? value.filter(item => item && typeof item.id === "string" && typeof item.name === "string" && Number.isFinite(item.price) && item.price >= 0 && Number.isInteger(item.quantity) && item.quantity > 0) : [];
    } catch { return []; }
  }

  let items = load();
  const money = amount => "RM" + amount.toFixed(2);
  const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (error) { console.warn("Cart could not be saved", error); }
    render();
    window.dispatchEvent(new CustomEvent("gookie:cart-updated", { detail: { items: items.slice() } }));
  }

  function render() {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    badge.textContent = count > 99 ? "99+" : String(count);
    footer.hidden = count === 0;

    if (!count) {
      body.innerHTML = `<div class="cart-empty" id="cart-empty">
        <p class="cart-empty-title">Your box is lonely.</p>
        <p>Add some Gookies to make it happier.</p>
        <a href="order.html" class="cart-shop-btn" id="cart-shop-btn">BUILD A BOX</a>
      </div>`;
      return;
    }

    body.innerHTML = `<div class="cart-items">${items.map((item, index) => `
      <article class="cart-item">
        ${item.image ? `<img class="cart-item-image" src="${escapeHTML(item.image)}" alt="">` : `<div></div>`}
        <div>
          <h3 class="cart-item-name">${escapeHTML(item.name)}</h3>
          ${item.details ? `<p class="cart-item-details">${escapeHTML(item.details)}</p>` : ""}
          <div class="cart-item-bottom">
            <strong class="cart-item-price">${money(item.price * item.quantity)}</strong>
            <div class="cart-qty">
              <button type="button" data-action="minus" data-index="${index}" aria-label="Reduce quantity">−</button>
              <span>${item.quantity}</span>
              <button type="button" data-action="plus" data-index="${index}" aria-label="Increase quantity">+</button>
            </div>
          </div>
          <button class="cart-remove" type="button" data-action="remove" data-index="${index}">Remove</button>
        </div>
      </article>`).join("")}</div>`;
    document.getElementById("cart-subtotal").textContent = money(subtotal);
  }

  function open() {
    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add("is-open"));
    document.body.classList.add("cart-open");
  }
  function close() {
    overlay.classList.remove("is-open");
    document.body.classList.remove("cart-open");
    setTimeout(() => { if (!overlay.classList.contains("is-open")) overlay.hidden = true; }, 280);
  }

  document.querySelector(".cart-btn")?.addEventListener("click", open);
  document.getElementById("cart-close-btn")?.addEventListener("click", close);
  overlay.addEventListener("click", event => { if (event.target === overlay) close(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape" && !overlay.hidden) close(); });
  body.addEventListener("click", event => {
    if (event.target.closest("#cart-shop-btn")) close();
    const button = event.target.closest("[data-action]");
    if (!button) return;
    const index = Number(button.dataset.index);
    if (!items[index]) return;
    if (button.dataset.action === "plus") items[index].quantity++;
    if (button.dataset.action === "minus") items[index].quantity--;
    if (button.dataset.action === "remove" || items[index].quantity <= 0) items.splice(index, 1);
    save();
  });

  window.GookieCart = {
    add(item) {
      if (!item || typeof item.id !== "string" || typeof item.name !== "string" ||
          !Number.isFinite(item.price) || item.price < 0) return false;
      const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));
      const existing = items.find(entry => entry.id === item.id && entry.details === (item.details || "") && entry.price === item.price);
      if (existing) existing.quantity += quantity;
      else items.push({ ...item, quantity, details: item.details || "", image: item.image || "" });
      save();
      open();
      return true;
    },
    getItems: () => items.map(item => ({ ...item })),
    clear() { items = []; save(); },
    open,
    close
  };
  window.addEventListener("storage", event => {
    if (event.key === KEY) { items = load(); render(); }
  });
  render();
})();
