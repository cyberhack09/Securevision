
/* ==========================================
   SECUREVISION - ORBIX DIGITAL
   Catálogo, carrito y pedidos por WhatsApp
========================================== */

// DEMO: sustituye este número por el WhatsApp
// comercial autorizado antes de publicar.
// Formato internacional: código de país + número.
// República Dominicana: 1 + código de área + número.
const WHATSAPP_NUMBER = "18099861302";

// Productos de ejemplo. Precios demostrativos en RD$.

const products = [
  {
    id: 1,
    name: "Cámara Bullet HD",
    category: "camaras",
    description: "Cámara para exteriores con visión nocturna.",
    price: 1850,
    emoji: "📹",
    image: "img/camara-bullet.jpg"
  },
  {
    id: 2,
    name: "Cámara Domo Interior",
    category: "camaras",
    description: "Diseño compacto para espacios interiores.",
    price: 2200,
    emoji: "🎥",
    image: "img/camara-domo.jpg"
  },
  {
    id: 3,
    name: "Cámara IP WiFi",
    category: "camaras",
    description: "Vigilancia conectada para tu hogar.",
    price: 2850,
    emoji: "📷",
    image: "img/camara-ip.jpg"
  },
  {
    id: 4,
    name: "DVR de 4 Canales",
    category: "grabadores",
    description: "Grabador para sistemas de cuatro cámaras.",
    price: 3900,
    emoji: "📼",
    image: "img/dvr.jpg"
  },
  {
    id: 5,
    name: "NVR para Cámaras IP",
    category: "grabadores",
    description: "Grabador de red para vigilancia compatible.",
    price: 5500,
    emoji: "🖥️",
    image: "img/nvr.jpg"
  },
  {
    id: 6,
    name: "Kit de Vigilancia x4",
    category: "kits",
    description: "Kit de ejemplo con cuatro cámaras y DVR.",
    price: 12500,
    emoji: "🛡️",
    image: "img/kit-4-camaras.jpg"
  },
  {
    id: 7,
    name: "Kit de Vigilancia x8",
    category: "kits",
    description: "Solución demostrativa para negocios.",
    price: 21900,
    emoji: "🏢",
    image: "img/kit-8-camaras.jpg"
  },
  {
    id: 8,
    name: "Disco Duro 1 TB",
    category: "accesorios",
    description: "Almacenamiento para grabaciones compatibles.",
    price: 3200,
    emoji: "💽",
    image: "img/disco-duro.jpg"
  },
  {
    id: 9,
    name: "Cable de Instalación",
    category: "accesorios",
    description: "Cableado para proyectos de vigilancia.",
    price: 850,
    emoji: "🔌",
    image: "img/cable.jpg"
  }
];

// Estado del carrito
let cart = [];
let currentCategory = "todos";

// Elementos de la página
const productGrid = document.getElementById("product-grid");
const filters = document.getElementById("filters");
const cartCount = document.getElementById("cart-count");
const cartPanel = document.getElementById("cart-panel");
const cartOverlay = document.getElementById("cart-overlay");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

// Formato de precios dominicanos
function formatPrice(price) {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
    maximumFractionDigits: 0
  }).format(price);
}

// Mostrar productos

function renderProducts() {
  const visibleProducts = products.filter(product =>
    currentCategory === "todos" ||
    product.category === currentCategory
  );

  if (!visibleProducts.length) {
    productGrid.innerHTML = "<p>No hay productos disponibles.</p>";
    return;
  }

  productGrid.innerHTML = visibleProducts.map(product => `
    <article class="product-card">
      <div class="product-image">
        <img
          src="${escapeHTML(product.image)}"
          alt="${escapeHTML(product.name)}"
          loading="lazy"
          onerror="this.hidden=true;this.nextElementSibling.hidden=false"
        >
        <span aria-hidden="true" hidden>${product.emoji}</span>
      </div>

      <div class="product-info">
        <span class="product-category">
          ${escapeHTML(product.category)}
        </span>

        <h3>${escapeHTML(product.name)}</h3>

        <p class="product-description">
          ${escapeHTML(product.description)}
        </p>

        <div class="product-bottom">
          <span class="product-price">
            ${formatPrice(product.price)}
          </span>

          <button
            class="add-cart"
            data-add="${product.id}"
            aria-label="Agregar ${escapeHTML(product.name)} al carrito"
            title="Agregar al carrito"
          >+</button>
        </div>
      </div>
    </article>
  `).join("");
}


// Evitar interpretar texto de productos como HTML
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

// Filtros de categorías
filters.addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  currentCategory = button.dataset.category;

  filters.querySelectorAll(".filter").forEach(filter => {
    filter.classList.toggle("active", filter === button);
  });

  renderProducts();
});

// Agregar productos
productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (!button) return;

  const productId = Number(button.dataset.add);
  const product = products.find(item => item.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  renderCart();

  // Confirmación visual
  button.textContent = "✓";
  setTimeout(() => {
    if (button.isConnected) button.textContent = "+";
  }, 600);
});

// Mostrar y ocultar carrito
function openCart() {
  cartPanel.classList.add("open");
  cartOverlay.classList.add("visible");
  cartPanel.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  document.getElementById("close-cart").focus();
}

function closeCart() {
  cartPanel.classList.remove("open");
  cartOverlay.classList.remove("visible");
  cartPanel.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  document.getElementById("open-cart").focus();
}

