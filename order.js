
/* ========================================
   GOOKIE ORDER PAGE V3
   Direct cookie-box builder
======================================== */

/* ---------- HEADER / MENU ---------- */
const menuOpen = document.getElementById("menu-open");
const menuClose = document.getElementById("menu-close");
const menuOverlay = document.getElementById("menu-overlay");

function openMenu() {
  if (!menuOverlay) return;
  menuOverlay.hidden = false;
  requestAnimationFrame(() => menuOverlay.classList.add("is-open"));
  menuOpen?.setAttribute("aria-expanded", "true");
  document.body.classList.add("menu-open");
}

function closeMenu() {
  if (!menuOverlay) return;
  menuOverlay.classList.remove("is-open");
  menuOpen?.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
  setTimeout(() => { menuOverlay.hidden = true; }, 220);
}

menuOpen?.addEventListener("click", openMenu);
menuClose?.addEventListener("click", closeMenu);
menuOverlay?.addEventListener("click", (event) => {
  if (event.target === menuOverlay) closeMenu();
});
document.querySelectorAll(".menu-links a").forEach((link) =>
  link.addEventListener("click", closeMenu)
);


/* ---------- SEARCH ---------- */
const searchButton = document.querySelector(".search-btn");
const searchPanel = document.getElementById("search-panel");
const searchInput = document.getElementById("site-search-input");
const searchCloseButton = document.getElementById("search-close-btn");

searchButton?.addEventListener("click", () => {
  searchPanel?.classList.toggle("is-open");
  if (searchPanel?.classList.contains("is-open")) {
    setTimeout(() => searchInput?.focus(), 150);
  }
});

searchCloseButton?.addEventListener("click", () => {
  searchPanel?.classList.remove("is-open");
});


/* ---------- CART DRAWER ---------- */
const cartButton = document.querySelector(".cart-btn");
const cartOverlay = document.getElementById("cart-overlay");
const cartCloseButton = document.getElementById("cart-close-btn");

function openCart() {
  if (!cartOverlay) return;
  cartOverlay.hidden = false;
  requestAnimationFrame(() => cartOverlay.classList.add("is-open"));
  document.body.classList.add("cart-open");
}

function closeCart() {
  if (!cartOverlay) return;
  cartOverlay.classList.remove("is-open");
  document.body.classList.remove("cart-open");
  setTimeout(() => { cartOverlay.hidden = true; }, 280);
}

cartButton?.addEventListener("click", openCart);
cartCloseButton?.addEventListener("click", closeCart);
cartOverlay?.addEventListener("click", (event) => {
  if (event.target === cartOverlay) closeCart();
});


/* ---------- SHOP TABS ---------- */
const shopTabs = [...document.querySelectorAll("[data-shop-tab]")];
const shopPanels = [...document.querySelectorAll("[data-shop-panel]")];

function showShopPanel(name) {
  shopTabs.forEach((tab) => {
    const active = tab.dataset.shopTab === name;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", active ? "true" : "false");
  });

  shopPanels.forEach((panel) => {
    const active = panel.dataset.shopPanel === name;
    panel.classList.toggle("is-active", active);
    panel.hidden = !active;
  });
}

shopTabs.forEach((tab) => {
  tab.addEventListener("click", () => showShopPanel(tab.dataset.shopTab));
});


/* ---------- DIRECT BUILD YOUR BOX ---------- */
const cookieCards = [...document.querySelectorAll(".cookie-picker-row, .cookie-picker-card")];
const sizeButtons = [...document.querySelectorAll("[data-box-size]")];

const pickedCountEl = document.getElementById("builderPickedCount");
const capacityEl = document.getElementById("builderBoxCapacity");
const totalEl = document.getElementById("builderTotal");
const addButton = document.getElementById("addBuildBoxToBasket");
const fillBestSellers = document.getElementById("fillBestSellers");
const cartCount = document.querySelector(".cart-count");

let selectedBoxSize = 4;
let selectedBoxPrice = 39;
let basketCount = 0;

const quantities = Object.fromEntries(
  cookieCards.map((card) => [card.dataset.cookieId, 0])
);

const bestSellerIds = [
  "wonder-chip",
  "dark-crush",
  "red-bloom",
  "mallow-melt"
];

