"use strict";

const body = document.body;
const pageOverlay = document.getElementById("pageOverlay");
const menuButton = document.getElementById("menuButton");
const menuDrawer = document.getElementById("menuDrawer");
const menuCloseButton = document.getElementById("menuCloseButton");

function openMenu() {
  menuDrawer.classList.add("is-open");
  menuDrawer.setAttribute("aria-hidden", "false");
  menuButton.setAttribute("aria-expanded", "true");

  pageOverlay.hidden = false;
  requestAnimationFrame(() => {
    pageOverlay.classList.add("is-visible");
  });

  body.classList.add("no-scroll");
}

function closeMenu() {
  menuDrawer.classList.remove("is-open");
  menuDrawer.setAttribute("aria-hidden", "true");
  menuButton.setAttribute("aria-expanded", "false");
  pageOverlay.classList.remove("is-visible");
  body.classList.remove("no-scroll");

  window.setTimeout(() => {
    if (!menuDrawer.classList.contains("is-open")) {
      pageOverlay.hidden = true;
    }
  }, 260);
}

menuButton.addEventListener("click", openMenu);
menuCloseButton.addEventListener("click", closeMenu);
pageOverlay.addEventListener("click", closeMenu);

document.querySelectorAll(".premium-menu-nav a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});
