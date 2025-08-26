
/* MercadoAmigo - Demo SPA (sin backend) */
const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));

const state = {
  products: [],
  cart: JSON.parse(localStorage.getItem("MA_CART") || "[]"),
  orders: JSON.parse(localStorage.getItem("MA_ORDERS") || "[]"),
  query: "",
  category: "todos",
  sort: "relevance"
};

const PRODUCTS = [
  {id:1, title:"Auriculares Bluetooth X10", price:119900, img:"assets/prod_1.png", category:"audio", condition:"nuevo", stock:24, rating:4.6, sold:312, shipping:"Gratis"},
  {id:2, title:"Smartwatch Deportivo Pro", price:249900, img:"assets/prod_2.png", category:"wearables", condition:"nuevo", stock:12, rating:4.4, sold:201, shipping:"Full"},
  {id:3, title:"Teclado Mecánico RGB Blue", price:199900, img:"assets/prod_3.png", category:"perifericos", condition:"nuevo", stock:18, rating:4.8, sold:520, shipping:""},
  {id:4, title:"Mouse Inalámbrico Silent 2.4G", price:69900, img:"assets/prod_4.png", category:"perifericos", condition:"nuevo", stock:40, rating:4.2, sold:189, shipping:"Gratis"},
  {id:5, title:"Cámara Web HD 1080p", price:149900, img:"assets/prod_5.png", category:"streaming", condition:"nuevo", stock:22, rating:4.3, sold:278, shipping:""},
  {id:6, title:"Parlante Portátil 20W", price:179900, img:"assets/prod_6.png", category:"audio", condition:"nuevo", stock:30, rating:4.5, sold:410, shipping:"Full"},
  {id:7, title:"Monitor 24\" IPS 75Hz", price:599900, img:"assets/prod_7.png", category:"monitores", condition:"nuevo", stock:9, rating:4.7, sold:133, shipping:""},
  {id:8, title:"Disco SSD 1TB NVMe", price:329900, img:"assets/prod_8.png", category:"almacenamiento", condition:"nuevo", stock:14, rating:4.9, sold:620, shipping:"Full"},
  {id:9, title:"Silla Gamer Ergonómica", price:799900, img:"assets/prod_9.png", category:"hogar", condition:"nuevo", stock:7, rating:4.1, sold:96, shipping:""},
  {id:10, title:"Micrófono USB Condenser", price:229900, img:"assets/prod_10.png", category:"streaming", condition:"nuevo", stock:16, rating:4.4, sold:254, shipping:"Gratis"}
];

const CATEGORIES = [
  {id:"todos", label:"Todos"},
  {id:"audio", label:"Audio"},
  {id:"wearables", label:"Wearables"},
  {id:"perifericos", label:"Periféricos"},
  {id:"streaming", label:"Streaming"},
  {id:"monitores", label:"Monitores"},
  {id:"almacenamiento", label:"Almacenamiento"},
  {id:"hogar", label:"Hogar"}
];

