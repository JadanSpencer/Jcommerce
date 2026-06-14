/* =========================================================
   FreshFold — Guided Tour engine
   Each page defines window.tourSteps = [{selector, title, text, placement}]
   ========================================================= */

   (function () {
    const steps = window.tourSteps;
    const fab = document.getElementById('tourFab');
    if (!steps || !steps.length || !fab) return;
  
    let backdrop, highlight, card, current = 0;
  
    function build() {
      backdrop = document.createElement('div');
      backdrop.className = 'tour-backdrop';
  
      highlight = document.createElement('div');
      highlight.className = 'tour-highlight';
  
      card = document.createElement('div');
      card.className = 'tour-card';
      card.innerHTML = `
        <span class="tour-step"></span>
        <h4></h4>
        <p></p>
        <div class="tour-actions">
          <div class="tour-dots"></div>
          <div class="tour-buttons">
            <button class="tour-prev">Back</button>
            <button class="tour-next">Next</button>
          </div>
        </div>
        <button class="tour-buttons tour-skip" style="margin-top:.75rem;display:block;width:100%;text-align:center;">Skip tour</button>
      `;
  
      backdrop.append(highlight, card);
      document.body.appendChild(backdrop);
  
      card.querySelector('.tour-next').addEventListener('click', () => {
        if (current === steps.length - 1) return end();
        current++;
        render();
      });
      card.querySelector('.tour-prev').addEventListener('click', () => {
        if (current === 0) return;
        current--;
        render();
      });
      card.querySelectorAll('.tour-skip')[0].addEventListener('click', end);
      backdrop.addEventListener('click', (e) => { if (e.target === backdrop) end(); });
  
      const dots = card.querySelector('.tour-dots');
      steps.forEach((_, i) => {
        const d = document.createElement('span');
        if (i === 0) d.classList.add('active');
        dots.appendChild(d);
      });
    }
  
    function render() {
      const step = steps[current];
      const target = document.querySelector(step.selector);
  
      card.querySelector('.tour-step').textContent = `Step ${current + 1} of ${steps.length}`;
      card.querySelector('h4').textContent = step.title;
      card.querySelector('p').textContent = step.text;
      card.querySelector('.tour-prev').style.visibility = current === 0 ? 'hidden' : 'visible';
      card.querySelector('.tour-next').textContent = current === steps.length - 1 ? 'Done' : 'Next';
      card.querySelectorAll('.tour-dots span').forEach((d, i) => d.classList.toggle('active', i === current));
  
      if (!target) { position(null); return; }
      target.scrollIntoView({ block: 'center', behavior: 'smooth' });
      setTimeout(() => position(target, step.placement), 300);
    }
  
    function position(target, placement) {
      if (!target) {
        highlight.style.display = 'none';
        card.style.top = '50%';
        card.style.left = '50%';
        card.style.transform = 'translate(-50%, -50%)';
        return;
      }
      highlight.style.display = 'block';
      const r = target.getBoundingClientRect();
      const pad = 8;
      highlight.style.top = (r.top - pad) + 'px';
      highlight.style.left = (r.left - pad) + 'px';
      highlight.style.width = (r.width + pad * 2) + 'px';
      highlight.style.height = (r.height + pad * 2) + 'px';
  
      const cardW = card.offsetWidth || 320;
      const cardH = card.offsetHeight || 160;
      let top, left;
  
      placement = placement || 'bottom';
      if (placement === 'bottom') {
        top = r.bottom + 16;
        left = r.left;
      } else if (placement === 'top') {
        top = r.top - cardH - 16;
        left = r.left;
      } else if (placement === 'right') {
        top = r.top;
        left = r.right + 16;
      } else {
        top = r.top;
        left = r.left - cardW - 16;
      }
  
      // keep on screen
      left = Math.max(16, Math.min(left, window.innerWidth - cardW - 16));
      top = Math.max(16, Math.min(top, window.innerHeight - cardH - 16));
  
      card.style.transform = 'none';
      card.style.top = top + 'px';
      card.style.left = left + 'px';
    }
  
    function start() {
      if (!backdrop) build();
      current = 0;
      backdrop.classList.add('show');
      document.body.style.overflow = 'hidden';
      render();
    }
  
    function end() {
      backdrop.classList.remove('show');
      document.body.style.overflow = '';
    }
  
    fab.addEventListener('click', start);
    window.addEventListener('resize', () => {
      if (backdrop && backdrop.classList.contains('show')) render();
    });
  })();