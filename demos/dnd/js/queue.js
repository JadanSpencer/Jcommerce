/* ==========================================================================
   D&D WHOLESALE LTD — ONLINE QUEUE
   Take a number, view live queue, admin/staff can advance and remove tickets
   ========================================================================== */

   (function() {
    let currentQueue = [];
    let currentCart = [];
    let currentRole = 'customer';
    let myTicketId = null;
    let refreshInterval = null;

    function updateRole() {
        currentRole = DND.getRole();
        const adminBtns = document.getElementById('admin-queue-btns');
        if (adminBtns) {
            adminBtns.style.display = (currentRole === 'admin') ? 'block' : 'none';
        }
    }

    function loadData() {
        currentQueue = DND.Queue.all();
        currentCart = DND.Cart.all();
        
        // Check if user has an active ticket in localStorage
        const savedTicketId = localStorage.getItem('dnd_active_ticket');
        if (savedTicketId) {
            const ticket = currentQueue.find(t => t.id === savedTicketId && t.status !== 'done');
            if (ticket) {
                myTicketId = savedTicketId;
            } else {
                localStorage.removeItem('dnd_active_ticket');
                myTicketId = null;
            }
        }
    }

    function renderCart() {
        const container = document.getElementById('cart-items');
        const totalContainer = document.getElementById('cart-total');
        
        if (!currentCart.length) {
            container.innerHTML = '<div class="empty">Your cart is empty. <a href="menu.html">Browse the menu</a> to add items.</div>';
            if (totalContainer) totalContainer.innerHTML = '';
            return;
        }
        
        const total = currentCart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        
        container.innerHTML = currentCart.map(item => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-2) 0; border-bottom: 1px dashed var(--color-hairline);">
                <div>
                    <strong>${escapeHtml(item.name)}</strong>
                    <div class="text-sm muted">${item.qty} × ${DND.formatJMD(item.price)}</div>
                </div>
                <button class="icon-btn icon-btn--danger remove-item" data-id="${item.id}" style="width: 2rem; height: 2rem;">✕</button>
            </div>
        `).join('');
        
        if (totalContainer) {
            totalContainer.innerHTML = `Total: ${DND.formatJMD(total)}`;
        }
        
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                removeFromCart(id);
            });
        });
    }

    function removeFromCart(id) {
        currentCart = currentCart.filter(item => item.id !== id);
        DND.Cart.save(currentCart);
        renderCart();
        DND_LAYOUT.toast('Item removed from cart');
    }

    function renderQueueBoard() {
        const container = document.getElementById('queue-board');
        if (!container) return;
        
        const waiting = currentQueue.filter(t => t.status === 'waiting');
        const serving = currentQueue.filter(t => t.status === 'serving');
        const done = currentQueue.filter(t => t.status === 'done');
        
        const statsSpan = document.getElementById('queue-stats');
        if (statsSpan) statsSpan.textContent = `${waiting.length} waiting, ${serving.length} serving`;
        
        const allTickets = [...serving, ...waiting, ...done.slice(0, 5)];
        
        if (allTickets.length === 0) {
            container.innerHTML = '<div class="empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 3v18l3-2 3 2 3-2 3 2 3-2V3l-3 2-3-2-3 2-3-2-3 2Z"/></svg><p>Queue is empty — be the first to join!</p></div>';
            return;
        }
        
        container.innerHTML = allTickets.map(ticket => {
            let statusClass = '', statusText = '', dotClass = '';
            if (ticket.status === 'waiting') { dotClass = 'dot--waiting'; statusText = 'Waiting'; }
            else if (ticket.status === 'serving') { dotClass = 'dot--serving'; statusText = 'Serving Now'; }
            else { dotClass = 'dot--done'; statusText = 'Completed'; }
            
            const isMyTicket = ticket.id === myTicketId;
            
            return `
                <div class="queue-ticket ${isMyTicket ? 'my-ticket' : ''}" data-id="${ticket.id}">
                    <div class="queue-ticket__head">
                        <span class="queue-ticket__no">#${ticket.number}</span>
                        <span class="queue-status"><span class="dot ${dotClass}"></span> ${statusText}</span>
                    </div>
                    <div class="queue-ticket__body">
                        <div><strong>${escapeHtml(ticket.customer)}</strong></div>
                        <div class="queue-ticket__items">
                            ${ticket.items.slice(0, 3).map(item => `${item.qty}× ${escapeHtml(item.name)}`).join(', ')}
                            ${ticket.items.length > 3 ? ` +${ticket.items.length - 3} more` : ''}
                        </div>
                    </div>
                    <div class="queue-ticket__foot">
                        <span class="queue-ticket__time">${ticket.time || ticket.timestamp || '—'}</span>
                        ${(currentRole === 'admin' || currentRole === 'staff') && ticket.status !== 'done' ? `
                            <div style="display: flex; gap: 0.5rem;">
                                ${ticket.status === 'waiting' ? `<button class="btn btn--sm btn--primary serve-ticket" data-id="${ticket.id}">Call to Counter</button>` : ''}
                                ${ticket.status === 'serving' ? `<button class="btn btn--sm btn--ghost complete-ticket" data-id="${ticket.id}">Complete</button>` : ''}
                                <button class="btn btn--sm btn--danger remove-ticket" data-id="${ticket.id}">Remove</button>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
        
        // Attach admin/staff handlers
        if (currentRole === 'admin' || currentRole === 'staff') {
            document.querySelectorAll('.serve-ticket').forEach(btn => {
                btn.addEventListener('click', () => serveTicket(btn.dataset.id));
            });
            document.querySelectorAll('.complete-ticket').forEach(btn => {
                btn.addEventListener('click', () => completeTicket(btn.dataset.id));
            });
            document.querySelectorAll('.remove-ticket').forEach(btn => {
                btn.addEventListener('click', () => removeTicket(btn.dataset.id));
            });
        }
    }

    function joinQueue() {
        if (!currentCart.length) {
            DND_LAYOUT.toast('Add items to your cart before joining the queue');
            return;
        }
        
        const customerName = document.getElementById('queue-name').value.trim();
        if (!customerName) {
            DND_LAYOUT.toast('Please enter your name');
            return;
        }
        
        // Find next number
        let maxNum = 0;
        currentQueue.forEach(t => {
            const num = parseInt(t.number);
            if (!isNaN(num) && num > maxNum) maxNum = num;
        });
        const newNumber = maxNum + 1;
        
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        
        const cartItems = currentCart.map(item => ({
            name: item.name,
            qty: item.qty,
            price: item.price
        }));
        
        const newTicket = {
            id: DND.nextId('Q', currentQueue),
            number: newNumber,
            customer: customerName,
            items: cartItems,
            status: 'waiting',
            time: timeStr,
            timestamp: now.toISOString()
        };
        
        const updated = [...currentQueue, newTicket];
        DND.Queue.save(updated);
        
        // Save ticket to localStorage
        localStorage.setItem('dnd_active_ticket', newTicket.id);
        myTicketId = newTicket.id;
        
        // Clear cart
        DND.Cart.save([]);
        currentCart = [];
        
        // Store customer name for persistence
        localStorage.setItem('dnd_queue_name', customerName);
        
        refreshData();
        DND_LAYOUT.toast(`Ticket #${newNumber} — you're in the queue!`);
        
        // Update UI
        document.getElementById('join-queue-section').style.display = 'none';
        document.getElementById('my-ticket-section').style.display = 'block';
        document.getElementById('queue-name').value = '';
    }

    function serveTicket(id) {
        const ticket = currentQueue.find(t => t.id === id);
        if (ticket) {
            ticket.status = 'serving';
            DND.Queue.save(currentQueue);
            refreshData();
            DND_LAYOUT.toast(`Now serving #${ticket.number} - ${ticket.customer}`);
        }
    }

    function completeTicket(id) {
        const ticket = currentQueue.find(t => t.id === id);
        if (ticket) {
            ticket.status = 'done';
            DND.Queue.save(currentQueue);
            refreshData();
            DND_LAYOUT.toast(`#${ticket.number} completed`);
            
            if (myTicketId === id) {
                localStorage.removeItem('dnd_active_ticket');
                myTicketId = null;
                document.getElementById('join-queue-section').style.display = 'block';
                document.getElementById('my-ticket-section').style.display = 'none';
            }
        }
    }

    function removeTicket(id) {
        if (!confirm('Remove this ticket from the queue?')) return;
        const updated = currentQueue.filter(t => t.id !== id);
        DND.Queue.save(updated);
        refreshData();
        
        if (myTicketId === id) {
            localStorage.removeItem('dnd_active_ticket');
            myTicketId = null;
            document.getElementById('join-queue-section').style.display = 'block';
            document.getElementById('my-ticket-section').style.display = 'none';
        }
        DND_LAYOUT.toast('Ticket removed');
    }

    function cancelMyTicket() {
        if (!myTicketId) return;
        if (confirm('Cancel your ticket? You will lose your place in line.')) {
            removeTicket(myTicketId);
        }
    }

    function resetQueue() {
        if (!confirm('RESET ENTIRE QUEUE? This will remove all tickets. Are you sure?')) return;
        DND.Queue.save([]);
        localStorage.removeItem('dnd_active_ticket');
        myTicketId = null;
        refreshData();
        document.getElementById('join-queue-section').style.display = 'block';
        document.getElementById('my-ticket-section').style.display = 'none';
        DND_LAYOUT.toast('Queue has been reset');
    }

    function renderMyTicket() {
        if (!myTicketId) {
            document.getElementById('join-queue-section').style.display = 'block';
            document.getElementById('my-ticket-section').style.display = 'none';
            return;
        }
        
        const ticket = currentQueue.find(t => t.id === myTicketId);
        if (!ticket || ticket.status === 'done') {
            localStorage.removeItem('dnd_active_ticket');
            myTicketId = null;
            document.getElementById('join-queue-section').style.display = 'block';
            document.getElementById('my-ticket-section').style.display = 'none';
            return;
        }
        
        document.getElementById('join-queue-section').style.display = 'none';
        document.getElementById('my-ticket-section').style.display = 'block';
        document.getElementById('my-ticket-number').textContent = ticket.number;
        
        let statusClass = '', statusText = '';
        if (ticket.status === 'waiting') { statusClass = 'dot--waiting'; statusText = 'Waiting'; }
        else { statusClass = 'dot--serving'; statusText = 'Being Served'; }
        
        document.getElementById('my-ticket-status').innerHTML = `<span class="dot ${statusClass}"></span> ${statusText}`;
        document.getElementById('my-ticket-items').innerHTML = ticket.items.map(item => `${item.qty}× ${escapeHtml(item.name)}`).join(', ');
        document.getElementById('my-ticket-time').textContent = ticket.time;
    }

    function refreshData() {
        loadData();
        renderCart();
        renderQueueBoard();
        renderMyTicket();
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

    function startAutoRefresh() {
        if (refreshInterval) clearInterval(refreshInterval);
        refreshInterval = setInterval(() => {
            loadData();
            renderQueueBoard();
            renderMyTicket();
        }, 5000);
    }

    function init() {
        if (!window.DND) {
            setTimeout(init, 100);
            return;
        }
        
        updateRole();
        refreshData();
        startAutoRefresh();
        
        document.getElementById('join-queue-btn')?.addEventListener('click', joinQueue);
        document.getElementById('cancel-ticket-btn')?.addEventListener('click', cancelMyTicket);
        document.getElementById('reset-queue-btn')?.addEventListener('click', resetQueue);
        
        // Pre-fill name if available
        const savedName = localStorage.getItem('dnd_queue_name');
        if (savedName) {
            document.getElementById('queue-name').value = savedName;
        }
        
        window.addEventListener('storage', (e) => {
            if (e.key === DND.KEYS.queue || e.key === DND.KEYS.cart || e.key === DND.KEYS.role) {
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