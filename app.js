const PRODUCTS = [
  { id:'miel-250', name:'Miel natural', size:'250 ml', category:'Miel', price:18.90, stock:14, image:'./assets/honey.jpg', description:'Dale un toque dorado a tus desayunos y recetas con miel de abeja, envasada con cuidado para llevar el sabor de la colmena a tu mesa.' },
  { id:'miel-500', name:'Miel natural', size:'500 ml', category:'Miel', price:32.90, stock:9, image:'./assets/honey-500.jpg', description:'Tu miel favorita para compartir en familia, endulzar tus bebidas y acompañar esos pequeños momentos de cada día.' },
  { id:'polen-100', name:'Polen de abeja', size:'100 g', category:'Polen', price:24.90, stock:11, image:'./assets/pollen.jpg', description:'Pequeños granos llenos de carácter, seleccionados y envasados cuidadosamente para quienes disfrutan explorar los productos de la colmena.' },
  { id:'polen-250', name:'Polen de abeja', size:'250 g', category:'Polen', price:44.90, stock:5, image:'./assets/pollen.jpg', description:'Una presentación práctica para quienes ya tienen al polen entre sus favoritos.' },
  { id:'vela-lavanda', name:'Vela de cera natural', size:'Lavanda · 100 g', category:'Velas', price:16.90, stock:13, image:'./assets/candles.jpg', description:'Crea un rincón acogedor con una vela artesanal inspirada en la naturaleza y notas suaves de lavanda.' },
  { id:'vela-vainilla', name:'Vela de cera natural', size:'Vainilla · 100 g', category:'Velas', price:17.90, stock:7, image:'./assets/candles.jpg', description:'Una luz cálida y un aroma dulce para acompañar tus pausas, lecturas o momentos especiales.' },
  { id:'propolio-30', name:'Propóleo', size:'30 ml', category:'Propóleo', price:21.90, stock:8, image:'./assets/propolis.jpg', description:'Descubre otro tesoro de la colmena: propóleo en un formato práctico, ideal para tenerlo a mano.' },
  { id:'mini-api', name:'Mini Api', size:'Peluche de abeja', category:'Souvenirs', price:20.00, stock:20, image:'./assets/mini-api.jpg', description:'Conoce a Mini Api, el pequeño compañero de la colmena. Un detalle adorable para regalar, decorar tu espacio o llevar contigo el cariño de Factor Api.' }
];

const CART_KEY = 'factorApiCart';
const COUPON_KEY = 'factorApiPrizeCoupon';
const money = n => `S/ ${Number(n).toFixed(2)}`;
const getCart = () => JSON.parse(localStorage.getItem(CART_KEY) || '[]');
const saveCart = cart => localStorage.setItem(CART_KEY, JSON.stringify(cart));
const productById = id => PRODUCTS.find(p => p.id === id);

function cartCount() {
  const total = getCart().reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('[data-cart-count]').forEach(el => el.textContent = total);
}

function toast(title, text) {
  const el = document.querySelector('#toast');
  if (!el) return;
  el.innerHTML = `<strong>${title}</strong><span>${text}</span>`;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2600);
}

function addToCart(id, qty = 1) {
  const p = productById(id);
  if (!p) return;
  const cart = getCart();
  const found = cart.find(i => i.id === id);
  if (found) found.qty += qty;
  else cart.push({ id, qty });
  saveCart(cart); cartCount();
  toast('¡Producto agregado!', `${p.name} · ${p.size} ya está en tu carrito.`);
  animateAdd();
}

function animateAdd() {
  const cart = document.querySelector('.cart-btn');
  if (!cart) return;
  cart.classList.remove('cart-added');
  void cart.offsetWidth;
  cart.classList.add('cart-added');
  setTimeout(() => cart.classList.remove('cart-added'), 1000);
}

function removeFromCart(id) {
  saveCart(getCart().filter(i => i.id !== id));
  renderCart(); cartCount();
}

function changeQty(id, delta) {
  const p = productById(id);
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) return removeFromCart(id);
  saveCart(cart); renderCart(); cartCount();
}

