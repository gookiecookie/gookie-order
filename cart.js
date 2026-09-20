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
          <button class="cart-edit" type="button" data-action="edit" data-index="${index}">EDIT ORDER</button>
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
    if (button.dataset.action === "edit") { edit(index); return; }
    if (button.dataset.action === "plus") items[index].quantity++;
    if (button.dataset.action === "minus") items[index].quantity--;
    if (button.dataset.action === "remove" || items[index].quantity <= 0) items.splice(index, 1);
    save();
  });

  // Cart editor is created once and shares the same cart data on every page.
  const editor = document.createElement("div");
  editor.className = "gookie-edit-overlay";
  editor.hidden = true;
  editor.innerHTML = `<section class="gookie-edit-modal" role="dialog" aria-modal="true" aria-labelledby="gookie-edit-title">
    <div class="gookie-edit-top"><h2 id="gookie-edit-title">EDIT YOUR ORDER</h2><button type="button" data-edit-close aria-label="Close editor">×</button></div>
    <div class="gookie-edit-content"></div>
    <div class="gookie-edit-bottom"><p class="gookie-edit-error" role="alert" aria-live="polite"></p><div class="gookie-edit-total"><span>UPDATED PRICE</span><strong></strong></div><button type="button" class="gookie-edit-save">SAVE CHANGES</button></div>
  </section>`;
  document.body.appendChild(editor);
  const content = editor.querySelector(".gookie-edit-content");
  const error = editor.querySelector(".gookie-edit-error");
  const total = editor.querySelector(".gookie-edit-total strong");
  let editing = null;
  const names = {"wonder-chip":"Wonder Chip","dark-crush":"Dark Crush","red-bloom":"Red Bloom","matcha-matchy":"Matcha Matchy","dream-cream":"Dream Cream","mallow-melt":"Mallow Melt","biscoff-boom":"Biscoff Boom","choco-loco":"Choco Loco","coffee-kiss":"Coffee Kiss","berry-blast":"Berry Blast"};
  const fixed = {"mini-gookies":[5,5,5],"gookie-buffet":[10,10,10]};
  const addonPrice = {"":0,"wish-card":2,"party-kit":7};
  function editorPrice() {
    const type = editing.draft.productType;
    const base = type === "build-box" ? (editing.draft.boxSize === 8 ? 74 : 39) : type === "mini-gookies" ? 59 : 129;
    return base + addonPrice[editing.draft.addon?.type || ""] + (type === "gookie-buffet" && editing.draft.customStickers ? 20 : 0);
  }
  function editorRefresh() {
    const draft = editing.draft;
    const chosen = (draft.flavours || []).reduce((n, f) => n + f.quantity, 0);
    const limit = draft.boxSize || 0;
    content.querySelectorAll("[data-flavour-count]").forEach(el => {
      const f = draft.flavours.find(x => x.id === el.dataset.flavourCount);
      el.textContent = f?.quantity || 0;
    });
    content.querySelectorAll("[data-flavour-plus]").forEach(el => { el.disabled = chosen >= limit; });
    content.querySelectorAll("[data-flavour-minus]").forEach(el => {
      el.disabled = !(draft.flavours.find(f => f.id === el.dataset.flavourMinus)?.quantity > 0);
    });
    const counter = content.querySelector(".gookie-edit-picked");
    if (counter) counter.textContent = `${chosen} / ${limit} picked`;
    total.textContent = money(editorPrice());
    error.textContent = "";
  }
  function edit(index) {
    if (!items[index]) return;
    const original = items[index];
    if (!["build-box","mini-gookies","gookie-buffet"].includes(original.productType)) return;
    // Edit a single box rather than silently changing every box in a multi-quantity line.
    editing = { index, draft: JSON.parse(JSON.stringify(original)) };
    const d = editing.draft;
    d.flavours = Array.isArray(d.flavours) ? d.flavours : [];
    if (d.productType === "build-box" && !d.flavours.length) {
      error.textContent = "This older cart item cannot be edited. Remove it and build a new box.";
      editing = null;
      return;
    }
    const build = d.productType === "build-box";
    const title = build ? `Build Your Box · ${d.boxSize} pcs` : d.productType === "mini-gookies" ? "Mini Gookies · 15 pcs" : "Gookie Buffet · 30 pcs";
    let html = `<p class="gookie-edit-product">${escapeHTML(title)}</p>`;
    if (build) {
      html += `<h3>YOUR GOOKIES <span class="gookie-edit-picked"></span></h3><div class="gookie-edit-flavours">`;
      html += Object.entries(names).map(([id,name]) => `<div class="gookie-edit-flavour"><span>${escapeHTML(name)}</span><div class="gookie-edit-qty"><button type="button" data-flavour-minus="${id}" aria-label="Remove ${escapeHTML(name)}">−</button><b data-flavour-count="${id}">0</b><button type="button" data-flavour-plus="${id}" aria-label="Add ${escapeHTML(name)}">+</button></div></div>`).join("");
      html += `</div>`;
    } else {
      html += `<p class="gookie-edit-fixed">Signature flavours are fixed for this product.</p>`;
    }
    html += `<h3>GIFT ADD-ONS</h3><div class="gookie-edit-addons">`;
    for (const [value,label] of [["","No add-on"],["wish-card","Wish Card · +RM2"],["party-kit","Party Kit + Wish Card · +RM7"]]) {
      html += `<label><input type="radio" name="gookieEditAddon" value="${value}" ${(!d.addon?.type ? "" : d.addon.type) === value ? "checked" : ""}><span>${label}</span></label>`;
    }
    html += `</div><div class="gookie-edit-message" ${!d.addon?.type ? "hidden" : ""}><label for="gookie-edit-message">Your wish card message (max 70 characters)</label><textarea id="gookie-edit-message" maxlength="70" rows="3">${escapeHTML(d.addon?.message || "")}</textarea></div>`;
    if (d.productType === "gookie-buffet") html += `<label class="gookie-edit-sticker"><input type="checkbox" id="gookie-edit-stickers" ${d.customStickers ? "checked" : ""}> Customized stickers · +RM20</label>`;
    content.innerHTML = html;
    editor.hidden = false;
    document.body.classList.add("gookie-edit-open");
    editorRefresh();
    editor.querySelector("[data-edit-close]").focus();
  }
  function closeEditor() { editor.hidden = true; editing = null; document.body.classList.remove("gookie-edit-open"); }
  editor.querySelector("[data-edit-close]").addEventListener("click", closeEditor);
  editor.addEventListener("click", event => { if (event.target === editor) closeEditor(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape" && !editor.hidden) { event.stopPropagation(); closeEditor(); } });
  content.addEventListener("click", event => {
    if (!editing) return;
    const button = event.target.closest("[data-flavour-plus],[data-flavour-minus]");
    if (!button) return;
    const plus = button.hasAttribute("data-flavour-plus");
    const id = plus ? button.dataset.flavourPlus : button.dataset.flavourMinus;
    let f = editing.draft.flavours.find(x => x.id === id);
    if (!f) { f = {id,name:names[id],quantity:0}; editing.draft.flavours.push(f); }
    const count = editing.draft.flavours.reduce((sum,x) => sum + x.quantity,0);
    if (plus && count < editing.draft.boxSize) f.quantity++;
    if (!plus && f.quantity > 0) f.quantity--;
    editorRefresh();
  });
  content.addEventListener("change", event => {
    if (!editing) return;
    if (event.target.name === "gookieEditAddon") {
      const type = event.target.value;
      editing.draft.addon = type ? {type,price:addonPrice[type],label:type === "wish-card" ? "Wish Card" : "Party Kit + Wish Card",message:editing.draft.addon?.message || ""} : null;
      content.querySelector(".gookie-edit-message").hidden = !type;
    }
    if (event.target.id === "gookie-edit-stickers") editing.draft.customStickers = event.target.checked;
    editorRefresh();
  });
  editor.querySelector(".gookie-edit-save").addEventListener("click", () => {
    if (!editing) return;
    const d = editing.draft;
    if (d.productType === "build-box" && d.flavours.reduce((n,f) => n + f.quantity,0) !== d.boxSize) {
      error.textContent = `Please pick exactly ${d.boxSize} Gookies.`; return;
    }
    const message = content.querySelector("#gookie-edit-message")?.value.trim() || "";
    if (d.addon && !message) { error.textContent = "Please write your wish card message."; return; }
    if (d.addon) d.addon.message = message;
    const flavourDetails = d.flavours.filter(f => f.quantity > 0).map(f => `${f.quantity}× ${names[f.id] || f.name || f.id}`).join(", ");
    const gift = d.addon ? ` · ${d.addon.label}${message ? ` — “${message}”` : ""}` : "";
    d.details = flavourDetails + gift + (d.productType === "gookie-buffet" && d.customStickers ? " · Customized stickers" : "");
    d.price = editorPrice();
    // A multi-quantity line is split so that only one box is edited.
    const original = items[editing.index];
    if (!original) { closeEditor(); return; }
    if (original.quantity > 1) {
      original.quantity--;
      d.quantity = 1;
      items.splice(editing.index + 1, 0, d);
    } else items[editing.index] = d;
    closeEditor(); save();
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
