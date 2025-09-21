// ===== AUTH HANDLER ===== 
document.addEventListener('DOMContentLoaded', function() {
    initAuthHandler();
});

// Configuration des rôles et permissions
const USER_ROLES = {
    user: {
        level: 1,
        permissions: ['view_documents', 'upload_documents', 'pay_documents'],
        dashboardUrl: 'index.html',
        title: 'Utilisateur'
    },
    checker: {
        level: 2,
        permissions: ['view_documents', 'validate_documents', 'reject_documents'],
        dashboardUrl: 'agent-dashboard.html',
        title: 'Checker'
    },
    agent: {
        level: 3,
        permissions: ['manage_users', 'view_analytics', 'customer_support'],
        dashboardUrl: 'checker-dashboard.html',
        title: 'Agent'
    },
    admin: {
        level: 4,
        permissions: ['full_access', 'system_config', 'user_management'],
        dashboardUrl: 'admin.html',
        title: 'Administrateur'
    }
};

// Comptes de démonstration
const DEMO_ACCOUNTS = {
    user: {
        email: 'user@certicam.com',
        password: 'user123',
        profile: {
            firstName: 'Coco',
            lastName: 'Utilisateur',
            phone: '699009900',
            avatar: 'img/coco-profile.jpg'
        }
    },
    checker: {
        email: 'checker@certicam.com',
        password: 'checker123',
        profile: {
            firstName: 'Marie',
            lastName: 'Checker',
            phone: '677889900',
            avatar: 'img/coco-profile.jpg'
        }
    },
    agent: {
        email: 'agent@certicam.com',
        password: 'agent123',
        profile: {
            firstName: 'Paul',
            lastName: 'Agent',
            phone: '655443322',
            avatar: 'img/coco-profile.jpg'
        }
    },
    admin: {
        email: 'admin@certicam.com',
        password: 'admin123',
        profile: {
            firstName: 'Rico',
            lastName: 'Tangana',
            phone: '699123456',
            avatar: 'img/coco-profile.jpg'
        }
    }
};

class AuthHandler {
    constructor() {
        this.currentForm = 'login';
        this.isLoading = false;
        this.initializeElements();
        this.attachEventListeners();
    }

    initializeElements() {
        // Forms
        this.loginForm = document.getElementById('login-form');
        this.registerForm = document.getElementById('register-form');
        this.resetForm = document.getElementById('reset-form');
        
        // Modals
        this.twofaModal = document.getElementById('twofa-modal');
        this.successModal = document.getElementById('success-modal');
        
        // Form elements
        this.loginFormElement = document.getElementById('login');
        this.registerFormElement = document.getElementById('register');
        this.resetFormElement = document.getElementById('reset-password');
    }

