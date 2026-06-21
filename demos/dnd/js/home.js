/* ==========================================================================
   D&D WHOLESALE LTD — HOME PAGE
   Populates dynamic stats (menu count, staff count, avg rating)
   ========================================================================== */

   (function() {
    // Wait for DOM and DND data
    function init() {
        if (!window.DND) {
            setTimeout(init, 100);
            return;
        }

        // Update menu count
        const menuCountEl = document.getElementById('stat-menu-count');
        if (menuCountEl) {
            const menu = DND.Menu.all();
            menuCountEl.textContent = menu.length;
        }

        // Update staff count
        const staffCountEl = document.getElementById('stat-staff-count');
        if (staffCountEl) {
            const staff = DND.Staff.all();
            staffCountEl.textContent = staff.length;
        }

        // Optionally update average rating
        const ratingEl = document.querySelector('.tally__value + .tally__label');
        // Not critical
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();