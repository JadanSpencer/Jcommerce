/* ==========================================================================
   D&D WHOLESALE LTD — STAFF DIRECTORY
   CRUD operations for staff (admin only), search, viewing
   ========================================================================== */

   (function() {
    let currentStaff = [];
    let currentSearch = '';
    let editingStaffId = null;
    let currentRole = 'customer';

    function updateRole() {
        currentRole = DND.getRole();
        const adminBtn = document.getElementById('admin-staff-btn');
        if (adminBtn) {
            adminBtn.style.display = (currentRole === 'admin') ? 'block' : 'none';
        }
    }

    function renderStaff() {
        const container = document.getElementById('staff-grid');
        if (!container) return;
        
        let filtered = currentStaff.filter(s => {
            if (!currentSearch) return true;
            const searchLower = currentSearch.toLowerCase();
            return s.name.toLowerCase().includes(searchLower) || 
                   s.position.toLowerCase().includes(searchLower) ||
                   (s.employeeId && s.employeeId.toLowerCase().includes(searchLower));
        });
        
        if (filtered.length === 0) {
            container.innerHTML = '<div class="empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><p>No staff members found</p></div>';
            return;
        }
        
        container.innerHTML = filtered.map(staff => {
            const initials = DND.initials(staff.name);
            const bgColor = DND.avatarColor(staff.name);
            const age = DND.age(staff.dob);
            const ageText = age ? `, ${age} yrs` : '';
            
            return `
                <div class="staff-card" data-id="${staff.id}">
                    <div class="avatar" style="background: ${bgColor}">${initials}</div>
                    <h3 class="staff-card__name">${escapeHtml(staff.name)}</h3>
                    <div class="staff-card__role">${escapeHtml(staff.position)}</div>
                    <div class="staff-card__meta">${staff.employeeId || 'ID pending'}${ageText}</div>
                    <div class="btn-row">
                        <a href="ratings.html?staff=${staff.id}" class="btn btn--ghost btn--sm">Rate / Compliment</a>
                    </div>
                    ${currentRole === 'admin' ? `
                        <div class="icon-row">
                            <button class="icon-btn edit-staff" data-id="${staff.id}">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3l4 4-12 12H5v-4L17 3z"/></svg>
                            </button>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
        
        if (currentRole === 'admin') {
            document.querySelectorAll('.edit-staff').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = btn.dataset.id;
                    openEditModal(id);
                });
            });
        }
    }

    function openEditModal(id) {
        const staff = currentStaff.find(s => s.id === id);
        if (!staff) return;
        editingStaffId = id;
        document.getElementById('staff-modal-title').textContent = 'Edit Staff Member';
        document.getElementById('staff-name').value = staff.name;
        document.getElementById('staff-employee-id').value = staff.employeeId || '';
        document.getElementById('staff-position').value = staff.position;
        document.getElementById('staff-dob').value = staff.dob || '';
        document.getElementById('delete-staff-btn').style.display = 'inline-flex';
        document.getElementById('staff-modal').hidden = false;
    }

    function openAddModal() {
        editingStaffId = null;
        document.getElementById('staff-modal-title').textContent = 'Add Staff Member';
        document.getElementById('staff-name').value = '';
        document.getElementById('staff-employee-id').value = '';
        document.getElementById('staff-position').value = '';
        document.getElementById('staff-dob').value = '';
        document.getElementById('delete-staff-btn').style.display = 'none';
        document.getElementById('staff-modal').hidden = false;
    }

    function saveStaff() {
        const name = document.getElementById('staff-name').value.trim();
        const employeeId = document.getElementById('staff-employee-id').value.trim();
        const position = document.getElementById('staff-position').value;
        const dob = document.getElementById('staff-dob').value;
        
        if (!name || !position) {
            DND_LAYOUT.toast('Name and position are required');
            return;
        }
        
        let staffList = [...currentStaff];
        
        if (editingStaffId) {
            const index = staffList.findIndex(s => s.id === editingStaffId);
            if (index !== -1) {
                staffList[index] = {
                    ...staffList[index],
                    name,
                    employeeId: employeeId || `DD-${String(staffList[index].id).slice(1)}`,
                    position,
                    dob
                };
            }
        } else {
            const newId = DND.nextId('S', staffList);
            staffList.push({
                id: newId,
                employeeId: employeeId || `DD-${String(newId).slice(1)}`,
                name,
                position,
                dob: dob || '',
                photo: ''
            });
        }
        
        DND.Staff.save(staffList);
        currentStaff = staffList;
        renderStaff();
        closeModal();
        DND_LAYOUT.toast(editingStaffId ? 'Staff updated' : 'Staff added');
    }

    function deleteStaff() {
        if (!editingStaffId) return;
        if (!confirm('Delete this staff member? This cannot be undone.')) return;
        
        const staffList = currentStaff.filter(s => s.id !== editingStaffId);
        DND.Staff.save(staffList);
        currentStaff = staffList;
        renderStaff();
        closeModal();
        DND_LAYOUT.toast('Staff deleted');
    }

    function closeModal() {
        document.getElementById('staff-modal').hidden = true;
        editingStaffId = null;
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

    function populatePositionSelect() {
        const select = document.getElementById('staff-position');
        if (!select) return;
        select.innerHTML = '<option value="">Select position</option>' + 
            DND.STAFF_POSITIONS.map(pos => `<option value="${pos}">${pos}</option>`).join('');
    }

    function init() {
        if (!window.DND) {
            setTimeout(init, 100);
            return;
        }
        
        populatePositionSelect();
        currentStaff = DND.Staff.all();
        updateRole();
        renderStaff();
        
        // Search
        const searchInput = document.getElementById('staff-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                currentSearch = e.target.value;
                renderStaff();
            });
        }
        
        // Reset search
        document.getElementById('reset-staff-search')?.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            currentSearch = '';
            renderStaff();
        });
        
        // Add staff button
        document.getElementById('add-staff-btn')?.addEventListener('click', openAddModal);
        
        // Modal handlers
        document.getElementById('close-staff-modal')?.addEventListener('click', closeModal);
        document.getElementById('cancel-staff-modal')?.addEventListener('click', closeModal);
        document.getElementById('save-staff-btn')?.addEventListener('click', saveStaff);
        document.getElementById('delete-staff-btn')?.addEventListener('click', deleteStaff);
        
        // Listen for role changes
        window.addEventListener('storage', (e) => {
            if (e.key === DND.KEYS.role) {
                updateRole();
                renderStaff();
            }
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();