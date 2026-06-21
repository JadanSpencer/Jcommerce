/* ==========================================================================
   D&D WHOLESALE LTD — RATINGS & COMPLAINTS
   Submit feedback, view feed, admin resolution tools
   ========================================================================== */

   (function() {
    let currentRatings = [];
    let currentStaff = [];
    let currentFilter = 'all';
    let selectedStars = 5;
    let currentRole = 'customer';

    function updateRole() {
        currentRole = DND.getRole();
        const adminSection = document.getElementById('admin-summary');
        if (adminSection) {
            adminSection.style.display = (currentRole === 'admin') ? 'block' : 'none';
        }
        if (currentRole === 'admin') {
            renderSummary();
        }
    }

    function renderStarsInput() {
        const container = document.getElementById('stars-input');
        if (!container) return;
        container.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
            btn.style.color = i <= selectedStars ? '#D7263D' : '#E1E4E9';
            btn.addEventListener('click', () => {
                selectedStars = i;
                renderStarsInput();
            });
            container.appendChild(btn);
        }
    }

    function populateStaffSelect() {
        const select = document.getElementById('rating-staff');
        if (!select) return;
        select.innerHTML = '<option value="">-- Select a staff member --</option>' +
            currentStaff.map(s => `<option value="${s.id}">${s.name} (${s.position})</option>`).join('');
    }

    function submitRating() {
        const type = document.getElementById('rating-type').value;
        const customer = document.getElementById('rating-customer').value.trim() || 'Anonymous';
        const staffId = document.getElementById('rating-staff').value;
        const category = document.getElementById('rating-category').value;
        const message = document.getElementById('rating-message').value.trim();
        
        if (!message) {
            DND_LAYOUT.toast('Please enter a message');
            return;
        }
        
        const newRating = {
            id: DND.nextId('R', currentRatings),
            customer: customer,
            staffId: staffId,
            category: category,
            type: type,
            stars: type === 'rating' ? selectedStars : null,
            message: message,
            status: 'open',
            date: new Date().toISOString().split('T')[0]
        };
        
        const updated = [...currentRatings, newRating];
        DND.Ratings.save(updated);
        currentRatings = updated;
        
        // Clear form
        document.getElementById('rating-customer').value = '';
        document.getElementById('rating-staff').value = '';
        document.getElementById('rating-category').value = 'Service';
        document.getElementById('rating-message').value = '';
        selectedStars = 5;
        renderStarsInput();
        
        renderFeed();
        if (currentRole === 'admin') renderSummary();
        DND_LAYOUT.toast('Feedback submitted — thank you!');
    }

    function renderFeed() {
        const container = document.getElementById('ratings-feed');
        if (!container) return;
        
        let filtered = currentRatings;
        if (currentFilter === 'rating') filtered = currentRatings.filter(r => r.type === 'rating');
        if (currentFilter === 'complaint') filtered = currentRatings.filter(r => r.type === 'complaint');
        
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (filtered.length === 0) {
            container.innerHTML = '<div class="empty"><p>No feedback yet</p></div>';
            return;
        }
        
        const staffMap = new Map(currentStaff.map(s => [s.id, s]));
        
        container.innerHTML = filtered.map(r => {
            const staff = r.staffId ? staffMap.get(r.staffId) : null;
            const starsHtml = r.stars ? '<span class="feed-item__stars">' + '★'.repeat(r.stars) + '☆'.repeat(5 - r.stars) + '</span>' : '';
            const typeBadge = r.type === 'rating' ? 
                '<span class="badge badge--green">Rating</span>' : 
                '<span class="badge badge--red">Complaint</span>';
            const statusBadge = r.status === 'resolved' ? 
                '<span class="badge badge--slate">Resolved</span>' : 
                '<span class="badge badge--amber">Open</span>';
            
            return `
                <div class="feed-item" data-id="${r.id}">
                    <div class="feed-item__head">
                        <div>
                            <span class="feed-item__who">${escapeHtml(r.customer)}</span>
                            ${staff ? `<span class="feed-item__meta"> → ${escapeHtml(staff.name)}</span>` : ''}
                        </div>
                        <div style="display:flex; gap:0.5rem">${typeBadge} ${statusBadge}</div>
                    </div>
                    ${starsHtml}
                    <div class="feed-item__msg">${escapeHtml(r.message)}</div>
                    <div class="feed-item__foot">
                        <span class="feed-item__meta">${r.date}</span>
                        <span class="feed-item__meta">${r.category}</span>
                        ${currentRole === 'admin' && r.status === 'open' ? 
                            `<button class="btn btn--sm btn--ghost resolve-feed" data-id="${r.id}">Mark Resolved</button>` : ''}
                    </div>
                </div>
            `;
        }).join('');
        
        if (currentRole === 'admin') {
            document.querySelectorAll('.resolve-feed').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = btn.dataset.id;
                    resolveRating(id);
                });
            });
        }
    }

    function resolveRating(id) {
        const rating = currentRatings.find(r => r.id === id);
        if (!rating) return;
        rating.status = 'resolved';
        DND.Ratings.save(currentRatings);
        renderFeed();
        if (currentRole === 'admin') renderSummary();
        DND_LAYOUT.toast('Marked as resolved');
    }

    function renderSummary() {
        const container = document.getElementById('summary-stats');
        if (!container) return;
        
        const total = currentRatings.length;
        const avgStars = currentRatings.filter(r => r.stars).reduce((sum, r) => sum + r.stars, 0) / 
                        (currentRatings.filter(r => r.stars).length || 1);
        const openComplaints = currentRatings.filter(r => r.type === 'complaint' && r.status === 'open').length;
        
        container.innerHTML = `
            <div class="summary-card"><div class="summary-card__value">${total}</div><div class="summary-card__label">Total Feedback</div></div>
            <div class="summary-card"><div class="summary-card__value">${avgStars.toFixed(1)}</div><div class="summary-card__label">Avg Rating</div></div>
            <div class="summary-card"><div class="summary-card__value ${openComplaints > 0 ? 'is-alert' : ''}">${openComplaints}</div><div class="summary-card__label">Open Complaints</div></div>
        `;
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
        
        currentStaff = DND.Staff.all();
        currentRatings = DND.Ratings.all();
        updateRole();
        
        populateStaffSelect();
        renderStarsInput();
        renderFeed();
        
        // Type toggle
        document.getElementById('type-rating')?.addEventListener('click', () => {
            document.getElementById('type-rating').classList.add('is-active');
            document.getElementById('type-complaint').classList.remove('is-active');
            document.getElementById('rating-type').value = 'rating';
            document.getElementById('stars-field').style.display = 'block';
        });
        document.getElementById('type-complaint')?.addEventListener('click', () => {
            document.getElementById('type-complaint').classList.add('is-active');
            document.getElementById('type-rating').classList.remove('is-active');
            document.getElementById('rating-type').value = 'complaint';
            document.getElementById('stars-field').style.display = 'none';
        });
        
        // Feed filter
        document.querySelectorAll('[data-feed-filter]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-feed-filter]').forEach(b => b.classList.remove('is-active'));
                btn.classList.add('is-active');
                currentFilter = btn.dataset.feedFilter;
                renderFeed();
            });
        });
        
        // Submit
        document.getElementById('submit-rating')?.addEventListener('click', submitRating);
        
        // Listen for storage changes
        window.addEventListener('storage', (e) => {
            if (e.key === DND.KEYS.ratings || e.key === DND.KEYS.staff || e.key === DND.KEYS.role) {
                currentRatings = DND.Ratings.all();
                currentStaff = DND.Staff.all();
                updateRole();
                populateStaffSelect();
                renderFeed();
                if (currentRole === 'admin') renderSummary();
            }
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();