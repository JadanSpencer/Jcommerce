/* ==========================================================================
   D&D WHOLESALE LTD — SHARED LAYOUT
   Renders the header/nav and footer into every page, wires up the role
   switcher (Customer / Staff / Admin) and provides a small toast helper.
   ========================================================================== */

   const DND_LAYOUT = (() => {

    const NAV_ITEMS = [
      { page: 'home',      href: 'index.html',     label: 'Home' },
      { page: 'menu',      href: 'menu.html',       label: 'Menu' },
      { page: 'staff',     href: 'staff.html',      label: 'Staff' },
      { page: 'ratings',   href: 'ratings.html',    label: 'Ratings' },
      { page: 'inventory', href: 'inventory.html',  label: 'Inventory', restricted: true },
      { page: 'queue',     href: 'queue.html',      label: 'Queue' }
    ];
  
    const LOCK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lock" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';
  
    function brandMark(){
      return '<span class="brand__mark" aria-hidden="true"><span></span><span></span><span></span><span></span></span>';
    }
  
    function header(activePage){
      const role = DND.getRole();
      const links = NAV_ITEMS.map(item => {
        const current = item.page === activePage ? ' aria-current="page"' : '';
        const lock = (item.restricted && role === 'customer') ? LOCK_SVG : '';
        return `<a class="nav__link" href="${item.href}"${current}>${item.label}${lock}</a>`;
      }).join('');
  
      return `
      <header class="site-header">
        <div class="container topbar">
          <a href="index.html" class="brand">
            ${brandMark()}
            <span class="brand__text">
              <span class="brand__name">D&amp;D Wholesale Ltd</span>
              <span class="brand__tagline">Shop 7, Papine Plaza &middot; Quality at the Best Price</span>
            </span>
          </a>
          <div class="role-switch">
            <span class="role-switch__label">Viewing as</span>
            <select id="role-select" aria-label="Viewing as">
              <option value="customer"${role === 'customer' ? ' selected' : ''}>Customer</option>
              <option value="staff"${role === 'staff' ? ' selected' : ''}>Staff</option>
              <option value="admin"${role === 'admin' ? ' selected' : ''}>Admin</option>
            </select>
            <button class="nav__toggle" id="nav-toggle" aria-label="Toggle navigation menu" aria-expanded="false">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:1.25rem;height:1.25rem">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="nav-row" id="nav-row">
          <nav class="nav container" aria-label="Primary">
            ${links}
          </nav>
        </div>
      </header>`;
    }
  
    function footer(){
      const year = new Date().getFullYear();
      return `
      <footer class="site-footer">
        <div class="container">
          <div class="footer__grid">
            <div>
              <div class="footer__brand">
                ${brandMark()}
                <span class="brand__name">D&amp;D Wholesale Ltd</span>
              </div>
              <p>Serving Papine Plaza with quality groceries at wholesale prices for over 20 years.</p>
            </div>
            <div>
              <span class="footer__heading">Visit Us</span>
              <ul>
                <li>Shop #7, Papine Plaza</li>
                <li>216 Old Hope Road, Kingston 6</li>
                <li>Tel: (876) 671-9601</li>
                <li>WhatsApp: (876) 826-4820</li>
              </ul>
            </div>
            <div>
              <span class="footer__heading">Quick Links</span>
              <ul>
                <li><a href="menu.html">Browse the Menu</a></li>
                <li><a href="staff.html">Meet the Team</a></li>
                <li><a href="ratings.html">Rate &amp; Comment</a></li>
                <li><a href="queue.html">Join the Queue</a></li>
              </ul>
            </div>
            <div>
              <span class="footer__heading">Hours</span>
              <ul>
                <li>Mon &ndash; Sat: 8:00 AM &ndash; 5:45 PM</li>
                <li>Sunday: Closed</li>
              </ul>
              <span class="footer__heading" style="margin-top: var(--space-4)">Connect</span>
              <ul>
                <li>Instagram &middot; @d_and_d_wholesale</li>
                <li>Facebook &middot; D&amp;D Wholesale Ltd Jamaica</li>
                <li>TikTok &middot; d.and.d.wholesale</li>
              </ul>
            </div>
          </div>
          <div class="footer__bottom">
            <span>&copy; ${year} D&amp;D Wholesale Ltd. All rights reserved.</span>
            <span>Demo storefront built by JCommerce &amp; Tech</span>
          </div>
        </div>
      </footer>`;
    }
  
    function mountIcons(){
      if (window.lucide && typeof window.lucide.createIcons === 'function'){
        window.lucide.createIcons();
      }
    }
  
    function wireRoleSwitch(){
      const select = document.getElementById('role-select');
      if (!select) return;
      select.addEventListener('change', () => {
        DND.setRole(select.value);
        location.reload();
      });
    }
  
    function wireNavToggle(){
      const toggle = document.getElementById('nav-toggle');
      const row = document.getElementById('nav-row');
      if (!toggle || !row) return;
      toggle.addEventListener('click', () => {
        const open = row.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }
  
    function render(activePage){
      const headerSlot = document.getElementById('site-header');
      const footerSlot = document.getElementById('site-footer');
      if (headerSlot) headerSlot.outerHTML = header(activePage);
      if (footerSlot) footerSlot.outerHTML = footer();
      wireRoleSwitch();
      wireNavToggle();
      mountIcons();
    }
  
    function toast(message){
      let el = document.querySelector('.toast');
      if (!el){
        el = document.createElement('div');
        el.className = 'toast';
        el.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg><span class="toast__text"></span>';
        document.body.appendChild(el);
      }
      el.querySelector('.toast__text').textContent = message;
      el.classList.add('is-visible');
      clearTimeout(el._timer);
      el._timer = setTimeout(() => el.classList.remove('is-visible'), 2400);
    }
  
    return { render, mountIcons, toast };
  })();