
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


/* ---------- SHARED CART ---------- */
// cart.js handles the drawer, badge, quantities and browser storage.

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


let selectedBoxSize = 4;
let selectedBoxPrice = 39;


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
  totalEl.textContent = `RM${selectedBoxPrice + (getGiftAddon("build")?.price || 0)}`;

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
  if (totalPicked() !== selectedBoxSize || !validateGiftAddon("build")) return;

  const flavours = Object.entries(quantities)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => ({ id, quantity: qty, name: document.querySelector(`[data-cookie-id="${id}"] h3`)?.textContent?.trim() || id }));
  const addon = getGiftAddon("build");
  const details = flavours.map(f => `${f.quantity}× ${f.name}`).join(", ") + giftAddonSummary("build");
  const added = window.GookieCart?.add({
    id: `build-${selectedBoxSize}`,
    name: `Build Your Box · ${selectedBoxSize} pcs`,
    price: selectedBoxPrice + (addon?.price || 0),
    quantity: 1,
    details,
    image: "chunky-box.png",
    productType: "build-box",
    boxSize: selectedBoxSize,
    flavours,
    addon: addon ? { ...addon } : null
  });
  if (added) {
    resetGiftAddon("build");
    clearSelection();
  }
});

updateBuilder();



/* V7 GIFT ADDONS */
function getGiftAddon(n){const g=document.querySelector(`[data-addon-group="${n}"]`),s=g?.querySelector('input[type="radio"]:checked');if(!g||!s)return null;const message=g.querySelector('textarea')?.value.trim()||"";return{type:s.value,price:Number(s.dataset.price||0),label:s.value==="party-kit"?"Party Kit + Wish Card":"Wish Card",message}}
function giftAddonSummary(n){const a=getGiftAddon(n);return a?` · ${a.label}${a.message?` — “${a.message}”`:""}`:""}
function resetGiftAddon(n){const g=document.querySelector(`[data-addon-group="${n}"]`);if(!g)return;g.querySelectorAll('input[type="radio"]').forEach(x=>x.checked=false);const t=g.querySelector('textarea'),b=g.querySelector('.gookie-addon-message'),k=g.querySelector('.gookie-addon-message-foot span b');if(t)t.value="";if(k)k.textContent="0";if(b)b.hidden=true}
function validateGiftAddon(n){const a=getGiftAddon(n);if(a?.type==="wish-card"&&!a.message){document.querySelector(`[data-addon-group="${n}"] textarea`)?.focus();return false}return true}
document.querySelectorAll('[data-addon-group]').forEach(g=>{const b=g.querySelector('.gookie-addon-message'),t=g.querySelector('textarea'),k=g.querySelector('.gookie-addon-message-foot span b');g.querySelectorAll('input[type="radio"]').forEach(x=>x.addEventListener('change',()=>{if(b)b.hidden=false;t?.focus();updateBuilder();updateMiniTotal();updateBuffetPrice()}));t?.addEventListener('input',()=>{if(k)k.textContent=t.value.length});g.querySelector('.gookie-addon-clear')?.addEventListener('click',()=>{resetGiftAddon(g.dataset.addonGroup);updateBuilder();updateMiniTotal();updateBuffetPrice()})});

/* ---------- MINI GOOKIES ---------- */
const addMiniGookiesToBasket = document.getElementById("addMiniGookiesToBasket");
const miniPriceEl=document.querySelector(".mini-gookies-price strong");
function updateMiniTotal(){if(miniPriceEl)miniPriceEl.textContent=`RM${59+(getGiftAddon("mini")?.price||0)}`}

addMiniGookiesToBasket?.addEventListener("click", () => {
  if (!validateGiftAddon("mini")) return;
  const addon = getGiftAddon("mini");
  const added = window.GookieCart?.add({
    id: "mini-15", name: "Mini Gookies · 15 pcs",
    price: 59 + (addon?.price || 0), quantity: 1,
    details: "5× Wonder Chip, 5× Dark Crush, 5× Red Bloom" + giftAddonSummary("mini"),
    image: "treat-box.png", productType: "mini-gookies",
    flavours: [{id:"wonder-chip",quantity:5},{id:"dark-crush",quantity:5},{id:"red-bloom",quantity:5}],
    addon: addon ? { ...addon } : null
  });
  if (added) { resetGiftAddon("mini"); updateMiniTotal(); }
});

/* GOOKIE BUFFET */
const buffetCustomSticker=document.getElementById("buffetCustomSticker");
const buffetPrice=document.getElementById("buffetPrice");
const addBuffetToBasket=document.getElementById("addBuffetToBasket");
function getBuffetTotal(){return (buffetCustomSticker?.checked?149:129)+(getGiftAddon("buffet")?.price||0)}
function updateBuffetPrice(){if(buffetPrice) buffetPrice.textContent=`RM${getBuffetTotal()}`}
buffetCustomSticker?.addEventListener("change",updateBuffetPrice);
addBuffetToBasket?.addEventListener("click", () => {
  if (!validateGiftAddon("buffet")) return;
  const custom = Boolean(buffetCustomSticker?.checked);
  const addon = getGiftAddon("buffet");
  const added = window.GookieCart?.add({
    id: "buffet-30", name: "Gookie Buffet · 30 pcs",
    price: getBuffetTotal(), quantity: 1,
    details: "10× Wonder Chip, 10× Dark Crush, 10× Red Bloom" + giftAddonSummary("buffet") + (custom ? " · Customized stickers" : ""),
    image: "cookie-feast.png", productType: "gookie-buffet", customStickers: custom,
    flavours: [{id:"wonder-chip",quantity:10},{id:"dark-crush",quantity:10},{id:"red-bloom",quantity:10}],
    addon: addon ? { ...addon } : null
  });
  if (added) {
    if (buffetCustomSticker) buffetCustomSticker.checked = false;
    resetGiftAddon("buffet"); updateBuffetPrice();
  }
});

updateBuffetPrice();

updateMiniTotal();
