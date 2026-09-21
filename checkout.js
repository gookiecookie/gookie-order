
/* GOOKIE CHECKOUT — STEP 4
   Display the existing cart.
   Payment and order submission are NOT connected yet.
*/

(() => {
  "use strict";

  const CART_KEY = "gookieCartV1";

  const itemsContainer =
    document.getElementById("checkout-items");

  const subtotalElement =
    document.getElementById("checkout-subtotal");

  const shippingElement =
    document.getElementById("checkout-shipping");

  const totalElement =
    document.getElementById("checkout-total");

  if (
    !itemsContainer ||
    !subtotalElement ||
    !shippingElement ||
    !totalElement
  ) {
    return;
  }

  function money(value) {
    return "RM" + Number(value).toFixed(2);
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(
      /[&<>"']/g,
      char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[char]
    );
  }

  function getCartItems() {
    try {
      const stored = JSON.parse(
        localStorage.getItem(CART_KEY) || "[]"
      );

      if (!Array.isArray(stored)) return [];

      return stored.filter(item =>
        item &&
        typeof item.id === "string" &&
        typeof item.name === "string" &&
        Number.isFinite(item.price) &&
        item.price >= 0 &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0
      );

    } catch (error) {
      console.warn("Unable to read Gookie cart:", error);
      return [];
    }
  }

  function renderCheckout() {
    const items = getCartItems();

    if (items.length === 0) {
      itemsContainer.innerHTML = `
        <div class="checkout-empty">
          <p>Your box is lonely! 🍪</p>
          <a href="order.html">BACK TO SHOP →</a>
        </div>
      `;

      subtotalElement.textContent = money(0);
      shippingElement.textContent = "—";
      totalElement.textContent = "—";

      return;
    }

    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    itemsContainer.innerHTML = items.map(item => `
      <article class="checkout-cart-item">

        <div class="checkout-cart-info">
          <h3>${escapeHTML(item.name)}</h3>

          <p class="checkout-cart-details">
            ${escapeHTML(item.details || "")}
          </p>

          <span class="checkout-cart-quantity">
            QTY: ${item.quantity}
          </span>
        </div>

        <strong class="checkout-cart-price">
          ${money(item.price * item.quantity)}
        </strong>

      </article>
    `).join("");

    subtotalElement.textContent = money(subtotal);

    shippingElement.textContent =
      "Calculated at checkout";

    // Do not display a final total until the backend
    // has calculated the actual shipping charge.
    totalElement.textContent = "—";
  }


  /* ---------- CALCULATE DELIVERY ---------- */

  const calculateButton =
    document.getElementById("calculate-delivery");

  const deliveryMessage =
    document.getElementById("delivery-message");

  const postcodeInput =
    document.getElementById("customer-postcode");

  const PRODUCT_IDS = {
    "wonder-chip": "PRD001",
    "dark-crush": "PRD002",
    "red-bloom": "PRD003",
    "matcha-matchy": "PRD004",
    "mallow-melt": "PRD005",
    "dream-cream": "PRD006",
    "biscoff-boom": "PRD007",
    "coffee-kiss": "PRD009",
    "choco-loco": "PRD011",
    "berry-blast": "PRD015"
  };

  const MINI_PRODUCT_IDS = {
    "wonder-chip": "PRD012",
    "dark-crush": "PRD013",
    "red-bloom": "PRD014"
  };

  const ADDON_IDS = {
    "party-kit": "ADDON001",
    "wish-card": "ADDON002"
  };

  function makeQuoteBoxes(cartItems) {
    const boxes = [];

    for (const cartItem of cartItems) {
      let boxId;
      let selectionType;
      let productIds;

      if (cartItem.productType === "build-box") {
        boxId = cartItem.boxSize === 4
          ? "BOX001"
          : cartItem.boxSize === 8
            ? "BOX002"
            : null;

        selectionType = "BUILD_YOUR_OWN";
        productIds = PRODUCT_IDS;

      } else if (cartItem.productType === "mini-gookies") {
        boxId = "BOX004";
        selectionType = "GOOKIES_CHOICE";
        productIds = MINI_PRODUCT_IDS;

      } else if (cartItem.productType === "gookie-buffet") {
        boxId = "BOX005";
        selectionType = "GOOKIES_CHOICE";
        productIds = MINI_PRODUCT_IDS;

      } else {
        throw new Error(
          "Unsupported product: " + cartItem.name
        );
      }

      if (!boxId) {
        throw new Error(
          "Unsupported box size: " + cartItem.name
        );
      }

      const flavours = Array.isArray(cartItem.flavours)
        ? cartItem.flavours
        : [];

      const combined = new Map();

     for (const flavour of flavours.filter(f => Number(f.quantity) > 0)) {
        const productId = productIds[flavour.id];

        if (!productId) {
          throw new Error(
            "This flavour is not available for checkout: " +
            flavour.id
          );
        }

        const qty = Number(flavour.quantity);

        if (!Number.isInteger(qty) || qty <= 0) {
          throw new Error("Invalid cookie quantity.");
        }

        combined.set(
          productId,
          (combined.get(productId) || 0) + qty
        );
      }

      const items = [...combined].map(
        ([productId, qty]) => ({ productId, qty })
      );

      const addons = [];

      if (cartItem.addon) {
        const addonId = ADDON_IDS[cartItem.addon.type];

        if (!addonId) {
          throw new Error("Unknown gift add-on.");
        }

        addons.push({
          addonId,
          qty: 1,
          message: String(cartItem.addon.message || "").trim()
        });
      }

      if (cartItem.productType === "gookie-buffet" &&
          cartItem.customStickers) {
        addons.push({
          addonId: "ADDON003",
          qty: 1,
          message: ""
        });
      }

      const quantity = Number(cartItem.quantity);

      for (let i = 0; i < quantity; i++) {
        boxes.push({
          boxId,
          selectionType,
          items: items.map(item => ({ ...item })),
          addons: addons.map(addon => ({ ...addon }))
        });
      }
    }

    return boxes;
  }


  // Reset an old quote when the customer changes postcode.

let quoteVersion = 0;
   
  function resetDeliveryQuote() {
quoteVersion++;
     calculateButton.disabled = false;
calculateButton.textContent = "CALCULATE DELIVERY →";
    shippingElement.textContent = "—";
    totalElement.textContent = "—";

    if (deliveryMessage) {
      deliveryMessage.textContent =
        "Postcode changed. Please calculate delivery again.";
    }
  }

  postcodeInput?.addEventListener(
    "input",
    resetDeliveryQuote
  );
   
  calculateButton?.addEventListener("click", () => {
    const postcode = postcodeInput?.value.trim() || "";

    deliveryMessage.textContent = "";
    shippingElement.textContent = "—";
    totalElement.textContent = "—";

    if (!/^[0-9]{5}$/.test(postcode)) {
      deliveryMessage.textContent =
        "Please enter a valid 5-digit postcode.";
      postcodeInput?.focus();
      return;
    }

    try {
      const boxes = makeQuoteBoxes(getCartItems());

      if (!boxes.length) {
        throw new Error("Your cart is empty.");
      }

      const payload = {
        action: "quoteOrder",
        postcode,
        boxes
      };

     
      const API_URL =
        "https://script.google.com/macros/s/AKfycbw4ih8Y-a3wiKZLPC7SmVTV6NbUfrEOg37VjtGayYdvmdRawGJ1RZWLxOnAplMkRSIs/exec";

      calculateButton.disabled = true;
      calculateButton.textContent = "CALCULATING...";
      deliveryMessage.textContent =
        "Checking delivery for your postcode...";

const thisQuoteVersion = ++quoteVersion;
       
      
      const thisQuoteVersion = ++quoteVersion;
      const requestedPostcode = postcode;
      const requestedCart = JSON.stringify(getCartItems());

      fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload),
        redirect: "follow"
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(
              "Unable to connect to the shipping service."
            );
          }

          return response.json();
        })
        .then(result => {
          // Ignore a response for an old postcode or cart.
          if (
            thisQuoteVersion !== quoteVersion ||
            postcodeInput.value.trim() !== requestedPostcode ||
            JSON.stringify(getCartItems()) !== requestedCart
          ) {
            return;
          }

          if (!result.ok || !result.totals) {
            throw new Error(
              result.message || "Unable to calculate delivery."
            );
          }

          const backendSubtotal = Number(result.totals.subtotal);
          const shipping = Number(result.totals.shippingCharge);
          const grandTotal = Number(result.totals.grandTotal);

          if (
            !Number.isFinite(backendSubtotal) ||
            !Number.isFinite(shipping) ||
            !Number.isFinite(grandTotal)
          ) {
            throw new Error(
              "Invalid quote returned by the backend."
            );
          }

          const currentSubtotal = getCartItems().reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );

          if (
            Math.abs(currentSubtotal - backendSubtotal) > 0.01
          ) {
            throw new Error(
              "Your cart price has changed. Please refresh your order."
            );
          }

          subtotalElement.textContent = money(backendSubtotal);
          shippingElement.textContent = money(shipping);
          totalElement.textContent = money(grandTotal);

          deliveryMessage.textContent =
            "Delivery calculated successfully!";
        })
        .catch(error => {
          // An old request must not erase a newer quote.
          if (thisQuoteVersion !== quoteVersion) return;

          shippingElement.textContent = "—";
          totalElement.textContent = "—";

          deliveryMessage.textContent =
            error.message || "Unable to calculate delivery.";
        })
        .finally(() => {
          // An old request must not change the newer button state.
          if (thisQuoteVersion !== quoteVersion) return;

          calculateButton.disabled = false;
          calculateButton.textContent = "CALCULATE DELIVERY →";
        });

    } catch (error) {
      deliveryMessage.textContent = error.message;
    }
  });
   
  renderCheckout();

  // Keep checkout updated if the cart changes
  // elsewhere in the same browser.
  window.addEventListener(
    "gookie:cart-updated",
    renderCheckout
  );

  window.addEventListener(
    "storage",
    event => {
      if (event.key === CART_KEY) {
        renderCheckout();
      }
    }
  );

})();