function renderCart() {
  const list = document.querySelector('#cart-list');
  const summary = document.querySelector('#cart-summary');
  if (!list || !summary) return;
  const cart = getCart();
  if (!cart.length) {
    list.innerHTML = `<div class="empty"><div style="font-size:46px">🛒</div><h3>Tu carrito está vacío</h3><p>Agrega miel, polen o alguno de nuestros productos artesanales.</p><a class="primary-btn" href="tienda.html">Ver tienda</a></div>`;
    summary.innerHTML = `<h3>Resumen</h3><p style="color:var(--muted)">Aún no tienes productos en el carrito.</p>`;
    return;
  }
  let subtotal = 0;
  list.innerHTML = cart.map(item => {
    const p = productById(item.id);
    const total = p.price * item.qty; subtotal += total;
    return `<div class="cart-item">
      <img src="${p.image}" alt="${p.name}" onerror="this.onerror=null;this.src='./assets/honey.jpg'">
      <div class="cart-meta"><h4>${p.name}</h4><p>${p.size} · ${money(p.price)} c/u</p>
        <div class="qty" style="margin-top:10px"><button onclick="changeQty('${p.id}',-1)">−</button><strong>${item.qty}</strong><button onclick="changeQty('${p.id}',1)">+</button></div>
      </div>
      <div style="text-align:right"><strong>${money(total)}</strong><br><button style="border:0;background:none;color:#8a670b;margin-top:8px" onclick="removeFromCart('${p.id}')">Eliminar</button></div>
    </div>`;
  }).join('');
  const coupon = localStorage.getItem(COUPON_KEY) || '';
  const discountRate = coupon === 'API10' ? 0.10 : coupon === 'API8' ? 0.08 : coupon === 'API5' ? 0.05 : 0;
  const discount = subtotal * discountRate;
  const shipping = subtotal >= 80 || coupon === 'ENVIO' ? 0 : 7;
  summary.innerHTML = `<h3>🛒 Resumen del pedido</h3>
    <div class="summary-row"><span>Subtotal</span><strong>${money(subtotal)}</strong></div>
    ${coupon ? `<div class="coupon-applied">🎟️ Cupón ${coupon} aplicado</div>` : `<div class="coupon-hint">🎁 ¿Quieres un descuento? <a href="index.html#ruleta">Gira la ruleta</a></div>`}
    ${discount ? `<div class="summary-row discount-row"><span>Descuento 10%</span><strong>−${money(discount)}</strong></div>` : ''}
    <div class="summary-row"><span>Envío</span><strong>${shipping === 0 ? 'Gratis' : money(shipping)}</strong></div>
    <div class="summary-total"><span>Total</span><span>${money(subtotal - discount + shipping)}</span></div>
    <button class="primary-btn" style="width:100%;margin-top:18px" onclick="completeOrder()">Finalizar pedido</button>
    <p style="color:var(--muted);font-size:12px;margin-top:10px">También puedes enviar tu pedido por WhatsApp desde el botón de contacto.</p>`;
}

function completeOrder() {
  const cart = getCart();
  if (!cart.length) return;
  const text = cart.map(i => { const p = productById(i.id); return `• ${p.name} ${p.size} x${i.qty} = ${money(p.price*i.qty)}`; }).join('%0A');
  const subtotal = cart.reduce((s,i) => s + productById(i.id).price*i.qty,0);
  const coupon = localStorage.getItem(COUPON_KEY) || '';
  const discountRate = coupon === 'API10' ? 0.10 : coupon === 'API8' ? 0.08 : coupon === 'API5' ? 0.05 : 0;
  const discount = subtotal * discountRate;
  const shipping = subtotal >= 80 || coupon === 'ENVIO' ? 0 : 7;
  const total = subtotal - discount + shipping;
  const couponLine = coupon ? `%0ACupón: ${encodeURIComponent(coupon)}%0ADescuento: ${encodeURIComponent(money(discount))}` : '';
  const phone = '51941983088'; // REEMPLAZA POR EL WHATSAPP REAL DEL NEGOCIO
  const url = `https://wa.me/${phone}?text=Hola%20FACTOR%20API,%20quiero%20hacer%20este%20pedido:%0A${text}%0A%0ASubtotal:%20${encodeURIComponent(money(subtotal))}${couponLine}%0AEnvío:%20${encodeURIComponent(shipping === 0 ? 'Gratis' : money(shipping))}%0ATotal%20estimado:%20${encodeURIComponent(money(total))}`;
  localStorage.removeItem(CART_KEY); localStorage.removeItem(COUPON_KEY); cartCount();
  const overlay = document.querySelector('#celebrate');
  if (overlay) {
    overlay.classList.add('show');
    setTimeout(() => window.open(url, '_blank'), 700);
    setTimeout(() => overlay.classList.remove('show'), 2300);
  } else {
    window.open(url, '_blank');
  }
}

