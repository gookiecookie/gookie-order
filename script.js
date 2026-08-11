"use strict";

/* =========================================================
   GOOKIE WEBSITE V3
   FILE: script.js

   Homepage-only JavaScript:
   - Menu drawer
   - Hero carousel
   - Image fallbacks
   - Meet the Gookies carousel
   - Cookie modal
   - Footer information modal

   IMPORTANT:
   The old homepage checkout / Build Your Box engine has been
   intentionally removed from this file. Ordering now lives
   on order.html.
========================================================= */


/* =========================================================
   1. GOOKIE CATALOGUE
   CORE 8 ONLY FOR "MEET THE GOOKIES"
========================================================= */

const gookieCatalogue = [
  {
    id: "wonder-chip",
    name: "Wonder Chip",
    subtitle: "Classic Chocolate Chip",
    description:
      "The cookie that started the wonder — golden, chunky and loaded with chocolate in every bite.",
    image: "wonder-chip.png",
  },

  {
    id: "dark-crush",
    name: "Dark Crush",
    subtitle: "Dark Chocolate & Sea Salt",
    description:
      "Deep cocoa, dark chocolate and a little sea salt for the perfect bold, balanced bite.",
    image: "dark-crush.png",
  },

  {
    id: "red-bloom",
    name: "Red Bloom",
    subtitle: "Red Velvet",
    description:
      "Soft red velvet charm with creamy white chocolate woven through every chunky bite.",
    image: "red-bloom.png",
  },

  {
    id: "coffee-kiss",
    name: "Coffee Kiss",
    subtitle: "Tiramisu Filled",
    description:
      "A gentle coffee kiss with creamy tiramisu-inspired flavour inside a soft, chunky cookie.",
    image: "coffee-kiss.png",
  },

  {
    id: "matcha-matchy",
    name: "Matcha Matchy",
    subtitle: "Matcha & Macadamia",
    description:
      "Earthy matcha, creamy white chocolate and roasted macadamia in one very happy match.",
    image: "matcha-matchy.png",
  },

  {
    id: "dream-cream",
    name: "Dream Cream",
    subtitle: "Cookies & Cream",
    description:
      "Chocolate cookie crumbs, creamy notes and the kind of comfort that disappears far too quickly.",
    image: "dream-cream.png",
  },

  {
    id: "mallow-melt",
    name: "Mallow Melt",
    subtitle: "S'mores",
    description:
      "Toasty marshmallow comfort with chocolate and cookie goodness tucked into every bite.",
    image: "mallow-melt.png",
  },

  {
    id: "biscoff-boom",
    name: "Biscoff Boom",
    subtitle: "Biscoff Filled",
    description:
      "Caramelised cookie flavour with a soft Biscoff centre that goes boom the moment you bite in.",
    image: "biscoff-boom.png",
  },
];


/* =========================================================
   2. DOM HELPERS
========================================================= */

const $ = (id) => document.getElementById(id);

const body = document.body;

const pageOverlay = $("pageOverlay");

const menuButton = $("menuButton");
const menuDrawer = $("menuDrawer");
const menuCloseButton = $("menuCloseButton");

const heroStage = $("heroStage");
const heroPrev = $("heroPrev");
const heroNext = $("heroNext");

const marqueeShell = $("marqueeShell");
const marqueeTrack = $("marqueeTrack");
const marqueePrev = $("marqueePrev");
const marqueeNext = $("marqueeNext");
const marqueePagination = $("marqueePagination");

const cookieModal = $("cookieModal");
const cookieModalClose = $("cookieModalClose");
const modalCookieImage = $("modalCookieImage");
const modalCookieSubtitle = $("modalCookieSubtitle");
const modalCookieName = $("modalCookieName");
const modalCookieDescription = $("modalCookieDescription");

const footerInfoModal = $("footerInfoModal");
const footerInfoModalClose = $("footerInfoModalClose");
const footerInfoModalEyebrow = $("footerInfoModalEyebrow");
const footerInfoModalTitle = $("footerInfoModalTitle");
const footerInfoModalBody = $("footerInfoModalBody");


/* =========================================================
   3. GENERIC OVERLAY / DRAWER / MODAL
========================================================= */

