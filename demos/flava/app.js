'use strict';
/* ═══════════════════════════════════════════════════════════
   FLAVA FINGAZ — Core Application Logic
   Flame Grilled Excellence · Kingston, Jamaica
═══════════════════════════════════════════════════════════ */

const TAX_RATE = 0.15;

const DEMO_DATA = {
  restaurant: {
    name: "Flava Fingaz",
    tagline: "Flame Grilled Excellence",
    address: "12 Constant Spring Rd, Kingston, Jamaica",
    phone: "(876) 555-0199",
    currency: "JMD"
  },

  categories: [
    { id: "grills",   name: "The Grill",        icon: "🔥", description: "Straight from the live coal fire" },
    { id: "wings",    name: "Wings & Tings",     icon: "🍗", description: "Crispy, sauced, unstoppable" },
    { id: "sides",    name: "Sides",             icon: "🌽", description: "Built to ride shotgun" },
    { id: "burgers",  name: "Stacked",           icon: "🍔", description: "Smashed & loaded" },
    { id: "sauces",   name: "House Sauces",      icon: "🌶️", description: "The secret weapons" },
    { id: "drinks",   name: "Cold Drinks",       icon: "🧃", description: "Cool down after the heat" }
  ],

  menuItems: [
    // ── THE GRILL ──
    { id:"gr1", category:"grills", name:"Flame Quarter Chicken",   description:"Free-range bird marinated 12hrs in our scotch bonnet-citrus blend, grilled slow over hardwood coal. Bark on the outside, juicy within.",   price:1200, available:true, featured:true,  tags:["Bestseller","Signature"] },
    { id:"gr2", category:"grills", name:"Half Chicken",            description:"The full experience. Half bird, full char, full flavor. Comes with two sides of your choice.",                                                price:2000, available:true, featured:true,  tags:["Popular","Staff Pick"] },
    { id:"gr3", category:"grills", name:"Whole Smoked Bird",       description:"For the table. Whole chicken low-and-slow over pimento wood. Pre-order recommended. Feed 3–4.",                                              price:3500, available:true, featured:false, tags:["Feed The Table"] },
    { id:"gr4", category:"grills", name:"Grilled Snapper",         description:"Whole red snapper butterflied and grilled with lemon pepper, garlic butter, and scotch bonnet. Light char, big flavor.",                     price:2200, available:true, featured:true,  tags:["Fresh Catch","Chef's Pick"] },
    { id:"gr5", category:"grills", name:"Jerk Pork Ribs (Half Rack)",description:"Baby back ribs dry-rubbed with our jerk spice blend, smoked 3 hours then charred to finish. Tender, smoky, addictive.",                  price:2800, available:true, featured:false, tags:["Premium","Must Try"] },
    { id:"gr6", category:"grills", name:"Grilled Corn Cob",        description:"Sweet corn husked and grilled over open flame. Brushed with chili-lime butter and fresh herbs.",                                              price:450,  available:true, featured:false, tags:["Vegan"] },

    // ── WINGS & TINGS ──
    { id:"wg1", category:"wings", name:"Classic Flame Wings (6pc)", description:"Bone-in wings marinated and grilled direct on coal. Choose: Naked Jerk, Honey Scotch, Lemon Pepper, or BBQ Smoke.",                        price:1100, available:true, featured:true,  tags:["Bestseller"] },
    { id:"wg2", category:"wings", name:"Dirty Dozen (12pc)",        description:"Go big. A full dozen wings, your choice of two sauces. Share if you must.",                                                                  price:2000, available:true, featured:false, tags:["Value"] },
    { id:"wg3", category:"wings", name:"Crispy Tenders (5pc)",      description:"Chicken breast strips in our house batter, fried golden and tossed in Honey Fire glaze. Served with ranch.",                                 price:1300, available:true, featured:false, tags:["Popular"] },
    { id:"wg4", category:"wings", name:"Boneless Bites (8pc)",      description:"Chunky boneless pieces, battered, fried, and sauced. Pick one: Smoky BBQ, Buffalo, Honey Garlic.",                                          price:1400, available:true, featured:false, tags:["Crowd Fave"] },

    // ── STACKED BURGERS ──
    { id:"bg1", category:"burgers", name:"The Flava Smash",         description:"Double smash patty, American cheese, caramelised onion, pickles, and our secret Flava sauce on a toasted brioche bun.",                    price:1600, available:true, featured:true,  tags:["Signature","Bestseller"] },
    { id:"bg2", category:"burgers", name:"Jerk Jawn",               description:"Jerk-spiced patty, pepper jack cheese, grilled pineapple, coleslaw, and scotch bonnet mayo.",                                               price:1750, available:true, featured:false, tags:["Spicy","Staff Pick"] },
    { id:"bg3", category:"burgers", name:"Crispy Chicken Sandwich", description:"Thick fried thigh, dill pickle slaw, and hot honey on brioche. Inspired by the best. Better than the best.",                               price:1550, available:true, featured:false, tags:["Popular"] },
    { id:"bg4", category:"burgers", name:"Veggie Smash",            description:"House black bean & plantain patty, smashed, with avocado, pickled onion, and herb aioli.",                                                  price:1400, available:true, featured:false, tags:["Vegan","Healthy"] },

    // ── SIDES ──
    { id:"si1", category:"sides", name:"Seasoned Fries",            description:"Thick-cut, twice-fried, dusted with our house seasoning blend. Crispy outside, fluffy in.",                                                price:550,  available:true, featured:true,  tags:["Essential"] },
    { id:"si2", category:"sides", name:"Festival",                  description:"Sweet golden dumplings, lightly crisp. The perfect companion to everything on this menu.",                                                  price:350,  available:true, featured:false, tags:["Jamaican"] },
    { id:"si3", category:"sides", name:"Grilled Plantain",          description:"Ripe plantain halves grilled until caramelised and sweet. Finished with a pinch of chili salt.",                                            price:400,  available:true, featured:false, tags:["Vegan","Popular"] },
    { id:"si4", category:"sides", name:"Coleslaw",                  description:"Our house slaw — cabbage, carrot, scotch bonnet, and a tangy dressing. Fresh made daily.",                                                 price:300,  available:true, featured:false, tags:["Fresh"] },
    { id:"si5", category:"sides", name:"Mac & Cheese Bites (6pc)",  description:"Creamy mac, panko-crumbed and deep fried. Gooey centre, crunchy outside. Very dangerous.",                                                price:700,  available:true, featured:false, tags:["Must Try","Indulgent"] },
    { id:"si6", category:"sides", name:"Rice & Peas",               description:"Traditional Jamaican coconut rice with kidney beans, thyme, and allspice.",                                                                 price:400,  available:true, featured:false, tags:["Jamaican"] },

    // ── HOUSE SAUCES ──
    { id:"sc1", category:"sauces", name:"Naked Jerk Drizzle",       description:"Our house jerk sauce — scotch bonnet, allspice, thyme, and brown sugar. Medium heat with deep flavour.",                                   price:200,  available:true, featured:false, tags:["Signature"] },
    { id:"sc2", category:"sauces", name:"Honey Fire",               description:"Wildflower honey cut with our hottest pepper mash. Sweet front, fire finish.",                                                              price:200,  available:true, featured:true,  tags:["Bestseller","Spicy"] },
    { id:"sc3", category:"sauces", name:"Smoke & Garlic",           description:"Roasted garlic, smoked paprika, and a base of slow-reduced chicken drippings. Rich and complex.",                                           price:200,  available:true, featured:false, tags:["Savory"] },
    { id:"sc4", category:"sauces", name:"Green Seasoning Ranch",    description:"Creamy ranch base with fresh-blended green seasoning — culantro, thyme, pimento.",                                                         price:200,  available:true, featured:false, tags:["Fresh","Mild"] },

    // ── COLD DRINKS ──
    { id:"dr1", category:"drinks", name:"House Lemonade",           description:"Fresh squeezed with a hit of ginger and honey. Dangerously refreshing.",                                                                   price:450,  available:true, featured:true,  tags:["Homemade","Popular"] },
    { id:"dr2", category:"drinks", name:"Sorrel Hibiscus",          description:"Steeped in-house with cinnamon, clove, and ginger. Served over ice. Non-alcoholic.",                                                       price:400,  available:true, featured:false, tags:["Homemade","Jamaican"] },
    { id:"dr3", category:"drinks", name:"Tropical Punch",           description:"Blended seasonal fruits, no added sugar. Ask the server for today's blend.",                                                                price:400,  available:true, featured:false, tags:["Homemade","Fresh"] },
    { id:"dr4", category:"drinks", name:"Red Stripe",               description:"Jamaica's finest lager. Cold, crisp, perfect.",                                                                                             price:500,  available:true, featured:false, tags:["Beer"] },
    { id:"dr5", category:"drinks", name:"Dragon Stout",             description:"Dark, rich Jamaican stout. Bold malt character.",                                                                                           price:550,  available:true, featured:false, tags:["Beer"] },
    { id:"dr6", category:"drinks", name:"Soft Drink",               description:"Pepsi, Ting, Kola Champagne or D&G — ask your server.",                                                                                    price:250,  available:true, featured:false, tags:["Non-Alcoholic"] },
    { id:"dr7", category:"drinks", name:"Bottled Water",            description:"Chilled still or sparkling Wata.",                                                                                                          price:200,  available:true, featured:false, tags:["Non-Alcoholic"] }
  ],

  orders: []
};

