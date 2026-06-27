'use strict';
/* ═══════════════════════════════════════════════════════════
   NARDOS ONE STOP SHOP — UWI Campus
   24/7 Student Ordering System
   Demo Mode — localStorage + BroadcastChannel for real-time sync
═══════════════════════════════════════════════════════════ */

const DELIVERY_FEE = 200; // JMD

const DEMO_MENU = {
  restaurant: {
    name: "Nardos One Stop Shop",
    tagline: "UWI's 24/7 Campus Kitchen",
    location: "UWI Mona Campus",
    currency: "JMD"
  },

  categories: [
    { id: "burgers",   name: "Burgers",       icon: "🍔", description: "Done to order, your way" },
    { id: "hotdogs",   name: "Hot Dogs",       icon: "🌭", description: "Loaded and sauced up" },
    { id: "fries",     name: "Fries & Sides",  icon: "🍟", description: "Crispy every time" },
    { id: "snacks",    name: "Snacks",         icon: "🍿", description: "Quick bites for late nights" },
    { id: "meals",     name: "Cooked Meals",   icon: "🍽️", description: "Done to order comfort food" },
    { id: "beverages", name: "Beverages",      icon: "🧃", description: "Cold drinks & hot ones" }
  ],

  menuItems: [
    // ── BURGERS ──
    { id:"bg1", category:"burgers", name:"Classic Beef Burger",     description:"Quarter-pound beef patty, lettuce, tomato, onion, pickles, our special sauce. Done fresh on order.",                   price:950,  available:true, prepMins:10, tags:["Popular","Student Fave"] },
    { id:"bg2", category:"burgers", name:"Double Stack Burger",      description:"Two beef patties, double cheese, caramelised onions, jalapeños. The late-night special.",                              price:1350, available:true, prepMins:12, tags:["Best Seller","Big"] },
    { id:"bg3", category:"burgers", name:"Chicken Burger",           description:"Crispy fried chicken thigh, coleslaw, hot sauce, brioche bun. Juicy every time.",                                      price:900,  available:true, prepMins:10, tags:["Popular"] },
    { id:"bg4", category:"burgers", name:"Spicy Jerk Burger",        description:"Jerk-marinated beef patty, pepper jack cheese, scotch bonnet mayo, toasted bun.",                                      price:1050, available:true, prepMins:12, tags:["Spicy","Caribbean"] },
    { id:"bg5", category:"burgers", name:"Cheese Burger",            description:"Classic beef patty with double American cheese, mustard, ketchup, pickles.",                                            price:850,  available:true, prepMins:8,  tags:["Simple","Classic"] },

    // ── HOT DOGS ──
    { id:"hd1", category:"hotdogs", name:"Classic Hot Dog",          description:"All-beef frank in a steamed bun with mustard, ketchup, and relish.",                                                   price:550,  available:true, prepMins:5,  tags:["Quick","Classic"] },
    { id:"hd2", category:"hotdogs", name:"Loaded Hot Dog",           description:"All-beef frank with cheese sauce, crispy fried onions, jalapeños, and bacon bits.",                                    price:750,  available:true, prepMins:6,  tags:["Popular","Loaded"] },
    { id:"hd3", category:"hotdogs", name:"Jerk Hot Dog",             description:"All-beef frank marinated in jerk seasoning, topped with mango slaw and scotch bonnet drizzle.",                        price:700,  available:true, prepMins:6,  tags:["Caribbean","Spicy"] },

    // ── FRIES & SIDES ──
    { id:"fr1", category:"fries", name:"Regular Fries",              description:"Golden crispy fries, lightly salted. Perfect every time.",                                                              price:350,  available:true, prepMins:6,  tags:["Essential"] },
    { id:"fr2", category:"fries", name:"Seasoned Fries",             description:"Fries tossed in our house seasoning blend — garlic, paprika, and a hint of jerk.",                                     price:400,  available:true, prepMins:6,  tags:["Popular","Flavourful"] },
    { id:"fr3", category:"fries", name:"Loaded Cheese Fries",        description:"Crispy fries smothered in cheese sauce, bacon bits, and spring onion.",                                                price:650,  available:true, prepMins:8,  tags:["Indulgent","Popular"] },
    { id:"fr4", category:"fries", name:"Sweet Potato Fries",         description:"Thin-cut sweet potato fries with a chipotle dipping sauce.",                                                           price:450,  available:true, prepMins:8,  tags:["Healthy-ish"] },
    { id:"fr5", category:"fries", name:"Onion Rings (6 pcs)",        description:"Beer-battered onion rings, crispy and golden. Served with ranch.",                                                     price:400,  available:true, prepMins:7,  tags:["Classic"] },
    { id:"fr6", category:"fries", name:"Coleslaw",                   description:"Creamy homemade coleslaw. Great with everything.",                                                                      price:200,  available:true, prepMins:2,  tags:["Side"] },

    // ── SNACKS ──
    { id:"sn1", category:"snacks", name:"Cheese Sticks (4 pcs)",     description:"Mozzarella sticks, golden fried, with marinara dipping sauce.",                                                        price:450,  available:true, prepMins:6,  tags:["Popular","Snack"] },
    { id:"sn2", category:"snacks", name:"Chicken Wings (5 pcs)",     description:"Crispy chicken wings — choose plain, BBQ, or buffalo. Served with blue cheese dip.",                                   price:800,  available:true, prepMins:12, tags:["Popular","Choice"] },
    { id:"sn3", category:"snacks", name:"Nachos",                    description:"Tortilla chips with melted cheese, jalapeños, sour cream, and salsa.",                                                 price:550,  available:true, prepMins:7,  tags:["Shareable","Snack"] },
    { id:"sn4", category:"snacks", name:"Bag Chips (Assorted)",       description:"Choose from BBQ, Salt & Vinegar, Cheese & Onion. Local and imported brands.",                                          price:150,  available:true, prepMins:1,  tags:["Quick","Packaged"] },
    { id:"sn5", category:"snacks", name:"Bun & Cheese",              description:"Classic Jamaican spiced bun with a thick slice of cheddar cheese.",                                                    price:200,  available:true, prepMins:2,  tags:["Jamaican","Classic"] },
    { id:"sn6", category:"snacks", name:"Patty (Beef / Chicken / Veg)",description:"Fresh Tastee or National patties, plain or in coco bread. Student favourite since forever.",                          price:250,  available:true, prepMins:3,  tags:["Jamaican","Student Fave"] },

    // ── COOKED MEALS ──
    { id:"ml1", category:"meals", name:"Rice & Chicken",             description:"White or brown rice, stewed or fried chicken, with coleslaw. Done to order.",                                          price:850,  available:true, prepMins:15, tags:["Filling","Popular"] },
    { id:"ml2", category:"meals", name:"Pasta Bake",                 description:"Creamy pasta bake with chicken pieces, mixed vegetables and cheese on top. Baked fresh.",                              price:900,  available:true, prepMins:15, tags:["Student Fave","Comfort"] },
    { id:"ml3", category:"meals", name:"Jerk Chicken & Rice",        description:"Jerk chicken quarter, rice & peas, fried plantain. Campus comfort food.",                                               price:1100, available:true, prepMins:15, tags:["Popular","Caribbean"] },
    { id:"ml4", category:"meals", name:"Fried Chicken Meal",         description:"Two pieces crispy fried chicken with fries and a drink of your choice.",                                               price:1200, available:true, prepMins:15, tags:["Combo","Best Seller"] },
    { id:"ml5", category:"meals", name:"Vegetarian Stir Fry",        description:"Seasonal veggies stir-fried with soy sauce, garlic, served over rice.",                                                price:750,  available:true, prepMins:12, tags:["Healthy","Veg"] },

    // ── BEVERAGES ──
    { id:"bv1", category:"beverages", name:"Soft Drink (Canned)",    description:"Pepsi, Ting, Kola Champagne, Sprite, or Coke. Ice cold.",                                                             price:200,  available:true, prepMins:1,  tags:["Cold","Quick"] },
    { id:"bv2", category:"beverages", name:"Bottled Water",           description:"Chilled Wata or Aqua, still or sparkling.",                                                                            price:150,  available:true, prepMins:1,  tags:["Essential"] },
    { id:"bv3", category:"beverages", name:"Juice Box",              description:"Ribena, Capri-Sun, or local fruit juice. Sweet, cold, quick.",                                                          price:180,  available:true, prepMins:1,  tags:["Quick"] },
    { id:"bv4", category:"beverages", name:"Energy Drink",           description:"Red Bull, Monster, or Boom. Finals season survival kit.",                                                               price:450,  available:true, prepMins:1,  tags:["Popular","Finals Season"] },
    { id:"bv5", category:"beverages", name:"Homemade Lemonade",      description:"Fresh-squeezed lemonade, sweetened just right. Makes everything better.",                                               price:300,  available:true, prepMins:3,  tags:["Fresh","Popular"] },
    { id:"bv6", category:"beverages", name:"Hot Chocolate",          description:"Rich hot chocolate, perfect for late nights. Ask for extra marshmallows.",                                              price:350,  available:true, prepMins:4,  tags:["Hot","Late Night"] },
    { id:"bv7", category:"beverages", name:"Coffee",                 description:"Fresh brewed coffee — black, with milk, or sweetened. Keeps you going.",                                               price:300,  available:true, prepMins:4,  tags:["Hot","Essential"] }
  ]
};

