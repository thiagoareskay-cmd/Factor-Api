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
const DISCOUNT_KEY = 'factorApiDiscount';
const CODES_KEY = 'factorApiCodes';
const WHEEL_KEY = 'factorApiWelcomeWheelSeen';
const DISCOUNTS = { API10:{percent:10,label:'Bienvenida 10%'}, API5:{percent:5,label:'Gracias 5%'}, APIREFERIDO:{percent:5,label:'Referido 5%'} };
const getDiscount = () => { try { return JSON.parse(localStorage.getItem(DISCOUNT_KEY) || 'null'); } catch { return null; } };
const getCodes = () => { try { return JSON.parse(localStorage.getItem(CODES_KEY) || '[]'); } catch { return []; } };
const saveCodes = codes => localStorage.setItem(CODES_KEY, JSON.stringify([...new Set(codes)]));
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
  const shipping = subtotal >= 80 ? 0 : 7;
  const discount = getDiscount();
  const discountValue = discount && DISCOUNTS[discount.code] ? subtotal * DISCOUNTS[discount.code].percent / 100 : 0;
  summary.innerHTML = `<h3>Resumen del pedido</h3>
    <div class="summary-row"><span>Subtotal</span><strong>${money(subtotal)}</strong></div>
    ${discountValue ? `<div class="summary-row"><span>Descuento (${discount.code})</span><strong>−${money(discountValue)}</strong></div>` : ''}
    <div class="summary-row"><span>Envío</span><strong>${shipping === 0 ? 'Gratis' : money(shipping)}</strong></div>
    <div class="summary-total"><span>Total</span><span>${money(Math.max(0, subtotal - discountValue) + shipping)}</span></div>
    ${discount ? `<p class="small-note">Código activo: ${discount.code}. Los códigos no son acumulables.</p><button class="secondary-btn" onclick="removeDiscountCode()" style="width:100%">Quitar código</button>` : ''}
    <button class="primary-btn" style="width:100%;margin-top:18px" onclick="completeOrder()">Finalizar pedido</button>
    <p style="color:var(--muted);font-size:12px;margin-top:10px">También puedes enviar tu pedido por WhatsApp desde el botón de contacto.</p>`;
}

