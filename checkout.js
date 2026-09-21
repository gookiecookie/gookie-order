
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