/* ═══ HALLS ═══ */
const HALLS = [
  "Chancellor Hall", "Rex Nettleford Hall", "Taylor Hall",
  "Mary Seacole Hall", "Irvine Hall", "Val Hall",
  "Elsa Leo-Rhynie Hall", "Wolmer's Hall", "Off Campus"
];

/* ═══ BROADCAST CHANNEL for real-time cross-tab sync ═══ */
let bc;
try { bc = new BroadcastChannel('nardos_orders'); } catch(e) { bc = null; }

function broadcast(type, payload) {
  if (bc) bc.postMessage({ type, payload, ts: Date.now() });
}

/* ═══ STORAGE KEYS ═══ */
const SK = {
  orders:   'nardos_orders',
  menu:     'nardos_menu',
  student:  'nardos_student',
  queue:    'nardos_queue',
  settings: 'nardos_settings'
};

/* ═══ STORE ═══ */
const Store = {
  orders: [],
  menuItems: [...DEMO_MENU.menuItems],
  categories: [...DEMO_MENU.categories],
  queue: [],          // virtual line: [{id, name, hall, joinedAt, estimatedReady, served}]
  student: null,      // {name, hall, wantsDelivery}

  load() {
    try {
      const o = localStorage.getItem(SK.orders);
      if (o) this.orders = JSON.parse(o);
    } catch(e) { this.orders = []; }
    try {
      const m = localStorage.getItem(SK.menu);
      if (m) this.menuItems = JSON.parse(m);
    } catch(e) {}
    try {
      const q = localStorage.getItem(SK.queue);
      if (q) this.queue = JSON.parse(q);
    } catch(e) { this.queue = []; }
    try {
      const s = localStorage.getItem(SK.student);
      if (s) this.student = JSON.parse(s);
    } catch(e) {}
  },

  save() {
    localStorage.setItem(SK.orders,  JSON.stringify(this.orders));
    localStorage.setItem(SK.menu,    JSON.stringify(this.menuItems));
    localStorage.setItem(SK.queue,   JSON.stringify(this.queue));
    if (this.student) localStorage.setItem(SK.student, JSON.stringify(this.student));
  },

  setStudent(name, hall, wantsDelivery) {
    this.student = { name, hall, wantsDelivery };
    localStorage.setItem(SK.student, JSON.stringify(this.student));
  },

  getStudent() {
    if (this.student) return this.student;
    try {
      const s = localStorage.getItem(SK.student);
      if (s) { this.student = JSON.parse(s); return this.student; }
    } catch(e) {}
    return null;
  },

  getItemsByCategory(catId) {
    return this.menuItems.filter(i => i.category === catId && i.available);
  },

  getItem(id) {
    return this.menuItems.find(i => i.id === id);
  },

  createOrder(items, persons, notes, deliveryInfo) {
    // items: [{id, name, price, quantity, personName, notes}]
    const id = 'ORD-' + String(this.orders.length + 1).padStart(4, '0');
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const delivery = deliveryInfo?.wantsDelivery ? DELIVERY_FEE : 0;
    const total = subtotal + delivery;
    const prepMins = Math.max(...items.map(i => {
      const mi = this.getItem(i.id);
      return mi ? mi.prepMins || 10 : 10;
    }));

    const order = {
      id,
      student: this.student?.name || 'Guest',
      hall: this.student?.hall || '',
      wantsDelivery: deliveryInfo?.wantsDelivery || false,
      deliveryFee: delivery,
      items,
      persons: persons || [{ name: this.student?.name || 'Guest', items }],
      notes: notes || '',
      status: 'pending',   // pending → preparing → ready → served
      subtotal,
      total,
      prepMins,
      timerEnd: null,      // set by kitchen
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.orders.unshift(order);
    this.save();
    broadcast('new_order', order);
    return order;
  },

  updateOrderStatus(orderId, status, timerMins) {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return;
    order.status = status;
    order.updatedAt = new Date().toISOString();
    if (timerMins != null) {
      order.timerEnd = new Date(Date.now() + timerMins * 60000).toISOString();
      order.timerMins = timerMins;
    }
    this.save();
    broadcast('order_update', { orderId, status, timerEnd: order.timerEnd });
    return order;
  },

  // Virtual Queue
  joinQueue(name, hall, estimateMins) {
    const existing = this.queue.find(q => q.name === name && !q.served);
    if (existing) return existing;

    const entry = {
      id: 'Q-' + Date.now(),
      name,
      hall: hall || '',
      joinedAt: new Date().toISOString(),
      estimateMins: estimateMins || 10,
      estimatedReady: new Date(Date.now() + (estimateMins || 10) * 60000).toISOString(),
      served: false
    };
    this.queue.push(entry);
    this.save();
    broadcast('queue_update', this.queue);
    return entry;
  },

  getActiveQueue() {
    return this.queue.filter(q => !q.served);
  },

  markServed(queueId) {
    const entry = this.queue.find(q => q.id === queueId);
    if (entry) {
      entry.served = true;
      entry.servedAt = new Date().toISOString();
      this.save();
      broadcast('queue_update', this.queue);
    }
  },

  getQueuePosition(queueId) {
    const active = this.getActiveQueue();
    const idx = active.findIndex(q => q.id === queueId);
    return idx === -1 ? null : idx + 1;
  }
};

/* ═══ UTILITIES ═══ */
function formatPrice(n) {
  return 'J$' + Number(n).toLocaleString('en-JM', { minimumFractionDigits: 0 });
}

function escapeHtml(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function timeAgo(iso) {
  const secs = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (secs < 60) return 'just now';
  if (secs < 3600) return Math.floor(secs/60) + 'm ago';
  return Math.floor(secs/3600) + 'h ago';
}

function showToast(msg, type='success') {
  const tc = document.getElementById('toast-container');
  if (!tc) return;
  const t = document.createElement('div');
  t.className = 'toast toast-' + type;
  t.textContent = msg;
  tc.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 3000);
}

/* ═══ CART (session only) ═══ */
const Cart = {
  persons: [{ name: '', items: [] }], // [{name, items: [{id,name,price,qty,notes}]}]
  notes: '',
  wantsDelivery: false,

  get totalItems() {
    return this.persons.reduce((s, p) => s + p.items.reduce((ss, i) => ss + i.qty, 0), 0);
  },

  get subtotal() {
    return this.persons.reduce((s, p) =>
      s + p.items.reduce((ss, i) => ss + i.price * i.qty, 0), 0);
  },

  get total() {
    return this.subtotal + (this.wantsDelivery ? DELIVERY_FEE : 0);
  },

  addItem(personIdx, item, qty=1, notes='') {
    const p = this.persons[personIdx];
    const existing = p.items.find(i => i.id === item.id && i.notes === notes);
    if (existing) { existing.qty += qty; }
    else { p.items.push({ id: item.id, name: item.name, price: item.price, qty, notes }); }
    if (typeof updateCartBadge === 'function') updateCartBadge();
  },

  removeItem(personIdx, itemId) {
    const p = this.persons[personIdx];
    p.items = p.items.filter(i => i.id !== itemId);
    if (typeof updateCartBadge === 'function') updateCartBadge();
  },

  addPerson(name) {
    this.persons.push({ name, items: [] });
  },

  setPersonName(idx, name) {
    if (this.persons[idx]) this.persons[idx].name = name;
  },

  flatten() {
    // Returns flat items list with personName
    return this.persons.flatMap(p =>
      p.items.map(i => ({ ...i, personName: p.name || 'Me' }))
    );
  },

  clear() {
    this.persons = [{ name: Store.student?.name || '', items: [] }];
    this.notes = '';
    this.wantsDelivery = false;
    if (typeof updateCartBadge === 'function') updateCartBadge();
  }
};

/* ═══ TOUR ═══ */
const Tour = {
  steps: {
    welcome: [
      { title: "Welcome to Nardos! 👋", body: "UWI's favourite 24/7 stop — burgers, meals, snacks, drinks, done to order. This quick tour shows you around in seconds." },
      { title: "Your Info", body: "Enter your name so Nardos knows who's ordering. If you want delivery to your hall, toggle it on and pick your hall — there's a small J$200 fee." },
      { title: "Start Ordering", body: "Hit 'Let's Eat' and you're straight into the menu. Everything is done fresh, right when you order it." }
    ],
    menu: [
      { title: "The Menu", body: "Browse by category — Burgers, Hot Dogs, Fries, Snacks, Meals, Beverages. Tap any tab to switch instantly." },
      { title: "Adding to Your Order", body: "Tap any item to add it. Hit '+' or '−' to change quantity. You can also add a note (e.g. 'no onions') on each item." },
      { title: "Group Ordering", body: "Ordering with friends? Tap 'Add Person' to split the order — each person's items are tracked separately so you know who got what." },
      { title: "Virtual Line", body: "See the live queue before you order. You can join the line and check your spot — so you know exactly when to walk down." },
      { title: "Checkout", body: "When you're ready, tap the cart. Review your order, add notes, choose pickup or delivery, then confirm. Nardos gets your order instantly." }
    ],
    status: [
      { title: "Your Order Status", body: "This page updates live. You'll see: Received → Preparing → Ready. When it's ready, head to Nardos or wait for delivery." },
      { title: "Timer", body: "When Nardos starts making your order, a countdown appears here. You'll know exactly when to leave your room." },
      { title: "Queue Position", body: "Your position in the virtual line is shown here. As orders get served, you move up automatically." }
    ],
    kitchen: [
      { title: "Kitchen View", body: "This is Nardos' screen. Every new order appears here as a card — live, no refresh needed." },
      { title: "Managing Orders", body: "Tap 'Start Preparing' when you begin an order. Set a timer — students see it on their phones. Tap 'Ready' when done." },
      { title: "The Queue", body: "The virtual line is on the right. Mark customers as served when they collect — the line updates in real time." }
    ]
  },

  init(page) {
    const steps = this.steps[page];
    if (!steps) return;

    // Auto-show on first visit
    const key = 'nardos_tour_' + page;
    const shown = localStorage.getItem(key);

    const btn = document.getElementById('tour-btn');
    if (btn) btn.addEventListener('click', () => this.show(steps, key));

    if (!shown) {
      setTimeout(() => this.show(steps, key), 800);
    }
  },

  show(steps, key) {
    localStorage.setItem(key, '1');
    let idx = 0;

    const overlay = document.createElement('div');
    overlay.className = 'tour-overlay';

    const render = () => {
      const s = steps[idx];
      overlay.innerHTML = `
        <div class="tour-modal">
          <div class="tour-header">
            <div class="tour-logo">N</div>
            <div class="tour-step-count">${idx + 1} of ${steps.length}</div>
          </div>
          <div class="tour-dots">
            ${steps.map((_, i) => `<div class="tour-dot ${i === idx ? 'active' : ''}"></div>`).join('')}
          </div>
          <h2 class="tour-title">${s.title}</h2>
          <p class="tour-body">${s.body}</p>
          <div class="tour-actions">
            <button class="tour-skip" id="tour-skip">Skip tour</button>
            <div class="tour-nav">
              ${idx > 0 ? `<button class="tour-prev" id="tour-prev">Back</button>` : ''}
              <button class="tour-next" id="tour-next">${idx === steps.length - 1 ? "Let's go!" : 'Next'}</button>
            </div>
          </div>
        </div>
      `;
      document.getElementById('tour-next').onclick = () => {
        if (idx < steps.length - 1) { idx++; render(); }
        else overlay.remove();
      };
      const prev = document.getElementById('tour-prev');
      if (prev) prev.onclick = () => { idx--; render(); };
      document.getElementById('tour-skip').onclick = () => overlay.remove();
      overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    };

    render();
    document.body.appendChild(overlay);
  }
};
