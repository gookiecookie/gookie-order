
/* GOOKIE SHOP — new-theme interactions */

const menuOpen = document.getElementById("menu-open");
const menuClose = document.getElementById("menu-close");
const menuOverlay = document.getElementById("menu-overlay");

function openMenu() {
  menuOverlay.hidden = false;
  requestAnimationFrame(() => menuOverlay.classList.add("is-open"));
  menuOpen.setAttribute("aria-expanded", "true");
  document.body.classList.add("menu-open");
}

function closeMenu() {
  menuOverlay.classList.remove("is-open");
  menuOpen.setAttribute("aria-expanded", "false");
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

/* Search */
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

/* Cart shell */
const cartButton = document.querySelector(".cart-btn");
const cartOverlay = document.getElementById("cart-overlay");
const cartCloseButton = document.getElementById("cart-close-btn");

function openCart(){
  if(!cartOverlay) return;
  cartOverlay.hidden = false;
  requestAnimationFrame(()=>cartOverlay.classList.add("is-open"));
  document.body.classList.add("cart-open");
}
function closeCart(){
  if(!cartOverlay) return;
  cartOverlay.classList.remove("is-open");
  document.body.classList.remove("cart-open");
  setTimeout(()=>{ cartOverlay.hidden = true; },280);
}
cartButton?.addEventListener("click", openCart);
cartCloseButton?.addEventListener("click", closeCart);
cartOverlay?.addEventListener("click",(event)=>{
  if(event.target === cartOverlay) closeCart();
});

/* Shop tabs */
const shopTabs = [...document.querySelectorAll("[data-shop-tab]")];
const shopPanels = [...document.querySelectorAll("[data-shop-panel]")];

function showShopPanel(name){
  shopTabs.forEach((tab)=>{
    const active = tab.dataset.shopTab === name;
    tab.classList.toggle("is-active",active);
    tab.setAttribute("aria-selected",active ? "true" : "false");
  });

  shopPanels.forEach((panel)=>{
    const active = panel.dataset.shopPanel === name;
    panel.classList.toggle("is-active",active);
    panel.hidden = !active;
  });
}

shopTabs.forEach((tab)=>{
  tab.addEventListener("click",()=>showShopPanel(tab.dataset.shopTab));
});

/* Box size visual state */
document.querySelectorAll("[data-box-size]").forEach((button)=>{
  button.addEventListener("click",()=>{
    document.querySelectorAll("[data-box-size]").forEach((item)=>
      item.classList.toggle("is-selected", item === button)
    );
  });
});

showShopPanel("build");
