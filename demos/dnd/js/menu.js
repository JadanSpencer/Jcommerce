/* ==========================================================================
   D&D WHOLESALE LTD — MENU PAGE
   Product listing, category filtering, search, cart management
   ========================================================================== */

   (function() {
    let currentMenu = [];
    let currentFilter = 'all';
    let currentSearch = '';
    let currentProduct = null;

    function renderFilters() {
        const container = document.getElementById('category-filters');
        if (!container) return;
        
        const categories = [{ id: 'all', name: 'All' }, ...DND.CATEGORIES];
        container.innerHTML = categories.map(cat => `
            <button class="chip ${currentFilter === cat.id ? 'is-active' : ''}" data-category="${cat.id}">${cat.name}</button>
        `).join('');
        
        document.querySelectorAll('.chip').forEach(btn => {
            btn.addEventListener('click', () => {
                currentFilter = btn.dataset.category;
                renderFilters();
                renderProducts();
            });
        });
    }

    function renderProducts() {
        const container = document.getElementById('menu-grid');
        if (!container) return;
        
        let filtered = currentMenu.filter(item => {
            if (currentFilter !== 'all' && item.category !== currentFilter) return false;
            if (currentSearch) {
                const searchLower = currentSearch.toLowerCase();
                return item.name.toLowerCase().includes(searchLower) || 
                       (item.desc && item.desc.toLowerCase().includes(searchLower));
            }
            return true;
        });
        
        if (filtered.length === 0) {
            container.innerHTML = '<div class="empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><p>No items found</p></div>';
            return;
        }
        
        const categoriesMap = new Map(DND.CATEGORIES.map(c => [c.id, c]));
        
        container.innerHTML = filtered.map(item => {
            const cat = categoriesMap.get(item.category) || DND.CATEGORIES[0];
            const catIndex = DND.CATEGORIES.findIndex(c => c.id === item.category);
            const swatch = `swatch-${(catIndex % 8) + 1}`;
            const iconName = cat.icon || 'package';
            
            return `
                <div class="product-card" data-id="${item.id}">
                    <div class="product-card__top ${swatch}">
                        <span class="product-card__cat">${cat.name}</span>
                        <span class="product-card__icon"><i data-lucide="${iconName}" style="width:1.25rem;height:1.25rem"></i></span>
                    </div>
                    <div class="product-card__body">
                        <h3 class="product-card__name">${escapeHtml(item.name)}</h3>
                        <div class="product-card__unit">${item.unit}</div>
                        <div class="product-card__price">${DND.formatJMD(item.price)} <small>${item.unit}</small></div>
                        ${item.desc ? `<p class="text-sm muted">${escapeHtml(item.desc)}</p>` : ''}
                    </div>
                    <div class="product-card__foot">
                        <button class="btn btn--primary btn--sm add-to-cart" data-id="${item.id}">Add to Cart</button>
                    </div>
                </div>
            `;
        }).join('');
        
        // Re-render Lucide icons
        if (window.lucide) lucide.createIcons();
        
        // Attach add to cart handlers
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = btn.dataset.id;
                const product = currentMenu.find(p => p.id === id);
                if (product) openModal(product);
            });
        });
    }

    function openModal(product) {
        currentProduct = product;
        document.getElementById('modal-title').textContent = `Add ${product.name}`;
        document.getElementById('modal-product-name').textContent = product.name;
        document.getElementById('modal-unit').textContent = `Unit: ${product.unit}`;
        document.getElementById('modal-price-display').innerHTML = `${DND.formatJMD(product.price)} per ${product.unit}`;
        document.getElementById('modal-qty').value = 1;
        const overlay = document.getElementById('modal-overlay');
        overlay.hidden = false;
    }

    function addToCart(product, qty) {
        const cart = DND.Cart.all();
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            existing.qty += qty;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                unit: product.unit,
                qty: qty
            });
        }
        DND.Cart.save(cart);
        updateCartCount();
        DND_LAYOUT.toast(`Added ${qty} × ${product.name} to cart`);
    }

    function updateCartCount() {
        const cart = DND.Cart.all();
        const total = cart.reduce((sum, item) => sum + item.qty, 0);
        const countSpan = document.getElementById('cart-count');
        if (countSpan) countSpan.textContent = total;
    }

    function clearCart() {
        DND.Cart.save([]);
        updateCartCount();
        DND_LAYOUT.toast('Cart cleared');
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    function init() {
        if (!window.DND) {
            setTimeout(init, 100);
            return;
        }
        
        currentMenu = DND.Menu.all();
        renderFilters();
        renderProducts();
        updateCartCount();
        
        // Search handler
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                currentSearch = e.target.value;
                renderProducts();
            });
        }
        
        // Reset search
        const resetBtn = document.getElementById('reset-search');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (searchInput) searchInput.value = '';
                currentSearch = '';
                renderProducts();
            });
        }
        
        // Clear cart
        const clearBtn = document.getElementById('clear-cart-btn');
        if (clearBtn) clearBtn.addEventListener('click', clearCart);
        
        // Modal close handlers
        const overlay = document.getElementById('modal-overlay');
        const closeModal = () => { overlay.hidden = true; currentProduct = null; };
        document.getElementById('close-modal')?.addEventListener('click', closeModal);
        document.getElementById('cancel-modal')?.addEventListener('click', closeModal);
        overlay?.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
        
        // Qty buttons
        const qtyInput = document.getElementById('modal-qty');
        document.getElementById('qty-minus')?.addEventListener('click', () => {
            let val = parseInt(qtyInput.value) || 1;
            if (val > 1) qtyInput.value = val - 1;
        });
        document.getElementById('qty-plus')?.addEventListener('click', () => {
            let val = parseInt(qtyInput.value) || 1;
            qtyInput.value = val + 1;
        });
        
        // Confirm add
        document.getElementById('confirm-add')?.addEventListener('click', () => {
            if (currentProduct) {
                const qty = parseInt(document.getElementById('modal-qty').value) || 1;
                addToCart(currentProduct, qty);
                closeModal();
            }
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();