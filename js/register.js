/**
 * Register Page JavaScript - Certicam - Modern Implementation
 * Advanced form validation, UX patterns, and accessibility
 * Based on login.js with register-specific features
 */

class RegisterForm {
    constructor() {
        this.form = document.getElementById('register-form');
        this.submitBtn = document.querySelector('.register-btn');
        
        // Validation rules
        this.validationRules = {
            firstname: { required: true, minLength: 2 },
            lastname: { required: true, minLength: 2 },
            email: { required: true, type: 'email' },
            terms: { required: true, type: 'checkbox' }
        };

        this.init();
    }

    init() {
        if (!this.form || !this.submitBtn) {
            console.error('Register form elements not found');
            return;
        }

        this.clearFormFields();
        this.bindEvents();
        this.setupAccessibility();
        this.addLoadingStates();
        this.setupErrorIconClick();
    }

    clearFormFields() {
        // Clear all form fields to prevent browser auto-fill issues
        const inputs = this.form.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.value = '';
            input.classList.remove('error', 'valid');
            input.dataset.touched = 'false';
            input.dataset.hasTyped = 'false';
            input.setAttribute('aria-invalid', 'false');
        });

        // Clear error messages
        const errorMessages = this.form.querySelectorAll('.error-message');
        errorMessages.forEach(msg => {
            msg.style.display = 'none';
        });

        // Reset checkbox
        const termsCheckbox = document.getElementById('terms');
        if (termsCheckbox) {
            termsCheckbox.checked = false;
        }
    }

    bindEvents() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Input validation
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

        // Terms checkbox
        const termsCheckbox = document.getElementById('terms');
        if (termsCheckbox) {
            termsCheckbox.addEventListener('change', () => {
                this.validateField(termsCheckbox);
            });
        }
    }

    setupErrorIconClick() {
        const formGroups = document.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            const input = group.querySelector('.form-input');
            if (input) {
                input.addEventListener('click', (e) => {
                    const inputRect = input.getBoundingClientRect();
                    const clickX = e.clientX;
                    
                    // Plus de champs password, donc utilisation simple
                    const iconStartX = inputRect.right - 20;
                    const iconEndX = inputRect.right - 4;
                    
                    if (clickX >= iconStartX && clickX <= iconEndX && input.classList.contains('error')) {
                        input.value = '';
                        input.classList.remove('error', 'valid');
                        delete input.dataset.touched;
                        delete input.dataset.hasTyped;
                        
                        const errorMsg = group.querySelector('.error-message');
                        if (errorMsg) {
                            errorMsg.style.display = 'none';
                        }
                        
                        input.focus();
                        e.preventDefault();
                        e.stopPropagation();
                    }
                });
            }
        });
    }

    handleInputBlur(input) {
        input.dataset.touched = 'true';
        
        const hasContent = input.value.trim().length > 0;
        const hasTypedAndHasContent = input.dataset.hasTyped === 'true' && hasContent;
        
        if (hasContent || hasTypedAndHasContent) {
            this.validateField(input);
        }
        
        input.closest('.form-group').classList.remove('focused');
    }

    debounceValidation(input) {
        if (input.validationTimeout) {
            clearTimeout(input.validationTimeout);
        }
        
        if (input.dataset.hasTyped === 'true' && input.value.trim().length > 0) {
            input.validationTimeout = setTimeout(() => {
                this.validateFieldRealTime(input);
            }, 300);
        }
    }

    setupAccessibility() {
        const inputs = this.form.querySelectorAll('.form-input');
        inputs.forEach(input => {
            const errorDiv = document.getElementById(`${input.id}-error`);
            if (errorDiv) {
                input.setAttribute('aria-describedby', `${input.id}-error`);
                errorDiv.setAttribute('aria-live', 'polite');
            }
        });

        const firstInput = this.form.querySelector('.form-input');
        if (firstInput && !document.activeElement.classList.contains('form-input')) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }

    addLoadingStates() {
        this.submitBtn.dataset.originalText = this.submitBtn.textContent;
    }

    handleInputFocus(input) {
        input.closest('.form-group').classList.add('focused');
        input.dataset.touched = 'true';
    }

    validateFieldRealTime(input) {
        if (input.dataset.hasTyped === 'true' && input.value.trim().length > 0) {
            this.validateField(input, false);
        }
    }

    validateField(input, showErrors = true) {
        const value = input.value.trim();
        const fieldName = input.name;
        const rules = this.validationRules[fieldName];
        
        if (!rules) return true;

        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (rules.required) {
            if (rules.type === 'checkbox') {
                if (!input.checked) {
                    isValid = false;
                    errorMessage = 'Vous devez accepter les conditions d\'utilisation';
                }
            } else if (value.length === 0) {
                if (input.dataset.hasTyped === 'true' && showErrors) {
                    isValid = false;
                    errorMessage = this.getRequiredMessage(fieldName);
                } else {
                    this.clearFieldError(input);
                    return true;
                }
            }
        }

        // Type-specific validation
        if (isValid && value.length > 0) {
            switch (rules.type) {
                case 'email':
                    if (!this.isValidEmail(value)) {
                        isValid = false;
                        errorMessage = 'Veuillez saisir une adresse email valide';
                    }
                    break;
            }

            // Length validation
            if (rules.minLength && value.length < rules.minLength) {
                isValid = false;
                errorMessage = `Ce champ doit contenir au moins ${rules.minLength} caractères`;
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
            firstname: 'Le prénom est requis',
            lastname: 'Le nom est requis',
            email: 'L\'adresse email est requise'
        };
        return messages[fieldName] || 'Ce champ est requis';
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    setFieldValid(input) {
        input.classList.remove('error');
        input.classList.add('valid');
        input.setAttribute('aria-invalid', 'false');
        this.clearFieldError(input);
    }

    setFieldError(input, message) {
        input.classList.remove('valid');
        input.classList.add('error');
        input.setAttribute('aria-invalid', 'true');
        
        const errorDiv = document.getElementById(`${input.id}-error`);
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    }

    clearFieldError(input) {
        const errorDiv = document.getElementById(`${input.id}-error`);
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    }

    clearAllErrors() {
        const errorDivs = this.form.querySelectorAll('.error-message');
        errorDivs.forEach(div => {
            div.style.display = 'none';
        });

        const inputs = this.form.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.classList.remove('error', 'valid');
            input.setAttribute('aria-invalid', 'false');
        });
    }

    validateForm() {
        let isValid = true;
        const inputs = this.form.querySelectorAll('.form-input, input[type="checkbox"]');
        
        inputs.forEach(input => {
            if (!this.validateField(input, true)) {
                isValid = false;
            }
        });

        return isValid;
    }

    async handleSubmit(e) {
        e.preventDefault();

        this.clearAllErrors();

        if (!this.validateForm()) {
            this.focusFirstError();
            return;
        }

        this.setLoadingState(true);

        try {
            await this.processRegistration();
        } catch (error) {
            this.handleRegistrationError(error);
        } finally {
            this.setLoadingState(false);
        }
    }

    async processRegistration() {
        // Simulate registration process
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const emailInput = document.getElementById('email');
                const email = emailInput.value.trim();

                // Simulate email already exists check
                if (email === 'demo@user.com' || email === 'demo@admin.com') {
                    reject(new Error('EMAIL_EXISTS'));
                    return;
                }

                // Success
                resolve();
                this.handleRegistrationSuccess();
            }, 2000);
        });
    }

    handleRegistrationSuccess() {
        // Show success message
        this.showSuccessMessage();
        
        // Redirect after delay
        setTimeout(() => {
            window.location.href = 'email-verification.html';
        }, 2000);
    }

    handleRegistrationError(error) {
        if (error.message === 'EMAIL_EXISTS') {
            const emailInput = document.getElementById('email');
            this.setFieldError(emailInput, 'Cette adresse email est déjà utilisée');
            emailInput.focus();
        } else {
            this.showGenericError();
        }
    }

    showSuccessMessage() {
        const demoNote = document.querySelector('.demo-note');
        if (demoNote) {
            demoNote.innerHTML = `
                <p><i class="fi fi-rr-check"></i> Inscription réussie ! Redirection en cours...</p>
            `;
            demoNote.style.background = 'var(--color-success-50)';
            demoNote.style.borderColor = 'var(--color-success-200)';
            demoNote.querySelector('p').style.color = 'var(--color-success-700)';
            demoNote.querySelector('i').style.color = 'var(--color-success-600)';
        }
    }

    showGenericError() {
        const demoNote = document.querySelector('.demo-note');
        if (demoNote) {
            demoNote.innerHTML = `
                <p><i class="fi fi-rr-cross"></i> Une erreur est survenue. Veuillez réessayer.</p>
            `;
            demoNote.style.background = 'var(--color-error-50)';
            demoNote.style.borderColor = 'var(--color-error-200)';
            demoNote.querySelector('p').style.color = 'var(--color-error-700)';
            demoNote.querySelector('i').style.color = 'var(--color-error-600)';
        }
    }

    focusFirstError() {
        const firstErrorInput = this.form.querySelector('.form-input.error');
        if (firstErrorInput) {
            firstErrorInput.focus();
        }
    }

    setLoadingState(loading) {
        if (loading) {
            this.submitBtn.disabled = true;
            this.submitBtn.classList.add('loading');
            this.submitBtn.textContent = '';
        } else {
            this.submitBtn.disabled = false;
            this.submitBtn.classList.remove('loading');
            this.submitBtn.textContent = this.submitBtn.dataset.originalText || 'Créer mon compte';
        }
    }
}

// Initialize form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RegisterForm();
});
