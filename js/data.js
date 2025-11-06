// data.js
const SHOP_NAME = "AnselShop";
const STORAGE_CART = "cart_castellanos";

let carrito = [];
let productosCatalogo = [];

// Cargar carrito desde localStorage
function cargarCarrito() {
  const saved = localStorage.getItem(STORAGE_CART);
  carrito = saved ? JSON.parse(saved) : [];
}

// Guardar carrito en localStorage
function guardarCarrito() {
  localStorage.setItem(STORAGE_CART, JSON.stringify(carrito));
}

// Agregar producto al carrito
function agregarAlCarrito(nombre, precio, cantidad) {
  const existente = carrito.find(p => p.nombre.toLowerCase() === nombre.toLowerCase());
  if (existente) existente.cantidad += cantidad;
  else carrito.push({ nombre, precio, cantidad });
  guardarCarrito();
}

// Calcular totales del carrito
function calcularTotales() {
  let subtotal = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  let descuento = subtotal >= 10000 ? subtotal * 0.12 : subtotal >= 5000 ? subtotal * 0.06 : 0;
  let envio = subtotal - descuento > 7000 ? 0 : 800;
  let regalo = carrito.length >= 3 ? "Cupón 10% para la próxima compra" : null;
  let total = subtotal - descuento + envio;
  return { subtotal, descuento, envio, total, regalo };
}

// Cargar productos desde JSON
async function cargarProductos() {
  try {
    const res = await fetch('./data/productos.json');
    productosCatalogo = await res.json();
    renderCatalogo(); // Renderiza catálogo después de cargar
  } catch (err) {
    console.error("Error cargando productos:", err);
  }
}
