/* ══ NARDOS DEMO SEED ══
   Run this once to populate realistic demo data.
   Called from each page on first load if no data exists.
*/
(function seedDemo() {
  // Only seed if no orders exist
  const existing = localStorage.getItem('nardos_orders');
  if (existing && JSON.parse(existing).length > 0) return;

  const now = Date.now();

  const orders = [
    {
      id: 'ORD-0001',
      student: 'Tamara',
      hall: 'Chancellor Hall',
      wantsDelivery: false,
      deliveryFee: 0,
      items: [
        { id:'bg2', name:'Double Stack Burger', price:1350, qty:1, personName:'Tamara' },
        { id:'fr2', name:'Seasoned Fries',      price:400,  qty:1, personName:'Tamara' },
        { id:'bv1', name:'Soft Drink (Canned)', price:200,  qty:1, personName:'Tamara' }
      ],
      persons: [
        { name:'Tamara', items:[
          { id:'bg2', name:'Double Stack Burger', price:1350, qty:1 },
          { id:'fr2', name:'Seasoned Fries',      price:400,  qty:1 },
          { id:'bv1', name:'Soft Drink (Canned)', price:200,  qty:1 }
        ]}
      ],
      notes: 'No tomatoes on the burger please',
      status: 'preparing',
      subtotal: 1950, total: 1950,
      prepMins: 12,
      timerEnd: new Date(now + 7 * 60000).toISOString(),
      timerMins: 12,
      createdAt: new Date(now - 5 * 60000).toISOString(),
      updatedAt: new Date(now - 2 * 60000).toISOString()
    },
    {
      id: 'ORD-0002',
      student: 'Devon',
      hall: 'Taylor Hall',
      wantsDelivery: true,
      deliveryFee: 200,
      items: [
        { id:'ml3', name:'Jerk Chicken & Rice', price:1100, qty:1, personName:'Devon'  },
        { id:'bv4', name:'Energy Drink',         price:450,  qty:1, personName:'Devon'  },
        { id:'sn6', name:'Patty',                price:250,  qty:2, personName:'Devon'  }
      ],
      persons: [
        { name:'Devon', items:[
          { id:'ml3', name:'Jerk Chicken & Rice', price:1100, qty:1 },
          { id:'bv4', name:'Energy Drink',         price:450,  qty:1 },
          { id:'sn6', name:'Patty',                price:250,  qty:2 }
        ]}
      ],
      notes: '',
      status: 'pending',
      subtotal: 2050, total: 2250,
      prepMins: 15,
      timerEnd: null,
      createdAt: new Date(now - 1 * 60000).toISOString(),
      updatedAt: new Date(now - 1 * 60000).toISOString()
    },
    {
      id: 'ORD-0003',
      student: 'Kezia & Marcus',
      hall: '',
      wantsDelivery: false,
      deliveryFee: 0,
      items: [
        { id:'bg1', name:'Classic Beef Burger', price:950, qty:1, personName:'Kezia'  },
        { id:'hd2', name:'Loaded Hot Dog',       price:750, qty:1, personName:'Marcus' },
        { id:'fr3', name:'Loaded Cheese Fries',  price:650, qty:1, personName:'Kezia'  },
        { id:'bv5', name:'Homemade Lemonade',    price:300, qty:2, personName:'Kezia'  }
      ],
      persons: [
        { name:'Kezia',  items:[ { id:'bg1', name:'Classic Beef Burger', price:950, qty:1 }, { id:'fr3', name:'Loaded Cheese Fries', price:650, qty:1 }, { id:'bv5', name:'Homemade Lemonade', price:300, qty:1 } ] },
        { name:'Marcus', items:[ { id:'hd2', name:'Loaded Hot Dog', price:750, qty:1 }, { id:'bv5', name:'Homemade Lemonade', price:300, qty:1 } ] }
      ],
      notes: 'Extra napkins',
      status: 'ready',
      subtotal: 2950, total: 2950,
      prepMins: 10,
      timerEnd: new Date(now - 2 * 60000).toISOString(),
      createdAt: new Date(now - 18 * 60000).toISOString(),
      updatedAt: new Date(now - 3 * 60000).toISOString()
    }
  ];

  const queue = [
    { id:'Q-1', name:'Tamara',  hall:'Chancellor Hall', joinedAt: new Date(now - 5*60000).toISOString(), estimateMins:12, estimatedReady: new Date(now + 7*60000).toISOString(), served:false },
    { id:'Q-2', name:'Devon',   hall:'Taylor Hall',     joinedAt: new Date(now - 1*60000).toISOString(), estimateMins:15, estimatedReady: new Date(now + 14*60000).toISOString(), served:false },
    { id:'Q-3', name:'Kezia',   hall:'',                joinedAt: new Date(now - 18*60000).toISOString(), estimateMins:10, estimatedReady: new Date(now - 2*60000).toISOString(), served:false }
  ];

  localStorage.setItem('nardos_orders', JSON.stringify(orders));
  localStorage.setItem('nardos_queue',  JSON.stringify(queue));
})();