function anyPanelOpen() {
  return Boolean(
    document.querySelector(".drawer.is-open, .modal.is-open")
  );
}


function openOverlay() {
  if (!pageOverlay) return;

  pageOverlay.hidden = false;
  body.classList.add("no-scroll");

  requestAnimationFrame(() => {
    pageOverlay.classList.add("is-visible");
  });
}


function closeOverlayIfIdle() {
  if (!pageOverlay || anyPanelOpen()) return;

  pageOverlay.classList.remove("is-visible");
  body.classList.remove("no-scroll");

  window.setTimeout(() => {
    if (!anyPanelOpen()) {
      pageOverlay.hidden = true;
    }
  }, 260);
}


function openDrawer(drawer, triggerButton = null) {
  if (!drawer) return;

  closeAllDrawers(false);

  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");

  triggerButton?.setAttribute("aria-expanded", "true");

  openOverlay();
}


function closeDrawer(drawer, closeOverlay = true) {
  if (!drawer) return;

  drawer.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");

  menuButton?.setAttribute("aria-expanded", "false");

  if (closeOverlay) {
    closeOverlayIfIdle();
  }
}


function closeAllDrawers(closeOverlay = true) {
  document
    .querySelectorAll(".drawer.is-open")
    .forEach((drawer) => {
      drawer.classList.remove("is-open");
      drawer.setAttribute("aria-hidden", "true");
    });

  menuButton?.setAttribute("aria-expanded", "false");

  if (closeOverlay) {
    closeOverlayIfIdle();
  }
}


function openModal(modal) {
  if (!modal) return;

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");

  openOverlay();
}


function closeModal(modal, closeOverlay = true) {
  if (!modal) return;

  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");

  if (closeOverlay) {
    closeOverlayIfIdle();
  }
}


function closeAllModals(closeOverlay = true) {
  document
    .querySelectorAll(".modal.is-open")
    .forEach((modal) => {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
    });

  if (closeOverlay) {
    closeOverlayIfIdle();
  }
}


/* =========================================================
   4. IMAGE FALLBACKS
   HTML can use:
   <img src="new-image.png" data-fallback="old-image.png">
========================================================= */

function setupImageFallbacks(root = document) {
  root
    .querySelectorAll("img[data-fallback]")
    .forEach((image) => {
      image.addEventListener(
        "error",
        () => {
          const fallback = image.dataset.fallback;

          if (!fallback) return;
          if (image.src.endsWith(fallback)) return;

          image.src = fallback;
        },
        { once: true }
      );
    });
}


/* =========================================================
   5. HERO CAROUSEL
========================================================= */

let heroSlides = [];
let heroDots = [];

let heroIndex = 0;
let heroTimer = null;

const HERO_AUTOPLAY_MS = 5500;


function collectHeroElements() {
  heroSlides = Array.from(
    document.querySelectorAll(".hero-slide")
  );

  heroDots = Array.from(
    document.querySelectorAll("[data-hero-dot]")
  );
}


function showHeroSlide(index, restartTimer = true) {
  if (!heroSlides.length) return;

  heroIndex =
    (index + heroSlides.length) %
    heroSlides.length;

  heroSlides.forEach((slide, slideIndex) => {
    const active = slideIndex === heroIndex;

    slide.classList.toggle("is-active", active);
    slide.setAttribute(
      "aria-hidden",
      active ? "false" : "true"
    );
  });

  heroDots.forEach((dot, dotIndex) => {
    const active = dotIndex === heroIndex;

    dot.classList.toggle("is-active", active);
    dot.setAttribute(
      "aria-current",
      active ? "true" : "false"
    );
  });

  if (restartTimer) {
    restartHeroAutoplay();
  }
}


function nextHeroSlide() {
  showHeroSlide(heroIndex + 1);
}


function previousHeroSlide() {
  showHeroSlide(heroIndex - 1);
}


function startHeroAutoplay() {
  stopHeroAutoplay();

  if (heroSlides.length < 2) return;

  heroTimer = window.setInterval(() => {
    showHeroSlide(heroIndex + 1, false);
  }, HERO_AUTOPLAY_MS);
}


function stopHeroAutoplay() {
  if (!heroTimer) return;

  window.clearInterval(heroTimer);
  heroTimer = null;
}