function completeOrder() {
  const cart = getCart();
  if (!cart.length) return;
  const text = cart.map(i => { const p = productById(i.id); return `• ${p.name} ${p.size} x${i.qty} = ${money(p.price*i.qty)}`; }).join('%0A');
  const subtotal = cart.reduce((s,i) => s + productById(i.id).price*i.qty,0);
  const discount = getDiscount();
  const discountValue = discount && DISCOUNTS[discount.code] ? subtotal * DISCOUNTS[discount.code].percent / 100 : 0;
  const shipping = subtotal >= 80 ? 0 : 7;
  const total = Math.max(0, subtotal - discountValue) + shipping;
  const discountLine = discountValue ? `%0ADescuento (${discount.code}): -${encodeURIComponent(money(discountValue))}` : '';
  const phone = '51941983088'; // REEMPLAZA POR EL WHATSAPP REAL DEL NEGOCIO
  const url = `https://wa.me/${phone}?text=Hola%20FACTOR%20API,%20quiero%20hacer%20este%20pedido:%0A${text}%0A${discountLine}%0AEnvío: ${encodeURIComponent(shipping === 0 ? 'Gratis' : money(shipping))}%0A%0ATotal%20estimado:%20${encodeURIComponent(money(total))}%0APago: Yape, Plin o transferencia (a coordinar).%0AEntrega: Trujillo por motorizado; Lima y provincias por Shalom (a coordinar).`;
  localStorage.removeItem(CART_KEY); localStorage.removeItem(DISCOUNT_KEY); cartCount();
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
  const homeGrid = document.querySelector('#home-products');
  if (homeGrid) homeGrid.innerHTML = PRODUCTS.filter(p => ['miel-250','polen-100','vela-lavanda','mini-api'].includes(p.id)).map(p => productCard(p)).join('');
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
  const variants = PRODUCTS.filter(v => v.name === p.name);
  let chosen = variants.find(v => v.id === p.id) || variants[0] || p, qty = 1;
  const isHoneyOrPollen = ['Miel','Polen'].includes(p.category);
  root.innerHTML = `<div class="detail-image glass"><img src="${p.image}" alt="${p.name}" onerror="this.onerror=null;this.src='./assets/honey.jpg'"></div>
  <section class="detail-panel glass"><span class="tag" style="position:static;display:inline-block">${p.category}</span>
    <h1>${p.name}</h1><p style="color:var(--muted)">${p.description}</p>
    <div class="detail-price" id="detail-price">${money(chosen.price)}</div>
    <div class="stock ok">● Disponible para pedido · confirmar por WhatsApp</div>
    <h4>Presentación</h4><div class="options">${variants.map((v,i)=>`<button class="option ${v.id===chosen.id?'active':''}" type="button" data-variant="${v.id}">${v.size}<br><small>${money(v.price)}</small></button>`).join('')}</div>
    ${p.category==='Miel' ? `<div class="product-label-info"><strong>Información para la etiqueta</strong><p>Contenido neto: según presentación (${chosen.size}). Tipo de producto: miel de abeja. Fecha de envasado: indicada en el lote/etiqueta física al preparar el pedido.</p><p><strong>Perfil floral:</strong> puede variar según la temporada y la floración del apiario. Consulta por el lote disponible para conocer su origen confirmado.</p></div>` : `<div class="product-label-info"><strong>Información del producto</strong><p>Tipo: ${p.category}. Contenido/presentación: ${chosen.size}. Fecha de envasado: se consignará en la etiqueta física al preparar el pedido.</p></div>`}
    <div class="qty-row"><div class="qty"><button id="minus">−</button><strong id="qty">1</strong><button id="plus">+</button></div><button id="add-detail" class="primary-btn" style="flex:1">Agregar al carrito</button></div>
    <div class="info-grid" style="grid-template-columns:1fr 1fr"><div class="info-card" style="padding:15px"><h4>Ingredientes claros</h4><p>Consulta la información del lote y su presentación.</p></div><div class="info-card" style="padding:15px"><h4>Origen local</h4><p>Producción con identidad y atención cercana.</p></div></div>
    <div class="code-panel" style="padding:16px;margin-top:16px"><h4>Un beneficio para tu próxima compra</h4><p>Revisa la ruleta de bienvenida y tus códigos de descuento o referidos en Mi cuenta. Los códigos no son acumulables.</p><a class="secondary-btn" href="contacto.html">Ver mis códigos →</a></div>
  </section>`;
  const qtyEl = root.querySelector('#qty');
  root.querySelectorAll('[data-variant]').forEach(btn => btn.onclick = () => { chosen = productById(btn.dataset.variant); root.querySelectorAll('[data-variant]').forEach(b=>b.classList.toggle('active',b===btn)); root.querySelector('#detail-price').textContent = money(chosen.price); const im=root.querySelector('.detail-image img'); im.src=chosen.image; });
  root.querySelector('#minus').onclick = () => { qty = Math.max(1, qty-1); qtyEl.textContent = qty; };
  root.querySelector('#plus').onclick = () => { qty += 1; qtyEl.textContent = qty; };
  root.querySelector('#add-detail').onclick = () => addToCart(chosen.id, qty);
  const related = PRODUCTS.filter(v=>v.category!==p.category).slice(0,3);
  const rec = document.createElement('section'); rec.className='section'; rec.innerHTML=`<div class="section-head"><div><h2>También podría gustarte</h2><p>Completa tu selección con otros favoritos de la colmena.</p></div></div><div class="product-grid">${related.map(v=>`<article class="product-card glass"><a class="product-image" href="producto.html?id=${v.id}"><img src="${v.image}" alt="${v.name}"><span class="tag">${v.category}</span></a><div class="product-body"><h3>${v.name}</h3><p>${v.size}</p><div class="price-row"><span class="price">${money(v.price)}</span><button class="add-btn" onclick="addToCart('${v.id}')">＋</button></div></div></article>`).join('')}</div><p class="small-note">Combo sugerido: elige dos productos y consulta por WhatsApp si hay una promoción vigente. Los descuentos se confirman antes del pago.</p>`;
  root.after(rec);
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


function applyDiscountCode() {
  const input = document.querySelector('#discount-code');
  const feedback = document.querySelector('#discount-feedback');
  const code = (input?.value || '').trim().toUpperCase();
  if (!DISCOUNTS[code]) { if (feedback) feedback.textContent = 'Ese código no está disponible. Revisa la sección Mis promociones.'; return; }
  localStorage.setItem(DISCOUNT_KEY, JSON.stringify({code}));
  saveCodes([...getCodes(), code]);
  if (feedback) feedback.textContent = `¡Código ${code} aplicado! Se usará solo este descuento en el pedido.`;
  renderCart(); renderAccountCodes();
}
function removeDiscountCode() { localStorage.removeItem(DISCOUNT_KEY); const f=document.querySelector('#discount-feedback'); if(f) f.textContent='Código retirado. Puedes aplicar otro, pero no se acumulan.'; renderCart(); }
function renderAccountCodes() {
  const el=document.querySelector('#account-codes'); if(!el) return;
  const codes=[...new Set([...getCodes(),'API10','API5','APIREFERIDO'])];
  el.innerHTML=codes.map(code=>`<div class="code-pill">${code} · ${DISCOUNTS[code].percent}% de descuento <button type="button" class="secondary-btn" style="float:right;padding:5px 9px" onclick="location.href='carrito.html?codigo=${code}'">Usar</button></div>`).join('')+'<p class="small-note">Cada código se aplica por separado. No acumulable con otros códigos ni promociones.</p>';
}
function setupDiscountQuery() {
  const code=new URLSearchParams(location.search).get('codigo');
  if(code && DISCOUNTS[code]) { localStorage.setItem(DISCOUNT_KEY,JSON.stringify({code})); saveCodes([...getCodes(),code]); }
}
function setupWelcomeWheel() {
  if (localStorage.getItem(WHEEL_KEY)) return;
  const overlay=document.createElement('div'); overlay.className='wheel-overlay'; overlay.id='welcome-wheel';
  overlay.innerHTML=`<div class="wheel-card" role="dialog" aria-modal="true" aria-labelledby="wheel-title"><button type="button" aria-label="Cerrar" id="wheel-close" style="float:right;border:0;background:transparent;font-size:24px">×</button><p class="eyebrow">BIENVENIDO A FACTOR API</p><h2 id="wheel-title">Una sorpresa para tu primera visita</h2><div class="wheel-graphic">10% OFF</div><p>¡Tu premio está asegurado! Usa tu código de bienvenida para obtener un 10% de descuento en tu pedido.</p><div class="wheel-code">API10</div><button type="button" class="primary-btn" id="wheel-claim">Guardar mi descuento</button><p class="small-note">Código no acumulable. Descuento aplicado al subtotal de productos.</p></div>`;
  document.body.appendChild(overlay); requestAnimationFrame(()=>overlay.classList.add('show'));
  const close=()=>{localStorage.setItem(WHEEL_KEY,'1');overlay.classList.remove('show');setTimeout(()=>overlay.remove(),250)};
  overlay.querySelector('#wheel-close').onclick=close;
  overlay.querySelector('#wheel-claim').onclick=()=>{saveCodes([...getCodes(),'API10']);localStorage.setItem(DISCOUNT_KEY,JSON.stringify({code:'API10'}));toast('¡Premio guardado!','API10 te da 10% de descuento. No acumulable.');close();renderCart();renderAccountCodes();};
}

document.addEventListener('DOMContentLoaded', () => {
  setupDiscountQuery(); cartCount(); setupStore(); setupProduct(); renderCart(); renderAccountCodes(); setupWelcomeWheel();
  const year = document.querySelector('#year'); if (year) year.textContent = new Date().getFullYear();
});
