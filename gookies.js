"use strict";

const gookieCatalogue = [
  {
    id: "wonder-chip",
    name: "Wonder Chip",
    subtitle: "Classic Chocolate Chip",
    description:
      "The cookie that started the wonder — golden, chunky and loaded with chocolate in every bite.",
    image: "wonder-chip.png",
    allergens: ["Wheat", "Milk", "Egg", "Soy"],
  },
  {
    id: "choco-loco",
    name: "Choco Loco",
    subtitle: "Milk Chocolate Chip",
    description:
      "A joyful chocolate overload for days when one kind of chocolate is simply not enough.",
    image: "choco-loco.png",
    allergens: ["Wheat", "Milk", "Egg", "Soy"],
  },
  {
    id: "dark-crush",
    name: "Dark Crush",
    subtitle: "Dark Chocolate & Sea Salt",
    description:
      "Deep cocoa, dark chocolate and a little sea salt for the perfect bold, balanced bite.",
    image: "dark-crush.png",
    allergens: ["Wheat", "Milk", "Egg", "Soy"],
  },
  {
    id: "red-bloom",
    name: "Red Bloom",
    subtitle: "Red Velvet",
    description:
      "Soft red velvet charm with creamy white chocolate woven through every chunky bite.",
    image: "red-bloom.png",
    allergens: ["Wheat", "Milk", "Egg", "Soy"],
  },
  {
    id: "matcha-matchy",
    name: "Matcha Matchy",
    subtitle: "Matcha & Macadamia",
    description:
      "Earthy matcha, creamy white chocolate and roasted macadamia in one very happy match.",
    image: "matcha-matchy.png",
    allergens: ["Wheat", "Milk", "Egg", "Soy", "Tree Nuts"],
  },
  {
    id: "dream-cream",
    name: "Dream Cream",
    subtitle: "Cookies & Cream",
    description:
      "Chocolate cookie crumbs, creamy notes and the kind of comfort that disappears far too quickly.",
    image: "dream-cream.png",
    allergens: ["Wheat", "Milk", "Egg", "Soy"],
  },
  {
    id: "mallow-melt",
    name: "Mallow Melt",
    subtitle: "S’mores",
    description:
      "Toasty marshmallow comfort with chocolate and cookie goodness tucked into every bite.",
    image: "mallow-melt.png",
    allergens: ["Wheat", "Milk", "Egg", "Soy"],
  },
  {
    id: "biscoff-boom",
    name: "Biscoff Boom",
    subtitle: "Biscoff Filled",
    description:
      "Caramelised cookie flavour with a soft Biscoff centre that goes boom the moment you bite in.",
    image: "biscoff-boom.png",
    allergens: ["Wheat", "Milk", "Egg", "Soy"],
  },
  {
    id: "choki-chomp",
    name: "Choki Chomp",
    subtitle: "Chocolate Hazelnut Filled",
    description:
      "A playful chocolate-hazelnut centre wrapped inside a chunky cookie made for serious chomping.",
    image: "choki-chomp.png",
    allergens: ["Wheat", "Milk", "Egg", "Soy", "Tree Nuts"],
  },
  {
    id: "coffee-kiss",
    name: "Coffee Kiss",
    subtitle: "Tiramisu Filled",
    description:
      "A gentle coffee kiss with creamy tiramisu-inspired flavour inside a soft, chunky cookie.",
    image: "coffee-kiss.png",
    allergens: ["Wheat", "Milk", "Egg", "Soy"],
  },
  {
    id: "monthly-wonder",
    name: "Monthly Wonder",
    subtitle: "Limited Monthly Flavour",
    description:
      "A new chunky wonder that changes with the month — here for a delicious time, not a long time.",
    image: "monthly-wonder.png",
    allergens: ["Wheat", "Milk", "Egg", "Soy", "Peanuts"],
  },
];

const body = document.body;
const overlay = document.getElementById("pageOverlay");
const menuButton = document.getElementById("menuButton");
const menuDrawer = document.getElementById("menuDrawer");
const menuCloseButton = document.getElementById("menuCloseButton");

const grid = document.getElementById("gookieCatalogueGrid");
const modal = document.getElementById("gookieProfileModal");
const modalClose = document.getElementById("gookieProfileClose");
const modalImage = document.getElementById("gookieProfileImage");
const modalSubtitle = document.getElementById("gookieProfileSubtitle");
const modalName = document.getElementById("gookieProfileName");
const modalDescription = document.getElementById("gookieProfileDescription");
const allergenList = document.getElementById("gookieAllergenList");

function showOverlay() {
  overlay.hidden = false;
  requestAnimationFrame(() => overlay.classList.add("is-visible"));
  body.classList.add("no-scroll");
}

function hideOverlay() {
  overlay.classList.remove("is-visible");
  body.classList.remove("no-scroll");

  window.setTimeout(() => {
    if (
      !menuDrawer.classList.contains("is-open") &&
      !modal.classList.contains("is-open")
    ) {
      overlay.hidden = true;
    }
  }, 260);
}

function openMenu() {
  menuDrawer.classList.add("is-open");
  menuDrawer.setAttribute("aria-hidden", "false");
  menuButton.setAttribute("aria-expanded", "true");
  showOverlay();
}

function closeMenu() {
  menuDrawer.classList.remove("is-open");
  menuDrawer.setAttribute("aria-hidden", "true");
  menuButton.setAttribute("aria-expanded", "false");
  hideOverlay();
}

function openGookie(cookie) {
  modalImage.src = cookie.image;
  modalImage.alt = cookie.name;
  modalSubtitle.textContent = cookie.subtitle;
  modalName.textContent = cookie.name;
  modalDescription.textContent = cookie.description;

  const iconMap = {
    Wheat: "fa-wheat-awn",
    Milk: "fa-bottle-droplet",
    Egg: "fa-egg",
    Soy: "fa-seedling",
    Peanuts: "fa-seedling",
    "Tree Nuts": "fa-tree",
  };

  allergenList.innerHTML = cookie.allergens
    .map(
      (allergen) => `
        <span class="gookie-allergen-chip">
          <i class="fa-solid ${iconMap[allergen] || "fa-circle-info"}" aria-hidden="true"></i>
          ${allergen}
        </span>
      `
    )
    .join("");

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  showOverlay();
}

function closeGookie() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  hideOverlay();
}

function createGookieCard(cookie) {
  const button = document.createElement("button");

  button.className = "gookie-catalogue-card";
  button.type = "button";

  if (cookie.id === "monthly-wonder") {
    button.classList.add("is-monthly");
  }

  button.innerHTML = `
    <span class="gookie-catalogue-image">
      <img src="${cookie.image}" alt="${cookie.name}" loading="lazy">
    </span>
    <span class="gookie-catalogue-card-copy">
      <small>${cookie.subtitle}</small>
      <strong>${cookie.name}</strong>
    </span>
  `;

  button.addEventListener("click", () => openGookie(cookie));

  return button;
}

gookieCatalogue.forEach((cookie) => {
  grid.appendChild(createGookieCard(cookie));
});

menuButton.addEventListener("click", openMenu);
menuCloseButton.addEventListener("click", closeMenu);
modalClose.addEventListener("click", closeGookie);

overlay.addEventListener("click", () => {
  closeMenu();
  closeGookie();
});

document.querySelectorAll(".premium-menu-nav a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
    closeGookie();
  }
});
