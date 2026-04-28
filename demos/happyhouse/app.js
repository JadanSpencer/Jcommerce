'use strict';
/* ═══════════════════════════════════════════════════════════
   HAPPY HOUSE — Core Application Logic
   Real Jamaican Flavor · Sligoville, Jamaica
═══════════════════════════════════════════════════════════ */

const TAX_RATE = 0.10; /* 10% GCT */

/* ───────────────────────────────────────────────────────────
   DEMO DATA — Happy House Menu
─────────────────────────────────────────────────────────── */
const DEMO_DATA = {
  restaurant: {
    name: "Happy House",
    tagline: "Good Food. Good Vibes. Real Jamaican Flavor.",
    address: "P.O., Sligoville Dist, Sligoville, Jamaica",
    phone: "(876) 789-9423",
    whatsapp: "https://wa.me/18767899423?text=Hi%20Happy%20House!%20I'd%20like%20to%20place%20an%20order.",
    currency: "JMD"
  },

  categories: [
    { id: "sandwiches", name: "Sandwiches",  description: "Fresh-made to order" },
    { id: "wraps",      name: "Wraps",        description: "Packed with flavor" },
    { id: "sides",      name: "Sides",        description: "Perfect companions" },
    { id: "drinks",     name: "Drinks",       description: "Cold & refreshing" }
  ],

  menuItems: [
    // SANDWICHES
    { id: "sw1", category: "sandwiches", name: "Chicken Sandwich",       description: "Juicy seasoned chicken breast, crisp lettuce, fresh tomatoes, our signature house sauce, toasted bun",           price: 850,  featured: true,  available: true, tags: ["Popular","Chef's Pick"] },
    { id: "sw2", category: "sandwiches", name: "Spicy Chicken Sandwich", description: "Fiery scotch bonnet-marinated chicken, cooling slaw, pickled jalapeños, house hot sauce",                       price: 950,  featured: false, available: true, tags: ["Spicy"] },
    { id: "sw3", category: "sandwiches", name: "Fish Sandwich",          description: "Golden-fried snapper fillet, tartar sauce, shredded cabbage, sliced tomato, soft bun",                           price: 900,  featured: false, available: true, tags: ["Local Catch"] },
    { id: "sw4", category: "sandwiches", name: "Veggie Sandwich",        description: "Grilled seasonal vegetables, avocado spread, fresh greens, tomato, house dressing",                              price: 780,  featured: false, available: true, tags: ["Vegetarian"] },

    // WRAPS
    { id: "wr1", category: "wraps", name: "Baddest Wrap",               description: "Our legendary wrap — jerk chicken, fresh vegetables, cheddar, avocado, signature sauce, flour tortilla",          price: 950,  featured: true,  available: true, tags: ["Popular","Must Try"] },
    { id: "wr2", category: "wraps", name: "Jerk Chicken Wrap",          description: "Authentic pimento-wood smoked jerk chicken, rice & peas, coleslaw, scotch bonnet drizzle",                       price: 900,  featured: false, available: true, tags: ["Spicy","Local Favourite"] },
    { id: "wr3", category: "wraps", name: "Veggie Wrap",                description: "Sautéed peppers, onions, mushrooms, fresh greens, hummus, tomato, whole wheat tortilla",                         price: 820,  featured: false, available: true, tags: ["Vegetarian"] },
    { id: "wr4", category: "wraps", name: "Breakfast Wrap",             description: "Scrambled eggs, crispy bacon, cheddar cheese, fresh tomato, light cream cheese",                                  price: 850,  featured: false, available: true, tags: ["Breakfast"] },

    // SIDES
    { id: "si1", category: "sides", name: "French Fries",               description: "Golden crispy fries seasoned with our house blend, served with ketchup",                                          price: 450,  featured: true,  available: true, tags: ["Popular"] },
    { id: "si2", category: "sides", name: "Loaded Fries",               description: "Crispy fries topped with melted cheese sauce, jalapeños, and special seasoning",                                  price: 600,  featured: false, available: true, tags: ["Indulgent"] },
    { id: "si3", category: "sides", name: "Coleslaw",                   description: "Freshly made creamy coleslaw with carrots, cabbage, and our house dressing",                                      price: 300,  featured: false, available: true, tags: ["Fresh"] },
    { id: "si4", category: "sides", name: "Festival",                   description: "Traditional Jamaican sweet fried dumplings — golden, fluffy, and slightly sweet",                                 price: 350,  featured: false, available: true, tags: ["Jamaican"] },
    { id: "si5", category: "sides", name: "Bammy",                      description: "Traditional cassava flatbread, lightly fried or steamed — authentic Jamaican staple",                             price: 350,  featured: false, available: true, tags: ["Jamaican","Gluten-Free"] },

    // DRINKS
    { id: "dr1", category: "drinks", name: "Fruit Punch",               description: "Homemade tropical punch with fresh fruits — refreshing and naturally sweet",                                      price: 300,  featured: true,  available: true, tags: ["Homemade","Popular"] },
    { id: "dr2", category: "drinks", name: "Jamaican Ginger Beer",      description: "Spicy homemade ginger beer, brewed fresh daily — a real Jamaican classic",                                        price: 280,  featured: false, available: true, tags: ["Homemade","Signature"] },
    { id: "dr3", category: "drinks", name: "Lemonade",                  description: "Fresh-squeezed lemonade with a hint of mint, served over ice",                                                    price: 280,  featured: false, available: true, tags: ["Fresh"] },
    { id: "dr4", category: "drinks", name: "Sorrel Drink",              description: "Traditional Jamaican hibiscus drink, lightly spiced with cinnamon and clove",                                     price: 300,  featured: false, available: true, tags: ["Jamaican","Seasonal"] },
    { id: "dr5", category: "drinks", name: "Water",                     description: "Chilled bottled water",                                                                                           price: 150,  featured: false, available: true, tags: [] },
    { id: "dr6", category: "drinks", name: "Soft Drink",                description: "Pepsi, Ting, Kola Champagne, or D&G — ask your server for today's options",                                      price: 200,  featured: false, available: true, tags: [] }
  ],

  orders: [
    {
      id: "ORD-0001",
      tableNumber: "3",
      orderType: "dine-in",
      persons: [{ name: "Guest 1", items: [
        { id:"sw1", name:"Chicken Sandwich",  price:850,  quantity:2 },
        { id:"si1", name:"French Fries",      price:450,  quantity:2 },
        { id:"dr1", name:"Fruit Punch",       price:300,  quantity:2 }
      ]}],
      status: "preparing",
      subtotal: 3200, tax: 320, total: 3520,
      notes: "Extra sauce on the side",
      createdAt: new Date(Date.now() - 14 * 60000).toISOString()
    },
    {
      id: "ORD-0002",
      tableNumber: "5",
      orderType: "dine-in",
      persons: [
        { name: "Renee",   items: [{ id:"wr1", name:"Baddest Wrap",  price:950,  quantity:1 }] },
        { name: "Garfield",items: [{ id:"sw1", name:"Chicken Sandwich",price:850,quantity:1 }] }
      ],
      status: "pending",
      subtotal: 1800, tax: 180, total: 1980,
      notes: "Renee is allergic to peanuts",
      createdAt: new Date(Date.now() - 4 * 60000).toISOString()
    },
    {
      id: "ORD-0003",
      tableNumber: "Takeout",
      orderType: "takeout",
      persons: [{ name: "Fedrick", items: [
        { id:"wr2", name:"Jerk Chicken Wrap", price:900,  quantity:1 },
        { id:"si1", name:"French Fries",       price:450, quantity:1 },
        { id:"dr2", name:"Ginger Beer",        price:280, quantity:1 }
      ]}],
      status: "ready",
      subtotal: 1630, tax: 163, total: 1793,
      notes: "",
      createdAt: new Date(Date.now() - 30 * 60000).toISOString()
    },
    {
      id: "ORD-0004",
      tableNumber: "1",
      orderType: "dine-in",
      persons: [{ name: "Guest", items: [
        { id:"sw2", name:"Spicy Chicken Sandwich", price:950, quantity:1 },
        { id:"si2", name:"Loaded Fries",            price:600, quantity:1 },
        { id:"dr3", name:"Lemonade",                price:280, quantity:1 }
      ]}],
      status: "completed",
      subtotal: 1830, tax: 183, total: 2013,
      notes: "",
      createdAt: new Date(Date.now() - 75 * 60000).toISOString()
    }
  ],

  staff: [
    { id: "u1", name: "Joy Campbell",    role: "admin",   email: "joy@happyhouse.jm",    initials: "JC" },
    { id: "u2", name: "Marcus Brown",    role: "kitchen", email: "marcus@happyhouse.jm", initials: "MB" },
    { id: "u3", name: "Angela Bailey",   role: "staff",   email: "angela@happyhouse.jm", initials: "AB" }
  ]
};

/* ───────────────────────────────────────────────────────────
   STORE — State management
─────────────────────────────────────────────────────────── */
const Store = {
  _data: null,
  _cart: null,

  load() {
    try {
      const saved = localStorage.getItem('hh_data');
      this._data = saved ? JSON.parse(saved) : structuredClone(DEMO_DATA);
    } catch {
      this._data = structuredClone(DEMO_DATA);
    }
    try {
      const cart = localStorage.getItem('hh_cart');
      this._cart = cart ? JSON.parse(cart) : this._freshCart();
    } catch {
      this._cart = this._freshCart();
    }
  },

  _freshCart() {
    return { tableNumber: null, orderType: 'dine-in', persons: [{ name: 'Person 1', items: [] }], notes: '' };
  },

  save()     { try { localStorage.setItem('hh_data', JSON.stringify(this._data)); } catch {} },
  saveCart() { try { localStorage.setItem('hh_cart', JSON.stringify(this._cart)); } catch {} },

  resetDemo() {
    localStorage.removeItem('hh_data');
    localStorage.removeItem('hh_cart');
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
  return 'J$' + new Intl.NumberFormat('en-JM').format(Math.round(p));
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