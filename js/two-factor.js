/**
 * Two-Factor Authentication Page JavaScript - Certicam
 * Handles 6-digit code input, validation, and verification
 */

class TwoFactorAuth {
    constructor() {
        this.codeInputs = document.querySelectorAll('.code-input');
        this.verifyBtn = document.querySelector('.verify-btn');
        this.resendBtn = document.querySelector('.resend-btn');
        this.timerElement = document.querySelector('.timer');
        
        this.currentCode = '';
        this.resendTimer = 60;
        this.resendInterval = null;
        
        // Valid codes for demo
        this.validCodes = ['123456', '000000', '111111'];
        
        this.init();
    }

    init() {
        if (!this.codeInputs.length) {
            console.error('Code inputs not found');
            return;
        }

        this.bindEvents();
        this.startResendTimer();
        this.focusFirstInput();
        this.displayUserEmail();
    }

    bindEvents() {
        // Code input events
        this.codeInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => this.handleInput(e, index));
            input.addEventListener('keydown', (e) => this.handleKeydown(e, index));
            input.addEventListener('paste', (e) => this.handlePaste(e));
            input.addEventListener('focus', () => input.select());
        });

        // Form submission
        const form = document.getElementById('two-factor-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // Resend button
        if (this.resendBtn) {
            this.resendBtn.addEventListener('click', () => this.handleResend());
        }
    }

    displayUserEmail() {
        const userEmailElement = document.querySelector('.user-email');
        if (userEmailElement) {
            // Try to get email from session storage
            const registrationData = sessionStorage.getItem('registration_data');
            if (registrationData) {
                const data = JSON.parse(registrationData);
                userEmailElement.textContent = data.email;
            } else {
                userEmailElement.textContent = 'votre email';
            }
        }
    }

    handleInput(e, index) {
        const input = e.target;
        const value = input.value.replace(/[^0-9]/g, ''); // Only numbers
        
        if (value.length > 1) {
            input.value = value[0];
        } else {
            input.value = value;
        }

        // Visual feedback
        this.updateInputState(input, value);
        
        // Move to next input
        if (value && index < this.codeInputs.length - 1) {
            this.codeInputs[index + 1].focus();
        }
        
        // Update current code and check if complete
        this.updateCurrentCode();
    }

    handleKeydown(e, index) {
        // Backspace: move to previous input if current is empty
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
            this.codeInputs[index - 1].focus();
        }
        
        // Arrow keys navigation
        if (e.key === 'ArrowLeft' && index > 0) {
            e.preventDefault();
            this.codeInputs[index - 1].focus();
        }
        
        if (e.key === 'ArrowRight' && index < this.codeInputs.length - 1) {
            e.preventDefault();
            this.codeInputs[index + 1].focus();
        }
        
        // Enter: submit if code is complete
        if (e.key === 'Enter' && this.currentCode.length === 6) {
            e.preventDefault();
            this.handleSubmit(e);
        }
    }

    handlePaste(e) {
        e.preventDefault();
        const pastedText = (e.clipboardData || window.clipboardData).getData('text');
        const numbers = pastedText.replace(/[^0-9]/g, '');
        
        if (numbers.length === 6) {
            // Fill all inputs with the pasted code
            this.codeInputs.forEach((input, index) => {
                input.value = numbers[index] || '';
                this.updateInputState(input, input.value);
            });
            
            this.updateCurrentCode();
            
            // Focus last input
            this.codeInputs[5].focus();
        }
    }

    updateInputState(input, value) {
        input.classList.remove('filled', 'error');
        
        if (value) {
            input.classList.add('filled');
        }
    }

    updateCurrentCode() {
        this.currentCode = Array.from(this.codeInputs)
            .map(input => input.value)
            .join('');
        
        // Enable/disable verify button
        if (this.verifyBtn) {
            this.verifyBtn.disabled = this.currentCode.length !== 6;
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        if (this.currentCode.length !== 6) {
            this.showError('Veuillez saisir les 6 chiffres du code de vérification');
            return;
        }
        
        this.setLoadingState(true);
        this.clearErrors();
        
        // Simulate verification
        this.processVerification();
    }

    processVerification() {
        setTimeout(() => {
            if (this.validCodes.includes(this.currentCode)) {
                this.handleSuccessfulVerification();
            } else {
                this.handleFailedVerification();
            }
        }, 1500);
    }

    handleSuccessfulVerification() {
        // Store verification success
        sessionStorage.setItem('two_factor_verified', 'true');
        
        // Show success feedback
        this.showSuccess();
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    }

    handleFailedVerification() {
        this.setLoadingState(false);
        this.showError('Code de vérification incorrect. Veuillez réessayer.');
        this.shakeInputs();
        this.clearCode();
    }

    showSuccess() {
        if (this.verifyBtn) {
            this.verifyBtn.textContent = 'Vérification réussie !';
            this.verifyBtn.style.background = '#00c36c';
        }
    }

    showError(message) {
        const errorDiv = document.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    }

    clearErrors() {
        const errorDiv = document.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    }

    shakeInputs() {
        this.codeInputs.forEach(input => {
            input.classList.add('error');
            setTimeout(() => input.classList.remove('error'), 500);
        });
    }

    clearCode() {
        this.codeInputs.forEach(input => {
            input.value = '';
            this.updateInputState(input, '');
        });
        this.currentCode = '';
        this.focusFirstInput();
    }

    focusFirstInput() {
        if (this.codeInputs.length > 0) {
            this.codeInputs[0].focus();
        }
    }

    handleResend() {
        if (this.resendBtn.disabled) return;
        
        // Simulate resending code
        this.showResendFeedback();
        this.startResendTimer();
    }

    showResendFeedback() {
        const originalText = this.resendBtn.textContent;
        this.resendBtn.textContent = 'Code envoyé !';
        
        setTimeout(() => {
            this.resendBtn.textContent = originalText;
        }, 2000);
    }

    startResendTimer() {
        this.resendTimer = 60;
        this.resendBtn.disabled = true;
        
        this.updateTimerDisplay();
        
        this.resendInterval = setInterval(() => {
            this.resendTimer--;
            this.updateTimerDisplay();
            
            if (this.resendTimer <= 0) {
                this.stopResendTimer();
            }
        }, 1000);
    }

    stopResendTimer() {
        if (this.resendInterval) {
            clearInterval(this.resendInterval);
            this.resendInterval = null;
        }
        
        this.resendBtn.disabled = false;
        this.timerElement.style.display = 'none';
    }

    updateTimerDisplay() {
        if (this.timerElement) {
            if (this.resendTimer > 0) {
                this.timerElement.textContent = `Renvoyer dans ${this.resendTimer}s`;
                this.timerElement.style.display = 'block';
            } else {
                this.timerElement.style.display = 'none';
            }
        }
    }

    setLoadingState(isLoading) {
        if (isLoading) {
            this.verifyBtn.classList.add('loading');
            this.verifyBtn.textContent = 'Vérification...';
            this.verifyBtn.disabled = true;
        } else {
            this.verifyBtn.classList.remove('loading');
            this.verifyBtn.textContent = 'Vérifier';
            this.verifyBtn.disabled = this.currentCode.length !== 6;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TwoFactorAuth();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TwoFactorAuth;
}