function restartHeroAutoplay() {
  stopHeroAutoplay();
  startHeroAutoplay();
}


function setupHeroCarousel() {
  collectHeroElements();

  if (!heroSlides.length) return;

  showHeroSlide(0, false);
  startHeroAutoplay();

  heroPrev?.addEventListener(
    "click",
    previousHeroSlide
  );

  heroNext?.addEventListener(
    "click",
    nextHeroSlide
  );

  heroDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const index = Number(dot.dataset.heroDot);

      if (Number.isNaN(index)) return;

      showHeroSlide(index);
    });
  });


  /*
   * Pause when user hovers over hero on desktop.
   */
  heroStage?.addEventListener(
    "mouseenter",
    stopHeroAutoplay
  );

  heroStage?.addEventListener(
    "mouseleave",
    startHeroAutoplay
  );


  /*
   * Touch swipe.
   */
  let touchStartX = null;
  let touchStartY = null;

  heroStage?.addEventListener(
    "touchstart",
    (event) => {
      const touch = event.touches[0];

      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    },
    { passive: true }
  );

  heroStage?.addEventListener(
    "touchend",
    (event) => {
      if (
        touchStartX === null ||
        touchStartY === null
      ) {
        return;
      }

      const touch = event.changedTouches[0];

      const deltaX =
        touch.clientX - touchStartX;

      const deltaY =
        touch.clientY - touchStartY;

      touchStartX = null;
      touchStartY = null;

      if (Math.abs(deltaX) < 45) return;
      if (Math.abs(deltaX) < Math.abs(deltaY)) return;

      if (deltaX < 0) {
        nextHeroSlide();
      } else {
        previousHeroSlide();
      }
    },
    { passive: true }
  );
}


/* =========================================================
   6. MEET THE GOOKIES — RENDER
========================================================= */

let marqueeCards = [];
let marqueeDots = [];

let marqueeCurrentIndex = 0;

let marqueePointerIsDown = false;
let marqueeDragging = false;
let marqueePointerId = null;

let marqueePointerStartX = 0;
let marqueePointerCurrentX = 0;
let marqueeScrollStart = 0;
let marqueeDragDistance = 0;

let marqueeScrollTimer = null;


function createMarqueeCard(cookie, index) {
  const card = document.createElement("button");

  card.type = "button";
  card.className = "marquee-card";

  card.dataset.cookieId = cookie.id;
  card.dataset.marqueeIndex = String(index);

  card.setAttribute(
    "aria-label",
    `View ${cookie.name}`
  );

  card.innerHTML = `
    <div class="marquee-card-image">
      <img
        src="${cookie.image}"
        alt="${cookie.name}"
        draggable="false"
      />
    </div>

    <div class="marquee-card-copy">
      <strong>${cookie.name}</strong>
      <span>${cookie.subtitle}</span>
    </div>
  `;

  card.addEventListener("click", () => {
    /*
     * Ignore click generated at the end of a drag.
     */
    if (marqueeDragDistance > 8) return;

    openCookieDetails(cookie);
  });

  return card;
}


function renderMeetTheGookies() {
  if (!marqueeTrack) return;

  marqueeTrack.innerHTML = "";

  gookieCatalogue.forEach(
    (cookie, index) => {
      marqueeTrack.appendChild(
        createMarqueeCard(cookie, index)
      );
    }
  );

  marqueeCards = Array.from(
    marqueeTrack.querySelectorAll(".marquee-card")
  );

  renderMarqueePagination();

  requestAnimationFrame(() => {
    goToMarqueeSlide(0, false);
  });
}


function renderMarqueePagination() {
  if (!marqueePagination) return;

  marqueePagination.innerHTML = "";

  gookieCatalogue.forEach((cookie, index) => {
    const dot = document.createElement("button");

    dot.type = "button";
    dot.className = "marquee-dot";

    dot.dataset.marqueeDot = String(index);

    dot.setAttribute(
      "aria-label",
      `Show ${cookie.name}`
    );

    dot.addEventListener("click", () => {
      goToMarqueeSlide(index, true);
    });

    marqueePagination.appendChild(dot);
  });

  marqueeDots = Array.from(
    marqueePagination.querySelectorAll(".marquee-dot")
  );
}


