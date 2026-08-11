"use strict";

/* =========================================================
   GOOKIE ORDER ENGINE V5.1
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
  6: "BOX002",
  12: "BOX003",
});


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

  /*
    Berry Nutty is the current Monthly Wonder.
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

  if (order.type === "Gookie's Picks") {
    return "GOOKIES_CHOICE";
  }

  throw new Error(
    "Unknown order type: " + String(order.type || "")
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
   6. BUILD CREATE ORDER PAYLOAD
========================================================= */

function buildOrderPayload() {
  if (!currentOrder) {
    throw new Error("Your Gookie cart is empty.");
  }

  if (!customerDetails) {
    throw new Error("Customer details are missing.");
  }

  const boxId =
    GOOKIE_BOX_IDS[currentOrder.boxSize];

  if (!boxId) {
    throw new Error(
      "No Box ID found for " +
        currentOrder.boxSize +
        " cookies."
    );
  }

  const items =
    buildOrderItems(currentOrder.cookies);

  const totalQuantity =
    items.reduce(function (total, item) {
      return total + item.qty;
    }, 0);

  if (totalQuantity !== currentOrder.boxSize) {
    throw new Error(
      "This box requires exactly " +
        currentOrder.boxSize +
        " cookies, but received " +
        totalQuantity +
        "."
    );
  }

  return {
    customer: {
      name: customerDetails.name,
      phone: customerDetails.phone,
      email: "",
      address: customerDetails.address,
      postcode: customerDetails.postcode,
      notes: customerDetails.notes || "",
    },

    boxes: [
      {
        boxId: boxId,
        selectionType:
          getOrderSelectionType(currentOrder),
        items: items,
      },
    ],
  };
}
