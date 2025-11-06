// main.js
document.addEventListener("DOMContentLoaded", () => {
  cargarCarrito();
  cargarProductos(); // Carga productos desde JSON
  renderCarrito();
  actualizarContador();

  // Botones de navegación
  q("#btn-show-catalog").addEventListener("click", () => mostrarSeccion("catalog-section"));
  q("#btn-show-cart").addEventListener("click", () => mostrarSeccion("cart-section"));

  // Vaciar carrito
  q("#btn-clear-cart").addEventListener("click", () => {
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
  });

  // Checkout
  q("#btn-checkout").addEventListener("click", () => {
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
  });
});
