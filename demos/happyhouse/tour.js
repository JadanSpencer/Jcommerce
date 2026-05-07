'use strict';
/* ═══════════════════════════════════════════════════════════
   HAPPY HOUSE — Guided Tour System
   Works on all pages: index, menu, admin, kitchen
═══════════════════════════════════════════════════════════ */

const Tour = (() => {

  const TOURS = {
    'index': [
      {
        title: 'Welcome to Happy House! 🇯🇲',
        body: 'This is the guest entry point. Customers enter their table number and browse the full menu. No app, no sign-up — just good food, fast.',
        icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>`,
        target: null,
        position: 'center',
        cta: 'Next'
      },
      {
        title: 'Enter Table Number',
        body: 'Guests type their table number (1–99) or select Takeout. The system remembers their table for the whole ordering session.',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 4v16M16 4v16M3 10h18"/></svg>`,
        target: '#table-input',
        position: 'bottom',
        cta: 'Next'
      },
      {
        title: 'View Menu Button',
        body: 'After entering a table number, guests click here to browse the full Happy House menu — one click, no friction.',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`,
        target: '#continue-btn',
        position: 'top',
        cta: 'Next'
      },
      {
        title: 'Order on WhatsApp',
        body: 'Customers can also order directly on WhatsApp — great for takeaway and delivery orders from outside the restaurant.',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`,
        target: '.hero-actions .btn-cream',
        position: 'bottom',
        cta: 'Next'
      },
      {
        title: 'Staff Access',
        body: 'Restaurant staff access the Admin Panel and Kitchen Display from here. These views manage orders, menus, and real-time kitchen operations.',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
        target: '.nav-links',
        position: 'bottom',
        cta: 'Explore the Menu →'
      }
    ],

    'menu': [
      {
        title: 'The Happy House Menu',
        body: 'This is what guests see on their phones. Browse all our Jamaican specialties, add items to cart, and place your order right from here.',
        icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`,
        target: null,
        position: 'center',
        cta: 'Next'
      },
      {
        title: 'Browse by Category',
        body: 'Tap a category to filter. Sandwiches, Wraps, Sides, and Drinks — switch instantly with a single tap.',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`,
        target: '#cat-tabs',
        position: 'bottom',
        cta: 'Next'
      },
      {
        title: 'Add to Your Order',
        body: 'Each item shows its name, description, price, and tags. Tap + to add an item, or – to remove one. Your cart updates instantly.',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>`,
        target: '#menu-grid',
        position: 'top',
        cta: 'Next'
      },
      {
        title: 'Group Ordering',
        body: 'Ordering for a group? Add multiple people — each person\'s items are tracked separately. Split bills made easy.',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>`,
        target: '#person-tabs',
        mobileTarget: '#add-person-mobile',
        position: 'bottom',
        cta: 'Next'
      },
      {
        title: 'Your Cart',
        body: 'Review items, adjust quantities, add special notes, and see the running total with tax. One tap sends the order straight to our kitchen.',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 22c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"/><path d="M20 22c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>`,
        target: '#sidebar',
        mobileTarget: '#cart-drawer',
        position: 'left',
        cta: 'Got it!'
      }
    ],

    'admin': [
      {
        title: 'Admin Dashboard',
        body: 'Welcome to Happy House Admin! Manage orders, update the menu, and track your team — all in one place.',
        icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`,
        target: null,
        position: 'center',
        cta: 'Next'
      },
      {
        title: 'Live Stats',
        body: 'See today\'s order count, revenue, and pending orders at a glance. Stats update every 10 seconds automatically.',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
        target: '.stats-grid',
        position: 'bottom',
        cta: 'Next'
      },
      {
        title: 'Order Management',
        body: 'Filter orders by status, advance them through Pending → Preparing → Ready → Completed. Customers are kept informed at every step.',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>`,
        target: '.tab-panel.active',
        position: 'top',
        cta: 'Next'
      },
      {
        title: 'Menu Manager',
        body: 'Add, edit, or remove menu items. Toggle availability on/off instantly — changes reflect on the customer-facing menu immediately.',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/></svg>`,
        target: '.admin-nav',
        position: 'right',
        cta: 'Next'
      },
      {
        title: 'Kitchen Display',
        body: 'The Kitchen Display shows live orders to your kitchen team. They can advance order status with one tap — no paper tickets needed.',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`,
        target: '.admin-nav',
        position: 'right',
        cta: 'Got it!'
      }
    ],

    'kitchen': [
      {
        title: 'Kitchen Display System',
        body: 'Welcome, team! This screen shows all active orders in real-time. It refreshes every 5 seconds automatically — no manual refresh needed.',
        icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`,
        target: null,
        position: 'center',
        cta: 'Next'
      },
      {
        title: 'Status Overview',
        body: 'The status bar at the top shows live counts: how many orders are Pending, Preparing, Ready, and Completed.',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
        target: '.kitchen-status',
        position: 'bottom',
        cta: 'Next'
      },
      {
        title: 'Filter Orders',
        body: 'Use the filter rail to focus on specific statuses. "Active" shows Pending + Preparing + Ready — what needs action right now.',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`,
        target: '.kitchen-filter-wrap',
        position: 'bottom',
        cta: 'Next'
      },
      {
        title: 'Order Cards',
        body: 'Each card shows table number, order time, items, and any special notes. Orange glow means the order has been waiting a while — prioritize it!',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/></svg>`,
        target: '#orders-grid',
        position: 'top',
        cta: 'Next'
      },
      {
        title: 'Advance Order Status',
        body: 'Tap the big action button on each card to move it forward: Start Preparing → Mark Ready → Complete & Send. Admin panel updates instantly.',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>`,
        target: '#orders-grid',
        position: 'top',
        cta: 'All done! Let\'s cook! 🔥'
      }
    ]
  };

  /* ── STYLES ─────────────────────────────────────────────── */
  const CSS = `
    .tour-overlay {
      position: fixed; inset: 0; z-index: 9000;
      pointer-events: none;
    }
    .tour-backdrop {
      position: fixed; inset: 0;
      background: rgba(45,31,26,.72);
      backdrop-filter: blur(3px);
      -webkit-backdrop-filter: blur(3px);
      transition: opacity 0.3s;
      z-index: 9001;
    }
    .tour-highlight {
      position: fixed;
      border-radius: 14px;
      box-shadow: 0 0 0 9999px rgba(45,31,26,.72);
      z-index: 9002;
      pointer-events: none;
      transition: all 0.35s cubic-bezier(0.22,1,0.36,1);
    }
    .tour-popup {
      position: fixed;
      z-index: 9003;
      background: #fff;
      border-radius: 20px;
      padding: 1.75rem;
      width: min(360px, calc(100vw - 2rem));
      max-height: 85vh;
      overflow-y: auto;
      box-shadow: 0 24px 64px rgba(45,31,26,.24), 0 4px 16px rgba(0,0,0,.08);
      border: 1px solid rgba(200,81,106,.12);
      animation: tourPopIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
    }
    @keyframes tourPopIn {
      from { opacity:0; transform:scale(0.88) translateY(10px); }
      to   { opacity:1; transform:scale(1) translateY(0); }
    }
    .tour-popup-icon {
      width: 52px; height: 52px;
      background: #FDF3F5;
      border-radius: 14px;
      display: grid; place-items: center;
      color: #C8516A;
      margin-bottom: 1rem;
    }
    .tour-popup-step {
      font-size: 0.62rem; font-weight: 700;
      letter-spacing: 0.2em; text-transform: uppercase;
      color: #C8516A; margin-bottom: 0.4rem;
    }
    .tour-popup-title {
      font-family: 'Playfair Display', serif;
      font-size: 1.15rem; font-weight: 700;
      color: #2D1F1A; margin-bottom: 0.5rem; line-height: 1.3;
    }
    .tour-popup-body {
      font-size: 0.875rem; line-height: 1.65;
      color: #7A5C50; margin-bottom: 1.5rem;
    }
    .tour-popup-foot {
      display: flex; align-items: center; justify-content: space-between; gap: 1rem;
    }
    .tour-dots {
      display: flex; gap: 5px; align-items: center;
    }
    .tour-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: #EDE0CE; transition: all 0.2s;
    }
    .tour-dot.active { background: #C8516A; width: 18px; border-radius: 3px; }
    .tour-btn-skip {
      font-size: 0.78rem; font-weight: 500; color: #B09080;
      background: none; border: none; cursor: pointer; padding: 0.25rem;
      transition: color 0.15s;
    }
    .tour-btn-skip:hover { color: #7A5C50; }
    .tour-btn-next {
      background: #C8516A; color: #fff;
      border: none; border-radius: 10px;
      padding: 0.6rem 1.4rem;
      font-size: 0.84rem; font-weight: 700;
      cursor: pointer; letter-spacing: 0.01em;
      font-family: inherit;
      transition: all 0.18s;
      white-space: nowrap;
    }
    .tour-btn-next:hover { background: #B8415A; transform: translateY(-1px); }
    .tour-btn-next:active { transform: scale(0.97); }
  `;

  let el = { overlay:null, highlight:null, popup:null };
  let step = 0;
  let pageTours = [];

  function injectStyles() {
    if (document.getElementById('tour-css')) return;
    const s = document.createElement('style');
    s.id = 'tour-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function createElements() {
    injectStyles();
    el.overlay   = document.createElement('div');
    el.overlay.className = 'tour-overlay';
    el.highlight = document.createElement('div');
    el.highlight.className = 'tour-highlight';
    el.popup     = document.createElement('div');
    el.popup.className = 'tour-popup';
    document.body.appendChild(el.overlay);
    document.body.appendChild(el.highlight);
    document.body.appendChild(el.popup);
  }

  function destroyElements() {
    [el.overlay, el.highlight, el.popup].forEach(e => e && e.remove());
    el = { overlay:null, highlight:null, popup:null };
  }

  function positionPopup(target, position) {
    const pop  = el.popup;
    const pw   = pop.offsetWidth || 360;
    const ph   = pop.offsetHeight || 280;
    const vw   = window.innerWidth;
    const vh   = window.innerHeight;
    const pad  = 16;
  
    if (!target || position === 'center') {
      pop.style.top  = '50%';
      pop.style.left = '50%';
      pop.style.transform = 'translate(-50%,-50%)';
      return;
    }
  
    pop.style.transform = '';
    const r = target.getBoundingClientRect();
  
    let top, left;
    if (position === 'bottom') {
      top  = r.bottom + 14;
      left = r.left + r.width / 2 - pw / 2;
    } else if (position === 'top') {
      top  = r.top - ph - 14;
      left = r.left + r.width / 2 - pw / 2;
    } else if (position === 'left') {
      top  = r.top + r.height / 2 - ph / 2;
      left = r.left - pw - 14;
    } else if (position === 'right') {
      top  = r.top + r.height / 2 - ph / 2;
      left = r.right + 14;
    }
  
    // Ensure popup stays fully within viewport
    left = Math.max(pad, Math.min(left, vw - pw - pad));
    top  = Math.max(pad, Math.min(top,  vh - ph - pad));
    
    pop.style.top  = top  + 'px';
    pop.style.left = left + 'px';
  }

  function showStep(i) {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';

    const cfg = pageTours[i];
    if (!cfg) { finish(); return; }

    const isMobile = window.innerWidth < 680;
    const targetSel = isMobile && cfg.mobileTarget ? cfg.mobileTarget : cfg.target;
    const target = targetSel ? document.querySelector(targetSel) : null;

    /* Highlight */
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Wait longer for scroll to complete, then force reflow before positioning
      setTimeout(() => {
        el.popup.style.display = 'none';  // Hide briefly to force layout recalculation
        void el.popup.offsetHeight;       // Force reflow
        el.popup.style.display = '';
        
        const r = target.getBoundingClientRect();
        const pad = 8;
        Object.assign(el.highlight.style, {
          top:    (r.top    - pad) + 'px',
          left:   (r.left   - pad) + 'px',
          width:  (r.width  + pad*2) + 'px',
          height: (r.height + pad*2) + 'px',
          display: 'block'
        });
        positionPopup(target, cfg.position);
      }, 350);
    } else {
      el.highlight.style.display = 'none';
      positionPopup(null, 'center');
    }

    /* Popup content */
    const dots = pageTours.map((_, idx) =>
      `<span class="tour-dot${idx === i ? ' active' : ''}"></span>`
    ).join('');

    el.popup.innerHTML = `
      <div class="tour-popup-icon">${cfg.icon}</div>
      <div class="tour-popup-step">Step ${i+1} of ${pageTours.length}</div>
      <div class="tour-popup-title">${cfg.title}</div>
      <div class="tour-popup-body">${cfg.body}</div>
      <div class="tour-popup-foot">
        <div class="tour-dots">${dots}</div>
        <div style="display:flex;gap:.75rem;align-items:center">
          <button class="tour-btn-skip">Skip</button>
          <button class="tour-btn-next">${cfg.cta}</button>
        </div>
      </div>
    `;

    el.popup.querySelector('.tour-btn-next').addEventListener('click', () => {
      step++;
      if (step < pageTours.length) {
        el.popup.remove();
        el.popup = document.createElement('div');
        el.popup.className = 'tour-popup';
        document.body.appendChild(el.popup);
        // Small delay to allow the DOM to update before positioning
        setTimeout(() => showStep(step), 50);
      } else {
        finish();
      }
    });

    el.popup.querySelector('.tour-btn-skip').addEventListener('click', finish);
  }

  function finish() {
    // Restore scrolling
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.maxWidth = '';
    document.documentElement.style.overflowX = '';
    
    // Force cleanup of any leftover inline styles
    document.body.style.top = '';
    
    destroyElements();
  }

  function init(page) {
    pageTours = TOURS[page] || [];
    if (!pageTours.length) return;
    step = 0;
    createElements();
    showStep(0);
  }

  function restart(page) {
    finish();
    setTimeout(() => init(page), 100);
  }

  return { init, restart };
})();

window.Tour = Tour;