/* Utils */
const money = n => n.toLocaleString("es-CO", {style:"currency", currency:"COP", maximumFractionDigits:0});
const save = () => {
  localStorage.setItem("MA_CART", JSON.stringify(state.cart));
  localStorage.setItem("MA_ORDERS", JSON.stringify(state.orders));
  updateCartCount();
};
const toast = (msg) => {
  let t = $(".toast");
  if(!t){
    t = document.createElement("div");
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("toast--show");
  setTimeout(() => t.classList.remove("toast--show"), 1600);
};

function updateCartCount(){
  $("#cartCount").textContent = state.cart.reduce((a,i)=>a+i.qty,0);
}

/* Routing */
const routes = {
  "/": renderHome,
  "/search": renderSearch,
  "/product": renderProduct,
  "/cart": renderCart,
  "/checkout": renderCheckout,
  "/orders": renderOrders,
  "/legal": renderLegal
};

function navigate(path){
  location.hash = path;
}

window.addEventListener("hashchange", () => router());
document.addEventListener("DOMContentLoaded", () => {
  $("#year").textContent = new Date().getFullYear();
  state.products = PRODUCTS;
  updateCartCount();

  $("#searchForm").addEventListener("submit", (e)=>{
    e.preventDefault();
    state.query = $("#searchInput").value.trim();
    navigate("/search");
  });

  router();
});

function router(){
  const hash = location.hash.slice(1) || "/";
  const [path, query] = hash.split("?");
  const app = $("#app");
  app.innerHTML = "";
  const fn = routes[path] || renderNotFound;
  fn(app, parseQuery(query || ""));
  // Accesibilidad: enfocar main
  app.setAttribute("tabindex","-1");
  app.focus();
}

function parseQuery(qs){
  return Object.fromEntries(new URLSearchParams(qs));
}

/* Components */
function ProductCard(p){
  const el = document.createElement("article");
  el.className = "card";
  el.innerHTML = `
    <img class="card__img" src="${p.img}" alt="${p.title}">
    <div class="card__body">
      <div class="price">${money(p.price)}</div>
      <a href="#/product?id=${p.id}">${p.title}</a>
      <div class="small">${p.sold} vendidos • ⭐ ${p.rating}</div>
      <button class="btn btn--full">Agregar al carrito</button>
    </div>
  `;
  $("button", el).addEventListener("click", () => {
    addToCart(p.id);
    toast("Agregado al carrito");
  });
  return el;
}

function addToCart(id, qty=1){
  const p = state.products.find(x=>x.id==id);
  if(!p) return;
  const item = state.cart.find(x=>x.id==id);
  if(item){ item.qty += qty; }
  else { state.cart.push({id, qty}); }
  save();
}

function removeFromCart(id){
  state.cart = state.cart.filter(x=>x.id!=id);
  save();
}

function setQty(id, qty){
  const item = state.cart.find(x=>x.id==id);
  if(!item) return;
  item.qty = Math.max(1, qty|0);
  save();
}

/* Views */
function renderHome(root){
  const hero = document.createElement("section");
  hero.className = "hero";
  hero.innerHTML = `
    <div class="hero__img">🛍️</div>
    <div class="hero__text">
      <h2 class="hero__title">¡Ofertas que te acompañan!</h2>
      <p class="small">Explora tecnología, accesorios y más con envíos rápidos simulados.</p>
      <div style="display:flex; gap:8px; margin-top:8px">
        <a class="btn" href="#/search">Ver productos</a>
        <a class="btn btn--ghost" href="#/orders">Mis pedidos</a>
      </div>
    </div>
  `;
  root.appendChild(hero);

  const cats = document.createElement("div");
  cats.className = "categories";
  CATEGORIES.forEach(c=>{
    const chip = document.createElement("button");
    chip.className = "chip" + (c.id===state.category?" chip--active":"");
    chip.textContent = c.label;
    chip.addEventListener("click", ()=>{
      state.category = c.id;
      renderSearch(root, {});
      navigate("/search");
    });
    cats.appendChild(chip);
  });
  root.appendChild(cats);

  const grid = document.createElement("section");
  grid.className = "grid";
  // show 8
  state.products.slice(0,8).forEach(p=>grid.appendChild(ProductCard(p)));
  root.appendChild(grid);
}

function applyFilters(list){
  let out = list;
  if(state.query){
    const q = state.query.toLowerCase();
    out = out.filter(p => p.title.toLowerCase().includes(q));
  }
  if(state.category !== "todos"){
    out = out.filter(p => p.category === state.category);
  }
  switch(state.sort){
    case "price_asc": out = out.slice().sort((a,b)=>a.price-b.price); break;
    case "price_desc": out = out.slice().sort((a,b)=>b.price-a.price); break;
    case "rating": out = out.slice().sort((a,b)=>b.rating-a.rating); break;
    default: /* relevance */ break;
  }
  return out;
}

function renderSearch(root){
  const toolbar = document.createElement("div");
  toolbar.className = "toolbar";
  toolbar.innerHTML = `
    <div class="small">Resultados ${state.query?`para "<b>${state.query}</b>"`:""}</div>
    <select class="sort" id="sortSelect">
      <option value="relevance">Relevancia</option>
      <option value="price_asc">Precio: menor a mayor</option>
      <option value="price_desc">Precio: mayor a menor</option>
      <option value="rating">Mejor calificados</option>
    </select>
  `;
  root.appendChild(toolbar);
  $("#sortSelect").value = state.sort;
  $("#sortSelect").addEventListener("change", e => {
    state.sort = e.target.value;
    navigate("/search");
  });

  const grid = document.createElement("section");
  grid.className = "grid";
  applyFilters(state.products).forEach(p=>grid.appendChild(ProductCard(p)));
  root.appendChild(grid);
}

function renderProduct(root, params){
  const id = Number(params.id);
  const p = state.products.find(x=>x.id===id);
  if(!p){ renderNotFound(root); return; }

  const section = document.createElement("section");
  section.className = "page";
  section.innerHTML = `
    <div class="row">
      <div class="content" style="flex:1.2">
        <img src="${p.img}" alt="${p.title}" style="width:100%;max-width:520px;border-radius:12px;box-shadow:var(--shadow);background:#fff" />
      </div>
      <aside class="sidebar">
        <div class="small">${p.condition} | ${p.sold} vendidos</div>
        <h2 style="margin:.2em 0 0 0">${p.title}</h2>
        <div class="price" style="margin:8px 0">${money(p.price)}</div>
        <div class="small">⭐ ${p.rating} • Envío: ${p.shipping || "Económico"}</div>
        <div class="field">
          <label class="label">Cantidad</label>
          <input id="qty" class="input" type="number" min="1" value="1"/>
        </div>
        <button id="addBtn" class="btn btn--ok btn--full">Agregar al carrito</button>
        <button id="buyBtn" class="btn btn--warn btn--full">Comprar ahora</button>
        <div class="small" style="margin-top:8px">⚠️ Sitio de demostración. No hay pagos reales.</div>
      </aside>
    </div>
    <section class="card" style="padding:14px">
      <h3>Descripción</h3>
      <p>Producto de ejemplo para demostración. Incluye especificaciones y beneficios simulados.</p>
      <ul>
        <li>Categoría: ${p.category}</li>
        <li>Garantía: 12 meses (simulada)</li>
        <li>Stock: ${p.stock} unidades</li>
      </ul>
    </section>
  `;
  root.appendChild(section);

  $("#addBtn").addEventListener("click", ()=>{
    const qty = Number($("#qty").value) || 1;
    addToCart(p.id, qty);
    toast("Agregado al carrito");
  });
  $("#buyBtn").addEventListener("click", ()=>{
    const qty = Number($("#qty").value) || 1;
    addToCart(p.id, qty);
    navigate("/checkout");
  });
}

function renderCart(root){
  const section = document.createElement("section");
  section.className = "page";
  section.innerHTML = `<h2>Carrito</h2>`;
  root.appendChild(section);

  if(state.cart.length === 0){
    const empty = document.createElement("div");
    empty.className = "card";
    empty.style.padding = "18px";
    empty.innerHTML = `<p>Tu carrito está vacío.</p><a class="btn" href="#/search">Explorar productos</a>`;
    root.appendChild(empty);
    return;
  }

  const table = document.createElement("table");
  table.className = "table";
  table.innerHTML = `
    <thead><tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th></th></tr></thead>
    <tbody></tbody>
  `;
  const tbody = $("tbody", table);
  let total = 0;
  state.cart.forEach(item=>{
    const p = state.products.find(x=>x.id===item.id);
    const tr = document.createElement("tr");
    const subtotal = p.price * item.qty;
    total += subtotal;
    tr.innerHTML = `
      <td><a href="#/product?id=${p.id}">${p.title}</a></td>
      <td>${money(p.price)}</td>
      <td><input type="number" min="1" value="${item.qty}" style="width:70px" /></td>
      <td>${money(subtotal)}</td>
      <td><button class="btn btn--danger">Eliminar</button></td>
    `;
    $("input", tr).addEventListener("change", e=>{
      setQty(item.id, Number(e.target.value));
      renderCart(root);
    });
    $("button", tr).addEventListener("click", ()=>{
      removeFromCart(item.id);
      renderCart(root);
    });
    tbody.appendChild(tr);
  });
  root.appendChild(table);

  const summary = document.createElement("div");
  summary.className = "card";
  summary.style.padding = "18px";
  summary.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center">
      <strong>Total</strong><div class="price">${money(total)}</div>
    </div>
    <div style="display:flex;gap:8px;margin-top:10px">
      <a class="btn btn--ghost" href="#/search">Seguir comprando</a>
      <a class="btn btn--ok" href="#/checkout">Continuar</a>
    </div>
  `;
  root.appendChild(summary);
}

function renderCheckout(root){
  const section = document.createElement("section");
  section.className = "page";
  section.innerHTML = `<h2>Finalizar compra</h2>`;
  root.appendChild(section);

  if(state.cart.length === 0){
    const info = document.createElement("div");
    info.className = "card";
    info.style.padding = "18px";
    info.innerHTML = `<p>No hay productos en el carrito.</p><a class="btn" href="#/search">Explorar productos</a>`;
    root.appendChild(info);
    return;
  }

  const form = document.createElement("form");
  form.className = "row";
  form.innerHTML = `
    <div class="content">
      <div class="card" style="padding:14px">
        <h3>Datos de envío</h3>
        <div class="field"><label class="label">Nombre completo</label><input class="input" required></div>
        <div class="field"><label class="label">Documento</label><input class="input" required></div>
        <div class="field"><label class="label">Dirección</label><input class="input" required></div>
        <div class="field"><label class="label">Ciudad</label><input class="input" required></div>
        <div class="field"><label class="label">Teléfono</label><input class="input" required></div>
      </div>
      <div class="card" style="padding:14px">
        <h3>Pago (simulado)</h3>
        <div class="field"><label class="label">Número de tarjeta</label><input class="input" required placeholder="4111 1111 1111 1111" maxlength="19"></div>
        <div style="display:flex; gap:10px">
          <div class="field" style="flex:1"><label class="label">Vencimiento</label><input class="input" required placeholder="MM/AA" maxlength="5"></div>
          <div class="field" style="flex:1"><label class="label">CVV</label><input class="input" required placeholder="123" maxlength="3"></div>
        </div>
        <p class="small">⚠️ Simulación: no se procesa ningún pago real.</p>
      </div>
    </div>
    <aside class="sidebar">
      <h3>Resumen</h3>
      <div id="checkoutSummary"></div>
      <button class="btn btn--ok btn--full" type="submit">Pagar ahora (demo)</button>
    </aside>
  `;
  root.appendChild(form);

  // summary
  const sum = $("#checkoutSummary");
  let total = 0;
  state.cart.forEach(item=>{
    const p = state.products.find(x=>x.id===item.id);
    const li = document.createElement("div");
    li.style.display="flex"; li.style.justifyContent="space-between"; li.style.margin="6px 0";
    li.innerHTML = `<span>${p.title} x${item.qty}</span><strong>${money(p.price*item.qty)}</strong>`;
    total += p.price*item.qty;
    sum.appendChild(li);
  });
  const ship = Math.min(20000, Math.round(total*0.05));
  const totalAll = total + ship;
  const footer = document.createElement("div");
  footer.style.marginTop="10px";
  footer.innerHTML = `
    <div class="small" style="display:flex;justify-content:space-between"><span>Envío</span><span>${money(ship)}</span></div>
    <div style="display:flex;justify-content:space-between;margin-top:6px"><strong>Total</strong><div class="price">${money(totalAll)}</div></div>
  `;
  sum.appendChild(footer);

  form.addEventListener("submit", e=>{
    e.preventDefault();
    // "procesa" orden
    const order = {
      id: "MA" + Date.now(),
      date: new Date().toISOString(),
      items: state.cart.map(({id, qty}) => ({id, qty})),
      total: totalAll,
      status: "Pago aprobado (simulado)"
    };
    state.orders.unshift(order);
    state.cart = [];
    save();
    navigate("/orders");
    toast("¡Gracias por tu compra (demo)!");
  });
}

function renderOrders(root){
  const section = document.createElement("section");
  section.className = "page";
  section.innerHTML = `<h2>Mis pedidos</h2>`;
  root.appendChild(section);

  if(state.orders.length===0){
    const info = document.createElement("div");
    info.className = "card"; info.style.padding="18px";
    info.innerHTML = `<p>No tienes pedidos aún.</p><a class="btn" href="#/search">Empezar a comprar</a>`;
    root.appendChild(info);
    return;
  }

  const table = document.createElement("table");
  table.className = "table";
  table.innerHTML = `<thead><tr><th>Pedido</th><th>Fecha</th><th>Estado</th><th>Total</th></tr></thead><tbody></tbody>`;
  const tbody = $("tbody", table);
  state.orders.forEach(o=>{
    const tr = document.createElement("tr");
    const d = new Date(o.date);
    tr.innerHTML = `<td>${o.id}</td><td>${d.toLocaleString("es-CO")}</td><td>${o.status}</td><td>${money(o.total)}</td>`;
    tbody.appendChild(tr);
  });
  root.appendChild(table);
}

function renderLegal(root){
  const card = document.createElement("div");
  card.className = "card"; card.style.padding = "18px";
  card.innerHTML = `
    <h2>Aviso legal</h2>
    <p>Este proyecto es una <strong>demostración</strong> para uso personal o profesional. No está afiliado a empresas reales ni utiliza marcas registradas. 
    Los nombres, logotipos y colores han sido modificados para evitar confusión.</p>
  `;
  root.appendChild(card);
}

function renderNotFound(root){
  const card = document.createElement("div");
  card.className = "card"; card.style.padding = "18px";
  card.innerHTML = `<h2>Página no encontrada</h2><a class="btn" href="#/">Ir al inicio</a>`;
  root.appendChild(card);
}
