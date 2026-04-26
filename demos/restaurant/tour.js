'use strict';
/* ═══════════════════════════════════════════════════════════
   JC-EATERY — Enhanced Guided Tour System
   Works on all pages (index, menu, admin, kitchen)
   Auto-scrolls and highlights each target element
   Shows on every page load (no localStorage blocking)
═══════════════════════════════════════════════════════════ */

const Tour = (() => {

  const TOURS = {
    'index': [
      {
        title: 'Welcome to JC-Eatery',
        body: 'This is the guest entry point. From here, customers enter their table number and start ordering. No app download, no sign-up required.',
        icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>`,
        target: null,
        position: 'center',
        cta: 'Next'
      },
      {
        title: 'Enter Table Number',
        body: 'Guests type their table number (1-99) or choose Takeout. The system remembers their table throughout the ordering process.',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 4v16M16 4v16M3 10h18"/></svg>`,
        target: '#table-input',
        position: 'bottom',
        cta: 'Next'
      },
      {
        title: 'View Menu Button',
        body: 'After entering a table number, guests click here to browse the full menu. One click — no friction.',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`,
        target: '#continue-btn',
        position: 'top',
        cta: 'Next'
      },
      {
        title: 'Takeout Orders',
        body: 'Guests can also place takeout orders directly from this screen — perfect for pickup customers who want to skip the queue.',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>`,
        target: '#takeout-btn',
        position: 'bottom',
        cta: 'Next'
      },
      {
        title: 'Staff Access',
        body: 'Restaurant staff access the Admin Panel and Kitchen Display from here. These views show real-time orders and menu management tools.',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
        target: '.nav-links',
        position: 'bottom',
        cta: 'Explore the Menu →'
      }
    ],

    'menu': [
      {
        title: 'The Digital Menu',
        body: 'This is what guests see on their phones. The menu is always up-to-date, beautifully organized by category.',
        icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`,
        target: null,
        position: 'center',
        cta: 'Next'
      },
      {
        title: 'Browse by Category',
        body: 'Tap any category to filter the menu. Guests can easily switch between Starters, Mains, Desserts, and Drinks with a single tap.',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`,
        target: '#cat-tabs',
        position: 'bottom',
        cta: 'Next'
      },
      {
        title: 'Menu Items',
        body: 'Each item shows name, description, price, and tags like "Chef\'s Pick" or "Gluten-Free". Tap the + button to add to your order.',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>`,
        target: '#menu-grid',
        position: 'top',
        cta: 'Next'
      },
      {
        title: 'Group Ordering',
        body: 'Add multiple people to split the bill. Each person\'s items are tracked separately — perfect for groups and special occasions.',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>`,
        target: '#person-tabs',
        mobileTarget: '#add-person-mobile',
        position: 'bottom',
        cta: 'Next'
      },
      {
        title: 'Your Cart',
        body: 'Review all items, adjust quantities, add special notes, and see the running total with tax. One tap sends the order straight to our kitchen.',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 22c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"/><path d="M20 22c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>`,
        target: '#sidebar',
        mobileTarget: '#cart-drawer',
        position: 'left',
        cta: 'Finish Tour'
      }
    ],

    'admin': [
      {
        title: 'Admin Dashboard',
        body: 'Your restaurant command center. View order stats, manage the menu, and oversee your team — all in one place.',
        icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`,
        target: null,
        position: 'center',
        cta: 'Next'
      },
      {
        title: 'Orders Tab',
        body: 'See every order from every table. Filter by status — pending, preparing, ready, completed — and update progress in real-time.',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>`,
        target: '.admin-nav-item[data-tab="orders"]',
        position: 'right',
        cta: 'Next'
      },
      {
        title: 'Menu Manager',
        body: 'Add, edit, or remove menu items. Update prices, descriptions, dietary tags, and toggle availability instantly — no technical help needed.',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/></svg>`,
        target: '.admin-nav-item[data-tab="menu"]',
        position: 'right',
        cta: 'Next'
      },
      {
        title: 'Staff Management',
        body: 'Manage team members and their roles. Kitchen staff see only orders; managers get full access to everything.',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>`,
        target: '.admin-nav-item[data-tab="staff"]',
        position: 'right',
        cta: 'See the Kitchen →'
      }
    ],

    'kitchen': [
      {
        title: 'Kitchen Display System',
        body: 'What your kitchen team sees. Orders appear instantly when guests tap "Place Order" — no paper tickets, no lost orders.',
        icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`,
        target: null,
        position: 'center',
        cta: 'Next'
      },
      {
        title: 'Order Cards',
        body: 'Each order shows table number, items with quantities, special requests, and how long ago it was placed.',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>`,
        target: '#orders-grid',
        position: 'top',
        cta: 'Next'
      },
      {
        title: 'Status Management',
        body: 'Update order status: Pending → Preparing → Ready → Completed. Guests can see real-time updates right on their phones.',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
        target: '.kitchen-action-zone',
        position: 'bottom',
        cta: 'Next'
      },
      {
        title: 'Order Filters',
        body: 'Filter by Active, Pending, Preparing, Ready, or Completed. Badge counts show kitchen volume at a glance.',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`,
        target: '#kitchen-filter',
        position: 'bottom',
        cta: 'Next'
      },
      {
        title: 'Dark / Light Mode',
        body: 'Toggle between dark and light mode for kitchen viewing. Dark mode reduces eye strain during a busy dinner service.',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`,
        target: '#dark-toggle',
        position: 'right',
        cta: 'Finish Tour'
      }
    ]
  };

  let currentPage  = null;
  let currentStep  = 0;
  let steps        = [];
  let overlayEl    = null;
  let spotlightEl  = null;
  let cardEl       = null;
  let resizeTimer  = null;
  let isActive     = false;

  function init(page) {
    cleanup();
    currentPage = page;
    steps = TOURS[page] || [];
    if (!steps.length) return;
    setTimeout(() => {
      buildDOM();
      showStep(0);
      isActive = true;
    }, 300);
  }

  function buildDOM() {
    if (!document.getElementById('tour-styles')) {
      const style = document.createElement('style');
      style.id = 'tour-styles';
      style.textContent = TOUR_CSS;
      document.head.appendChild(style);
    }
    cleanupElements();

    overlayEl = document.createElement('div');
    overlayEl.id = 'tour-overlay';
    overlayEl.setAttribute('aria-hidden', 'true');
    document.body.appendChild(overlayEl);

    spotlightEl = document.createElement('div');
    spotlightEl.id = 'tour-spotlight';
    document.body.appendChild(spotlightEl);

    cardEl = document.createElement('div');
    cardEl.id = 'tour-card';
    cardEl.setAttribute('role', 'dialog');
    cardEl.setAttribute('aria-modal', 'true');
    document.body.appendChild(cardEl);
  }

  function cleanupElements() {
    ['tour-overlay','tour-spotlight','tour-card'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.remove();
    });
  }

  function cleanup() {
    if (overlayEl) overlayEl.remove();
    if (spotlightEl) spotlightEl.remove();
    if (cardEl) cardEl.remove();
    overlayEl = null; spotlightEl = null; cardEl = null;
    isActive = false;
    if (resizeTimer) clearTimeout(resizeTimer);
  }

  function scrollToElement(element) {
    if (!element) return;
    element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
  }

  function findElement(selector, retries = 5, interval = 200) {
    return new Promise((resolve) => {
      let attempts = 0;
      const check = () => {
        const el = document.querySelector(selector);
        if (el) { resolve(el); }
        else if (attempts < retries) { attempts++; setTimeout(check, interval); }
        else { resolve(null); }
      };
      check();
    });
  }

  async function showStep(idx) {
  if (idx >= steps.length) { finish(); return; }
  currentStep = idx;
  const step = steps[idx];

  // ── Mobile awareness ──
  let targetSelector = step.target;
  const isMobile = window.innerWidth <= 900;
  if (isMobile && step.mobileTarget) {
    targetSelector = step.mobileTarget;
    // If the target is inside the cart drawer, make sure it’s open
    if (targetSelector === '#cart-drawer' || targetSelector === '#add-person-mobile') {
      if (typeof openDrawer === 'function') {
        openDrawer();
        // wait for the drawer animation to finish
        await new Promise(r => setTimeout(r, 350));
      }
    }
  }

  let targetEl = null;
  if (targetSelector) {
    targetEl = await findElement(targetSelector);
    if (targetEl) {
      scrollToElement(targetEl);
      // slight delay so the element settles after scroll
      setTimeout(() => {
        positionSpotlight(targetEl);
        positionCard(targetEl, step.position, cardEl);
        spotlightEl.style.opacity = '1';
      }, 400);
    } else {
      clearSpotlight(); centerCard();
    }
  } else {
    clearSpotlight(); centerCard();
  }

  // ── Build card content ──
  const progress = steps.map((_, i) =>
    `<div class="tour-pip ${i === idx ? 'active' : i < idx ? 'done' : ''}"></div>`
  ).join('');
  const isLast = idx === steps.length - 1;

  cardEl.innerHTML = `
    <div class="tour-card-icon">${step.icon}</div>
    <div class="tour-card-body">
      <div class="tour-step-label">Step ${idx + 1} of ${steps.length}</div>
      <h3 class="tour-card-title">${escapeHtml(step.title)}</h3>
      <p class="tour-card-text">${escapeHtml(step.body)}</p>
    </div>
    <div class="tour-card-footer">
      <div class="tour-pips">${progress}</div>
      <div class="tour-card-actions">
        <button class="tour-btn-skip" id="tour-skip">Exit Tour</button>
        ${idx > 0 ? `<button class="tour-btn-back" id="tour-back">← Back</button>` : ''}
        <button class="tour-btn-cta" id="tour-next">${isLast ? '✓ Finish' : escapeHtml(step.cta)}</button>
      </div>
    </div>
  `;

  cardEl.classList.add('visible');
  cardEl.style.animation = 'none';
  requestAnimationFrame(() => {
    cardEl.style.animation = '';
    cardEl.classList.add('tour-in');
  });

  // ── Button listeners ──
  const nextBtn = document.getElementById('tour-next');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (isLast) {
        finish();
        if (currentPage === 'menu' && confirm('Would you like to see the Kitchen Display?')) {
          window.location.href = 'kitchen.html';
        } else if (currentPage === 'admin' && confirm('Would you like to see the Kitchen Display?')) {
          window.location.href = 'kitchen.html';
        }
      } else {
        showStep(idx + 1);
      }
    });
  }
  document.getElementById('tour-back')?.addEventListener('click', () => showStep(idx - 1));
  document.getElementById('tour-skip')?.addEventListener('click', finish);

  // Keyboard navigation
  const keyHandler = (e) => {
    if (e.key === 'ArrowRight') { if (isLast) finish(); else showStep(idx + 1); }
    else if (e.key === 'ArrowLeft' && idx > 0) showStep(idx - 1);
    else if (e.key === 'Escape') finish();
  };
  document.removeEventListener('keydown', Tour._keyHandler);
  Tour._keyHandler = keyHandler;
  document.addEventListener('keydown', Tour._keyHandler);
}

  function positionSpotlight(el) {
    if (!el || !spotlightEl || !overlayEl) return;
    const r = el.getBoundingClientRect();
    const pad = 10;
    spotlightEl.style.top    = `${r.top + window.scrollY - pad}px`;
    spotlightEl.style.left   = `${r.left + window.scrollX - pad}px`;
    spotlightEl.style.width  = `${r.width + pad * 2}px`;
    spotlightEl.style.height = `${r.height + pad * 2}px`;
    spotlightEl.style.borderRadius = '14px';
    const clip = `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% ${r.top}px, ${r.left}px ${r.top}px, ${r.left}px ${r.bottom}px, ${r.right}px ${r.bottom}px, ${r.right}px ${r.top}px, 0% ${r.top}px)`;
    overlayEl.style.clipPath = clip;
    overlayEl.style.opacity = '1';
  }

  function clearSpotlight() {
    if (spotlightEl) spotlightEl.style.opacity = '0';
    if (overlayEl) { overlayEl.style.clipPath = 'none'; overlayEl.style.opacity = '1'; }
  }

  function positionCard(targetEl, preferredPos, card) {
    if (!card) return;
    card.style.visibility = 'hidden';
    card.style.position = 'fixed';
    requestAnimationFrame(() => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const cr = card.getBoundingClientRect();
      const cardW = Math.min(cr.width || 340, vw - 32);
      const cardH = cr.height || 280;
      const gap = 18;

      if (vw <= 600) {
        card.style.top = 'auto'; card.style.bottom = '0';
        card.style.left = '0'; card.style.right = '0';
        card.style.width = '100%'; card.style.maxWidth = '100%';
        card.style.transform = 'none';
        card.style.borderRadius = '20px 20px 0 0';
        card.style.visibility = 'visible';
        return;
      }
      if (!targetEl) { centerCard(); return; }

      const tr = targetEl.getBoundingClientRect();
      let pos = preferredPos;
      if (pos === 'bottom' && tr.bottom + cardH + gap > vh) pos = 'top';
      if (pos === 'top' && tr.top - cardH - gap < 0) pos = 'bottom';
      if (pos === 'left' && tr.left - cardW - gap < 0) pos = 'right';
      if (pos === 'right' && tr.right + cardW + gap > vw) pos = 'left';

      let top, left;
      if (pos === 'bottom')      { top = tr.bottom + gap; left = Math.max(16, Math.min(tr.left + tr.width/2 - cardW/2, vw - cardW - 16)); }
      else if (pos === 'top')    { top = tr.top - cardH - gap; left = Math.max(16, Math.min(tr.left + tr.width/2 - cardW/2, vw - cardW - 16)); }
      else if (pos === 'left')   { left = tr.left - cardW - gap; top = Math.max(16, Math.min(tr.top + tr.height/2 - cardH/2, vh - cardH - 16)); }
      else                       { left = tr.right + gap; top = Math.max(16, Math.min(tr.top + tr.height/2 - cardH/2, vh - cardH - 16)); }

      top = Math.max(16, Math.min(top, vh - cardH - 16));
      left = Math.max(16, Math.min(left, vw - cardW - 16));
      card.style.top = `${top}px`; card.style.left = `${left}px`;
      card.style.bottom = 'auto'; card.style.right = 'auto';
      card.style.width = `${cardW}px`; card.style.maxWidth = `${cardW}px`;
      card.style.transform = 'none'; card.style.borderRadius = '20px';
      card.style.visibility = 'visible';
    });
  }

  function centerCard() {
    if (!cardEl) return;
    cardEl.style.top = '50%'; cardEl.style.left = '50%';
    cardEl.style.transform = 'translate(-50%, -50%)';
    cardEl.style.bottom = 'auto'; cardEl.style.right = 'auto';
    cardEl.style.width = '340px'; cardEl.style.maxWidth = 'calc(100vw - 32px)';
    cardEl.style.borderRadius = '20px'; cardEl.style.visibility = 'visible';
  }

  function finish() { cleanup(); }

  function restart(page) {
    cleanup();
    setTimeout(() => init(page), 100);
  }

  function escapeHtml(str) {
    return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  const TOUR_CSS = `
    #tour-overlay {
      position: fixed; inset: 0; z-index: 9998;
      background: rgba(27,40,36,.78);
      backdrop-filter: blur(3px);
      pointer-events: all;
      transition: clip-path 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease;
    }
    #tour-spotlight {
      position: absolute; z-index: 9999;
      border: 2.5px solid #F4A261;
      box-shadow: 0 0 0 4px rgba(244,162,97,.2), 0 0 0 8px rgba(244,162,97,.1);
      pointer-events: none;
      transition: all 0.4s cubic-bezier(0.22,1,0.36,1);
      opacity: 0; border-radius: 14px;
    }
    #tour-card {
      position: fixed; z-index: 10000;
      background: #FFFFFF;
      border-radius: 20px;
      box-shadow: 0 24px 64px rgba(26,106,91,.22), 0 8px 24px rgba(0,0,0,.09);
      border: 1px solid rgba(237,229,216,.6);
      width: 340px; max-width: calc(100vw - 32px);
      overflow: hidden; opacity: 0;
      transform: translateY(12px) scale(0.96);
      transition: opacity 0.3s ease, transform 0.35s cubic-bezier(0.22,1,0.36,1);
      visibility: hidden;
    }
    #tour-card.visible { opacity: 1; transform: translateY(0) scale(1); visibility: visible; }
    #tour-card.tour-in { animation: tourCardIn 0.38s cubic-bezier(0.22,1,0.36,1) both; }
    @keyframes tourCardIn {
      from { opacity:0; transform:translateY(14px) scale(0.95); }
      to   { opacity:1; transform:translateY(0) scale(1); }
    }
    .tour-card-icon {
      background: linear-gradient(135deg, #1A6A5B 0%, #1E7B6A 100%);
      padding: 1.2rem 1.5rem 0.9rem;
      color: rgba(255,255,255,.85);
      display: flex; align-items: center; gap: 0.75rem;
    }
    .tour-card-body  { padding: 1.1rem 1.4rem 0.75rem; }
    .tour-step-label {
      font-size: 0.65rem; font-weight: 700; letter-spacing: 0.18em;
      text-transform: uppercase; color: #F4A261; margin-bottom: 0.35rem;
    }
    .tour-card-title { font-size: 1rem; font-weight: 700; color: #2D3E3A; line-height: 1.3; margin-bottom: 0.45rem; }
    .tour-card-text  { font-size: 0.83rem; color: #6B7D78; line-height: 1.65; }
    .tour-card-footer {
      padding: 0.85rem 1.4rem 1.1rem;
      border-top: 1px solid #EDE5D8;
      display: flex; align-items: center; justify-content: space-between;
      gap: 0.75rem; flex-wrap: wrap;
    }
    .tour-pips { display: flex; gap: 5px; align-items: center; }
    .tour-pip  { width:6px; height:6px; border-radius:50%; background:#EDE5D8; transition: all 0.25s ease; }
    .tour-pip.active { width:18px; border-radius:4px; background:#1A6A5B; }
    .tour-pip.done   { background: #B8D8CF; }
    .tour-card-actions { display:flex; align-items:center; gap:0.5rem; }
    .tour-btn-cta {
      background: #1A6A5B; color: #fff; border: none;
      border-radius: 10px; padding: 0.55rem 1.1rem;
      font-size: 0.82rem; font-weight: 600; cursor: pointer; font-family: inherit;
      transition: all 0.18s ease; white-space: nowrap;
      box-shadow: 0 2px 8px rgba(26,106,91,.28);
    }
    .tour-btn-cta:hover { background: #1E7B6A; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(26,106,91,.36); }
    .tour-btn-cta:active { transform: scale(0.97); }
    .tour-btn-back, .tour-btn-skip {
      background: transparent; border: none; color: #9AADA8;
      font-size: 0.78rem; font-weight: 500; cursor: pointer; font-family: inherit;
      padding: 0.4rem 0.5rem; border-radius: 8px; transition: all 0.15s ease; white-space: nowrap;
    }
    .tour-btn-back:hover { color: #2D3E3A; background: #F5EDE0; }
    .tour-btn-skip:hover { color: #D94F4F; background: #FDF0F0; }
    @media (max-width: 600px) {
      #tour-card {
        position: fixed !important; bottom: 0 !important; top: auto !important;
        left: 0 !important; right: 0 !important; width: 100% !important;
        max-width: 100% !important; border-radius: 20px 20px 0 0 !important;
        transform: none !important;
      }
      #tour-card.visible {
        transform: none !important;
        animation: tourCardMobileIn 0.38s cubic-bezier(0.22,1,0.36,1) both !important;
      }
      @keyframes tourCardMobileIn {
        from { opacity:0; transform:translateY(100%); }
        to   { opacity:1; transform:translateY(0); }
      }
      .tour-card-footer { padding-bottom: max(1.1rem, env(safe-area-inset-bottom)); }
    }
  `;

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (isActive && currentStep < steps.length) {
        const step = steps[currentStep];
        if (step && step.target) {
          const targetEl = document.querySelector(step.target);
          if (targetEl) { positionSpotlight(targetEl); positionCard(targetEl, step.position, cardEl); }
        }
      }
    }, 200);
  });

  return { init, restart, isActive: () => isActive };
})();

window.Tour = Tour;