function productCard(p, variants = PRODUCTS.filter(v => v.name === p.name)) {
  const chosen = variants[0] || p;
  const options = variants.length > 1
    ? `<label class="variant-label" for="variant-${p.id}">Elige presentación</label><select class="variant-select" id="variant-${p.id}" onchange="updateVariantPrice('${p.id}', this.value)">${variants.map(v => `<option value="${v.id}" data-price="${v.price}">${v.size} · ${money(v.price)}</option>`).join('')}</select>`
    : `<p class="product-size">${chosen.size}</p>`;
  return `<article class="product-card glass">
    <a class="product-image" href="producto.html?id=${chosen.id}"><img src="${p.image}" alt="${p.name}" onerror="this.onerror=null;this.src='./assets/honey.jpg'"><span class="tag">${p.category}</span></a>
    <div class="product-body">
      <h3>${p.name}</h3><p class="product-description">${p.description}</p>
      ${options}
      <div class="stock ok">● Disponible para pedido</div>
      <div class="price-row"><span class="price" id="price-${p.id}">${money(chosen.price)}</span><button class="add-btn" aria-label="Agregar ${p.name} al carrito" onclick="addSelectedVariant('${p.id}')">＋</button></div>
    </div>
  </article>`;
}

function updateVariantPrice(baseId, variantId) {
  const variant = productById(variantId);
  const price = document.querySelector(`#price-${baseId}`);
  if (variant && price) price.textContent = money(variant.price);
}
function addSelectedVariant(baseId) {
  const select = document.querySelector(`#variant-${baseId}`);
  addToCart(select ? select.value : baseId);
}

function setupStore() {
  const grid = document.querySelector('#product-grid');
  if (!grid) return;
  const search = document.querySelector('#search');
  const filters = [...document.querySelectorAll('[data-filter]')];
  let current = 'Todos';
  function draw() {
    const q = (search?.value || '').toLowerCase().trim();
    const filtered = PRODUCTS.filter(p => (current === 'Todos' || p.category === current) && `${p.name} ${p.size} ${p.category} ${p.description}`.toLowerCase().includes(q));
    const list = [...new Map(filtered.map(p => [p.name, p])).values()];
    grid.innerHTML = list.length ? list.map(p => productCard(p, filtered.filter(v => v.name === p.name))).join('') : `<div class="empty" style="grid-column:1/-1"><h3>No encontramos ese producto</h3><p>Prueba con “miel”, “polen”, “velas” o “Mini Api”.</p></div>`;
  }
  search?.addEventListener('input', draw);
  filters.forEach(btn => btn.addEventListener('click', () => { filters.forEach(b => b.classList.remove('active')); btn.classList.add('active'); current = btn.dataset.filter; draw(); }));
  draw();
}

function setupProduct() {
  const root = document.querySelector('#product-detail');
  if (!root) return;
  const id = new URLSearchParams(location.search).get('id') || PRODUCTS[0].id;
  const p = productById(id) || PRODUCTS[0];
  let selectedSize = p.size, qty = 1;
  root.innerHTML = `<div class="detail-image glass"><img src="${p.image}" alt="${p.name}" onerror="this.onerror=null;this.src='./assets/honey.jpg'"></div>
  <section class="detail-panel glass"><span class="tag" style="position:static;display:inline-block">${p.category}</span>
    <h1>${p.name}</h1><p style="color:var(--muted)">${p.description}</p>
    <div class="detail-price">${money(p.price)}</div>
    <div class="stock ok">● Disponible para pedido · confirmar por WhatsApp</div>
    <h4>Presentación</h4><div class="options"><button class="option active">${selectedSize}</button></div>
    <div class="qty-row"><div class="qty"><button id="minus">−</button><strong id="qty">1</strong><button id="plus">+</button></div><button id="add-detail" class="primary-btn" style="flex:1">Agregar al carrito</button></div>
    <div class="info-grid" style="grid-template-columns:1fr 1fr"><div class="info-card" style="padding:15px"><h4>100% natural</h4><p>Sin aditivos innecesarios.</p></div><div class="info-card" style="padding:15px"><h4>Origen local</h4><p>Producción con identidad.</p></div></div>
  </section>`;
  const qtyEl = root.querySelector('#qty');
  root.querySelector('#minus').onclick = () => { qty = Math.max(1, qty-1); qtyEl.textContent = qty; };
  root.querySelector('#plus').onclick = () => { qty += 1; qtyEl.textContent = qty; };
  root.querySelector('#add-detail').onclick = () => addToCart(p.id, qty);
}