/* =========================================================
   7. MEET THE GOOKIES — ACTIVE STATE
========================================================= */

function updateMarqueeActiveState(index) {
  if (!marqueeCards.length) return;

  marqueeCurrentIndex =
    (index + marqueeCards.length) %
    marqueeCards.length;

  marqueeCards.forEach(
    (card, cardIndex) => {
      const active =
        cardIndex === marqueeCurrentIndex;

      card.classList.toggle(
        "is-active",
        active
      );

      card.setAttribute(
        "aria-current",
        active ? "true" : "false"
      );
    }
  );

  marqueeDots.forEach(
    (dot, dotIndex) => {
      const active =
        dotIndex === marqueeCurrentIndex;

      dot.classList.toggle(
        "is-active",
        active
      );

      dot.setAttribute(
        "aria-current",
        active ? "true" : "false"
      );
    }
  );
}


function getMarqueeCardScrollLeft(card) {
  if (!marqueeShell || !card) return 0;

  return (
    card.offsetLeft -
    (marqueeShell.clientWidth - card.offsetWidth) / 2
  );
}


function goToMarqueeSlide(
  index,
  smooth = true
) {
  if (
    !marqueeShell ||
    !marqueeCards.length
  ) {
    return;
  }

  const normalizedIndex =
    (index + marqueeCards.length) %
    marqueeCards.length;

  const card =
    marqueeCards[normalizedIndex];

  updateMarqueeActiveState(
    normalizedIndex
  );

  marqueeShell.scrollTo({
    left: getMarqueeCardScrollLeft(card),
    behavior: smooth ? "smooth" : "auto",
  });
}


function findClosestMarqueeIndex() {
  if (
    !marqueeShell ||
    !marqueeCards.length
  ) {
    return 0;
  }

  const shellCenter =
    marqueeShell.scrollLeft +
    marqueeShell.clientWidth / 2;

  let closestIndex = 0;
  let closestDistance = Infinity;

  marqueeCards.forEach(
    (card, index) => {
      const cardCenter =
        card.offsetLeft +
        card.offsetWidth / 2;

      const distance =
        Math.abs(
          shellCenter - cardCenter
        );

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    }
  );

  return closestIndex;
}


function updateMarqueeIndexFromScroll() {
  updateMarqueeActiveState(
    findClosestMarqueeIndex()
  );
}


/* =========================================================
   8. MEET THE GOOKIES — ARROWS / SCROLL
========================================================= */

function previousMarqueeSlide() {
  goToMarqueeSlide(
    marqueeCurrentIndex - 1,
    true
  );
}


function nextMarqueeSlide() {
  goToMarqueeSlide(
    marqueeCurrentIndex + 1,
    true
  );
}


function setupMarqueeScrollTracking() {
  if (!marqueeShell) return;

  marqueeShell.addEventListener(
    "scroll",
    () => {
      if (marqueeDragging) return;

      window.clearTimeout(
        marqueeScrollTimer
      );

      marqueeScrollTimer =
        window.setTimeout(() => {
          updateMarqueeIndexFromScroll();
        }, 80);
    },
    { passive: true }
  );
}


/* =========================================================
   9. MEET THE GOOKIES — DESKTOP DRAG
========================================================= */

function beginMarqueeDrag(event) {
  if (!marqueeShell) return;

  if (
    event.pointerType !== "mouse" ||
    event.button !== 0
  ) {
    return;
  }

  marqueePointerIsDown = true;
  marqueeDragging = false;

  marqueePointerId = event.pointerId;

  marqueePointerStartX =
    event.clientX;

  marqueePointerCurrentX =
    event.clientX;

  marqueeScrollStart =
    marqueeShell.scrollLeft;

  marqueeDragDistance = 0;
}


function moveMarqueeDrag(event) {
  if (
    !marqueeShell ||
    !marqueePointerIsDown
  ) {
    return;
  }

  marqueePointerCurrentX =
    event.clientX;

  const distance =
    event.clientX -
    marqueePointerStartX;

  marqueeDragDistance = Math.max(
    marqueeDragDistance,
    Math.abs(distance)
  );

  /*
   * Small threshold means a normal click
   * still opens the cookie modal.
   */
  if (
    !marqueeDragging &&
    marqueeDragDistance > 8
  ) {
    marqueeDragging = true;

    marqueeShell.classList.add(
      "is-dragging"
    );

    if (
      marqueePointerId !== null &&
      !marqueeShell.hasPointerCapture(
        marqueePointerId
      )
    ) {
      marqueeShell.setPointerCapture(
        marqueePointerId
      );
    }
  }

  if (!marqueeDragging) return;

  event.preventDefault();

  marqueeShell.scrollLeft =
    marqueeScrollStart - distance;
}


