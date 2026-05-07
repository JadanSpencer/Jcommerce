'use strict';
/* ═══════════════════════════════════════════════════════════
   NOLA'S EVENTS — Core Application Logic
   Fine Dining · Luana, St. Elizabeth, Jamaica
   Demo Mode — All data is local (localStorage)
═══════════════════════════════════════════════════════════ */

const TAX_RATE = 0.15; /* 15% GCT Jamaica */

/* ───────────────────────────────────────────────────────────
   DEMO DATA — Nola's Events Menu
─────────────────────────────────────────────────────────── */
const DEMO_DATA = {
  restaurant: {
    name: "Nola's Events",
    tagline: "Fine Dining on Jamaica's Serene South Coast",
    address: "34CV+6CR, Luana, St. Elizabeth, Jamaica",
    phone: "(876) 239-2229",
    whatsapp: "https://wa.me/18762392229?text=Hi%20Nola's%20Events!%20I'd%20like%20to%20place%20an%20order.",
    currency: "JMD"
  },

  categories: [
    { id: "jerk",     name: "Jerk Centre",        icon: "🌶️",  description: "Slow-cooked over pimento wood" },
    { id: "mains",    name: "Main Dishes",         icon: "🍽️",  description: "Jamaican classics, expertly prepared" },
    { id: "sides",    name: "Sides & Extras",      icon: "🌿",  description: "Perfect companions" },
    { id: "bar",      name: "Bar & Cocktails",     icon: "🍸",  description: "Crafted with local spirits" },
    { id: "desserts", name: "Ice Cream & Pastry",  icon: "🍦",  description: "Homemade, indulgent" }
  ],

  menuItems: [
    // ── JERK CENTRE ──
    { id:"jk1", category:"jerk", name:"Jerk Chicken — Quarter",   description:"Pimento-wood smoked chicken, scorched over slow coals. Seasoned with scotch bonnet, allspice & thyme. Served with festival.",                          price:850,  featured:true,  available:true,  station:"jerk",  tags:["Popular","Chef's Pick"] },
    { id:"jk2", category:"jerk", name:"Jerk Chicken — Half",      description:"A generous half portion of our signature jerk chicken. Charred bark, smoky, fiery, tender inside. Served with rice & peas.",                               price:1500, featured:true,  available:true,  station:"jerk",  tags:["Popular"] },
    { id:"jk3", category:"jerk", name:"Jerk Pork — Quarter",      description:"Slow-smoked heritage pork, marinated 24 hours in our house jerk blend. Crispy edges, fall-off-the-bone tender.",                                             price:950,  featured:false, available:true,  station:"jerk",  tags:["Signature"] },
    { id:"jk4", category:"jerk", name:"Jerk Pork — Half",         description:"Half portion of succulent jerk pork. Served with bammy and our house pepper sauce.",                                                                          price:1700, featured:false, available:true,  station:"jerk",  tags:["Signature"] },
    { id:"jk5", category:"jerk", name:"Jerk Fish",                description:"Fresh local catch seasoned in jerk marinade, grilled over coal. Light, flaky, fragrant. Served with roasted breadfruit.",                                     price:1400, featured:false, available:true,  station:"jerk",  tags:["Fresh Catch"] },
    { id:"jk6", category:"jerk", name:"Jerk Sausage (3 pcs)",     description:"House-made sausages packed with jerk seasoning. Crispy on the outside, juicy within. A South Coast favourite.",                                               price:700,  featured:false, available:true,  station:"jerk",  tags:["Local Favourite"] },

    // ── MAIN DISHES ──
    { id:"mn1", category:"mains", name:"Curry Goat",              description:"Slow-braised goat in a fragrant curry sauce with scotch bonnet, thyme, and island spices. Served with white rice and coleslaw.",                              price:1800, featured:true,  available:true,  station:"grill", tags:["Popular","Must Try"] },
    { id:"mn2", category:"mains", name:"Oxtail — Slow Braised",   description:"Buttery, fall-apart oxtail braised for 4 hours with butter beans, allspice, and browning. A true Jamaican comfort classic.",                                  price:2000, featured:true,  available:true,  station:"grill", tags:["Premium","Must Try"] },
    { id:"mn3", category:"mains", name:"Brown Stew Chicken",      description:"Caramelised chicken simmered in a rich brown gravy with bell peppers, onions, and aromatic spices. Served with rice & peas.",                                price:1200, featured:false, available:true,  station:"grill", tags:["Classic"] },
    { id:"mn4", category:"mains", name:"Escovitch Red Snapper",   description:"Pan-fried red snapper topped with a tangy vinegar-pickled vegetable escovitch. Crispy skin, vibrant and bold.",                                               price:1800, featured:false, available:true,  station:"grill", tags:["Fresh Catch","Chef's Pick"] },
    { id:"mn5", category:"mains", name:"Steamed Fish with Okra",  description:"Whole fish steamed in seasoned broth with okra, scotch bonnet, and fresh herbs. Light, wholesome, deeply Jamaican.",                                          price:1600, featured:false, available:true,  station:"grill", tags:["Fresh Catch","Healthy"] },
    { id:"mn6", category:"mains", name:"Pepper Shrimp",           description:"Plump local shrimp tossed in our fiery pepper sauce with garlic butter. Served hot in the shell — the South Coast way.",                                      price:1600, featured:false, available:true,  station:"grill", tags:["Spicy","South Coast Special"] },

    // ── SIDES ──
    { id:"si1", category:"sides", name:"Rice & Peas",             description:"Traditional Jamaican rice cooked with kidney beans, coconut milk, thyme, and allspice. Fragrant and comforting.",                                             price:400,  featured:true,  available:true,  station:"prep",  tags:["Essential"] },
    { id:"si2", category:"sides", name:"Festival (3 pcs)",        description:"Golden sweet fried dumplings with a hint of vanilla. Crispy outside, soft inside — the perfect jerk companion.",                                               price:350,  featured:false, available:true,  station:"fryer", tags:["Jamaican","Popular"] },
    { id:"si3", category:"sides", name:"Bammy",                   description:"Traditional cassava flatbread, soaked in coconut milk and lightly fried. Gluten-free and authentically Jamaican.",                                            price:350,  featured:false, available:true,  station:"prep",  tags:["Jamaican","Gluten-Free"] },
    { id:"si4", category:"sides", name:"Roasted Breadfruit",      description:"Fresh breadfruit roasted over an open flame until golden. Smoky, starchy, satisfying — a South Coast staple.",                                               price:350,  featured:false, available:true,  station:"oven",  tags:["Jamaican","Seasonal"] },
    { id:"si5", category:"sides", name:"Ground Provisions",       description:"A hearty plate of yam, dasheen, sweet potato, and green banana. Boiled tender, served with butter.",                                                           price:500,  featured:false, available:true,  station:"prep",  tags:["Jamaican","Filling"] },
    { id:"si6", category:"sides", name:"Coleslaw",                description:"Freshly made creamy coleslaw with cabbage, carrot, and our house dressing. A bright, cool contrast to the jerk.",                                             price:300,  featured:false, available:true,  station:"salad", tags:["Fresh"] },
    { id:"si7", category:"sides", name:"Fried Plantain",          description:"Ripe plantain slices caramelised until golden and sweet. Irresistible.",                                                                                      price:350,  featured:false, available:true,  station:"fryer", tags:["Vegan","Popular"] },

    // ── BAR ──
    { id:"br1", category:"bar", name:"Rum Punch",                 description:"Our signature house blend — white rum, fruit juices, grenadine, and a float of overproof. Served over ice with a cherry.",                                   price:800,  featured:true,  available:true,  station:"bar",   tags:["Signature","Popular"] },
    { id:"br2", category:"bar", name:"Coconut Margarita",         description:"Tequila, triple sec, fresh lime, and coconut cream shaken and poured over crushed ice. Tropical, refreshing, dangerously easy to drink.",                     price:900,  featured:false, available:true,  station:"bar",   tags:["Cocktail","Popular"] },
    { id:"br3", category:"bar", name:"Rum & Ginger",              description:"Jamaican white rum with premium ginger beer, lime juice, and mint. A Caribbean mule, South Coast style.",                                                      price:750,  featured:false, available:true,  station:"bar",   tags:["Cocktail"] },
    { id:"br4", category:"bar", name:"Sorrel Cooler",             description:"Hibiscus sorrel steeped with cinnamon and clove, mixed with rum or served virgin. A festive Jamaican classic.",                                               price:700,  featured:false, available:true,  station:"bar",   tags:["Jamaican","Can be Virgin"] },
    { id:"br5", category:"bar", name:"Red Stripe Beer",           description:"Jamaica's iconic lager — crisp, cold, and unmistakable. The perfect pairing with jerk.",                                                                      price:500,  featured:false, available:true,  station:"bar",   tags:["Beer"] },
    { id:"br6", category:"bar", name:"Dragon Stout",              description:"Rich, dark Jamaican stout with hints of caramel and roasted malt. Full-bodied and bold.",                                                                      price:550,  featured:false, available:true,  station:"bar",   tags:["Beer"] },
    { id:"br7", category:"bar", name:"Fresh Fruit Punch",         description:"Homemade tropical punch with seasonal fruits. Bright, naturally sweet, alcohol-free.",                                                                         price:400,  featured:false, available:true,  station:"bar",   tags:["Non-Alcoholic","Homemade"] },
    { id:"br8", category:"bar", name:"Soft Drink",                description:"Pepsi, Ting, Kola Champagne, or D&G — ask your server for today's selection.",                                                                               price:250,  featured:false, available:true,  station:"bar",   tags:["Non-Alcoholic"] },
    { id:"br9", category:"bar", name:"Bottled Water",             description:"Chilled Wata — still or sparkling.",                                                                                                                           price:200,  featured:false, available:true,  station:"bar",   tags:["Non-Alcoholic"] },

    // ── DESSERTS ──
    { id:"ds1", category:"desserts", name:"Rum & Raisin Ice Cream",   description:"Rich vanilla ice cream with rum-soaked raisins, churned in-house. An indulgent Jamaican tradition.",                                                   price:650,  featured:true,  available:true,  station:"ice cream", tags:["House-Made","Popular"] },
    { id:"ds2", category:"desserts", name:"Coconut Ice Cream",        description:"Creamy, intensely coconut house-made ice cream. Vegan-friendly. Served in a toasted coconut shell.",                                                    price:600,  featured:false, available:true,  station:"ice cream", tags:["House-Made","Vegan"] },
    { id:"ds3", category:"desserts", name:"Sorbet of the Day",        description:"Ask your server for today's flavour — often soursop, mango, or guava. Bright, refreshing, palate-cleansing.",                                           price:550,  featured:false, available:true,  station:"ice cream", tags:["House-Made","Seasonal"] },
    { id:"ds4", category:"desserts", name:"Rum Cake",                 description:"Moist, dense, boozy Jamaican rum cake. Made from Nola's grandmother's recipe. Dusted with icing sugar.",                                                price:750,  featured:false, available:true,  station:"oven",      tags:["Signature","Must Try"] },
    { id:"ds5", category:"desserts", name:"Carrot Cake",              description:"Three-layer spiced carrot cake with cream cheese frosting and a dusting of cinnamon.",                                                                  price:700,  featured:false, available:true,  station:"oven",      tags:["Seasonal"] },
    { id:"ds6", category:"desserts", name:"Banana Fritters",          description:"Golden battered ripe banana fritters drizzled with honey and served with a scoop of coconut ice cream.",                                                price:500,  featured:false, available:true,  station:"fryer",     tags:["Warm","Indulgent"] }
  ],

  orders: [
    {
      id: "ORD-0001",
      tableNumber: "5",
      orderType: "dine-in",
      persons: [
        { name: "Marcia", items: [
          { id:"jk2", name:"Jerk Chicken — Half",   price:1500, quantity:1 },
          { id:"si1", name:"Rice & Peas",            price:400,  quantity:1 },
          { id:"br1", name:"Rum Punch",              price:800,  quantity:1 }
        ]},
        { name: "Devon", items: [
          { id:"mn2", name:"Oxtail — Slow Braised",  price:2000, quantity:1 },
          { id:"si1", name:"Rice & Peas",            price:400,  quantity:1 },
          { id:"br5", name:"Red Stripe Beer",        price:500,  quantity:1 }
        ]}
      ],
      status: "preparing",
      subtotal: 5600, tax: 840, total: 6440,
      notes: "Devon prefers extra pepper sauce on the side",
      createdAt: new Date(Date.now() - 18 * 60000).toISOString()
    },
    {
      id: "ORD-0002",
      tableNumber: "2",
      orderType: "dine-in",
      persons: [
        { name: "Guest", items: [
          { id:"mn4", name:"Escovitch Red Snapper", price:1800, quantity:1 },
          { id:"si2", name:"Festival",              price:350,  quantity:2 },
          { id:"br7", name:"Fresh Fruit Punch",     price:400,  quantity:1 }
        ]}
      ],
      status: "pending",
      subtotal: 2900, tax: 435, total: 3335,
      notes: "Please go light on the onions",
      createdAt: new Date(Date.now() - 5 * 60000).toISOString()
    },
    {
      id: "ORD-0003",
      tableNumber: "Takeout",
      orderType: "takeout",
      persons: [
        { name: "Fitzroy", items: [
          { id:"jk1", name:"Jerk Chicken — Quarter", price:850,  quantity:2 },
          { id:"jk6", name:"Jerk Sausage",           price:700,  quantity:1 },
          { id:"si2", name:"Festival",               price:350,  quantity:3 },
          { id:"br5", name:"Red Stripe Beer",        price:500,  quantity:2 }
        ]}
      ],
      status: "ready",
      subtotal: 3450, tax: 517, total: 3967,
      notes: "",
      createdAt: new Date(Date.now() - 35 * 60000).toISOString()
    },
    {
      id: "ORD-0004",
      tableNumber: "8",
      orderType: "dine-in",
      persons: [
        { name: "Guest", items: [
          { id:"mn1", name:"Curry Goat",            price:1800, quantity:1 },
          { id:"ds1", name:"Rum & Raisin Ice Cream",price:650,  quantity:1 },
          { id:"br2", name:"Coconut Margarita",     price:900,  quantity:1 }
        ]}
      ],
      status: "completed",
      subtotal: 3350, tax: 502, total: 3852,
      notes: "",
      createdAt: new Date(Date.now() - 80 * 60000).toISOString()
    },
    {
      id: "ORD-0005",
      tableNumber: "3",
      orderType: "dine-in",
      persons: [
        { name: "Sandra", items: [
          { id:"mn6", name:"Pepper Shrimp",         price:1600, quantity:1 },
          { id:"si4", name:"Roasted Breadfruit",    price:350,  quantity:1 },
          { id:"br3", name:"Rum & Ginger",          price:750,  quantity:1 }
        ]}
      ],
      status: "pending",
      subtotal: 2700, tax: 405, total: 3105,
      notes: "Allergy: No nuts",
      createdAt: new Date(Date.now() - 2 * 60000).toISOString()
    }
  ],

  staff: [
    { id:"s1", name:"Nola Campbell",    role:"admin",   initials:"NC" },
    { id:"s2", name:"Marcus Brown",     role:"kitchen", initials:"MB" },
    { id:"s3", name:"Angela Bailey",    role:"kitchen", initials:"AB" },
    { id:"s4", name:"Dwayne Richards",  role:"staff",   initials:"DR" }
  ]
};

