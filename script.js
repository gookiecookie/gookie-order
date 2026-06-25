let cart = [];

function addItem(item) {
  cart.push(item);
  renderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  renderCart();
}

function renderCart() {
  const cartList = document.getElementById("cart");
  cartList.innerHTML = "";

  cart.forEach((item, index) => {
    cartList.innerHTML += `
      <li>
        ${item}
        <button onclick="removeItem(${index})">X</button>
      </li>
    `;
  });
}

function sendWhatsApp() {
  let name = document.getElementById("name").value;
  let phone = document.getElementById("phone").value;
  let note = document.getElementById("note").value;

  if (!name || !phone) {
    alert("Please fill in your name & phone number");
    return;
  }

  let message = `🍪 *Gookie Order*\n\n`;
  message += `Name: ${name}\n`;
  message += `Phone: ${phone}\n\n`;

  message += `Order:\n`;
  cart.forEach(item => {
    message += `- ${item}\n`;
  });

  if (note) {
    message += `\nNotes: ${note}`;
  }

  let url = `https://wa.me/60102810487?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}