function endMarqueeDrag() {
  if (
    !marqueeShell ||
    !marqueePointerIsDown
  ) {
    return;
  }

  const wasDragging =
    marqueeDragging;

  marqueePointerIsDown = false;
  marqueeDragging = false;

  marqueeShell.classList.remove(
    "is-dragging"
  );

  if (
    marqueePointerId !== null &&
    marqueeShell.hasPointerCapture(
      marqueePointerId
    )
  ) {
    marqueeShell.releasePointerCapture(
      marqueePointerId
    );
  }

  marqueePointerId = null;

  if (wasDragging) {
    const closest =
      findClosestMarqueeIndex();

    goToMarqueeSlide(
      closest,
      true
    );

    /*
     * Keep dragDistance non-zero until after
     * the browser's synthetic click has passed.
     */
    window.setTimeout(() => {
      marqueeDragDistance = 0;
    }, 40);
  } else {
    marqueeDragDistance = 0;
  }
}


function setupMarqueeDrag() {
  if (!marqueeShell) return;

  marqueeShell.addEventListener(
    "pointerdown",
    beginMarqueeDrag
  );

  marqueeShell.addEventListener(
    "pointermove",
    moveMarqueeDrag
  );

  marqueeShell.addEventListener(
    "pointerup",
    endMarqueeDrag
  );

  marqueeShell.addEventListener(
    "pointercancel",
    endMarqueeDrag
  );

  marqueeShell.addEventListener(
    "mouseleave",
    () => {
      if (marqueePointerIsDown) {
        endMarqueeDrag();
      }
    }
  );
}


/* =========================================================
   10. COOKIE DETAILS MODAL
========================================================= */

function openCookieDetails(cookie) {
  if (
    !cookieModal ||
    !modalCookieImage ||
    !modalCookieSubtitle ||
    !modalCookieName ||
    !modalCookieDescription
  ) {
    return;
  }

  modalCookieImage.src =
    cookie.image;

  modalCookieImage.alt =
    cookie.name;

  modalCookieSubtitle.textContent =
    cookie.subtitle;

  modalCookieName.textContent =
    cookie.name;

  modalCookieDescription.textContent =
    cookie.description;

  openModal(cookieModal);

  window.setTimeout(() => {
    cookieModalClose?.focus();
  }, 260);
}


function closeCookieDetails() {
  closeModal(cookieModal);
}


/* =========================================================
   11. FOOTER INFORMATION CONTENT
========================================================= */