document.getElementById("open-cart").addEventListener("click", openCart);
document.getElementById("close-cart").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && cartPanel.classList.contains("open")) {
    closeCart();
  }
});

// Actualizar carrito
function renderCart() {
  const totalQuantity = cart.reduce(
    (sum, item) => sum + item.quantity, 0
  );

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  cartCount.textContent = totalQuantity;
  cartTotal.textContent = formatPrice(totalPrice);

  if (!cart.length) {
    cartItems.innerHTML = `
      <p class="empty-cart">Tu carrito está vacío.</p>
    `;
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div>
        <h3>${escapeHTML(item.name)}</h3>
        <p>${formatPrice(item.price * item.quantity)}</p>

        <div class="quantity-controls">
          <button data-minus="${item.id}" aria-label="Restar uno">−</button>
          <span>${item.quantity}</span>
          <button data-plus="${item.id}" aria-label="Agregar uno">+</button>
        </div>
      </div>

      <button class="remove-item"
        data-remove="${item.id}" aria-label="Eliminar producto">✕</button>
    </div>
  `).join("");
}

// Modificar cantidades o eliminar productos
cartItems.addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;

  const id = Number(
    button.dataset.plus ||
    button.dataset.minus ||
    button.dataset.remove
  );

  const item = cart.find(product => product.id === id);
  if (!item) return;

  if (button.hasAttribute("data-plus")) {
    item.quantity += 1;
  } else if (button.hasAttribute("data-minus")) {
    item.quantity -= 1;

    if (item.quantity <= 0) {
      cart = cart.filter(product => product.id !== id);
    }
  } else if (button.hasAttribute("data-remove")) {
    cart = cart.filter(product => product.id !== id);
  }

  renderCart();
});

// Preparar pedido de WhatsApp
function sendWhatsApp(message) {
  const number = WHATSAPP_NUMBER.replace(/\D/g, "");

  if (!/^\d{10,15}$/.test(number) || number === "18095551234") {
    alert(
      "Configura tu número comercial de WhatsApp en js/app.js antes de usar los pedidos."
    );
    return;
  }

  const url = "https://wa.me/" + number +
    "?text=" + encodeURIComponent(message);

  window.open(url, "_blank", "noopener,noreferrer");
}



/* =====================================
   CHECKOUT DEMOSTRATIVO
   Transferencia bancaria ficticia
===================================== */

const checkoutOverlay = document.getElementById("checkout-overlay");
const checkoutItems = document.getElementById("checkout-items");
const checkoutTotal = document.getElementById("checkout-total");
const demoReceipt = document.getElementById("demo-receipt");

function renderCheckout() {
  checkoutItems.innerHTML = cart.map(item => `
    <div class="checkout-line">
      <span>${escapeHTML(item.name)} × ${item.quantity}</span>
      <span>${formatPrice(item.price * item.quantity)}</span>
    </div>
  `).join("");

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  checkoutTotal.textContent = formatPrice(total);
}

function openCheckout() {
  if (!cart.length) {
    alert("Agrega al menos un producto antes de continuar.");
    return;
  }

  renderCheckout();

  demoReceipt.hidden = true;
  document.getElementById("simulate-payment").hidden = false;
  document.getElementById("checkout-cancel").hidden = false;
  checkoutOverlay.hidden = false;
  document.body.classList.add("checkout-open");

  document.getElementById("checkout-close").focus();
}

function closeCheckout() {
  checkoutOverlay.hidden = true;
  document.body.classList.remove("checkout-open");
  document.getElementById("open-cart").focus();
}

document.getElementById("checkout").addEventListener("click", openCheckout);

document.getElementById("checkout-close").addEventListener("click", closeCheckout);

document.getElementById("checkout-cancel").addEventListener("click", closeCheckout);

// Cerrar al tocar el fondo oscuro
checkoutOverlay.addEventListener("click", event => {
  if (event.target === checkoutOverlay) {
    closeCheckout();
  }
});

// Simular la confirmación: no se realiza ningún pago
document.getElementById("simulate-payment").addEventListener("click", () => {
  if (!cart.length) {
    alert("El carrito está vacío.");
    closeCheckout();
    return;
  }

  const demoOrderId = "DEMO-" +
    Date.now().toString().slice(-8);

  document.getElementById("receipt-number").textContent =
    "Referencia de prueba: " + demoOrderId;

  demoReceipt.hidden = false;
  document.getElementById("simulate-payment").hidden = true;
  document.getElementById("checkout-cancel").hidden = true;
  demoReceipt.scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });
});

// Finalizar la demostración y limpiar el carrito
document.getElementById("finish-demo").addEventListener("click", () => {
  cart = [];
  renderCart();
  closeCheckout();
});

// Cerrar con Escape
document.addEventListener("keydown", event => {
  if (
    event.key === "Escape" &&
    checkoutOverlay &&
    !checkoutOverlay.hidden
  ) {
    closeCheckout();
  }
});



// Botón de consulta general
document.getElementById("contact-whatsapp").addEventListener("click", () => {
  sendWhatsApp(
    "Hola, vi la demo de SecureVision creada por Orbix Digital y quiero información sobre los equipos de seguridad."
  );
});

// Año del pie de página
document.getElementById("year").textContent = new Date().getFullYear();

// Iniciar tienda
renderProducts();
renderCart();
