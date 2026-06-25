let items = {
  choco: { name: "Double Chocolate", price: 8, qty: 0 },
  smores: { name: "S’mores Gookie", price: 9, qty: 0 },
  tiramisu: { name: "Tiramisu Lava", price: 10, qty: 0 }
};

function changeQty(key, qty) {
  items[key].qty += qty;
  if (items[key].qty < 0) items[key].qty = 0;
  render();
}

function render() {
  let cart = document.getElementById("cart");
  let total = 0;
  cart.innerHTML = "";

  Object.keys(items).forEach(k => {
    let i = items[k];
    if (i.qty > 0) {
      total += i.qty * i.price;
      cart.innerHTML += `<p>${i.name} x${i.qty} = RM${i.qty * i.price}</p>`;
    }
  });

  document.getElementById("total").innerText = total;
}

function checkout() {
  let name = document.getElementById("name").value;
  let phone = document.getElementById("phone").value;
  let address = document.getElementById("address").value;
  let note = document.getElementById("note").value;

  let msg = `🍪 *NEW Gookie Order*%0A%0A`;

  msg += `👤 Name: ${name}%0A`;
  msg += `📞 Phone: ${phone}%0A`;
  msg += `🏠 Address: ${address}%0A`;
  msg += `📝 Notes: ${note}%0A%0A`;

  msg += `🛒 *Order:*%0A`;

  let total = 0;

  Object.keys(items).forEach(k => {
    let i = items[k];
    if (i.qty > 0) {
      msg += `- ${i.name} x${i.qty} = RM${i.qty * i.price}%0A`;
      total += i.qty * i.price;
    }
  });

  msg += `%0A💰 Total: RM${total}`;

  window.open(`https://wa.me/60102810487?text=${msg}`, "_blank");
}
