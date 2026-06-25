let items = {
  choco: { name: "Double Chocolate", price: 8, qty: 0 },
  smores: { name: "S’mores Gookie", price: 9, qty: 0 },
  tiramisu: { name: "Tiramisu Lava", price: 10, qty: 0 }
};

function changeQty(key, amount) {
  items[key].qty += amount;

  if (items[key].qty < 0) items[key].qty = 0;

  document.getElementById(`qty-${key}`).innerText = items[key].qty;

  renderCart();
}

function renderCart() {
  let cartDiv = document.getElementById("cartItems");
  let total = 0;

  cartDiv.innerHTML = "";

  Object.keys(items).forEach(key => {
    let item = items[key];

    if (item.qty > 0) {
      total += item.qty * item.price;

      let div = document.createElement("div");
      div.innerHTML = `
        <p>${item.name} x ${item.qty} - RM ${item.qty * item.price}</p>
      `;
      cartDiv.appendChild(div);
    }
  });

  document.getElementById("total").innerText = total;
}

function checkout() {
  let msg = "Hi Gookie! I want to order:%0A%0A";
  let total = 0;

  Object.keys(items).forEach(key => {
    let item = items[key];

    if (item.qty > 0) {
      msg += `- ${item.name} x${item.qty} RM${item.qty * item.price}%0A`;
      total += item.qty * item.price;
    }
  });

  msg += `%0ATotal: RM${total}`;

  window.open(`https://wa.me/60123456789?text=${msg}`, "_blank");
}
