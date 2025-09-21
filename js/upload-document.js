// Upload Document JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initUploadDocument();
});

let uploadDocument = {
    niuValue: '',
    isValidating: false
};

function initUploadDocument() {
    // Attacher les événements
    attachEventListeners();
    
    // Initialiser la logique des champs NIU
    initNiuInputs();
    
    // Animer l'entrée des éléments
    setTimeout(() => {
        document.querySelector('.upload-section').style.opacity = '1';
    }, 100);
}

function attachEventListeners() {
    const cancelBtn = document.getElementById('cancel-btn');
    const submitBtn = document.getElementById('submit-btn');
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', handleCancel);
    }
    
    if (submitBtn) {
        submitBtn.addEventListener('click', handleSubmit);
    }
}

function initNiuInputs() {
    const niuInputs = document.querySelectorAll('.niu-digit');
    
    niuInputs.forEach((input, index) => {
        // Animation d'entrée échelonnée
        input.style.animationDelay = `${0.6 + (index * 0.05)}s`;
        input.style.animation = 'slideInStagger 0.4s ease-out both';
        
        // Événement de saisie
        input.addEventListener('input', function(e) {
            let value = e.target.value.toUpperCase();
            
            // Valider le caractère (lettres et chiffres uniquement)
            if (!/^[0-9A-Z]$/.test(value) && value !== '') {
                e.target.value = '';
                e.target.classList.add('error');
                setTimeout(() => e.target.classList.remove('error'), 400);
                return;
            }
            
            e.target.value = value;
            
            // Ajouter classe de réussite
            if (value) {
                e.target.classList.add('filled', 'success');
                e.target.classList.remove('error');
            } else {
                e.target.classList.remove('filled', 'success');
            }
            
            // Passer au champ suivant si un caractère valide est saisi
            if (value && index < niuInputs.length - 1) {
                niuInputs[index + 1].focus();
                // Animation de remplissage
                document.querySelector('.niu-input-container').classList.add('filling');
                setTimeout(() => {
                    document.querySelector('.niu-input-container').classList.remove('filling');
                }, 300);
            }
            
            // Mettre à jour l'état du bouton Envoyer
            updateSubmitButton();
        });
        
        // Événement de suppression (backspace)
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace') {
                if (!e.target.value && index > 0) {
                    niuInputs[index - 1].focus();
                    niuInputs[index - 1].value = '';
                    niuInputs[index - 1].classList.remove('filled', 'success');
                } else if (e.target.value) {
                    setTimeout(() => {
                        e.target.classList.remove('filled', 'success');
                    }, 10);
                }
            }
            
            // Support des flèches
            if (e.key === 'ArrowLeft' && index > 0) {
                e.preventDefault();
                niuInputs[index - 1].focus();
            }
            if (e.key === 'ArrowRight' && index < niuInputs.length - 1) {
                e.preventDefault();
                niuInputs[index + 1].focus();
            }
        });
        
        // Événement de collage
        input.addEventListener('paste', function(e) {
            e.preventDefault();
            const pasteData = e.clipboardData.getData('text').toUpperCase();
            
            // Répartir les caractères sur les champs
            for (let i = 0; i < Math.min(pasteData.length, niuInputs.length - index); i++) {
                if (/^[0-9A-Z]$/.test(pasteData[i])) {
                    niuInputs[index + i].value = pasteData[i];
                    niuInputs[index + i].classList.add('filled', 'success');
                }
            }
            
            // Focuser le prochain champ vide ou le dernier
            const nextEmptyIndex = Array.from(niuInputs).findIndex((input, i) => i > index && !input.value);
            if (nextEmptyIndex !== -1) {
                niuInputs[nextEmptyIndex].focus();
            } else {
                niuInputs[niuInputs.length - 1].focus();
            }
            
            // Animation de remplissage pour le collage
            document.querySelector('.niu-input-container').classList.add('filling');
            setTimeout(() => {
                document.querySelector('.niu-input-container').classList.remove('filling');
            }, 300);
            
            updateSubmitButton();
        });
        
        // Sélectionner le contenu au focus
        input.addEventListener('focus', function(e) {
            setTimeout(() => e.target.select(), 10);
        });
    });
}

