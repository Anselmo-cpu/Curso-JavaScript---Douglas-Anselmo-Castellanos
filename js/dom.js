// dom.js
const q = selector => document.querySelector(selector);

// Mostrar sección (Catálogo o Carrito)
function mostrarSeccion(idSeccion) {
  document.querySelectorAll(".section").forEach(sec => sec.classList.remove("active"));
  q(`#${idSeccion}`).classList.add("active");
}

// Renderizar catálogo de productos
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
      renderCarrito();
      actualizarContador();
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

// Renderizar carrito de compras
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
      const i = Number(e.target.dataset.idx);
      carrito[i].cantidad = Math.max(1, Number(e.target.value) || 1);
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

// Actualizar contador de carrito en la cabecera
function actualizarContador() {
  const count = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  q("#cart-count").textContent = count;
}
