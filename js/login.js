/**
 * Login Page JavaScript - Certicam
 * Modern UX with enhanced interactions and accessibility
 */

class LoginForm {
    constructor() {
        this.form = document.getElementById('login-form');
        this.submitBtn = document.querySelector('.login-btn');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.rememberCheckbox = document.getElementById('remember');
        
        this.demoAccounts = {
            'demo@user.com': {
                password: 'user123',
                role: 'user',
                redirect: 'index.html'
            },
            'demo@admin.com': {
                password: 'admin123',
                role: 'admin',
                redirect: 'admin.html'
            },
            'demo@agent.com': {
                password: 'agent123',
                role: 'agent',
                redirect: 'agent-dashboard.html'
            },
            'demo@checker.com': {
                password: 'checker123',
                role: 'checker',
                redirect: 'checker-dashboard.html'
            }
        };
        
        this.init();
    }

    init() {
        if (!this.form) {
            console.error('Login form not found');
            return;
        }

        this.bindEvents();
        this.setupDemoAccounts();
        this.setupAccessibility();
        this.loadRememberedData();
        this.addLoadingStates();
    }

    bindEvents() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation with better UX logic
        const inputs = this.form.querySelectorAll('.form-input');
        inputs.forEach(input => {
            // Track if user has interacted with this field
            input.dataset.touched = 'false';
            input.dataset.hasTyped = 'false';
            
            // Only validate on blur if user has typed something
            input.addEventListener('blur', () => this.handleInputBlur(input));
            
            // Real-time validation with debouncing (only after first interaction)
            input.addEventListener('input', () => {
                // Check if field is completely empty after user interaction
                if (input.value.trim().length === 0) {
                    // User cleared the field - reset typing state to avoid blur validation
                    input.dataset.hasTyped = 'false';
                    this.clearFieldError(input);
                } else {
                    // User is typing content - mark as typed
                    input.dataset.hasTyped = 'true';
                    this.clearFieldError(input);
                    this.debounceValidation(input);
                }
            });
            
            input.addEventListener('focus', () => this.handleInputFocus(input));
        });

        // Enhanced password toggle
        this.setupPasswordToggle();
        
        // Error icon click functionality
        this.setupErrorIconClick();
        
