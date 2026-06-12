(() => {
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));
    const sections = Array.from(document.querySelectorAll('section[id]'));
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');
    const joinTriggers = Array.from(document.querySelectorAll('.open-join-modal'));
    const joinModal = document.getElementById('joinModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalCancelBtn = document.getElementById('modalCancelBtn');

    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const href = a.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    const setActiveLink = () => {
        const scrollPos = window.scrollY + 120;
        let currentId = sections[0].id;

        for (const sec of sections) {
            const top = sec.offsetTop;
            if (scrollPos >= top) currentId = sec.id;
        }

        navLinks.forEach(link => {
            const href = link.getAttribute('href') || '';
            if (href === `#${currentId}`) link.classList.add('active');
            else link.classList.remove('active');
        });
    };

    window.addEventListener('scroll', setActiveLink);
    window.addEventListener('load', setActiveLink);
    window.addEventListener('resize', setActiveLink);

    if (mobileBtn && navLinksContainer) {
        mobileBtn.addEventListener('click', () => {
            navLinksContainer.classList.toggle('open');
            mobileBtn.classList.toggle('open');
        });
    }

    const openModal = () => {
        if (!joinModal) return;
        joinModal.style.display = 'flex';
        const first = joinModal.querySelector('input, select, textarea');
        if (first) first.focus();
    };

    const closeModal = () => {
        if (!joinModal) return;
        joinModal.style.display = 'none';
        const msg = document.getElementById('modalSuccessMessage');
        if (msg) msg.textContent = '';
    };

    joinTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeModal);

    if (joinModal) {
        joinModal.addEventListener('click', (e) => {
            if (e.target === joinModal) closeModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    const saveRegistration = (data) => {
        try {
            const key = 'farmhub_registrations';
            const existing = JSON.parse(localStorage.getItem(key) || '[]');
            existing.push({ ...data, createdAt: new Date().toISOString() });
            localStorage.setItem(key, JSON.stringify(existing));
        } catch (err) {
            console.error('Failed to save registration', err);
        }
    };

    const handleFormSubmission = (form, successMessageEl, onSuccess) => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = form.querySelector('input[id$="name"]').value.trim();
            const email = form.querySelector('input[id$="email"]').value.trim();
            const phone = form.querySelector('input[id$="phone"]').value.trim();
            const role = form.querySelector('select[id$="role"]').value;

            if (!name || !email || !phone || !role) {
                successMessageEl.textContent = 'Please complete all fields.';
                successMessageEl.style.color = 'crimson';
                return;
            }

            saveRegistration({ name, email, phone, role });

            successMessageEl.textContent = 'Registration received — thank you!';
            successMessageEl.style.color = '#0a7a3d';

            form.reset();

            if (typeof onSuccess === 'function') onSuccess();
        });
    };

    const mainForm = document.getElementById('joinForm');
    const mainSuccess = document.getElementById('successMessage');

    if (mainForm && mainSuccess) {
        handleFormSubmission(mainForm, mainSuccess, () => {
            const joinSection = document.getElementById('join');
            if (joinSection) joinSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    const modalForm = document.getElementById('modalJoinForm');
    const modalSuccess = document.getElementById('modalSuccessMessage');

    if (modalForm && modalSuccess) {
        handleFormSubmission(modalForm, modalSuccess, () => {
            setTimeout(() => closeModal(), 900);
        });
    }
})();