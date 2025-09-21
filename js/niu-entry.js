// NIU Entry JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('.niu-input');
    const form = document.getElementById('niu-form');
    const cancelBtn = document.querySelector('.btn-cancel');
    const submitBtn = document.querySelector('.btn-submit');

    // Mark pre-filled inputs as filled
    inputs.forEach(input => {
        if (input.value) {
            input.classList.add('filled');
        }
    });

    // Handle input navigation
    inputs.forEach((input, index) => {
        input.addEventListener('input', function(e) {
            const value = e.target.value.toUpperCase();
            
            // Only allow alphanumeric characters
            if (!/^[A-Z0-9]$/.test(value)) {
                e.target.value = '';
                e.target.classList.remove('filled');
                return;
            }

            e.target.value = value;
            e.target.classList.add('filled');

            // Move to next input
            if (value && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });

        input.addEventListener('keydown', function(e) {
            // Handle backspace
            if (e.key === 'Backspace') {
                if (!e.target.value && index > 0) {
                    inputs[index - 1].focus();
                    inputs[index - 1].value = '';
                    inputs[index - 1].classList.remove('filled');
                } else {
                    e.target.value = '';
                    e.target.classList.remove('filled');
                }
            }
            
            // Handle arrow keys
            if (e.key === 'ArrowLeft' && index > 0) {
                inputs[index - 1].focus();
            }
            if (e.key === 'ArrowRight' && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });

        input.addEventListener('focus', function() {
            this.select();
        });
    });

    // Handle paste
    document.addEventListener('paste', function(e) {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').toUpperCase().replace(/[^A-Z0-9]/g, '');
        
        if (pastedData.length <= 13) {
            pastedData.split('').forEach((char, index) => {
                if (inputs[index]) {
                    inputs[index].value = char;
                    inputs[index].classList.add('filled');
                }
            });
            
            // Focus last filled input
            if (pastedData.length < 13) {
                inputs[pastedData.length].focus();
            }
        }
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const niu = Array.from(inputs).map(input => input.value).join('');
        console.log('NIU saisi:', niu);
        
        // Simulate processing
        submitBtn.textContent = 'Envoi en cours...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            // Redirect to upload page
            window.location.href = 'document-upload.html';
        }, 1000);
    });

    // Cancel button
    cancelBtn.addEventListener('click', function() {
        window.location.href = 'dashboard.html';
    });
});