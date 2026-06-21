/* ==========================================================================
   D&D WHOLESALE LTD — DEMO DATA LAYER
   All "database" state lives in localStorage so every page (and every
   role) reads and writes the same shared records. This file seeds that
   data on first run and exposes small helpers the page scripts use.
   ========================================================================== */

   const DND = (() => {

    const KEYS = {
      menu: 'dnd_menu',
      staff: 'dnd_staff',
      inventory: 'dnd_inventory',
      ratings: 'dnd_ratings',
      queue: 'dnd_queue',
      cart: 'dnd_cart',
      role: 'dnd_role',
      seeded: 'dnd_seeded_v1'
    };
  
    /* ---- Categories shared by menu + inventory ---- */
    const CATEGORIES = [
      { id: 'snacks',    name: 'Snacks & Biscuits',     icon: 'cookie',      swatch: 'swatch-2' },
      { id: 'beverages', name: 'Beverages',             icon: 'cup-soda',    swatch: 'swatch-5' },
      { id: 'canned',    name: 'Canned & Packaged',     icon: 'package',     swatch: 'swatch-1' },
      { id: 'grains',    name: 'Rice, Grains & Cereal', icon: 'wheat',       swatch: 'swatch-7' },
      { id: 'baking',    name: 'Baking & Cooking',      icon: 'chef-hat',    swatch: 'swatch-6' },
      { id: 'household', name: 'Household & Cleaning',  icon: 'spray-can',   swatch: 'swatch-3' },
      { id: 'personal',  name: 'Personal Care',         icon: 'droplets',    swatch: 'swatch-8' },
      { id: 'specials',  name: 'Top-Up Specials',       icon: 'gift',        swatch: 'swatch-4' }
    ];
  
    const STAFF_POSITIONS = [
      'Store Manager', 'Cashier', 'Warehouse Supervisor',
      'Customer Service', 'Delivery Coordinator', 'Inventory Clerk', 'Sales Associate'
    ];
  
    const SEED_MENU = [
      { id: 'M01', name: 'Excelsior Water Crackers 400g', category: 'snacks',    unit: 'Case of 24', price: 3120, desc: 'Classic crisp crackers, the Jamaican breakfast staple.', inStock: true },
      { id: 'M02', name: 'Tastee Cheese Crackers',          category: 'snacks',    unit: 'Case of 24', price: 2880, desc: 'Sharp cheese-flavoured snack crackers.', inStock: true },
      { id: 'M03', name: 'Honey Bun Original 6-Pack',       category: 'snacks',    unit: 'Box of 12',  price: 1560, desc: 'Soft glazed buns, a lunchbox favourite.', inStock: true },
      { id: 'M04', name: 'Ting Grapefruit Soda 500ml',      category: 'beverages', unit: 'Case of 24', price: 3360, desc: 'Sparkling Jamaican grapefruit soda.', inStock: true },
      { id: 'M05', name: 'Pepsi Cola 500ml',                category: 'beverages', unit: 'Case of 24', price: 3120, desc: 'Carbonated cola soft drink.', inStock: true },
      { id: 'M06', name: 'Wata Bottled Water 1.5L',         category: 'beverages', unit: 'Case of 12', price: 1080, desc: 'Purified drinking water.', inStock: true },
      { id: 'M07', name: 'Grace Corned Beef 340g',          category: 'canned',    unit: 'Case of 24', price: 9600, desc: 'Premium corned beef in a tin.', inStock: true },
      { id: 'M08', name: 'Grace Mackerel in Tomato Sauce',  category: 'canned',    unit: 'Case of 24', price: 5760, desc: '155g tins, ready to season and serve.', inStock: false },
      { id: 'M09', name: 'Grace Baked Beans 230g',          category: 'canned',    unit: 'Case of 24', price: 4320, desc: 'Baked beans in rich tomato sauce.', inStock: true },
      { id: 'M10', name: 'Tropical Rice 5lb',               category: 'grains',    unit: 'Bag',        price: 950,  desc: 'Long grain white rice.', inStock: true },
      { id: 'M11', name: 'National Oats Quick Cooking 800g',category: 'grains',    unit: 'Each',       price: 620,  desc: 'Quick-cook rolled oats.', inStock: true },
      { id: 'M12', name: 'Excelsior Plain Flour 5lb',       category: 'baking',    unit: 'Bag',        price: 780,  desc: 'All-purpose plain flour.', inStock: true },
      { id: 'M13', name: 'National Granulated Sugar 5lb',   category: 'baking',    unit: 'Bag',        price: 850,  desc: 'Fine granulated white sugar.', inStock: true },
      { id: 'M14', name: 'National Baking Powder 113g',     category: 'baking',    unit: 'Each',       price: 280,  desc: 'Double-acting baking powder.', inStock: true },
      { id: 'M15', name: 'Grace Coconut Milk Powder 200g',  category: 'baking',    unit: 'Each',       price: 480,  desc: 'For curries, soups and porridge.', inStock: true },
      { id: 'M16', name: 'Lasco Bleach 1L',                 category: 'household', unit: 'Case of 12', price: 2160, desc: 'Household bleach for cleaning and laundry.', inStock: true },
      { id: 'M17', name: 'Mortein Insect Killer 300ml',     category: 'household', unit: 'Each',       price: 650,  desc: 'Fast-acting insect spray.', inStock: true },
      { id: 'M18', name: 'Suprema Dish Soap 750ml',         category: 'household', unit: 'Case of 12', price: 3600, desc: 'Grease-cutting dish washing liquid.', inStock: true },
      { id: 'M19', name: 'Lifebuoy Soap Bar 125g',          category: 'personal',  unit: 'Case of 48', price: 4800, desc: 'Antibacterial bar soap.', inStock: true },
      { id: 'M20', name: 'Colgate Toothpaste 100ml',        category: 'personal',  unit: 'Case of 24', price: 5040, desc: 'Cavity protection toothpaste.', inStock: true },
      { id: 'M21', name: 'Top-Up Special: Family Bundle',   category: 'specials',  unit: 'Bundle',     price: 3500, desc: 'Rice, oil, flour, sugar, tin mackerel and crackers.', inStock: true },
      { id: 'M22', name: 'Top-Up Special: Snack Pack',      category: 'specials',  unit: 'Bundle',     price: 1800, desc: 'Crackers, juice, biscuits and a honey bun.', inStock: true }
    ];
  
    const SEED_STAFF = [
      { id: 'S01', employeeId: 'DD-001', name: 'Andre Campbell',  position: 'Store Manager',        dob: '1985-03-14', photo: '' },
      { id: 'S02', employeeId: 'DD-002', name: 'Tanya Brown',      position: 'Cashier',              dob: '1998-07-22', photo: '' },
      { id: 'S03', employeeId: 'DD-003', name: 'Marlon Reid',      position: 'Warehouse Supervisor', dob: '1990-11-05', photo: '' },
      { id: 'S04', employeeId: 'DD-004', name: 'Kerry-Ann Wilson', position: 'Customer Service',     dob: '2000-02-18', photo: '' },
      { id: 'S05', employeeId: 'DD-005', name: 'Devon Clarke',     position: 'Delivery Coordinator', dob: '1993-09-30', photo: '' },
      { id: 'S06', employeeId: 'DD-006', name: 'Simone Grant',     position: 'Inventory Clerk',      dob: '1996-05-09', photo: '' }
    ];
  
    const SEED_INVENTORY = [
      { id: 'I01', sku: 'DND-1001', name: 'Excelsior Water Crackers 400g', category: 'snacks',    qty: 18, unit: 'case',   reorder: 10, cost: 2600, supplier: 'Excelsior Foods Ltd', bin: 'A1', updated: '2026-06-10' },
      { id: 'I02', sku: 'DND-1002', name: 'Tastee Cheese Crackers',         category: 'snacks',    qty: 6,  unit: 'case',   reorder: 10, cost: 2400, supplier: 'Excelsior Foods Ltd', bin: 'A2', updated: '2026-06-09' },
      { id: 'I03', sku: 'DND-1003', name: 'Honey Bun Original 6-Pack',      category: 'snacks',    qty: 30, unit: 'box',    reorder: 12, cost: 1300, supplier: 'National Bakery',     bin: 'A3', updated: '2026-06-11' },
      { id: 'I04', sku: 'DND-2001', name: 'Ting Grapefruit Soda 500ml',     category: 'beverages', qty: 24, unit: 'case',   reorder: 15, cost: 2800, supplier: 'Wisynco Group',       bin: 'B1', updated: '2026-06-12' },
      { id: 'I05', sku: 'DND-2002', name: 'Pepsi Cola 500ml',               category: 'beverages', qty: 9,  unit: 'case',   reorder: 15, cost: 2600, supplier: 'Wisynco Group',       bin: 'B2', updated: '2026-06-08' },
      { id: 'I06', sku: 'DND-2003', name: 'Wata Bottled Water 1.5L',        category: 'beverages', qty: 40, unit: 'case',   reorder: 20, cost: 900,  supplier: 'Wisynco Group',       bin: 'B3', updated: '2026-06-12' },
      { id: 'I07', sku: 'DND-3001', name: 'Grace Corned Beef 340g',         category: 'canned',    qty: 20, unit: 'case',   reorder: 12, cost: 8200, supplier: 'GraceKennedy Ltd',    bin: 'C1', updated: '2026-06-07' },
      { id: 'I08', sku: 'DND-3002', name: 'Grace Mackerel in Tomato Sauce', category: 'canned',    qty: 5,  unit: 'case',   reorder: 10, cost: 4900, supplier: 'GraceKennedy Ltd',    bin: 'C2', updated: '2026-06-05' },
      { id: 'I09', sku: 'DND-3003', name: 'Grace Baked Beans 230g',         category: 'canned',    qty: 16, unit: 'case',   reorder: 10, cost: 3700, supplier: 'GraceKennedy Ltd',    bin: 'C3', updated: '2026-06-11' },
      { id: 'I10', sku: 'DND-4001', name: 'Tropical Rice 5lb',              category: 'grains',    qty: 60, unit: 'bag',    reorder: 25, cost: 780,  supplier: 'Tropical Sugar Co',   bin: 'D1', updated: '2026-06-12' },
      { id: 'I11', sku: 'DND-4002', name: 'National Oats Quick Cooking',    category: 'grains',    qty: 22, unit: 'each',   reorder: 15, cost: 520,  supplier: 'National Bakery',     bin: 'D2', updated: '2026-06-10' },
      { id: 'I12', sku: 'DND-5001', name: 'Excelsior Plain Flour 5lb',      category: 'baking',    qty: 8,  unit: 'bag',    reorder: 15, cost: 650,  supplier: 'Excelsior Foods Ltd', bin: 'E1', updated: '2026-06-09' },
      { id: 'I13', sku: 'DND-6001', name: 'Lasco Bleach 1L',                category: 'household', qty: 14, unit: 'case',   reorder: 10, cost: 1850, supplier: 'Lasco Distributors',  bin: 'F1', updated: '2026-06-11' },
      { id: 'I14', sku: 'DND-7001', name: 'Lifebuoy Soap Bar 125g',         category: 'personal',  qty: 12, unit: 'case',   reorder: 10, cost: 4000, supplier: 'Lifebuoy Caribbean',  bin: 'G1', updated: '2026-06-10' },
      { id: 'I15', sku: 'DND-8001', name: 'Top-Up Special: Family Bundle',  category: 'specials',  qty: 25, unit: 'bundle', reorder: 10, cost: 2900, supplier: 'In-house packing',    bin: 'H1', updated: '2026-06-12' }
    ];
  
    const SEED_RATINGS = [
      { id: 'R01', customer: 'Paula M.',    staffId: 'S02', category: 'Service',        type: 'rating',    stars: 5, message: 'Tanya checked me out quickly and even helped carry a case of water to the car. Excellent service!', status: 'resolved', date: '2026-06-10' },
      { id: 'R02', customer: 'Richard G.',  staffId: '',    category: 'Pricing',        type: 'rating',    stars: 4, message: 'Great prices on the Top-Up Special bundle. Would love to see more bundle options for big families.', status: 'resolved', date: '2026-06-11' },
      { id: 'R03', customer: 'Keisha A.',   staffId: 'S03', category: 'Product Quality', type: 'complaint', stars: 2, message: 'A case of crackers I bought was close to the expiry date. Please check stock rotation in the warehouse.', status: 'open', date: '2026-06-12' },
      { id: 'R04', customer: 'O. Thompson', staffId: 'S01', category: 'Service',        type: 'rating',    stars: 5, message: 'Mr. Campbell sorted out a delivery mix-up for me within minutes. Really appreciated it.', status: 'resolved', date: '2026-06-09' },
      { id: 'R05', customer: 'Anonymous',   staffId: '',    category: 'Cleanliness',    type: 'complaint', stars: 3, message: 'The floor near the entrance gets slippery when it rains. A mat at the door would help.', status: 'open', date: '2026-06-08' }
    ];
  
    const SEED_QUEUE = [
      { id: 'Q046', number: 46, customer: 'Leon B.',    items: [{ name: 'Lasco Bleach 1L', qty: 1 }, { name: 'Tastee Cheese Crackers', qty: 1 }], status: 'done',    time: '9:14 AM' },
      { id: 'Q047', number: 47, customer: 'Michael S.', items: [{ name: 'Top-Up Special: Family Bundle', qty: 1 }, { name: 'Wata Bottled Water 1.5L', qty: 2 }], status: 'serving', time: '9:26 AM' },
      { id: 'Q048', number: 48, customer: 'Donna P.',   items: [{ name: 'Grace Corned Beef 340g', qty: 1 }], status: 'waiting', time: '9:31 AM' }
    ];
  
    /* ---- low level storage ---- */
    function read(key, fallback){
      try{
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      }catch(e){
        return fallback;
      }
    }
    function write(key, value){
      try{
        localStorage.setItem(key, JSON.stringify(value));
      }catch(e){ /* storage unavailable - demo continues in-memory only */ }
    }
  
    function seed(){
      if (read(KEYS.seeded, null)) return;
      write(KEYS.menu, SEED_MENU);
      write(KEYS.staff, SEED_STAFF);
      write(KEYS.inventory, SEED_INVENTORY);
      write(KEYS.ratings, SEED_RATINGS);
      write(KEYS.queue, SEED_QUEUE);
      write(KEYS.cart, []);
      write(KEYS.role, 'customer');
      write(KEYS.seeded, true);
    }
  
    /* ---- public getters / setters ---- */
    const Menu      = { all: () => read(KEYS.menu, []),      save: (v) => write(KEYS.menu, v) };
    const Staff     = { all: () => read(KEYS.staff, []),     save: (v) => write(KEYS.staff, v) };
    const Inventory = { all: () => read(KEYS.inventory, []), save: (v) => write(KEYS.inventory, v) };
    const Ratings   = { all: () => read(KEYS.ratings, []),   save: (v) => write(KEYS.ratings, v) };
    const Queue     = { all: () => read(KEYS.queue, []),     save: (v) => write(KEYS.queue, v) };
    const Cart      = { all: () => read(KEYS.cart, []),      save: (v) => write(KEYS.cart, v) };
  
    function getRole(){ return read(KEYS.role, 'customer'); }
    function setRole(role){ write(KEYS.role, role); }
  
    function nextId(prefix, list){
      let max = 0;
      list.forEach(item => {
        const m = String(item.id || '').match(/(\d+)$/);
        if (m) max = Math.max(max, parseInt(m[1], 10));
      });
      return prefix + String(max + 1).padStart(2, '0');
    }
  
    /* ---- formatting helpers ---- */
    function formatJMD(amount){
      return '$' + Number(amount || 0).toLocaleString('en-JM', { maximumFractionDigits: 0 });
    }
  
    function categoryById(id){
      return CATEGORIES.find(c => c.id === id) || CATEGORIES[0];
    }
  
    function staffById(id){
      return Staff.all().find(s => s.id === id);
    }
  
    function initials(name){
      return String(name || '')
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(p => p[0].toUpperCase())
        .join('');
    }
  
    const AVATAR_COLORS = ['#1B3358', '#D7263D', '#3D5C8C', '#8C3140', '#28467D', '#B5453F'];
    function avatarColor(name){
      let hash = 0;
      for (let i = 0; i < String(name).length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
      return AVATAR_COLORS[hash % AVATAR_COLORS.length];
    }
  
    function formatDateLong(iso){
      if (!iso) return '\u2014';
      const d = new Date(iso + 'T00:00:00');
      if (isNaN(d.getTime())) return iso;
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }
  
    function age(dobIso){
      const dob = new Date(dobIso + 'T00:00:00');
      if (isNaN(dob.getTime())) return null;
      const now = new Date('2026-06-15T00:00:00');
      let a = now.getFullYear() - dob.getFullYear();
      const m = now.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) a--;
      return a;
    }
  
    return {
      KEYS, CATEGORIES, STAFF_POSITIONS,
      seed, Menu, Staff, Inventory, Ratings, Queue, Cart,
      getRole, setRole, nextId,
      formatJMD, formatDateLong, age, categoryById, staffById, initials, avatarColor
    };
  })();
  
  DND.seed();