const FOOTER_MODAL_CONTENT = {

  faq: {
    eyebrow: "NEED HELP?",
    title: "Frequently Asked Questions",
    body: `
      <div class="footer-info-card">
        <h3>Do I need to order a whole box?</h3>
        <p>
          Yes. Every order starts from <strong>1 box</strong>.
          Individual cookies are not available.
        </p>
      </div>

      <div class="footer-info-card">
        <h3>Can I build my own box?</h3>
        <p>
          Yes. Choose <strong>Build Your Own</strong> and pick
          your favourite flavours from the available menu.
        </p>
      </div>

      <div class="footer-info-card">
        <h3>When is my order confirmed?</h3>
        <p>
          Your order is confirmed after the order has been placed
          and your payment has been verified by Gookie.
        </p>
      </div>

      <div class="footer-info-card">
        <h3>What payment method do you accept?</h3>
        <p>
          We currently accept payment through
          <strong>DuitNow QR</strong>.
        </p>
      </div>

      <div class="footer-info-card">
        <h3>Where do you deliver?</h3>
        <p>
          We currently deliver throughout
          <strong>Peninsular Malaysia</strong>.
          Sabah and Sarawak delivery is coming soon.
        </p>
      </div>

      <div class="footer-info-card">
        <h3>Do you have a physical store?</h3>
        <p>
          Not yet. Gookie is currently available online only.
        </p>
      </div>
    `,
  },


  delivery: {
    eyebrow: "DELIVERY INFORMATION",
    title: "Freshly Baked. Carefully Shipped.",
    body: `
      <div class="footer-info-card">
        <h3>Where do we deliver?</h3>
        <p>
          We currently deliver throughout
          <strong>Peninsular Malaysia</strong>.
        </p>
        <p>
          Sabah and Sarawak delivery is coming soon.
        </p>
      </div>

      <div class="footer-info-card">
        <h3>When will my order be shipped?</h3>
        <p>
          Orders will be shipped within
          <strong>1–3 working days</strong>
          after payment verification.
        </p>
      </div>

      <div class="footer-info-card">
        <h3>How can I track my order?</h3>
        <p>
          Once your parcel has been shipped, we’ll send your
          tracking number and tracking link through WhatsApp.
        </p>
      </div>

      <div class="footer-info-alert">
        <h3>Please check your details</h3>
        <p>
          Make sure your name, phone number, postcode and
          delivery address are correct before placing your order.
        </p>
      </div>
    `,
  },


  storage: {
    eyebrow: "KEEP THEM HAPPY",
    title: "Storage & Reheating",
    body: `
      <div class="footer-info-card">
        <h3>Room Temperature</h3>
        <p>
          Gookies are best enjoyed within
          <strong>3 days</strong> of receiving them.
        </p>
        <p>
          Keep them in an airtight container away from
          direct sunlight and heat.
        </p>
      </div>

      <div class="footer-info-card">
        <h3>Freeze for Later</h3>
        <p>
          Store your Gookies in an airtight container or
          freezer-safe bag for up to <strong>2 months</strong>.
        </p>
      </div>

      <div class="footer-info-card">
        <h3>Reheat</h3>
        <p>
          <strong>Microwave:</strong> 8–12 seconds
        </p>
        <p>
          <strong>Air Fryer:</strong> 150°C for 2–3 minutes
        </p>
        <p>
          Heating time may vary depending on your appliance.
        </p>
      </div>

      <div class="footer-info-alert">
        <h3>A Little Reminder</h3>
        <p>
          Avoid reheating for too long, as this may affect
          the texture of your Gookies.
        </p>
      </div>
    `,
  },


  contact: {
    eyebrow: "LET’S CONNECT!",
    title: "Contact Us",
    body: `
      <div class="footer-info-card">
        <h3>WhatsApp</h3>
        <p>
          For the fastest response, message Gookie through WhatsApp.
        </p>
        <p>
          <a
            href="https://wa.me/60102810487"
            target="_blank"
            rel="noopener noreferrer"
          >
            Message Gookie on WhatsApp
          </a>
        </p>
      </div>

      <div class="footer-info-card">
        <h3>Email</h3>
        <p>
          <a href="mailto:heygookie@gmail.com">
            heygookie@gmail.com
          </a>
        </p>
      </div>

      <div class="footer-info-card">
        <h3>Reply Hours</h3>
        <p>
          WhatsApp messages and enquiries are replied to daily
          between <strong>9:00 AM and 5:00 PM</strong>.
        </p>
        <p>
          Orders can still be placed online <strong>24/7</strong>.
        </p>
      </div>

      <div class="footer-info-card">
        <h3>Location</h3>
        <p>Ampang, Selangor, Malaysia</p>
      </div>
    `,
  },


  allergen: {
    eyebrow: "IMPORTANT INFORMATION",
    title: "Allergen Information",
    body: `
      <div class="footer-info-alert">
        <h3>Please Read Before Ordering</h3>

        <p>Our cookies contain or may contain:</p>

        <ul>
          <li>Wheat (Gluten)</li>
          <li>Milk</li>
          <li>Eggs</li>
          <li>Soy</li>
          <li>Peanuts</li>
          <li>Tree Nuts, including Macadamia and Pistachio</li>
        </ul>
      </div>

      <div class="footer-info-card">
        <h3>Shared Kitchen Notice</h3>
        <p>
          All Gookies are prepared in the same kitchen and may
          come into contact with other allergens during
          preparation, baking or packing.
        </p>
      </div>

      <div class="footer-info-card">
        <h3>Severe Allergies</h3>
        <p>
          If you have a severe food allergy, we recommend
          that you do not consume our products.
        </p>
      </div>
    `,
  },


  terms: {
    eyebrow: "THE BORING STUFF",
    title: "Terms & Conditions",
    body: `
      <div class="footer-info-card">
        <h3>Orders</h3>
        <p>
          The minimum order is <strong>1 box</strong>.
          Individual cookies are not available.
        </p>
      </div>

      <div class="footer-info-card">
        <h3>Payment</h3>
        <p>
          We currently accept payment through
          <strong>DuitNow QR</strong>.
          Full payment is required before your order enters
          our preparation queue.
        </p>
      </div>

      <div class="footer-info-card">
        <h3>Order Changes</h3>
        <p>
          Flavour selections and delivery details cannot be
          changed once the order has been placed.
        </p>
      </div>

      <div class="footer-info-card">
        <h3>Cancellations</h3>
        <p>
          Orders cannot be cancelled after payment has been
          verified and preparation has begun.
        </p>
      </div>

      <div class="footer-info-card">
        <h3>Handmade Products</h3>
        <p>
          Every Gookie is handmade. Slight differences in
          appearance, colour, shape or size are normal.
        </p>
      </div>

      <div class="footer-info-card">
        <h3>Shipping</h3>
        <p>
          Orders will be shipped within
          <strong>1–3 working days</strong>
          after payment verification.
        </p>
      </div>

      <div class="footer-info-alert">
        <h3>Agreement</h3>
        <p>
          By placing an order with Gookie, you confirm that
          you have read and agreed to these Terms & Conditions.
        </p>
      </div>
    `,
  },


  privacy: {
    eyebrow: "THE BORING STUFF",
    title: "Privacy Policy",
    body: `
      <div class="footer-info-card">
        <h3>Information We Collect</h3>
        <p>
          We collect only the information needed to process,
          prepare and deliver your order.
        </p>
        <p>
          This may include your name, phone number,
          delivery address, postcode and order details.
        </p>
      </div>

      <div class="footer-info-card">
        <h3>How We Use Your Information</h3>
        <p>
          Your information may be used to process orders,
          verify payment, arrange delivery, send tracking
          updates and respond to enquiries.
        </p>
      </div>

      <div class="footer-info-card">
        <h3>Sharing Your Information</h3>
        <p>
          We do not sell or rent your personal information.
          Information may be shared with trusted service
          providers when required to complete your order.
        </p>
      </div>

      <div class="footer-info-card">
        <h3>Payment Information</h3>
        <p>
          Gookie does not store your banking login details,
          card details or DuitNow account information.
        </p>
      </div>

      <div class="footer-info-alert">
        <h3>Privacy Questions</h3>
        <p>
          Contact
          <a href="mailto:heygookie@gmail.com">
            heygookie@gmail.com
          </a>
          if you have questions about your personal information.
        </p>
      </div>
    `,
  },


  refund: {
    eyebrow: "THE BORING STUFF",
    title: "Refund & Replacement Policy",
    body: `
      <div class="footer-info-card">
        <h3>Change of Mind</h3>
        <p>
          Because our cookies are freshly baked food products,
          we do not offer refunds, exchanges or cancellations
          for change of mind.
        </p>
      </div>

      <div class="footer-info-card">
        <h3>When We Can Help</h3>
        <p>Please contact us if:</p>
        <ul>
          <li>You received the wrong order</li>
          <li>Important items are missing</li>
          <li>Your cookies arrived significantly damaged</li>
        </ul>
      </div>

      <div class="footer-info-card">
        <h3>Report Within 24 Hours</h3>
        <p>
          Please contact us within <strong>24 hours</strong>
          of receiving your order.
        </p>
      </div>

      <div class="footer-info-alert">
        <h3>What We Need From You</h3>
        <ul>
          <li>Your Order ID</li>
          <li>A clear photo of the parcel</li>
          <li>Clear photos of the products</li>
          <li>A short explanation of the issue</li>
        </ul>
      </div>

      <div class="footer-info-card">
        <h3>Contact Us</h3>
        <p>
          <a
            href="https://wa.me/60102810487"
            target="_blank"
            rel="noopener noreferrer"
          >
            Message Gookie on WhatsApp
          </a>
        </p>
      </div>
    `,
  },

};


