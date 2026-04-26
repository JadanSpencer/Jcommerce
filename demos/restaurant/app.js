'use strict';
/* ═══════════════════════════════════════════════════════════
   JC-EATERY — Core Application Logic
   No frameworks. Clean restaurant software.
═══════════════════════════════════════════════════════════ */

const TAX_RATE = 0.085;

/* ───────────────────────────────────────────────────────────
   DEMO DATA
─────────────────────────────────────────────────────────── */
const DEMO_DATA = {
  restaurant: {
    name: "JC-Eatery",
    tagline: "Contemporary Coastal Dining",
    address: "14 Harbour Street, Kingston, Jamaica",
    phone: "+1 (876) 555-0182",
    currency: "USD"
  },

  categories: [
    { id: "starters",   name: "Starters",       description: "Light bites to begin your journey" },
    { id: "mains",      name: "Main Course",     description: "Chef's signature creations" },
    { id: "grills",     name: "From the Grill",  description: "Wood-fired specialties" },
    { id: "desserts",   name: "Desserts",        description: "Sweet endings" },
    { id: "beverages",  name: "Beverages",       description: "Crafted drinks" }
  ],

  menuItems: [
    // STARTERS
    { id: "s1", category: "starters", name: "Crab & Avocado Stack",   description: "Fresh crab meat layered with creamy avocado, citrus vinaigrette, micro herbs",        price: 18.00, featured: true,  available: true, tags: ["Chef's Pick","Gluten-Free"] },
    { id: "s2", category: "starters", name: "Crispy Jerk Wings",      description: "Six wings marinated in our house jerk blend, scotch bonnet dipping sauce",              price: 14.50, featured: false, available: true, tags: ["Spicy"] },
    { id: "s3", category: "starters", name: "Soup du Jour",           description: "Ask your server for today's creation — always fresh, always seasonal",                  price: 9.00,  featured: false, available: true, tags: ["Vegetarian option"] },
    { id: "s4", category: "starters", name: "Calamari Fritti",        description: "Lightly dusted rings, golden fried, lemon aioli, charred lime",                         price: 13.00, featured: false, available: true, tags: [] },

    // MAINS
    { id: "m1", category: "mains", name: "Pan-Seared Red Snapper",    description: "Whole fillet, saffron beurre blanc, wilted spinach, fingerling potatoes",               price: 34.00, featured: true,  available: true, tags: ["Chef's Pick","Gluten-Free"] },
    { id: "m2", category: "mains", name: "Slow Braised Oxtail",       description: "12-hour braise, butter beans, roasted breadfruit, jerk-spiced gravy",                   price: 38.00, featured: true,  available: true, tags: ["Chef's Pick"] },
    { id: "m3", category: "mains", name: "Jerk Chicken Plate",        description: "Half bird, pimento wood smoked, festival dumplings, rice & peas",                       price: 28.00, featured: false, available: true, tags: ["Local Favourite"] },
    { id: "m4", category: "mains", name: "Vegetable Wellington",      description: "Mushroom duxelles, roasted root veg, puff pastry, truffle jus",                         price: 26.00, featured: false, available: true, tags: ["Vegetarian"] },
    { id: "m5", category: "mains", name: "Curried Lobster",           description: "Half Caribbean spiny lobster, coconut curry, roti skins, pickled mango",                price: 52.00, featured: true,  available: true, tags: ["Premium","Gluten-Free"] },

    // GRILLS
    { id: "g1", category: "grills", name: "Wagyu Ribeye 10oz",        description: "Grade A5 wagyu, truffle butter, hand-cut fries, house salad",                           price: 68.00, featured: true,  available: true, tags: ["Premium"] },
    { id: "g2", category: "grills", name: "Grilled King Prawns",      description: "Six tiger prawns, garlic butter, charred corn salsa, charred lime",                     price: 36.00, featured: false, available: true, tags: ["Gluten-Free"] },
    { id: "g3", category: "grills", name: "Jerk Pork Chops",          description: "Double-cut chops, pineapple salsa, sweet potato mash, jerk drizzle",                    price: 32.00, featured: false, available: true, tags: ["Spicy"] },

    // DESSERTS
    { id: "d1", category: "desserts", name: "Rum Cake",               description: "Dark Jamaican rum-soaked sponge, vanilla bean ice cream, caramel sauce",                price: 12.00, featured: true,  available: true, tags: ["House Special"] },
    { id: "d2", category: "desserts", name: "Chocolate Fondant",      description: "Warm dark chocolate centre, Cointreau cream, gold leaf finish",                         price: 14.00, featured: false, available: true, tags: [] },
    { id: "d3", category: "desserts", name: "Tropical Sorbet Trio",   description: "Mango, passion fruit, soursop — rotating daily",                                        price: 10.00, featured: false, available: true, tags: ["Vegan","Gluten-Free"] },

    // BEVERAGES
    { id: "b1", category: "beverages", name: "JC Signature Punch",    description: "House blend: sorrel, ginger beer, spiced rum, lime, mint",                             price: 12.00, featured: true,  available: true, tags: ["Signature"] },
    { id: "b2", category: "beverages", name: "Fresh Coconut Water",   description: "Young coconut, served tableside, straw included",                                       price: 7.00,  featured: false, available: true, tags: ["Natural"] },
    { id: "b3", category: "beverages", name: "Still / Sparkling Water",description: "375ml or 750ml bottle",                                                                price: 4.50,  featured: false, available: true, tags: [] },
    { id: "b4", category: "beverages", name: "Craft Lemonade",        description: "Housemade, hibiscus or classic, choose your style",                                     price: 6.50,  featured: false, available: true, tags: ["Alcohol-Free"] }
  ],

  orders: [
    {
      id: "ORD-0001",
      tableNumber: "4",
      orderType: "dine-in",
      persons: [{ name: "Guest 1", items: [
        { id:"m2", name:"Slow Braised Oxtail",    price:38,   quantity:1 },
        { id:"b1", name:"JC Signature Punch",     price:12,   quantity:2 }
      ]}],
      status: "preparing",
      subtotal: 62.00, tax: 5.27, total: 67.27,
      notes: "",
      createdAt: new Date(Date.now() - 18 * 60000).toISOString()
    },
    {
      id: "ORD-0002",
      tableNumber: "7",
      orderType: "dine-in",
      persons: [
        { name: "Sarah", items: [{ id:"g1", name:"Wagyu Ribeye 10oz", price:68, quantity:1 }] },
        { name: "Mike",  items: [{ id:"m5", name:"Curried Lobster",   price:52, quantity:1 }] }
      ],
      status: "pending",
      subtotal: 120.00, tax: 10.20, total: 130.20,
      notes: "Mike has nut allergy",
      createdAt: new Date(Date.now() - 5 * 60000).toISOString()
    },
    {
      id: "ORD-0003",
      tableNumber: "2",
      orderType: "dine-in",
      persons: [{ name: "Guest", items: [
        { id:"s1", name:"Crab & Avocado Stack", price:18, quantity:1 },
        { id:"d1", name:"Rum Cake",             price:12, quantity:1 }
      ]}],
      status: "ready",
      subtotal: 30.00, tax: 2.55, total: 32.55,
      notes: "",
      createdAt: new Date(Date.now() - 35 * 60000).toISOString()
    },
    {
      id: "ORD-0004",
      tableNumber: "Takeout",
      orderType: "takeout",
      persons: [{ name: "Jennifer M.", items: [
        { id:"m3", name:"Jerk Chicken Plate", price:28,   quantity:2 },
        { id:"b4", name:"Craft Lemonade",     price:6.50, quantity:2 }
      ]}],
      status: "completed",
      subtotal: 69.00, tax: 5.87, total: 74.87,
      notes: "Extra jerk sauce on the side",
      createdAt: new Date(Date.now() - 65 * 60000).toISOString()
    }
  ],

  staff: [
    { id: "u1", name: "James Chen",      role: "admin",   email: "james@jc-eatery.com",  initials: "JC" },
    { id: "u2", name: "Marcus Thompson", role: "kitchen", email: "marcus@jc-eatery.com", initials: "MT" },
    { id: "u3", name: "Angela Bailey",   role: "staff",   email: "angela@jc-eatery.com", initials: "AB" }
  ]
};