/* ─────────────────────────────────────────────
   STORE
───────────────────────────────────────────── */
const Store = {
  _data: null,
  _cart: null,

  load() {
    try {
      const s = localStorage.getItem('ff_data');
      this._data = s ? JSON.parse(s) : structuredClone(DEMO_DATA);
    } catch { this._data = structuredClone(DEMO_DATA); }
    try {
      const c = localStorage.getItem('ff_cart');
      this._cart = c ? JSON.parse(c) : this._freshCart();
    } catch { this._cart = this._freshCart(); }
  },

  _freshCart() {
    return { tableNumber: null, orderType: 'dine-in', persons: [{ name: 'Guest 1', items: [] }], notes: '' };
  },

  save()     { try { localStorage.setItem('ff_data', JSON.stringify(this._data)); } catch {} },
  saveCart() { try { localStorage.setItem('ff_cart', JSON.stringify(this._cart)); } catch {} },

  resetDemo() {
    localStorage.removeItem('ff_data'); localStorage.removeItem('ff_cart');
    this._data = structuredClone(DEMO_DATA); this._cart = this._freshCart();
    this.save(); this.saveCart();
  },

  get restaurant() { return this._data.restaurant; },
  get menu()       { return this._data.menuItems; },
  get categories() { return this._data.categories; },
  get orders()     { return this._data.orders; },

  getItemsByCategory(cat) {
    return cat === 'all' ? this._data.menuItems : this._data.menuItems.filter(i => i.category === cat);
  },

  /* Cart */
  get cart() { return this._cart; },
  setTable(n)      { this._cart.tableNumber = n; this.saveCart(); },
  setOrderType(t)  { this._cart.orderType = t;   this.saveCart(); },

  addToCart(id, pidx = 0) {
    const item = this._data.menuItems.find(i => i.id === id);
    if (!item || !item.available) return;
    const person = this._cart.persons[pidx];
    if (!person) return;
    const ex = person.items.find(i => i.id === id);
    if (ex) { ex.quantity++; }
    else { person.items.push({ id: item.id, name: item.name, price: item.price, quantity: 1 }); }
    this.saveCart();
  },

  removeFromCart(id, pidx = 0) {
    const person = this._cart.persons[pidx];
    if (!person) return;
    const ex = person.items.find(i => i.id === id);
    if (!ex) return;
    if (ex.quantity > 1) { ex.quantity--; } else { person.items = person.items.filter(i => i.id !== id); }
    this.saveCart();
  },

  getQty(id, pidx = 0) {
    const person = this._cart.persons[pidx];
    if (!person) return 0;
    const item = person.items.find(i => i.id === id);
    return item ? item.quantity : 0;
  },

  cartCount() {
    return this._cart.persons.reduce((s, p) => s + p.items.reduce((ss, i) => ss + i.quantity, 0), 0);
  },

  cartSubtotal() {
    return this._cart.persons.reduce((s, p) => s + p.items.reduce((ss, i) => ss + i.price * i.quantity, 0), 0);
  },

  addPerson(name) {
    this._cart.persons.push({ name, items: [] });
    this.saveCart();
    return this._cart.persons.length - 1;
  },

  placeOrder() {
    const subtotal = this.cartSubtotal();
    const tax      = +(subtotal * TAX_RATE).toFixed(0);
    const order = {
      id:          'FF-' + String(this._data.orders.length + 1).padStart(4, '0'),
      tableNumber: this._cart.tableNumber || 'Takeout',
      orderType:   this._cart.orderType || 'dine-in',
      persons:     structuredClone(this._cart.persons),
      status:      'pending',
      subtotal, tax, total: subtotal + tax,
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
    const o = this._data.orders.find(o => o.id === id);
    if (o) { o.status = status; this.save(); }
    return o;
  },

  getOrdersByStatus(status) {
    if (!status || status === 'all') return this._data.orders;
    return this._data.orders.filter(o => o.status === status);
  },

  getStats() {
    const orders = this._data.orders;
    const now = new Date();
    const today = orders.filter(o => {
      const d = new Date(o.createdAt);
      return d.toDateString() === now.toDateString();
    });
    return {
      totalOrders: orders.length,
      todayOrders: today.length,
      todayRevenue: today.reduce((s, o) => s + o.total, 0),
      pendingOrders: orders.filter(o => ['pending','preparing'].includes(o.status)).length,
      avgOrderValue: orders.length ? orders.reduce((s, o) => s + o.total, 0) / orders.length : 0,
      completedToday: today.filter(o => o.status === 'completed').length
    };
  }
};

/* ─────────────────────────────────────────────
   UTILITIES
───────────────────────────────────────────── */
function formatPrice(p) {
  return 'J$' + new Intl.NumberFormat('en-JM').format(Math.round(p));
}

function timeSince(iso) {
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (diff < 60)   return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  return `${Math.floor(diff/3600)}h ${Math.floor((diff%3600)/60)}m ago`;
}

function elapsedMins(iso) {
  return Math.floor((Date.now() - new Date(iso)) / 60000);
}

function escapeHtml(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function showToast(msg, type='default', duration=3000) {
  let tc = document.getElementById('toast-container');
  if (!tc) {
    tc = document.createElement('div'); tc.id = 'toast-container';
    Object.assign(tc.style, { position:'fixed', bottom:'1.5rem', right:'1.5rem', zIndex:'9999', display:'flex', flexDirection:'column', gap:'.5rem' });
    document.body.appendChild(tc);
  }
  const t = document.createElement('div');
  const colors = { success:'#FF4D00', error:'#FF1744', warning:'#FF8C00', default:'#FF8C00' };
  t.style.cssText = `
    display:flex;align-items:center;gap:.6rem;
    background:#1A1008;color:#E8D5B0;
    border:1px solid rgba(255,77,0,.25);
    border-left:3px solid ${colors[type]||colors.default};
    padding:.75rem 1rem;border-radius:4px;font-size:.84rem;
    font-family:'Space Grotesk',sans-serif;
    box-shadow:0 8px 32px rgba(0,0,0,.7), 0 0 20px rgba(255,77,0,.1);
    animation:ffToastIn .25s ease;max-width:320px;
    transition:opacity .3s,transform .3s;
  `;
  t.innerHTML = `<span>${escapeHtml(msg)}</span>`;
  tc.appendChild(t);
  if (!document.getElementById('ff-toast-kf')) {
    const s = document.createElement('style'); s.id='ff-toast-kf';
    s.textContent='@keyframes ffToastIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}';
    document.head.appendChild(s);
  }
  setTimeout(() => { t.style.opacity='0'; t.style.transform='translateX(20px)'; setTimeout(()=>t.remove(),300); }, duration);
}

function statusLabel(s) { return {pending:'Pending',preparing:'Preparing',ready:'Ready',completed:'Completed'}[s]||s; }
function statusClass(s) { return {pending:'badge-amber',preparing:'badge-blue',ready:'badge-green',completed:'badge-muted'}[s]||'badge-muted'; }

window.Store       = Store;
window.TAX_RATE    = TAX_RATE;
window.formatPrice = formatPrice;
window.timeSince   = timeSince;
window.elapsedMins = elapsedMins;
window.escapeHtml  = escapeHtml;
window.showToast   = showToast;
window.statusLabel = statusLabel;
window.statusClass = statusClass;