        // Remember me functionality
        if (this.rememberCheckbox) {
            this.rememberCheckbox.addEventListener('change', () => this.handleRememberChange());
        }
    }

    handleInputBlur(input) {
        input.dataset.touched = 'true';
        
        // Only validate on blur if field has content OR if user has typed and still has content
        // This prevents validation on empty fields that were cleared by user
        const hasContent = input.value.trim().length > 0;
        const hasTypedAndHasContent = input.dataset.hasTyped === 'true' && hasContent;
        
        if (hasContent || hasTypedAndHasContent) {
            this.validateField(input);
        }
        
        // Remove focus state
        input.closest('.form-group').classList.remove('focused');
    }

    debounceValidation(input) {
        // Clear any existing timeout
        if (input.validationTimeout) {
            clearTimeout(input.validationTimeout);
        }
        
        // Only validate in real-time if user has typed and field has content
        if (input.dataset.hasTyped === 'true' && input.value.trim().length > 0) {
            input.validationTimeout = setTimeout(() => {
                this.validateFieldRealTime(input);
            }, 300);
        }
    }

    setupAccessibility() {
        // Add ARIA labels for screen readers
        const inputs = this.form.querySelectorAll('.form-input');
        inputs.forEach(input => {
            const errorDiv = document.getElementById(`${input.id}-error`);
            if (errorDiv) {
                input.setAttribute('aria-describedby', `${input.id}-error`);
                errorDiv.setAttribute('aria-live', 'polite');
            }
        });

        // Focus management
        const firstInput = this.form.querySelector('.form-input');
        if (firstInput && !document.activeElement.classList.contains('form-input')) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }

    addLoadingStates() {
        // Enhanced loading states with better UX
        this.submitBtn.dataset.originalText = this.submitBtn.textContent;
    }

    setupPasswordToggle() {
        const toggleBtn = document.querySelector('.password-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // Prevent event bubbling
                this.togglePassword();
            });
            toggleBtn.setAttribute('aria-label', 'Afficher le mot de passe');
        }
    }

    setupErrorIconClick() {
        // Error icon click to clear functionality
        const formGroups = document.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            const input = group.querySelector('.form-input');
            if (input) {
                // Add click listener to the input area for error clearing
                input.addEventListener('click', (e) => {
                    // Check if click is on the error icon area (right side of input)
                    const inputRect = input.getBoundingClientRect();
                    const clickX = e.clientX;
                    
                    // Check if this is a password field by looking for password-container
                    const passwordContainer = input.closest('.password-container');
                    const isPasswordField = passwordContainer !== null;
                    
                    // Calculate icon position based on field type
                    let iconStartX, iconEndX;
                    if (isPasswordField) {
                        // Password field: error icon is positioned before the eye icon
                        iconStartX = inputRect.right - 56;
                        iconEndX = inputRect.right - 36;
                    } else {
                        // Regular field: error icon is 24px from right
                        iconStartX = inputRect.right - 24;
                        iconEndX = inputRect.right - 4;
                    }
                    
                    // If clicked on error icon area and field has error
                    if (clickX >= iconStartX && clickX <= iconEndX && input.classList.contains('error')) {
                        // Clear the field
                        input.value = '';
                        // Reset validation states completely
                        input.classList.remove('error', 'valid');
                        delete input.dataset.touched;
                        delete input.dataset.hasTyped;
                        // Clear error message
                        const errorMsg = group.querySelector('.error-message');
                        if (errorMsg) {
                            errorMsg.style.display = 'none';
                        }
                        // Focus the input
                        input.focus();
                        e.preventDefault();
                        e.stopPropagation();
                    }
                });
            }
        });
    }

    togglePassword() {
        const passwordInput = document.getElementById('password');
        const toggleIcon = document.getElementById('toggle-icon');
        const toggleBtn = document.querySelector('.password-toggle');
        
        if (passwordInput && toggleIcon) {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleIcon.className = 'fi fi-rr-eye-crossed';
                if (toggleBtn) toggleBtn.setAttribute('aria-label', 'Masquer le mot de passe');
            } else {
                passwordInput.type = 'password';
                toggleIcon.className = 'fi fi-rr-eye';
                if (toggleBtn) toggleBtn.setAttribute('aria-label', 'Afficher le mot de passe');
            }
        }
    }

    handleInputFocus(input) {
        // Add focus ring animation
        input.closest('.form-group').classList.add('focused');
        
        // Mark as touched when user focuses (for accessibility)
        input.dataset.touched = 'true';
    }

    validateFieldRealTime(input) {
        // Only validate if user has started typing and field has content
        if (input.dataset.hasTyped === 'true' && input.value.trim().length > 0) {
            this.validateField(input, false); // Silent validation (no aggressive error display)
        }
    }

    validateField(input, showErrors = true) {
        const value = input.value.trim();
        const fieldName = input.name;
        let isValid = true;
        let errorMessage = '';

        // Only validate if field has content or if it's required and user has actually typed something
        if (value.length === 0) {
            if (input.hasAttribute('required') && input.dataset.hasTyped === 'true' && showErrors) {
                isValid = false;
                errorMessage = this.getRequiredMessage(fieldName);
            } else {
                // Clear any existing errors if field is empty and user hasn't typed yet
                this.clearFieldError(input);
                return true;
            }
        } else {
            // Validate content only if there's something to validate
            switch (fieldName) {
                case 'email':
                    if (!this.isValidEmail(value)) {
                        isValid = false;
                        errorMessage = 'Veuillez saisir une adresse email valide';
                    }
                    break;
                case 'password':
                    if (value.length < 6) {
                        isValid = false;
                        errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
                    }
                    break;
            }
        }

        // Apply validation result
        if (isValid) {
            this.setFieldValid(input);
        } else if (showErrors) {
            this.setFieldError(input, errorMessage);
        }

        return isValid;
    }

    getRequiredMessage(fieldName) {
        const messages = {
            email: 'L\'adresse email est requise',
            password: 'Le mot de passe est requis'
        };
        return messages[fieldName] || 'Ce champ est requis';
    }

    setFieldError(input, message) {
        const errorDiv = document.getElementById(`${input.id}-error`);
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
        
        input.classList.remove('valid');
        input.classList.add('error');
        input.setAttribute('aria-invalid', 'true');
    }

    setFieldValid(input) {
        const errorDiv = document.getElementById(`${input.id}-error`);
        if (errorDiv) {
            errorDiv.style.display = 'none';
            errorDiv.textContent = '';
        }
        
        input.classList.remove('error');
        input.classList.add('valid');
        input.setAttribute('aria-invalid', 'false');
    }

    clearFieldError(input) {
        const errorDiv = document.getElementById(`${input.id}-error`);
        if (errorDiv) {
            errorDiv.style.display = 'none';
            errorDiv.textContent = '';
        }
        
        input.classList.remove('error', 'valid');
        input.setAttribute('aria-invalid', 'false');
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    loadRememberedData() {
        if (localStorage.getItem('rememberLogin') === 'true') {
            const savedEmail = localStorage.getItem('savedEmail');
            if (savedEmail && this.emailInput) {
                this.emailInput.value = savedEmail;
                this.rememberCheckbox.checked = true;
            }
        }
    }

    handleRememberChange() {
        if (!this.rememberCheckbox.checked) {
            localStorage.removeItem('rememberLogin');
            localStorage.removeItem('savedEmail');
        }
    }

    setupDemoAccounts() {
        const demoBtns = document.querySelectorAll('.demo-btn');
        demoBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const email = btn.dataset.email;
                const password = btn.dataset.password;
                const redirect = btn.dataset.redirect;
                
                this.fillDemoAccount(email, password, redirect);
            });
        });
    }

    fillDemoAccount(email, password, redirect = null) {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        
        if (emailInput && passwordInput) {
            emailInput.value = email;
            passwordInput.value = password;
            
            // Store redirect URL for later use
            if (redirect) {
                this.tempRedirect = redirect;
            }
            
            // Clear any existing errors
            this.clearAllErrors();
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const formData = this.getFormData();
        
        // Clear previous errors
        this.clearAllErrors();
        
        // Validate form
        if (!this.validateForm(formData)) {
            return;
        }
        
        // Start loading state
        this.setLoadingState(true);
        
        // Process authentication
        this.processAuthentication(formData);
    }

    getFormData() {
        return {
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value
        };
    }

    validateForm(data) {
        let hasErrors = false;
        
        if (!data.email) {
            this.showError('email', 'L\'adresse email est requise');
            hasErrors = true;
        } else if (!this.isValidEmail(data.email)) {
            this.showError('email', 'Adresse email invalide');
            hasErrors = true;
        }
        
        if (!data.password) {
            this.showError('password', 'Le mot de passe est requis');
            hasErrors = true;
        } else if (data.password.length < 6) {
            this.showError('password', 'Le mot de passe doit contenir au moins 6 caractères');
            hasErrors = true;
        }
        
        return !hasErrors;
    }

    validateField(input) {
        const fieldId = input.id;
        const value = input.value.trim();
        
        switch (fieldId) {
            case 'email':
                if (!value) {
                    this.showError(fieldId, 'L\'adresse email est requise');
                    return false;
                } else if (!this.isValidEmail(value)) {
                    this.showError(fieldId, 'Adresse email invalide');
                    return false;
                }
                break;
            case 'password':
                if (!value) {
                    this.showError(fieldId, 'Le mot de passe est requis');
                    return false;
                } else if (value.length < 6) {
                    this.showError(fieldId, 'Le mot de passe doit contenir au moins 6 caractères');
                    return false;
                }
                break;
        }
        
        this.clearFieldError(input);
        return true;
    }

    processAuthentication(formData) {
        setTimeout(() => {
            // Check demo accounts first
            const demoAccount = this.demoAccounts[formData.email];
            
            if (demoAccount && demoAccount.password === formData.password) {
                this.handleSuccessfulLogin(demoAccount, formData.email);
                return;
            }
            
            // If not a demo account, show invalid credentials error
            this.showError('password', 'Email ou mot de passe incorrect');
            this.setLoadingState(false);
        }, 1500);
    }

    handleSuccessfulLogin(account, email) {
        // Store user session
        this.storeUserSession({
            email: email,
            role: account.role,
            loginTime: Date.now()
        });
        
        // Show success feedback
        this.showSuccessFeedback();
        
        // Use tempRedirect if available (from demo button), otherwise use account redirect
        const redirectUrl = this.tempRedirect || account.redirect;
        
        // Redirect after short delay
        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 1000);
        
        // Clear tempRedirect after use
        this.tempRedirect = null;
    }

    storeUserSession(userData) {
        sessionStorage.setItem('user_session', JSON.stringify(userData));
        localStorage.setItem('last_login', userData.email);
    }

    showSuccessFeedback() {
        this.submitBtn.textContent = 'Connexion réussie !';
        this.submitBtn.style.background = '#00c36c';
    }

    showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorDiv = document.getElementById(fieldId + '-error');
        
        if (field && errorDiv) {
            field.classList.add('error');
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    }

    clearFieldError(input) {
        const fieldId = input.id;
        const errorDiv = document.getElementById(fieldId + '-error');
        
        input.classList.remove('error');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    }

    clearAllErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        const inputFields = document.querySelectorAll('.form-input');
        
        errorMessages.forEach(msg => {
            msg.style.display = 'none';
        });
        
        inputFields.forEach(input => {
            input.classList.remove('error');
        });
    }

    setLoadingState(isLoading) {
        if (isLoading) {
            this.submitBtn.classList.add('loading');
            this.submitBtn.textContent = 'Connexion en cours...';
            this.submitBtn.disabled = true;
        } else {
            this.submitBtn.classList.remove('loading');
            this.submitBtn.textContent = 'Se connecter';
            this.submitBtn.disabled = false;
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// Initialize the login form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LoginForm();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LoginForm;
}