/* ───────────────────────────────────────────────────────────
   STORE — centralised state management
─────────────────────────────────────────────────────────── */
const Store = {
  _data: null,
  _cart: null,

  load() {
    try {
      const saved = localStorage.getItem('nolas_data');
      this._data = saved ? JSON.parse(saved) : structuredClone(DEMO_DATA);
      // Keep orders timestamps fresh on reload
      if (!saved) this._refreshDemoTimestamps();
    } catch {
      this._data = structuredClone(DEMO_DATA);
    }
    try {
      const cart = localStorage.getItem('nolas_cart');
      this._cart = cart ? JSON.parse(cart) : this._freshCart();
    } catch {
      this._cart = this._freshCart();
    }
  },

  _refreshDemoTimestamps() {
    // Make demo orders appear recent
    const offsets = [18, 5, 35, 80, 2];
    this._data.orders.forEach((o, i) => {
      o.createdAt = new Date(Date.now() - (offsets[i] || 10) * 60000).toISOString();
    });
  },

  _freshCart() {
    return {
      tableNumber: null,
      orderType: 'dine-in',
      persons: [{ name: 'Person 1', items: [] }],
      notes: '',
      gratuity: 0
    };
  },

  save()     { try { localStorage.setItem('nolas_data', JSON.stringify(this._data)); } catch {} },
  saveCart() { try { localStorage.setItem('nolas_cart', JSON.stringify(this._cart)); } catch {} },

  resetDemo() {
    localStorage.removeItem('nolas_data');
    localStorage.removeItem('nolas_cart');
    this._data = structuredClone(DEMO_DATA);
    this._data.orders = structuredClone(DEMO_DATA.orders);
    this._refreshDemoTimestamps();
    this._cart = this._freshCart();
    this.save();
    this.saveCart();
  },

  /* ── Getters ── */
  get restaurant() { return this._data.restaurant; },
  get menu()       { return this._data.menuItems; },
  get categories() { return this._data.categories; },
  get orders()     { return this._data.orders; },
  get staff()      { return this._data.staff; },

  getItemsByCategory(cat) {
    if (cat === 'all') return this._data.menuItems;
    return this._data.menuItems.filter(i => i.category === cat);
  },

  /* ── Menu CRUD ── */
  addMenuItem(item) {
    item.id = 'x' + Date.now();
    item.available = true;
    item.featured  = item.featured || false;
    item.tags      = item.tags || [];
    item.station   = item.station || 'prep';
    this._data.menuItems.push(item);
    this.save();
    return item;
  },

  updateMenuItem(id, changes) {
    const idx = this._data.menuItems.findIndex(i => i.id === id);
    if (idx !== -1) {
      this._data.menuItems[idx] = { ...this._data.menuItems[idx], ...changes };
      this.save();
      return this._data.menuItems[idx];
    }
  },

  deleteMenuItem(id) {
    this._data.menuItems = this._data.menuItems.filter(i => i.id !== id);
    this.save();
  },

  toggleAvailability(id) {
    const item = this._data.menuItems.find(i => i.id === id);
    if (item) { item.available = !item.available; this.save(); }
    return item;
  },

  /* ── Cart ── */
  get cart() { return this._cart; },

  setTable(num)       { this._cart.tableNumber = num; this.saveCart(); },
  setOrderType(type)  { this._cart.orderType = type;  this.saveCart(); },
  setGratuity(pct)    { this._cart.gratuity = pct;    this.saveCart(); },

  addToCart(menuItemId, personIdx = 0) {
    const item = this._data.menuItems.find(i => i.id === menuItemId);
    if (!item || !item.available) return;
    if (!this._cart.persons[personIdx]) return;
    const person   = this._cart.persons[personIdx];
    const existing = person.items.find(i => i.id === menuItemId);
    if (existing) { existing.quantity++; }
    else {
      person.items.push({ id: item.id, name: item.name, price: item.price, quantity: 1, station: item.station || 'prep' });
    }
    this.saveCart();
  },

  removeFromCart(menuItemId, personIdx = 0) {
    const person = this._cart.persons[personIdx];
    if (!person) return;
    const existing = person.items.find(i => i.id === menuItemId);
    if (!existing) return;
    if (existing.quantity > 1) { existing.quantity--; }
    else { person.items = person.items.filter(i => i.id !== menuItemId); }
    this.saveCart();
  },

  getPersonQuantity(menuItemId, personIdx = 0) {
    const person = this._cart.persons[personIdx];
    if (!person) return 0;
    const item = person.items.find(i => i.id === menuItemId);
    return item ? item.quantity : 0;
  },

  cartCount() {
    return this._cart.persons.reduce((s, p) =>
      s + p.items.reduce((ss, i) => ss + i.quantity, 0), 0);
  },

  cartSubtotal() {
    return this._cart.persons.reduce((s, p) =>
      s + p.items.reduce((ss, i) => ss + i.price * i.quantity, 0), 0);
  },

  addPerson(name) {
    this._cart.persons.push({ name, items: [] });
    this.saveCart();
    return this._cart.persons.length - 1;
  },

  placeOrder() {
    const subtotal = this.cartSubtotal();
    const tax      = +(subtotal * TAX_RATE).toFixed(0);
    const gratuity = +(subtotal * (this._cart.gratuity / 100)).toFixed(0);
    const order = {
      id:          'ORD-' + String(this._data.orders.length + 1).padStart(4, '0'),
      tableNumber: this._cart.tableNumber || 'Takeout',
      orderType:   this._cart.orderType || 'dine-in',
      persons:     structuredClone(this._cart.persons),
      status:      'pending',
      subtotal:    subtotal,
      tax:         tax,
      gratuity:    gratuity,
      total:       subtotal + tax + gratuity,
      notes:       this._cart.notes || '',
      createdAt:   new Date().toISOString()
    };
    this._data.orders.unshift(order);
    this.save();
    const tableNum = this._cart.tableNumber;
    this._cart = this._freshCart();
    this._cart.tableNumber = tableNum;
    this.saveCart();
    return order;
  },

  updateOrderStatus(id, status) {
    const order = this._data.orders.find(o => o.id === id);
    if (order) { order.status = status; this.save(); }
    return order;
  },

  getOrdersByStatus(status) {
    if (!status || status === 'all') return this._data.orders;
    return this._data.orders.filter(o => o.status === status);
  },

  getStats() {
    const orders = this._data.orders;
    const now    = new Date();
    const today  = orders.filter(o => {
      const d = new Date(o.createdAt);
      return d.getDate()  === now.getDate()  &&
             d.getMonth() === now.getMonth() &&
             d.getFullYear() === now.getFullYear();
    });
    return {
      totalOrders:   orders.length,
      todayOrders:   today.length,
      todayRevenue:  today.reduce((s, o) => s + o.total, 0),
      pendingOrders: orders.filter(o => ['pending','preparing'].includes(o.status)).length,
      avgOrderValue: orders.length ? orders.reduce((s, o) => s + o.total, 0) / orders.length : 0,
      completedToday: today.filter(o => o.status === 'completed').length
    };
  }
};