/* =========================================================
   12. FOOTER INFORMATION MODAL
========================================================= */

function openFooterInfoModal(contentKey) {
  const content =
    FOOTER_MODAL_CONTENT[contentKey];

  if (
    !content ||
    !footerInfoModal ||
    !footerInfoModalEyebrow ||
    !footerInfoModalTitle ||
    !footerInfoModalBody
  ) {
    return;
  }

  footerInfoModalEyebrow.textContent =
    content.eyebrow;

  footerInfoModalTitle.textContent =
    content.title;

  footerInfoModalBody.innerHTML =
    content.body;

  /*
   * Start modal content at top every time.
   */
  footerInfoModalBody.scrollTop = 0;

  openModal(footerInfoModal);

  window.setTimeout(() => {
    footerInfoModalClose?.focus();
  }, 260);
}


function setupFooterInformation() {
  document
    .querySelectorAll(
      "[data-footer-info], [data-footer-modal]"
    )
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          const key =
            button.dataset.footerInfo ||
            button.dataset.footerModal;

          openFooterInfoModal(key);
        }
      );
    });

  footerInfoModalClose?.addEventListener(
    "click",
    () => {
      closeModal(footerInfoModal);
    }
  );

  footerInfoModal?.addEventListener(
    "click",
    (event) => {
      if (
        event.target ===
        footerInfoModal
      ) {
        closeModal(footerInfoModal);
      }
    }
  );
}