function sendContactEmail(form) {
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const subject = 'Consulta desde la web de FACTOR API';
  const body = [
    'Hola FACTOR API, quiero hacer una consulta.',
    `Nombre: ${data.get('nombre')}`,
    `Mi WhatsApp: ${data.get('whatsapp')}`,
    `Mi correo: ${data.get('correo')}`,
    `Mensaje: ${data.get('mensaje')}`
  ].join('\n');
  const url = `mailto:factorapi.pe@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = url;
  toast('Abriendo tu correo', 'Revisa el mensaje y pulsa Enviar en tu aplicación de correo.');
}

function sendContactMessage(event, form) {
  event.preventDefault();
  const data = new FormData(form);
  const message = [
    'Hola FACTOR API, quiero hacer una consulta.',
    `Nombre: ${data.get('nombre')}`,
    `Mi WhatsApp: ${data.get('whatsapp')}`,
    `Mi correo: ${data.get('correo')}`,
    `Mensaje: ${data.get('mensaje')}`
  ].join('\n');
  const phone = '51941983088';
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
  toast('Abriendo WhatsApp', 'Revisa los datos y pulsa Enviar en WhatsApp para entregar tu mensaje.');
  return false;
}

function setupPrizeWheel() {
  const wheel = document.querySelector('#prize-wheel');
  const button = document.querySelector('#spin-wheel');
  const result = document.querySelector('#wheel-result');
  if (!wheel || !button || !result) return;
  const prizes = [
    { label: '5% de descuento', coupon: 'API5', angle: 315 },
    { label: 'Cupón de 10% de descuento', coupon: 'API10', angle: 225 },
    { label: 'Envío gratis', coupon: 'ENVIO', angle: 135 },
    { label: '8% de descuento', coupon: 'API8', angle: 45 }
  ];
  const alreadySpun = sessionStorage.getItem('factorApiWheelSpun') === 'yes';
  if (alreadySpun) {
    const saved = sessionStorage.getItem('factorApiWheelPrize') || '';
    result.textContent = saved ? `Tu premio de esta visita: ${saved}` : 'Ya giraste la ruleta en esta visita. ¡Guarda tu premio!';
    button.disabled = true; button.textContent = 'Ya giraste';
    return;
  }
  button.addEventListener('click', () => {
    if (button.disabled) return;
    button.disabled = true; button.textContent = 'Girando…';
    const prize = prizes[Math.floor(Math.random() * prizes.length)];
    const extraTurns = 5 + Math.floor(Math.random() * 3);
    const finalAngle = extraTurns * 360 + prize.angle;
    wheel.style.transform = `rotate(${finalAngle}deg)`;
    wheel.classList.add('is-spinning');
    window.setTimeout(() => {
      wheel.classList.remove('is-spinning');
      localStorage.setItem(COUPON_KEY, prize.coupon);
      sessionStorage.setItem('factorApiWheelSpun', 'yes');
      sessionStorage.setItem('factorApiWheelPrize', prize.label);
      result.innerHTML = `🎉 ¡Ganaste <strong>${prize.label}</strong>! ${prize.coupon === 'ENVIO' ? 'El envío gratis se aplicará en el carrito.' : `El cupón ${prize.coupon} se aplicará en el carrito.`}`;
      button.textContent = 'Premio conseguido';
      toast('¡Premio de la ruleta!', prize.label);
    }, 4200);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  cartCount(); setupStore(); setupProduct(); renderCart(); setupPrizeWheel();
  const year = document.querySelector('#year'); if (year) year.textContent = new Date().getFullYear();
});
