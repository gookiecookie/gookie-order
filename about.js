"use strict";

/* =========================================================
   GOOKIE — ABOUT PAGE INTERACTIONS
   Uses the same header/menu/search/cart structure as Goodies.
   ========================================================= */

const menuOpen = document.getElementById("menu-open");
const menuClose = document.getElementById("menu-close");
const menuOverlay = document.getElementById("menu-overlay");

function openMenu() {
  menuOverlay.hidden = false;

  requestAnimationFrame(() => {
    menuOverlay.classList.add("is-open");
  });

  menuOpen.setAttribute("aria-expanded", "true");
  document.body.classList.add("menu-open");
}

function closeMenu() {
  menuOverlay.classList.remove("is-open");
  menuOpen.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");

  setTimeout(() => {
    menuOverlay.hidden = true;
  }, 220);
}

menuOpen?.addEventListener("click", openMenu);
menuClose?.addEventListener("click", closeMenu);

menuOverlay?.addEventListener("click", (event) => {
  if (event.target === menuOverlay) closeMenu();
});

document.querySelectorAll(".menu-links a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});


/* SEARCH */

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


/* CART */

const cartButton = document.querySelector(".cart-btn");
const cartOverlay = document.getElementById("cart-overlay");
const cartCloseButton = document.getElementById("cart-close-btn");
const cartShopButton = document.getElementById("cart-shop-btn");

function openCart() {
  if (!cartOverlay) return;

  cartOverlay.hidden = false;

  requestAnimationFrame(() => {
    cartOverlay.classList.add("is-open");
  });

  document.body.classList.add("cart-open");
}

function closeCart() {
  if (!cartOverlay) return;

  cartOverlay.classList.remove("is-open");
  document.body.classList.remove("cart-open");

  setTimeout(() => {
    cartOverlay.hidden = true;
  }, 280);
}

cartButton?.addEventListener("click", openCart);
cartCloseButton?.addEventListener("click", closeCart);

cartOverlay?.addEventListener("click", (event) => {
  if (event.target === cartOverlay) closeCart();
});

cartShopButton?.addEventListener("click", closeCart);


/* ESC CLOSE */

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  if (menuOverlay?.classList.contains("is-open")) closeMenu();
  if (cartOverlay?.classList.contains("is-open")) closeCart();

  searchPanel?.classList.remove("is-open");
});
