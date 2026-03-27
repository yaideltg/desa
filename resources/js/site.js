// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.getElementById('mobile-menu-button');
    const closeButton = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuOverlay = document.getElementById('mobile-menu-overlay');

    function openMenu() {
        if (mobileMenu) mobileMenu.classList.add('open');
        if (menuOverlay) menuOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        if (mobileMenu) mobileMenu.classList.remove('open');
        if (menuOverlay) menuOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (menuButton) menuButton.addEventListener('click', openMenu);
    if (closeButton) closeButton.addEventListener('click', closeMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });

    // Close menu on link click
    if (mobileMenu) {
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }
});

// Header scroll effect
document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('site-header');
    if (!header) return;

    function updateHeader() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
});

// Image lightbox for car detail pages
document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    const img = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');

    const images = Array.from(document.querySelectorAll('[data-lightbox-src]'));
    if (images.length === 0) return;

    let currentIndex = 0;

    function open(index) {
        currentIndex = index;
        img.src = images[currentIndex].dataset.lightboxSrc;
        img.alt = images[currentIndex].alt || '';
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        const showNav = images.length > 1;
        prevBtn.style.display = showNav ? '' : 'none';
        nextBtn.style.display = showNav ? '' : 'none';
    }

    function close() {
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function navigate(direction) {
        currentIndex = (currentIndex + direction + images.length) % images.length;
        img.src = images[currentIndex].dataset.lightboxSrc;
        img.alt = images[currentIndex].alt || '';
    }

    images.forEach((el, i) => {
        const trigger = el.closest('[data-lightbox-trigger]') || el;
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            open(i);
        });
    });

    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', () => navigate(-1));
    nextBtn.addEventListener('click', () => navigate(1));

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target === lightbox.querySelector('.lightbox-content')) {
            close();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') navigate(-1);
        if (e.key === 'ArrowRight') navigate(1);
    });
});

// Car filters
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('cars-grid');
    if (!grid) return;

    const filters = {
        'body-type': document.getElementById('filter-body-type'),
        'transmission': document.getElementById('filter-transmission'),
        'fuel-type': document.getElementById('filter-fuel-type'),
        'status': document.getElementById('filter-status'),
    };
    const clearBtn = document.getElementById('filter-clear');
    const countEl = document.getElementById('car-count-number');
    const noResultsEl = document.getElementById('filter-no-results');
    const items = grid.querySelectorAll('.car-filter-item');

    function applyFilters() {
        const activeFilters = {};
        let hasActive = false;

        Object.entries(filters).forEach(([key, select]) => {
            const val = select.value;
            activeFilters[key] = val;
            if (val) {
                hasActive = true;
                select.classList.add('active');
            } else {
                select.classList.remove('active');
            }
        });

        let visible = 0;
        items.forEach(item => {
            const matches =
                (!activeFilters['body-type'] || item.dataset.bodyType === activeFilters['body-type']) &&
                (!activeFilters['transmission'] || item.dataset.transmission === activeFilters['transmission']) &&
                (!activeFilters['fuel-type'] || item.dataset.fuelType === activeFilters['fuel-type']) &&
                (!activeFilters['status'] || item.dataset.status === activeFilters['status']);

            if (matches) {
                item.classList.remove('filter-hidden');
                visible++;
            } else {
                item.classList.add('filter-hidden');
            }
        });

        if (countEl) countEl.textContent = visible;
        if (noResultsEl) {
            noResultsEl.classList.toggle('hidden', visible > 0);
            grid.classList.toggle('hidden', visible === 0);
        }

        clearBtn.classList.toggle('hidden', !hasActive);
    }

    Object.values(filters).forEach(select => {
        select.addEventListener('change', applyFilters);
    });

    clearBtn.addEventListener('click', () => {
        Object.values(filters).forEach(select => {
            select.value = '';
            select.classList.remove('active');
        });
        applyFilters();
    });
});

// Number formatting for prices
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-price]').forEach(el => {
        const value = parseFloat(el.dataset.price);
        if (!isNaN(value)) {
            el.textContent = '$' + value.toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
        }
    });
});