/* ───────────────────────────────────────────────────────────
   STORE — All state management
─────────────────────────────────────────────────────────── */
const Store = {
  _data: null,
  _cart: null,

  load() {
    try {
      const saved = localStorage.getItem('jc_data');
      this._data = saved ? JSON.parse(saved) : structuredClone(DEMO_DATA);
    } catch {
      this._data = structuredClone(DEMO_DATA);
    }
    try {
      const cart = localStorage.getItem('jc_cart');
      this._cart = cart ? JSON.parse(cart) : this._freshCart();
    } catch {
      this._cart = this._freshCart();
    }
  },

  _freshCart() {
    return { tableNumber: null, orderType: 'dine-in', persons: [{ name: 'Person 1', items: [] }], notes: '' };
  },

  save()     { try { localStorage.setItem('jc_data', JSON.stringify(this._data)); } catch {} },
  saveCart() { try { localStorage.setItem('jc_cart', JSON.stringify(this._cart)); } catch {} },

  resetDemo() {
    localStorage.removeItem('jc_data');
    localStorage.removeItem('jc_cart');
    this._data = structuredClone(DEMO_DATA);
    this._cart = this._freshCart();
  },

  get restaurant() { return this._data.restaurant; },
  get menu()       { return this._data.menuItems; },
  get categories() { return this._data.categories; },

  getItemsByCategory(cat) {
    if (cat === 'all') return this._data.menuItems;
    return this._data.menuItems.filter(i => i.category === cat);
  },

  addMenuItem(item) {
    item.id = 'x' + Date.now();
    item.available = true;
    item.featured = item.featured || false;
    item.tags = item.tags || [];
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

  get cart() { return this._cart; },

  setTable(num) { this._cart.tableNumber = num; this.saveCart(); },
  setOrderType(type) { this._cart.orderType = type; this.saveCart(); },

  addToCart(menuItemId, personIdx = 0) {
    const item = this._data.menuItems.find(i => i.id === menuItemId);
    if (!item || !item.available) return;
    if (!this._cart.persons[personIdx]) return;
    const person = this._cart.persons[personIdx];
    const existing = person.items.find(i => i.id === menuItemId);
    if (existing) {
      existing.quantity++;
    } else {
      person.items.push({ id: item.id, name: item.name, price: item.price, quantity: 1 });
    }
    this.saveCart();
  },

  removeFromCart(menuItemId, personIdx = 0) {
    const person = this._cart.persons[personIdx];
    if (!person) return;
    const existing = person.items.find(i => i.id === menuItemId);
    if (!existing) return;
    if (existing.quantity > 1) {
      existing.quantity--;
    } else {
      person.items = person.items.filter(i => i.id !== menuItemId);
    }
    this.saveCart();
  },

  getPersonQuantity(menuItemId, personIdx = 0) {
    const person = this._cart.persons[personIdx];
    if (!person) return 0;
    const item = person.items.find(i => i.id === menuItemId);
    return item ? item.quantity : 0;
  },

  cartCount() {
    return this._cart.persons.reduce((sum, p) =>
      sum + p.items.reduce((s, i) => s + i.quantity, 0), 0);
  },

  cartSubtotal() {
    return this._cart.persons.reduce((sum, p) =>
      sum + p.items.reduce((s, i) => s + i.price * i.quantity, 0), 0);
  },

  placeOrder() {
    const subtotal = this.cartSubtotal();
    const tax = subtotal * TAX_RATE;
    const order = {
      id: 'ORD-' + String(this._data.orders.length + 1).padStart(4, '0'),
      tableNumber: this._cart.tableNumber || 'Takeout',
      orderType: this._cart.orderType || 'dine-in',
      persons: structuredClone(this._cart.persons),
      status: 'pending',
      subtotal: +subtotal.toFixed(2),
      tax: +tax.toFixed(2),
      total: +(subtotal + tax).toFixed(2),
      notes: this._cart.notes || '',
      createdAt: new Date().toISOString()
    };
    this._data.orders.unshift(order);
    this.save();
    this._cart = this._freshCart();
    this._cart.tableNumber = order.tableNumber;
    this.saveCart();
    return order;
  },

  updateOrderStatus(id, status) {
    const order = this._data.orders.find(o => o.id === id);
    if (order) { order.status = status; this.save(); }
    return order;
  },

  get orders() { return this._data.orders; },

  getOrdersByStatus(status) {
    if (!status || status === 'all') return this._data.orders;
    return this._data.orders.filter(o => o.status === status);
  },

  get staff() { return this._data.staff; },

  getStats() {
    const orders = this._data.orders;
    const today  = orders.filter(o => {
      const d = new Date(o.createdAt);
      const n = new Date();
      return d.getDate() === n.getDate() && d.getMonth() === n.getMonth();
    });
    return {
      totalOrders:   orders.length,
      todayOrders:   today.length,
      todayRevenue:  today.reduce((s, o) => s + o.total, 0),
      pendingOrders: orders.filter(o => o.status === 'pending' || o.status === 'preparing').length,
      avgOrderValue: orders.length ? orders.reduce((s, o) => s + o.total, 0) / orders.length : 0
    };
  }
};

/* ───────────────────────────────────────────────────────────
   UTILITIES
─────────────────────────────────────────────────────────── */
function formatPrice(p) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(p);
}

function timeSince(isoDate) {
  const diff = Math.floor((Date.now() - new Date(isoDate)) / 1000);
  if (diff < 60)   return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ${Math.floor((diff % 3600)/60)}m ago`;
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
    document.body.appendChild(tc);
  }
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  tc.appendChild(t);
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateY(8px)';
    setTimeout(() => t.remove(), 400);
  }, duration);
}

function statusLabel(s) {
  return { pending:'Pending', preparing:'Preparing', ready:'Ready', completed:'Completed' }[s] || s;
}
function statusClass(s) {
  return { pending:'badge-amber', preparing:'badge-blue', ready:'badge-green', completed:'badge-muted' }[s] || 'badge-muted';
}

window.Store       = Store;
window.TAX_RATE    = TAX_RATE;
window.formatPrice = formatPrice;
window.timeSince   = timeSince;
window.escapeHtml  = escapeHtml;
window.showToast   = showToast;
window.statusLabel = statusLabel;
window.statusClass = statusClass;