"use strict";

/* =========================================================
   GOOKIE ORDER ENGINE V5.4 — MINI + ADD-ONS CONSOLIDATED
   Converts website cart data into Apps Script payload.
========================================================= */


/* =========================================================
   1. APPS SCRIPT
========================================================= */

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbw0cK0xWTgan6YFzLfGta7Mc5qFQkhwzSBO4iwgWGcbXBiNrgAtHKjursf1B_FQPYa39w/exec";


/* =========================================================
   2. BOX ID MAPPING
========================================================= */

const GOOKIE_BOX_IDS = Object.freeze({
  4: "BOX001",
  8: "BOX002",
  12: "BOX003",
  15: "BOX004",
});


/* =========================================================
   3. ADD-ON ID MAPPING
========================================================= */

const GOOKIE_ADDON_IDS = Object.freeze({
  "party-kit": "ADDON001",
  "wishcard": "ADDON002",
  "wish-card": "ADDON002",
  ADDON001: "ADDON001",
  ADDON002: "ADDON002",
});

const GOOKIE_ADDON_MESSAGE_LIMIT = 70;


/* =========================================================
   3. PRODUCT ID MAPPING
========================================================= */

const GOOKIE_PRODUCT_IDS = Object.freeze({
  "wonder-chip": "PRD001",
  "dark-crush": "PRD002",
  "red-bloom": "PRD003",
  "matcha-matchy": "PRD004",
  "mallow-melt": "PRD005",
  "dream-cream": "PRD006",
  "biscoff-boom": "PRD007",
  "choki-chomp": "PRD008",
  "coffee-kiss": "PRD009",

  /* Mini Box production SKUs — 40g dough each. */
  "mini-wonder-chip": "PRD012",
  "mini-dark-crush": "PRD013",
  "mini-red-bloom": "PRD014",

  /*
    Monthly Wonder operational slot.
  */
  "monthly-wonder": "PRD010",

  /*
    Add PRD011 to 01_PRODUCTS before accepting
    orders containing Choco Loco.
  */
  "choco-loco": "PRD011",
});


/* =========================================================
   4. SELECTION TYPE
========================================================= */

function getOrderSelectionType(order) {
  if (order.type === "Build Your Box") {
    return "BUILD_YOUR_OWN";
  }

  if (
    order.type === "Gookie's Picks" ||
    order.type === "Assorted Box" ||
    order.type === "Single Flavour Box" ||
    order.type === "Gookie Big Box" ||
    order.type === "Mini Box"
  ) {
    return "GOOKIES_CHOICE";
  }

  throw new Error(
    "Unknown order type: " +
      String(order.type || "")
  );
}


/* =========================================================
   5. GROUP COOKIE QUANTITIES
========================================================= */

function buildOrderItems(cookieIds) {
  if (!Array.isArray(cookieIds) || cookieIds.length === 0) {
    throw new Error("No cookies were found in this order.");
  }

  const quantities = {};

  cookieIds.forEach(function (cookieId) {
    const productId = GOOKIE_PRODUCT_IDS[cookieId];

    if (!productId) {
      throw new Error(
        "No Product ID mapping found for: " + cookieId
      );
    }

    quantities[productId] =
      (quantities[productId] || 0) + 1;
  });

  return Object.entries(quantities).map(
    function ([productId, qty]) {
      return {
        productId: productId,
        qty: qty,
      };
    }
  );
}


/* =========================================================
   7. NORMALISE ADD-ONS
========================================================= */

function buildOrderAddons(addons, boxIndex) {
  if (!Array.isArray(addons) || addons.length === 0) {
    return [];
  }

  const seenAddonIds = new Set();

  return addons.map(function (addon) {
    if (!addon || typeof addon !== "object") {
      throw new Error(
        "Invalid add-on in cart box " + (boxIndex + 1) + "."
      );
    }

    const rawId =
      addon.addonId ||
      addon.id ||
      addon.type ||
      "";

    const addonId =
      GOOKIE_ADDON_IDS[String(rawId)];

    if (!addonId) {
      throw new Error(
        "Unknown add-on in cart box " +
          (boxIndex + 1) +
          ": " +
          String(rawId || "(missing Add-on ID)")
      );
    }

    if (seenAddonIds.has(addonId)) {
      throw new Error(
        "The same add-on cannot be added twice to cart box " +
          (boxIndex + 1) +
          "."
      );
    }

    seenAddonIds.add(addonId);

    const message =
      String(addon.message || "").trim();

    if (message.length > GOOKIE_ADDON_MESSAGE_LIMIT) {
      throw new Error(
        "Add-on message for cart box " +
          (boxIndex + 1) +
          " must be " +
          GOOKIE_ADDON_MESSAGE_LIMIT +
          " characters or fewer."
      );
    }

    if (addonId === "ADDON002" && !message) {
      throw new Error(
        "Wish Card for cart box " +
          (boxIndex + 1) +
          " needs a custom message."
      );
    }

    return {
      addonId: addonId,
      qty: 1,
      message: message,
    };
  });
}

/* =========================================================
   8. BUILD CREATE ORDER PAYLOAD
========================================================= */

function buildOrderPayload() {
  if (!Array.isArray(cart) || cart.length === 0) {
    throw new Error("Your Gookie cart is empty.");
  }

  if (!customerDetails) {
    throw new Error("Customer details are missing.");
  }

  const boxes = cart.map(function (order, index) {
    const boxId =
      GOOKIE_BOX_IDS[order.boxSize];

    if (!boxId) {
      throw new Error(
        "No Box ID found for " +
          order.boxSize +
          " cookies in cart box " +
          (index + 1) +
          "."
      );
    }

    const items =
      buildOrderItems(order.cookies);

    const totalQuantity =
      items.reduce(function (total, item) {
        return total + item.qty;
      }, 0);

    if (totalQuantity !== order.boxSize) {
      throw new Error(
        "Cart box " +
          (index + 1) +
          " requires exactly " +
          order.boxSize +
          " cookies, but received " +
          totalQuantity +
          "."
      );
    }

    const addons =
      buildOrderAddons(
        order.addons || [],
        index
      );

    return {
      boxId: boxId,
      selectionType:
        getOrderSelectionType(order),
      items: items,
      addons: addons,
    };
  });

  return {
    customer: {
      name: customerDetails.name,
      phone: customerDetails.phone,
      email: "",
      address: customerDetails.address,
      postcode: customerDetails.postcode,
      notes: customerDetails.notes || "",
    },

    boxes: boxes,
  };
}
