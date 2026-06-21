/* ==========================================================================
   D&D WHOLESALE LTD — INVENTORY MANAGEMENT
   Stock tracking, reorder alerts, reports, CRUD (admin only)
   ========================================================================== */

   (function() {
    let currentInventory = [];
    let currentRole = 'customer';
    let currentSearch = '';
    let currentCategory = 'all';
    let editingInventoryId = null;

    function updateRole() {
        currentRole = DND.getRole();
        const adminBtns = document.getElementById('admin-inventory-btns');
        const adminCol = document.getElementById('admin-actions-col');
        if (adminBtns) adminBtns.style.display = currentRole === 'admin' ? 'block' : 'none';
        if (adminCol) adminCol.style.display = currentRole === 'admin' ? 'table-cell' : 'none';
    }

    function renderReports() {
        const total = currentInventory.length;
        const lowStock = currentInventory.filter(i => i.qty <= i.reorder && i.qty > 0).length;
        const outOfStock = currentInventory.filter(i => i.qty === 0).length;
        const totalValue = currentInventory.reduce((sum, i) => sum + (i.cost || 0) * i.qty, 0);
        
        document.getElementById('total-skus').textContent = total;
        document.getElementById('low-stock-count').textContent = lowStock;
        document.getElementById('out-of-stock-count').textContent = outOfStock;
        document.getElementById('total-value').textContent = DND.formatJMD(totalValue);
    }

    function renderCategoryChart() {
        const container = document.getElementById('category-stock-chart');
        if (!container) return;
        
        const catMap = new Map();
        DND.CATEGORIES.forEach(cat => catMap.set(cat.id, { name: cat.name, total: 0 }));
        
        currentInventory.forEach(item => {
            if (catMap.has(item.category)) {
                catMap.get(item.category).total += item.qty;
            }
        });
        
        const maxTotal = Math.max(...Array.from(catMap.values()).map(v => v.total), 1);
        
        container.innerHTML = Array.from(catMap.entries()).map(([id, data]) => {
            const percent = (data.total / maxTotal) * 100;
            const isLow = data.total < 20;
            return `
                <div class="bar-chart__row">
                    <span>${data.name}</span>
                    <div class="bar-chart__track">
                        <div class="bar-chart__fill ${isLow ? 'is-alert' : ''}" style="width: ${percent}%"></div>
                    </div>
                    <div class="bar-chart__val">${data.total} units</div>
                </div>
            `;
        }).join('');
    }

    function renderTable() {
        const tbody = document.getElementById('inventory-tbody');
        if (!tbody) return;
        
        let filtered = currentInventory.filter(item => {
            if (currentCategory !== 'all' && item.category !== currentCategory) return false;
            if (currentSearch) {
                const searchLower = currentSearch.toLowerCase();
                return item.name.toLowerCase().includes(searchLower) ||
                       item.sku.toLowerCase().includes(searchLower) ||
                       (item.bin && item.bin.toLowerCase().includes(searchLower));
            }
            return true;
        });
        
        if (filtered.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" style="text-align:center; padding: var(--space-7)">No inventory items found</td></tr>';
            return;
        }
        
        const catMap = new Map(DND.CATEGORIES.map(c => [c.id, c.name]));
        
        tbody.innerHTML = filtered.map(item => {
            const isLow = item.qty <= item.reorder && item.qty > 0;
            const isOut = item.qty === 0;
            let statusClass = '';
            let statusText = '';
            if (isOut) { statusClass = 'is-alert'; statusText = 'Out of Stock'; }
            else if (isLow) { statusClass = 'is-alert'; statusText = 'Low Stock'; }
            else { statusText = 'In Stock'; }
            
            return `
                <tr data-id="${item.id}">
                    <td class="mono">${escapeHtml(item.sku)}</td>
                    <td><strong>${escapeHtml(item.name)}</strong></td>
                    <td>${catMap.get(item.category) || item.category}</td>
                    <td class="${statusClass}">${item.qty}</td>
                    <td>${item.unit}</td>
                    <td>${item.reorder}</td>
                    <td><span class="badge ${isOut || isLow ? 'badge--red' : 'badge--green'}">${statusText}</span></td>
                    <td class="mono">${item.bin || '—'}</td>
                    ${currentRole === 'admin' ? `
                        <td class="actions">
                            <button class="icon-btn edit-inv" data-id="${item.id}">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3l4 4-12 12H5v-4L17 3z"/></svg>
                            </button>
                            <button class="icon-btn adjust-qty" data-id="${item.id}" data-qty="${item.qty}">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
                            </button>
                        </td>
                    ` : ''}
                </tr>
            `;
        }).join('');
        
        if (currentRole === 'admin') {
            document.querySelectorAll('.edit-inv').forEach(btn => {
                btn.addEventListener('click', () => openEditModal(btn.dataset.id));
            });
            document.querySelectorAll('.adjust-qty').forEach(btn => {
                btn.addEventListener('click', () => openQtyModal(btn.dataset.id, parseInt(btn.dataset.qty)));
            });
        }
    }

    function openEditModal(id) {
        const item = currentInventory.find(i => i.id === id);
        if (!item) return;
        editingInventoryId = id;
        document.getElementById('inventory-modal-title').textContent = 'Edit Stock Item';
        document.getElementById('edit-inventory-id').value = id;
        document.getElementById('inv-sku').value = item.sku;
        document.getElementById('inv-name').value = item.name;
        document.getElementById('inv-category').value = item.category;
        document.getElementById('inv-unit').value = item.unit;
        document.getElementById('inv-qty').value = item.qty;
        document.getElementById('inv-reorder').value = item.reorder;
        document.getElementById('inv-cost').value = item.cost || '';
        document.getElementById('inv-bin').value = item.bin || '';
        document.getElementById('inv-supplier').value = item.supplier || '';
        document.getElementById('delete-inventory-btn').style.display = 'inline-flex';
        document.getElementById('inventory-modal').hidden = false;
    }

    function openAddModal() {
        editingInventoryId = null;
        document.getElementById('inventory-modal-title').textContent = 'Add Stock Item';
        document.getElementById('edit-inventory-id').value = '';
        document.getElementById('inv-sku').value = '';
        document.getElementById('inv-name').value = '';
        document.getElementById('inv-category').value = DND.CATEGORIES[0].id;
        document.getElementById('inv-unit').value = 'case';
        document.getElementById('inv-qty').value = '0';
        document.getElementById('inv-reorder').value = '10';
        document.getElementById('inv-cost').value = '';
        document.getElementById('inv-bin').value = '';
        document.getElementById('inv-supplier').value = '';
        document.getElementById('delete-inventory-btn').style.display = 'none';
        document.getElementById('inventory-modal').hidden = false;
    }

    function openQtyModal(id, currentQty) {
        const newQty = prompt(`Current quantity: ${currentQty}\nEnter new quantity (or +/- amount like +5 or -3):`, currentQty);
        if (newQty === null) return;
        
        let updatedQty;
        if (newQty.toString().startsWith('+')) {
            updatedQty = currentQty + parseInt(newQty.slice(1));
        } else if (newQty.toString().startsWith('-')) {
            updatedQty = currentQty - parseInt(newQty.slice(1));
        } else {
            updatedQty = parseInt(newQty);
        }
        
        if (isNaN(updatedQty) || updatedQty < 0) {
            DND_LAYOUT.toast('Invalid quantity');
            return;
        }
        
        const item = currentInventory.find(i => i.id === id);
        if (item) {
            item.qty = updatedQty;
            item.updated = new Date().toISOString().split('T')[0];
            DND.Inventory.save(currentInventory);
            refreshData();
            DND_LAYOUT.toast(`Updated ${item.name} to ${updatedQty} ${item.unit}s`);
        }
    }

    function saveInventory() {
        const sku = document.getElementById('inv-sku').value.trim();
        const name = document.getElementById('inv-name').value.trim();
        const category = document.getElementById('inv-category').value;
        const unit = document.getElementById('inv-unit').value;
        const qty = parseInt(document.getElementById('inv-qty').value) || 0;
        const reorder = parseInt(document.getElementById('inv-reorder').value) || 0;
        const cost = parseInt(document.getElementById('inv-cost').value) || 0;
        const bin = document.getElementById('inv-bin').value.trim();
        const supplier = document.getElementById('inv-supplier').value.trim();
        
        if (!sku || !name) {
            DND_LAYOUT.toast('SKU and Name are required');
            return;
        }
        
        let inventoryList = [...currentInventory];
        
        if (editingInventoryId) {
            const index = inventoryList.findIndex(i => i.id === editingInventoryId);
            if (index !== -1) {
                inventoryList[index] = {
                    ...inventoryList[index],
                    sku, name, category, unit, qty, reorder, cost, bin, supplier,
                    updated: new Date().toISOString().split('T')[0]
                };
            }
        } else {
            const newId = DND.nextId('I', inventoryList);
            inventoryList.push({
                id: newId,
                sku, name, category, unit, qty, reorder, cost, bin, supplier,
                updated: new Date().toISOString().split('T')[0]
            });
        }
        
        DND.Inventory.save(inventoryList);
        refreshData();
        closeModal();
        DND_LAYOUT.toast(editingInventoryId ? 'Item updated' : 'Item added');
    }

    function deleteInventory() {
        if (!editingInventoryId) return;
        if (!confirm('Delete this inventory item? This cannot be undone.')) return;
        
        const updated = currentInventory.filter(i => i.id !== editingInventoryId);
        DND.Inventory.save(updated);
        refreshData();
        closeModal();
        DND_LAYOUT.toast('Item deleted');
    }

    function closeModal() {
        document.getElementById('inventory-modal').hidden = true;
        editingInventoryId = null;
    }

    function populateCategoryFilter() {
        const select = document.getElementById('category-filter');
        if (!select) return;
        select.innerHTML = '<option value="all">All Categories</option>' +
            DND.CATEGORIES.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
    }

    function populateCategorySelect() {
        const select = document.getElementById('inv-category');
        if (!select) return;
        select.innerHTML = DND.CATEGORIES.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
    }

    function refreshData() {
        currentInventory = DND.Inventory.all();
        renderReports();
        renderCategoryChart();
        renderTable();
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
        
        populateCategoryFilter();
        populateCategorySelect();
        refreshData();
        updateRole();
        
        // Search and filter
        const searchInput = document.getElementById('inventory-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                currentSearch = e.target.value;
                renderTable();
            });
        }
        
        const catFilter = document.getElementById('category-filter');
        if (catFilter) {
            catFilter.addEventListener('change', (e) => {
                currentCategory = e.target.value;
                renderTable();
            });
        }
        
        document.getElementById('reset-inventory')?.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            if (catFilter) catFilter.value = 'all';
            currentSearch = '';
            currentCategory = 'all';
            renderTable();
        });
        
        document.getElementById('add-inventory-btn')?.addEventListener('click', openAddModal);
        document.getElementById('close-inventory-modal')?.addEventListener('click', closeModal);
        document.getElementById('cancel-inventory-modal')?.addEventListener('click', closeModal);
        document.getElementById('save-inventory-btn')?.addEventListener('click', saveInventory);
        document.getElementById('delete-inventory-btn')?.addEventListener('click', deleteInventory);
        
        window.addEventListener('storage', (e) => {
            if (e.key === DND.KEYS.inventory || e.key === DND.KEYS.role) {
                refreshData();
                updateRole();
            }
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();