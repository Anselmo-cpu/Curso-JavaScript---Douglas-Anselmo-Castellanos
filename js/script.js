const SHOP_NAME = "AnselShop";
const STORAGE_CART = "cart_castellanos";

let carrito = [];
let productosCatalogo = [];
let usuario = "Invitado";

const q = (selector) => document.querySelector(selector);

document.addEventListener("DOMContentLoaded", () => {
  loadCartFromStorage();
  renderCart();
  updateCartCount();
  setupForm();
  setupCartButtons();
});

function loadCartFromStorage() {
  const savedCart = localStorage.getItem(STORAGE_CART);
  carrito = savedCart ? JSON.parse(savedCart) : [];
}

function saveCartToStorage() {
  localStorage.setItem(STORAGE_CART, JSON.stringify(carrito));
}

function renderCatalog() {
  const catalogDiv = q("#catalog");
  catalogDiv.innerHTML = "";

  productosCatalogo.forEach((p, idx) => {
    const card = document.createElement("div");
    card.className = "catalog-card";
    card.innerHTML = `
      <strong>${p.nombre}</strong>
      <p>Precio: $${p.precio.toFixed(2)}</p>
      <p>Cantidad: ${p.cantidad}</p>
      <button data-idx="${idx}" class="btn-add-cart">Agregar al carrito</button>
    `;
    card.querySelector(".btn-add-cart").addEventListener("click", () => {
      addToCart(p.nombre, p.precio, 1);
    });
    catalogDiv.appendChild(card);
  });

  if(productosCatalogo.length === 0){
    catalogDiv.innerHTML = "<p>No hay productos en el catálogo. Agregá productos en el formulario.</p>";
  }
}

function addToCart(nombre, precio, cantidad) {
  const existente = carrito.find(p => p.nombre.toLowerCase() === nombre.toLowerCase());
  if (existente) existente.cantidad += cantidad;
  else carrito.push({ nombre, precio, cantidad });

  saveCartToStorage();
  renderCart();
  updateCartCount();
}

function renderCart() {
  const list = q("#cart-list");
  list.innerHTML = "";

  if (carrito.length === 0) {
    list.innerHTML = "<p>El carrito está vacío.</p>";
    q("#cart-total").textContent = "0.00";
    return;
  }

  carrito.forEach((item, idx) => {
    const div = document.createElement("div");
    div.className = "cart-item";
    const subtotal = item.precio * item.cantidad;
    div.innerHTML = `
      <strong>${item.nombre}</strong> - $${item.precio.toFixed(2)} x 
      <input type="number" min="1" max="99" value="${item.cantidad}" data-idx="${idx}" class="cart-qty"> 
      = $${subtotal.toFixed(2)}
      <button data-idx="${idx}" class="btn-remove">Quitar</button>
    `;

    div.querySelector(".cart-qty").addEventListener("change", (e) => {
      const idx = Number(e.target.dataset.idx);
      carrito[idx].cantidad = Math.max(1, Number(e.target.value) || 1);
      saveCartToStorage();
      renderCart();
      updateCartCount();
    });

    div.querySelector(".btn-remove").addEventListener("click", () => {
      carrito.splice(idx, 1);
      saveCartToStorage();
      renderCart();
      updateCartCount();
    });

    list.appendChild(div);
  });

  const totals = calcularTotales();
  q("#cart-total").textContent = totals.total.toFixed(2);
}

function updateCartCount() {
  const count = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  q("#cart-count").textContent = count;
}

function setupForm() {
  const form = q("#product-form");
  const msg = q("#form-message");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = q("#p-name").value.trim();
    const precio = parseFloat(q("#p-price").value);
    const cantidad = parseInt(q("#p-stock").value, 10);

    if (!nombre || isNaN(precio) || precio <= 0 || isNaN(cantidad) || cantidad <= 0) {
      msg.textContent = "Datos inválidos. Complete correctamente el formulario.";
      msg.style.color = "red";
      return;
    }

    const producto = { nombre, precio, cantidad };
    productosCatalogo.push(producto);
    renderCatalog();
    addToCart(nombre, precio, cantidad);

    saveCartToStorage();
    form.reset();
    msg.textContent = "Producto agregado correctamente.";
    msg.style.color = "green";
    setTimeout(() => { msg.textContent = ""; }, 2500);
  });
}

function setupCartButtons() {
  const btn = q("#btn-clear-cart");
  btn.addEventListener("click", () => {
    carrito = [];
    saveCartToStorage();
    renderCart();
    updateCartCount();
  });
}

function calcularTotales() {
  let subtotal = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  let descuento = subtotal >= 10000 ? subtotal * 0.12 : subtotal >= 5000 ? subtotal * 0.06 : 0;
  const totalDespuesDescuento = subtotal - descuento;
  const envio = totalDespuesDescuento > 7000 ? 0 : 800;
  const regalo = carrito.length >= 3 ? "Cupón 10% para la próxima compra" : null;
  const total = totalDespuesDescuento + envio;
  return { subtotal, descuento, envio, total, regalo };
}
