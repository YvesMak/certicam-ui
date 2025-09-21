// Email Verification JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Load user email from registration data
    const registrationData = sessionStorage.getItem('registration_data');
    if (registrationData) {
        const data = JSON.parse(registrationData);
        const emailElement = document.getElementById('user-email');
        if (emailElement) {
            emailElement.textContent = data.email;
        }
    }

    // Auto-redirect after 10 seconds for demo
    let countdown = 10;
    const countdownElement = document.getElementById('countdown');
    
    if (countdownElement) {
        const updateCountdown = () => {
            countdownElement.textContent = `Redirection automatique dans ${countdown} secondes...`;
            countdown--;
            
            if (countdown < 0) {
                window.location.href = 'complete-registration.html';
            }
        };
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
    } else {
        // Fallback if no countdown element
        setTimeout(() => {
            window.location.href = 'complete-registration.html';
        }, 10000);
    }
});

function checkEmail() {
    // Simulate checking email - redirect to continue registration
    window.location.href = 'complete-registration.html';
}

function resendEmail() {
    // Simulate resending verification email
    console.log('Resending verification email...');
    alert('Un nouveau email de vérification a été envoyé !');
}