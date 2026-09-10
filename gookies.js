"use strict";

const catalogue = [
  {
    name: "Wonder Chip",
    subtitle: "Classic Chocolate Chip",
    description: "Classic chocolate chip with crisp edges and a soft, chewy centre.",
    image: "wonder-chip.png",
    badge: "BEST SELLER",
    type: "best",
    allergens: ["Wheat", "Milk", "Egg", "Soy"]
  },
  {
    name: "Dark Crush",
    subtitle: "Dark Chocolate",
    description: "Deep chocolate flavour with a rich, soft and chunky bite.",
    image: "dark-crush.png",
    badge: "BEST SELLER",
    type: "best",
    allergens: ["Wheat", "Milk", "Egg", "Soy"]
  },
  {
    name: "Red Bloom",
    subtitle: "Red Velvet",
    description: "Velvety red cocoa cookie with creamy white chocolate.",
    image: "red-bloom.png",
    allergens: ["Wheat", "Milk", "Egg", "Soy"]
  },
  {
    name: "Matcha Matchy",
    subtitle: "Matcha & Macadamia",
    description: "Earthy matcha with creamy white chocolate and macadamia.",
    image: "matcha-matchy.png",
    allergens: ["Wheat", "Milk", "Egg", "Soy", "Tree Nuts"]
  },
  {
    name: "Dream Cream",
    subtitle: "Cookies & Cream",
    description: "Cookies and cream with a smooth, creamy centre.",
    image: "dream-cream.png",
    badge: "BEST SELLER",
    type: "best",
    allergens: ["Wheat", "Milk", "Egg", "Soy"]
  },
  {
    name: "Mallow Melt",
    subtitle: "S'mores",
    description: "Toasty marshmallow, chocolate and cookie goodness in every bite.",
    image: "mallow-melt.png",
    allergens: ["Wheat", "Milk", "Egg", "Soy"]
  },
  {
    name: "Biscoff Boom",
    subtitle: "Biscoff Lava",
    description: "Caramelised Biscoff flavour with a rich Biscoff centre.",
    image: "biscoff-boom.png",
    badge: "BEST SELLER",
    type: "best",
    allergens: ["Wheat", "Milk", "Egg", "Soy"]
  },
  {
    name: "Choco Loco",
    subtitle: "Chocolate Hazelnut",
    description: "Chocolatey, nutty and made for serious chocolate cravings.",
    image: "choco-loco.png",
    allergens: ["Wheat", "Milk", "Egg", "Soy", "Tree Nuts"]
  },
  {
    name: "Coffee Kiss",
    subtitle: "Coffee Inspired",
    description: "Coffee-forward flavour with a creamy, comforting finish.",
    image: "coffee-kiss.png",
    allergens: ["Wheat", "Milk", "Egg", "Soy"]
  },
  {
    name: "Berry Blast",
    subtitle: "Monthly Wonder",
    description: "A berry-packed limited drop, here for a delicious time only.",
    image: "berry-blast.png",
    badge: "LIMITED DROP",
    type: "limited",
    allergens: ["Wheat", "Milk", "Egg", "Soy"]
  }
];

const $ = selector => document.querySelector(selector);

const grid = $("#gookie-grid");
const modal = $("#gookie-modal");

function makeCard(cookie) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "gookie-card";
  button.setAttribute("aria-label", `View ${cookie.name}`);

  button.innerHTML = `
    <span class="gookie-card-image">
      ${cookie.badge ? `<span class="cookie-badge ${cookie.type === "limited" ? "limited" : ""}">${cookie.badge}</span>` : ""}
      <img src="${cookie.image}" alt="${cookie.name}" loading="lazy">
    </span>
    <h3>${cookie.name}</h3>
  `;

  button.addEventListener("click", () => openCookie(cookie));
  return button;
}

catalogue.forEach(cookie => {
  grid.appendChild(makeCard(cookie));
});