    attachEventListeners() {
        // Form submissions
        this.loginFormElement?.addEventListener('submit', (e) => this.handleLogin(e));
        this.registerFormElement?.addEventListener('submit', (e) => this.handleRegister(e));
        this.resetFormElement?.addEventListener('submit', (e) => this.handleResetPassword(e));

        // Form switching
        document.getElementById('show-register')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchForm('register');
        });

        document.getElementById('show-login')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchForm('login');
        });

        document.getElementById('back-to-login')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchForm('login');
        });

        document.getElementById('forgot-password-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchForm('reset');
        });

        // Password toggles
        document.querySelectorAll('.password-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => this.togglePassword(e));
        });

        // Demo account buttons
        document.querySelectorAll('.demo-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleDemoLogin(e));
        });

        // Password strength
        document.getElementById('register-password')?.addEventListener('input', (e) => {
            this.updatePasswordStrength(e.target.value);
        });

        // 2FA inputs
        document.querySelectorAll('.twofa-digit').forEach((input, index) => {
            input.addEventListener('input', (e) => this.handle2FAInput(e, index));
            input.addEventListener('keydown', (e) => this.handle2FAKeydown(e, index));
        });

        // 2FA actions
        document.getElementById('verify-code')?.addEventListener('click', () => this.verify2FACode());
        document.getElementById('resend-code')?.addEventListener('click', () => this.resend2FACode());
    }

    switchForm(formType) {
        // Hide all forms
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
        });

        // Show target form
        const targetForm = document.getElementById(`${formType}-form`);
        if (targetForm) {
            setTimeout(() => {
                targetForm.classList.add('active');
            }, 100);
        }

        this.currentForm = formType;
    }

    async handleLogin(e) {
        e.preventDefault();
        if (this.isLoading) return;

        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        const remember = formData.get('remember');

        if (!this.validateEmail(email)) {
            this.showNotification('Adresse email invalide', 'error');
            return;
        }

        this.setLoading(e.target, true);

        try {
            const loginResult = await this.authenticateUser(email, password);
            
            if (loginResult.success) {
                if (loginResult.requiresTwoFA) {
                    this.show2FAModal();
                } else {
                    await this.completeLogin(loginResult.user, remember);
                }
            } else {
                this.showNotification(loginResult.message || 'Identifiants incorrects', 'error');
            }
        } catch (error) {
            this.showNotification('Erreur de connexion. Veuillez réessayer.', 'error');
            console.error('Login error:', error);
        } finally {
            this.setLoading(e.target, false);
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        if (this.isLoading) return;

        const formData = new FormData(e.target);
        const userData = {
            firstName: formData.get('firstname'),
            lastName: formData.get('lastname'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            password: formData.get('password'),
            confirm: formData.get('confirm')
        };

        // Validation
        if (!this.validateRegistration(userData)) {
            return;
        }

        this.setLoading(e.target, true);

        try {
            const registerResult = await this.registerUser(userData);
            
            if (registerResult.success) {
                this.showNotification('Compte créé avec succès ! Vérifiez votre email.', 'success');
                this.switchForm('login');
                
                // Pre-fill login form
                document.getElementById('login-email').value = userData.email;
            } else {
                this.showNotification(registerResult.message || 'Erreur lors de la création du compte', 'error');
            }
        } catch (error) {
            this.showNotification('Erreur lors de l\'inscription. Veuillez réessayer.', 'error');
            console.error('Registration error:', error);
        } finally {
            this.setLoading(e.target, false);
        }
    }

    async handleResetPassword(e) {
        e.preventDefault();
        if (this.isLoading) return;

        const formData = new FormData(e.target);
        const email = formData.get('email');

        if (!this.validateEmail(email)) {
            this.showNotification('Adresse email invalide', 'error');
            return;
        }

        this.setLoading(e.target, true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            this.showNotification('Lien de réinitialisation envoyé par email', 'success');
            this.switchForm('login');
        } catch (error) {
            this.showNotification('Erreur lors de l\'envoi. Veuillez réessayer.', 'error');
        } finally {
            this.setLoading(e.target, false);
        }
    }

    async handleDemoLogin(e) {
        const role = e.currentTarget.dataset.role;
        const demoAccount = DEMO_ACCOUNTS[role];
        
        if (!demoAccount) return;

        // Fill login form
        document.getElementById('login-email').value = demoAccount.email;
        document.getElementById('login-password').value = demoAccount.password;

        // Auto-submit
        const loginEvent = new Event('submit', { bubbles: true });
        this.loginFormElement.dispatchEvent(loginEvent);
    }

    async authenticateUser(email, password) {
        // Check demo accounts
        for (const [role, account] of Object.entries(DEMO_ACCOUNTS)) {
            if (account.email === email && account.password === password) {
                return {
                    success: true,
                    user: {
                        email,
                        role,
                        profile: account.profile,
                        permissions: USER_ROLES[role].permissions
                    },
                    requiresTwoFA: false // Demo accounts skip 2FA
                };
            }
        }

        // Simulate API authentication
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
            success: false,
            message: 'Identifiants incorrects'
        };
    }

    async registerUser(userData) {
        // Simulate API registration
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Check if email already exists (demo)
        const emailExists = Object.values(DEMO_ACCOUNTS).some(account => 
            account.email === userData.email
        );

        if (emailExists) {
            return {
                success: false,
                message: 'Cette adresse email est déjà utilisée'
            };
        }

        return {
            success: true,
            message: 'Compte créé avec succès'
        };
    }

    async completeLogin(user, remember = false) {
        // Store session
        SessionManager.createSession(user, remember);
        
        // Show success modal
        this.showSuccessModal();

        // Redirect after animation
        setTimeout(() => {
            const roleConfig = USER_ROLES[user.role];
            window.location.href = roleConfig.dashboardUrl;
        }, 2000);
    }

    show2FAModal() {
        this.twofaModal.style.display = 'flex';
        this.start2FATimer();
        
        // Focus first input
        const firstInput = this.twofaModal.querySelector('.twofa-digit[data-index="0"]');
        if (firstInput) {
            firstInput.focus();
        }
    }

    hide2FAModal() {
        this.twofaModal.style.display = 'none';
        this.stop2FATimer();
        
        // Clear inputs
        document.querySelectorAll('.twofa-digit').forEach(input => {
            input.value = '';
            input.classList.remove('filled');
        });
    }

    showSuccessModal() {
        this.successModal.style.display = 'flex';
    }

    handle2FAInput(e, index) {
        const input = e.target;
        const value = input.value.replace(/[^0-9]/g, '');
        
        if (value.length > 1) {
            input.value = value.slice(0, 1);
            return;
        }
        
        input.value = value;
        
        if (value) {
            input.classList.add('filled');
            // Move to next input
            if (index < 5) {
                const nextInput = document.querySelector(`.twofa-digit[data-index="${index + 1}"]`);
                if (nextInput) nextInput.focus();
            }
        } else {
            input.classList.remove('filled');
        }

        // Auto-verify if all digits filled
        this.checkAutoVerify2FA();
    }

    handle2FAKeydown(e, index) {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
            const prevInput = document.querySelector(`.twofa-digit[data-index="${index - 1}"]`);
            if (prevInput) {
                prevInput.focus();
                prevInput.value = '';
                prevInput.classList.remove('filled');
            }
        }
    }

    checkAutoVerify2FA() {
        const digits = Array.from(document.querySelectorAll('.twofa-digit')).map(input => input.value);
        if (digits.every(digit => digit.length === 1)) {
            setTimeout(() => this.verify2FACode(), 300);
        }
    }

    async verify2FACode() {
        const digits = Array.from(document.querySelectorAll('.twofa-digit')).map(input => input.value);
        const code = digits.join('');
        
        if (code.length !== 6) {
            this.showNotification('Code incomplet', 'error');
            return;
        }

        // Simulate verification
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Demo: accept code "123456"
        if (code === '123456') {
            this.hide2FAModal();
            // Complete login would happen here
            this.showNotification('Code vérifié avec succès', 'success');
        } else {
            this.showNotification('Code incorrect', 'error');
            // Clear inputs
            document.querySelectorAll('.twofa-digit').forEach(input => {
                input.value = '';
                input.classList.remove('filled');
            });
            document.querySelector('.twofa-digit[data-index="0"]').focus();
        }
    }

    async resend2FACode() {
        await new Promise(resolve => setTimeout(resolve, 500));
        this.showNotification('Code renvoyé par SMS', 'info');
        this.start2FATimer();
    }

    start2FATimer() {
        let timeLeft = 120; // 2 minutes
        const timerElement = document.getElementById('timer');
        
        this.twofaInterval = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (timeLeft <= 0) {
                this.stop2FATimer();
                this.hide2FAModal();
                this.showNotification('Code expiré. Veuillez vous reconnecter.', 'warning');
            }
            
            timeLeft--;
        }, 1000);
    }

    stop2FATimer() {
        if (this.twofaInterval) {
            clearInterval(this.twofaInterval);
            this.twofaInterval = null;
        }
    }

    togglePassword(e) {
        const button = e.currentTarget;
        const targetId = button.dataset.target;
        const input = document.getElementById(targetId);
        const icon = button.querySelector('i');
        
        if (!input || !icon) return;
        
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        icon.className = isPassword ? 'fi fi-rr-eye-crossed' : 'fi fi-rr-eye';
    }

    updatePasswordStrength(password) {
        const strengthFill = document.querySelector('.strength-fill');
        const strengthText = document.querySelector('.strength-text');
        
        if (!strengthFill || !strengthText) return;
        
        const strength = this.calculatePasswordStrength(password);
        
        strengthFill.className = `strength-fill ${strength.class}`;
        strengthText.textContent = strength.text;
    }

    calculatePasswordStrength(password) {
        if (password.length < 6) {
            return { class: 'weak', text: 'Mot de passe faible' };
        }
        
        let score = 0;
        if (password.length >= 8) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        
        if (score <= 2) return { class: 'weak', text: 'Mot de passe faible' };
        if (score === 3) return { class: 'fair', text: 'Mot de passe correct' };
        if (score === 4) return { class: 'good', text: 'Mot de passe fort' };
        return { class: 'strong', text: 'Mot de passe très fort' };
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validateRegistration(userData) {
        if (!userData.firstName.trim()) {
            this.showNotification('Le prénom est requis', 'error');
            return false;
        }

        if (!userData.lastName.trim()) {
            this.showNotification('Le nom est requis', 'error');
            return false;
        }

        if (!this.validateEmail(userData.email)) {
            this.showNotification('Adresse email invalide', 'error');
            return false;
        }

        if (!userData.phone.trim()) {
            this.showNotification('Le numéro de téléphone est requis', 'error');
            return false;
        }

        if (userData.password.length < 6) {
            this.showNotification('Le mot de passe doit contenir au moins 6 caractères', 'error');
            return false;
        }

        if (userData.password !== userData.confirm) {
            this.showNotification('Les mots de passe ne correspondent pas', 'error');
            return false;
        }

        if (!document.getElementById('accept-terms').checked) {
            this.showNotification('Vous devez accepter les conditions d\'utilisation', 'error');
            return false;
        }

        return true;
    }

    setLoading(form, loading) {
        this.isLoading = loading;
        const submitBtn = form.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnSpinner = submitBtn.querySelector('.btn-spinner');
        
        if (loading) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            btnText.style.opacity = '0';
            btnSpinner.style.display = 'block';
        } else {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            btnText.style.opacity = '1';
            btnSpinner.style.display = 'none';
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fi fi-rr-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add styles if not present
        this.ensureNotificationStyles();

        // Add to page
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    ensureNotificationStyles() {
        if (document.getElementById('notification-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 16px 20px;
                border-radius: 8px;
                box-shadow: none;
                z-index: 10000;
                transform: translateX(100%);
                opacity: 0;
                transition: all 0.3s ease;
                max-width: 400px;
            }
            .notification.show {
                transform: translateX(0);
                opacity: 1;
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
                color: white;
                font-weight: 500;
            }
            .notification-success { background: #10B981; }
            .notification-error { background: #EF4444; }
            .notification-warning { background: #F59E0B; }
            .notification-info { background: #3B82F6; }
        `;
        document.head.appendChild(styles);
    }
}

// Session Manager Integration
class SessionManager {
    static createSession(user, remember = false) {
        const sessionData = {
            user,
            timestamp: Date.now(),
            expires: remember ? Date.now() + (30 * 24 * 60 * 60 * 1000) : Date.now() + (24 * 60 * 60 * 1000)
        };

        if (remember) {
            localStorage.setItem('certicam_session', JSON.stringify(sessionData));
        } else {
            sessionStorage.setItem('certicam_session', JSON.stringify(sessionData));
        }

        // Set user context for other scripts
        window.CerticamUser = user;
    }

    static getSession() {
        const stored = localStorage.getItem('certicam_session') || sessionStorage.getItem('certicam_session');
        if (!stored) return null;

        try {
            const session = JSON.parse(stored);
            if (Date.now() > session.expires) {
                this.clearSession();
                return null;
            }
            return session;
        } catch {
            this.clearSession();
            return null;
        }
    }

    static clearSession() {
        localStorage.removeItem('certicam_session');
        sessionStorage.removeItem('certicam_session');
        delete window.CerticamUser;
    }

    static isAuthenticated() {
        return this.getSession() !== null;
    }

    static hasPermission(permission) {
        const session = this.getSession();
        return session?.user?.permissions?.includes(permission) || false;
    }

    static hasRole(role) {
        const session = this.getSession();
        return session?.user?.role === role;
    }
}

// Initialize
function initAuthHandler() {
    new AuthHandler();
}

// Global auth functions
window.AuthHandler = AuthHandler;
window.SessionManager = SessionManager;