function updateSubmitButton() {
    const niuInputs = document.querySelectorAll('.niu-digit');
    const submitBtn = document.getElementById('submit-btn');
    
    // Vérifier si tous les champs sont remplis
    const allFilled = Array.from(niuInputs).every(input => input.value.trim() !== '');
    
    if (submitBtn) {
        submitBtn.disabled = !allFilled;
    }
    
    // Construire la valeur NIU
    uploadDocument.niuValue = Array.from(niuInputs).map(input => input.value).join('');
}

function handleCancel() {
    console.log('Annulation de l\'ajout de document...');
    
    // Retourner au dashboard
    if (confirm('Êtes-vous sûr de vouloir annuler ? Les données saisies seront perdues.')) {
        window.location.href = 'checker-dashboard.html';
    }
}

function handleSubmit() {
    if (uploadDocument.isValidating) return;
    
    console.log('Soumission du NIU:', uploadDocument.niuValue);
    
    if (uploadDocument.niuValue.length !== 13) {
        showNotification('Veuillez saisir un NIU complet (13 caractères)', 'error');
        
        // Mettre en évidence les champs vides
        const niuInputs = document.querySelectorAll('.niu-digit');
        niuInputs.forEach(input => {
            if (!input.value) {
                input.classList.add('error');
                setTimeout(() => input.classList.remove('error'), 400);
            }
        });
        return;
    }
    
    // Simuler la validation du NIU
    validateNiu(uploadDocument.niuValue);
}

function validateNiu(niu) {
    const submitBtn = document.getElementById('submit-btn');
    uploadDocument.isValidating = true;
    
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        submitBtn.textContent = 'Vérification...';
    }
    
    // Simuler un délai de validation
    setTimeout(() => {
        // Pour la démo, on considère que le NIU est valide
        const isValid = Math.random() > 0.2; // 80% de chance d'être valide
        
        uploadDocument.isValidating = false;
        
        if (submitBtn) {
            submitBtn.classList.remove('loading');
        }
        
        if (isValid) {
            showNotification('NIU validé avec succès !', 'success');
            
            // Marquer tous les champs comme valides
            const niuInputs = document.querySelectorAll('.niu-digit');
            niuInputs.forEach(input => {
                input.classList.add('success');
                input.classList.remove('error');
            });
            
            // Rediriger vers la prochaine étape (à définir)
            setTimeout(() => {
                // Pour l'instant, retourner au dashboard avec un message de succès
                sessionStorage.setItem('documentUploadSuccess', 'true');
                window.location.href = 'checker-dashboard.html';
            }, 2000);
        } else {
            showNotification('NIU invalide. Veuillez vérifier et réessayer.', 'error');
            
            // Marquer tous les champs comme en erreur
            const niuInputs = document.querySelectorAll('.niu-digit');
            niuInputs.forEach((input, index) => {
                setTimeout(() => {
                    input.classList.add('error');
                    setTimeout(() => input.classList.remove('error'), 400);
                }, index * 50);
            });
            
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Envoyer';
            }
            
            // Focuser le premier champ pour recommencer
            setTimeout(() => {
                document.querySelector('.niu-digit').focus();
            }, 500);
        }
    }, 1500);
}

function showNotification(message, type = 'info') {
    // Supprimer les notifications existantes
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    // Créer une notification moderne
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#00d4aa' : type === 'error' ? '#dc3545' : '#6c757d'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        z-index: 10000;
        font-size: 14px;
        font-weight: 500;
        max-width: 300px;
        word-wrap: break-word;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        animation: slideInNotification 0.3s ease-out;
        display: flex;
        align-items: center;
        gap: 8px;
    `;
    
    // Ajouter une icône selon le type
    const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
    notification.innerHTML = `<span style="font-size: 16px;">${icon}</span> ${message}`;
    
    document.body.appendChild(notification);
    
    // Supprimer après 5 secondes avec animation
    setTimeout(() => {
        notification.style.animation = 'slideOutNotification 0.3s ease-in forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Styles CSS pour les animations de notification
if (!document.querySelector('#notification-styles')) {
    const styles = document.createElement('style');
    styles.id = 'notification-styles';
    styles.textContent = `
        @keyframes slideInNotification {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutNotification {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(styles);
}