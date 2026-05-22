'use strict';
/* ═══════════════════════════════════════════════════════════
   NOLA'S EVENTS — Guided Demo Tour
   Fine Dining · Luana, St. Elizabeth, Jamaica
═══════════════════════════════════════════════════════════ */

const Tour = (() => {

  const TOURS = {
    'index': [
      {
        title: "Welcome to Nola's Events 🇯🇲",
        body: "This is a live demo of Nola's Events digital ordering system — fine dining on Jamaica's South Coast. Guests order from their phones, staff manage everything in real time. No app download, no sign-up.",
        icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`,
        target: null,
        position: 'center',
        cta: 'Begin Tour'
      },
      {
        title: 'Enter Your Table Number',
        body: "Guests simply type their table number when they sit down. The system remembers it for their whole session. Takeout customers select that option instead — no friction either way.",
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 4v16M16 4v16M3 10h18"/></svg>`,
        target: '#table-input',
        position: 'bottom',
        cta: 'Next'
      },
      {
        title: 'One Tap to the Menu',
        body: 'After entering their table number, guests tap here to browse the full Nola\'s Events menu. The table number is passed through to the order — zero confusion for the kitchen.',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`,
        target: '#continue-btn',
        position: 'top',
        cta: 'Next'
      },
      {
        title: 'Order via WhatsApp',
        body: "Customers can also send their order directly to Nola's WhatsApp — perfect for takeaway, events, and large group bookings.",
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`,
        target: '.hero-whatsapp',
        position: 'bottom',
        cta: 'Next'
      },
      {
        title: 'Staff Access Points',
        body: "Restaurant staff access the Kitchen Display and Admin Panel from the navigation. The Kitchen screen shows live orders; Admin handles menus, stats, and order management.",
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
        target: '.nav-links',
        position: 'bottom',
        cta: "Explore the Menu →"
      }
    ],

    'menu': [
      {
        title: "Nola's Menu",
        body: "This is what guests see at the table. Jerk Centre, Main Dishes, Sides, Bar & Cocktails, and Ice Cream & Pastry — all of Nola's South Coast specialties, beautifully presented.",
        icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`,
        target: null,
        position: 'center',
        cta: 'Next'
      },
      {
        title: 'Browse by Category',
        body: "Tap any category to filter the menu instantly. From Jerk Centre to Ice Cream & Pastry — guests can navigate the full menu without scrolling past what they don't need.",
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`,
        target: '#cat-tabs',
        position: 'bottom',
        cta: 'Next'
      },
      {
        title: 'Add Items to Order',
        body: "Each dish shows its name, description, price, and tags like 'Chef's Pick' or 'South Coast Special'. Tap + to add, − to remove. Cart updates instantly with no page reload.",
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>`,
        target: '#menu-grid',
        position: 'top',
        cta: 'Next'
      },
      {
        title: 'Group Ordering',
        body: "Ordering for a table of friends? Add multiple guests — each person's items are tracked separately. Makes splitting the bill easy and the kitchen knows exactly who ordered what.",
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>`,
        target: '#person-tabs',
        mobileTarget: '#add-person-btn',
        position: 'bottom',
        cta: 'Next'
      },
      {
        title: 'Your Order Cart',
        body: "The cart shows a live breakdown — items, quantities, GCT, and the total. Add a special note for the kitchen (allergies, preferences), then place the order with one tap.",
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>`,
        target: '#sidebar',
        mobileTarget: '#mobile-cart-btn',
        position: 'left',
        cta: 'Got it! ✓'
      }
    ],

    'kitchen': [
      {
        title: "Kitchen Display System",
        body: "Welcome to the Nola's Events Kitchen Screen. This shows all active orders in real time. It auto-refreshes every 5 seconds — no manual refresh needed during service.",
        icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`,
        target: null,
        position: 'center',
        cta: 'Next'
      },
      {
        title: 'Live Order Counts',
        body: "At a glance: how many orders are Pending, Preparing, and Ready. Red badge appears when critical orders are waiting too long — helps the team prioritise.",
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
        target: '.k-stats-bar',
        position: 'bottom',
        cta: 'Next'
      },
      {
        title: 'Three-Column Workflow',
        body: "Orders move left to right: Pending → Preparing → Ready. Each column shows items, table number, and how long the order has been waiting. Urgency glows amber or red when time is up.",
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18"/></svg>`,
        target: '.k-grid',
        position: 'top',
        cta: 'Next'
      },
      {
        title: 'One-Tap Status Update',
        body: "Tap the action button on any order card to advance it. Pending → Start Preparing → Mark Ready → Complete. The Admin panel and guest-facing order status update instantly.",
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>`,
        target: '.k-col-body',
        position: 'top',
        cta: 'Next'
      },
      {
        title: 'Station Filter',
        body: "Use the station dropdown to focus on your section — Grill, Jerk, Bar, Ice Cream, Prep. Each kitchen role sees only what's relevant to them.",
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`,
        target: '#station-filter',
        position: 'bottom',
        cta: "Let's Cook! 🔥"
      }
    ],

    'admin': [
      {
        title: 'Admin Dashboard',
        body: "Welcome to Nola's Events Admin. Manage orders, update the menu, and monitor your team's performance — all in one place, in real time.",
        icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`,
        target: null,
        position: 'center',
        cta: 'Next'
      },
      {
        title: 'Revenue & Stats',
        body: "Today's order count, total revenue, pending orders, and average order value — updated every 10 seconds. See the business at a glance before you've had your morning coffee.",
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
        target: '.a-stats-grid',
        position: 'bottom',
        cta: 'Next'
      },
      {
        title: 'Order Management',
        body: "Filter by status — All, Pending, Preparing, Ready, Completed. Click any order to see the full breakdown by person. Update order status directly from here.",
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>`,
        target: '.a-main',
        position: 'top',
        cta: 'Next'
      },
      {
        title: 'Menu Manager',
        body: "Switch to the Menu tab to add, edit, or remove items. Toggle availability on and off in real time — 86 an item and it disappears from the guest-facing menu immediately.",
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/></svg>`,
        target: '.a-nav',
        position: 'right',
        cta: 'Next'
      },
      {
        title: 'Reset Demo Data',
        body: "This is a demo — all data resets whenever you like. Use the Reset Demo button to restore the original sample orders and menu items.",
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 12a9 9 0 109-9 9 9 0 00-9 9"/><path d="M3 3v6h6"/></svg>`,
        target: '#reset-demo-btn',
        position: 'top',
        cta: 'Got it!'
      }
    ]
  };

  /* ── STYLES ── */
  const CSS = `
    .tour-overlay {
      position: fixed; inset: 0; z-index: 9000;
      pointer-events: none;
    }
    .tour-backdrop {
      position: fixed; inset: 0;
      background: rgba(12,10,7,.82);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      z-index: 9001;
    }
    .tour-highlight {
      position: fixed;
      border-radius: 14px;
      box-shadow: 0 0 0 9999px rgba(12,10,7,.82), inset 0 0 0 2px rgba(212,168,67,.5);
      z-index: 9002;
      pointer-events: none;
      transition: all 0.4s cubic-bezier(0.22,1,0.36,1);
    }
    .tour-popup {
      position: fixed;
      z-index: 9003;
      background: #1C1810;
      border: 1px solid rgba(212,168,67,.3);
      border-radius: 20px;
      padding: 1.75rem;
      width: min(360px, calc(100vw - 2rem));
      max-height: 85vh;
      overflow-y: auto;
      box-shadow: 0 32px 80px rgba(0,0,0,.7), 0 0 0 1px rgba(212,168,67,.08);
      animation: tourPopIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both;
      transition: opacity 0.25s ease;
    }
    @keyframes tourPopIn {
      from { opacity:0; transform:scale(0.86) translateY(12px); }
      to   { opacity:1; transform:scale(1)    translateY(0); }
    }
    .tour-icon {
      width: 52px; height: 52px;
      background: rgba(212,168,67,.1);
      border: 1px solid rgba(212,168,67,.2);
      border-radius: 14px;
      display: grid; place-items: center;
      color: #D4A843;
      margin-bottom: 1rem;
    }
    .tour-step-label {
      font-size: 0.62rem; font-weight: 700;
      letter-spacing: 0.2em; text-transform: uppercase;
      color: #D4A843; margin-bottom: 0.4rem;
      font-family: 'Jost', sans-serif;
    }
    .tour-title {
      font-family: 'Playfair Display', serif;
      font-size: 1.15rem; font-weight: 700;
      color: #F5ECD7; margin-bottom: 0.5rem; line-height: 1.3;
    }
    .tour-body {
      font-size: 0.875rem; line-height: 1.65;
      color: #9B8878; margin-bottom: 1.5rem;
      font-family: 'Jost', sans-serif;
    }
    .tour-footer {
      display: flex; align-items: center; justify-content: space-between; gap: 1rem;
    }
    .tour-dots {
      display: flex; gap: 5px; align-items: center;
    }
    .tour-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: rgba(212,168,67,.25); transition: all 0.2s;
    }
    .tour-dot.active { background: #D4A843; width: 18px; border-radius: 3px; }
    .tour-skip {
      font-size: 0.78rem; font-weight: 500;
      color: #6B5848;
      background: none; border: none; cursor: pointer; padding: 0.25rem;
      transition: color 0.15s; font-family: 'Jost', sans-serif;
    }
    .tour-skip:hover { color: #9B8878; }
    .tour-next {
      background: #D4A843; color: #0C0A07;
      border: none; border-radius: 10px;
      padding: 0.65rem 1.5rem;
      font-size: 0.84rem; font-weight: 700;
      cursor: pointer; letter-spacing: 0.01em;
      font-family: 'Jost', sans-serif;
      transition: all 0.18s;
      white-space: nowrap;
    }
    .tour-next:hover { background: #E8C56A; transform: translateY(-1px); }
    .tour-next:active { transform: scale(0.97); }
  `;

  let el    = { overlay:null, highlight:null, popup:null };
  let step  = 0;
  let tours = [];

  function injectStyles() {
    if (document.getElementById('tour-css')) return;
    const s = document.createElement('style');
    s.id = 'tour-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function create() {
    injectStyles();
    el.overlay   = Object.assign(document.createElement('div'), { className:'tour-overlay' });
    el.highlight = Object.assign(document.createElement('div'), { className:'tour-highlight' });
    el.popup     = Object.assign(document.createElement('div'), { className:'tour-popup' });
    document.body.append(el.overlay, el.highlight, el.popup);
  }

  function destroy() {
    Object.values(el).forEach(e => e && e.remove());
    el = { overlay:null, highlight:null, popup:null };
  }

  function positionPopup(target, position) {
    const pop = el.popup;
    const vw  = window.innerWidth;
    const vh  = window.innerHeight;
    const pad = 16;

    // On mobile always anchor with left/right insets — avoids overflow from stale offsetWidth
    if (vw < 600) {
      Object.assign(pop.style, {
        left: pad + 'px', right: pad + 'px', width: 'auto',
        top: '', bottom: '', transform: ''
      });
      // Place below target if visible, otherwise center vertically
      if (target) {
        const r = target.getBoundingClientRect();
        const spaceBelow = vh - r.bottom - pad;
        const spaceAbove = r.top - pad;
        if (spaceBelow >= 220 || spaceBelow >= spaceAbove) {
          pop.style.top    = Math.min(r.bottom + 14, vh - 240) + 'px';
          pop.style.bottom = '';
        } else {
          pop.style.bottom = pad + 'px';
          pop.style.top    = '';
        }
      } else {
        pop.style.top       = '50%';
        pop.style.transform = 'translateY(-50%)';
      }
      return;
    }

    const pw = pop.offsetWidth  || 360;
    const ph = pop.offsetHeight || 280;

    if (!target || position === 'center') {
      Object.assign(pop.style, { top:'50%', left:'50%', right:'', width:'', transform:'translate(-50%,-50%)' });
      return;
    }
    pop.style.transform = '';
    pop.style.right     = '';
    pop.style.width     = '';
    const r = target.getBoundingClientRect();
    let top, left;
    if      (position === 'bottom') { top = r.bottom + 14; left = r.left + r.width/2 - pw/2; }
    else if (position === 'top')    { top = r.top - ph - 14; left = r.left + r.width/2 - pw/2; }
    else if (position === 'left')   { top = r.top + r.height/2 - ph/2; left = r.left - pw - 14; }
    else if (position === 'right')  { top = r.top + r.height/2 - ph/2; left = r.right + 14; }

    left = Math.max(pad, Math.min(left, vw - pw - pad));
    top  = Math.max(pad, Math.min(top,  vh - ph - pad));
    Object.assign(pop.style, { top: top+'px', left: left+'px' });
  }

  function showStep(i) {
    document.body.style.overflow = 'hidden';
    const cfg   = tours[i];
    if (!cfg) { finish(); return; }
    const isMob = window.innerWidth < 700;
    const sel   = isMob && cfg.mobileTarget ? cfg.mobileTarget : cfg.target;
    const target = sel ? document.querySelector(sel) : null;
  
    const dots = tours.map((_,idx) =>
      `<span class="tour-dot${idx===i?' active':''}"></span>`
    ).join('');
  
    el.popup.innerHTML = `
      <div class="tour-icon">${cfg.icon}</div>
      <div class="tour-step-label">Step ${i+1} of ${tours.length}</div>
      <div class="tour-title">${cfg.title}</div>
      <div class="tour-body">${cfg.body}</div>
      <div class="tour-footer">
        <div class="tour-dots">${dots}</div>
        <div style="display:flex;gap:.75rem;align-items:center">
          <button class="tour-skip">Skip tour</button>
          <button class="tour-next">${cfg.cta}</button>
        </div>
      </div>
    `;
  
    el.popup.querySelector('.tour-next').addEventListener('click', () => {
      step++;
      if (step < tours.length) {
        el.popup.remove();
        el.popup = Object.assign(document.createElement('div'), { className:'tour-popup' });
        setTimeout(() => showStep(step), 50);
      } else {
        finish();
      }
    });
    el.popup.querySelector('.tour-skip').addEventListener('click', finish);
  
    function placePopup() {
      if (!el.popup.isConnected) document.body.appendChild(el.popup);
      if (!isMob) {
        const r   = target && target.getBoundingClientRect();
        const pad = 10;
        if (r) {
          Object.assign(el.highlight.style, {
            top: (r.top - pad)+'px', left: (r.left - pad)+'px',
            width: (r.width + pad*2)+'px', height: (r.height + pad*2)+'px',
            display: 'block'
          });
        }
      } else {
        el.highlight.style.display = 'none';
      }
      positionPopup(target, cfg.position);
    }
  
    if (target) {
      if (isMob) {
        document.body.style.overflow = '';
        target.scrollIntoView({ behavior: 'instant', block: 'center' });
        requestAnimationFrame(() => {
          document.body.style.overflow = 'hidden';
          placePopup();
        });
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          placePopup();
        }, 350);
      }
    } else {
      el.highlight.style.display = 'none';
      placePopup();
    }
  }

  function finish() {
    document.body.style.overflow = '';
    destroy();
  }

  function init(page) {
    tours = TOURS[page] || [];
    if (!tours.length) return;
    step = 0;
    create();
    showStep(0);
  }

  function restart(page) {
    finish();
    setTimeout(() => init(page), 100);
  }

  return { init, restart };
})();

window.Tour = Tour;