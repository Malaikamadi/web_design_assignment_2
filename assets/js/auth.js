// ============================================
// Salone FarmHub — Authentication Scripts
// ============================================

const API_BASE = '';

// Redirect if already logged in
if (localStorage.getItem('token') && localStorage.getItem('user')) {
    window.location.href = 'index.html';
}

// Handle tab switching
function switchAuthTab(tab) {
    document.getElementById('tab-login').classList.remove('active');
    document.getElementById('tab-register').classList.remove('active');
    document.getElementById('login-form').classList.remove('active');
    document.getElementById('register-form').classList.remove('active');

    document.getElementById(`tab-${tab}`).classList.add('active');
    document.getElementById(`${tab}-form`).classList.add('active');

    const feedback = document.getElementById('form-feedback');
    if (feedback) feedback.style.display = 'none';
}

// Show feedback message
function showFeedback(message, type) {
    const feedback = document.getElementById('form-feedback');
    feedback.className = `form-feedback ${type}`;
    feedback.style.display = 'flex';
    
    if (type === 'success') {
        feedback.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${message}`;
    } else {
        feedback.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${message}`;
    }
}

// Handle Login
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = loginForm.querySelector('button');
        const originalText = btn.textContent;
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Logging in...';

        const email = document.getElementById('login_email').value.trim();
        const password = document.getElementById('login_password').value;

        try {
            const res = await fetch(`${API_BASE}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (data.success) {
                // Store token and user
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('user', JSON.stringify(data.data.user));
                
                showFeedback('Login successful! Redirecting...', 'success');
                
                // Redirect logic based on role could go here.
                // For now, redirect to home page.
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } else {
                showFeedback(data.error || 'Login failed', 'error');
            }
        } catch (err) {
            console.error(err);
            showFeedback('Network error. Please try again.', 'error');
        } finally {
            btn.disabled = false;
            btn.textContent = originalText;
        }
    });
}

// Handle Registration
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = registerForm.querySelector('button');
        const originalText = btn.textContent;
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Registering...';

        const email = document.getElementById('reg_email').value.trim();
        const password = document.getElementById('reg_password').value;
        const role = document.getElementById('reg_role').value;

        try {
            const res = await fetch(`${API_BASE}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, role })
            });
            const data = await res.json();

            if (data.success) {
                showFeedback('Registration successful! You can now log in.', 'success');
                registerForm.reset();
                setTimeout(() => switchAuthTab('login'), 2000);
            } else {
                showFeedback(data.error || 'Registration failed', 'error');
            }
        } catch (err) {
            console.error(err);
            showFeedback('Network error. Please try again.', 'error');
        } finally {
            btn.disabled = false;
            btn.textContent = originalText;
        }
    });
}