/* =========================================================
   13. GLOBAL EVENTS
========================================================= */

function setupGlobalEvents() {

  menuButton?.addEventListener(
    "click",
    () => {
      openDrawer(
        menuDrawer,
        menuButton
      );
    }
  );


  menuCloseButton?.addEventListener(
    "click",
    () => {
      closeDrawer(menuDrawer);
    }
  );


  pageOverlay?.addEventListener(
    "click",
    () => {
      closeAllDrawers(false);
      closeAllModals(false);

      pageOverlay.classList.remove(
        "is-visible"
      );

      body.classList.remove(
        "no-scroll"
      );

      window.setTimeout(() => {
        pageOverlay.hidden = true;
      }, 260);
    }
  );


  cookieModalClose?.addEventListener(
    "click",
    closeCookieDetails
  );


  cookieModal?.addEventListener(
    "click",
    (event) => {
      if (
        event.target === cookieModal
      ) {
        closeCookieDetails();
      }
    }
  );


  marqueePrev?.addEventListener(
    "click",
    previousMarqueeSlide
  );


  marqueeNext?.addEventListener(
    "click",
    nextMarqueeSlide
  );


  document.addEventListener(
    "keydown",
    (event) => {

      if (event.key !== "Escape") {
        return;
      }

      if (
        cookieModal?.classList.contains(
          "is-open"
        )
      ) {
        closeCookieDetails();
        return;
      }

      if (
        footerInfoModal?.classList.contains(
          "is-open"
        )
      ) {
        closeModal(
          footerInfoModal
        );
        return;
      }

      if (
        menuDrawer?.classList.contains(
          "is-open"
        )
      ) {
        closeDrawer(
          menuDrawer
        );
      }
    }
  );


  /*
   * Re-center active cookie after viewport changes.
   */
  let resizeTimer = null;

  window.addEventListener(
    "resize",
    () => {
      window.clearTimeout(
        resizeTimer
      );

      resizeTimer =
        window.setTimeout(() => {
          if (marqueeCards.length) {
            goToMarqueeSlide(
              marqueeCurrentIndex,
              false
            );
          }
        }, 180);
    }
  );


  /*
   * Stop hero autoplay while browser tab is hidden.
   */
  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden) {
        stopHeroAutoplay();
      } else {
        startHeroAutoplay();
      }
    }
  );
}


/* =========================================================
   14. INITIALISE
========================================================= */

function initGookieV3() {

  setupImageFallbacks();

  setupHeroCarousel();

  renderMeetTheGookies();

  setupMarqueeScrollTracking();

  setupMarqueeDrag();

  setupFooterInformation();

  setupGlobalEvents();
}


if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initGookieV3
  );
} else {
  initGookieV3();
}
