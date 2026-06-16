// ============================================
// Salone FarmHub — Frontend Application
// ============================================
// Handles dynamic data loading from the API,
// form submissions, and UI interactions.
// ============================================

const API_BASE = '';

// ============================================
// UTILITY FUNCTIONS
// ============================================

async function apiFetch(endpoint) {
    try {
        const res = await fetch(`${API_BASE}${endpoint}`);
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
        return data.data;
    } catch (err) {
        console.error(`API Error [${endpoint}]:`, err);
        return null;
    }
}

async function apiPost(endpoint, body) {
    try {
        const res = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.error(`API POST Error [${endpoint}]:`, err);
        return { success: false, error: 'Network error. Please try again.' };
    }
}

function formatPrice(price, currency = 'SLE') {
    return `${currency} ${Number(price).toLocaleString('en-US', { minimumFractionDigits: 0 })}`;
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    });
}

// ============================================
// MOBILE MENU
// ============================================

function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navActions = document.querySelector('.nav-actions');

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            if (navLinks) navLinks.classList.toggle('active');
            if (navActions) navActions.classList.toggle('active');
            const icon = menuBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-xmark');
            }
        });
    }
}

// ============================================
// SMOOTH SCROLLING
// ============================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Close mobile menu if open
                const navLinks = document.querySelector('.nav-links');
                const navCta = document.querySelector('.nav-cta');
                const menuBtn = document.querySelector('.mobile-menu-btn i');
                
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    if (navCta) navCta.classList.remove('active');
                    if (menuBtn) {
                        menuBtn.classList.remove('fa-xmark');
                        menuBtn.classList.add('fa-bars');
                    }
                }
            }
        });
    });
}

// ============================================
// TESTIMONIALS — Dynamic Loading
// ============================================

async function loadTestimonials() {
    const container = document.getElementById('testimonials-container');
    if (!container) return;

    const testimonials = await apiFetch('/api/testimonials');
    if (!testimonials || testimonials.length === 0) return;

    container.innerHTML = testimonials.map(t => `
        <article class="testimonial-card">
            <div class="testimonial-stars">
                ${'<i class="fa-solid fa-star"></i>'.repeat(t.rating || 5)}
            </div>
            <p>\u201C${t.content}\u201D</p>
            <div class="testimonial-author">
                <strong>${t.author_name}</strong>
                <span>${t.author_role}</span>
            </div>
        </article>
    `).join('');
}

// ============================================
// MARKET PRICES — Dynamic Loading
// ============================================

async function loadMarketPrices() {
    const tableBody = document.getElementById('prices-table-body');
    const filterSelect = document.getElementById('price-filter-crop');
    if (!tableBody) return;

    const prices = await apiFetch('/api/market-prices');
    if (!prices || prices.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="no-data">No price data available</td></tr>';
        return;
    }

    // Populate crop filter
    if (filterSelect) {
        const crops = [...new Set(prices.map(p => p.crop_name))];
        filterSelect.innerHTML = '<option value="">All Crops</option>' +
            crops.map(c => `<option value="${c}">${c}</option>`).join('');

        filterSelect.addEventListener('change', () => {
            renderPriceRows(prices, filterSelect.value);
        });
    }

    renderPriceRows(prices, '');
}

function renderPriceRows(prices, filterCrop) {
    const tableBody = document.getElementById('prices-table-body');
    const filtered = filterCrop
        ? prices.filter(p => p.crop_name === filterCrop)
        : prices;

    tableBody.innerHTML = filtered.map(p => `
        <tr>
            <td>
                <span class="crop-badge">${p.crop_name}</span>
            </td>
            <td>${p.market_name}</td>
            <td class="price-cell">${formatPrice(p.price, p.currency)}</td>
            <td><span class="unit-badge">per ${p.unit}</span></td>
            <td>${formatDate(p.price_date)}</td>
        </tr>
    `).join('');
}

// ============================================
// PLATFORM STATS — Dynamic Loading
// ============================================

async function loadStats() {
    const stats = await apiFetch('/api/stats');
    if (!stats) return;

    const mapping = {
        'stat-farmers': stats.active_farmers,
        'stat-buyers': stats.active_buyers,
        'stat-crops': stats.total_crops,
        'stat-orders': stats.total_orders,
    };

    Object.entries(mapping).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el) animateCounter(el, value);
    });
}

function animateCounter(el, target) {
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 40));
    const interval = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(interval);
        }
        el.textContent = current.toLocaleString();
    }, 30);
}

// ============================================
// FARMER REGISTRATION FORM
// ============================================

function initRegistrationForm() {
    const form = document.getElementById('farmer-registration-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const feedback = document.getElementById('form-feedback');
        const originalText = submitBtn.textContent;

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Registering...';
        if (feedback) feedback.className = 'form-feedback';

        const formData = {
            first_name: form.first_name.value.trim(),
            last_name: form.last_name.value.trim(),
            email: form.email.value.trim(),
            phone: form.phone.value.trim(),
            district: form.district.value,
            chiefdom: form.chiefdom.value.trim(),
            village: form.village.value.trim(),
            farm_size_acres: form.farm_size_acres.value ? parseFloat(form.farm_size_acres.value) : null,
        };

        const result = await apiPost('/api/farmers/register', formData);

        if (result.success) {
            if (feedback) {
                feedback.className = 'form-feedback success';
                feedback.innerHTML = '<i class="fa-solid fa-circle-check"></i> Registration successful! Welcome to Salone FarmHub.';
            }
            form.reset();
            // Reload stats
            loadStats();
        } else {
            if (feedback) {
                feedback.className = 'form-feedback error';
                feedback.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${result.error}`;
            }
        }

        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    });
}

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================

function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ============================================
// SCROLL REVEAL ANIMATION
// ============================================

function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    reveals.forEach(el => observer.observe(el));
}

// ============================================
// AUTHENTICATION UI LOGIC
// ============================================

function initAuthUI() {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
        try {
            const user = JSON.parse(userStr);
            // Extract the part of email before @ for the name
            const name = user.email.split('@')[0];
            const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
            
            const navActions = document.querySelector('.nav-actions');
            if (navActions) {
                navActions.innerHTML = `
                    <span style="font-weight: 600; color: var(--text-main); margin-right: 0.5rem;">Welcome, <span style="color: var(--primary-color);">${formattedName}</span></span>
                    <button onclick="logout()" class="btn btn-outline" style="border-color: var(--primary-color); color: var(--primary-color); padding: 0.4rem 1.2rem; min-width: auto; height: auto;">Logout</button>
                `;
            }
        } catch (e) {
            console.error('Error parsing user data', e);
        }
    }
}

window.logout = function() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
};

// ============================================
// INITIALIZE EVERYTHING
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // UI interactions
    initAuthUI();
    initMobileMenu();
    initSmoothScroll();
    initNavbarScroll();
    initScrollReveal();

    // Dynamic data from API
    loadTestimonials();
    loadMarketPrices();
    loadStats();

    // Form handlers
    initRegistrationForm();
});
