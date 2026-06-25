let cart = [];
let total = 0;

function addItem(name, price) {
  cart.push({ name, price });
  total += price;
  renderCart();
}

function renderCart() {
  let container = document.getElementById("cart-items");
  container.innerHTML = "";

  cart.forEach(item => {
    container.innerHTML += `
      <p>${item.name} - RM${item.price}</p>
    `;
  });

  document.getElementById("total").innerText = total;
}

function checkout() {
  let message = "Hi Gookie! I want to order:%0A%0A";

  cart.forEach(item => {
    message += `- ${item.name} RM${item.price}%0A`;
  });

  message += `%0ATotal: RM${total}%0A%0AName:%0APickup/Delivery:%0ADate:`;

  let phone = "60102810487"; // nanti kita tukar nombor awak
  window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
}
