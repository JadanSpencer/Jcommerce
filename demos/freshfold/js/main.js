/* =========================================================
   FreshFold — shared behaviour
   ========================================================= */

   (function () {
    /* ---- Icons ---- */
    if (window.lucide) lucide.createIcons();
  
    /* ---- Mobile nav ---- */
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');
    if (toggle && links) {
      toggle.addEventListener('click', () => {
        const open = links.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open);
        toggle.innerHTML = open
          ? '<i data-lucide="x" class="lucide"></i>'
          : '<i data-lucide="menu" class="lucide"></i>';
        if (window.lucide) lucide.createIcons();
      });
      links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.innerHTML = '<i data-lucide="menu" class="lucide"></i>';
        if (window.lucide) lucide.createIcons();
      }));
    }
  
    /* =========================================================
       Loading screen — minimum 3 seconds, every time
       ========================================================= */
    const MIN_LOAD_MS = 3000;
    const loader = document.querySelector('.loader');
    const bar = document.querySelector('.loader-bar-fill');
    const pageStart = performance.now();
  
    function hideLoader() {
      if (!loader) return;
      const elapsed = performance.now() - pageStart;
      const remaining = Math.max(MIN_LOAD_MS - elapsed, 0);
      setTimeout(() => {
        loader.setAttribute('hidden', '');
        document.body.classList.remove('is-loading');
      }, remaining);
    }
  
    // start the progress bar animation immediately
    if (bar) requestAnimationFrame(() => { bar.style.width = '100%'; });
  
    if (document.readyState === 'complete') {
      hideLoader();
    } else {
      window.addEventListener('load', hideLoader);
    }
  
    /* Intercept internal navigation so the loader always shows
       for the full 3 seconds before the next page appears. */
    document.querySelectorAll('a[data-nav]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || link.target === '_blank') return;
        e.preventDefault();
        if (loader) {
          loader.removeAttribute('hidden');
          document.body.classList.add('is-loading');
          if (bar) {
            bar.style.transition = 'none';
            bar.style.width = '0%';
            requestAnimationFrame(() => {
              bar.style.transition = 'width 2.9s linear';
              requestAnimationFrame(() => { bar.style.width = '100%'; });
            });
          }
        }
        setTimeout(() => { window.location.href = href; }, MIN_LOAD_MS);
      });
    });
  
    /* =========================================================
       Cycle dial — set progress ring via data-progress (0-100)
       ========================================================= */
    document.querySelectorAll('.cycle-dial-progress').forEach(circle => {
      const pct = parseFloat(circle.dataset.progress || '0');
      const circumference = 565.48; // 2 * PI * r(90)
      const offset = circumference * (1 - pct / 100);
      circle.style.strokeDashoffset = offset;
    });
  
    /* =========================================================
       Quantity steppers (booking page)
       ========================================================= */
    document.querySelectorAll('.qty-control').forEach(control => {
      const valEl = control.querySelector('.qty-val');
      const min = parseInt(control.dataset.min || '0', 10);
      const max = parseInt(control.dataset.max || '20', 10);
      control.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
          let val = parseInt(valEl.textContent, 10);
          val += btn.dataset.action === 'inc' ? 1 : -1;
          val = Math.max(min, Math.min(max, val));
          valEl.textContent = val;
          document.dispatchEvent(new CustomEvent('qty-change'));
        });
      });
    });
  
  })();