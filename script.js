const SHOP_NAME = "AnselShop";
let carrito = [];
let usuario = "";

function obtenerDatosUsuario() {
  const nombre = prompt("Ingrese su nombre (o cancele para continuar como Invitado):");
  usuario = nombre && nombre.trim() ? nombre.trim() : "Invitado";
  console.log("Usuario:", usuario);
  return usuario;
}

function agregarProducto() {
  const nombre = prompt("Nombre del producto:");
  if (!nombre) return false;

  const precio = parseFloat(prompt(`Precio de "${nombre}" (solo números):`));
  if (isNaN(precio) || precio <= 0) {
    alert("Precio inválido. No se agregó el producto.");
    return false;
  }

  const cantidad = parseInt(prompt("Cantidad (número entero):"), 10);
  if (isNaN(cantidad) || cantidad <= 0) {
    alert("Cantidad inválida. No se agregó el producto.");
    return false;
  }

  const existente = carrito.find(p => p.nombre.toLowerCase() === nombre.toLowerCase());
  if (existente) {
    existente.cantidad += cantidad;
  } else {
    carrito.push({ nombre: nombre.trim(), precio, cantidad });
  }

  console.log(`Producto agregado: ${nombre} - $${precio} x ${cantidad}`);
  return true;
}

function calcularTotales() {
  let subtotal = 0;
  carrito.forEach(p => subtotal += p.precio * p.cantidad);

  let descuento = 0;
  if (subtotal >= 10000) descuento = subtotal * 0.12;
  else if (subtotal >= 5000) descuento = subtotal * 0.06;

  const totalDespuesDescuento = subtotal - descuento;
  const envio = totalDespuesDescuento > 7000 ? 0 : 800;

  let regalo = null;
  if (carrito.length >= 3) regalo = "Cupón 10% para la próxima compra";

  const total = totalDespuesDescuento + envio;
  return { subtotal, descuento, envio, total, regalo };
}

function mostrarResumen() {
  if (carrito.length === 0) {
    alert("El carrito está vacío.");
    return;
  }

  const t = calcularTotales();
  let mensaje = `Resumen de la compra - ${SHOP_NAME}\nUsuario: ${usuario}\n\nProductos:\n`;
  carrito.forEach(p => {
    mensaje += `- ${p.nombre}: $${p.precio} x ${p.cantidad} = $${(p.precio * p.cantidad).toFixed(2)}\n`;
  });

  mensaje += `\nSubtotal: $${t.subtotal.toFixed(2)}\nDescuento: $${t.descuento.toFixed(2)}\nEnvío: $${t.envio.toFixed(2)}\nTOTAL: $${t.total.toFixed(2)}\n`;
  if (t.regalo) mensaje += `\nObsequio: ${t.regalo}`;

  alert(mensaje);
  console.log(mensaje);
}

function ejecutarSimuladorInteractivo() {
  obtenerDatosUsuario();

  let seguir = true;
  while (seguir) {
    const agregado = agregarProducto();
    if (!agregado) {
      seguir = confirm("¿Desea intentar agregar otro producto?");
    } else {
      seguir = confirm("¿Desea agregar otro producto al carrito?");
    }
  }

  if (carrito.length && confirm("¿Tiene un cupón de descuento adicional?")) {
    const codigo = prompt("Ingrese el código del cupón:");
    if (codigo && codigo.trim().toUpperCase() === "AHORA5") {
      alert("Cupón válido: 5% aplicado sobre el subtotal.");
    } else {
      alert("Cupón inválido o cancelado.");
    }
  }

  mostrarResumen();
}

function ejecutarDemoRapida() {
  usuario = "DemoUser";
  carrito = [
    { nombre: "Auriculares", precio: 3500, cantidad: 1 },
    { nombre: "Teclado", precio: 4200, cantidad: 1 },
    { nombre: "Mouse", precio: 1800, cantidad: 1 }
  ];
  mostrarResumen();
}

document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startBtn");
  const demoBtn = document.getElementById("demoBtn");

  if (startBtn) startBtn.addEventListener("click", ejecutarSimuladorInteractivo);
  if (demoBtn) demoBtn.addEventListener("click", ejecutarDemoRapida);
});
