// Email Verification JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Load user email from registration data
    const registrationData = sessionStorage.getItem('registration_data');
    if (registrationData) {
        const data = JSON.parse(registrationData);
        const emailElement = document.getElementById('user-email');
        if (emailElement && data.email) {
            emailElement.textContent = data.email;
        }
    }
});

function checkEmail() {
    // User confirms they checked their email - redirect to continue registration
    window.location.href = 'complete-registration.html';
}

function resendEmail() {
    // Simulate resending verification email
    const registrationData = sessionStorage.getItem('registration_data');
    if (registrationData) {
        const data = JSON.parse(registrationData);
        console.log('Resending verification email to:', data.email);
        
        // Show feedback to user
        const countdownElement = document.getElementById('countdown');
        if (countdownElement) {
            countdownElement.textContent = 'Email renvoyé avec succès !';
            countdownElement.style.color = 'var(--color-success)';
            
            setTimeout(() => {
                countdownElement.textContent = '';
                countdownElement.style.color = '';
            }, 3000);
        }
    }
}