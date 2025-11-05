const SHOP_NAME = "AnselShop";
const STORAGE_CART = "cart_castellanos";

let carrito = [];
let productosCatalogo = [
  { nombre: "Mouse Gamer", precio: 2500 },
  { nombre: "Teclado Mecánico", precio: 4200 },
  { nombre: "Auriculares Inalámbricos", precio: 3500 },
  { nombre: "Parlante Bluetooth", precio: 2800 },
  { nombre: "Monitor 24\"", precio: 8500 }
];

const q = selector => document.querySelector(selector);

document.addEventListener("DOMContentLoaded", () => {
  cargarCarrito();
  renderCatalogo();
  renderCarrito();
  actualizarContador();

  // Botones de navegación
  q("#btn-show-catalog").addEventListener("click", () => mostrarSeccion("catalog-section"));
  q("#btn-show-cart").addEventListener("click", () => mostrarSeccion("cart-section"));

  // Botón vaciar carrito
  q("#btn-clear-cart").addEventListener("click", vaciarCarrito);

  // Botón checkout
  q("#btn-checkout").addEventListener("click", checkout);
});

function mostrarSeccion(idSeccion) {
  document.querySelectorAll(".section").forEach(sec => sec.classList.remove("active"));
  q(`#${idSeccion}`).classList.add("active");
}

function cargarCarrito() {
  const saved = localStorage.getItem(STORAGE_CART);
  carrito = saved ? JSON.parse(saved) : [];
}

function guardarCarrito() {
  localStorage.setItem(STORAGE_CART, JSON.stringify(carrito));
}

function renderCatalogo() {
  const catalog = q("#catalog");
  catalog.innerHTML = "";

  productosCatalogo.forEach((p, idx) => {
    const card = document.createElement("div");
    card.className = "catalog-card";
    card.innerHTML = `
      <strong>${p.nombre}</strong>
      <p>Precio: $${p.precio.toFixed(2)}</p>
      <button data-idx="${idx}" class="btn-add-cart">Agregar al carrito</button>
    `;
    card.querySelector(".btn-add-cart").addEventListener("click", () => {
      agregarAlCarrito(p.nombre, p.precio, 1);
      Swal.fire({
        icon: "success",
        title: "Agregado",
        text: `${p.nombre} fue agregado al carrito.`,
        timer: 1200,
        showConfirmButton: false
      });
    });
    catalog.appendChild(card);
  });
}

function agregarAlCarrito(nombre, precio, cantidad) {
  const existente = carrito.find(p => p.nombre.toLowerCase() === nombre.toLowerCase());
  if (existente) existente.cantidad += cantidad;
  else carrito.push({ nombre, precio, cantidad });

  guardarCarrito();
  renderCarrito();
  actualizarContador();
}

function renderCarrito() {
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

    // Cambiar cantidad
    div.querySelector(".cart-qty").addEventListener("change", e => {
      const idx = Number(e.target.dataset.idx);
      carrito[idx].cantidad = Math.max(1, Number(e.target.value) || 1);
      guardarCarrito();
      renderCarrito();
      actualizarContador();
    });

    // Quitar producto
    div.querySelector(".btn-remove").addEventListener("click", () => {
      carrito.splice(idx, 1);
      guardarCarrito();
      renderCarrito();
      actualizarContador();
    });

    list.appendChild(div);
  });

  const totales = calcularTotales();
  q("#cart-total").textContent = totales.total.toFixed(2);
}

function actualizarContador() {
  const count = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  q("#cart-count").textContent = count;
}

function calcularTotales() {
  let subtotal = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  let descuento = subtotal >= 10000 ? subtotal * 0.12 : subtotal >= 5000 ? subtotal * 0.06 : 0;
  let envio = subtotal - descuento > 7000 ? 0 : 800;
  let regalo = carrito.length >= 3 ? "Cupón 10% para la próxima compra" : null;
  let total = subtotal - descuento + envio;
  return { subtotal, descuento, envio, total, regalo };
}

function vaciarCarrito() {
  carrito = [];
  guardarCarrito();
  renderCarrito();
  actualizarContador();
  Swal.fire({
    icon: "info",
    title: "Carrito vacío",
    text: "Todos los productos fueron removidos.",
    timer: 1200,
    showConfirmButton: false
  });
}

function checkout() {
  if (carrito.length === 0) {
    Swal.fire({ icon: "warning", title: "Carrito vacío", text: "Agrega productos antes de comprar." });
    return;
  }

  const totales = calcularTotales();
  let mensaje = `Subtotal: $${totales.subtotal.toFixed(2)}\nDescuento: $${totales.descuento.toFixed(2)}\nEnvío: $${totales.envio.toFixed(2)}\nTOTAL: $${totales.total.toFixed(2)}`;
  if (totales.regalo) mensaje += `\nRegalo: ${totales.regalo}`;

  Swal.fire({
    icon: "success",
    title: "Compra realizada",
    html: mensaje.replace(/\n/g, "<br>"),
  });

  carrito = [];
  guardarCarrito();
  renderCarrito();
  actualizarContador();
}
