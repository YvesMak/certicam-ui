// NIU Entry JavaScript - UX améliorée
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('.niu-input');
    const form = document.getElementById('niu-form');
    const cancelBtn = document.querySelector('.btn-cancel');
    const submitBtn = document.querySelector('.btn-submit');

    // Focus automatique sur le premier champ
    if (inputs.length > 0) {
        inputs[0].focus();
    }

    // Fonction pour mettre à jour l'état du bouton submit
    function updateSubmitButton() {
        const allFilled = Array.from(inputs).every(input => input.value.trim() !== '');
        submitBtn.disabled = !allFilled;
        
        if (allFilled) {
            submitBtn.classList.add('ready');
        } else {
            submitBtn.classList.remove('ready');
        }
    }

    // Fonction pour valider un caractère
    function isValidCharacter(char, index) {
        // Premier caractère : lettre uniquement
        if (index === 0) {
            return /^[A-Z]$/.test(char);
        }
        // Autres caractères : alphanumériques
        return /^[A-Z0-9]$/.test(char);
    }

    // Gestion avancée des inputs
    inputs.forEach((input, index) => {
        // Animation d'entrée échelonnée
        input.style.animationDelay = `${index * 0.05}s`;
        input.classList.add('animate-in');

        input.addEventListener('input', function(e) {
            const value = e.target.value.toUpperCase();
            
            // Validation du caractère
            if (value && !isValidCharacter(value, index)) {
                e.target.value = '';
                e.target.classList.remove('filled');
                e.target.classList.add('error');
                
                // Supprimer la classe error après l'animation
                setTimeout(() => {
                    e.target.classList.remove('error');
                }, 400);
                
                updateSubmitButton();
                return;
            }

            e.target.value = value;
            
            if (value) {
                e.target.classList.add('filled');
                e.target.classList.remove('error');
                
                // Animation de succès
                e.target.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    e.target.style.transform = '';
                }, 150);
            } else {
                e.target.classList.remove('filled');
            }

            updateSubmitButton();

            // Navigation automatique
            if (value && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });

        // Gestion améliorée du clavier
        input.addEventListener('keydown', function(e) {
            // Handle backspace avec navigation intelligente
            if (e.key === 'Backspace') {
                if (!e.target.value && index > 0) {
                    e.preventDefault();
                    inputs[index - 1].focus();
                    inputs[index - 1].value = '';
                    inputs[index - 1].classList.remove('filled');
                    updateSubmitButton();
                } else if (e.target.value) {
                    e.target.value = '';
                    e.target.classList.remove('filled');
                    updateSubmitButton();
                }
            }
            
            // Navigation avec les flèches
            if (e.key === 'ArrowLeft' && index > 0) {
                e.preventDefault();
                inputs[index - 1].focus();
            }
            if (e.key === 'ArrowRight' && index < inputs.length - 1) {
                e.preventDefault();
                inputs[index + 1].focus();
            }
            
            // Navigation avec Tab améliorée
            if (e.key === 'Tab') {
                e.preventDefault();
                if (e.shiftKey) {
                    // Shift+Tab: précédent
                    if (index > 0) {
                        inputs[index - 1].focus();
                    }
                } else {
                    // Tab: suivant
                    if (index < inputs.length - 1) {
                        inputs[index + 1].focus();
                    } else {
                        // Dernier champ, focus sur le bouton submit si prêt
                        if (!submitBtn.disabled) {
                            submitBtn.focus();
                        }
                    }
                }
            }

            // Entrée pour soumettre
            if (e.key === 'Enter' && !submitBtn.disabled) {
                e.preventDefault();
                submitBtn.click();
            }
        });

        // Sélection automatique au focus
        input.addEventListener('focus', function() {
            this.select();
            this.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            this.classList.remove('focused');
        });
    });

    // Gestion améliorée du collage
    document.addEventListener('paste', function(e) {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').toUpperCase().replace(/[^A-Z0-9]/g, '');
        
        if (pastedData.length <= 13) {
            // Animation de collage
            inputs.forEach(input => input.classList.add('pasting'));
            
            setTimeout(() => {
                pastedData.split('').forEach((char, index) => {
                    if (inputs[index] && isValidCharacter(char, index)) {
                        inputs[index].value = char;
                        inputs[index].classList.add('filled');
                        
                        // Animation échelonnée
                        setTimeout(() => {
                            inputs[index].style.transform = 'scale(1.1)';
                            setTimeout(() => {
                                inputs[index].style.transform = '';
                            }, 100);
                        }, index * 50);
                    }
                });
                
                // Nettoyage
                setTimeout(() => {
                    inputs.forEach(input => input.classList.remove('pasting'));
                    updateSubmitButton();
                }, pastedData.length * 50 + 200);
            }, 100);
        }
    });

    // Initialisation
    updateSubmitButton();

    // Gestion de la soumission du formulaire
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const niu = Array.from(inputs).map(input => input.value).join('');
        console.log('NIU saisi:', niu);
        
        // Validation finale
        if (niu.length !== 13) {
            inputs.forEach(input => {
                if (!input.value) {
                    input.classList.add('error');
                }
            });
            return;
        }
        
        // Animation de soumission
        submitBtn.textContent = 'Envoi en cours...';
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        
        // Simulation du traitement
        setTimeout(() => {
            // Redirection vers la page d'upload
            window.location.href = 'document-upload.html';
        }, 1500);
    });

    // Bouton d'annulation
    cancelBtn.addEventListener('click', function() {
        window.location.href = 'agent-dashboard.html';
    });
});