function openCookie(cookie) {
  $("#modal-image").src = cookie.image;
  $("#modal-image").alt = cookie.name;
  $("#modal-name").textContent = cookie.name;
  $("#modal-subtitle").textContent = cookie.subtitle;
  $("#modal-description").textContent = cookie.description;

  $("#modal-allergens").innerHTML = cookie.allergens
    .map(item => `<span class="allergen-chip">${item}</span>`)
    .join("");

  modal.hidden = false;

  requestAnimationFrame(() => {
    modal.classList.add("is-open");
  });

  document.body.classList.add("modal-open");
}

function closeCookie() {
  modal.classList.remove("is-open");
  document.body.classList.remove("modal-open");

  setTimeout(() => {
    modal.hidden = true;
  }, 200);
}

$("#gookie-modal-close").addEventListener("click", closeCookie);

modal.addEventListener("click", event => {
  if (event.target === modal) closeCookie();
});

/* MENU */
const menu = $("#menu-overlay");

$("#menu-open").addEventListener("click", () => {
  menu.hidden = false;
  requestAnimationFrame(() => menu.classList.add("is-open"));
  document.body.classList.add("menu-open");
});

$("#menu-close").addEventListener("click", () => {
  menu.classList.remove("is-open");
  document.body.classList.remove("menu-open");
  setTimeout(() => { menu.hidden = true; }, 220);
});

menu.addEventListener("click", event => {
  if (event.target === menu) $("#menu-close").click();
});

/* SEARCH */
const search = $("#product-search-overlay");
const input = $("#product-search-input");
const results = $("#product-search-results");

function renderSearch(query = "") {
  const keyword = query.trim().toLowerCase();

  const matches = keyword
    ? catalogue.filter(cookie =>
        `${cookie.name} ${cookie.subtitle}`.toLowerCase().includes(keyword)
      )
    : catalogue;

  results.innerHTML = matches.length
    ? matches.map(cookie => `
        <button class="search-result" type="button" data-name="${cookie.name}">
          <img src="${cookie.image}" alt="">
          <span>
            <strong>${cookie.name}</strong>
            <small>${cookie.subtitle}</small>
          </span>
        </button>
      `).join("")
    : "<p>No Gookie found.</p>";

  results.querySelectorAll("[data-name]").forEach(button => {
    button.addEventListener("click", () => {
      const cookie = catalogue.find(item => item.name === button.dataset.name);
      closeSearch();
      setTimeout(() => openCookie(cookie), 180);
    });
  });
}

function openSearch() {
  search.hidden = false;
  renderSearch("");
  requestAnimationFrame(() => search.classList.add("is-open"));
  document.body.classList.add("search-open");
  setTimeout(() => input.focus(), 100);
}

function closeSearch() {
  search.classList.remove("is-open");
  document.body.classList.remove("search-open");
  setTimeout(() => { search.hidden = true; }, 200);
}

$("#product-search-open").addEventListener("click", openSearch);
$("#product-search-close").addEventListener("click", closeSearch);
input.addEventListener("input", event => renderSearch(event.target.value));

search.addEventListener("click", event => {
  if (event.target === search) closeSearch();
});

/* CART SHELL */
const cart = $("#cart-overlay");

$("#cart-open").addEventListener("click", () => {
  cart.hidden = false;
  requestAnimationFrame(() => cart.classList.add("is-open"));
  document.body.classList.add("cart-open");
});

$("#cart-close-btn").addEventListener("click", () => {
  cart.classList.remove("is-open");
  document.body.classList.remove("cart-open");
  setTimeout(() => { cart.hidden = true; }, 280);
});

cart.addEventListener("click", event => {
  if (event.target === cart) $("#cart-close-btn").click();
});

document.addEventListener("keydown", event => {
  if (event.key !== "Escape") return;

  if (!modal.hidden) closeCookie();
  if (!search.hidden) closeSearch();
  if (!cart.hidden) $("#cart-close-btn").click();
  if (!menu.hidden) $("#menu-close").click();
});