function totalPicked() {
  return Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
}

function updateCookieCard(card) {
  const id = card.dataset.cookieId;
  const count = quantities[id];
  const countEl = card.querySelector("[data-qty-count]");
  const minus = card.querySelector("[data-qty-minus]");
  const plus = card.querySelector("[data-qty-plus]");

  countEl.textContent = count;
  minus.disabled = count <= 0;
  plus.disabled = totalPicked() >= selectedBoxSize;
}

function updateBuilder() {
  const picked = totalPicked();
  const remaining = selectedBoxSize - picked;

  pickedCountEl.textContent = picked;
  capacityEl.textContent = selectedBoxSize;
  totalEl.textContent = `RM${selectedBoxPrice}`;

  cookieCards.forEach(updateCookieCard);

  if (picked === selectedBoxSize) {
    addButton.disabled = false;
    addButton.textContent = "ADD TO BASKET →";
  } else {
    addButton.disabled = true;
    addButton.textContent =
      `PICK ${remaining} MORE ${remaining === 1 ? "GOOKIE" : "GOOKIES"}`;
  }
}

function clearSelection() {
  Object.keys(quantities).forEach((id) => {
    quantities[id] = 0;
  });
  updateBuilder();
}

sizeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedBoxSize = Number(button.dataset.boxSize);
    selectedBoxPrice = Number(button.dataset.boxPrice);

    sizeButtons.forEach((item) =>
      item.classList.toggle("is-selected", item === button)
    );

    clearSelection();
  });
});

cookieCards.forEach((card) => {
  const id = card.dataset.cookieId;

  card.querySelector("[data-qty-plus]")?.addEventListener("click", () => {
    if (totalPicked() >= selectedBoxSize) return;
    quantities[id] += 1;
    updateBuilder();
  });

  card.querySelector("[data-qty-minus]")?.addEventListener("click", () => {
    if (quantities[id] <= 0) return;
    quantities[id] -= 1;
    updateBuilder();
  });
});

fillBestSellers?.addEventListener("click", () => {
  clearSelection();

  if (selectedBoxSize === 4) {
    bestSellerIds.forEach((id) => {
      quantities[id] = 1;
    });
  } else {
    bestSellerIds.forEach((id) => {
      quantities[id] = 2;
    });
  }

  updateBuilder();
});

addButton?.addEventListener("click", () => {
  if (totalPicked() !== selectedBoxSize) return;

  basketCount += 1;
  if (cartCount) cartCount.textContent = String(basketCount);

  const selectedSummary = Object.entries(quantities)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => {
      const card = document.querySelector(`[data-cookie-id="${id}"]`);
      const name = card?.querySelector("h3")?.textContent || id;
      return `${qty}× ${name}`;
    })
    .join(", ");

  const cartBody = document.getElementById("cart-body");
  const cartEmpty = document.getElementById("cart-empty");

  if (cartBody) {
    if (cartEmpty) cartEmpty.style.display = "none";

    const item = document.createElement("div");
    item.className = "order-cart-build-item";
    item.innerHTML = `
      <strong>Build Your Cookie Box · ${selectedBoxSize}</strong>
      <span>${selectedSummary}</span>
      <b>RM${selectedBoxPrice}</b>
    `;
    cartBody.appendChild(item);
  }

  openCart();
  clearSelection();
});

updateBuilder();


/* ---------- MINI GOOKIES ---------- */
const addMiniGookiesToBasket = document.getElementById("addMiniGookiesToBasket");

addMiniGookiesToBasket?.addEventListener("click", () => {
  basketCount += 1;
  if (cartCount) cartCount.textContent = String(basketCount);

  const cartBody = document.getElementById("cart-body");
  const cartEmpty = document.getElementById("cart-empty");

  if (cartBody) {
    if (cartEmpty) cartEmpty.style.display = "none";

    const item = document.createElement("div");
    item.className = "order-cart-build-item";
    item.innerHTML = `
      <strong>Mini Gookies · 15 pcs</strong>
      <span>5× Wonder Chip, 5× Dark Crush, 5× Red Bloom</span>
      <b>RM59</b>
    `;
    cartBody.appendChild(item);
  }

  openCart();
});
