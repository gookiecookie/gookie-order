
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
let confirmedQuote = null;
   
  function resetDeliveryQuote() {
    confirmedQuote = null;
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

    confirmedQuote = null;
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

          confirmedQuote = {postcode: requestedPostcode, cart: requestedCart, subtotal: backendSubtotal, shipping, grandTotal};
          subtotalElement.textContent = money(backendSubtotal);
          shippingElement.textContent = money(shipping);
          totalElement.textContent = money(grandTotal);

          deliveryMessage.textContent =
            "Delivery calculated successfully!";
        })
        .catch(error => {
          // An old request must not erase a newer quote.
          if (thisQuoteVersion !== quoteVersion) return;

          confirmedQuote = null;
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
   

  /* STEP 5P — LOCAL PREVIEW ONLY. NO createOrder REQUEST. */
  const previewButton = document.getElementById("preview-order-button");
  const previewOutput = document.getElementById("order-preview-output");
  const checkoutForm = document.getElementById("checkout-form");

  function invalidatePreview() {
    if (previewOutput) {
      previewOutput.hidden = true;
      previewOutput.textContent = "";
    }
  }
  checkoutForm?.addEventListener("input", invalidatePreview);
  postcodeInput?.addEventListener("input", invalidatePreview);
  window.addEventListener("gookie:cart-updated", invalidatePreview);
  window.addEventListener("storage", event => {
    if (event.key === CART_KEY) invalidatePreview();
  });

  previewButton?.addEventListener("click", () => {
    invalidatePreview();
    if (!checkoutForm || !previewOutput) return;
    if (!checkoutForm.reportValidity()) return;
    try {
      const cart = getCartItems();
      const postcode = postcodeInput.value.trim();
      if (!confirmedQuote ||
          confirmedQuote.postcode !== postcode ||
          confirmedQuote.cart !== JSON.stringify(cart)) {
        throw new Error("Calculate delivery again before previewing your order.");
      }
      const customer = {
        name: document.getElementById("customer-name").value.trim(),
        phone: document.getElementById("customer-phone").value.trim(),
        email: document.getElementById("customer-email").value.trim(),
        address: document.getElementById("customer-address").value.trim(),
        postcode,
        notes: document.getElementById("customer-notes").value.trim()
      };
      if (!customer.name || !customer.phone || !customer.address || !/^[0-9]{5}$/.test(postcode)) {
        throw new Error("Please complete your delivery details.");
      }
      const boxes = makeQuoteBoxes(cart);
      if (!boxes.length) throw new Error("Your cart is empty.");
      // Stable ID for this exact checkout draft. Never use a new ID on retry.
      const draftFingerprint = JSON.stringify({customer, boxes});
      const draftKey = "gookieCheckoutDraftV1";
      let draft;
      try { draft = JSON.parse(sessionStorage.getItem(draftKey) || "null"); } catch (_) { draft = null; }
      if (!draft || draft.fingerprint !== draftFingerprint || !draft.clientRequestId) {
        if (!globalThis.crypto || !crypto.randomUUID) {
          throw new Error("Secure request ID unavailable. Please use an updated browser.");
        }
        draft = {fingerprint: draftFingerprint, clientRequestId: crypto.randomUUID()};
        sessionStorage.setItem(draftKey, JSON.stringify(draft));
      }
      const preview = {
        action: "createOrder",
        clientRequestId: draft.clientRequestId,
        customer,
        boxes,
        previewTotals: {
          subtotal: confirmedQuote.subtotal,
          shippingCharge: confirmedQuote.shipping,
          grandTotal: confirmedQuote.grandTotal
        }
      };
      // Display a safe preview: never expose private customer details or the full request ID.
      const safePreview = {
        action: preview.action,
        clientRequestId: "GENERATED (hidden)",
        customer: {name: "[hidden]", phone: "[hidden]", email: "[hidden]", address: "[hidden]", postcode: customer.postcode, notes: customer.notes ? "[hidden]" : ""},
        boxes: preview.boxes,
        previewTotals: preview.previewTotals
      };
      previewOutput.textContent = JSON.stringify(safePreview, null, 2);
      previewOutput.hidden = false;
    } catch (error) {
      previewOutput.textContent = error.message || "Unable to preview order.";
      previewOutput.hidden = false;
    }
  });

  /* STEP 5P.5 — controlled test only. Real Google Sheets rows are created. */
  const testMode = new URLSearchParams(location.search).get("gookieTest") === "1";
  const testButton = document.getElementById("test-create-order-button");
  const testResult = document.getElementById("test-create-order-result");
  let sendingTest = false;
  let completedTest = false;
  if (testMode && testButton) testButton.hidden = false;

  testButton?.addEventListener("click", async () => {
    if (!testMode || sendingTest || completedTest || !testResult) return;
    testResult.hidden = false;
    testResult.textContent = "";
    if (!checkoutForm?.reportValidity()) return;
    try {
      const cart = getCartItems();
      const postcode = postcodeInput.value.trim();
      if (!confirmedQuote || confirmedQuote.postcode !== postcode ||
          confirmedQuote.cart !== JSON.stringify(cart)) {
        throw new Error("Calculate delivery again before submitting the test order.");
      }
      const customer = {
        name: document.getElementById("customer-name").value.trim(),
        phone: document.getElementById("customer-phone").value.trim(),
        email: document.getElementById("customer-email").value.trim(),
        address: document.getElementById("customer-address").value.trim(),
        postcode,
        notes: document.getElementById("customer-notes").value.trim()
      };
      if (customer.name !== "GOOKIE TEST ORDER" ||
          !customer.notes.includes("TEST ONLY — DO NOT BAKE OR SHIP")) {
        throw new Error('For this test, set Full Name to "GOOKIE TEST ORDER" and Notes to "TEST ONLY — DO NOT BAKE OR SHIP".');
      }
      const boxes = makeQuoteBoxes(cart);
      if (boxes.length !== 1 || boxes[0].boxId !== "BOX001" ||
          boxes[0].items.reduce((n, item) => n + item.qty, 0) !== 4 ||
          boxes[0].addons.length) {
        throw new Error("Test is restricted to one Build Your Box (4 pcs), without add-ons.");
      }
      const fingerprint = JSON.stringify({customer, boxes});
      const draftKey = "gookieCheckoutDraftV1";
      let draft;
      try { draft = JSON.parse(sessionStorage.getItem(draftKey) || "null"); }
      catch (_) { draft = null; }
      if (!draft || draft.fingerprint !== fingerprint || !draft.clientRequestId) {
        if (!globalThis.crypto?.randomUUID) throw new Error("Secure request ID unavailable.");
        draft = {fingerprint, clientRequestId: crypto.randomUUID()};
        sessionStorage.setItem(draftKey, JSON.stringify(draft));
      }
      const doneKey = "gookieTestCompletedV1:" + draft.clientRequestId;
      const saved = sessionStorage.getItem(doneKey);
      if (saved) {
        completedTest = true;
        testButton.disabled = true;
        testResult.textContent = "Already submitted in this tab: " + saved + ". Check Google Sheets.";
        return;
      }
      if (!window.confirm("REAL TEST ORDER: This will create a PENDING order in Google Sheets. Submit exactly once?")) return;
      sendingTest = true;
      testButton.disabled = true;
      testButton.textContent = "SENDING TEST ORDER...";
      const payload = {action: "createOrder", clientRequestId: draft.clientRequestId, customer, boxes};
      const response = await fetch("https://script.google.com/macros/s/AKfycbw4ih8Y-a3wiKZLPC7SmVTV6NbUfrEOg37VjtGayYdvmdRawGJ1RZWLxOnAplMkRSIs/exec", {
        method: "POST",
        headers: {"Content-Type": "text/plain;charset=utf-8"},
        body: JSON.stringify(payload),
        redirect: "follow"
      });
      if (!response.ok) throw new Error("Server connection failed.");
      const result = await response.json();
      if (!result.ok || !result.orderId || result.clientRequestId !== draft.clientRequestId) {
        throw new Error(result.message || "Backend did not confirm the order.");
      }
      sessionStorage.setItem(doneKey, result.orderId);
      completedTest = true;
      const expected = confirmedQuote?.grandTotal;
      const actual = Number(result.quote?.grandTotal);
      testResult.textContent = "ORDER CREATED: " + result.orderId +
        "\nPayment status: " + result.paymentStatus +
        "\nBackend total: RM" + (Number.isFinite(actual) ? actual.toFixed(2) : "unknown") +
        "\nPreviously quoted: RM" + (Number.isFinite(expected) ? expected.toFixed(2) : "unknown") +
        "\nReplay: " + Boolean(result.idempotentReplay) +
        "\nCheck Sheets before any further action. No payment was verified.";
      testButton.textContent = "TEST ORDER SUBMITTED";
    } catch (error) {
      testResult.textContent = (error.message || "Unknown error") +
        "\nIf a request may have reached the backend, CHECK SHEETS FIRST. Do not generate a new ID or repeatedly click submit.";
      if (!completedTest) testButton.textContent = "TEST CREATE ORDER — CHECK SHEETS BEFORE RETRY";
    } finally {
      sendingTest = false;
      // Deliberately keep the button disabled after any submission attempt.
      // An uncertain network response must be investigated in Sheets first.
    }
  });

  renderCheckout();

  // Keep checkout updated if the cart changes
  // elsewhere in the same browser.
 
  window.addEventListener(
    "gookie:cart-updated",
    () => {
      resetDeliveryQuote();
      renderCheckout();
    }
  );

 
  window.addEventListener(
    "storage",
    event => {
      if (event.key === CART_KEY) {
        resetDeliveryQuote();
        renderCheckout();
      }
    }
  );

})();