/* ───────────────────────────────────────────────────────────
   UTILITIES
─────────────────────────────────────────────────────────── */
function formatPrice(p) {
  return 'J$' + new Intl.NumberFormat('en-JM').format(Math.round(p));
}

function timeSince(isoDate) {
  const diff = Math.floor((Date.now() - new Date(isoDate)) / 1000);
  if (diff < 60)   return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ${Math.floor((diff % 3600) / 60)}m ago`;
}

function elapsedMins(isoDate) {
  return Math.floor((Date.now() - new Date(isoDate)) / 60000);
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function showToast(msg, type = 'default', duration = 3000) {
  let tc = document.getElementById('toast-container');
  if (!tc) {
    tc = document.createElement('div');
    tc.id = 'toast-container';
    Object.assign(tc.style, {
      position:'fixed', bottom:'1.5rem', right:'1.5rem',
      zIndex:'9999', display:'flex', flexDirection:'column', gap:'.5rem'
    });
    document.body.appendChild(tc);
  }
  const t   = document.createElement('div');
  const ico = { success:'✓', error:'✕', warning:'⚠', default:'●' }[type] || '●';
  t.style.cssText = `
    display:flex;align-items:center;gap:.6rem;
    background:var(--surface2,#241F16);color:var(--cream,#F5ECD7);
    border:1px solid var(--border,rgba(212,168,67,.2));
    border-left:3px solid var(--${type==='success'?'green':type==='error'?'jerk':type==='warning'?'gold':'gold'},#D4A843);
    padding:.75rem 1rem;border-radius:10px;font-size:.84rem;
    box-shadow:0 8px 32px rgba(0,0,0,.5);
    animation:toastIn .25s ease;max-width:320px;
    transition:opacity .3s,transform .3s;
  `;
  t.innerHTML = `<span style="font-size:.75rem;opacity:.8">${ico}</span><span>${escapeHtml(msg)}</span>`;
  tc.appendChild(t);
  if (!document.getElementById('toast-keyframes')) {
    const s = document.createElement('style'); s.id = 'toast-keyframes';
    s.textContent = '@keyframes toastIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}';
    document.head.appendChild(s);
  }
  setTimeout(() => { t.style.opacity='0'; t.style.transform='translateX(20px)'; setTimeout(()=>t.remove(),300); }, duration);
}

function statusLabel(s) {
  return { pending:'Pending', preparing:'Preparing', ready:'Ready', completed:'Completed' }[s] || s;
}
function statusClass(s) {
  return { pending:'badge-amber', preparing:'badge-blue', ready:'badge-green', completed:'badge-muted' }[s] || 'badge-muted';
}
function statusColor(s) {
  return { pending:'#D4A843', preparing:'#5B9BD5', ready:'#4CAF7A', completed:'#6B5848' }[s] || '#D4A843';
}

/* Export to global */
window.Store       = Store;
window.TAX_RATE    = TAX_RATE;
window.formatPrice = formatPrice;
window.timeSince   = timeSince;
window.elapsedMins = elapsedMins;
window.escapeHtml  = escapeHtml;
window.showToast   = showToast;
window.statusLabel = statusLabel;
window.statusClass = statusClass;
window.statusColor = statusColor;